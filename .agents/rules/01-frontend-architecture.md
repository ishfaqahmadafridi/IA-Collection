# Frontend architecture

Adapted from EasyCompaign for React/Vite, React Router, TypeScript and Zustand.

- Keep routing in `Frontend/src/App.tsx`; do not introduce Next.js conventions.
- Separate presentation, hooks, API services, shared state, pure helpers, constants and types by responsibility. Add feature folders as complexity warrants; do not create empty scaffolding.
- Keep components focused and readable. Extract complex state/effects into hooks; local UI state is allowed. Split large components by responsibility rather than an arbitrary line limit.
- Use the shared Axios client, explicit API contracts and existing React Icons. Reuse existing UI before adding libraries.
- Use consistent design tokens, semantic HTML, keyboard access and responsive layouts. Preserve the store brand.
- Fetch live catalog, inventory, profile and order data from the backend. Keep fixtures confined to tests and explicitly labeled demos.

## Source ownership

- `src/components/`: UI composition, fields, cards and rendered lists.
- `src/hooks/<domain>/`: form handlers, request lifecycles, effects and screen orchestration.
- `src/stores/<domain>/`: shared Zustand state. Do not add stores under `components/`.
- `src/types/`: API/domain contracts and shared props; feature-specific component contracts are under `src/types/components/`. Do not add interfaces under `components/`.
- `src/constants/`: serializable field configuration, defaults, navigation and named business limits.
- `src/utils/<domain>/`: pure validation, filtering, calculations and payload builders.
- `src/services/` and `src/api/ecommerceService.ts`: endpoint communication; `src/api/client.ts` owns transport configuration.

Reuse existing field components. Extract substantial validation, business loops,
request handling and timers into the owning hook/helper. JSX mapping and display
conditions belong with the rendered UI; do not create a helper for every literal,
conditional or one-line callback. Keep type imports explicit and update all import
paths when moving files. Follow `docs/frontend-quality.md` for the current layout
and verification commands.
