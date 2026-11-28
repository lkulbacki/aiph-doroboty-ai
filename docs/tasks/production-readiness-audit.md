# Production readiness audit

## Intent

Assess the current dirty working tree as an AIPH3 teaching prototype run locally by participants, including optional local OpenRouter features. Preserve ongoing implementation work; do not deploy, commit, install dependencies, or call paid AI services.

## Acceptance criteria

- Produce the offline Polish `docs/production-readiness.html` using schema 2 of the production-readiness skill.
- Evaluate every baseline requirement against the local participant scope, recording actual evidence and unknowns.
- Run `./scripts/verify`, inspect relevant source/configuration, and check participant packaging without including secrets or instructor materials.
- Separate preparation evidence from any later hosted deployment or real-use checks.
- Perform a separate report review and report limitations. FEATURES.md was reviewed; this audit changes no application behavior and needs no register update.

## Repair boundary

The audit is authorized. Application repairs require a concrete, separately approved repair package under the invoked skill. This task does not authorize deployment or external AI requests.
