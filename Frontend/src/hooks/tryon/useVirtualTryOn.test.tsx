import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useVirtualTryOn } from './useVirtualTryOn';
vi.mock('../../utils/tryon/garment', () => ({ loadGarment: vi.fn(async () => document.createElement('canvas')) }));
beforeEach(() => {
  vi.stubGlobal('Worker', class {});
  vi.stubGlobal('createImageBitmap', vi.fn());
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe('camera lifecycle', () => {
  it('requests no camera until started and stops a late stream after unmount', async () => {
    let resolveStream: (stream: MediaStream) => void = () => {};
    const stop = vi.fn();
    const getUserMedia = vi.fn(() => new Promise<MediaStream>(resolve => { resolveStream = resolve; }));
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
    const { result, unmount } = renderHook(() => useVirtualTryOn('/shirt.png'));
    expect(getUserMedia).not.toHaveBeenCalled();
    act(() => result.current.start());
    await waitFor(() => expect(getUserMedia).toHaveBeenCalledWith(expect.objectContaining({ audio: false })));
    unmount();
    await act(async () => { resolveStream({ getTracks: () => [{ stop }] } as unknown as MediaStream); });
    expect(stop).toHaveBeenCalled();
  });
  it('shows permission failure and permits retry', async () => {
    const getUserMedia = vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
    const { result } = renderHook(() => useVirtualTryOn('/shirt.png'));
    act(() => result.current.start());
    await waitFor(() => expect(result.current.error).toContain('permission was denied'));
    expect(result.current.active).toBe(false);
    act(() => result.current.start());
    await waitFor(() => expect(getUserMedia).toHaveBeenCalledTimes(2));
  });
  it.each(['unmount', 'hidden tab'])('releases active camera and worker on %s', async reason => {
    const stop = vi.fn(), terminate = vi.fn();
    const track = { stop, addEventListener: vi.fn() };
    const stream = { getTracks: () => [track], getVideoTracks: () => [track] };
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(stream) } });
    const workerCreated = vi.fn();
    vi.stubGlobal('Worker', class {
      terminate = terminate;
      postMessage = vi.fn();
      constructor() { workerCreated(); }
    });
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const { result, unmount } = renderHook(() => useVirtualTryOn('/shirt.png'));
    result.current.videoRef.current = document.createElement('video');
    result.current.canvasRef.current = document.createElement('canvas');
    act(() => result.current.start());
    await waitFor(() => expect(workerCreated).toHaveBeenCalled());
    if (reason === 'unmount') unmount();
    else {
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    }
    expect(stop).toHaveBeenCalled();
    expect(terminate).toHaveBeenCalled();
  });

  it.each(['tracking stall', 'missing canvas'])('matches portrait dimensions and stops on %s', async failure => {
    const stop = vi.fn(), terminate = vi.fn();
    const track = { stop, addEventListener: vi.fn() };
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [track], getVideoTracks: () => [track] }) } });
    let receive: ((event: MessageEvent) => void) | undefined;
    const initialized = vi.fn();
    let frameTick: FrameRequestCallback | undefined;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frameTick = callback; return 1; });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.stubGlobal('Worker', class {
      terminate = terminate;
      postMessage = initialized;
      set onmessage(callback: (event: MessageEvent) => void) { receive = callback; }
    });
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(failure === 'missing canvas' ? null : { clearRect: vi.fn() } as unknown as CanvasRenderingContext2D);
    const { result } = renderHook(() => useVirtualTryOn('/shirt.png'));
    const video = document.createElement('video');
    Object.defineProperties(video, { videoWidth: { value: 480 }, videoHeight: { value: 640 } });
    result.current.videoRef.current = video;
    result.current.canvasRef.current = document.createElement('canvas');
    act(() => result.current.start());
    await waitFor(() => expect(initialized).toHaveBeenCalled());
    expect(result.current.aspectRatio).toBe('480 / 640');
    expect(result.current.canvasRef.current?.width).toBe(480);
    vi.useFakeTimers();
    act(() => { receive?.(new MessageEvent('message', { data: { kind: 'ready' } })); });
    if (failure === 'tracking stall') {
      act(() => { vi.advanceTimersByTime(10000); });
      expect(result.current.error).toContain('stopped responding');
    } else {
      act(() => { receive?.(new MessageEvent('message', { data: { kind: 'pose', points: [] } })); frameTick?.(performance.now()); });
      expect(result.current.error).toContain('canvas is unavailable');
    }
    expect(stop).toHaveBeenCalled();
    expect(terminate).toHaveBeenCalled();
  });
  it('explains unsupported camera contexts without requesting camera access', async () => {
    vi.stubGlobal('navigator', {});
    const { result } = renderHook(() => useVirtualTryOn('/shirt.png'));
    act(() => result.current.start());
    await waitFor(() => expect(result.current.error).toContain('HTTPS or localhost'));
    expect(result.current.active).toBe(false);
  });

  it('resets size and position without switching the selected placement mode', () => {
    const { result } = renderHook(() => useVirtualTryOn('/shirt.png'));
    act(() => { result.current.setManual(true); result.current.setScale(1.3); result.current.setVerticalOffset(0.2); });
    act(() => { result.current.resetAdjustments(); });
    expect(result.current.scale).toBe(1);
    expect(result.current.verticalOffset).toBe(0);
    expect(result.current.manual).toBe(true);
  });

  it('renders manual preview without Worker or createImageBitmap support', async () => {
    vi.stubGlobal('Worker', undefined);
    vi.stubGlobal('createImageBitmap', undefined);
    const stop = vi.fn(), drawImage = vi.fn();
    const track = { stop, addEventListener: vi.fn() };
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [track], getVideoTracks: () => [track] }) } });
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ clearRect: vi.fn(), save: vi.fn(), translate: vi.fn(), rotate: vi.fn(), drawImage, restore: vi.fn() } as unknown as CanvasRenderingContext2D);
    const { result, unmount } = renderHook(() => useVirtualTryOn('/shirt.png'));
    const video = document.createElement('video');
    Object.defineProperties(video, { videoWidth: { value: 640 }, videoHeight: { value: 480 } });
    result.current.videoRef.current = video;
    result.current.canvasRef.current = document.createElement('canvas');
    act(() => { result.current.setManual(true); result.current.start(); });
    await waitFor(() => expect(drawImage).toHaveBeenCalled());
    expect(result.current.phase).toBe('ready');
    expect(result.current.error).toBe('');
    const before = drawImage.mock.calls.length;
    act(() => result.current.setScale(1.2));
    await waitFor(() => expect(drawImage.mock.calls.length).toBeGreaterThan(before));
    unmount();
    expect(stop).toHaveBeenCalled();
  });

});
