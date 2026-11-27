# Architecture

One React/TypeScript application is built by Vite into static files. HashRouter renders routes under /#/; route parameters created in the browser require no hosting rewrites. New and changed UI uses local CSS tokens and Base UI primitives under the [Editaurus contract](design-system/editaurus/README.md). Vite dev and preview offer an optional local OpenRouter proxy for question suggestions and voice analysis. The proxy validates the bounded payload and holds the provider key. Scenario data is stored by the browser.

## Data flow

JSON marketplace/person fixtures → initialState → PrototypeProvider → feature views. Local operations go through transition with shared Zod schemas and explicit role/ownership/transition checks for coherent simulation. All roles still have access to the same browser data; these checks are not security.

Candidate source notes, generated draft and approved application are distinct fields. Submission snapshots the CV, candidate name, job title, scenario score and summary. A project answer snapshots its question and the written answer or recording, transcript and AI summary. The proxy requests a speech-to-text transcript and sends that transcript to the text model for summarization. Employer stage events append private-in-the-UI notes. Profile and job edits do not rewrite submitted records.

Storage uses one versioned localStorage key. Import validates schema/version, unique IDs, cross-references and stage history before replacing state. Unreadable/incompatible saves are protected against automatic overwrite; settings can download the original raw save, import a valid file or explicitly reset. Failed/quota-limited persistence leaves the in-memory app usable and offers export. Import/export is capped at 2 MB; no binary CV storage.

## Features

src/features/prototype owns model/storage/state and page compositions. src/features/jobs retains reusable presentation/filter/description logic; src/components/ui owns Base UI controls. Keep changes small.

LocalStorage is origin-specific. Reload preserves state; another browser/device/port starts separately. No cross-tab live synchronization is provided; close other tabs before editing/importing. Hash links reference records in the receiving browser, not transferred records.

## Evidence and distribution

The baseline historical CSV and JSON are separate from interactive state. Future evidence must arrive in a separately reviewed package. package:participant copies only explicit allowed files/directories, including the complete docs/design-system guide/kit, and omits docs/source, historical task notes, agent run history and .git. A packet verifier checks the baseline data; packaging also verifies a pristine file/hash manifest. Ordinary checks permit participants to edit code and generate build/test output without invalidating a distribution fingerprint. Instructor repository history is never participant-safe.

## Checks

npm run check and ./scripts/verify run formatting, design-system reference integrity/example checks, lint, types, unit tests, build and Playwright against the static preview. Playwright checks external requests, complete workflows, error/recovery behavior, keyboard controls and mobile layout. No test starts system services. npm run dev only starts Vite.

## Local concurrency and optional AI limits

The store holds a Web Locks writer lock for its tab lifetime. This keeps the synchronous domain transition API and prevents concurrent full-scenario writes by cooperating tabs. A second tab rejects domain actions, import and reset; it can take over after the writer closes and it reloads. Snapshot comparison detects intervening writes outside this protocol. Unsupported Web Locks environments reject writes rather than falling back to an unsafe localStorage lock. No scenario schema migration or cross-tab merge is introduced.

Each Vite proxy instance shares an in-memory gate across question and voice actions: one active request, 10 attempts per fixed minute and 100 attempts per process. A finally block releases the active slot on success, validation errors and provider failures. These limits survive client disconnects within the process, but reset on restart and do not establish a provider currency budget.
