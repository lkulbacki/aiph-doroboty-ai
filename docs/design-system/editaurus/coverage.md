# Editaurus — current coverage and acceptance

Reconciled on 2026-11-21 against the working tree. This is the current index for
the [guide](README.md), [GUI](../../../GUI.md) and [handoff](handoff.md), not an
approval of all implemented UI. Stage 2A changed documentation only; stage 2C
extended the action catalog using existing owners, without changing primitives.

Stage 2C adds HeroLink, contextual unavailable publication, danger preview, quiet
navigation and BackLink examples. See [action ownership and preflight](components/actions.md).
These implementations remain review pending; prior scoped acceptance is unchanged.

Stage 2D adds existing Input valid/invalid/disabled examples and a same-candidate
changed-CV fallback. The catalog now uses the existing public editaurus header.
See [field/consent/CV/feedback reconciliation](components/fields-and-feedback.md).
The primitive APIs, domain behavior and pending human acceptance remain unchanged.

Stage 2E/2F examples and stage 2G portable extraction are complete as implementation
slices. See [choices/recovery](components/choices-and-recovery.md),
[domain compositions](components/domain-compositions.md) and the
[completion record](../../tasks/editaurus-stage-2-completion.md).
Human visual/API decisions remain pending where recorded; continuing the stages
authorized work, not automatic acceptance of every implementation.

## How to interpret status

- **Recorded accepted:** an existing decision or continuation explicitly records
  human acceptance for the named scope. This reconciliation does not create a
  new acceptance or widen it to later variants/shared consumers.
- **Implemented, review pending:** source contains the treatment, but explicit
  final acceptance is missing, partial or contradictory. Tests alone cannot
  change this status.
- **Legacy/mixed:** the route or global condition has no complete editaurus
  migration recorded; shared chrome may already be migrated.
- **Partial catalog:** production owners are reused for the listed examples;
  this is neither complete library coverage nor an executed domain journey.

Current architecture: `src/components/ui` is the single locally owned
shadcn-compatible foundation over Base UI/native HTML; editaurus wrappers/scoped
recipes specify presentation; features/shared host compositions own behavior;
the catalog imports those owners. `base-nova` configuration and a shadcn
dependency do not establish exact upstream provenance/conformance for every
file. Preserve existing APIs/render and appearance; no reinitialization,
CLI overwrite, dependencies or parallel primitive set is authorized.

## Route and surface coverage

Paths use the app's `/#/` prefix. Source owners are repository relative.
Unqualified prototype filenames in the table resolve under
`src/features/prototype/`; `home-roles.tsx` resolves under
`src/features/editaurus/`. Shared component names resolve to the owners in the
component-family table and host API documents.
Detailed historical execution belongs to task records; rows below are portable
scope/status descriptions and do not require access to those records to resume.

