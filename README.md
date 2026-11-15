# DoRoboty.ai — AIPH3 prototype

A frontend-only job marketplace for participants to extend and test. Built with React, TypeScript and Vite, using Base UI components. [editaurus](docs/design-system/editaurus/README.md) is the target visual direction for new and migrated screens; the candidate application form has a first pilot and the rest of the running app currently uses Poster People.

## Design system — start here for UI work

Read the [editaurus migration guide](docs/design-system/editaurus/README.md) for the target direction, current coverage, and migration boundary. The Poster People documents below describe the existing implementation and remain required context when touching its components or behavior.

The first editaurus component preview is available at `/#/design-system/editaurus` in the running app. It shows primary and secondary actions plus the multiline candidate answer field, remains a partial public catalog, and links to the real application task.

Read [project integration instructions](docs/design-system/README.md), [host implementation rules](docs/design-system/IMPLEMENTATION.md) and [application acceptance checklist](docs/design-system/VERIFICATION.md), then [design.md](docs/design-system/agent-kit/design.md), [component API](docs/design-system/agent-kit/components/API.md) and the relevant [human documentation](docs/design-system/agent-kit/reference/index.html). The complete 67-file kit is stored under docs/design-system/agent-kit, including reusable CSS/JS, component states, listing/offer examples, screenshots, Geist Serif with license and illustration. No other chat or global skill is required.

```sh
npm run design-system:check
npm run design-system:dev
```

With Node 24, the first command verifies the preserved kit and examples; the second serves a separate local preview at http://127.0.0.1:8952/. No kit installation is needed. The main app uses port 3001 as below.

For editaurus work, preserve application behavior and hash routing; do not replace product state with standalone demo fixtures/controllers. Compare the affected screen with editaurus references and verify its real interactions. The Poster People kit check only establishes integrity of the retained historical kit. See the migration guide for the active rules and the legacy integration guide for current ownership.

## Run

Requirements: **Node.js 24 and npm**.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3001. No environment file, account, database or additional service is required. Package installation requires access to the npm registry.

Select Anna or Marek as a candidate, Karolina or Tomasz as an employer, or the instructor. Publish a job, apply, switch person and record the employer decision. Changes survive reload in this browser; settings provide export, import and reset. AI and scores simulate prepared scenarios. Use example CVs only.

## Build and verify

```sh
npm run build
npm run preview
./scripts/verify
```

The static output is dist/. Browser checks require an already provisioned Playwright Chromium; starting the app never installs it. See [participant guide](docs/PARTICIPANT_GUIDE.md), [architecture](docs/architecture.md), [current features](FEATURES.md) and [case protocol](docs/case/CASE_PROTOCOL.md).

To distribute a baseline participant package, run npm run package:participant -- /absolute/output/directory. This excludes Git history and instructor source material. Never distribute this repository’s history as a stage-safe packet.
