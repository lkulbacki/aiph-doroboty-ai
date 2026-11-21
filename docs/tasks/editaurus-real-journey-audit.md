# Real journey audit

Date: 2026-11-21. Finish the previously open candidate/employer/recovery audit,
not another unbounded implementation slice. Preserve dirty code and user data.
Run real UI operations in fresh isolated Playwright Chromium contexts only; no
Ardia or user browser profiles/cookies. Synthetic scenario and local assets only.

Acceptance: map all routed product areas to executed journey evidence; supplement
terminal decisions, organization save, role boundaries and actual export/import
roundtrip. Inspect desktop/mobile screenshots. Record failures/open decisions and
verification limits separately from functional passes. Existing domain fixtures,
source/history boundaries and pending visual/API acceptance remain in force.
No product implementation changes unless required to unblock the audit. FEATURES
reviewed: audit/tests only, no behavior changes. Run ./scripts/verify.

## Evidence and scope

The baseline was the current 57 browser journeys, not a clean/reverted checkout.
Added `tests/e2e/journey-audit.spec.ts`: eight isolated journeys at 1280×900 and
390×900. These use real form/buttons/files and role switching, not direct domain
transition calls. The route sweep measures/photographs live pages and records
Axe findings as observations; a green sweep does not itself mean zero findings.
The attached JSON must be reviewed separately. Existing tests execute 320px,
keyboard, motion, storage-failure and portal cases. No personal data or user
browser/profile/cookies were accessed, and no Ardia calls were made.

The first full invocation stopped at formatting in the new spec; rerunning the
formatter and checking it resolved the tooling failure before browser execution.
A complete intermediate gate passed 28 unit and 65 browser tests (36.8s). The
last pass adds onboarding-alias coverage and the success-then-failed-import
observation while retaining eight new journeys; final results are recorded below.

## Functional journey matrix

| ID  | Real path / expected outcome                                                                                       | Executed evidence                                                                                                   | Disposition                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| J01 | Public home → role/category → listing; query/facets/sort/list/map, reset/history                                   | Existing home/listing/search/URL/map/chip/section journeys; current route sweep                                     | Pass for exercised operations                                                     |
| J02 | Offer/company → candidate save/unsave → saved list; reload and candidate ownership                                 | Existing company save/role, published-job flow, listing save journeys; candidate saved route sweep                  | Pass                                                                              |
| J03 | Persona selection, wrong-role guidance, app/onboarding redirect and unknown records                                | Existing mobile navigation/person tests, cross-company checks; new route sweep/terminal cross-person checks         | Pass; role selection remains a simulation, not security                           |
| J04 | Candidate profile edit/save/reload and preview, local CV open/download                                             | Existing profile/snapshot/local-PDF tests; profile/preview route sweep                                              | Pass; immutable submitted identity/CV retained                                    |
| J05 | Offer → answer validation/consent → explicit draft save → reload → submit                                          | Existing full publish-to-decision journey, invalid short/missing-consent, legacy draft tests, duplicate guard tests | Pass; no candidate AI answer generation or autosave invented                      |
| J06 | Candidate submitted detail/legacy success alias, Answer/CV, history, withdrawal cancel/confirm/focus               | Existing candidate record/snapshot/withdrawal journeys; route sweep                                                 | Pass                                                                              |
| J07 | Employer home/list → new/edit/proposal/use/approval/publish → public listing                                       | Existing end-to-end and taxonomy journeys; recent draft/salary/location/reapproval regressions; new editor sweep    | Pass for exercised transitions                                                    |
| J08 | Organization edit/save/reload → public company projection                                                          | New organization/export recovery journey at both widths                                                             | Pass                                                                              |
| J09 | Candidate search → process Answer/CV/note → every forward stage → hire                                             | Existing note/tab/history journey; new terminal-hired sequence at both widths                                       | Pass; note saved in history, terminal note/actions removed, status focus retained |
| J10 | Employer rejection, candidate terminal view; no withdrawal after terminal; other company/person cannot view record | New terminal-rejected/hired projection at both widths plus existing withdrawal isolation                            | Pass                                                                              |
| J11 | Settings: actual download bytes → cancel reset → reset → cancel import → import same file → reload exact scenario  | New exported-file roundtrip at both widths                                                                          | Pass; compares full scenario rather than download filename alone                  |
| J12 | Invalid/oversized import, unreadable original, denied storage, export guidance                                     | Existing invalid import/unreadable/write-denial and storage unit tests; new size-limit and feedback sequence        | Data preservation passes; feedback issue JRA-01 below                             |
| J13 | Operator case/baseline download; privacy/methodology/catalog and 404                                               | Current role-scoped route sweep plus previous information-page review and baseline packet verification              | Routes/content sampled; no course/publication approval implied                    |

## Visual and accessibility review

