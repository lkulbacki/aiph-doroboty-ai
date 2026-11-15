# editaurus application consent

Status: implemented; awaiting human review. Stop before the next stage.

## Intent and acceptance

Extract the existing candidate application consent checkbox into a scoped editaurus component without changing the approval, draft, validation, submission or stored-data rules. Review unchecked, checked, hover, keyboard focus, invalid and disabled states on the real form and in the component preview. Keep the invalid focus indicator dark rose. Check mobile width and the complete project gate.

## Ownership and handoff

`src/components/editaurus/checkbox.tsx` composes the existing Base UI-backed checkbox. `src/app/editaurus.css` owns visual states; `src/features/prototype/workspace.tsx` retains consent state and behavior. The preview in `src/features/editaurus/components-page.tsx` has local-only state. No other checkbox consumer is migrated.

**Done:** Scoped consent component and preview states. **Remaining:** Human review, then a separate stage for another form control. **Start next time:** Compare the preview with the real application form, including a failed submit without consent.

**Checked:** Browser preview inspected; full `./scripts/verify` passed on 2026-11-14: formatting, historical kit check, lint, types, 27 unit tests, baseline packet, build and 41/41 Chromium journeys. The added journey checks Space toggling, invalid focus, disabled state, mobile overflow and the real form. Existing build warnings remain.

## Follow-up correction

The user saw a dark ring on checked and post-submit checkboxes. Normal checkbox contour and checked fill now use one dark green; the checked disabled state keeps that solid green. Error remains dark rose. The preview no longer shows rejected answer-field brightness options. Verify these real-screen and preview states before human review.

## Label hover and invalid answer refinement

The user requested checkbox feedback when hovering the whole consent label, so the same lighter-paper treatment now activates through the label on the real form and in the preview. Checked, invalid and disabled controls keep their established colors. The invalid answer field keeps its warm rest `#f9efd9` and lightens to `#fff8e2` on hover and focus, with the rose border and focus line preserved. Stop before another stage.

**Verification:** The final `./scripts/verify` gate passed after the correction: formatting, historical kit check, lint, types, 27 unit tests, baseline packet, build and 41/41 Chromium journeys. Browser coverage checks the invalid answer's rest/hover/focus backgrounds and label-text hover in the preview and real form. The first full run found an ambiguous test locator; it was corrected, the targeted journey passed, and the full gate passed. Existing build warnings remain.

## Invalid answer color correction

The user selected `#f9e9d9` for the invalid answer at rest and `#f9efd9` for its hover and focus. The consent checkbox keeps its existing invalid background; only the answer field changed.

## Required and post-submit hover refinement

The user requested the required-consent checkbox to brighten on full-label hover and control focus, and the checked post-submit checkbox to lighten on label hover. The disabled state is represented by Base UI as `aria-disabled`, so CSS targets that attribute. Error contour/focus remain rose; the post-submit fill and border remain one green tone. The related invalid answer hover/focus shade is now `#faf1dd`. Stop before another stage.

**Final verification:** The targeted answer/consent/CV journeys passed after rebuilding the current app. `./scripts/verify` then passed on 2026-11-14: formatting, historical kit integrity, lint, types, 27 unit tests, baseline packet, build and 42/42 Chromium journeys. Visual preview review confirmed the three consent examples and CV cards. The first targeted run had used an older `dist/`; after rebuilding, the tests exposed the Base UI `aria-disabled` selector mismatch, which was corrected before the full gate.
