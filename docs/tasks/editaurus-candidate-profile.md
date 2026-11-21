# Candidate profile and preview

Migrate the candidate profile editor and preview, reusing shared field states,
hero/secondary actions, feedback and CvAttachment row. Extend the existing text
field CSS family to Input, without adding a component library. Keep native required
validation, limits, domain save operation, persona data, full CV fallback and
immutable submitted snapshots. No new assets. FEATURES.md reviewed: existing
CAN-03/06/07 behavior remains unchanged.

Verify edit/save/reload, native required focus, preview, PDF/custom text, desktop,
mobile and keyboard. Stop for review before any other screen.

## Review and handoff

Implemented ProfilePage and preview, their canvas route scope, and the Input
extension of shared text-field states in editaurus.css. No data or schema changes.
Browser checks passed: required-field focus and error background, name/bio save,
reload persistence, keyboard entry to preview, correct prepared PDF links and no
overflow at 390/320 px. Inspected desktop 1440 px and mobile 320 px screenshots.
Tests use isolated browser state, not the user's stored profile.

Separate review checked Base UI render composition, native validation, existing
max lengths, shared CV snapshot fallback and scope of selectors. The shared field
change also touches the existing form/catalog textarea consumers covered by the
project journeys. Initial lint found a superseded Textarea import; removed it.
Final ./scripts/verify passed: formatting, immutable kit integrity/tests, lint,
types, 28 unit tests, baseline packet, build and 46 Chromium journeys. Existing
Zod/bundle-size build warnings remain nonblocking. Diff check passed. Stop for human review. Resume from editor and preview,
record acceptance/corrections before another route. No commit or publication.
