# Saved offers

Migrate only the candidate saved-offers route. Reuse the Editorial JobCard variant,
paper canvas, existing heading and secondary action. Preserve published-only saved
records, offer/company links, bookmark mutations and local persistence.

Acceptance: real saved item and empty state, removing the last saved item, reload,
mobile/keyboard and offer navigation. No new assets or dependencies. FEATURES.md
reviewed: presentation only, no behavior-register update required. Stop for review.

Implemented in SavedPage, the candidate canvas route scope and the small empty-state
spacing rule in editaurus.css. Reuses JobCard and SecondaryButton without new
components or data transformations. Separate review confirmed unchanged published
job filtering, persona-specific state, links and toggle operation.

Inspected desktop 1440 px and mobile 320 px screenshots. Browser checks passed:
empty-state link via keyboard, saving from listing, saved item after reload,
removing the last item via keyboard and empty state after reload. The existing
marketplace journeys cover offer/company destinations. No user browser data was
modified: the check used an isolated Chromium context.

Full `./scripts/verify` passed: formatting, historical kit integrity and tests,
lint, types, 28 unit tests, baseline packet, build and 46 Chromium journeys.
Existing bundle-size and Zod annotation warnings remain nonblocking. Human visual review pending. Stop here; resume by opening
`/#/app/zapisane` with a candidate, reviewing both states and recording acceptance
before selecting another route. No commit or publication performed.