| Route / surface                                                                                                    | Current owner                                                                                                                                 | Implemented scope                                                                                                                                  | Acceptance / remaining boundary                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                                                                                | `src/features/prototype/home.tsx`, `src/features/editaurus/candidate-hero.tsx`, `home-roles.tsx`                                              | Candidate hero/header, animated role section, latest Editorial offer rows                                                                          | Hero/header recorded accepted. Role/latest-offer and marketing variants remain implemented with acceptance to reconcile separately; do not turn the whole landing into approved component APIs.                     |
| `/oferty`, including map/filters/sort/pages                                                                        | `src/features/prototype/marketplace.tsx:JobsPage/LocalMap`, `src/features/jobs`                                                               | Editorial listing, shared rows, query/location search, facets/chips, salary filter, sort, list/map and pagination                                  | Implemented, review pending for the complete composition and latest interaction corrections; preserve URL/draft/commit/focus contracts.                                                                             |
| `/oferty/:slug`                                                                                                    | `marketplace.tsx:JobPage`, shared job metadata/actions                                                                                        | Editorial detail, sticky conditions/actions, mobile order, company/related rows and route-aware sections                                           | Recorded accepted route composition; later shared changes still require consumer checks.                                                                                                                            |
| `/firmy/:slug`                                                                                                     | `marketplace.tsx:CompanyPage`, shared JobCard/CompanyLogo                                                                                     | Editorial company/facts/rows, local data and empty roles                                                                                           | Recorded accepted route composition; historical NH-01–05 findings are not all closed. See host status below.                                                                                                        |
| `/aplikuj/:slug`                                                                                                   | `src/features/prototype/workspace.tsx:ApplyPage`, `src/features/jobs/application-offer-preview.tsx`, `src/components/editaurus`, CvAttachment | Accepted form pilot plus extracted controls, feedback and migrated live offer context/navigation                                                   | Form pilot, hero/secondary and feedback recorded accepted; extracted textarea/checkbox/CV APIs and embedded preview remain review pending. Specific shade/interaction corrections are recorded below.               |
| `/app/aplikacje`, submitted `/app/aplikacje/:id` and confirmation alias                                            | `workspace.tsx:ApplicationsPage/ApplicationDetail`, `candidate-application.tsx`, `application-record.tsx`                                     | Editorial list/search and candidate snapshot sheet, Answer/CV, actual history, two-step withdrawal                                                 | Candidate record body acceptance is recorded in the workspace-chrome follow-up in decisions. List and subsequent shared/withdrawal variants need explicit status confirmation; do not infer universal API approval. |
| Candidate `/app`                                                                                                   | `workspace.tsx:WorkspaceHome`                                                                                                                 | Paper overview, existing counts and links                                                                                                          | Implemented, review pending.                                                                                                                                                                                        |
| `/app/profil`, `/app/profil/podglad`                                                                               | `workspace.tsx:ProfilePage`, Input/Textarea/CvAttachment                                                                                      | Profile editor/preview and existing local CV behavior                                                                                              | Implemented, review pending; native validation and current profile versus submitted snapshot remain distinct.                                                                                                       |
| `/app/zapisane`                                                                                                    | `workspace.tsx:SavedPage`, shared JobCard                                                                                                     | Editorial saved rows and empty state                                                                                                               | Implemented, review pending; removing last item/focus/reload need retained coverage.                                                                                                                                |
| `/app/oferty`                                                                                                      | `src/features/prototype/employer.tsx:EmployerJobs`                                                                                            | Editorial job management list/counts/links                                                                                                         | Implemented, review pending.                                                                                                                                                                                        |
| `/app/oferty/nowa`, `/app/oferty/:id`                                                                              | `employer.tsx:EmployerJobEditor`, `src/components/ui/form-select.tsx`                                                                         | Existing brief/proposal/approval/publication, fields and five searchable taxonomy controls in editaurus                                            | Implemented, review pending, including latest typing replacement/clearing. No purchased publishing flow or new provider call.                                                                                       |
| Employer `/app`                                                                                                    | `workspace.tsx:WorkspaceHome`                                                                                                                 | Editorial employer overview                                                                                                                        | Implemented, review pending.                                                                                                                                                                                        |
| `/app/kandydaci`, `/app/organizacja`                                                                               | `workspace.tsx:ApplicationsPage`, `employer.tsx:CompanyEditor`                                                                                | Company-scoped candidate rows/search and organization form                                                                                         | Recorded accepted in the previous continuation. Acceptance concerns these route treatments, not all later shared fields/records.                                                                                    |
| `/app/kandydaci/:id`                                                                                               | `recruiting-application.tsx`, ApplicationRecord/RecordSheet/ProcessTimeline                                                                   | Shared editaurus snapshot/history layout, note and permitted stage actions                                                                         | Implemented, review pending; the earlier “employer detail outside scope” description is obsolete.                                                                                                                   |
| `/app/settings`                                                                                                    | `src/features/prototype/settings.tsx`, ConfirmDialog                                                                                          | Paper panels/actions, controlled portal confirmation, existing data operations                                                                     | Implemented, review pending. Preserve import/export/original-save recovery/reset; inline candidate withdrawal is a different composition.                                                                           |
| `/auth/*`, persona/role gates                                                                                      | `workspace.tsx:PersonPicker/RequireRole`                                                                                                      | Editorial selection cards, audience links and wrong-role guidance                                                                                  | Implemented, review pending. Persona selection is simulation, not access security.                                                                                                                                  |
| Workspace/public chrome and footer                                                                                 | `src/features/prototype/shell.tsx`                                                                                                            | Editorial public header on home/marketplace/application/picker, workspace frame/navigation/gutters, shared footer                                  | Home header and shared footer recorded accepted; workspace base-paper correction accepted. Other chrome states/boundaries remain review pending. Catalog now reuses the public editaurus header (2D).               |
| `/design-system/editaurus`                                                                                         | `src/features/editaurus/components-page.tsx`                                                                                                  | Partial production-owner catalog: actions, fields, consent/CV/feedback, choices/dialogs/recovery, offer/pay/record/history/score; real-route links | Accepted hero/secondary preview; remaining family acceptance follows the component table. 2C–2F added scoped examples; full route/API acceptance and live domain journeys remain separate.                          |
| `/metodologia`, `/polityka-prywatnosci`, `/app/case`, unknown/unavailable routes and global storage notices/errors | MethodologyPage, PrivacyPage, CasePage, Shell/NotFound/store/storage                                                                          | Preserved information/recovery content; shared migrated chrome may surround legacy bodies                                                          | Route bodies remain legacy/mixed; shared global storage notices/errors now use self-scoped Editaurus messages. No global token migration.                                                                           |

