# Required closed-choice fields

Scope: FormSelect accessibility API and five required employer taxonomy fields.
Preserve Base UI, render composition, values, filtering, approval and styling.
Add required validation against confirmed selection (never query text), associated
help/error text and invalid state. Optional consumers remain optional. Mirror the
production owner in the catalog. Import feedback findings remain deferred.
Acceptance: keyboard clearing/query cannot satisfy a required enum; form validation
focuses the field, describes the error, and confirmed selection recovers. Exercise
real editor and catalog, desktop/mobile; run ./scripts/verify and separate review.

## Implementation and separate review

Required validation is applied to the confirmed option via the existing Base UI
input's native custom validity; the search query is never serialized as an enum.
Missing selection is revealed on blur/native invalid events and clears after a
confirmed selection. `describedBy` and explicit `error` provide associations on
both branches; automatic touched/missing validation is searchable-only. Defaults,
optional filter consumers, approved-data boundaries and persona isolation remain.
The editor marks its five existing mandatory enums required; the catalog shares
the owner and adds a help association. FEATURES EMP-03 was updated.

Separate React/a11y review checked unconditional hooks, stable generated IDs,
controlled/uncontrolled selection, disabled validity, unique error associations,
Base UI composition and unchanged consumer defaults. No dependency or primitive
replacement. The effect only synchronizes native validity with derived selection;
it does not duplicate domain state. Existing source validation remains the final
publication guard. Automated coverage exercises real editor query/clear, invalid
semantics/description, native validity and keyboard confirmation at 1280/390px.
Existing journeys cover other controls, publication, optional filters and catalog.
Human API/visual acceptance and a screen-reader session remain separate.

First sandboxed gate passed through build but could not bind preview port 3106
(EPERM). Authorized execution outside the sandbox passed the full gate: 28 unit
and 67 Chromium tests (35.1s). Screenshot review caught an inline error-span layout
issue; changing it to a block with top spacing prompted a final full gate rerun.
Import feedback findings remain explicitly deferred by the user. No Ardia, user
browser data, commit, push, deployment, kit or portable skill changes.

Final full ./scripts/verify passed: formatting, historical kit integrity/six kit
checks, lint, types, 28 unit tests, 120-journey baseline verification, build and
67/67 isolated Chromium journeys (35.5s). Existing Zod annotation, chunk-size and
color-environment warnings remain. Final desktop/mobile invalid-field screenshots
were reviewed after the layout correction. No claim of exhaustive screen-reader
or human acceptance is made.
