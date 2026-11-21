# Workspace chrome paper correction

Apply the user's selected #f4f0e5 to sidebar, topbar and mobile header only.
Keep content panels #fdf9ef and existing control states. Update the header color
assertion. FEATURES.md reviewed: visual only, no behavioral change.

Verified computed colors on desktop and 320 px mobile: chrome uses base paper,
record sheet retains light paper. Separate review confirmed only those three
background declarations changed. Full verify passed: 28 unit tests, 46 Chromium
journeys, design-system checks, formatting/lint/types, packet and build.
Diff check passed. Stop after this correction.
