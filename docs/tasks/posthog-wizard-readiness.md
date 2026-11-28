# PostHog wizard PR readiness

## Intent and acceptance

After reverting PR 4, the owner explicitly requested merging PR 3 after its
tests are checked. Retain the wizard's React provider, named product events,
browser logs/errors and server-side AI observability. Make only the corrections
needed for project boundaries and reliable setup.

- Merge current main into the wizard branch without reintroducing PR 4.
- Repair the hosted-handler regression for the added optional trace context.
- Preserve configuration-free participant startup.
- Never log AI prompts, recordings, transcripts, generated text, edited persona
  names or custom job-function text. Keep operational metadata and fixed IDs.
- Update README, privacy wording and FEATURES.md to match actual behavior.
- Use the wizard's public environment variable names in Vercel Production.
- Run `./scripts/verify`, separately review the final diff and check GitHub CI
  before merging PR 3.

## Initial evidence

The original wizard CI failed because the hosted-handler mock expected a
single provider argument; instrumentation now supplies optional context as a
second argument. Source review also found fatal unconfigured development
startup and `$ai_input` / `$ai_output_choices` containing full user content,
including audio data. These require correction before merging.

## Corrections and configuration

Kept the wizard's provider, named events, tracing, logs/errors and metadata
observers. Removed prompt/audio/output payloads and arbitrary provider-error
text from AI telemetry. Removed editable persona names and job-function text
from analytics, masked autocapture text/attributes, disabled session replay and
enabled browser Do Not Track handling. Missing local browser configuration now
reports inactive analytics instead of throwing before React mounts.

Updated the hosted-handler regression to assert the new optional context and
added coverage for valid trace propagation and metadata-only success/error AI
telemetry. README, privacy information and SYS-03 now describe this integration.
Renamed the two existing Vercel Production public variables to the wizard's
`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, preserving
their values and environment scope. No OpenRouter credentials were changed.

## Validation and separate review

On 2026-11-28, `./scripts/verify` passed: formatting, historical reference kit
integrity and six kit tests, lint, types, 49 unit tests, baseline packet, static
build and 85 Chromium journeys. The original failing hosted-handler assertion
was reproduced before correction. Existing Zod annotation and bundle-size
warnings remain; the wizard's configured browser bundle is approximately
1.13 MB before gzip (370 KB gzip).

A dummy-token production build was exercised in Chromium with all PostHog
requests intercepted locally. The real SDK sent `$pageview`, `$identify`,
`$set` and `application_draft_saved`, without the entered application answer or
persona display name. No diagnostic data was sent to the owner's project.

Separate source/diff review covered every wizard-instrumented consumer,
success-only domain-action boundaries, identity-effect deduplication,
configuration-free startup, trace propagation and excluded AI payloads. React
provider/hook order, hash routing, storage operations, existing controls and
focus behavior are preserved. Full browser journeys cover desktop/mobile,
keyboard, errors and data recovery. `git diff --check` passed. The old PR 4
analytics module remains absent. GitHub CI and actual owner-dashboard receipt
are separate from these local checks.
