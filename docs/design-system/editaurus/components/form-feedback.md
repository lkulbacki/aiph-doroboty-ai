# Form feedback — editaurus

Status: implemented in candidate application form and partial component preview; awaiting human review.

The real form in `src/features/prototype/workspace.tsx` owns all messages, counts, validation, focus and draft status. Scoped visual classes in `src/app/editaurus.css` do not change their meaning or timing.

- `.editaurus-form-help`: plain 12 px ink guidance associated with the answer field.
- `.editaurus-form-error`: dark rose `#892746` contour and text, warm `#f9e9d9` background, stronger left rule. Keep `role="alert"` on the actual validation message and `aria-describedby` on the invalid control.
- `.editaurus-form-status`: dark-green contour, light paper `#fdf9ef` background and ink text. Keep `role="status"` for draft save feedback.

Use these states within `.editaurus-surface`. Do not replace the form's dynamic wording with preview copy. Check long text wrapping, narrow widths, keyboard focus and recovery.
