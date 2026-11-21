# Editaurus — current coverage and acceptance

Reconciled on 2026-11-22. This is the current index for the [guide](README.md),
[GUI](../../../GUI.md), [host findings](../STATUS.md) and [handoff](handoff.md).
The user explicitly accepted stage 3B (visual and component-contract review) on
2026-11-22 and authorized the remaining local closure work. That acceptance covers
the existing application/catalog scope below, including its deliberate local
exceptions. It does not certify unseen variants, future changes, upstream source
identity, publication rights or assistive-technology behavior.

Stages 1, 2A–2G and 3A are implemented. The catalog now organizes current needs
into foundations, components and patterns with section URLs, current-location
indication and heading focus. Completeness is determined by this application's
needs, not by matching every section of an external catalog. Real workflow
controllers remain on real routes; previews import production owners with
isolated local state.

## Status and architecture

- **Accepted in 3B:** current visual treatment and local component/API usage in
  the named scopes. Earlier pending-review descriptions are superseded here.
- **Retained host exception:** accepted locally, without making it a portable rule.
- **Not exercised:** no execution claim for that environment or unimplemented state.
- **Historical:** dated evidence retained for context, superseded by later fixes.

`src/components/ui` is the single locally owned shadcn-compatible foundation over
Base UI/native HTML. Editaurus wrappers/scoped recipes specify appearance and
states; features/shared host compositions own routes and domain behavior.
`components.json` selects `base-nova`, but not every component is an unchanged
upstream file. Keep Base UI's `render` API, current exports and accepted appearance.
No parallel primitives, CLI overwrite, dependency installation or global token
rewrite was needed. Exact upstream revision/diff is a prerequisite for a future
replacement, not an unfinished migration required to close this local work.

## Route and surface coverage

Paths use the app's `/#/` prefix. Unqualified prototype owners resolve under
`src/features/prototype/`. All rows below are accepted in 3B for their implemented
scope; behavioral and test boundaries remain as stated.

| Route / surface                                                                  | Current owner                                                                        | Implemented scope and retained boundary                                                                                                                                                 |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                                              | `home.tsx`, Editaurus CandidateHero/HomeRoles                                        | Editorial hero/header, role section and latest rows. Fraunces/Manrope/Caveat and pale-blue/pink marketing actions are deliberate local exceptions.                                      |
| `/oferty`                                                                        | `marketplace.tsx:JobsPage/LocalMap`, `src/features/jobs`                             | Rows, explicit query/location confirmation, facets/chips, salary, sorting, list/map and paging. Preserve URL/history, draft/commit and focus contracts.                                 |
| `/oferty/:slug`                                                                  | `marketplace.tsx:JobPage`                                                            | Detail, conditions/actions, company/related rows and section URLs/focus.                                                                                                                |
| `/firmy/:slug`                                                                   | `marketplace.tsx:CompanyPage`, JobCard/CompanyLogo                                   | Paper panels, logo/fallback, offers/empty state, candidate saving and demonstrative-data context. NH-01–05 dispositions are closed for their verified/accepted scopes in host status.   |
| `/aplikuj/:slug`                                                                 | `workspace.tsx:ApplyPage`, ApplicationOfferPreview, Editaurus controls, CvAttachment | Answer, consent, CV, help/error/status, draft and submission; live offer context. Validation, legacy draft data and immutable submission remain domain-owned.                           |
| `/app/aplikacje`, `/app/aplikacje/:id` and confirmation alias                    | `workspace.tsx`, `candidate-application.tsx`, ApplicationRecord                      | Candidate rows/search, snapshot Answer/CV, candidate-visible history and two-step withdrawal.                                                                                           |
| Candidate/employer `/app`                                                        | `workspace.tsx:WorkspaceHome`                                                        | Role-specific overview/counts/links; persona simulation is not security.                                                                                                                |
| `/app/profil`, `/app/profil/podglad`                                             | `workspace.tsx:ProfilePage`, Input/Textarea/CvAttachment                             | Profile editing/preview and local CV; browser constraint validation remains distinct from the application form. Profile edits do not rewrite submitted snapshots.                       |
| `/app/zapisane`                                                                  | `workspace.tsx:SavedPage`, JobCard                                                   | Saved rows/empty state; retained removal/focus/reload behavior.                                                                                                                         |
| `/app/oferty`, `/app/oferty/nowa`, `/app/oferty/:id`                             | `employer.tsx:EmployerJobs/EmployerJobEditor`, FormSelect                            | Actual draft/edit/proposal/approval/publication, salary/taxonomy and replacement/clearing. Editing revokes approval; unchanged imported metadata is retained.                           |
| `/app/kandydaci`, `/app/kandydaci/:id`, `/app/organizacja`                       | ApplicationsPage, recruiting-application, CompanyEditor                              | Company-scoped rows, snapshot/history/note/stage actions and organization editing. Terminal states and role projections remain domain-owned.                                            |
| `/app/settings`                                                                  | `settings.tsx`, ConfirmDialog, store/storage                                         | Import/export/reset, unreadable-save recovery and persistence warning. Completion survives persona remount and clears on a new recovery attempt/navigation.                             |
| `/auth/*`, role gates                                                            | `workspace.tsx:PersonPicker/RequireRole`                                             | Selection cards, audience links and wrong-role guidance.                                                                                                                                |
| Shared chrome/footer                                                             | `shell.tsx`                                                                          | Editorial public header, paper workspace/sidebar/topbar/gutters, mobile navigation and shared footer.                                                                                   |
| `/design-system/editaurus`                                                       | `src/features/editaurus`                                                             | Foundations and production-owner examples; contents/navigation, field/choice/dialog/recovery, row/pay/record/history/score and listing-filter guide. No scenario writes from specimens. |
| `/metodologia`, `/polityka-prywatnosci`, `/app/case`, unknown/unavailable routes | Information pages, Shell/NotFound                                                    | Migrated information recipes and scoped Editaurus messages; original Polish content, recovery destinations and operator boundary retained.                                              |

