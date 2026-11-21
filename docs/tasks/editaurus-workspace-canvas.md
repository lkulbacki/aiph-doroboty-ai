# Full-width workspace canvas

The screenshot exposes the legacy root background in gutters outside the centered,
max-width main. Set base paper #f4f0e5 on the shared workspace frame and workspace
column, covering wide-screen gutters and space below short content for all roles.
Keep content widths, panel light paper and navigation unchanged. FEATURES.md
reviewed: presentation only. No new dependency or asset.

Verify wide desktop gutters, narrow screens and existing workspace consumers.
Stop after this correction; do not migrate route bodies.

Verified computed frame/column colors at 2560 px on candidate overview, saved offers,
application list/detail, profile and settings. Overview panels retain #fdf9ef.
Inspected the wide desktop screenshot; mobile 320 px has no horizontal overflow.
Separate review confirms backgrounds belong to the shared frame/column, not only
the centered main. Full verify passed: 28 unit tests, 46 Chromium journeys, kit
checks, formatting/lint/types, packet and build. Existing build warnings unchanged.
Diff check passed. Decision and handoff updated; stop for review.
