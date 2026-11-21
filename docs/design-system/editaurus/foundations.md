# Editaurus foundations — measured application contract

Date: 2026-11-21. Stage 2B is a documentation and measurement slice, not a token
migration. Read the [coverage/acceptance ledger](coverage.md) for scoped human
acceptance and the [stage record](../../tasks/editaurus-stage-2b.md) for execution.
Measurements do not accept pending variants or close historical findings.

## Evidence and scope

**S** means current source declaration, **B** a current browser observation,
**H** a recorded decision summarized in the ledger, and **P** a proposal.
CSS declarations are not proof of rendered behavior; a sampled render does not
prove every consumer or accessibility mode.

B: in-app browser at 1244 × 1343 and temporary 390 × 844 viewport. The narrow
browser had a 375px document client width due to its scrollbar. Catalog card
and form widths below refer to that client area. Catalog, real Staff AI Engineer
application, settings confirmation and listing sort were sampled. No application,
draft, reset, import or export was submitted. Persona remained Anna. Temporary
viewport was reset. Current real-form route came from the catalog link. Settings
was reached through menu navigation after `/app/ustawienia` returned unavailable;
the actual route is `/app/settings`.

No manual 320px/adjacent-breakpoint sweep, record-page computed measurement,
portal-specific forced-colors/reduced-motion emulation, touch-device test, zoom audit,
screen-reader test or independent font-file rendering audit was performed here.
Those remain implementation acceptance gates, not implied passes. Browser font
measurements report resolved CSS family, not proof of each glyph's selected face.
Stage 1's record observations remain separate evidence. Stage 2B's full automated
gate passed 48 Chromium tests, including existing 320px home/filter, forced-color
action/answer and reduced-motion home/submission checks. These assertions do not
cover the full foundation/portal mode matrix above.

## Palette and surface roles

S owner: `src/app/editaurus.css`, `.editaurus-surface`. These variables are scoped,
not global replacements for `tokens.css` or the immutable historical kit.

| Role                        | Current value                                    | Contract and status                                                                       |
| --------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Ink                         | `--ed-ink: #102e2a`                              | Text, contours and strong boundaries; H core palette                                      |
| Action green                | `--ed-green: #103d35`                            | Primary fill, active state and secondary text; H core palette                             |
| Canvas/rest                 | `--ed-paper: #f4f0e5`                            | Full migrated frame, chrome, field rest; H later paper correction                         |
| Light panel                 | `--ed-paper-light: #fdf9ef`                      | Framed content; also valid field hover/focus and secondary hover; H scoped corrections    |
| Accents                     | pink `#f282b7`, yellow `#f1f36a`, mint `#a9dcc6` | Accent/shadow roles; domain category assignment stays in application                      |
| Quiet divider               | `rgb(16 46 42 / 30%)`                            | Repeated boundaries; not the universal text color                                         |
| Invalid field               | `#f9e9d9` → `#faf1dd`                            | Rest → hover/focus; rose contour/focus `#892746`; H answer field, wider API still pending |
| Disabled quiet field/action | `#eae8de` / `#50605b`                            | S implementation; not all disabled actions share this appearance                          |

B: catalog panel was `#fdf9ef`, 1px ink border, 4px radius, no shadow. Valid answer
rest was `#f4f0e5`; clicked focus was `#fdf9ef` with inset ink 3px bottom line.
Invalid rest/focus matched the two colors above with rose 3px focus line. Real
application form panel matched light paper, 1px ink and 16px narrow padding.

H/P boundary: the ledger preserves accepted canvas/panel corrections without
accepting every route or the complete textarea/consent/CV APIs. Checkbox invalid
rest is currently `#f9efd9`, different from textarea `#f9e9d9`; do not silently
normalize it. Submitted hero remains green while disabled secondary is gray;
employer unavailable hero has a separate gray override. Status/success, pending,
submitted and unavailable must stay distinguishable by text and behavior.

## Typography and geometry

