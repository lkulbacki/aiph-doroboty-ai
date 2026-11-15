# GUI — DoRoboty.ai design direction

**editaurus is the target for new and migrated UI.** Start with [its project guide](docs/design-system/editaurus/README.md). The candidate application form pilot has been accepted; its hero action and secondary save-draft action are accepted, while the extracted answer field awaits review. These appear in the first component preview. The rest of the running app retains Poster People. The Poster People instructions below document the current implementation and remain useful for route, component, state, and regression checks; they do not set the visual target of an editaurus task.

The current implementation follows **Poster People**. Its [project instructions](docs/design-system/README.md) explain the existing React/TypeScript/Vite adaptation. Keep its behavior and ownership contracts while migrating each approved scope to editaurus.

## Read and preview

1. [Project integration guide](docs/design-system/README.md): authority, React/Base UI mapping, routes/state, assets and completion criteria.
2. [Host implementation rules](docs/design-system/IMPLEMENTATION.md), [React component catalog](docs/design-system/HOST-COMPONENTS.md), [record/CV APIs](docs/design-system/RECORDS.md), [acceptance checklist](docs/design-system/VERIFICATION.md) and [status/open findings](docs/design-system/STATUS.md): reusable owners, actual contracts, URL/focus rules, breakpoint values and regression scenarios.
3. [Agent entry point](docs/design-system/agent-kit/design.md): visual hierarchy, composition, exact standalone imports and extension boundaries.
4. [Component API](docs/design-system/agent-kit/components/API.md) plus relevant [human reference](docs/design-system/agent-kit/reference/components.md): anatomy, variants, states and evidence.
5. `npm run design-system:dev`: local catalog, full listing and offer on port 8952. `npm run design-system:check` checks the immutable kit. No global skill or extra installation is required.

## Current implementation and migration

- Preserve the requested scope, React/TypeScript/Vite, hash routes, Base UI's `render` composition, Zod/local data operations and current application workflows.
- Use the editaurus typography, color, contour, and state rules for a migrated surface. The Geist Serif and Poster People values below describe legacy screens only.
- Adapt host tokens and existing primitives together. Do not paste the kit's global reset or vanilla controllers into React, substitute example data for product state, or create a parallel button/card library.
- Keep docs/design-system/agent-kit unchanged as a historical reference; implement product UI in src/ and the host theme layer. Existing token names do not establish an alternative visual target.
- Compare editaurus references with the migrated screen and test long content, missing salary/marks, keyboard focus, selection, dialogs and recovery. Run ./scripts/verify and report actual checks. The original kit report does not verify a new React screen.

The running application has a host adaptation. Follow the implementation map rather than creating parallel controls. Keep Search outside mobile filters, preserve copied section URLs under HashRouter, and manage focus after chip removal. Record actual evidence and partial findings; preserve old audit artifacts in separate task-specific directories.
