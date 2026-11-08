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

## Current module ownership

- Settings profiles are in `store_backend/settings/`; production must fail closed
  without a strong environment secret, explicit hosts/database and a shared cache.
- Keep reusable reads in `store_api/selectors/`, writes in `services/`, contracts
  in `serializers/`, content validation in `validators/` and limits in `constants/`.
- Preserve list pagination contracts and update frontend list services when API
  response shapes change. Return legal order transitions from the server.
- New image uploads use Django file storage. Legacy conversion is an explicit,
  dry-run-first management command; never silently discard invalid legacy data.
- Seed commands must preserve existing inventory and orders and must not run
  automatically at startup. Integrity migrations must report invalid records
  instead of silently repairing or deleting them.
- Run backend tests with `DJANGO_ENV=test python manage.py test store_api --noinput`
  from `backend/`; do not mistake an empty discovery run for successful coverage.
- See `docs/backend-quality.md` for environment, migration and deployment checks.
