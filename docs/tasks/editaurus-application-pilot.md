# editaurus candidate application form pilot

Slug: `editaurus-application-pilot`
Started: 2026-11-14
Status: Accepted by the user on 2026-11-14. This stage is closed.

## Goal and scope

Check the first editaurus controls on a real candidate task: complete an application for an existing job, including the CV link, answer, consent, draft and submit. The pilot is confined to the form on `/#/aplikuj/:slug`. The adjacent offer preview and page chrome remain under the current Poster People styling. The app's routes, example data, local state transitions, application snapshots and validation remain intact.

## Acceptance criteria

- The form uses the recorded editaurus ink, paper, green and accent colors, local DM Sans, square contour, static 3 px inner bottom focus line and two-layer hero submit treatment.
- The accent pair changes on a new non-touch hover and never repeats immediately; touch does not randomize it. Keyboard focus shows the hero treatment and a visible outline. Forced-colors and reduced-motion states remain usable.
- The real answer, consent, CV, draft and submission flow continues to work at desktop and mobile widths. Errors focus the relevant control; long content and the offer preview are not lost.
- No shared Base UI primitive, global theme or new runtime package is changed. Other screens retain their current styling.

## Files and decisions

- `src/features/prototype/workspace.tsx`: apply a form-scoped class, add a decorative arrow and select the hero accent pair on pointer entry. Domain operations stay unchanged.
- `src/app/application.css`: style only the application form and its descendants; preserve the existing offer preview styles. Bundle `src/app/fonts/dm-sans-variable.ttf` with `DM-Sans-OFL.txt`.
- `tests/e2e/prototype.spec.ts`: verify pilot focus, font, hero state, isolation from the offer preview, forced-colors and mobile overflow.
- `FEATURES.md`: register the visual pilot at CAN-09. SYS-01 was reviewed and remains accurate because no shared UI primitive changed.

The pilot establishes an implementation example, not yet a shared component API. The user accepted the real screen on 2026-11-14, allowing the next stage to extract and document reusable form variants. See [decisions](../design-system/editaurus/decisions.md) and [asset review](../design-system/editaurus/assets.md).

## Verification and handoff

- **Done:** Implemented the form-scoped visual treatment and local DM Sans asset; recorded the visual boundary and font provenance.
- **Checked:** Desktop and 390 px mobile view of the real Anna Kowalska application route; empty-submit errors, focus line and form layout were inspected in a browser. The adjacent offer preview retained its current treatment. The new targeted Playwright journey and static build passed before the full gate.
- **Remaining:** A public component/state showcase and other screens remain future stages. The existing company-page findings in `docs/design-system/STATUS.md` remain open.
- **Start next time:** Extract only the accepted hero submit action into a reusable editaurus component and show its states in a small component preview. Recheck the existing application flow before stopping for another human review.

## Full gate

On 2026-11-14, the complete `./scripts/verify` passed with permission to bind the local Playwright preview port: formatting, Poster People kit integrity (67 files) and six kit tests, lint, typecheck, 27 unit tests, baseline packet (120 journeys), build and **35/35 Chromium tests**. An initial restricted run stopped at Playwright server startup (`listen EPERM` on port 3106); permission resolved that environment limit, and the full script then passed. The Poster People kit result verifies retained historical assets, not editaurus. The build emitted existing third-party Zod annotation and bundle-size warnings and succeeded.

A separate diff review inspected the form handler, scoped styles, new browser test and documentation. No domain transition, route, shared Base UI primitive, dependency manifest or lockfile changed. `git diff --check` passed. The earlier, uncommitted direction-stage documentation remains in the worktree and was preserved.