## Component-family status and catalog gaps

The F IDs match the stage 1 inventory. Here `C` means current catalog coverage,
not a test result. Owners include existing primitives/compositions: do not create
replacement domain controllers to fill a missing catalog example.

| Family                          | Current owner / contract                                                            | Status and catalog gap                                                                                                                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F01 foundations                 | `src/app/editaurus.css`, route/workspace/record CSS, `tokens.css` and `globals.css` | Palette/paper correction recorded; measured foundation report available. No global theme approval or token rewrite.                                                                                         |
| F02 primary/action links        | HeroButton/HeroLink over `ui/button.tsx`                                            | HeroButton pilot accepted; C now includes HeroLink and unavailable-publication state. Marketing/API extensions remain pending.                                                                              |
| F03 secondary/quiet/danger/back | SecondaryButton, BackLink, buttonVariants and scoped recipes                        | Draft action accepted; C adds danger/quiet/back examples. Full extension and portability acceptance remains scoped.                                                                                         |
| F04 inputs                      | Base UI-backed Input plus native search/number/file controls                        | Implemented, review pending. C valid/invalid/disabled Input; field/feedback contract records native-validation differences.                                                                                 |
| F05 multiline                   | EditaurusTextarea over native Textarea                                              | Accepted field shade/focus corrections; extracted API still pending. C: rest/focus, invalid, disabled, long. Profile/editor/note consumers exceed the original answer-only scope.                           |
| F06 field anatomy               | `workspace.tsx:Field`, labels/help/errors in features                               | Existing labels/help/error associations demonstrated; no new shadcn Field adapter or universal error API.                                                                                                   |
| F07 closed taxonomy search      | FormSelect over direct Base UI Combobox                                             | C local closed-choice examples with actual FormSelect; selection/query/no-results/clear tested. Invalid/required API remains pending.                                                                       |
| F08 workplace suggestions       | JobsPage over direct Base UI Autocomplete                                           | Real workplace Autocomplete retained; catalog links to actual search. No duplicate controller or universal enum adaptation.                                                                                 |
| F09 select/sort                 | Base UI-backed Select; job filter/sort functions                                    | C actual FormSelect plain selected/disabled examples. Domain sorting and URL rules remain in real listing.                                                                                                  |
| F10 checkbox/facets             | EditaurusCheckbox/Base UI; native JobFiltersForm facets and category controls       | Consent extraction pending despite specific requested corrections. C: consent interactive/invalid/disabled checked; no facet/category family or indeterminate contract.                                     |
| F11 feedback                    | Feature-owned help/alert/status, Notice and store messages                          | Form feedback accepted. C: static help/error/status. This does not accept a universal error/recovery component or change live-region timing.                                                                |
| F12 dialogs                     | Dialog/AlertDialog, ConfirmDialog, ResponsivePanel                                  | C ConfirmDialog failure/retry/cancel and mobile ResponsivePanel. Existing real pending/recovery contracts retained; full acceptance pending.                                                                |
| F13 navigation                  | Shell, BackLink, Router links/NavLink                                               | C HeroLink, quiet and BackLink; public header reused. Current role/keyboard samples do not certify every navigation consumer.                                                                               |
| F14 rows/metadata               | JobCard editorial variant, SalaryFact, CompanyLogo and labels                       | C actual JobCard, SalaryFact including missing pay; production CSS context retained, no scenario-saving row in catalog.                                                                                     |
| F15 offer/company/context       | JobPage/CompanyPage, ApplicationOfferPreview, JobDescription                        | Real detail/company compositions retained; C links to real route. NH-01 structural scan and NH-04 save fix have targeted evidence; other NH decisions remain open.                                          |
| F16 filters/chips               | JobsPage, JobFiltersForm, ResponsivePanel                                           | C ResponsivePanel anatomy with isolated content; real filters/chips/search remain linked route, not copied controllers.                                                                                     |
| F17 pages/map                   | JobPagination/pagination and LocalMap                                               | Actual map/paging/list owners retained and linked from C; no parallel simulation or generic primitive acceptance.                                                                                           |
| F18 save/draft/submit           | Existing model/store/controllers with shared action presentation                    | Accepted actions do not replace persistence, consent or snapshot operations. C is visual, not a persistent save/submit simulation.                                                                          |
| F19 CV/materials                | CvAttachment; [record API](../RECORDS.md)                                           | Extraction pending; requested PDF-link 2px lift/3px shadow recorded. C: row fixture PDF/custom text, not stack/iframe/full snapshot matrix.                                                                 |
| F20 tabs/sheet                  | RecordSheet directly over Base UI Tabs with Button render                           | C actual RecordSheet with local note retention and tabs. Narrow long-tab wrapping fixed; no new ui/tabs wrapper.                                                                                            |
| F21 stages/history              | ProcessTimeline, ApplicationRecord and role-specific controllers                    | C actual ProcessTimeline with labeled synthetic dates; real stages/history/role projection remain unchanged domain operations.                                                                              |
| F22 stage/score facts           | Application presentation and MatchScore                                             | C MatchScore boundary examples. Illustrative scenario values, no generic severity mapping or real assessment claim.                                                                                         |
| F23 empty/recovery              | Shell, RequireRole, feature empty messages, settings/store/storage                  | C shared Editaurus Empty/Notice, retry/cancel and real settings recovery link. Shared Empty/Notice and Shell errors now use self-scoped Editaurus messages; full recovery remains exercised on real routes. |
| F24 decoration/marketing        | CandidateHero/HomeRoles/ConfettiBurst                                               | Home acceptance scoped above; motion and asset exceptions not blanket portable rules. No separate C; preserve reduced motion/text confirmation.                                                             |
| F25 supporting primitives       | Badge/Label/Separator/Skeleton in `src/components/ui`                               | Files present, no direct product imports found in the inventory. Not evidence of approved loading/dark-mode flows or exact shadcn provenance; no C.                                                         |

