# Docker setup

The frontend is built with Node and served by nginx. `/api` is proxied internally
to Django/Gunicorn; `/media` is served from a shared, read-only media volume.
The backend runs as a non-root user. Startup errors stop the container.

## Local setup

1. Copy `.env.example` to `.env`.
2. Generate a secret with `openssl rand -hex 32` and put it in `SECRET_KEY` in the
   local `.env`. Keep this file out of Git.
3. Run `docker compose up --build`.
4. Open `http://localhost:5173`. API requests use the same origin at `/api`.

Compose explicitly defaults to the development settings profile for local HTTP.
The backend image itself defaults to production and refuses missing deployment
configuration. Do not use the development profile for a public deployment.
The backend port is internal; its API and media are reached through nginx.

Named volumes persist the database (`db_data`) and uploaded media (`media_data`).
They do not import `backend/db.sqlite3` automatically. Back up and deliberately
copy any existing development data before switching to named volumes. Do not use
`docker compose down -v` if those volumes contain data you need.

Useful commands:

```sh
docker compose logs -f
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py check_store_integrity
docker compose exec backend python manage.py migrate_profile_images
docker compose stop
```

No catalog or orders are seeded at startup. To add demo catalog data to the local
setup, run `docker compose exec backend python manage.py seed_catalog`. This
command preserves existing records and is blocked under production settings.

## Production configuration

Use `DJANGO_ENV=production`, a generated secret, explicit `ALLOWED_HOSTS` and
`DATABASE_URL`, and an HTTPS ingress. Compose configures a shared database cache;
other supported Django shared cache backends require their appropriate drivers.
Configure the exact trusted proxy count and enable proxy-header trust only when
the backend is reachable exclusively through a proxy that replaces those headers.
The production profile enables HTTPS redirects and secure cookies. Terminate TLS
at the frontend proxy, or configure it to preserve HTTPS scheme information only
from a trusted ingress. The shipped nginx configuration reports its own connection
scheme; it does not blindly trust client-supplied forwarded-protocol headers.

HSTS subdomain/preload flags are explicit opt-ins. Enable them only after checking
that all subdomains support HTTPS and the preload requirements are met. Until
then, Django reports those two deployment advisories; they are not suppressed.

The repository does not provision TLS certificates, a public ingress, PostgreSQL,
or remote backup infrastructure. See `docs/backend-quality.md` for the migration,
backup and verification procedures. Docker runtime validation requires Docker;
application tests alone do not verify a container deployment.
