# editaurus application answer field

Slug: `editaurus-answer-field`
Started: 2026-11-14
Status: Implemented; awaiting human review. Stop before the next stage.

## Goal and scope

Extract the accepted multiline answer-field treatment from the real candidate application form into one reusable editaurus control. Show its relevant states in the partial component preview. Preserve the existing answer length, validation, draft, consent and submission behavior.

## Acceptance criteria

- The real answer field uses the extracted component with the same label, help/error association, value and focus handling.
- Rest, focused, invalid and disabled appearances remain legible; the static 3 px inner bottom focus line appears on click and keyboard focus, with a full visible outline in forced-colors mode.
- Long content and narrow screens contain the field without horizontal overflow. Preview examples use the same component but never write scenario data.
- Full project verification and separate diff review pass. Stop before checkbox, CV or another screen.

## Files and decisions

- `src/components/editaurus/textarea.tsx`: composes the existing textarea primitive and keeps all native/ref props.
- `src/app/editaurus.css`: owns the shared rest, focus, invalid, disabled and forced-colors states. `src/app/application.css` keeps the real form's label, help/error and layout composition.
- `src/features/prototype/workspace.tsx`: substitutes only the visual control; existing answer, consent, draft, validation and submit handlers remain untouched.
- `src/features/editaurus/components-page.tsx`: exposes default/focus, error, disabled and long-content examples using the same component.
- `tests/e2e/prototype.spec.ts`: checks preview states, mobile overflow and the real form owner; existing journeys cover draft persistence, validation and submission.
- `FEATURES.md` describes the partial preview and extracted field. The provisional API is in [answer field](../design-system/editaurus/components/answer-field.md).

## Verification and handoff

- **Done:** Extracted the answer-field visual treatment and added state examples without changing its business rules or stored data.
- **Checked:** Desktop browser view of rest, focus, invalid, disabled and long-content examples. Targeted Chromium tests passed for the field and existing draft behavior at desktop/mobile widths. Build passed.
- **Remaining:** Human review of the extracted control. Checkbox, CV, other text/select fields, remaining screens and full public showcase are future stages.
- **Start next time:** Review the field in `/#/design-system/editaurus` and the actual answer on an unsent `/#/aplikuj/:slug`; accept or request changes before another stage.

## Full gate

On 2026-11-14, `./scripts/verify` passed: formatting, retained Poster People kit integrity (67 files) and six kit tests, lint, typecheck, 27 unit tests, baseline packet (120 journeys), build and **40/40 Playwright Chromium tests**. The new journey covers preview focus, invalid and disabled states, forced colors, mobile overflow and the real form's use of the component. Existing journeys cover draft persistence, validation and submission. The kit check verifies the historical reference, not editaurus. The build completed with existing Zod annotation and bundle-size warnings.

A separate review inspected the wrapper, scoped CSS, form composition, preview, documentation and browser coverage. No domain transition, shared UI primitive, dependency manifest or lockfile changed. `git diff --check` passed. Earlier uncommitted editaurus work was preserved.

Follow-up after human review: the invalid field retained an ink/green focus line while its border was red. The user requested a matching error-colored focus line. The scoped CSS and browser journey now verify dark rose `#892746` for both invalid focus and border in the preview and real form. The full gate was rerun after this correction.

## Background palette review

The user requested several subtle field backgrounds for rest, hover and active/editing, scoped to the form field. The warm-paper candidate is applied to the real answer field, with linen and pale-mint alternatives in the component preview only. Active means focused for this text control. Compare all three on mobile and desktop, including the real form's invalid focus, before accepting one palette. Stop before another component stage.

**Done:** Added three editable comparison fields and applied the recommended warm-paper palette to the real answer field. Kept the error-colored focus line, disabled treatment, data and submit behavior.
**Checked:** Viewed the three options side by side in the browser. The full `./scripts/verify` gate passed again on 2026-11-14: formatting, historical kit check, lint, typecheck, 27 unit tests, baseline packet, build and 40/40 Chromium journeys. The updated journey checks rest, hover and focus colors for each option and the focused invalid background in the real form. Build still reports the existing Zod annotations and chunk-size warnings.
**Review:** Inspected the scoped CSS, preview, browser assertions and behavior register separately after the gate; `git diff --check` and focused Prettier check passed. Existing uncommitted editaurus work was preserved.
**Remaining:** Human choice of the palette. No next component or route stage was started.
**Start next time:** Compare the options at `/#/design-system/editaurus`, then the recommended field in the linked real application form. Record the selected palette before migrating another form control.

## Corrected background comparison

The previous palette comparison misunderstood the request. The user wants one lighter paper color and three timings: always light; light from hover and through focus; or light only on focus. Pale mint has been removed. The second timing is provisionally applied to the real answer field for review. The previously active invalid background `#f9efd9` now remains the background whenever the field is invalid, including rest, hover and focus. Error-colored border and focus line remain. The form's data and validation behavior are unchanged.

**Review point:** Compare the three timings in the component preview and the second timing in the real form. Choose a timing before the next component stage.

**Verification and handoff:** Viewed the corrected comparison in the running browser. `./scripts/verify` passed on 2026-11-14: formatting, historical kit integrity, lint, types, 27 unit tests, baseline packet, build and 40/40 Chromium journeys. The updated browser journey checks each timing at rest, hover and focus, the stable invalid background, and the real form. Existing Zod annotation and bundle-size build warnings remain. No other form control or screen was migrated. Start next time with the human choice of timing.

## Nine paper brightness options

The user accepted timing 2: paper at rest, one lighter paper shade from hover through focus. The preview now compares nine warm-paper shades under that timing, including the current `#faf6ec`. The real form keeps `#faf6ec` until the user chooses another brightness. Invalid background `#f9efd9` stays stable. Stop before another stage.

## Accepted brightness

The user selected `#fdf9ef`. Applied it to hover and focus of the real answer field, keeping paper at rest, stable invalid background and existing form behavior. The nine-shade preview marks this option as selected. Stop before another component stage.
