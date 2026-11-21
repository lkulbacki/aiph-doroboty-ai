# Employer salary field basis

Fix misleading hardcoded PLN/gross/month labels when editing an existing offer
with another supported currency, kind or period. Derive labels and publication
payload from the same existing metadata/defaults; no new controls, conversion,
contract-based inference or schema changes. New jobs retain PLN/gross/month.
Preserve prior dirty changes. FEATURES EMP-03 records this behavior correction.
Validate imported EUR/net/year editing and republication plus new-job defaults in
fresh isolated Chromium contexts, including narrow presentation. No Ardia or user
browser sessions. Run ./scripts/verify and review the bounded source delta.

## Review

The editor already retained salaryCurrency/salaryPeriod/salaryKind during
publication but displayed unconditional PLN/gross/month field labels. The new
local constants feed both labels and the existing payload, eliminating that
contradiction without converting amounts. Native numeric constraints, approval,
owner filtering and Base UI/render composition are untouched. No shared helper
or SalaryFact API changed. No added hook, effect, primitive or dependency.

The browser regression seeds a schema-compatible synthetic EUR/net/year scenario
in its own Playwright context (it does not test the file-import UI), reloads before
persona selection, checks both labels/amounts at desktop, checks 320px overflow,
republishes, reloads and verifies all five salary values. It then checks the
unchanged new-offer default. This is a bounded correction, not a completed audit
of every candidate/employer flow. Existing dirty worktree changes are retained.

First full gate: 28 unit and 54 browser tests passed; the new journey timed out
because its exact checkbox selector did not match Base UI's combined ARIA/visible
label. The regression now matches the stable approval phrase within that name;
no product workaround was added. The generated 320px screenshot was inspected:
EUR/net/year labels and both unchanged amounts fit in the existing form panel.

Final ./scripts/verify passed formatting, kit integrity/six kit tests, lint,
types, 28 unit tests, baseline packet, build and 55 Chromium journeys (29.8s).
Existing Zod annotation/chunk/color-environment warnings remain. No Ardia,
user-session access, dependency/skill/kit changes, commit, push or publication.
