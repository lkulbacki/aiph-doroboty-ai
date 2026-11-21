# Employer job list

Migrate only /app/oferty: use flat editorial rows, actual titles, publication
status, application counts and existing editor/public destinations. Reuse HeroLink
for Add and SecondaryButton for public preview. Keep company filtering, all statuses
and empty text. Editors and recruiting screens remain outside scope.
FEATURES.md reviewed: presentation only, EMP-02 behavior unchanged. No assets or
dependencies. Verify both companies, mobile, keyboard, edit/add/preview links and
empty/long content. Stop for review before the editor.

## Verification and handoff

Inspected the 1440 px desktop screenshot. Both company lists contain their two
expected baseline jobs. Browser checks verified keyboard editor navigation, add
and public-preview destinations, long title wrapping at 320 px, and an empty
company list using a valid synthetic scenario retaining other companies' jobs.
Initial ad hoc checks used the wrong editor field label and an invalid all-jobs-
removed scenario; corrected those harness assumptions and completed the checks.
No user browser data was changed.

Separate review: company filtering, publication labels and application counts
unchanged; no editor or domain mutation. Removed superseded imports flagged by
initial lint. Final ./scripts/verify passed: formatting, kit integrity/tests, lint,
types, 28 unit tests, packet, build and 46 Chromium journeys. Existing build
warnings unchanged. Diff check passed. Handoff updated; stop for human review.
No commit/push/deployment performed.
