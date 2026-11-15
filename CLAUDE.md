@AGENTS.md

Start with npm ci and npm run dev. Do not infer work from historical course material. Keep durable task notes in docs/tasks and review the actual diff before claiming completion.

## UI work is based on editaurus

Read [the editaurus project guide](docs/design-system/editaurus/README.md) first. editaurus is the target for new and migrated surfaces; the running app still uses Poster People. The documents below map current implementation and behavior, not the visual target for a migrated surface.

Read [current integration instructions](docs/design-system/README.md), [host implementation rules](docs/design-system/IMPLEMENTATION.md) and [application acceptance checklist](docs/design-system/VERIFICATION.md) when changing an existing screen. The current host adaptation is implementation to verify, not an alternative visual authority.

Adapt editaurus into existing React features, Base UI `render` components and host tokens; preserve hash routing, Zod, persona data, localStorage and application/employer workflows. Scope visual changes to the requested task. Follow the current ownership map and verify actual anatomy, type, state, and behavior on a real screen; updating guidance alone does not verify the running UI.

From the repository root: `npm run design-system:dev` previews the retained Poster People kit at port 8952; `npm run design-system:check` verifies its 67 original files and examples. The main app still runs with npm run dev at port 3001. Keep docs/design-system/agent-kit immutable. Validate new UI at desktop/mobile widths and with keyboard/state checks, run ./scripts/verify, update FEATURES.md for actual behavior changes and report actual evidence.
