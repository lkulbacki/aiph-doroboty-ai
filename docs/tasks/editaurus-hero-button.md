# editaurus hero action component

Slug: `editaurus-hero-button`
Started: 2026-11-14
Status: Accepted by the user on 2026-11-14. This stage is closed.

## Goal and scope

Turn the accepted application submit-action pilot into one reusable editaurus component and a first public component-state preview. Keep the real application form as its behavioral reference. This stage covers only the hero action; field, checkbox and CV variants remain in the application pilot until their own stages.

## Acceptance criteria

- The application submit action uses the extracted component without changing draft, validation, consent, submission, snapshot or redirect behavior.
- The component uses centered text without a decorative arrow and preserves its current accent pair on keyboard focus, new nonrepeating pair on non-touch hover, no randomization on touch, outlined double shadow, disabled state, reduced-motion treatment and forced-colors outline.
- A direct public preview route shows the same component in interactive and disabled states, with a link to the real application task. It uses no separate demo controller or product data.
- Desktop and mobile views, keyboard focus, hover, press and disabled behavior are checked. The full project gate passes.

## Files and decisions

- `src/components/editaurus/hero-button.tsx`: composes the existing Base UI-backed `Button`, owns accent-pair selection, and preserves caller props/ref.
- `src/app/editaurus.css`: holds the shared surface colors, local DM Sans declaration, hero states and preview layout. The application-specific form rules remain in `src/app/application.css`.
- `src/features/editaurus/components-page.tsx` and `src/features/prototype/app.tsx`: expose the same component at `/#/design-system/editaurus` without affecting product data.
- `tests/e2e/prototype.spec.ts`: checks application reuse, desktop/mobile containment, disabled state, link back to the real form and touch behavior.
- `FEATURES.md` records the partial public route as PUB-14. The component API and limits are in [hero action](../design-system/editaurus/components/hero-action.md).

## Verification and handoff

- **Done:** Accepted the prior application pilot; extracted its hero action; added the partial public preview and portable component specification.
- **Checked:** Built the app and ran the three targeted editaurus Chromium tests. In a browser, the desktop preview exposed a long-label overflow; the shared component now wraps the label within its card. The mobile preview and real application form are covered by browser journeys.
- **Remaining:** The form field, checkbox, CV, other button families, full public showcase and remaining screens are outside this stage. Page chrome still uses Poster People and belongs to a later migration scope.
- **Start next time:** Implement only the secondary save-draft action as the next small component family, preserve draft behavior, and stop for human review.

## Full gate

On 2026-11-14, `./scripts/verify` passed: formatting, retained Poster People kit integrity (67 files) and six kit tests, lint, typecheck, 27 unit tests, baseline packet (120 journeys), build and **38/38 Playwright Chromium tests**. The three editaurus journeys cover the real application form, the component preview at desktop/mobile widths and touch. The kit result verifies the historical reference, not editaurus. The build completed with existing third-party Zod annotation and bundle-size warnings.

A separate review inspected the extracted component, scoped CSS, route, state examples and test coverage. The component keeps Base UI props and ref behavior; the application domain operation and shared Base UI primitive are unchanged. `git diff --check` passed. Earlier uncommitted direction and pilot changes were preserved.

Follow-up after human review: the preview link reached the existing submitted-application notice for a candidate who had already applied to AI Product Manager. The link now chooses an unsent published job for that candidate and leaves scenario data intact. A browser journey covers this persisted-state case; build and targeted Chromium tests passed. The full gate was rerun after this correction.
