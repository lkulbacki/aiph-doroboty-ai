# DoRoboty.ai — AIPH3 prototype

A browser-local job marketplace for participants to extend and test. It uses React, TypeScript, Vite and Base UI components. [Editaurus](docs/design-system/editaurus/README.md) is the visual contract for new and migrated screens.

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

Open http://127.0.0.1:3001. The baseline workflow runs without configuration. Package installation requires access to the npm registry.

Select Anna or Marek as a candidate, Karolina or Tomasz as an employer, or the instructor. Publish a job, apply, switch person and record the employer decision. Changes survive reload in this browser. Settings provide export, import and reset. Keep one editing tab per browser origin: other tabs are read-only. Close the editing tab and reload another tab to hand over. Writes require a current browser with Web Locks on localhost/127.0.0.1 or HTTPS. The job-description helper and Match Score use prepared examples. Use example CVs and synthetic scenario data.

### EXP-01 with OpenRouter

Create `.env.local` in the repository root next to `package.json`. Set
`OPENROUTER_API_KEY` to your OpenRouter key, then restart `npm run dev`.
`.env.example` lists optional model overrides. The defaults are
`openai/gpt-oss-20b` for questions and summaries and
`openai/whisper-large-v3-turbo` for transcription. Text requests for the
default model prefer Groq and can fall back to DeepInfra. To try Qwen for text, set
`OPENROUTER_TEXT_MODEL=qwen/qwen3-30b-a3b-instruct-2507`.

The local Vite server sends the offer title, brief and description when the
employer requests suggestions. Submitting a voice answer sends the recording
for transcription and the transcript for summarization. Recordings are also
saved in the browser scenario and included in exports. Use fictional examples
and give the browser microphone permission when testing voice. Starting Vite
with the key enables the AI calls. Both AI actions share one active request,
10 attempts per minute and 100 attempts per Vite process. Rejections preserve
form inputs and show a message. Restarting Vite resets these local limits;
check provider spending before restarting and set an account budget separately.
These attempt limits do not guarantee a currency spending ceiling. A static copy of `dist/` supports manual
questions and written answers.

## Vercel hosting

Use Node.js 24, the Vite preset, `npm ci`, `npm run build` and output directory
`dist` (also recorded in `vercel.json`). Import the intended Git repository and
select `main` as the production branch. Hash routes need no SPA rewrite.

Set `OPENROUTER_API_KEY` as a server-side Secret for Production and Preview;
optional model overrides are listed in `.env.example`. Redeploy after changing
variables. Never prefix the key with `VITE_`. The two `api/project-ai` entries
run as Node.js Functions, share the existing schemas and provider operations,
and allow up to 120 seconds for transcription followed by summarization.

Hosted AI endpoints are public prototype operations. The origin check rejects
cross-origin browser requests; it is not authentication. Hosted requests have
no global attempt counter. For this experiment the owner uses an OpenRouter
key capped at $1 without automatic renewal; configure the provider budget
before enabling hosted AI. The local Vite process limits described above do
not apply across Vercel instances. No additional rate-limit service is required.

First deploy `main` unchanged, then review a branch Preview before merging AI
hosting changes. Verify questions, voice, provider-error recovery and microphone
permission on HTTPS using synthetic data. A successful build does not establish
that the hosted AI provider works. Browser scenarios remain device-local.

## Build and verify

```sh
npm run build
npm run preview
./scripts/verify
```

The static output is dist/. Browser checks require an already provisioned Playwright Chromium; starting the app never installs it. See [participant guide](docs/PARTICIPANT_GUIDE.md), [architecture](docs/architecture.md), [current features](FEATURES.md) and [case protocol](docs/case/CASE_PROTOCOL.md).

To distribute a baseline participant package, run npm run package:participant -- /absolute/output/directory. This excludes Git history and instructor source material. Never distribute this repository’s history as a stage-safe packet.
