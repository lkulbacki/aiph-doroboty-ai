# Hero action — first implemented editaurus component

Status: implemented on the real candidate application form and at `/#/design-system/editaurus`; accepted pilot, extracted variant awaiting human review.

## Ownership and use

- Code: `src/components/editaurus/hero-button.tsx`, using the existing Base UI-backed `Button` from `src/components/ui/button.tsx`; visual rules in `src/app/editaurus.css`.
- Live task: `/#/aplikuj/:slug` submit action. The candidate still drafts, validates consent and answer, submits and sees the current redirect through the same domain operation.
- Preview: `/#/design-system/editaurus` shows interactive, disabled and longer-label examples. These examples have no data mutation. Its link to the real form selects a published offer without an existing application for the current candidate.
- Scope: place the component inside `.editaurus-surface`. Use it for the highest-priority action within a surface; navigation remains a link. Other button variants are not specified by this component.

## Anatomy and API

`HeroButton` accepts the existing `Button` props, including `type`, `disabled`, `ref`, `onPointerEnter` and `children`. Its label is centered without a decorative arrow. The component does not submit by itself; the containing form supplies behavior.

## Visual rules and states

| State              | Rule                                                                                                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rest               | Dark green `#103d35` surface, paper text `#f4f0e5`, ink `#102e2a` 1 px contour, 4 px radius, minimum 48 px height. Initial accent pair is yellow/mint.                                                                                                   |
| Hover              | Move −3 px and show two 4/8 px offset accent layers, each outlined in dark green. Every new non-touch entry chooses one of six yellow, mint and pink ordered pairs other than the previous pair. The accent is decorative and carries no status meaning. |
| Keyboard focus     | Same layers as hover plus a 2 px ink outline offset 11 px. Keep the current pair; focusing does not randomize it.                                                                                                                                        |
| Press              | Move +1 px and shorten the layers to 2/4 px.                                                                                                                                                                                                             |
| Disabled/submitted | Keep the dark surface and paper text; no hover layers or pointer action. The application supplies its check icon and label.                                                                                                                              |
| Touch              | Do not randomize the pair.                                                                                                                                                                                                                               |
| Reduced motion     | No transform/shadow transition.                                                                                                                                                                                                                          |
| Forced colors      | Use a full 2 px `Highlight` outline on keyboard focus with 2 px offset.                                                                                                                                                                                  |

Check focus visibility and long Polish labels at mobile width before reusing the component elsewhere. No loading or asynchronous pending state is implemented because the current local submit action is synchronous. Add such a state only when a real screen needs it and has been verified.
