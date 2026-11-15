# editaurus secondary action pilot

Slug: `editaurus-secondary-action`
Started: 2026-11-14
Status: Accepted by the user on 2026-11-14. This stage is closed.

## Goal and scope

Give the existing “Zapisz szkic” action a coherent secondary editaurus variant. Use the real application form first and show the same component in the partial public preview. Preserve draft persistence, submit validation, consent and all application data.

## Acceptance criteria

- The secondary action is visually subordinate to the hero submit action, with a clear paper/ink contour, mint hover, visible keyboard focus, pressed and disabled states, long-label/mobile containment, and forced-colors visibility.
- The real save-draft action still persists the answer and reports its status. Reopening the same offer resumes the draft; consent remains a separate confirmation.
- The preview uses the same component without mutating scenario data. No shared Base UI primitive, global token or runtime dependency changes.
- Full project verification and a separate diff review pass. Stop before another component family or screen.

## Files and decisions

- `src/components/editaurus/secondary-button.tsx`: a focused variant of the existing Base UI-backed `Button`, preserving its event, type, disabled and ref props. No save logic lives in the component.
- `src/app/editaurus.css`: paper/ink secondary treatment with mint hover, focus, press, disabled, reduced-motion and forced-colors states. `src/app/application.css` keeps application-only rules and the CV link styling.
- `src/features/prototype/workspace.tsx`: uses `SecondaryButton` for the existing draft handler without changing domain operations.
- `src/features/editaurus/components-page.tsx`: shows the same component in active, disabled and long-label examples.
- `tests/e2e/prototype.spec.ts`: checks preview states, desktop/mobile containment, forced-colors focus and the real form owner. Existing draft journeys cover persistence and consent reset.
- `FEATURES.md` reflects the visual treatment and expanded partial preview. The provisional API is in [secondary action](../design-system/editaurus/components/secondary-action.md).

## Verification and handoff

- **Done:** Implemented the secondary action on the real save-draft task and the first component preview. Kept the existing draft operation and data model.
- **Checked:** Desktop browser view of the preview and application form; the outlined button sits beside the dark hero action. Targeted Chromium tests passed for the new component and draft persistence at 1280 and 390 px. Build passed.
- **Remaining:** Other button families, form fields, CV, full public showcase and remaining screens are future stages.
- **Start next time:** Choose one small component family or screen from the migration plan. Preserve the accepted hero and secondary actions, verify the new pattern on a real task, and stop for human review.

## Full gate

On 2026-11-14, `./scripts/verify` passed: formatting, retained Poster People kit integrity (67 files) and six kit tests, lint, typecheck, 27 unit tests, baseline packet (120 journeys), build and **39/39 Playwright Chromium tests**. The new journey checks the preview, desktop/mobile containment, hover, disabled and forced-colors focus. Existing application journeys verify draft persistence, consent reset and submission. The kit check verifies the historical reference, not editaurus. The build completed with existing Zod annotation and bundle-size warnings.

A separate review inspected the secondary wrapper, scoped CSS, real form handler, preview and tests. No domain transition, route, shared Base UI primitive, dependency manifest or lockfile changed. `git diff --check` passed. Earlier uncommitted editaurus work was preserved.
