import { describe, expect, it, vi } from 'vitest';
import { createDecartClient } from '@decartai/sdk';
import { connectDecart, decartCameraConstraints } from './decartStream';
vi.mock('@decartai/sdk', () => ({ createDecartClient: vi.fn(() => ({ realtime: { connect: vi.fn().mockResolvedValue({}) } })), models: { realtime: vi.fn(() => ({ name: 'lucy-vton-3.6', width: 1280, height: 720, fps: 25 })) }, noopLogger: {} }));
describe('official Decart SDK adapter', () => {
  it('supplies the reference image before the first frame, without microphone or automatic redials', async () => {
    const constraints = await decartCameraConstraints('lucy-vton-3.6');
    expect(constraints.audio).toBe(false);
    const stream = {} as MediaStream, garment = new Blob(['garment']);
    const token = vi.fn(async () => 'ek_test');
    await connectDecart(stream, { available: true, provider: 'Decart', model: 'lucy-vton-3.6', session_seconds: 120, requires_sign_in: true, garment_image: '/images/shirt.webp', prompt: 'Wear this shirt' }, garment, token, vi.fn(), vi.fn());
    expect(createDecartClient).toHaveBeenCalledWith(expect.objectContaining({ apiKeyProvider: token, telemetry: false }));
    const connect = vi.mocked(createDecartClient).mock.results[0].value.realtime.connect;
    expect(connect).toHaveBeenCalledWith(stream, expect.objectContaining({ retries: 0, mirror: true, initialState: { image: garment, prompt: { text: 'Wear this shirt', enhance: false } } }));
  });
});
