import type { ConnectionState, RealTimeClient } from '@decartai/sdk';
import type { LiveTryOnConfig } from '../types/liveTryon';
export async function decartCameraConstraints(modelName: LiveTryOnConfig['model']): Promise<MediaStreamConstraints> {
  const { models } = await import('@decartai/sdk');
  const model = models.realtime(modelName);
  return { audio: false, video: { facingMode: 'user', width: { ideal: model.width }, height: { ideal: model.height }, frameRate: model.fps } };
}
export async function connectDecart(stream: MediaStream, config: LiveTryOnConfig, garment: Blob, token: () => Promise<string>, onRemote: (stream: MediaStream) => void, onChange: (state: ConnectionState) => void): Promise<RealTimeClient> {
  const { createDecartClient, models, noopLogger } = await import('@decartai/sdk');
  const client = createDecartClient({ apiKeyProvider: token, logger: noopLogger, telemetry: false });
  return client.realtime.connect(stream, {
    model: models.realtime(config.model), mirror: true, retries: 0, capacityRetryBudgetMs: 0,
    initialState: { image: garment, prompt: { text: config.prompt, enhance: false } },
    onRemoteStream: onRemote, onConnectionChange: onChange,
  });
}
