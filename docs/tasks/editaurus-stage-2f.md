# Editaurus stage 2F — domain compositions

Authorized continuation after2E. Add production JobCard/SalaryFact/RecordSheet/
ProcessTimeline/MatchScore catalog compositions, with local-only note state and
no save/submission operations from examples. Preserve real listing/search/map/
filter/URL/role/snapshot/recovery owners. Verify company findings individually;
fix confirmed missing candidate save binding with targeted persistence/role tests,
without inferring visual acceptance from tests. Full gate and separate review.

Implemented production-owner catalog compositions and candidate-specific saved
binding on company rows. Focused company regression passed toggle/focus/reload/
removal and employer exclusion; targeted current main-content Axe found no
serious/critical violations. NH-01 is verified for this structure/route and NH-04
is functionally closed; NH-02/03/05 remain open. Other route visual/API acceptance
was not widened. FEATURES retains IDs and records the restored save behavior.

Initial full verify passed 28 units / 53 Chromium (25.1s), baseline 120, static build,
format/lint/types and immutable kit. Browser review then caught context/style
issues: SalaryFact without editorial-offer-pay showed the legacy badge; its
existing production context was added. At 320px long tabs measured 306px scroll
inside 239px width; scoped editaurus tabs now allow shrink/wrap, keeping the same
colors/contours/keyboard owner. Manual recheck measured 239/239 and visible labels.
These corrections require the final gate recorded in the completion task.

Manual desktop/390/320 sampling covered records/history, missing salary, company
save availability and confirmation focus. No scenario record was mutated during
manual inspection. The temporary viewport was reset. Existing real-route tests
exercise state-changing operations only in isolated test contexts. Catalog save
controls are deliberately absent; note editing is local and survives tab changes.

Separate React/source review checked controlled local state outside tab panels,
stable keys/dates, primitive render composition, no duplicate filters/map/recovery
controller, no real recruiting decision in examples and no imported external assets.
Exact upstream conformance is not certified and no upstream source replacement
was attempted. The user authorized continuation to portable skill 2G.
