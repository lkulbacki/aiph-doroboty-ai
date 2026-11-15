# Consent checkbox — editaurus

Status: implemented on the candidate application form and partial component preview; awaiting human review.

The control is `EditaurusCheckbox` in `src/components/editaurus/checkbox.tsx`, composed from the existing Base UI-backed `Checkbox`. It accepts the same props and only adds a scoped class. The owning form supplies the Polish consent text, checked state, `aria-invalid`, error association and validation focus. The preview has local-only state.

- Rest: square 22 px paper control with 2 px dark-green contour.
- Hover unchecked: chosen lighter paper `#fdf9ef` when the pointer is over any part of the consent label, including its text.
- Checked: dark green fill and matching dark-green contour, with a paper check mark.
- Keyboard focus: 2 px dark-green outline with offset; invalid focus uses dark rose `#892746`.
- Invalid: dark rose border with `#f9efd9` at rest and `#faf1dd` on label hover or control focus; the message remains associated with the real control.
- Disabled checked: the control keeps a uniform dark-green fill and contour with a paper check; hovering its label lightens both fill and contour to `#1b5148`. The surrounding text remains readable.

Use only inside `.editaurus-surface`. Test both pointer and Space-key toggling, failed-submit focus, narrow screens and disabled state. Other checkbox consumers remain on their existing treatment until reviewed.
