# Persona selection

Apply editaurus to PersonPicker, auth-route canvas and existing marketplace header
composition. Preserve all people, candidate/employer audience filtering, role
selection operation, safe next handling and role destinations. Use existing panel
and secondary-action styles. No real login or new assets/dependencies.
FEATURES.md reviewed: presentation only, no behavior change.

Verify guest/all/filtered lists, switching an existing persona, keyboard, mobile,
long names, candidate return destination and employer/operator defaults. Stop after
this correction for human review.

Browser checks passed: five-person guest list, two-person employer/candidate
filters, switching from an existing persona, employer default /app/oferty,
candidate safe return /app/zapisane, keyboard activation and no overflow with a
long name at 320 px. Inspected desktop screenshot; targeted Axe scan has no
violations. Existing gate covers operator default and persona keyboard selection.

Separate review: selector scope is explicit, Base UI button semantics remain,
all selection/filter/navigation handlers are unchanged. Auth modes and unauthenticated
workspace fallback share the canvas/header composition. Superseded Button import
was removed after initial lint. No user data changed (isolated browser context).
Final ./scripts/verify passed: formatting, kit integrity/tests, lint, types, 28
unit tests, packet, build and 46 Chromium journeys. Existing build warnings
unchanged. Diff check passed; stop for review before another screen.
