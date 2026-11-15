# Secondary action — editaurus save draft

Status: accepted by the user on 2026-11-14 after implementation on the candidate application form and at `/#/design-system/editaurus`.

## Owner and use

- Code: `src/components/editaurus/secondary-button.tsx`, composing the existing Base UI-backed `Button` with `variant="outline"`; CSS in `src/app/editaurus.css`.
- Live task: `/#/aplikuj/:slug`, where “Zapisz szkic” persists the answer without consent or submission and reports success. Reloading the same offer resumes the answer.
- Preview: active, disabled and longer-label examples at `/#/design-system/editaurus`. Example buttons do not change scenario data.
- Use inside `.editaurus-surface` for a secondary action that changes local state. Keep navigation as a link and the highest-priority submit action as `HeroButton`.

## API and states

`SecondaryButton` accepts existing `Button` props except `variant`; its own variant is always outline. Caller supplies `type`, `disabled`, `children`, `ref` and the action. It contains no save logic.

| State          | Rule                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Rest           | Paper `#f4f0e5`, ink `#102e2a` text and 2 px contour, 4 px radius, minimum 48 px height. No decorative shadow or arrow. |
| Hover          | Light paper `#fdf9ef`, ink text; lift 3 px up/left with a 4 px dark-green shadow. No random accent pair.                |
| Keyboard focus | Full 2 px ink outline with 3 px offset.                                                                                 |
| Press          | Move diagonally toward rest, stopping 1 px above/left; contract the shadow to 2 px.                                     |
| Disabled       | Muted ink `#50605b` on neutral paper `#eae8de`; no hover or press.                                                      |
| Reduced motion | No transition.                                                                                                          |
| Forced colors  | Full 2 px `Highlight` focus outline with 2 px offset.                                                                   |

Long labels wrap within the button and card at desktop and mobile widths. The component does not define loading or error states; the current local draft operation is synchronous and reports status in the form. If an asynchronous save is introduced later, validate its pending and failure states on a real screen before extending this API.
