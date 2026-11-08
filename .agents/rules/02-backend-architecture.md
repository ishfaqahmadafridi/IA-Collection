# Backend architecture

Adapted from EasyCompaign for this repository's single Django REST application.

- Work within `backend/store_api` and `backend/store_backend`; do not introduce FastAPI or multi-tenancy without a product requirement.
- Keep views focused on HTTP behavior, serializers on contracts/validation, reusable reads in selectors and transactional business writes in services when complexity warrants them.
- Enforce staff permissions and object ownership on the server. Never trust client prices, totals, role flags or user identifiers.
- Use transactions and concurrency-safe inventory updates for checkout. Validate quantities, prices, stock, status changes and uploads.
- Optimize related-object reads and paginate growing lists.
- Add migrations for schema changes and meaningful tests for models, services and endpoints affected by a change.
- Prefer idempotent Django management commands for seed data. Never run destructive seeds automatically.
- Load secrets and deployment configuration from environment variables; configure production servers, static/media delivery and HTTPS deliberately.
