# Configuration and constants

- Never hardcode secrets or environment-dependent origins, API hosts or credentials.
- Give meaningful business thresholds, repeated configuration and status values clear names near their owning domain.
- Keep calculations in testable helpers when reused or complex.
- Keep configuration data separate from rendering logic when that improves clarity; do not extract every obvious literal or label into a separate file.
- Use backend catalog and inventory as the source of truth. Do not silently replace failed requests with fabricated business data.
- Keep Vite build-time configuration distinct from server runtime configuration.
