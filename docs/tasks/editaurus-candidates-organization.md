# Employer candidates and organization

User requested both routes in one stage. Reuse the existing editorial application
list for company candidates, retaining search, name/job, status, score, full summary
and detail route. Keep company scoping. Organization reuses profile fields/panel,
hero save, status and secondary public-profile action. Preserve native validation,
limits and the company save operation. No recruiting-detail/editor migration.

FEATURES.md reviewed: existing EMP-07 and organization operations unchanged.
Verify company isolation/search/empty/detail, organization save/reload/public
profile, mobile, keyboard and candidate-list regression. No new dependencies/assets.
Stop for review after these two screens.

## Review and handoff

Reused ApplicationsPage presentation for both audiences, keeping existing owner
filtering and adding employer-only summary in a full-width row. CompanyEditor
reuses the profile field/panel family and CV-independent actions. Shared consumers
include the candidate application list; existing journeys cover its regression.

Browser checks passed: search by job, no-result status, keyboard candidate-detail
entry, company required-field focus, save/status/reload, public company-profile
link and changed name there, organization Axe scan (zero violations), 320 px
organization overflow check and Northstar empty candidate list. Inspected both
desktop screenshots. Synthetic changes used isolated browser state.

Initial lint found the superseded Empty import; removed it. Separate review checked
unchanged handlers, labels, limits, role boundaries and all retained summary text.
Final ./scripts/verify passed: formatting, kit integrity/tests, lint/types, 28
unit tests, packet, build and 46 Chromium journeys. Existing build warnings
unchanged. Diff check passed. Stop for human review after both requested routes. No commit
or publication performed.
