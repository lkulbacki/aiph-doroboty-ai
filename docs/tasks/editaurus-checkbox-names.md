# Approval checkbox accessible names

Scope: candidate application consent and employer publication approval. Replace
redundant aria-label text with aria-labelledby referencing the existing visible
label span. Preserve Base UI primitives, wrapping label, visuals, error description,
focus, state and explicit approval. Catalog already relies on visible labels and
needs no naming correction. Import feedback issues remain deferred by the user.

Acceptance: exactly one checkbox with exactly its full visible text as name;
visible-label clicking and keyboard Space toggle it at desktop/mobile widths;
unchecking employer approval disables publication. Existing candidate validation
focus and employer reapproval journeys remain intact. Run ./scripts/verify.
FEATURES reviewed: no changed domain flow or wording; accessibility naming only.

Separate source review: IDs unique within routed surfaces, aria-describedby error
association retained, native wrapping-label activation retained, no new hooks,
dependencies, primitives or global style changes. No skill/kit edits or publication.

Full ./scripts/verify passed: formatting, kit integrity/six kit tests, lint,
TypeScript, 28 unit tests, baseline packet, build and 69/69 isolated Chromium
journeys (34.3s). Both new tests assert exact full accessible names, label clicks,
Space toggling and disabled publication after unchecking at 1280/390px. Existing
candidate error-focus and employer reapproval regressions passed. Existing build
annotation/chunk-size and color-environment warnings remain. This checks browser
accessibility semantics, not a manual screen-reader session. No visual change.
