# Design-system integration status

> **Current scope (2026-11-21):** [Editaurus coverage and acceptance](editaurus/coverage.md) is the current route/component ledger. The implementation evidence below retains the earlier Poster People snapshot and stable finding IDs; it is not a claim that current screens are all legacy. The [editaurus guide](editaurus/README.md) records shadcn/Base UI architecture and visual authority.

The historical receiving-application snapshot below dates from November 2, 2026; current finding dispositions were reconciled on November 21. The immutable reference remains Poster People v1.0.0 (67 files). User-requested host implementation/documentation does not imply a new source-kit release, publishing or approval of every application screen.

Engineering task paths below refer to the full development repository and are deliberately not distributed in participant packages. All current component contracts and open findings are self-contained in this directory; task history and ignored screenshots are optional supporting evidence.

## Implemented work and evidence

| Area                   | Implemented contract                                                                                                           | Engineering evidence                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Employer process view  | One reading sheet, actual event margin, integrated note/actions, proper terminal states and focus.                             | Process implementation (`docs/tasks/candidate-process-view.md`)             |
| CV-only reading        | No CV in Answer; CV tab contains local file actions and framed native PDF; custom imports retain complete text.                | CV preview (`docs/tasks/candidate-process-cv-preview.md`)                   |
| Heading hierarchy      | Application answer, submitted CV and recruiter note are H3, 26px/400; hidden sheet H2 preserves the outline.                   | Heading checks and follow-up (`docs/tasks/candidate-sheet-heading-size.md`) |
| Scenario score         | Shared tag below the name and in role lists/details; red/orange/yellow/vivid-green ranges; removed visible exemplary caption.  | Score colors and contrast (`docs/tasks/match-score-colors.md`)              |
| Action feedback        | Shared enabled-action pointer/color hover, preserved selected contrast and disabled states.                                    | Hover audit (`docs/tasks/interactive-hover-states.md`)                      |
| Return links           | Shared BackLink anatomy and aligned public entry spacing; valid hash targets and keyboard activation.                          | Return links (`docs/tasks/shared-back-links.md`)                            |
| Offer/application flow | Apply/Save separation; real offer context next to the form, in-place complete description, integrated CV row and mobile order. | Application redesign (`docs/tasks/application-page-redesign.md`)            |
| Submit celebration     | Success-only button-origin burst; duplicate guard, textual feedback, cleanup and reduced-motion path.                          | Confetti implementation (`docs/tasks/application-submit-confetti.md`)       |

Read the current [host catalog](HOST-COMPONENTS.md), [record APIs](RECORDS.md) and [acceptance checklist](VERIFICATION.md) before extending these patterns. Historical tasks describe their own state at the time; the current component contracts supersede earlier permanent-CV-row or always-pink-score choices.

Candidate submitted detail now also uses the shared ApplicationRecord composition, with owner-filtered stage/date history, CV-only snapshot preview and focused two-step withdrawal. Repository-only execution evidence: `docs/tasks/candidate-submitted-record-redesign.md`. This does not resolve the company-page audit below.

## Open company-page findings

The Northstar Health audit (`docs/tasks/northstar-company-design-audit.md`) was read-only. Its original findings are retained below. Current code has changed since that audit, but **none is closed by this documentation reconciliation**. Assess migrated visual criteria against editaurus rather than restoring legacy white surfaces merely to match an old finding.

| ID    | Original finding                                                                                                                | Current disposition / closure evidence still needed                                                                                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NH-01 | Invalid definition-list structure; the historical targeted Axe scan reported serious `definition-list` and `dlitem` violations. | Structural finding verified on 2026-11-21: targeted CompanyPage main-content Axe regression reports no serious/critical findings. This closes NH-01 for the tested current route, not whole-site accessibility. |
| NH-02 | Company information surface lacked expected white fill and visible ink contour.                                                 | Runtime reviewed at 320/850/851/1280px: current paper/ink/4px panel retains contour and fits. Human visual acceptance remains separate; see company-boundaries task.                                            |
| NH-03 | Header identity fallback lacked a visible contour and used the older large treatment.                                           | Missing/failed local logo and 200-character unbroken identity exercised at 320/850/851/1280px; visible contour, wrapping and keyboard navigation verified. Human acceptance remains separate.                   |
| NH-04 | Company cards omitted candidate save toggles because saved state was not supplied.                                              | Functionally closed in 2F: CompanyPage supplies candidate-specific saved state. Targeted toggle/focus/reload/removal and employer-exclusion regression passed. Visual/API acceptance remains separate.          |
| NH-05 | Company/profile footer lacked the demonstrative-data context present in C08/C12.                                                | Missing prototype context corrected on the company route with explicit demonstrative-data wording. Runtime content check passed; wording/human visual acceptance remains separate.                              |

The full company-page layout is not a canonical v1 screen. Container alignment, contextual BackLink and richer empty-state recovery are documented host recommendations; do not convert them into invented source requirements. The audit does not require the compact source profile's H2 size or illustration on every full company page.

## Evidence boundaries

The historical implementation snapshot, including the shared candidate record, recorded 27 unit tests and 34 Chromium journeys, plus formatting, source-kit integrity/six kit tests, lint, types, packet and static build. Those counts are dated evidence, not the current test inventory. Later execution is recorded in the [stage 1 report](../tasks/editaurus-stage-1-inventory.md) and [stage 2A task](../tasks/editaurus-stage-2a.md); those runs do not imply visual acceptance or close unasserted findings.

The 2F gate includes targeted company accessibility/save regressions; the individual dispositions above apply only to their verified scope. General accessibility journeys alone would not close NH-01. The older audit (`docs/tasks/poster-people-design-system-audit.md`), re-audit (`docs/tasks/poster-people-design-system-reaudit.md`) and subsequent task evidence remain historical records; do not erase them or infer a new closure from a documentation edit. Ignored artifacts support local review but are not the sole portable specification.

## Real-journey audit — 2026-11-21

The [completed journey audit](../tasks/editaurus-real-journey-audit.md) adds terminal
hire/rejection, organization save, actual export-file recovery and route samples
to the existing regressions. Its functional scope is complete; visual/API and
company decisions above are not accepted automatically.

| ID     | Confirmed open finding                                                                                                                                                         | Next bounded action                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| JRA-01 | After a successful same-person import, a subsequent invalid import preserves data and alerts failure but leaves the old success status visible. Confirmed at 1280px and 390px. | Supersede prior operation feedback when starting another import/reset; preserve original data and failure/recovery behavior. |
| JRA-02 | A successful import that changes the active persona restores data but loses its success announcement when the keyed settings view remounts. Confirmed at both widths.          | Retain completion feedback across the persona remount without removing per-person form isolation.                            |

These are feedback defects, not failed data restoration. The audit's 12 targeted
main-content Axe samples reported zero WCAG A/AA violations; that is not whole-site
accessibility certification. The audit observation JSON records actual results.

## Sequential boundary reviews

See [company boundaries](../tasks/editaurus-company-boundaries.md) for executed
company evidence and the subsequent media-mode control review. Earlier open
required-choice/checkbox findings have focused follow-up tasks; do not treat their
historical audit observations as a statement that the fixes are still missing.
Import feedback findings remain deferred at the user’s explicit request.

## Import feedback follow-up

The user reopened JRA-01/JRA-02 after the earlier deferral. The
[import feedback fix](../tasks/editaurus-import-feedback.md) moves transient
completion above the persona-keyed outlet and clears old feedback on the next
recovery attempt or navigation. Historical audit JSON remains original evidence,
not a post-fix observation. See the task for actual regression results.
