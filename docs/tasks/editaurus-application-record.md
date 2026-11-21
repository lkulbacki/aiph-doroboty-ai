# Candidate submitted application — editaurus

## Intent and acceptance

Migrate only the candidate detail at `/#/app/aplikacje/:id`. Reuse ApplicationRecord,
RecordSheet, ProcessTimeline, MatchScore, CvAttachment and Base UI tabs; preserve
snapshot identity, role boundaries, local persistence and withdrawal focus.
Employer detail and workspace navigation remain outside this stage.

Use DM Sans, paper canvas, light-paper sheets with 1 px ink contours and 4 px
corners, quiet underlined tabs, existing CV actions and secondary actions. Confirmed
withdrawal has a rose danger treatment. Keep the existing materials-first mobile
order and actual recorded history. This is a composition of existing components,
not a new tab or timeline library.

Done requires desktop/mobile inspection, keyboard tabs and withdrawal confirm/cancel,
PDF and custom-text snapshots, terminal/reload/owner checks, employer isolation,
the full verification gate and a separate review. Stop for human review before
migrating another screen. No new assets or dependencies are needed.

## Handoff

Implemented in `application-record.tsx` (candidate class), `candidate-application.tsx`
(shared secondary actions), `shell.tsx` (candidate detail canvas), and the scoped
`src/app/editaurus-record.css`. The employer record keeps its host treatment.
FEATURES.md reviewed: presentation only; CAN-15/CAN-16 behavior is unchanged.

Browser inspection covered 1440 px desktop and 390/320 px mobile, materials before
history, keyboard tab selection, cancel focus, forced-colors tab outline and reduced
motion. Local PDF returned HTTP 200; iframe and open/download destinations match.
Headless Chromium screenshots do not establish that a browser's native PDF viewer
paints the document; review the CV tab in the user's browser as well. The global
host footer rule initially left a white strip in the sheet; the scoped transparent
footer fixes it. Screenshots were inspected after the correction.

Existing journeys cover confirm/status focus, reload, owner omissions, employer
notes exclusion, immutable snapshots, full custom CV and long content down to
320 px, plus Axe on the record. Added checks cover the candidate paper surface,
font/contour and transparent footer, and employer styling isolation. Ad hoc rejected
and hired terminal-state checks omit withdrawal correctly. An initial synthetic
history used invalid transitions and was rejected by the existing schema; rerunning
with the full valid event sequence passed. No domain change was needed.

Separate review: no new dependency, state or duplicated record controller; Base UI
owns tab keyboard behavior and the existing candidate controller owns withdrawal.
All new visual selectors are candidate-scoped; employer consumers remain covered.

Final `./scripts/verify` passed: formatting, immutable design-system integrity and
6 kit tests, lint, types, 28 unit tests, participant baseline packet, static build
and all 46 Chromium journeys. Build retains the existing Zod annotation and
bundle-size warnings. `git diff --check` passed. Human visual acceptance is pending.
Stop here. Resume by reading
this note and `docs/design-system/editaurus/handoff.md`, reviewing the actual detail
from My applications, and recording acceptance or requested corrections before
choosing another migration scope.
