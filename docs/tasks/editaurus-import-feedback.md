# Scenario import feedback

Fix JRA-01 stale success after failed import and JRA-02 missing success after
persona-changing import. Keep Shell persona/path key and form isolation. Move
recovery completion feedback above route/person remount into the existing store;
clear it on a new operation or route change. Do not persist UI feedback in scenario
JSON. Preserve data validation, original recovery, confirmation and export behavior.
Completion means memory scenario replaced; storage failure must retain its warning.
Verify exact exported-file roundtrip, both persona cases, failed/oversized files,
reset/cancel and reload at desktop/mobile. Run ./scripts/verify and separate review.

## Separate review

Feedback is UI-only state in the existing provider, never scenario JSON/localStorage.
Import validation still precedes commit; invalid data cannot replace the scenario.
commit retains memory data plus warning if storage fails; completion does not claim
that a disk write succeeded. Reset uses the same completion lifetime. Route changes
clear both error and completion; same-path persona changes keep completion. Shell's
persona/path key remains, preserving editor isolation. New real file selection
clears stale provider feedback before size/read checks; cancellation of the OS file
picker does not erase a previous completion. Reset opening clears local read errors.
No new dependency/style/primitive/skill/kit, no commit, push or publication.
FEATURES SYS-10 updated. Existing exact-byte roundtrip and invalid/oversized data
assertions are retained; observations now also assert the desired success/absence.

## Executed verification

Full ./scripts/verify passed: formatting, historical kit integrity/six tests, lint,
types, 28 unit tests, baseline packet, build and 73/73 isolated Chromium journeys
(36.8s). Real export/reset/import paths at 1280/390px now assert success after a
persona-changing import and no stale status after a later invalid import. Full
scenario equality after reload and oversized-file preservation still pass. The
settled 390px failure screenshot was reviewed: only the relevant error remains,
without stale success. Existing build annotation/chunk/color warnings remain.
Historical audit JSON is retained unchanged; these executed regressions supersede
its earlier JRA-01/JRA-02 observations. No Ardia or user-browser data was accessed.
