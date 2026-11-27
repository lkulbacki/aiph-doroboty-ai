# EXP-01 pull request preparation

## Intent and acceptance criteria

Publish the remaining `codex/exp-01-ai-voice` changes as a pull request to `main`.
Preserve the existing work and split it into commits describing completed stages:

1. Project-contribution questions, written/voice answers, local OpenRouter
   processing, bounded requests and immutable submission snapshots.
2. One-writer browser storage, stale-snapshot rejection and recovery regressions.
3. Vercel API handlers, HTTP boundary tests and participant hosting configuration.
4. npm-generated dependency security updates without manifest changes.
5. The portable synthetic job-offer skill and its form contract.
6. The historical readiness audit and final pull request review evidence.

Start from current `main`, retain the merged centaur favicon, exclude local
secrets and generated artifacts, run the full gate and inspect the staged diffs.
Open the PR without merging it.

## Review

Reviewed domain ownership, optional version-1 fields, published job revisions,
question/answer snapshots, approval invalidation, written fallback, microphone
cleanup, request cancellation and native controls. Existing Editaurus/Base UI
owners are reused. Browser tests cover desktop/mobile, keyboard, retry,
republication, storage conflicts and recovery.

Provider keys remain server-side; bounded schemas and generic errors cover both
API implementations. Hosted endpoints are public prototype operations; local
attempt counters are not distributed limits. Provider budgets and live hosted
AI verification remain separate. No paid provider request was made in this review.
FEATURES.md changes travel with the corresponding behavior changes.

## Validation

- `CI=1 ./scripts/verify` passed: format, historical kit integrity and six renderer
  tests, lint, types, 45 unit tests, baseline packet, build and 85 Chromium tests.
- `npm audit` reported zero vulnerabilities, including development dependencies.
- Participant packaging passed; API/configuration and `.env.example` are included;
  `.env.local`, Git history and instructor sources are excluded.
- Existing Zod annotation and JavaScript chunk-size warnings remain.
- The first isolated commit passed type checking and 38 unit tests. An initial
  sandboxed isolated run could not open its HTTP test socket; the permitted
  rerun passed.
- The isolated storage stage passed types, formatting and all 39 unit tests.
- The isolated feature stage also passed formatting, build and participant
  packaging. Its checks used the existing installed dependency tree.
- Historical audit/deployment notes retain their original environment and dates;
  they do not certify this branch's hosted AI behavior.
