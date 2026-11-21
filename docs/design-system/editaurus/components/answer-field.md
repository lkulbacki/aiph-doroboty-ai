# Multiline answer field — editaurus

Status: implemented on `/#/aplikuj/:slug` and in the component preview at `/#/design-system/editaurus`; awaiting human review of the extracted component.

## Ownership and use

- Code: `src/components/editaurus/textarea.tsx`, composing the existing `Textarea` in `src/components/ui/textarea.tsx`; visual states in `src/app/editaurus.css`.
- Real task: candidate answer on `/#/aplikuj/:slug`. The application owns its visible label, minimum 20-character rule, 12,000-character maximum, trimmed count, help/error message, consent reset, draft persistence, validation focus and submission. The component does not change these rules.
- Preview: default/focus, invalid, disabled and long-content examples at `/#/design-system/editaurus`; preview text is local to that page and never enters scenario state.
- Scope: use inside `.editaurus-surface`. Keep the visible label and help/error text next to the control with `aria-describedby`; set `aria-invalid` for an actual validation error.

## API and states

`EditaurusTextarea` accepts the existing `Textarea` props, including `id`, `ref`, `value`, `onChange`, `disabled`, `required`, `minLength`, `maxLength`, `aria-invalid` and `aria-describedby`. It only adds a scoped class.

| State                      | Rule                                                                                                                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Rest                       | Paper `#f4f0e5`, ink `#102e2a` text and 2 px border, square corners, DM Sans, 500 weight. The application answer uses a minimum height of 180 px.                                                                        |
| Hover                      | Lighter warm paper `#fdf9ef`; this same background stays during editing.                                                                                                                                                 |
| Focus by click or keyboard | Lighter warm paper `#fdf9ef` and a static 3 px inner bottom ink line. Focus wins over hover while editing. No full outline in regular colors.                                                                            |
| Invalid                    | Warm `#f9e9d9` at rest and lighter `#faf1dd` on hover and focus, with dark rose `#892746` border and matching 3 px inner bottom line while focused. Keep entered text; the owning form renders the error and focuses it. |
| Disabled                   | Muted ink `#50605b` on neutral paper `#eae8de`; content remains visible and cannot be edited.                                                                                                                            |
| Forced colors              | Full 2 px `Highlight` focus outline with 2 px offset.                                                                                                                                                                    |
| Long content/mobile        | Text wraps within the field, with no horizontal page overflow at 390 px.                                                                                                                                                 |

The source prototype's optional 2,000-character demo answer and PDF upload do not replace the fork's current validation or CV flow. Single-line profile/editor fields are now demonstrated through the existing Input owner; see [stage 2D contracts](fields-and-feedback.md). Select variants remain a separate review slice.

The preview shows only the accepted `#fdf9ef` treatment: paper at rest, lighter paper from hover through focus. The invalid background is `#f9e9d9` at rest and `#faf1dd` on hover/focus; disabled keeps its neutral background.

The user selected `#fdf9ef` for hover and focus in the real form. The rejected brightness comparisons were removed from the preview.
