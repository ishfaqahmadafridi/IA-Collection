import { ImageSegmenter, PoseLandmarker } from '@mediapipe/tasks-vision';
import loader from '@mediapipe/tasks-vision/vision_wasm_module_internal.js?url';
import binary from '@mediapipe/tasks-vision/vision_wasm_module_internal.wasm?url';
import type { GarmentExtractionReply, GarmentExtractionRequest } from '../types/tryon';

self.onmessage = async (event: MessageEvent<GarmentExtractionRequest>) => {
  const { frame, model, clothingModel } = event.data;
  let pose: PoseLandmarker | undefined;
  let segmenter: ImageSegmenter | undefined;
  try {
    const files = { wasmLoaderPath: loader, wasmBinaryPath: binary };
    pose = await PoseLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: model }, runningMode: 'IMAGE', numPoses: 1 });
    const points = pose.detect(frame).landmarks[0] ?? [];
    segmenter = await ImageSegmenter.createFromOptions({ ...files, wasmLoaderPath: `${loader}?task=garment` }, {
      baseOptions: { modelAssetPath: clothingModel }, runningMode: 'IMAGE', outputCategoryMask: true, outputConfidenceMasks: false,
    });
    segmenter.segment(frame, result => {
      if (!result.categoryMask) throw new Error('No garment mask');
      const mask = { width: result.categoryMask.width, height: result.categoryMask.height, data: result.categoryMask.getAsUint8Array().slice() };
      const reply: GarmentExtractionReply = { kind: 'result', result: { mask, points } };
      self.postMessage(reply, { transfer: [mask.data.buffer] });
    });
  } catch {
    self.postMessage({ kind: 'error' } satisfies GarmentExtractionReply);
  } finally { frame.close(); pose?.close(); segmenter?.close(); }
};
