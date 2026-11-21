# Inactive publication action

The user reported the disabled Publish button looked enabled before approval.
Use the same disabled border/fill/text palette as the secondary AI proposal action
inside the job editor. Keep the shared application's submitted-success button
unchanged. Preserve `disabled={!approved}` and all approval/publication behavior.
FEATURES.md reviewed: no behavior change. Verify both inactive actions and approval
enabling publication. Stop after this correction.

Separate review: one scoped selector joins the existing disabled palette; no
handler or domain change. Browser check confirms both actions are initially
disabled with identical fill/text colors, approval enables green publication,
and title edits revoke approval. Full ./scripts/verify passed: formatting, kit checks, lint/types, 28 unit tests,
packet, build and 46 Chromium journeys. Initial ad hoc checkbox name lookup did
not match; repeated with the project journey selector. Existing build warnings
unchanged. Diff check passed.
