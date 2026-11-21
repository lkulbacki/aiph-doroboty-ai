# Role mismatch presentation

The user opened employer jobs as candidate Marek. Existing role gating correctly
omitted employer data but showed the legacy white rounded panel. Migrate the shared
RequireRole role-mismatch composition to the existing editaurus panel and secondary
action. Preserve role checks, Polish explanation and persona-selection destination.
FEATURES.md reviewed: no behavior change. No assets/dependencies.

Verify candidate denial, employer access and mobile. Stop after this correction.

Browser reproduction passed: Marek sees only the role explanation with a light-paper
1 px/4 px panel; employer rows remain absent. At 320 px no overflow; keyboard
activation of Change person and choosing Karolina opens her two jobs. Role
conditions and destination are unchanged. Separate review confirmed the shared
composition is scoped and no access rules changed. Full ./scripts/verify passed: formatting, kit checks, lint/types, 28 unit tests,
packet, build and 46 Chromium journeys. Existing build warnings unchanged.
Diff check passed. Stop after this correction.