The intermediate sweep visited 26 route/person combinations per viewport; the
final sweep additionally visits candidate onboarding (27 per width). All sampled
pages had a visible main H1 and no horizontal document overflow. Initial 52-page
JSON was extracted to /tmp/editaurus-route-audit.json. Six actual route samples per
width (application, new employer offer, organization, recruiting record, settings,
case) ran Axe WCAG 2A/2AA against main: **12 scans, zero violations** in the
intermediate sweep. Final evidence is recorded below. This is not a screen-reader
session, whole-site Axe certificate or exhaustive WCAG audit.

Manually inspected the saved 1280px/390px application, new-offer and recruiting
record screenshots: coherent paper/ink treatment, mobile stacked offer/form and
record/history order, legible headings/controls and no observed overlap in the
visible captures. Existing tests cover the lower form, portals, custom/long CV,
keyboard tabs, submit errors and focus. A viewport screenshot alone does not
establish unclipped content outside that capture, and document width alone cannot
prove every child fits. Previous information-page screenshots remain separate
evidence; no old Poster People geometry was used as Editaurus acceptance.

## Open findings and decisions

JRA-01 — settings feedback after repeated operations: execute a valid import, then
an invalid import without leaving settings. Original data is preserved and the
failure is announced, but the old local success message may remain. The final
browser observation records both live-region texts and a screenshot. Confirmed at both widths: clear/supersede prior operation feedback when starting a new operation; retain
export/recovery and the failure alert. This is a bounded follow-up, not data loss.

Existing acceptance decisions remain open: required/invalid searchable-selector
associations/API, duplicated checkbox accessible wording observed in earlier
Base UI browser snapshots, company NH-02/NH-03/NH-05 visual/context decisions,
and complete forced-color/screen-reader/adjacent-breakpoint coverage. The new
functional passes do not accept these by implication. Native required/form schema
checks and current motion/focus regressions must not be conflated with complete
field-specific error associations or human visual approval.

## Review boundary

No application code, dependency, portable skill, immutable kit, domain fixtures or
FEATURES behavior was changed by this audit. The new tests exercise live owners
with isolated local scenarios; source review checked routing, role/data projection,
terminal transitions, storage/import guards and snapshot boundaries. Pending
findings are left explicit rather than weakened assertions or product workarounds.
No commit, push, deployment or publication occurred.

JRA-02 — successful import changes active persona: the stored scenario and workspace
restore correctly, but the settings component remounts under Shell's
activePersonId/path key and loses its local success announcement. The expanded
observation initially required that announcement and failed at both widths,
while the earlier full roundtrip passed. Final observations record the absent
announcement separately, then reimport the same file with an unchanged persona
before testing JRA-01. A future fix should retain operation feedback across this
remount without weakening the key's useful per-person editor isolation. This is
an operation-feedback issue, not a failed import or authorization mechanism.

The diagnostic expanded gate had 63 passes / two failures at that deliberately
checked missing success announcement. Its data-preservation path was not hidden;
the audit now records this observation and keeps full-scenario assertions. Audit
observations are not passing regressions for the desired future feedback fix.

## Final outcome

Audit complete for the product journey scope above, with two open operation-
feedback findings JRA-01/JRA-02. Final full ./scripts/verify passed formatting,
immutable kit integrity/six tests, lint, TypeScript, 28 unit tests, baseline packet,
static build and **65/65 Chromium journeys (36.4s)**. Existing Zod annotation,
chunk-size and color-environment warnings remain. Runtime evidence is saved in
[the observation file](editaurus-real-journey-evidence.json): **54 route/person/
viewport samples, 12 main-content WCAG A/AA Axe scans, zero violations**, two
missing-success and two stale-success observations. A passing audit records these
issues; it does not certify their absence or implement their future fixes.

After the full gate, the feedback screenshots gained a wait for the dialog to
finish closing, avoiding an animation-transition capture. Only the two affected
recovery journeys were rerun; their result is recorded below. No application code
changed. The full gate was not repeated merely for that screenshot timing change.

The audit stop point is a prioritized follow-up for JRA-01/JRA-02, then the already
open company/component acceptance work. No remaining functional audit batch is
being silently deferred. Exhaustive combinatorial input, assistive technology,
all media modes at every boundary, other browser engines and human visual/product
acceptance remain separate verification limits, not claims of this audit.

Focused settled-dialog recovery rerun: **2/2 passed (5.1s)**. The final 390px
screenshot was inspected after dialog removal and confirms the stale success
status below the failure alert; it is not an overlap caused by dialog animation.
Company mobile screenshot was also reviewed: the sampled panel/identity layout
is coherent, while the recorded fallback/long-content/context and human-acceptance
questions remain open. Priority: fix JRA-01/JRA-02 together as one settings-feedback
slice, with desired-behavior regressions; do not remove Shell's persona key as a
shortcut. Report formatting, lint/types and diff whitespace were checked after
the screenshot-wait adjustment. No broader gate rerun was needed for that change.
