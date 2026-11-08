# Frontend verification

The frontend uses React Router, strict TypeScript, TypeScript-aware ESLint and
Vitest. HTTP configuration lives in `Frontend/src/api/client.ts`; endpoint calls
live in service modules (`api/ecommerceService.ts` is the catalog service).

## Local development

Use Node 22 or newer. From `Frontend/`, run `npm ci` then `npm run dev`.
The default API URL is `/api`, proxied by Vite to Django on localhost port 8000.
Set `API_PROXY_TARGET` when the local backend uses another port. Copy
`.env.example` to `.env.local` only if a different client API URL is needed.
Vite client environment values are set at build time.

For the backend, use an isolated Python environment and install
`backend/requirements.txt`. Run `python manage.py migrate` from `backend/`
before starting it. Migration `0006` prevents deleting products referenced by
orders. The invalid Simple JWT version pin was corrected to an available version.

## User flows

- Catalog, sale, search and product detail pages use backend records. No static
  product fallback is shown after an API failure. Direct product URLs survive reloads.
- Admin screens wait for a verified profile and require staff status. Backend
  staff permissions remain authoritative.
- Profile updates use `PUT /api/profile/update/`. Password changes use
  `currentPassword` and `newPassword`. Uploads are size/type checked on both sides;
  removal persists on the server.
- Checkout creates a pending order request; it does not process online payments.
  The server calculates prices and atomically deducts inventory. The persisted
  checkout key prevents duplicate orders on unchanged retries. Editing the cart
  or address starts a new checkout key.
- Tracking requires sign-in and only returns the current user's orders.
- Logout clears profile, cart and loaded admin data. Signing in with a guest bag
  preserves that bag. Concurrent expired requests share one refresh operation;
  server validation fields remain available in `ApiError.fields`.

## Checks

From `Frontend/`:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

From `backend/`:

```sh
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test --noinput
```

GitHub CI runs the application checks as well as instruction integrity checks.
The Docker frontend builds with Node 22 and serves through nginx, proxying `/api`
to the backend. It no longer relies on runtime Vite environment injection or a
source bind mount that hides built assets.

These checks do not certify production readiness. Backend deployment settings,
remaining dependency security updates and moving refresh credentials from browser
storage to an HttpOnly-cookie design still need a separate production hardening
pass. The current bounded profile-image storage retains the legacy database
format; migration to file/object storage is not included.

## Source organization

UI components compose fields and sections. Form submission, request lifecycle,
validation, data filtering and timers are separated by responsibility:

| Location | Responsibility |
| --- | --- |
| `src/components/profile/` | Profile UI, shared input and individual field components |
| `src/components/catalog/` | Catalog grid, product card and category link rendering |
| `src/components/productpage/` | Product layout and purchase form |
| `src/hooks/profile/` | Password/profile forms, image preview lifecycle and profile access |
| `src/hooks/auth/` | Sign-in and registration forms |
| `src/hooks/orders/` | Checkout and tracking lifecycle |
| `src/hooks/catalog/` | Catalog filters, categories and product detail loading |
| `src/hooks/admin/` | Admin screen orchestration and product form actions |
| `src/hooks/header/` | Navigation actions and greeting timers |
| `src/constants/` | Field configuration, defaults, navigation and named limits |
| `src/types/` | Shared API, profile and component contracts |
| `src/utils/` | Pure validation, payload construction and filtering helpers |
| `src/services/` | Endpoint communication |
| `src/stores/` | Shared Zustand state and actions |
| `src/types/components/` | Feature-specific component prop contracts |

Shared state has moved from `components/zustand/` to `stores/`. Component
contracts have moved from `components/interfaces/` to `types/components/`.
Profile contracts live in `types/profile.ts`. Internal imports are updated to
these locations. JSX list rendering and display conditions remain close to their UI.
Business filtering, validation branches and data transformations live in `.ts`
helpers/hooks. Small native UI effects such as dialog focus behavior stay with
those components rather than requiring an unnecessary abstraction.
