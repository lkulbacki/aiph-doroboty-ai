# Scenario data settings

Migrate shared /app/settings for all roles and guest recovery. Preserve local
export, validated import, size/read errors, original-save download, reset and
confirmation semantics. Reuse paper panels, SecondaryButton, feedback and existing
Base UI ConfirmDialog with an explicit editaurus appearance opt-in. Other dialog
consumers stay unchanged. Extract the existing candidate danger treatment into
the shared scoped button family; preserve candidate withdrawal.

Verify export, rejected/valid import, reset/cancel, recovery, keyboard/portals,
mobile and shared consumers. FEATURES.md reviewed: no product behavior change.
No new dependency/assets. Stop for review before another screen.

## Verification and handoff

Inspected desktop 1440 px settings and mobile 320 px confirmation screenshots;
checked no horizontal overflow at 390/320 px. Dialog Axe scan has no violations;
cancel restores reset-trigger focus and an oversized file displays the existing
error without import. Initial ad hoc Axe setup required an explicit browser
context; corrected the harness and reran successfully. Isolated browser data only.

Full ./scripts/verify passed: formatting, kit integrity/tests, lint, types, 28 unit
tests, packet, build and 46 Chromium journeys. These cover invalid import preserving
state, valid import, export filename, reset/cancel, unreadable save recovery and
candidate withdrawal after shared danger-style extraction. Existing build warnings
remain nonblocking. Diff check passed.

Separate review: operation handlers unchanged; appearance is optional on the
shared dialog, other consumers retain host presentation. No extra data copy,
controller or library. Handoff updated. Stop for human review; next session should
review actual settings and its confirmation before another migration. No commit,
push or deployment performed.
