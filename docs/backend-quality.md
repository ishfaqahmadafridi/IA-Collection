# Backend structure and configuration

## Source ownership

- `store_backend/settings/`: common, development, production and test profiles.
- `store_backend/environment.py`: typed environment access and database URL parsing.
- `store_api/constants/`: shared periods, status transitions and business limits.
- `store_api/serializers/`: account, catalog, order, activity and query contracts.
- `store_api/validators/`: upload content validation.
- `store_api/selectors/`: optimized catalog, order, analytics and dashboard reads.
- `store_api/services/`: account/image, activity, transactional checkout and order writes.
- `store_api/management/commands/`: explicit seed, integrity and legacy-image commands.

Views enforce permissions, validate inputs and call these modules. Public routes
are explicit. Staff may update order status/notes but cannot overwrite order
ownership, numbers or financial totals, or create/delete historical orders.
Cancellation restocks inventory once and terminal orders cannot be reopened.

## Environment

`DJANGO_ENV` selects `development` (default), `production`, or `test`.
`backend/.env.example` documents process environment values; it is not auto-loaded.
Docker Compose reads the root local `.env`, as shown in `DOCKER_SETUP.md`.

Production requires a strong `SECRET_KEY`, explicit `ALLOWED_HOSTS`,
`DATABASE_URL`, and shared `CACHE_BACKEND`/`CACHE_LOCATION`. A missing, weak or
insecure-prefixed secret stops startup. Production always disables debug, enables
HTTPS redirects and uses secure session/CSRF cookies. CORS defaults to an empty
allowlist. Set `CORS_ALLOWED_ORIGINS` only for cross-origin clients.

Database URLs support SQLite and PostgreSQL. For a concurrent production store,
use a database with row locking and an appropriate backup plan. Development may
use SQLite. Rate limits are configurable by `API_AUTH_RATE`, `API_PUBLIC_WRITE_RATE`,
`API_ANON_RATE` and `API_USER_RATE`. A database cache is supported without extra
packages; run `python manage.py createcachetable` when using it. Distributed cache
alternatives need the relevant driver. Framework throttling is approximate abuse
protection, not an exact concurrent quota or a replacement for ingress controls.

`TRUSTED_PROXY_COUNT` defaults to zero so client-supplied forwarded IP headers
cannot bypass throttling. Compose sets it to one for its nginx proxy; adjust it
only for the actual trusted proxy chain. `TRUST_PROXY_HEADERS` is a separate
explicit opt-in for HTTPS proxy headers.

HSTS includes subdomains/preload only when explicitly enabled with
`SECURE_HSTS_INCLUDE_SUBDOMAINS` and `SECURE_HSTS_PRELOAD`. Without those opt-ins,
Django emits two deployment advisories. They are deliberately not silenced.

Gunicorn and the container entrypoint default to production when no profile is
specified. Local Compose explicitly selects development.

The development profile generates a temporary secret if none is supplied. Set a
stable environment secret for local multi-worker use or sessions across restarts.
Test-only settings use a fast password hasher and must never be deployed.

## Migration and storage

Before applying migration `0007`, back up the database and media. From `backend/`:

```sh
python manage.py check_store_integrity
python manage.py migrate
python manage.py migrate_profile_images
# After reviewing the dry-run report:
python manage.py migrate_profile_images --apply
```

The integrity migration rejects negative prices/stock/totals, invalid discounts,
nonpositive order quantities and unknown statuses. Its preflight reports example
record IDs and stops if existing data violates those rules. It never silently
repairs or deletes business records. Resolve any reported records before retrying.
Products referenced by orders and users with orders are protected from deletion.

New profile images are validated by decoded content, size and dimensions and are
saved through Django storage. `MEDIA_ROOT`, `PROFILE_IMAGE_MAX_BYTES` and
`PROFILE_IMAGE_MAX_PIXELS` are configurable. Old base64 data is retained until
explicit conversion; invalid legacy payloads are reported and preserved. The
conversion command defaults to a dry run, skips already-converted profiles and
clears legacy text only after a valid image is saved. Back up media along with the
database. File/object storage operations are not database-transactional.

For SQLite, use its online backup API (or stop writers before taking a file copy).
For PostgreSQL, use the database's consistent backup tooling and verify restore
on a separate instance. Keep backups outside the repository and regularly test a
restore of both database and media before relying on them for a deployment.

## API compatibility

Growing catalog/admin lists and list actions return `count`, `next`, `previous`
and `results`. The frontend list services consume all pages and retain the array
return contract for existing components. Category records return metadata and
subcategories; their products use the separate, paginated products endpoint.
Order responses include `allowed_statuses` for staff controls. Public activity
logging cannot forge login, logout or purchase events. Yearly analytics use grouped
queries, include today and exclude cancelled orders from booked sales totals.

## Verification

From `backend/`, run:

```sh
DJANGO_ENV=test python manage.py check
DJANGO_ENV=test python manage.py makemigrations --check --dry-run
DJANGO_ENV=test python manage.py test store_api --noinput
```

With actual production environment values and HTTPS settings, run
`python manage.py check --deploy`. For a strict gate, add `--fail-level WARNING`
after resolving the domain-specific HSTS advisories. Do not point verification
commands at a production database just to exercise migrations or seed data.

From `Frontend/`, run lint, typecheck, tests and build after API changes. Docker
runtime and live HTTPS routing require their own deployment verification. Refresh
cookies and remaining dependency upgrades are separate from these configuration
and data-integrity changes.
