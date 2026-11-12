# Decart live camera try-on

This optional, paid product-page flow uses the official `@decartai/sdk` (pinned to 0.2.14) and `lucy-vton-3.6`. It connects a camera stream to Decart and displays the returned processed video. The selected catalog garment is supplied automatically in `initialState` before the first output frame. There is no shopper image upload, capture or Generate step.

The free MediaPipe renderer opens first. **Try realistic live preview** appears there only when `/api/live-try-on/config/` reports the service as available, and **Back to free on-device preview** returns to it. Its older test report describes that local renderer, not Decart output quality. The product page does not silently substitute local output for Decart output.

## Setup

1. Obtain a Decart account/API key and credits from the [provider platform](https://platform.decart.ai/models/lucy-vton).
2. Export these variables in the **backend process environment**, then restart Django:

   ```sh
   export DECART_API_KEY='replace-with-your-real-key'
   export DECART_ALLOWED_ORIGINS='http://127.0.0.1:5173,http://localhost:5173'
   export DECART_MAX_SESSION_SECONDS='120'
   export LIVE_TRYON_RATE='3/hour'
   ```

   Replace development origins with the exact production HTTPS origins when deploying. Origins must be lowercase, have no path/trailing slash, and omit default ports. Environment example files are not auto-loaded. Never put a permanent key in Vite variables or commit it.
3. Docker Compose forwards these variables to Django. No schema migration is required for this integration.
4. Open a supported shirt/pants product, sign in, agree to external live-video processing, and select **Start live try-on**. Camera permission requires HTTPS or localhost. Only video is requested; microphone access is disabled.

Until a key and allowed origins are configured, the UI explicitly reports that live try-on is unavailable and disables Start. A configured key is not proof of available credits or model entitlement.

## Flow and contracts

- `GET /api/live-try-on/config/?product_id=...` is public. It validates the product and returns availability, fixed model, session duration and server-selected garment metadata/prompt. It returns no credential.
- `POST /api/live-try-on/token/` requires JWT authentication, a valid supported `product_id`, `consent=true`, and an Origin from the configured allowlist. It is user-throttled. Django mints a 60-second token from `https://api.decart.ai/v1/client/tokens` using `x-api-key` authentication. The browser gets only the ephemeral key and expiry, with `Cache-Control: no-store`.
- Tokens are scoped to `lucy-vton-3.6`, the requesting allowed origin, and a server-enforced maximum per-connection session duration. Permanent-key echoes, malformed/expired responses, redirects and upstream details are rejected or sanitized.
- The frontend fetches the selected public catalog image without account Authorization headers or cookies, then passes its Blob and the product prompt as the SDK's initial state. Remote image hosts must permit browser CORS. Invalid/oversized/inaccessible garment images fail before camera access.
- `apiKeyProvider` obtains a fresh token for a dial. There are no automatic initial redials; an established connection interruption ends the preview and requires an explicit restart. Standard mode is used; Fast mode is not enabled.
- The processed video is displayed without a second CSS mirror because the SDK mirrors the front-facing input. Local raw video is not presented as a successful replacement result.

## Cleanup and limits

Stop, Close, Escape, navigation, logout/account change, page hiding and the session timer release local/remote tracks and disconnect the SDK. Late camera permissions and late connection results are released. The SDK connect API has no AbortSignal parameter; cancelling stops tracks immediately and disconnects a pending connection as soon as it resolves. Server token constraints bound an already established session even if the browser fails to clean up.

Token expiry prevents new connections; it does not end an active session. Both token TTL and session-duration constraints are sent. Token issuance throttling is not a complete billing quota: tokens can be reused within their validity window, origin scoping is browser-enforced, and provider/account concurrency and credit controls are still needed for public operation.

## Privacy, cost and validation

Camera video leaves the device and is processed by Decart. The UI obtains explicit agreement and links the [provider privacy policy](https://docs.platform.decart.ai/resources/privacy-policy). Django does not receive, record or store the camera stream. Tokens are held only in memory by the connection path; they are not written to localStorage. The provider bills live usage; see its current pricing before enabling credentials.

The SDK is loaded lazily when starting, keeping its LiveKit transport out of the initial product-page bundle. The production build currently reports a large lazy LiveKit chunk and dependency annotation warnings; the build succeeds.

Regression tests cover authentication, consent, supported products, origins, model/duration scoping, unavailable configuration, throttling, sanitized errors, duplicate starts, media cleanup, late responses, time limits and the initial selected garment. Browser integration checks use isolated Django and an explicitly stubbed video transport. They do not demonstrate actual provider image quality.

**No live Decart garment-replacement session has been verified in this workspace:** `DECART_API_KEY` and `DECART_ALLOWED_ORIGINS` are absent. A paid-provider smoke test and real-device checks for latency, garment detail, face/body preservation, reconnects and mobile performance remain required.

References: [Client tokens](https://docs.platform.decart.ai/getting-started/client-tokens), [Realtime JavaScript API](https://docs.platform.decart.ai/sdks/javascript-realtime), [Official e-commerce example](https://docs.platform.decart.ai/examples/ecommerce-try-on).

## Verification — 2026-11-09

- Frontend: lint, TypeScript, 63 tests across 15 files, and production build passed.
- Backend: system check, migration drift check, and 49 tests passed.
- Five browser checks passed: real SDK loading/model resolution; authenticated consent-gated camera and garment reference; late connection cleanup; mobile layout and sign-in; unavailable service and camera denial. Browser integration used real Django endpoints with provider token minting and video transport stubbed. No actual garment inference or provider billing occurred.
- Fixed preview overflow at a 390px mobile viewport by taking the video out of intrinsic layout sizing.

## On-device alternative

The free on-device preview is the default and works even when Decart is unavailable or the shopper is signed out. This explicitly opens the existing local tracking/overlay preview; it is not a cloud clothing-replacement result. Select **Start camera** and allow browser permission. Manual placement is available when tracking cannot run. The local preview stops tracks on Stop, Close, and tab hiding. Camera video stays on-device; product images are fetched normally. The cloud flow continues to require its own consent, sign-in, and configured credentials.

Fallback verification: 67 frontend tests, lint, TypeScript and build passed. Desktop and 390px mobile browser checks used fixture catalog/config responses and Chromium simulated camera in manual placement mode. Camera start, enabled garment controls, Stop, restart, Close, zero provider token requests and no horizontal overflow passed. These checks do not establish real-device camera permission or garment realism.

## Catalog-photo correction

Model-worn catalog images are now segmented before entering the local garment mesh. On-device source preparation removes skin, face, background and the opposite upper/lower clothing region, and aborts with an explanation if a model photo cannot be isolated safely. Preparation workers terminate on completion, failure, timeout or cancellation. Broad camera-clothing recoloring was removed: the generic clothes class cannot distinguish an inner shirt from a coat. Layer-aware replacement is not implemented or verified by this local path.

Verification: 71 frontend tests, lint, TypeScript and production build passed. The actual bundled models produced an inspected transparent shirt cutout from `/images/men-tshirts/imgT1.webp`, removing the catalog model face/arms/background. Desktop and mobile simulated-camera checks passed for manual mode, Stop/restart/Close and zero provider calls. This does not verify live garment realism or coat preservation.

Research: [MediaPipe segmentation categories](https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter), [Google M&M VTO multi-garment/layout research](https://research.google/pubs/mm-vto-multi-garment-virtual-try-on-and-editing/).

## Sleeve replacement acceptance criteria

The cloud prompt requests replacement of the complete selected garment rather than recoloring: match reference sleeve/hem length, remove longer original fabric, synthesize plausible newly exposed arms/legs, preserve identity, do not copy the catalog model, and retain an existing outer coat in front of the inner shirt. These are model instructions, not a guarantee of output quality or recovery of the actual skin hidden under clothing. The local overlay explicitly states that it cannot provide those changes.

Backend configuration is still absent (`DECART_API_KEY` and `DECART_ALLOWED_ORIGINS`). Once configured with a funded provider account, test an actual long-sleeve-to-short-sleeve session, motion and arm crossing, and an inner-shirt change beneath a coat. Reject results with remaining original sleeves, altered faces or changed coats. No provider session or visual acceptance test was performed in this update. Frontend 71 tests and targeted backend 10 tests passed; these validate request behavior, not generative quality.
