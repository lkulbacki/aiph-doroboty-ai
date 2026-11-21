# editaurus decisions and open questions

## Current authority — stage 2A, 2026-11-21

The user selected **shadcn/ui as the component foundation**, with editaurus defining
accepted appearance, variants, states and usage. Use the existing Base UI-compatible
implementation and render composition, with one locally owned foundation in
`src/components/ui`. Keep accepted application visuals, domain operations and
HashRouter. No reinitialization, CLI overwrite, dependency addition or parallel
primitive set is authorized by this decision.

The user approved the stage 1 report's proposed documentation-only stage 2A.
This records architecture and reconciles coverage; it does not accept all pending
screens/APIs, begin implementation/catalog work or authorize an external skill
update. See the [current coverage/acceptance ledger](coverage.md) and
[handoff](handoff.md) for the next stop point.

The entries below are retained decision history. Their scope is the stage named
at the time. Later explicit corrections supersede earlier values: light paper
replaces mint action hover; final error shades replace the earlier comparisons;
base paper replaces light workspace chrome; inline typing replacement replaces
popup search/readOnly taxonomy fields. The ledger records the resulting current
rules without erasing those earlier choices. In particular, the first pilot's
no-installation boundary is not a current rejection of shadcn as the foundation.
Recorded pilot/style acceptance is not blanket acceptance of extracted APIs,
marketing exceptions, every shared consumer or portable skill rules.

## Accepted for this fork — 2026-11-14

1. editaurus is the target visual language across the application, introduced in small, reviewed stages. Poster People remains the visible implementation where migration has not happened and its immutable kit stays in the repository as historical reference.
2. The first real-screen pilot is the answer/consent/action portion of the existing candidate `/#/aplikuj/:slug` flow. Preserve the current profile CV, draft, consent, submission, snapshot, and redirect behavior. Do not import the prototype's fictitious job, PDF upload, or demo-only submission.
3. Reuse the existing React/TypeScript/Vite, Base UI primitives, and shared domain operations. No shadcn/ui installation or new runtime dependency is approved by this stage.
4. Carry forward the static inner bottom focus line and hero-button behavior described in [the guide](README.md); verify them on the pilot before documenting an implemented component variant.
5. Stop after each stage for a human review. A stage note records what changed, what was checked, what remains, and where to resume.

## Accepted first pilot — 2026-11-14

- Scope is the application form on `/#/aplikuj/:slug`; the adjacent offer preview and page navigation retain their current owner and visual treatment. No shared Base UI primitive or global token was changed.
- The form uses the six recorded Editorial v9 colors and locally bundled DM Sans. The answer field has the static ink inner bottom focus line; forced-colors mode adds a full `Highlight` outline. Fraunces is not needed in this form.
- The submit action uses two offset, outlined accent layers on hover and keyboard focus. A new non-touch hover selects a different accent pair. Touch keeps the initial pair. Reduced-motion mode removes the movement transition.
- The user accepted the real application-form pilot on 2026-11-14. These visual rules can now be extracted into a reusable component, with the application route remaining the behavioral reference.

## Hero action extraction — accepted on 2026-11-14

- The accepted submit treatment is owned by `src/components/editaurus/hero-button.tsx` and `src/app/editaurus.css`. It composes the existing Base UI-backed `Button`; the application form and the first component preview use the same implementation.
- The preview route is `/#/design-system/editaurus`. It is a partial public catalog. Its example buttons do not submit or change scenario data; the real application route remains the behavior check.
- The component API and observed states are recorded in [hero action](components/hero-action.md). Other editaurus button variants and form controls remain separate future work.
- User revision: remove the decorative arrow from `HeroButton`; keep only centered text (and the existing submitted check icon in the real application state). The accent layers and interaction states remain as accepted.
- The preview link selects a published job without an existing application for the active candidate, preferring AI Product Manager when available. This avoids the already-submitted notice while preserving local scenario data. If every published job has an application, the preview explains that no form is available.
- For visitors without a selected candidate, the preview links to candidate selection and returns there afterward. The available job is resolved only after selection, so the link cannot target an offer already submitted by that candidate. The application link names the chosen offer.
- The user accepted the hero-action component and preview, then approved a focused secondary action stage for the real save-draft control.

## Secondary save-draft action — accepted on 2026-11-14

- The real application form and component preview now compose `SecondaryButton` from the existing Base UI-backed `Button`. It uses paper/ink with mint hover and does not use the hero accent layers.
- The draft operation, status text, persisted answer and consent behavior are unchanged. The user accepted the visual treatment after reviewing the real form; the API is recorded in [secondary action](components/secondary-action.md).

