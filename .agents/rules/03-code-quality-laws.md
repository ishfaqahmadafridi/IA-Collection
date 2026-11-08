# Code quality and completion checks

- Trace existing behavior before changing it; reuse code without forcing unrelated concepts into one abstraction.
- Use explicit types and actionable structured errors. Avoid blanket suppressions, unused imports and dead code.
- Verify frontend/backend methods, paths, payloads and response shapes together.
- Add regression coverage for consequential logic, especially permissions, validation, checkout and inventory.
- Run the commands in root `AGENTS.md`. Run TypeScript checking, lint (including TS/TSX), regression tests and the production build.
- Never claim checks passed when dependencies are missing or tests did not execute.
- Documentation rules describe the target standard, not proof that existing code complies.