S: DM Sans variable normal 100–1000 is locally declared in `editaurus.css` with
`font-display: swap`. Fraunces normal/italic 600–700, Manrope and Caveat are local
faces declared in `candidate-hero.css`. Listing uses DM Sans heavy headings and
Fraunces italic emphasis. Home's Fraunces/Manrope/Caveat composition and pale-blue
`#a8c7fa` shadow are application exceptions, not a portable baseline. Asset rights
remain governed by [assets.md](assets.md); no additional rights are inferred.

| Context                | S declaration / B sample                                              | Implication                                                             |
| ---------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Catalog title          | clamp 38–72px, weight 900, line 1, tracking −.06em; B 72px at desktop | Catalog recipe, not universal page heading                              |
| Listing title          | clamp 48–99px, 6.5vw, weight 900, line .985, tracking −.07em          | Keep expressive page-specific scale                                     |
| Interface sample       | B DM Sans 15px / 21px, action weight 800, answer weight 500           | Size/leading still inherit host primitive values                        |
| Panel                  | 1px / 4px; B card padding24, gap18                                    | Do not convert every field to panel geometry                            |
| Hero                   | min-height48, 1px / 4px; B height51, padding14px 29px                 | Border + line-height + inherited host padding exceed minimum            |
| Secondary              | min-height48, 2px / 4px; B height53, padding14px 29px                 | Setting exact height48 would change measured rendering                  |
| Answer                 | 2px / square; B padding14; catalog height120, real form180            | Catalog intentionally overrides minimum height                          |
| Consent checkbox       | B 22 × 22, 2px green, square                                          | Label is part of interaction target; glyph size is not full target size |
| Searchable editor enum | S min-height52, 1px square, input padding12px 16px                    | Different recipe from 2px answer/nonsearch select; pending API          |
| Workspace              | S sidebar244px, full paper frame; nav min-height44                    | Chrome and route-body acceptance remain separate                        |

S: host spacing in `tokens.css` remains 5/10/14/19/29/39/58px; editaurus recipes
also use 8/12/16/18/20/24px and fluid clamps. This is a mixed implementation,
not an accepted single spacing scale. P: preserve exact recipe values first;
introduce semantic spacing aliases only when a consumer audit proves equivalence.
Do not round 14→16 or 29→32 across primitives as a cleanup.

S: marketplace container max1380 with inline `clamp(18px,4vw,64px)`;
catalog `min(100% - 32px,1080px)`. B desktop catalog width1080/card346.66;
narrow catalog/card343, answer293. Real narrow form339/answer305/full-width hero305.
Document scrollWidth equaled clientWidth375 for catalog and real application;
this is a sampled no-overflow result, not a complete mobile acceptance.

## Focus, motion and state recipes

| Family          | Current source / observed behavior                                                                | Review requirement                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Hero            | S hover/keyboard lift −3px; double shadow offsets4/8; focus2px offset11; active recipe2/4 shadows | Preserve room for outer layers, clipping and contrast on dark home background; no blanket focus ring replacement |
| Secondary       | B settled keyboard lift −3px, green shadow4px, outline2px offset3                                 | Preserve keyboard visibility and wrapping; do not measure transition mid-frame                                   |
| Answer          | B focus inset bottom3px, valid ink / invalid rose; outline style none                             | Forced colors requires an independent outline fallback                                                           |
| Checkbox/CV     | S focus outline2px offset3; CV hover lift−2/shadow3 and active shadow1                            | Keep consent state and PDF/text fallback contracts; full API acceptance pending                                  |
| Search/sort     | S light field focus/open, inner3px; menus highlight light paper                                   | Portable v9 dark focus was superseded for these application fields                                               |
| Editor combobox | S focus-within/open inner3px; toggle own inset outline                                            | Confirm closed enum, clearing, popup boundaries and required/disabled/error states before reuse                  |
| Record tabs     | S `editaurus-record.css` outline2px and contextual paper state                                    | Source-audited, not newly measured in browser here                                                               |

S: editaurus action transitions are160ms. Its reduced-motion rule removes those
transitions, while hover/focus/press transforms remain; it does not remove every
spatial state. Listing removes selected transitions; home JS checks reduced motion
for parallax/scroll. `globals.css` still declares smooth scroll. These are scoped
mechanisms rather than a proven complete reduced-motion policy.

