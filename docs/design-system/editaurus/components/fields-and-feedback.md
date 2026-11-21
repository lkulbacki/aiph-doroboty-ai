# Fields, consent, CV and feedback — stage 2D reconciliation

> Current status (2026-11-22): the user accepted stage 3B for the implemented
> application/catalog appearance and local component/API usage. The
> [current ledger](../coverage.md) supersedes earlier pending-review/next-stage
> statements below. Real-reader behavior, future variants, portable exceptions
> and publication rights are separate boundaries. Historical stage evidence is
> retained; no upstream conformance is inferred.

Stage 2D date: 2026-11-21. Existing owners retained; current API/visual acceptance
is recorded in the [ledger](../coverage.md). This slice extends the catalog, not the
primitive library. No upstream source replacement or new dependency is involved.

| Family             | Owner and API                                                                                                 | Existing behavior / current catalog                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Single-line fields | ui/Input uses Base UI Input and native input props; production profile/employer consumers add editaurus-input | New catalog examples cover editable, aria-invalid/described error and disabled retained text. Local uncontrolled edits disappear on remount; no profile/job operation is called                                                                 |
| Answer             | EditaurusTextarea forwards native Textarea props and className                                                | Form supplies value/change, aria-invalid/describedby, minimum 20 validation and focus; catalog retains valid/invalid/disabled/long examples. It does not replace real validation with a demonstration controller                                |
| Consent            | EditaurusCheckbox forwards Base UI checkbox props                                                             | Form supplies checked/onCheckedChange, labels, required-consent validation, error description and focus. Disabled checked means submitted; it is distinct from read-only text                                                                   |
| CV                 | CvAttachment(candidateId, fallbackText, layout, preview, contextLabel)                                        | Prepared PDF is exposed only when both person ID and exact baseline CV text match. Catalog custom text now uses a known candidate with changed CV to exercise mismatch recovery; no stale PDF links or iframe                                   |
| Help/error/status  | Existing scoped CSS and caller-owned semantic elements                                                        | Help is associated through aria-describedby; answer/consent errors retain input and receive validation focus; form error uses alert, local draft confirmation status. Catalog feedback remains representative static text, not an executed save |

The single-line appearance uses the same scoped rules as answer fields: square
2px ink contour, paper rest and light-paper focus, 500 weight; minimum 44px is not
an exact rendered height because primitive padding/leading remain inherited.
The aria-invalid example demonstrates the existing shared visual API. Actual
profile fields also use browser constraint validation (`:user-invalid`); the
employer editor's domain errors are not all per-field associations. These are
existing implemented differences, not proof of uniform form-error coverage.

Disabled and read-only are different native contracts. No real read-only editing
flow was invented here: submitted snapshots remain reading compositions rather
than readonly copies of the editable form. Native readonly forwarding exists in
the underlying input/textarea API but has no new accepted editaurus recipe.
Checkbox indeterminate is also inherited, not a meaningful consent state accepted
for application submission. Do not add those demo states as product requirements.

Keep the answer/checkbox invalid-rest difference (`#f9e9d9` versus
`#f9efd9`), accepted locally in 3B. No color normalization, focus redesign or
validation change was made. Long/missing CV, salary and identity remain domain
concerns. CV stack/row and optional native iframe contracts remain in the
[host record API](../../RECORDS.md); candidate profile can evolve while submitted
identity/CV snapshots stay immutable. Open/download links retain native semantics.
No assets were copied and publication rights were not expanded.

Storage errors remain global recovery guidance: retain the original unreadable
save, memory-only work, export/import/reset and role boundaries. Do not relabel
those states as form success or simulate writes from the catalog. The synchronous
local save does not establish asynchronous loading semantics.

Validation: a focused regression checks edit isolation across reload, invalid
description, disabled state and same-person changed-CV text fallback. Existing
real-form validation/consent/draft, profile/snapshot, CV matching and recovery
journeys remain the behavioral regression suite. No dedicated header test was
added, per the user's instruction; its existing public recipe was inspected in
the browser. Stage 3B accepts current field/consent/CV APIs, error shades and the existing
feature-specific validation differences; it does not claim uniform per-field
error coverage or spoken announcements. Stage 2E choices/dialogs is complete.
