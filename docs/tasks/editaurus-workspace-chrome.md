# Workspace navigation and header

Follow-up: separated “Wszystkie oferty” and “Zmień osobę” from the primary menu
with a semantic horizontal separator, using the listing filters' 1 px `--ed-line`
treatment. Presentation only; FEATURES.md needs no further change. No tests or
post-change checks were run, at the user's explicit request.

The user accepted the candidate record body and requested the missing header and
sidebar styling. Migrate the shared workspace chrome for candidate, employer and
operator, including the mobile header/menu. Keep route bodies independently scoped.

Reuse the bundled centaur wordmark and its existing paper/hover treatment, DM Sans,
light-paper surfaces, 1 px ink dividers, 4 px controls and dark-green selected links.
Preserve all destinations, persona information, mobile navigation and active-route
semantics. Escape from the mobile menu returns focus to its surviving trigger.
No new assets or dependencies. FEATURES.md requires a note for that focus correction.

Acceptance: inspect desktop/mobile, selected and hovered links, keyboard navigation,
menu close/route changes, long persona text, all three roles and unchanged record
body. Run the project gate and a separate review. Stop after this chrome correction.

## Verification and handoff

Implemented shared chrome in `shell.tsx` and `src/app/editaurus-workspace.css`,
imported after the existing listing logo styles. Reuse the already bundled supplied
wordmark; no additional copying or publication terms were introduced. The user
accepted the record body; this chrome correction awaits visual review.

Inspected screenshots of the candidate detail at 1440 px and its open mobile menu
at 320 px. Candidate, employer and operator menus retain destinations, dark-green
selection and lighter-green selected hover; no horizontal overflow or browser page
errors in those checks. Escape returns focus to the toggle. Existing mobile journey
now checks that focus restoration, menu closure, logo and topbar paper color.

`./scripts/verify` passed: formatting, reference integrity and 6 kit tests, lint,
types, 28 unit tests, participant packet, build and all 46 Chromium journeys.
Existing Zod annotation and bundle-size warnings remain nonblocking. A separate
review checked selector scope, mobile brand visibility, shared consumers and that
route bodies receive no inherited chrome typography. `git diff --check` passed.

Stop here for human review. Resume from the actual candidate record and this note;
record requested corrections or acceptance before selecting another screen. No
commit, push or deployment was performed in this correction.
