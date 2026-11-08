# Project instructions

These rules apply throughout this repository. Read them before making changes.
Explicit user instructions take precedence. More specific directory instructions
apply within their scope. These are development requirements, not a claim that
the existing application already satisfies them.

## Project map

- `Frontend/`: React 19, TypeScript, Vite, Tailwind CSS, Zustand and Axios.
- `backend/`: Django, Django REST Framework and Simple JWT.
- `backend/store_api/`: models, serializers, public/auth endpoints and admin views.
- `docker-compose.yml`: local service configuration.
- Inspect actual code and configuration; the root README currently contains a
  personal profile and must not be treated as application documentation.

## Working rules

- Keep changes focused on the requested task. Preserve unrelated user changes.
- Inspect callers, API routes, serializers and permissions before changing a contract.
- Follow existing naming and structure. Extract reusable logic when useful; avoid
  arbitrary folder limits, blanket bans on component state and unnecessary abstractions.
- Do not add dependencies without a concrete need. Keep lockfiles consistent.
- Never commit credentials, real environment files, local databases, generated
  caches, build outputs or dependencies. Use placeholder environment examples.
- Do not delete existing data, rewrite Git history or deploy without authorization.
- Report what changed, what was checked and any remaining limitations honestly.

## Frontend

- Use explicit TypeScript types for API payloads, component props and store state.
  Avoid new `any` types and suppressions that hide real errors.
- Keep HTTP configuration in `src/api/client.ts` and endpoint calls in service
  modules. Preserve useful structured validation errors.
- Model loading, success, empty and failure states. Prevent duplicate submissions.
- Use local state for local UI behavior; use Zustand for shared state. Clean up
  subscriptions, timers and effects. Avoid unnecessary effects and global state.
- Guard admin UI using verified staff status, including profile-loading behavior.
  Frontend checks never replace backend authorization.
- Handle expired sessions consistently. Clear user-specific stores on logout.
  Never log tokens; avoid exposing long-lived credentials to JavaScript where a
  secure cookie-based design is feasible. Coordinate cookie changes with CSRF protection.
- Use semantic elements, associated form labels, keyboard support, visible focus
  and accessible error messages. Verify mobile layouts.
- Every visible action must work end to end. Do not present placeholder checkout
  or profile actions as implemented features.

## Backend

- Enforce authentication, staff permissions and object ownership on the server.
  Explicitly declare public endpoints and protect sensitive fields from client writes.
- Validate request bodies and query parameters with serializers or equivalent
  validation. Return appropriate 4xx errors for malformed input, not raw exceptions.
- Apply Django password validation when registering or changing passwords.
- Enforce nonnegative prices/stock and positive quantities with serializer
  validation and database constraints where appropriate. Add migrations for schema changes.
- Calculate order prices on the server. Use atomic transactions and appropriate
  concurrency controls for stock deduction and order creation.
- Validate uploads by size and actual content; do not accept arbitrary base64
  strings as trusted images. Avoid storing large image payloads in database text fields.
- Add pagination to growing lists and select/prefetch related data to avoid N+1 queries.
- Apply suitable abuse protection to login, registration and public write endpoints.
  Never expose internal exception details in API responses.
- Load deployment secrets and settings from the environment. Production must use
  a strong secret, debug disabled, explicit hosts/origins and HTTPS-appropriate settings.
- Use a production application server for deployment and configure static/media
  delivery explicitly. Do not hide startup or asset-collection failures.

## Integration and verification

- Match frontend methods, paths, payloads and response types to real backend routes.
- Vite client environment values are build-time configuration. Browser API URLs
  must be reachable from the browser, not only from the Docker network.
- Add meaningful regression tests for changed authentication, permissions,
  validation, order/inventory behavior and other consequential logic.
- From `Frontend/`, run `npm ci` when dependencies are needed, then
  `npm run lint`, `npx --no-install tsc --noEmit` and `npm run build`.
- ESLint covers JS/JSX and TS/TSX. Run `npm test` for regression coverage.
  `npm run build` includes TypeScript checking before Vite bundles assets.
- Use an isolated Python environment with `backend/requirements.txt`. From
  `backend/`, run `python manage.py check`, `python manage.py makemigrations --check --dry-run`
  and relevant `python manage.py test` tests. Review deployment settings with
  `python manage.py check --deploy` under the intended production configuration.
- Verify important user flows end to end when runtime dependencies are available.
  If a check cannot run, state the exact blocker; never report it as passing.

## Assistant entry points

- `AGENTS.md` is the shared source of project rules for agents that support it.
- `CLAUDE.md` imports these rules for Claude Code.
- `.github/copilot-instructions.md` directs GitHub Copilot to these rules.
- Keep the entry points aligned. Instruction files guide assistants; automated
  tests and CI are required to enforce executable checks.

## Modular rules and optional skills

The following rules are adapted from `/Users/mc/EasyCompaign` for this project.
Read applicable rules before working in their area:

- [01-frontend-architecture.md](.agents/rules/01-frontend-architecture.md)
- [02-backend-architecture.md](.agents/rules/02-backend-architecture.md)
- [03-code-quality-laws.md](.agents/rules/03-code-quality-laws.md)
- [04-git-workflow.md](.agents/rules/04-git-workflow.md)
- [05-zero-hardcoded-values.md](.agents/rules/05-zero-hardcoded-values.md)
- [06-ponytail-minimalism.md](.agents/rules/06-ponytail-minimalism.md)
- [07-storage-topology-and-store-domain.md](.agents/rules/07-storage-topology-and-store-domain.md)

Optional skills are in `.agents/skills/` and mirrored in `.claude/skills/`:
`ponytail`, `expert-ui-ux-design`, `expert-cloud-agent-architecture`, and `unslop`.
Read a skill's `SKILL.md` only when relevant. Project rules and explicit user
instructions override generic skill advice. Cloud topology, mandatory visual
styles, blanket state bans and external-source commands are not automatic project
requirements. Inspect scripts before running them. Preserve bundled attribution.

`CLAUDE.md` is the Claude entry point; `.claude/config.json` is a reference
manifest, not a guarantee that Claude loads custom rule keys automatically.
The GitHub workflow runs checks but does not certify production readiness.
