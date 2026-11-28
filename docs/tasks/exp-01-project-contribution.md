# EXP-01 · Project contribution question

AIPH Q3.3 Case Forge, opportunity O01. Let recruiters assess a candidate’s
personal contribution to an earlier project before deciding whether to invite
them to an interview. Use synthetic personas and the existing local scenario.

## Scope and acceptance

- The employer can manually add one optional question beneath the offer
  description, save and reopen a draft, and publish after explicit approval.
  An unpublished revision of an existing offer keeps its public version available.
- The application shows the published question and a separate optional answer
  after the CV and required answer. Saving and reloading restores the draft.
  The current minimum answer length and submission approval still apply.
- The submitted record keeps the question and answer from submission. The
  recruiter can read them, switch to the existing CV tab, and record the reason
  for a decision with the existing note and stage controls. Missing answers
  have explicit copy. Decisions and notes survive reload.
- Legacy version-1 state and imports, offers without questions and newer
  records must round-trip. Republishing an offer must preserve earlier snapshots.
- Run answered and skipped browser journeys and capture the answered recruiter
  view with the saved rationale for Questlog.

## Implementation review

Version-1 saves use optional fields for job questions and submission snapshots.
Saved answers are associated with the wording shown to the candidate and resume
only when it matches the current offer. The visible record reads from the
submission snapshot. A pending revision is validated against the saved offer's
ID, company and slug, and publication consumes that revision.

The separate review checked the offer, application and record paths for approval
invalidation, role boundaries, version-1 imports, and snapshot stability. Existing
Editaurus field, action, record and CV components own the controls. The browser
spec covers both branches and produces the recruiter screenshot in
`artifacts/exp-01-rekruter.png`.

## Local verification

The final `CI=1 ./scripts/verify` run passed formatting, the immutable design
system check (6 renderer tests), lint, type checking, 30 unit tests, baseline
packet verification, the static build and all 80 Chromium tests. The two EXP-01
journeys ran at 1440px and 390px. The screenshot was visually checked for the
submitted question, candidate response and recorded invitation rationale. Vite
reported warnings about Zod annotations and JavaScript chunk size.
