# Information pages and landing action correction

Migrate methodology and case content to scoped Editaurus paper/ink/DM Sans panels,
including the public methodology header. Preserve all Polish content, baseline
CSV download and role boundaries. Remove duplicate text underlines from landing
actions while retaining the quiet action's bottom rule and keyboard focus.
FEATURES reviewed: presentation only, no behavior change. Preserve prior changes,
historical kit and dependencies. Validate with ./scripts/verify; no publishing.

Manual desktop review: methodology header/content, operator case page and landing
actions inspected in the live browser. The original Anna persona was restored.
Separate source review confirms CSV URL/download, role gate and hero callbacks
are unchanged. No extra runtime state, primitives or dependencies were added.
The first gate passed 28 unit tests and 52 browser journeys; one existing browser
test still required the deliberately removed hover underline. Its expectation now
checks no text underline on both actions, retaining the quiet bottom-rule check.

Final ./scripts/verify passed: formatting, historical-kit integrity/six tests,
lint, types, 28 unit tests, baseline packet, build and 53 Chromium journeys (27s).
Existing build annotation/chunk and color-environment warnings remain. Manual
review was desktop; responsive behavior was covered by existing browser journeys,
not an exhaustive manual mobile audit. No commit, push or publication.
