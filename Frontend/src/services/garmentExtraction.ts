import { TRY_ON } from '../constants/tryon';
import type { GarmentExtraction, GarmentExtractionReply, GarmentExtractionRequest } from '../types/tryon';

export async function extractGarment(image: HTMLCanvasElement, signal?: AbortSignal): Promise<GarmentExtraction> {
  const frame = await createImageBitmap(image);
  if (signal?.aborted) { frame.close(); throw new DOMException('Cancelled', 'AbortError'); }
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try { worker = new Worker(new URL('../workers/garment.worker.ts', import.meta.url), { type: 'module' }); }
    catch (error) { frame.close(); reject(error); return; }
    const cleanup = () => { clearTimeout(timer); signal?.removeEventListener('abort', abort); worker.terminate(); };
    const fail = () => { cleanup(); reject(new Error('Garment extraction failed.')); };
    const abort = () => { cleanup(); reject(new DOMException('Cancelled', 'AbortError')); };
    const timer = setTimeout(fail, TRY_ON.startupTimeout);
    signal?.addEventListener('abort', abort, { once: true });
    worker.onerror = fail;
    worker.onmessage = (event: MessageEvent<GarmentExtractionReply>) => {
      cleanup();
      if (event.data.kind === 'result') resolve(event.data.result);
      else reject(new Error('Garment extraction failed.'));
    };
    const request: GarmentExtractionRequest = { frame, model: new URL(TRY_ON.model, window.location.href).href, clothingModel: new URL(TRY_ON.clothingModel, window.location.href).href };
    try { worker.postMessage(request, [frame]); } catch { frame.close(); fail(); }
  });
}
