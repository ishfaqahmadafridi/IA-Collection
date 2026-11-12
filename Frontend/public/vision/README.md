# Local camera models

`pose_landmarker_lite.task` is Google's MediaPipe Pose Landmarker Lite float16 model (version 1), distributed under Apache-2.0.

Source: https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task

SHA-256: `59929e1d1ee95287735ddd833b19cf4ac46d29bc7afddbbf6753c459690d574a`

Documentation: https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker

The pinned `@mediapipe/tasks-vision` package supplies the matching loader and WebAssembly assets. Vite bundles those assets locally. Camera frames are processed in a dedicated worker; the application does not send them to a server. The model is fetched only after the shopper starts the camera.

## Clothing categories

`selfie_multiclass_256x256.tflite` is Google's MediaPipe Selfie Multiclass model (256×256, float32, version 1).

Source: https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/1/selfie_multiclass_256x256.tflite

SHA-256: `c6748b1253a99067ef71f7e26ca71096cd449baefa8f101900ea23016507e0e0`

Documentation and categories: https://ai.google.dev/edge/mediapipe/solutions/vision/image_segmenter

Both models run inside the local worker. No generation provider or API key is involved. The segmenter loader has a distinct query string so the SDK re-registers its WASM module factory after creating the pose task.
