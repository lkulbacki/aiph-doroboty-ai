# editaurus — application contract and migration guide

Editaurus is the target visual contract for this application. **shadcn/ui is the
component foundation; editaurus defines its appearance, variants, states and usage.**
Use the existing Base UI-compatible implementation and preserve accepted visuals
and behavior. See the [current coverage/acceptance ledger](coverage.md) before
choosing a route or component; it replaces stale “current slice” summaries.

The [foundation report](foundations.md) records current values, browser samples,
portal boundaries and the proposed bounded action pilot; its proposals are not
implemented token changes.

## Authority and architecture

1. The user’s current instructions and project product/security boundaries apply
   first. This repository records the application’s editaurus contract. The
   [decision history](decisions.md) retains prior stages; later explicit
   corrections supersede earlier values without erasing the history.
2. `src/components/ui` remains the single locally owned shadcn-compatible
   foundation over Base UI/native HTML. Existing `components.json` uses
   `base-nova`; local wrappers have modifications and are not all certified as
   identical to an upstream revision. Preserve Base UI’s `render` API and current
   exports. Do not reinitialize, run CLI overwrite, add dependencies or create a
   second primitive implementation to claim shadcn adoption.
3. `src/components/editaurus` and scoped host visual recipes specify editaurus
   states and presentation. Keep accepted paper/ink/type/interaction treatments
   rather than reverting to the default shadcn theme. Consolidating tokens or
   introducing a missing wrapper requires a separately approved component slice.
4. Shared host compositions and `src/features` own application behavior. Preserve
   React/TypeScript/Vite, HashRouter, Zod, local state transitions, saved jobs,
   drafts/consent/submit, immutable submitted CV and identity, recruiting stages,
   list/map/filter/sort/pagination, import/export/reset and recovery. A similarly
   named shadcn component does not replace these domain contracts.
5. `src/features/editaurus/components-page.tsx` demonstrates the same production
   owners with local-only synthetic examples. It is a needs-based catalog with foundations/components/pattern navigation, not a
   second control implementation or a requirement to invent unused variants.
6. The portable editaurus skill receives only accepted reusable rules after
   real-screen verification and catalog alignment. Domain routes, enums,
   CV matching, recruitment operations and exceptions stay in this repo. The
   skill/local studies are not runtime/build dependencies.

The shadcn decision authorizes the architectural direction, not an automatic
component replacement. Prefer its Base UI branch, compare local APIs/behavior
and record an exact upstream revision before a proposed replacement. Assess
navigation semantics individually: current upstream guidance and local
`Button render={<Link />}` usage need comparison against the installed version;
keep render composition for non-link primitive integrations. The
[stage 1 inventory](../../tasks/editaurus-stage-1-inventory.md) records the dated
upstream comparison and per-family cost/risk, not universal conformance.

## Visual contract and scope

Core palette: ink `#102e2a`, dark green `#103d35`, base paper `#f4f0e5`, pink
`#f282b7`, yellow `#f1f36a`, mint `#a9dcc6`. DM Sans is the interface/heavy headline
face and Fraunces italic the editorial accent. Local font use and publication
boundaries are recorded in [assets](assets.md). The home retains a deliberate
marketing composition using Fraunces/Manrope/Caveat; it is not a silent change to
interface defaults or a portable rule accepted for every product.

Page/workspace canvases use base paper. Framed panels use light paper `#fdf9ef`,
a 1 px ink border and 4 px corners. Flat offer rows use separators and category
interaction colors. Form controls have their own contours and states; panel
geometry does not imply a universal 1 px/4 px control treatment.

The accepted form focus treatment uses a static 3 px inner bottom line, ink for
valid light fields and dark rose for invalid fields, with a full `Highlight`
outline in forced colors. Search/sort and tab/navigation focus are contextual
patterns, not automatically the same form-field state. Hero actions have two
outlined accent layers and hover/focus/press states; non-touch hover changes the
pair, touch keeps it. Secondary actions and CV links have separately recorded
lift states. See the ledger’s current-rule table and the component notes:
[hero](components/hero-action.md), [secondary](components/secondary-action.md),
[answer](components/answer-field.md), [checkbox](components/consent-checkbox.md),
[CV](components/cv-row.md) and [feedback](components/form-feedback.md).

Stage 3B acceptance (2026-11-22) covers the current application/catalog appearance
and local component contracts recorded in the ledger, including existing
marketing and secondary/CV-shadow exceptions. Those remain host choices, not
universal portable rules. Future variants, replacements and real reader behavior
require their own evidence.

## Host contracts and historical material

The host [integration guide](../README.md), [owner map](../IMPLEMENTATION.md),
[component catalog](../HOST-COMPONENTS.md), [records](../RECORDS.md),
[verification checklist](../VERIFICATION.md) and [findings](../STATUS.md) retain
behavior/API evidence. Preserve their focus, route, data, salary units,
CV snapshot, reading-order and recovery contracts. Legacy Geist Serif,
pink salary pill and rounded-panel measurements do not set migrated visuals.

The immutable `../agent-kit` is historical. Its check verifies reference integrity,
not editaurus. Editorial v9 and local studies are research inputs, not functional
requirements to replace real routes with demo dialogs/controllers. Record a
portable rule, rationale, states and evidence before adopting it. Do not copy
local studies, course materials, full prototypes or assets without provenance and
publication terms; the [asset holds](assets.md) remain in effect.

## Preview, validation and next scope

Run Node.js 24 and `npm run dev` on port 3001. Open
`/#/design-system/editaurus` for the partial state catalog and real routes listed
in the ledger. The separate `npm run design-system:dev` on 8952 is Poster People.

Migrate by explicit route/component scope. Keep a coherent treatment within that
surface and inspect all shared consumers, portals, desktop/mobile, keyboard/focus,
long/missing content, errors and recovery. Verify new patterns on real tasks
before accepting their component documentation/catalog examples. Implementation
stages run `./scripts/verify` and a separate review; report actual execution and
remaining limits. Review FEATURES and update it for behavior changes in the same
change, without treating source coverage as test/deployment evidence.

[Handoff](handoff.md) names the current local closure status. Stages 1, 2A–2G
and 3A are implemented; the user accepted 3B and authorized remaining local work.
The ledger separates actual validation from the real-reader and publication
boundaries. There is no deployment or publication authorization.