Stage 2C correction: the earlier review missed the global important reduced-motion
rule in `workspace.css`. It clamps animation and transition durations to 0.01ms,
iteration count to 1 and scroll behavior to auto across elements/pseudo-elements.
The action pilot measured `1e-05s` transitions, so the effective duration is not
exactly 0s. No motion code changed. This narrows the earlier gap: portal visual/
focus tests still need their own coverage; absence of a local reset is not evidence
that portals ignore the global preference.

S: Select/Dialog/AlertDialog wrappers retain utility animations and legacy motion
references. `--gui-motion-small` and `--gui-motion-large` contain duration **and**
a linear timing function; some utilities use them as `animation-duration` or
`transition-duration`, which accept duration values rather than a full shorthand.
P: inspect computed duration/timing under normal/reduced modes before selecting a
fix; do not describe the nominal 400/600ms as a measured effective animation.
No animation fix is included in this stage.

S: forced-colors fallbacks exist for hero/secondary/answer, listing filters and
highlighted options, record tabs/stages and editor combobox focus. This does not
establish comprehensive coverage. Verify disabled/checked/error and portal focus
in forced colors; do not rely solely on colored fills or box shadows.

## Portal and cascade boundaries

`globals.css` imports legacy tokens/styles first, then editaurus, record/listing/
workspace recipes, then home and generic interactions. `@theme inline` still maps
font, radius and spacing utilities to host tokens. A local `.editaurus-surface`
class does not erase all utility font/padding/animation declarations. Generic
hover rules use `--control-hover-bg/text`; retain explicit recipe values so they
do not reveal the legacy pink hover.

| Portal                     | Current owner and scope                                                                  | Current evidence / risk                                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Sort                       | `ui/select.tsx`, marketplace passes `editaurus-surface editorial-picker-menu` onto Popup | B DM Sans, paper, green1px, radius4, padding5, shadow none; class restores variables inside detached subtree                                  |
| Searchable enum            | `ui/form-select.tsx`, Combobox.Popup gets the same two classes                           | S independent scope, positioner z50/below8px, collision side disabled; hooks `triggerClassName/contentClassName` ignored in searchable branch |
| Workplace search           | Listing Autocomplete and popup recipe                                                    | Separate free-text query and confirmed URL/history search; never replace with closed enum Select                                              |
| Reset confirmation         | `confirm-dialog.tsx`, Popup gets `editaurus-surface editaurus-confirm`                   | B narrow width343 at x16, light paper, DM Sans, 1px/4px, padding24, z50; initial focus Anuluj; Escape returned to Resetuj scenariusz          |
| Mobile filter / CV preview | Shared responsive Dialog / CV composition                                                | Retain role, focus/close, overflow and variant boundaries; not newly measured in this stage                                                   |

P: keep explicit editaurus scope on each portaled surface. If scoped shadcn aliases
are later introduced, apply them to the portal content too; never depend on route
ancestor inheritance across the portal. Keep primitive focus/positioning behavior
and render composition; visual scope is not a reason to replace Base UI controllers.
No z-index redesign follows from the sampled z50; nested overlays require testing.

## Foundation architecture and primitive deltas

