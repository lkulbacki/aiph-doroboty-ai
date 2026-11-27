# AI job placeholder skill

Create a portable Codex skill that drafts synthetic Polish AI job offers for the DoRoboty.ai prototype. Use the new-offer editor and existing marketplace fixtures to capture the form fields and taxonomy.

## Acceptance criteria

- Inspect the rendered employer form at `/#/app/oferty/nowa` and capture its editable fields, choices and validation.
- Generate one complete, paste-ready offer by default. Draw a category independently for each unspecified offer and honor explicitly requested categories or job roles.
- Use source material to inform the work scenario while keeping the generated records synthetic and suitable for human review.
- The skill can run outside the repository using its bundled form contract and role examples. Generating text has no effect on prototype state.

## Review and validation

- Reviewed `FEATURES.md` (EMP-03). The skill uses the current form and adds no prototype behavior, so the register needs no update.
- Confirmed all labels and dropdown choices in the rendered editor. On a 390px viewport, saved a synthetic Build offer by keyboard and recovered all values after reloading the draft. Publication approval remained unchecked.
- Validated both copies with `skill-creator` and checked that the installed copy matches the repository copy.
- `./scripts/verify` passed through the production build, including all 33 unit tests. The sandbox blocked the preview server on port 3106. Rerunning the Playwright stage with local server access passed all 81 browser tests.
