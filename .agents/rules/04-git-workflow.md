# Git workflow and review

- Preserve unrelated changes. Use descriptive feature/fix branches when a branch is requested; use supplied ticket IDs rather than inventing them.
- Write clear commits and PR descriptions explaining behavior, validation and remaining limitations.
- Follow the PR template and review security/API/schema changes explicitly.
- Never commit secrets, local databases, dependency directories or generated caches.
- Do not push, merge, deploy or rewrite history unless authorized by the user.
- CI must run applicable type, build, Django configuration/migration and test checks. Report failures honestly; do not bypass checks merely to get green status.
- Workflow files do not enable branch protection automatically; repository administrators configure required checks separately.
