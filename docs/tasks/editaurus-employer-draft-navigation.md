# Employer draft navigation

Fix EmployerJobs linking unpublished drafts to a public route which deliberately
only resolves published jobs. Keep published links unchanged; drafts instead show
"Edytuj szkic" and navigate to the existing owner-scoped editor. No public draft
preview or publication change. Reuse SecondaryButton/render API and Editaurus.
Preserve current dirty worktree. Verify in isolated Playwright contexts, including
keyboard/mobile, editor ownership and published navigation. No Ardia/user sessions.

## Review and regression

Code evidence: JobPage resolves publishedJobs only; EmployerJobs previously
sent every row to that public route. The changed action selects the existing
editor for unpublished rows. No draft is exposed publicly; published paths,
owner filtering, primitives/render API and domain operations are unchanged.
FEATURES EMP-04 updated. Separate review: only link destination/label changes;
no added hooks, effects, state, dependencies or shared API changes.

The first regression runs failed at the public-link assertion. Inspection showed
the harness had written a draft into storage without reloading the already mounted
store, so persona selection overwrote it with the in-memory published fixture.
These failures alone do not establish a valid before/after reproduction. The
corrected harness reloads after seeding before choosing the employer. It checks
editor keyboard entry/reload at 320px, continued public rejection of the draft,
and published-row navigation. Test state is synthetic in a fresh Playwright
browser context on port 3106; no Ardia or user browser/session was used.

Final ./scripts/verify passed: formatting, immutable kit integrity/six tests,
lint, types, 28 unit tests, baseline packet, build and 54 Chromium journeys (28.6s).
Existing annotation/chunk/color-environment warnings remain. The isolated mobile
screenshot was inspected; the draft edit action wraps within the row. Scope is
this bounded navigation fix, not a completed candidate/employer journey audit or
blanket visual/API acceptance. Prior worktree changes preserved; no commit/push.
