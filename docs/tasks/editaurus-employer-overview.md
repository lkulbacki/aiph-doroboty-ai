# Employer overview

Apply the accepted overview composition to the employer /app: reuse candidate
heading, paper canvas, light-paper stat panels and hero/secondary actions. Keep
company-scoped counts, existing labels, role destinations and operator redirect.
Consolidate the shared presentation instead of duplicating the dashboard.
FEATURES.md reviewed: EMP-01 behavior unchanged. No assets or dependencies.

Verify both employer personas, candidate regression, counts, offer/candidate links,
keyboard and mobile. Stop before lists, editors or recruiting-detail migration.

Separate review: the shared overview now uses one presentation for both roles,
keeping existing role-specific expressions, labels and routes. No domain changes.
Browser inspection at 1440 px confirms the accepted layout; at 320 px no overflow.
Observed baseline counts: BrightLabs 1/2/1, Northstar 0/2/0, Marek 1/0/1. Both
employer destinations work, including keyboard activation of the candidates link.
Tests used isolated browser state. Full ./scripts/verify passed: formatting, kit integrity/tests, lint, types, 28 unit
tests, packet, build and 46 Chromium journeys. Existing build warnings unchanged.
Diff check passed; stop for human review.
