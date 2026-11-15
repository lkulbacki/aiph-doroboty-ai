# editaurus direction and migration boundary

Slug: `editaurus-direction`
Created: 2026-11-14
Status: Complete — documentation stage only

## Goal

Set one target visual direction for the fork and leave a portable starting point for the first real-screen pilot, without changing app appearance or behavior.

## Acceptance criteria

- Root instructions point to editaurus as the target and identify Poster People as the current/historical implementation.
- The immutable Poster People kit and current behavior contracts remain available.
- The next pilot, asset publication holds, and stage stop are recorded in project files.
- No runtime code, assets, dependencies, or build configuration are changed.

## Handoff

- **Done:** Updated project guidance; added the editaurus entry point, decisions, and asset review.
- **Checked:** Local documentation links, `git diff --check`, formatting, reference-kit integrity and examples, lint, types, 27 unit tests, baseline packet, build, 34 Chromium journeys, and a separate diff review.
- **Remaining:** No screen or component has been migrated; footer rights, DM Sans files/license, and business terms remain open.
- **Start next time:** Review `docs/design-system/editaurus/README.md`, then implement only the answer/consent/action pilot on the existing candidate application route. Inspect all users of changed shared controls and stop for human review afterward.

## Verification results

`./scripts/verify` passed on 2026-11-14: formatting, Poster People kit integrity (67 files) and six kit tests, lint, typecheck, 27 unit tests, baseline packet, build, and 34/34 Playwright Chromium journeys. The kit result verifies the retained reference, not editaurus. Build emitted existing third-party annotation and bundle-size warnings; it completed successfully. A local-link check found no missing links in the updated root and new editaurus documents. `git diff --check` passed. The final diff review found only documentation changes; no `src/`, dependency, lockfile, or configuration changes. `FEATURES.md` was reviewed and needs no update because product behavior did not change. The existing open company-page findings in `docs/design-system/STATUS.md` remain open.
