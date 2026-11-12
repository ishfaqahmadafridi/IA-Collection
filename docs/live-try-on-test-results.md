> Historical results for the local MediaPipe prototype. These results do not verify the current Decart provider integration or its video quality. See [current setup and limits](decart-live-try-on.md).

# Live try-on verification — 9 November 2026

Result: all checks executed in this run passed. This validates the tested behavior, not photorealistic fitting or performance on every physical camera/device.

| Check | Result |
| --- | --- |
| Frontend lint | Passed |
| TypeScript (`npx --no-install tsc --noEmit`) | Passed |
| Frontend regression tests (`npm test`) | 55 passed across 13 files |
| Production build (`npm run build`) | Passed |
| Django system check | Passed |
| Migration consistency (`makemigrations --check --dry-run`) | No changes detected |
| Backend regression suite (`manage.py test store_api --noinput`) | 40 passed |
| Live-shirt browser suite | Passed |
| Live-pants browser suite | Passed |
| Responsive/keyboard browser suite | Passed |

## Browser evidence

The production frontend was served at localhost:5174 against the existing development backend. Headless Chromium used a synthetic camera and public person-image fixture. Actual local MediaPipe pose and clothing segmentation models ran; no generation-provider stub or remote AI generation was involved.

The shirt and pants suites asserted selected-material coverage at sampled original-clothing pixels, preservation of sampled face pixels, coverage after a horizontal fixture movement, stopped camera tracks after Stop and Escape, manual fallback, and absence of generation API calls, upload controls and page errors. Sampled shirt RGB was 230/226/221; sampled pants RGB was 205/190/172. These pixel assertions are smoke checks, not a full visual-quality benchmark.

The layout suite checked 320×640, 844×390 and 1920×1080 viewports: no horizontal overflow, Close remained reachable after scrolling, Escape closed the dialog, and keyboard focus returned to the opener.

Detailed browser scripts/results from this run are in `/tmp/ia-collection-browser/`: `live-clothes-e2e.mjs`, `live-pants-e2e.mjs`, `tryon-ui-layout.mjs`, `live-clothes-report.json`, and `live-pants-report.json`. These temporary scripts require the separately installed Playwright tooling; they are not part of `npm test` or CI.

## Still requires manual acceptance

Test actual phones/webcams with low light, bulky clothing, crossed arms, side views, multiple people, and several garment image styles. Detection boundaries, original outfit silhouette, seams and generic garment anchors can cause artifacts. Real-camera visual quality and sustained mobile frame rate were not established by this automated run.