## Component families and catalog coverage

F IDs retain the stage 1 inventory mapping. `C` means a catalog specimen/guide,
not a separately executed domain journey. Existing owner/API usage is accepted in
3B; absent specimens do not require new product functionality.

| Family                           | Owner / contract                                  | Current coverage and boundary                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F01 foundations                  | `editaurus.css`, contextual CSS, `tokens.css`     | C palette, typography, panel/row/state principles. Contextual recipes retained; no global radius/focus rewrite.                                                                                               |
| F02 primary/link                 | HeroButton/HeroLink, ui/Button                    | C enabled/submitted/unavailable/navigation. Native navigation semantics; marketing colors stay local.                                                                                                         |
| F03 secondary/quiet/danger/back  | SecondaryButton, BackLink, scoped recipes         | C action hierarchy, danger preview, quiet/context links. No invented asynchronous loading flow.                                                                                                               |
| F04 single-line                  | ui/Input, native search/number/file               | C editable/invalid/disabled. Browser validation and feature-specific error anatomy remain distinct.                                                                                                           |
| F05 multiline                    | EditaurusTextarea/native Textarea                 | C rest/focus/invalid/disabled/long; answer/profile/editor/note consumers retain their own rules.                                                                                                              |
| F06 field anatomy                | Feature labels/help/errors                        | C associated help/error. No universal Field wrapper or silent validation normalization.                                                                                                                       |
| F07 closed search                | FormSelect/Base UI Combobox                       | C search/no-results/confirmation/clear/help; required confirmed-value validation on five employer fields. `describedBy`/`error` accepted locally; trigger/content classes do not style the searchable branch. |
| F08 workplace                    | JobsPage/Base UI Autocomplete                     | Real-route guide/link. Free text and explicit search commit, separate from closed taxonomy.                                                                                                                   |
| F09 sort                         | JobsPage/current sort owner                       | Listing-filter guide and real route. URL/page reset retained.                                                                                                                                                 |
| F10 checkbox                     | EditaurusCheckbox/Base UI Checkbox                | C checked/unchecked/invalid/disabled. Actual candidate/employer names reference full visible labels. Indeterminate is not an application consent requirement.                                                 |
| F11 feedback                     | Feature help/alert/status, Notice/store           | C feedback. Real import errors/completions remain operation-scoped; status does not imply successful persistence.                                                                                             |
| F12 dialogs                      | ConfirmDialog/AlertDialog, ResponsivePanel/Dialog | C confirmation retry/cancel and mobile panel. Pending, close and return-focus remain production contracts.                                                                                                    |
| F13 navigation                   | Shell, Router links, BackLink, CatalogNavigation  | C native links and section navigation/history/focus. URL-selected state is not a scrollspy.                                                                                                                   |
| F14 rows/metadata                | JobCard, SalaryFact, CompanyLogo                  | C actual offer and missing salary. Row hover never paints the title pink; catalog rows do not save scenario data.                                                                                             |
| F15 offer/company                | JobPage/CompanyPage/ApplicationOfferPreview       | Real routes and context links; company findings reconciled below.                                                                                                                                             |
| F16 filters/chips                | JobsPage/JobFiltersForm/ResponsivePanel           | C six-part filter guide and shared dialog anatomy; presets open the real controller.                                                                                                                          |
| F17 paging/map                   | JobPagination/LocalMap                            | Real list/map route links. No duplicate simulation.                                                                                                                                                           |
| F18 save/draft/submit            | Model/store and feature controllers               | Real routes; catalog visual examples are not persistence/approval/submission operations.                                                                                                                      |
| F19 CV/materials                 | CvAttachment, host record API                     | C matching PDF row/custom text. Actual stack/row/iframe and immutable snapshots stay in host APIs. Native links retain their contextual lift.                                                                 |
| F20 tabs/sheet                   | RecordSheet/Base UI Tabs/Button render            | C actual tabs and locally retained note; narrow long-tab wrapping fixed. No parallel tabs wrapper.                                                                                                            |
| F21 stages/history               | ProcessTimeline/ApplicationRecord/controllers     | C synthetic history, real domain stages/history in routes. No workflow mapping in the skill.                                                                                                                  |
| F22 score facts                  | MatchScore/presentation                           | C boundary examples with numeric text. Scenario values are illustrative, not hiring recommendations.                                                                                                          |
| F23 empty/recovery               | Empty/Notice, settings/store/storage              | C self-scoped messages and retry/cancel; real recovery links and executed recovery regressions.                                                                                                               |
| F24 marketing/motion             | CandidateHero/HomeRoles/ConfettiBurst             | Real home/submission. Local exceptions and reduced-motion/text feedback retained; no portable marketing contract inferred.                                                                                    |
| F25 unused supporting primitives | ui/Badge/Label/Separator/Skeleton                 | Present in source; no new consumer or acceptance of nonexistent loading/dark-mode flows. No catalog expansion required.                                                                                       |

