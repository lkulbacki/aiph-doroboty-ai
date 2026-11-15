# editaurus button motion alignment

Status: implemented; stop before the next design-system stage.

## Intent and acceptance

Align the secondary draft action and prepared-PDF links with the hero action's diagonal movement. On hover or keyboard focus they lift up/left; on press they move diagonally down/right and their hover shadows contract. The PDF links stop 1 px above/left of their rest position, so the press does not overshoot. Preserve actions, URLs, labels, disabled behavior and reduced-motion handling.

## Scope and handoff

Owners: scoped rules in `src/app/editaurus.css`, the live candidate application form, and the partial component preview. No shared Base UI primitive or other CV consumer changes.

**Done:** Added secondary-action lift and shadow and replaced vertical press motion with diagonal press. After visual review, revised the PDF-link endpoint from below rest, then at rest, to 1 px above/left of rest with a 2 px shadow, mirroring the hero action's partial shadow contraction. Updated component notes and browser assertions.

**Behavior register:** Reviewed `FEATURES.md`. Routes, actions, data and state transitions are unchanged, so its behavior entries need no update.

**Checked:** `./scripts/verify` passed again after the press-endpoint correction on 2026-11-15: formatting, historical kit integrity, lint, types, 27 unit tests, baseline packet, build and 44/44 Chromium journeys. The browser journeys check secondary-action and both PDF-link lift, press position and shadow closure, plus the live form consumers. Existing build warnings about dependency comments and bundle size remain.

**Latest correction:** After further review, the PDF links now stop at `(-1 px, -1 px)` on press with a 2 px shadow, instead of returning fully to rest. `./scripts/verify` passed again on 2026-11-15 with the same 27 unit tests and 44/44 Chromium journeys.

**Secondary-action correction:** The user chose the same partial press endpoint for the draft action. It now stops at `(-1 px, -1 px)` with a 2 px dark-green shadow, matching the PDF links. The live save operation remains unchanged.

**Verified after secondary-action correction:** `./scripts/verify` passed on 2026-11-15, including 27 unit tests and 44/44 Chromium journeys.

**Remaining:** Human visual review of press motion in the preview and live application form. Stop before another component or route. Start next time from the accepted editaurus stage plan.
