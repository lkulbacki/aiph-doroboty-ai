# PostHog browser analytics

## Intent and acceptance

Connect the owner's EU PostHog project to the Vite browser app. Record initial
and hash-route pageviews and successful prototype actions. Keep local runs and
participant packages inactive without explicit build-time configuration.

- Configure public `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` through Vercel.
- Never send scenario records, free text, CVs, audio, persona IDs, route IDs,
  search parameters, page titles or referrers.
- Disable autocapture, replay, surveys, feature flags and person profiles; use
  memory-only anonymous identity and respect Do Not Track.
- Analytics loading or delivery failures must not interrupt local workflows.
- Update SYS-03, README and the existing privacy information.
- Add meaningful unit/browser coverage, run `./scripts/verify`, and separately
  review the final diff before any merge.

## Connection evidence

Vercel exposes project `do-roboty-ai` and the supplied production domain. At
inspection it contained only the server-side OpenRouter variable. Local source
had no PostHog SDK and the initial GitHub issue/PR search for PostHog returned
no matches. A later fetch found `posthog/wizard-01a2221b42d3`, containing the
wizard's `Set up PostHog` commit. This confirms that wizard-generated code is
present on GitHub; it does not verify the current GitHub App authorization.
The owner supplied a public project token and selected EU ingestion.

## Implementation and separate review

Added a lazy-loaded `posthog-js` client, initial/hash-route pageviews, and
successful action-type events after the existing commit boundary. A strict
outgoing property allowlist preserves `$process_person_profile: false` while
removing SDK attribution and private URLs. Privacy copy, README, `.env.example`
and SYS-03 describe the implemented boundaries.

Created `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in the existing Vercel
project for Production only. The owner subsequently requested a separate
`codex/posthog-browser-analytics` branch and pull request. No code was merged
or deployed; the existing production deployment is unchanged. Event receipt in the owner's
PostHog project and the wizard's GitHub App authorization remain unverified.

Separate final source/diff review checked startup failure isolation, the
successful-action boundary, all current route templates, outgoing properties,
memory-only identity, existing local workflows, and production-only configuration.
No shared controls or visual patterns changed; the privacy page reuses its
existing paragraph layout.

## Validation

On 2026-11-28, the full `./scripts/verify` gate passed with 50 unit tests,
85 Chromium journeys, formatting, reference-kit integrity and six kit tests,
lint, typecheck, the 120-journey baseline packet and static build. Existing Zod
annotation and bundle-size warnings remain. The first restricted run could not
bind the HTTP-test server; the gate passed after granting local server access.

A separate configured build used a dummy project token. Chromium exercised
persona selection, hash navigation, application text entry and draft saving;
intercepted/decompressed SDK batches contained four expected pageview/action
events, redacted route templates, no entered text/record slugs/persona names,
and `$process_person_profile: false`. A second browser with Do Not Track emitted
no PostHog requests. Requests were fulfilled locally, never sent to PostHog.
The diagnostic initially used an outdated button label and then encountered
the SDK's expected bot filter; the final run used the actual `Zapisz szkic`
control and simulated a regular visitor without changing app bot filtering.

The review caught that a strict SDK property filter must retain the explicit
person-profile suppression flag. Both unit coverage and the actual browser
payload verify that boundary. `git diff --check` passed.
