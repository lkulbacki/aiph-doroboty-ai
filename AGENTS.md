# Working on DoRoboty.ai Case

This is an AIPH3 teaching prototype, separate from the public production portal.
Read BRIEF.md, docs/case/CASE_PROTOCOL.md, TODO.md and relevant FEATURES.md entries before product work.

## Start and boundaries

- Participant setup: Node.js 24, npm ci, npm run dev (http://127.0.0.1:3001).
- Role selection is a simulation, not security.
- Share plain Zod schemas between forms and domain operations.
- Preserve human editing and approval. Use synthetic data only.
- Keep historical case evidence separate from prototype state. Include only baseline in participant packages; source history and instructor materials must not be distributed.

## Workflow

1. Record intent and acceptance criteria in docs/tasks/ for changes larger than one line.
2. Do not let multiple agents write in one worktree.
3. Implement and run ./scripts/verify before claiming completion; explain actual failures.
4. Perform a separate review pass before merging. Record durable lessons when useful.

## Product behavior register

FEATURES.md describes current behavior, not a roadmap. Update it in the same change/commit for added, changed, removed or simulated flows. Preserve stable IDs, route/role/data boundaries and source/test references. Do not equate source coverage with an executed test or deployment. For changes without behavioral impact, record that the register was reviewed and did not need updating.

## Design system direction

[editaurus](docs/design-system/editaurus/README.md) is the target visual language for new and migrated screens. [GUI.md](GUI.md) is the short entry point. The running app still uses a Poster People host adaptation; its [integration guide](docs/design-system/README.md), [implementation map](docs/design-system/IMPLEMENTATION.md), [host component catalog](docs/design-system/HOST-COMPONENTS.md), [record APIs](docs/design-system/RECORDS.md), [acceptance checklist](docs/design-system/VERIFICATION.md), and [status](docs/design-system/STATUS.md) describe existing owners, behavior, and open defects. Consult them before changing a shared consumer. The immutable `docs/design-system/agent-kit` is a historical reference and retains its integrity check; passing that check does not verify editaurus.

Migrate by explicit route/component scope. Do not blend Poster People and editaurus treatments within one migrated surface or replace working behavior with demonstration controllers or fixtures. Preserve React/TypeScript/Vite, Base UI primitives and their `render` API, hash routes, domain data, and persistent local flows. For a new editaurus pattern, verify it on a real screen before accepting it into component documentation and examples. Review all affected shared consumers, desktop/mobile, keyboard/focus, errors, long/missing content, and recovery. Do not copy local Second Brain sources or landing assets into this public repository before recording their provenance and publication terms.

## Standards

- Code, comments and authored engineering documentation are English; end-user UI and canonical AIPH source wording are Polish.
- Use npm, Node.js 24 and package-lock.json. No second package manager.
- Features belong in src/features; src/components/ui contains shared Base UI primitives.
- For UI changes follow GUI.md and docs/design-system/editaurus/README.md; reuse existing Base UI components and render composition API. Use the Poster People documents to understand the current implementation and its constraints, not as visual authority for a migrated surface.
- Use React Router hash routes.
- Never log private free text or introduce secrets into the frontend.

## Validation

- npm run check verifies formatting, lint, types, unit tests, static build and browser journeys. ./scripts/verify runs the same gate.
- npm run dev never installs browser binaries or system tools. Browser tests require a provisioned Playwright Chromium; if missing, report it. Do not install OS dependencies automatically.
- Check mobile/desktop, keyboard access, error states and data recovery.
- Report what actually ran. Local checks do not prove CI, publishing or human approval.