## Multiline answer field extraction — awaiting human review

- The candidate answer uses `EditaurusTextarea`, which composes the existing textarea primitive. Its focus line and invalid state moved into scoped editaurus CSS; the application keeps the label, help/error text, 20-character minimum, 12,000-character maximum, consent and draft operations.
- The partial preview shows rest/focus, invalid, disabled and long-content states using the same control. The proposed API is in [answer field](components/answer-field.md); review it on the real form before applying it to other screens.
- Background color review, revised after user feedback: compare three timings for one lighter warm paper `#faf6ec`: always light, light from hover, or light only on focus. The second timing is provisionally applied to the real answer field, with paper `#f4f0e5` at rest. Invalid fields use `#f9efd9` at rest, hover and focus, with the existing dark-rose border/focus line. Disabled stays neutral. This note records the earlier comparison; the accepted choice is below. Pale mint was removed from this comparison.
- User correction: when the answer is invalid and focused, the 3 px inner bottom line uses the same dark rose `#892746` as the error border. The regular focused line remains ink; forced-colors focus keeps the full `Highlight` outline.

## Open before public release or affected implementation

- Exact scope, copy, and destination of the landing's employer plans and guarantee; the current app has no payment or purchased publication flow.
- Whether the landing's local `.txt` offer-draft download should remain a separate marketing tool or connect to the existing employer editor.
- Historical packaging question: Fraunces files and accompanying OFL text are now bundled, as recorded in [asset review](assets.md). The original pilot used DM Sans. Check exact asset/use/provenance before any broader transfer; presence does not grant publication rights for unrelated landing material.
- Publication terms for the adapted 21st.dev footer; see [asset review](assets.md).
- The public showcase URL and hosting. No deployment is authorized by this decision.

## Answer-field brightness accepted

- The user selected timing 2 with `#fdf9ef` for hover and focus in the real application form. Rest remains paper `#f4f0e5`. Invalid background remains `#f9efd9` in all states; disabled is unchanged. The nine-shade preview remains a comparison, with `#fdf9ef` marked selected.

## Consent checkbox awaiting human review

- The real candidate consent composes the existing Base UI checkbox through `EditaurusCheckbox`. Scoped styles cover rest, hover, checked, keyboard focus, invalid focus and disabled. The owning form keeps the same explicit approval, error association, draft/submit behavior and data; the preview uses local-only state. Review on the real form before migrating other checkboxes.

## Consent contour and preview cleanup

- At the user’s request, the normal checkbox contour, checked fill and checked disabled contour use the same dark green. Error uses dark rose throughout. The rejected answer-field brightness examples were removed from the preview; the selected `#fdf9ef` treatment and state examples remain.

## Consent label hover and invalid answer shade

- Hovering the full consent label, including its text, lightens an unchecked valid checkbox to `#fdf9ef`. Checked, invalid and disabled controls retain their dedicated states.
- The invalid answer field uses `#f9efd9` at rest and `#fff8e2` on hover and focus. The rose border and focus line remain unchanged.

## Invalid answer colors accepted

- At the user’s request, the invalid answer field uses `#f9e9d9` at rest and `#f9efd9` on hover and focus. Dark-rose border and focus line stay unchanged. The checkbox error background remains `#f9efd9`.

## Application CV row awaiting human review

- The existing `CvAttachment` remains the source of truth for PDF matching, links and custom text. Scoped editaurus styling is applied only within a migrated surface; the partial preview shows the same row with a matching fixture PDF and a synthetic custom-text fallback. Profile and submitted-record screens are unchanged.

## Error and CV interactions after review

- Invalid answer rest stays `#f9e9d9`; hover and focus use `#faf1dd`. The required-consent checkbox keeps `#f9efd9` at rest and uses `#faf1dd` when the full label is hovered or the control is focused. Dark-rose error borders and focus remain.
- The checked post-submit checkbox lightens from `#103d35` to `#1b5148` on label hover; fill and border remain the same color. Base UI exposes its disabled state through `aria-disabled`, which the scoped CSS uses.
- Both prepared-PDF links lift up and left by 2 px on hover and keyboard focus, with a 3 px dark-green `#103d35` shadow. Motion transitions are removed under reduced-motion preference. File selection and destinations are unchanged.

## Light paper hover accents

- The secondary draft action and both prepared-PDF links now use the selected field-hover paper `#fdf9ef` instead of mint. Their contour, focus and link behavior remain unchanged.

## Form feedback accepted

