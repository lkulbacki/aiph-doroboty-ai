# Domain compositions — stage 2F

> Current status (2026-11-22): the user accepted stage 3B for the implemented
> application/catalog appearance and local component/API usage. The
> [current ledger](../coverage.md) supersedes earlier pending-review/next-stage
> statements below. Real-reader behavior, future variants, portable exceptions
> and publication rights are separate boundaries. Historical stage evidence is
> retained; no upstream conformance is inferred.

Current implemented examples and local API usage are accepted in stage 3B. The catalog imports actual
JobCard, SalaryFact, RecordSheet, ProcessTimeline and MatchScore. CvAttachment is
already demonstrated by 2D. No forked record, row, filter or workflow controller.

| Family                                              | Production owner and catalog behavior                                       | Retained boundary                                                                                                                                                                                     |
| --------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Offer row / metadata / company                      | JobCard editorial + CompanyLogo; catalog uses first currently published job | JobCard's native offer/company links are live. Catalog deliberately omits saved prop so inspecting examples cannot write scenario state                                                               |
| Pay                                                 | SalaryFact, including explicit no-pay example                               | Amount, currency, period and contract basis stay separate; missing pay is not zero and remains text, not a button                                                                                     |
| Save                                                | Actual JobCard on listing/saved/company routes                              | Company now receives candidate-specific saved flag; employer/anonymous has no candidate save operation. Real last-item removal/focus/reload remains in saved route                                    |
| Search / categories / filters / sort / paging / map | JobsPage's original state and URL/history                                   | Catalog links to real list/map rather than reimplementing their controller; zero results have recovery navigation. Save/filter/search synchronization retained                                        |
| Reading record / CV                                 | RecordSheet and existing CvAttachment                                       | Local generic example is not a submitted application. Actual submitted identity/answer/CV snapshots remain immutable when profile or job changes                                                      |
| Tabs / notes / history                              | Base UI Tabs through RecordSheet and ProcessTimeline                        | Local note controlled outside tab panels; history dates fixed synthetic examples, not a recruiting event. Actual employer note-save failures and permitted stage transitions remain domain operations |
| Score                                               | MatchScore at 39/40/60/80                                                   | Noninteractive bands, with percentage text; illustrative scenario values, never hiring recommendations                                                                                                |

No domain enums, routes, CV matching, persistence or recruiting decisions belong
in the portable skill. Real filter and history behavior is not discarded merely
because v9 did not specify it. Recovery, role projections and terminal transition
rules stay in host APIs and model operations.

## Company findings

NH-01 targeted definition-list/Axe regression and NH-04 save/focus/reload tests
passed. NH-02 paper panels, NH-03 logo/fallback/long identity and NH-05 explicit
demonstrative context have runtime evidence in the company-boundaries task. Stage
3B accepts their current visual/local API treatment, closing these scoped findings.
See [host status](../../STATUS.md) for stable dispositions. No global company
redesign or historical-kit rewrite is required.

Full real application/profile/snapshot, search/map/filter/save and history/stage
journeys run with the project gate. Catalog note switching gets a focused isolation
regression. Browser sampling is reported separately; full independent mode and
adjacent-breakpoint acceptance is not inferred from fixture examples or source.
