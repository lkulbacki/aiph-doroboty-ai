# editaurus preview link repair

Status: implemented; stop before the next design-system stage.

## Intent and acceptance

The component preview must lead to a usable application form for the active candidate. If no candidate is active, select one first and return to the preview to choose an offer without that candidate's application. Keep local scenario data and the form unchanged.

## Scope and handoff

Owners: `src/features/editaurus/components-page.tsx`, `tests/e2e/prototype.spec.ts`, `FEATURES.md`, and editaurus decisions. No new dependency or route.

**Done:** The preview now requires a candidate before resolving an available offer, returns from the persona picker to the preview, and names the selected offer in the application link.

**Checked:** `./scripts/verify` on 2026-11-14 passed formatting, historical kit integrity, lint, types, 27 unit tests, baseline packet, build, and 44/44 Chromium journeys. The added journey selects a candidate from the preview and reaches the live application form; the existing journey confirms fallback to an unsubmitted offer. The first gate attempt could not bind the local Playwright port; rerunning with local-port access passed. Existing build size and dependency-comment warnings remain.

**Remaining:** Human review of the corrected navigation. Start next time from the accepted editaurus stage plan; do not infer acceptance of another component family from this repair.