## Current rules and superseded alternatives

This table resolves documented sequences; it does not delete the
[historical decisions](decisions.md) or extend acceptance beyond their scope.

| Area               | Current recorded rule                                                                                                                                                 | Superseded / still open                                                                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Architecture       | Locally owned shadcn foundation using existing Base UI; editaurus governs style/states/usage                                                                          | The initial pilot's “no shadcn installation” was a stage boundary, not a current ban on the foundation decision. No new installation is authorized now.                                      |
| Answer             | Paper rest `#f4f0e5`, `#fdf9ef` hover/focus, static inner ink focus line; invalid `#f9e9d9` rest, `#faf1dd` hover/focus, rose `#892746` contour/focus                 | Earlier always-light/focus-only/mint/nine-shade comparisons and earlier invalid shades are historical; extracted API acceptance remains pending.                                             |
| Secondary/CV       | Light-paper hover `#fdf9ef`; secondary has its accepted separate lift. Prepared CV links use 2px up/left and 3px green shadow; current press shadow is 1px in source  | Mint hover and CV note's older 3px/4px values superseded. Generic permission for shadow on all secondary/file links or other products is not implied.                                        |
| Consent            | Dark-green contour/checked fill; full-label hover; rose error contour, `#f9efd9` rest and `#faf1dd` hover/focus; disabled checked hover `#1b5148`                     | Specific requested corrections do not close pending component/API review. Preserve Base UI disabled attributes/behavior.                                                                     |
| Workspace          | Base paper on frame/sidebar/topbar/mobile header/gutters; light-paper framed panels                                                                                   | Earlier light-paper chrome replaced by accepted paper correction; full chrome acceptance remains separate.                                                                                   |
| Taxonomy           | Selected label selects on entry, typing filters closed options, confirmation replaces stable enum; X or Backspace/Delete clears; options/no-results popup below field | Separate popup search and selected-input readOnly superseded. In current search branch, FormSelect styling classes are hardcoded; passed trigger/content classes do not control that branch. |
| Workplace          | Free-text Autocomplete plus suggestions; explicit search confirmation for replacement, clear preserves other applied filters                                          | Do not convert to taxonomy's closed-item commit behavior.                                                                                                                                    |
| Typography/palette | DM Sans interface, Fraunces editorial accent; home marketing uses Fraunces/Manrope/Caveat. Existing HeroLink has pale-blue `#a8c7fa` exception                        | Marketing/reusable exception scope still needs explicit portable acceptance. This blue is not the specifically rejected `#3156C9`; no automatic removal or skill export.                     |
| Foundations/focus  | Contextual form/search/select/tab/navigation treatment and portal-safe scope                                                                                          | No universal focus/radius/shadow rule inferred from v9 or default shadcn style. Measurements/deltas are recorded in foundations.md; contextual scope remains authoritative.                  |