## Accepted contextual rules

| Area               | Current rule                                                                                                                | Boundary / superseded alternative                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Answer             | Paper `#f4f0e5`, light `#fdf9ef` hover/focus; invalid `#f9e9d9` / `#faf1dd`, rose `#892746`; static inner bottom focus line | Earlier comparison shades/focus concepts are historical.                                             |
| Consent            | Green contour/fill; invalid rest `#f9efd9`, hover/focus `#faf1dd`; disabled checked hover `#1b5148`                         | Distinct answer/consent invalid-rest shades accepted locally; no forced normalization.               |
| Secondary/CV       | Light-paper hover; contextual secondary lift; CV 2px up/left, 3px green shadow, press shadow 1px                            | Older CV 3px/4px values and mint hover superseded. No generic shadow permission for all links.       |
| Canvas/panels      | Base paper for frame/chrome/gutters; light paper, thin ink contour and 4px corners for framed content                       | Panel geometry does not prescribe every control.                                                     |
| Taxonomy/workplace | Closed confirmed enum versus free-text suggestions with explicit search commit                                              | Earlier separate taxonomy popup search/readOnly selection superseded. Keep current Base UI behavior. |
| Typography/palette | DM Sans interface/Fraunces accent; existing marketing Fraunces/Manrope/Caveat and HeroLink `#a8c7fa`                        | Accepted host exceptions. Rejected `#3156C9` remains outside the portable direction.                 |
| Focus/portals      | Contextual form/search/select/tab/navigation focus and self-scoped portaled content                                         | No universal focus, shadow or radius token replacement.                                              |

## Findings, evidence and remaining boundary

NH-01–05 and JRA-01/JRA-02 are resolved for their documented scopes; see
[host status](../STATUS.md). Earlier task reports/JSON remain historical evidence.
Required confirmed choices and full-label checkbox naming are implemented and
covered by focused browser regressions. 3B closes their human visual/local-API
acceptance; it does not establish spoken announcements.

Stage 3C still requires a real reader/browser session. Browser keyboard/semantic
checks and Axe are separate evidence. The
[local closure record](../../tasks/editaurus-local-closure.md) records final checks,
reader limitations and the remaining human checklist. Publication/asset holds in
[assets](assets.md) remain. No external source/asset or course material was copied.
The portable skill was updated in 2G; the 3E comparison needs only accepted generic
deltas, not this host's routes, enums or workflows.