- The candidate application now uses scoped editaurus help, error and saved-draft status styles. Validation text, alert/status semantics, counts, focus, draft persistence and submit behavior remain owned by the real form. The partial preview shows static visual examples only.

## Candidate submitted record — pending visual acceptance

- Candidate-only ApplicationRecord uses DM Sans and the established paper canvas /
  light-paper 1 px, 4 px reading sheet. Materials sit left of actual history and
  summary on desktop; below 950 px, materials precede the history.
- Reuse Base UI tabs with a quiet paper hover, ink selected underline and explicit
  keyboard outline. Reuse existing CV actions and secondary withdrawal/cancel
  buttons. Confirmation uses the existing rose error palette to distinguish the
  destructive action, preserving the diagonal partial press.
- Snapshot fields, role-filtered history, MatchScore, PDF matching, withdrawal and
  focus restoration remain owned by the existing controllers. Employer styling
  and workspace chrome are not migrated by this decision. This composition awaits
  human review on the actual candidate screen before expansion into the showcase.

## Workspace chrome — follow-up review

The user accepted the candidate record body and requested matching navigation.
The shared workspace header/sidebar now uses the existing centaur wordmark, DM Sans,
light paper, thin ink dividers, 4 px controls and dark-green active navigation.
Inactive hover uses base paper; selected hover lightens the green to `#1b5148`.
All role menus keep their existing destinations and persona data. Scope styles to
chrome elements, without inheriting the new typography into unmigrated route bodies.
Mobile Escape restores the menu-trigger focus. Human visual review is pending.

## Workspace paper surfaces — accepted correction

The user selected base paper `#f4f0e5` for the workspace sidebar, topbar and mobile
header. Framed content panels keep light paper `#fdf9ef`. This supersedes the
earlier light-paper chrome decision. Control states are unchanged.

## Workspace gutters

Base paper #f4f0e5 covers the full workspace frame and column, including margins
outside centered route content. A max-width main is not the canvas owner. Light
paper #fdf9ef remains reserved for content panels and existing control states.

## Candidate profile — pending review

The profile editor and preview reuse light-paper panels, shared secondary/hero
actions and the CV row. Single-line inputs extend the existing textarea state
family, using 44 px minimum height and the same inner bottom focus line. Native
required validation retains browser messages/focus; `:user-invalid` uses the
accepted rose border and paper error colors. Save and snapshot behavior is unchanged.

## Scenario settings — pending review

Shared data settings reuse paper panels and secondary actions. ConfirmDialog adds
an explicit editaurus appearance for this route only, including its portal.
The existing withdrawal rose action treatment is shared as `editaurus-danger-button`
with reset/import confirmation. Preserve all data operations and Base UI focus.

## Publication disabled state

Job-editor publication uses the same inactive palette as the AI proposal action:
fill #eae8de, text/contour #50605b. This conveys the shared unavailable state;
normal action hierarchy returns when enabled. The application submitted-success
button retains its separate green state. Approval still enables publication and
editing approved content revokes approval.

## Searchable editor taxonomy menus

Editor category/function/work mode/seniority/contract fields reuse the listing
paper popup treatment with a below-trigger position. A search field at the top
filters the closed option collection. Selection remains a stable domain value;
typing a query does not create an option. Empty search has an explicit message,
Escape restores trigger focus and the selected label remains visible in the field.
Free-text job location remains available without imposing a closed city list.

## Inline taxonomy search — user correction

This supersedes the separate popup-search composition. The main field displays a
selected label, with X to clear it. An empty/unselected field is editable and
filters the closed collection; the popup contains only options or no-results text.
Retain stable option serialization and below-field positioning.

## Replace a selected value by typing

This supersedes the selected-input read-only rule. Taxonomy inputs select their
current text on entry; typing searches without first using X, and confirming an
option replaces the selected enum. Backspace/Delete clears an unchanged selected
label using the existing Clear operation. Listing workplace uses the same text
selection and clearing, preserving other URL filters and search confirmation.

## Stage 3B acceptance and local closure — 2026-11-22

The user explicitly accepted 3B and authorized the remaining local stages through
3F. This accepts the existing application/catalog visual treatment and local
component/API usage recorded in the current coverage ledger, including marketing
typography/pale-blue actions, contextual secondary/CV lifts and distinct
answer/consent invalid-rest shades. It does not certify upstream file identity,
future unused variants, asset rights, spoken announcements or other products.

The catalog structure is needs-based: foundations, components and patterns with
current production owners. The external catalog is an information-architecture
reference only; no missing family must be invented to match its section count.
Keep original historical-kit evidence unchanged. The final local closure record
separates executed checks from the real-reader session still requiring an operator.
