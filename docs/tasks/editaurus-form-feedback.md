# editaurus application feedback

Status: accepted by the user.

## Intent and acceptance

Unify the candidate application's answer guidance, validation messages and draft-save feedback as a small editaurus family. Preserve all wording, counts, alerts, status announcements, validation focus, draft persistence and submit behavior. Use the real form as the behavior check; add visual examples to the partial preview. Check mobile wrapping, keyboard focus/recovery, and the available project gate.

## Scope and handoff

Style only the migrated application form and editaurus preview. Owners: `src/features/prototype/workspace.tsx`, `src/features/editaurus/components-page.tsx`, `src/app/editaurus.css`, and `src/app/application.css`. Do not change domain operations, data or other screens.

**Done:** Applied one visual family to answer guidance, answer/consent errors and saved-draft status in the real form. Added static state examples to the partial preview. The real form still owns text, counts, alerts, status announcements, focus, draft and submission operations.

**Checked:** Browser preview on desktop, mobile Chromium journey through short-answer error, draft save and missing consent, and the full `./scripts/verify` gate on 2026-11-14: formatting, historical kit integrity, lint, types, 27 unit tests, baseline packet, build and **43/43 Chromium journeys**. Existing build warnings remain. Two earlier hover assertions were updated from mint to the previously accepted `#fdf9ef`; the new feedback journey passed throughout.

**Review:** The user accepted the form messages and moved on to the home hero stage.