## Evidence, findings and next action

The decision history records accepted hero extraction, secondary action and form
feedback, and later specific corrections; their older pending headers are
superseded for those scopes. Candidate record-body acceptance is recorded in the
workspace-chrome follow-up. The previous continuation explicitly recorded
candidate-list/organization acceptance in its employer context (the employer
candidate list, not automatic acceptance of every candidate workspace screen).
Offer/company/footer acceptance was recorded in the prior guide. These are
historical records, not new human approval in this stage.

Open company findings keep stable IDs in [host status](../STATUS.md): changed
definition-list/surface code requires current targeted evidence, and company rows
still do not pass saved state. Documentation reconciliation closes none of them.
Some visual descriptions in FEATURES/host documents remain legacy summaries;
feature IDs and behavior remain useful, while this ledger governs current visual
scope. Stage 2A reviewed FEATURES and did not alter its existing user changes.

The [asset review](assets.md) records bundled fonts/art and remaining publication
holds; presence or a recorded route acceptance does not grant broader rights.
No local study/course asset was copied in this reconciliation.

Next proposal: stage 2B foundation specification/measurement, with no automatic
global token or primitive rewrite. Catalog updates and the external skill remain
later batches. See [handoff](handoff.md) and the
[stage 2A execution record](../../tasks/editaurus-stage-2a.md). Stop for the user’s
next scope approval.

## Information-page follow-up

Methodology and operator case content now use scoped Editaurus ink/DM Sans and
light-paper panels; methodology also uses the editorial public header/canvas.
Their Polish content, role boundary and baseline download remain unchanged.
Privacy and other unknown-route bodies retain their earlier migration status.
Landing hero actions omit duplicate text underlining, retaining the quiet action's
bottom rule. See [implementation evidence](../../tasks/editaurus-information-pages.md).

Privacy and the shared NotFound owner have subsequently migrated to the same
information recipe. All public routes, including unknown addresses, now use the
editorial header/canvas; role-gated workspace routes retain their existing frame.
No privacy text or fallback destination changed. See
[privacy/not-found scope](../../tasks/editaurus-privacy-not-found.md).
