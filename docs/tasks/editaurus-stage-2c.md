# Editaurus consolidation — stage 2C

Date: 2026-11-21. Authorized action/catalog pilot after stage 2B.

## Intent and acceptance criteria

- Audit current link/button semantics and consumers before any adapter change.
- Extend the partial catalog with production HeroLink, contextual unavailable,
  danger, quiet and BackLink recipes without scenario writes or parallel owners.
- Preserve primitive APIs, render composition, geometry and all existing changes.
  No upstream source replacement, dependency, token, field or skill migration.
- Verify keyboard/navigation, long labels, narrow layouts, forced colors and
  reduced motion; run the full gate and review the final diff separately.
- Document current acceptance boundaries and stop before stage 2D.

A starting SHA-256 worktree snapshot is stored outside the repository for scope
verification. Existing dirty files are the baseline, not changes owned by 2C.

## Implemented scope and preflight

Added five examples to the existing catalog: production HeroLink, contextual
unavailable HeroButton with a reason, SecondaryButton danger recipe with local-only
feedback, quiet Link and production BackLink. Existing field/consent/CV/feedback
examples are unchanged. No CSS, primitive/wrapper API or product consumer changed;
therefore there is no upstream replacement requiring a selected registry revision.
The exact-revision gate remains in place for future replacements/API changes.

Source preflight covered home/overview/role gates/profile/saved routes, employer
listing/editor/company, public offers, settings, withdrawal/recruiting decisions,
record Tabs/Dialog render composition, shell, PDF and BackLink. Current HeroLink
already uses native Link plus buttonVariants. Browser observations on overview and
profile found SecondaryButton-render anchors with href and no role-button override.
Space stayed on overview; Enter opened profile. No blind adapter migration was
justified by the current upstream warning. No claim of exhaustive manual testing
of every source consumer is made. The new action contract lists evidence by group.

Manual inspection covered the desktop catalog and 320px long-label/reflow/focus
samples, local danger feedback, and actual overview/profile navigation. Existing
persona and scenario records were not edited. The temporary viewport was reset;
a desktop screenshot was saved outside the repository as review evidence. No
assets or skill content were copied. FEATURES gained SYS-12 for the partial
catalog, retaining existing IDs and earlier user edits.

A separate source review identified the important global reduced-motion rule in
workspace.css, missed by the earlier 2B source audit. The foundation report now
records 0.01ms durations/auto scroll. The new test initially expected exact 0s;
its expectation was corrected to effectively instant after the observed 1e-05s
and source rule were checked. No production motion rule was changed.

## Validation, separate review and preservation

The focused new regression passed, then `./scripts/verify` passed in full:
formatting, historical 67-file integrity and six kit tests, lint, types, 28 unit
tests, baseline 120 journeys, static build and 49/49 Chromium tests (25.0 seconds).
Existing Zod annotation, bundle-size and test color-environment warnings remain.
No dependency or browser/system installation ran.

Initial focused runs exposed test-harness issues, not resolved production defects:
the first ran against the previous dist before a fresh build; exact 0s was an
incorrect reduced-motion expectation; a page-popup wait did not observe the
new native tab. The regression now observes BrowserContext's new page event.
Its modified-click event assertion observes the router before suppressing native
navigation of the synthetic event; actual new-tab navigation is separately
exercised with middle click. An intermediate synthetic event caused a route
navigation and was isolated before the final passing test. No production link
handler was changed to satisfy these tests.

Separate review checked the scoped diff and real-owner imports, Polish labels,
local preview handler, associated unavailable reason and distinct submitted state.
It checked that field/consent/CV/feedback source stayed unchanged, that no copied
primitive/demo controller or new CSS was added, and that tab/Dialog render
composition and snapshot/recovery contracts remain in their existing owners.
Catalog context classes deliberately reuse offer/record/editor recipes; they are
not a certification of every route treatment. Full independent visual approval
of the extended action family and all consumers remains pending.

Local documentation links, final Prettier checks and `git diff --check` passed.
SHA-256 scope verification against 364 starting files found seven changed baseline
files: catalog TSX, appended browser regression, FEATURES, GUI and editaurus
coverage/foundations/handoff. Two files were added: action contract and this task.
The other 357 baseline files, including prior dirty source/CSS/config/manifests,
all primitive/wrapper owners, historical kit and earlier reports, are unchanged.
Existing FEATURES/test content was retained; formatting aligned the extended
register table. Ignored build/test outputs were regenerated. Vite was stopped.
No commit, push, merge or publication; external skill unchanged.

## Review point and proposed 2D

Stage 2C implementation is ready for human review at `/#/design-system/editaurus`,
section “Nawigacja i pozostałe akcje”. The action API/visual acceptance is not
inferred from passing tests. Review the current states before promoting any rule
to the portable skill.

Proposed 2D: reconcile existing fields, consent, CV and feedback contracts, then
fill catalog gaps using their production owners. Ready means valid/invalid/
disabled/read-only states and prop/description relationships are explicit; CV
profile-versus-submitted snapshots, PDF/text fallback and draft/recovery behavior
are preserved. Verify real candidate/employer consumers, portals if affected,
keyboard, long/missing content, desktop/390/320 and relevant adjacent breakpoints,
forced colors/reduced motion and the full gate. Human decisions cover remaining
error shades, contextual field geometry and full API acceptance. Stop after that
family, before choices/dialogs/domain migration or skill update. **2D has not begun.**
