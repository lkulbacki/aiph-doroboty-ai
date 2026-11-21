# GUI — DoRoboty.ai design direction

**editaurus is the application’s target visual contract. shadcn/ui is its component
foundation, using the existing Base UI-compatible implementation.** Begin with the
[editaurus guide](docs/design-system/editaurus/README.md) and the
[current coverage and acceptance ledger](docs/design-system/editaurus/coverage.md).

Public marketplace screens and many candidate/employer workspace screens already
use scoped editaurus treatments. The ledger distinguishes implemented migration,
recorded acceptance, provisional component APIs and remaining legacy surfaces.
Approval of documentation does not accept every implemented screen or variant.

## Read and preview

1. [Editaurus guide](docs/design-system/editaurus/README.md),
   [current ledger](docs/design-system/editaurus/coverage.md),
   [decision history](docs/design-system/editaurus/decisions.md) and
   [handoff](docs/design-system/editaurus/handoff.md): architecture, current scope,
   superseded rules and the next review point.
2. [Host integration guide](docs/design-system/README.md),
   [implementation map](docs/design-system/IMPLEMENTATION.md),
   [host components](docs/design-system/HOST-COMPONENTS.md),
   [record/CV APIs](docs/design-system/RECORDS.md),
   [verification checklist](docs/design-system/VERIFICATION.md) and
   [historical findings](docs/design-system/STATUS.md): retain useful component,
   route, state, accessibility and recovery contracts. Their Poster People visual
   measurements apply to legacy surfaces, not migrated editaurus surfaces.
3. Run `npm run dev` at `http://127.0.0.1:3001/`. The live partial editaurus catalog
   is `/#/design-system/editaurus`; it shares the form’s hero/secondary actions,
   answer field, checkbox and CV owner, plus feedback styles. The
   [action pilot](docs/design-system/editaurus/components/actions.md) adds native
   navigation, danger/unavailable and context-return examples. Choices, dialogs,
   host recovery and domain compositions are now demonstrated by their production
   owners; live list/map/recovery controllers remain on real routes. It is not a complete
   library or a substitute for exercising real product flows.
4. For historical comparisons only, consult the immutable
   [Poster People kit](docs/design-system/agent-kit/design.md) and its
   [API](docs/design-system/agent-kit/components/API.md). `npm run design-system:dev`
   serves that separate kit on port 8952. `npm run design-system:check` verifies
   the kit, not the running editaurus catalog or visual acceptance.

## Current implementation and migration

- Retain React/TypeScript/Vite, HashRouter, Base UI’s `render` composition,
  Zod validation and existing browser-local domain operations.
- Keep one foundation in `src/components/ui`: locally owned shadcn-compatible
  components over Base UI/native HTML. `components.json` already selects
  `base-nova`. Configuration does not prove that each local component is an
  unchanged shadcn component; review local modifications and actual consumers.
- Editaurus wrappers/recipes specify accepted appearance, variants, states and
  usage. Features and shared host compositions own routes, filters, snapshots,
  CV matching, saved jobs, drafts, recruiting history and recovery.
- Prefer existing owners. Do not reinitialize, overwrite with CLI-generated files,
  add a parallel primitive library/dependency or reset styling to shadcn defaults.
  Audit actual link semantics before changing `Button render={<Link />}` consumers;
  preserve render composition for the controls that need it.
- The catalog imports production owners and uses isolated synthetic examples.
  Verify new patterns on real screens before accepting their API or exporting
  reusable rules to the portable skill. The skill is a later, separate stage;
  it contains no DoRoboty domain logic and is not a build dependency.
- Keep `docs/design-system/agent-kit` unchanged. Do not import its standalone
  controllers/reset or replace working product data with demonstration fixtures.
  Preserve search outside mobile filters, copied section URLs and focus after
  chip removal. Test long/missing content, errors, dialogs and recovery.
- Each authorized implementation slice records its scope, affected shared
  consumers/portals, actual `./scripts/verify` results and separate review.
  Passing tests does not imply visual acceptance, deployment or publication.
