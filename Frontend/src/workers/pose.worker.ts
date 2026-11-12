import { PoseLandmarker } from '@mediapipe/tasks-vision';
import loader from '@mediapipe/tasks-vision/vision_wasm_module_internal.js?url';
import binary from '@mediapipe/tasks-vision/vision_wasm_module_internal.wasm?url';
import { TRY_ON } from '../constants/tryon';
import type { TrackingRequest, TrackingReply } from '../types/tryon';
let tracker: PoseLandmarker | undefined;
const reply = (value: TrackingReply, transfer: Transferable[] = []) => postMessage(value, { transfer });
self.onmessage = async (event: MessageEvent<TrackingRequest>) => {
  const request = event.data;
  try {
    if (request.kind === 'init') {
      tracker = await PoseLandmarker.createFromOptions({ wasmLoaderPath: loader, wasmBinaryPath: binary }, {
        baseOptions: { modelAssetPath: request.model }, runningMode: 'VIDEO', numPoses: 1,
        minPoseDetectionConfidence: TRY_ON.confidence, minPosePresenceConfidence: TRY_ON.confidence, minTrackingConfidence: TRY_ON.confidence,
      });
      reply({ kind: 'ready' });
    } else {
      let transferred = false;
      try {
        const points = tracker?.detectForVideo(request.frame, request.timestamp).landmarks[0] ?? [];
        reply({ kind: 'pose', points, frame: request.frame }, [request.frame]);
        transferred = true;
      } finally { if (!transferred) request.frame.close(); }
    }
  } catch {
    reply({ kind: 'error', message: 'On-device body tracking could not start. Retry in an up-to-date browser, or use manual placement.' });
  }
};
