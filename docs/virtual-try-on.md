> This free on-device preview is the default product-page flow. The paid [Decart live camera try-on](decart-live-try-on.md) is offered as **Try realistic live preview** only when the backend reports it as configured. The local preview is an approximation, not full clothing replacement.

# Live camera clothing preview

Products whose category has a `try_on_kind` of `top` or `bottom` show **Try it on with your camera**. The kind is set per category (migration `0008` tags existing shirt/kurta/coat and jeans/trousers/pants categories); product names are not used. Start the camera once and the selected catalog garment follows the detected body automatically. There is no image upload, capture/generate step, sign-in requirement, paid generation service or provider API key.

## Rendering

The browser isolates model-worn catalog garments in a short-lived worker using MediaPipe clothing segmentation and the catalog model hip boundary. Skin, face, hair, background and the other upper/lower garment region are removed before cropping. Flat product photos use edge-connected background removal. Ambiguous model photos fail rather than being rendered whole. A separate camera worker runs pose detection only and supplies body landmarks for a deformable garment mesh. Camera frames are not segmented; camera-clothing recoloring was removed because the model groups shirts and coats into the same clothing class. The local mesh still cannot reliably preserve an outer coat while replacing an inner shirt. Use a single visible clothing layer for this approximate preview.

Camera frames and tracking replies are displayed together so the clothing mask does not lag behind a newer raw video frame. Automatic processing is capped at roughly 6.7 requests per second and only one request is in flight. Slower devices can render at a lower rate. Startup downloads local model assets once; the model files are served by the application, not a generation provider.

This is an approximate camera effect, not a photorealistic reconstruction or size measurement. The original outfit's silhouette can remain where material is substituted, and detection mistakes, crossed arms, busy product photos, bulky clothing, side views or low light can cause visible artifacts. Garment cutouts and generic skeleton anchors do not simulate physical fabric. The source catalog photo should show the garment clearly against a plain background.

## Controls and privacy

Scale and vertical-position controls adjust placement; Reset preserves automatic/manual selection. Manual placement works without model downloads or worker support, but it is a fixed overlay and does not mask original clothing. Camera permission requires HTTPS or localhost.

No camera frames are sent to the backend, recorded or saved. Stop, Close, Escape, navigation and hidden tabs release tracks, workers and frame bitmaps. Late frames from an old tracking session are rejected and closed. No new backend endpoints or tables are required.

## Models and validation

Self-hosted MediaPipe Pose Landmarker Lite detects body landmarks. Selfie Multiclass 256x256 distinguishes background, hair, body skin, face skin, clothing and accessories. Clothing is category 4. See the [official segmenter documentation](https://ai.google.dev/edge/mediapipe/solutions/vision/image_segmenter).

Frontend regression tests cover camera lifecycle, mask category isolation, upper/lower garment bounds, triangle transforms, articulated sleeves, pants placement, smoothing and resets. Browser checks should verify actual model initialization, visible clothing replacement on a public person fixture, untouched face pixels, mode switching, sliders, no uploads/provider calls, mobile layout and camera cleanup. Real-device checks remain necessary to assess visual quality and performance.

The earlier photo-generation experiment and upload flow were removed. Its uncommitted migration was reversed after verifying that its table contained no jobs. Existing catalog, accounts and order data were preserved.
