import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RealTimeClient } from '@decartai/sdk';
import { useDecartTryOn } from './useDecartTryOn';
import { liveTryOnService } from '../../services/liveTryOnService';
import { connectDecart, decartCameraConstraints } from '../../services/decartStream';
vi.mock('../../services/liveTryOnService', () => ({ liveTryOnService: { config: vi.fn(), garment: vi.fn(), token: vi.fn() } }));
vi.mock('../../services/decartStream', () => ({ connectDecart: vi.fn(), decartCameraConstraints: vi.fn() }));
const config = { available: true, provider: 'Decart', model: 'lucy-vton-3.6' as const, session_seconds: 10, requires_sign_in: true, garment_image: '/images/shirt.webp', prompt: 'Wear the selected shirt' };
const localStop = vi.fn(), remoteStop = vi.fn(), disconnect = vi.fn(), on = vi.fn(), off = vi.fn();
const local = { getTracks: () => [{ stop: localStop }], getVideoTracks: () => [{ addEventListener: vi.fn() }] } as unknown as MediaStream;
const remote = { getTracks: () => [{ stop: remoteStop }] } as unknown as MediaStream;
const connection = { disconnect, on, off } as unknown as RealTimeClient;
beforeEach(() => {
  vi.mocked(liveTryOnService.config).mockResolvedValue(config);
  vi.mocked(liveTryOnService.garment).mockResolvedValue(new Blob(['garment'], { type: 'image/webp' }));
  vi.mocked(liveTryOnService.token).mockResolvedValue({ apiKey: 'ek_ephemeral_test_only', expiresAt: 'test' });
  vi.mocked(decartCameraConstraints).mockResolvedValue({ video: true, audio: false });
  vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(local) } });
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.mocked(connectDecart).mockImplementation(async (_stream, _config, _image, token, onRemote) => { await token(); onRemote(remote); return connection; });
});
afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); vi.unstubAllGlobals(); });
async function ready() {
  const hook = renderHook(() => useDecartTryOn(239, 1));
  hook.result.current.outputRef.current = document.createElement('video');
  await waitFor(() => expect(hook.result.current.config?.available).toBe(true));
  return hook;
}
describe('Decart live camera sessions', () => {
  it('does not access camera or provider before explicit consent', async () => {
    const { result } = await ready();
    await act(async () => result.current.start(false));
    expect(result.current.error).toContain('Agree');
    expect(liveTryOnService.garment).not.toHaveBeenCalled();
    expect(connectDecart).not.toHaveBeenCalled();
  });
  it('connects with the selected garment and releases local/remote tracks on Stop', async () => {
    const { result } = await ready();
    await act(async () => result.current.start(true));
    expect(result.current.phase).toBe('streaming');
    expect(liveTryOnService.token).toHaveBeenCalledWith(239, expect.any(AbortSignal));
    expect(connectDecart).toHaveBeenCalledWith(local, config, expect.any(Blob), expect.any(Function), expect.any(Function), expect.any(Function));
    // A repeated callback for the same MediaStream must not stop that stream.
    await act(async () => vi.mocked(connectDecart).mock.calls[0][4](remote));
    expect(remoteStop).not.toHaveBeenCalled();
    act(() => result.current.stop());
    expect(localStop).toHaveBeenCalled(); expect(remoteStop).toHaveBeenCalled(); expect(disconnect).toHaveBeenCalled();
    expect(result.current.outputRef.current?.srcObject).toBeNull();
  });
  it('releases permission responses that arrive after unmount', async () => {
    let resolve: (stream: MediaStream) => void = () => {};
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn(() => new Promise<MediaStream>(done => { resolve = done; })) } });
    const { result, unmount } = await ready();
    act(() => { void result.current.start(true); });
    await waitFor(() => expect(result.current.phase).toBe('permission'));
    unmount();
    await act(async () => resolve(local));
    expect(localStop).toHaveBeenCalled(); expect(connectDecart).not.toHaveBeenCalled();
  });
  it('disconnects an SDK connection that resolves after cancellation', async () => {
    let resolve: (value: RealTimeClient) => void = () => {};
    vi.mocked(connectDecart).mockImplementation(() => new Promise(done => { resolve = done; }));
    const { result } = await ready();
    act(() => { void result.current.start(true); void result.current.start(true); });
    await waitFor(() => expect(connectDecart).toHaveBeenCalledTimes(1));
    act(() => result.current.stop());
    await act(async () => resolve(connection));
    expect(disconnect).toHaveBeenCalled(); expect(localStop).toHaveBeenCalled();
    expect(result.current.phase).toBe('stopped');
  });
  it('ends the session at its time limit', async () => {
    const { result } = await ready();
    vi.useFakeTimers();
    await act(async () => result.current.start(true));
    act(() => { vi.advanceTimersByTime(10001); });
    expect(result.current.phase).toBe('stopped'); expect(disconnect).toHaveBeenCalled(); expect(localStop).toHaveBeenCalled();
  });
  it('stops on a hidden tab and cleans up event subscriptions', async () => {
    const { result } = await ready();
    await act(async () => result.current.start(true));
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(disconnect).toHaveBeenCalled(); expect(off).toHaveBeenCalledTimes(2);
    expect(result.current.active).toBe(false);
  });
  it('does not request a camera when provider access is unconfigured', async () => {
    vi.mocked(liveTryOnService.config).mockResolvedValue({ ...config, available: false });
    const { result } = renderHook(() => useDecartTryOn(239, 1));
    await waitFor(() => expect(result.current.config).not.toBeNull());
    await act(async () => result.current.start(true));
    expect(liveTryOnService.garment).not.toHaveBeenCalled();
  });
});