Official sources rechecked 2026-11-21: shadcn recommends semantic CSS-variable
surface/foreground pairs in its [theming guide](https://ui.shadcn.com/docs/theming).
P: map application roles into that vocabulary within migrated scope, keeping
component recipes for two-layer shadows, inner field focus and contextual shape.
Do not rewrite global `--background`, `--radius` or `--gui-*` while legacy consumers
remain. Such mapping is a future implementation proposal, not code in this report.

| Candidate alias                  | Proposed scoped source        | Deliberate limitation                                                            |
| -------------------------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| background / foreground          | paper / ink                   | Canvas only; panel is lighter                                                    |
| card / card-foreground           | paper-light / ink             | Keep current panel contour/radius recipe                                         |
| popover / popover-foreground     | paper / ink                   | Confirmation uses light paper as its own recipe                                  |
| primary / primary-foreground     | green / paper                 | Home yellow action remains explicit variant                                      |
| secondary / secondary-foreground | paper / ink                   | Hover light-paper, tactile state recipe retained                                 |
| destructive                      | rose                          | Error surface and contrast pair remain separate; no global destructive remap yet |
| border / ring / radius           | No universal mapping proposed | Dividers, control borders and focus geometry are context-specific                |

| Primitive            | Current base/local delta                                              | Upstream relation and bounded recommendation                                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button               | Base UI + CVA, host sizing/color utilities; Hero/Secondary recipes    | [Base Button](https://ui.shadcn.com/docs/components/base/button) offers same named variants/sizes; retain local recipe geometry, audit actual links before adapting any consumer                   |
| Input                | Base UI Input with host utilities; local editaurus class on consumers | Preserve native validation and forwarded props; adapt appearance only in approved scope, not every input by default                                                                                |
| Textarea             | Native textarea wrapper + editaurus pass-through class                | Retain owner/API; make inherited size/leading/padding explicit only after comparison; no new text editor                                                                                           |
| Checkbox             | Base UI Checkbox wrapper + scoped checked/invalid/disabled CSS        | Retain labels, form submission and disabled semantics; reconcile distinct invalid shade only by human decision                                                                                     |
| Select               | Base UI wrappers, portal/scroll arrows and host utility styles        | [Base Select](https://ui.shadcn.com/docs/components/base/select) exposes equivalent composition/alignItemWithTrigger; retain below-field choice; audit arrows/typography/animation and long labels |
| Dialog / AlertDialog | Base UI wrappers, portal/backdrop, local confirmation recipe          | Keep focus/pending/error behavior; include backdrop and button consumers, not just light panel                                                                                                     |

Current local configuration is base-nova with Base UI 1.8.0 and lockfile shadcn 4.23.0,
as inventoried in stage1. Neither establishes an exact generated component revision.
No exact upstream source revision was selected here; **any source replacement or
API delta is blocked until an exact Base UI-branch upstream snapshot and local diff
are recorded**. Current documentation URLs are comparison evidence, not a pinned
registry revision. No CLI installation, regeneration, dependency change or source
replacement was run.

## Proposed next small slice and stop gates

The [stage1 sequence](../../tasks/editaurus-stage-1-inventory.md) remains 2C actions,
then fields/feedback, choices/dialogs, domain compositions and finally skill 2G.
Do not accept every component or promote application exceptions into the skill.

| Slice                   | Scope / ready criterion                                                                                                        | Verification                                                                                                                   | Human decision / stop                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| 2C preflight            | Inventory action consumers and DOM link/button semantics; pin exact upstream Base UI branch only if a code delta is needed     | Home, form, employer editor, settings, records, CV and shell; current DOM roles, Enter/Space and modifier navigation           | Approve native link handling and action-state taxonomy; stop if version/API cannot be reconciled                    |
| 2C action/catalog pilot | Existing production HeroLink, secondary/danger/quiet/back owners demonstrated without scenario writes; no global token rewrite | Desktop390/320 and adjacent breakpoints, long labels, normal/reduced motion, forced colors, keyboard and disabled; full verify | Accept measured geometry including51/53px heights or explicitly request change; stop after actions, before fields   |
| Later foundation delta  | Only scoped aliases/explicit dimensions justified by the pilot; export names/props and unrelated consumers unchanged           | Before/after computed style plus real screen comparisons; include portals and records missing here                             | Approve shape/focus exceptions and any actual visual change; stop if inherited host coupling affects another family |

Estimated relative cost/risk: action preflight small/medium; action catalog medium/
medium due to broad consumers; global alias remap large/high and excluded. Select/
Combobox consolidation medium/high due to enum versus free-text and portal/clear/
scroll behavior; keep it a later family. Component exports/API acceptance and
pending route acceptance remain in the ledger. The next authorized work should
be one action pilot, not a library-wide migration.
