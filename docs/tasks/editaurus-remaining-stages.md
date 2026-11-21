# Editaurus remaining stages

Updated 2026-11-22 following the user's request to add catalog organization to the
remaining plan; reconciled after stage 3B acceptance and local closure work.
This is the current status register; earlier audit/tasks retain dated evidence.

## Completed baseline

Stages 1 and 2A-2G, application migration, real-journey audit and focused employer,
choice, consent, company, forced-color and import-feedback fixes are implemented.
Stage 3A passed 28 unit / 75 Chromium tests. Later local closure adds catalog
keyboard/semantic checks; final results are in the local closure record. The user
explicitly accepted stage 3B on 2026-11-22.
Portable skill extraction already happened in 2G; only newly accepted deltas may
need a subsequent update. Do not repeat completed work or reopen corrected import
feedback/required-choice/naming findings as unfixed bugs.

## 3A — Organize the existing catalog

Implementation delivered; see [stage 3A verification](editaurus-stage-3a.md).
Human evaluation accepted in 3B.

Scope: add a clear table of contents and section navigation, with existing content
organized into foundations, components and application patterns. Expose the
foundations already in use as useful visual references where necessary; first
reuse/reorganize current content and host documentation. Preserve Editaurus
appearance, production owners and isolated examples. The linked external catalog
is an information-architecture reference, not a visual, behavioral or completeness
specification. No requirement to implement all its components/sections. Do not
invent product functionality, missing states or parallel controllers to fill it.

Done: existing covered needs are discoverable without scanning the whole page;
headings, section links, current location and mobile navigation are understandable.
Verification: desktop/mobile, keyboard/focus, direct section navigation and back/
forward behavior; existing links/examples remain functional; full project gate
for implementation. Retain hash-router semantics when choosing section URLs.
Human decision: navigation and grouping meet the team's actual usage needs.
Stop: review the reorganized catalog before widening component coverage.

## 3B — Human visual and component-contract acceptance

**Accepted by the user on 2026-11-22.** The current ledger records the accepted
existing scopes and deliberate host exceptions; no automatic portability or
upstream-conformance claim.

Scope: evaluate the reorganized catalog against actual candidate/employer/public
screens, including action hierarchy, disabled/error/empty states, forms, CV,
records, company panels, typography and spacing. Review provisional APIs and
exceptions (including marketing typography/palette) in their existing scopes.
Required-choice and checkbox fixes have runtime evidence; their final contract
acceptance is separate. Identify only concrete remaining mismatches; fix and
verify those within agreed scope.

Done: the ledger records accepted scopes, requested corrections and deliberate
exceptions without treating every implementation as accepted. Verification:
actual screenshots/interactions on desktop/mobile and relevant shared consumers;
full gate after code changes. Human decision: accept appearance, usage and API
boundaries. Stop: unresolved aesthetic/API choices are explicit, not silently
exported as portable rules.

## 3C — Real assistive-technology check

**Real reader session remains unexecuted.** Isolated browser preflight is separate.
The [operator checklist](editaurus-assistive-technology-check.md) records the
available-tool limitation and four concrete journeys; this does not block the
independent documentation/skill/review closure.

Scope: candidate application, employer editor, recruiting record and catalog
navigation using a real screen reader with keyboard. Check names, descriptions,
errors, announcements, selection, dialogs and focus restoration. Retain current
forced-color/reduced-motion evidence and extend only for confirmed gaps.

Done: record the reader/browser combination, journeys actually exercised,
findings and fixes. Verification: repeat affected journeys and relevant automated
checks after fixes. Human involvement: operator/tester with the intended reader;
no claim that Axe or Chromium semantics replace this session. Stop: report any
untested environment explicitly; exhaustive browser/WCAG certification is not an
implicit deliverable.

## 3D — Reconcile the current documentation

**Reconciled locally on 2026-11-22.** GUI, guide, ledger, component contracts,
stable finding status, decisions and handoff agree on current acceptance and
closed fixes. Historical task/JSON/kit evidence remains unchanged.

Scope: update GUI, coverage, component contracts, status and handoff after the
reviews. Keep historical audits intact but clearly supersede corrected findings.
Document current owners, behavior, provisional/accepted scope and evidence dates.

Done: one current index/plan with consistent statuses and working local links;
no corrected import or naming defect presented as still open. Verification:
source/document comparison, links, format and whitespace. Human decision:
confirm unresolved decisions are described accurately. Stop: no code rollout or
historical-kit rewrite merely to reconcile documentation.

## 3E — Reconcile portable skill deltas, if any

**Compared; no skill edit needed.** Accepted generic guidance is already covered
by the 2G skill. The additional acceptance concerns existing host usage and local
exceptions. The closure record contains the comparison. No asset transfer.

Scope: compare newly accepted generic rules against the existing external
editaurus-ui skill, already updated in stage 2G. Transfer only missing accepted
portable guidance, without host routes, vocabulary, data or workflow logic.
If no accepted portable delta exists, record that no skill edit is needed.

Done: host/skill guidance agrees for accepted shared rules; originals unchanged.
Verification: skill validation, reference links and scoped diff. Human decision:
which new rules are accepted as portable. Stop: unapproved variants and uncertain
asset rights remain outside the portable/public package. No asset copying.

## 3F — Close the local change set

**Final local review, verification and commit grouping are recorded in**
[local closure](editaurus-local-closure.md). No push/deploy/publication. Real-reader
validation remains explicit rather than being counted as complete.

Scope: final separate review, validation appropriate to the final changes,
reviewable commit grouping and concise handoff. Reuse still-current verification
when no code changed; rerun the full gate when implementation changed.

Done: final state, actual checks, remaining deliberate limitations and commit
scope are explicit. Human decision: authorize final commits if not already
covered by the current instruction. Stop: local completion; push, deployment,
publication and course release are separate requests. Asset publication rights
and exact upstream provenance matter before a future transfer/replacement, not
as a reason to add unrelated work to this plan.
