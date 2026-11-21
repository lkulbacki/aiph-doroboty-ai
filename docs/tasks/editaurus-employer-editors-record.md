# Employer editor and recruiting record batch

The user requested all remaining similar employer forms/records together. Scope:
/app/oferty/nowa, /app/oferty/:id, /app/kandydaci/:id. Reuse the profile form and
shared submitted-record composition. Preserve local brief/proposal/human approval,
all taxonomy/pay fields, publish operation, snapshot tabs/PDF, notes, history and
actual stage transitions. No domain or role changes.

FormSelect adds an optional portal class, used only by the editor to carry
editaurus tokens through the portal. Other consumers stay unchanged. Base UI
retains select/checkbox/tabs behavior. Recruiting record adopts the already
verified record layout and secondary/danger actions; do not clone controllers.
FEATURES.md reviewed: existing behavior unchanged. No assets/dependencies.

Verify create/edit/publish, proposal approval reset, selects/checkbox, errors,
notes/tabs/stages/terminal/focus, snapshot role boundaries, desktop/mobile. Stop
for review after this batch.

## Verification and handoff

Inspected desktop screenshots for existing offer editor and recruiting record;
new-offer route also captured. Browser checks verified create/edit/detail at 320 px
without overflow, taxonomy portal paper styling, actual editor destination, note
mutation, status focus and note persistence after reload. Targeted recruiting
record Axe scan returned zero violations. Tests use isolated browser state.

Full ./scripts/verify passed: formatting, kit integrity/tests, lint, types, 28 unit
tests, packet, build and 46 Chromium journeys. Existing end-to-end publication
covers proposal/use/approval/publish, subsequent candidate application and employer
decision. Record journeys cover tab note retention, snapshot/PDF/custom text,
terminal states, long content and candidate omission of employer notes. Existing
build warnings unchanged. Diff check passed.

Separate review: Base UI controls/render semantics and all operation handlers
remain; optional FormSelect portal class affects only the editor. The employer
record now intentionally shares the accepted candidate record treatment; updated
the former employer-isolation presentation assertions accordingly. Historical
reference kit untouched. Stop for human review; no commit/push/deployment.

Review links (select Karolina first):

- /#/app/oferty/nowa
- /#/app/oferty/20000000-0000-4000-8000-000000000001
- /#/app/kandydaci/application-example
