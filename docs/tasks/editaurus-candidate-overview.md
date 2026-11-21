# Candidate overview

Migrate candidate /app only: paper canvas, existing greeting, light-paper 1 px
stat panels, existing HeroLink and SecondaryButton. Preserve all three counts,
persona data and destinations. Employer overview and profile editor stay outside
this scope. FEATURES.md reviewed: visual only, existing CAN-01 behavior unchanged.

Verify candidate counts, both links, mobile, keyboard and employer isolation.
No new assets, dependencies or domain logic. Stop for human review.

Implemented candidate-scoped panels and actions in WorkspaceHome, the candidate
canvas scope in Shell, and overview stat spacing/type in editaurus.css.
Reviewed desktop 1440 px and mobile 320 px screenshots. Verified Marek's baseline
counts (1/0/1), paper colors, no overflow at 800/390/320 px, keyboard profile link
and marketplace link. Employer overview remains unchanged. Initial employer QA
landed on its default job list; the explicit /app check passed afterward.

Separate review confirmed existing counter expressions and role branches remain
unchanged; no new state, controllers or dependencies. Full ./scripts/verify passed:
28 unit tests, 46 Chromium journeys, design-system integrity/tests, formatting,
lint/types, packet and build. Existing build warnings remain nonblocking.
Diff check passed. Handoff updated; stop for human review before profile or another
route. No commit or publishing performed.
