# Candidate entry hero

Replace the prototype home hero with the original landing composition and candidate copy for a trial. Preserve the source illustration, typography, colors, responsive rules, and scroll motion. The primary link opens published offers, the employer link enters the existing employer flow, and the bottom link reveals the existing role categories. Verify narrow and desktop widths, keyboard navigation, and reduced motion. Stop for review of the candidate entry before expanding to other sections.

## Verification and handoff

`./scripts/verify` passed with 27 unit tests and 44 Chromium journeys. Reviewed browser screenshots at 1366 px and 320 px. The review exposed the host link color on the dark hero. Set the secondary link to paper and reran the build and the home journey successfully. The home journey verifies artwork loading, scroll motion and reduced motion, role-section focus, keyboard entry to offers, and the employer picker leading to offer management.

Review the candidate message and action hierarchy at `/#/`. Compare against the employer-first original at `/landing/` while running the local dev server with the original preview files. End this stage at visual review.

## Header and action revision

The home header now matches the hero background and uses underline feedback for its text links. The candidate CTA lifts diagonally and stops 1 px short of rest on each axis when pressed. “Kogo szukamy” focuses the three role categories. The employer entry remains in the header.

The full gate passed formatting, kit checks, lint, types, 27 unit tests, and build. Chromium passed 43 of 44 journeys. The home journey caught the inherited pointer restriction on the new button. After restoring pointer events for hero buttons, the build and focused home journey passed, including the hover and press offsets, mobile layout, and both navigation paths.

## Shared CTA follow-up

The offer link now uses the form's editaurus CTA styles and shadow interaction while retaining native link behavior. The home variant uses yellow and preserves its partial press endpoint. The role shortcut has a transparent hover background and underlines only its label.

Reviewed `FEATURES.md`. Navigation behavior is unchanged. `./scripts/verify` passed all checks, including 27 unit tests and 44 Chromium journeys. The home test covers the yellow hover fill, shared stacked shadow, and label-only underline.

The home header revision uses the shared secondary action for the account link, visible hover for sign-in controls, and paper underline feedback for text links. The offer CTA alternates blue and pink shadows. The roles shortcut uses the same underline feedback as the navigation.

The roles shortcut now uses regular weight with more space from the CTA. The signed-in home header uses the same ghost treatment for “Moje konto” and the person-switch icon.

Final review requested a diagonal press for both signed-in home header controls. The account link and person-switch icon now move 1 px right and down on press. The behavior register was reviewed and needs no update for this visual change.

The user accepted the hero and header and requested the next stage. See [home role categories](editaurus-home-roles.md).
