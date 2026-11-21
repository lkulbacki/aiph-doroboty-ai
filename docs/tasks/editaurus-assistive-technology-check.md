# Editaurus — real-reader check and browser preflight

Date: 2026-11-22. Stage 3C requires a real screen reader, not only browser roles,
keyboard assertions or Axe. **No real reader session was executed.** The available
isolated Playwright Chromium can expose browser semantics but not a verifiable
speech transcript or reader cursor. The local `cua-driver` CLI is absent; no
screen-reader-specific tool is advertised. No reader, extension or OS permission
was installed, and global VoiceOver/browser settings were not changed unattended.
Ardia and personal browser profiles were not accessed.

The final project gate exercises existing candidate/editor/record behavior and
new catalog navigation checks. Actual final results are recorded in
[local closure](editaurus-local-closure.md); this document makes no speech claim.

## Operator session to finish 3C

Use synthetic data in a new browser profile. Start the application with Node.js 24
and `npm run dev`; open `http://127.0.0.1:3001/`. Record reader/version, browser/
version, OS, viewport, verbosity/navigation settings and the actual spoken output
for failures. VoiceOver + a supported macOS browser is one appropriate session;
other browser/reader combinations are not automatically covered. Do not run
multiple controllers against the same desktop focus.

| Journey                   | Actions                                                                                                                                                                                                                                                                                             | Expected observable reader/keyboard behavior                                                                                                                                                                                                                                                                                                                                                        | Existing browser preflight                                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Candidate application     | Choose Anna; open `/#/aplikuj/ai-product-manager`. Read the answer label/help, enter a short answer, approve, submit; correct the answer, submit without renewed approval; save a draft; finally approve and submit.                                                                                | Label, help and invalid state are understandable. Short-answer failure retains text and focuses the answer. Editing resets consent. Consent has the complete visible name; missing consent focuses it and explains failure. Draft completion is distinguishable from actual submission. CV open/download links have useful names. No duplicate/unintelligible announcement; record actual timing.   | Short-answer/consent focus, input retention, exact checkbox naming, draft status, PDF semantics, immutable submission and reduced motion have regressions.             |
| Employer editor           | Choose Karolina; open `/#/app/oferty/nowa`. Clear Kategoria, type an unmatched query and Tab away; return, search `lea`, use arrows/Enter. Read other required choices, clear/reselect one, edit text and approve/publish only if desired.                                                          | Combobox name, required state, expanded selection/no-results and option confirmation are understandable. Search text is not a valid confirmed value. Error/help are associated. Escape closes suggestions; selected enum is retained. Approval uses the full visible label and is revoked by edits. Record what the reader says about changing results.                                             | Confirmed-value native validity, described error, keyboard replacement/clear, five required enums and approval reset have regressions.                                 |
| Recruiting record         | As Karolina open `/#/app/kandydaci/application-example`. Read identity, stage and snapshot. Use ArrowRight/Home between Answer/CV, edit a note, switch tabs, save a permitted stage with note, inspect history and reload.                                                                          | Tab names/selected panel are announced; reading order distinguishes facts, answer/CV, private note and history. Note survives tab changes. Stage action moves focus to the new stage; history is intelligible and persisted. Terminal state removes unavailable editing operations. Native PDF viewer behavior is recorded separately.                                                              | Keyboard tabs/note retention, snapshot/CV boundaries, stage focus/history/reload/terminal states and record Axe have regressions.                                      |
| Catalog navigation/dialog | Open `/#/design-system/editaurus`; navigate by landmarks/headings, Tab/Enter each contents link, use browser Back/Forward and reload a copied section URL. Search a local choice; open confirmation, provoke the preview failure, retry/cancel; on narrow width open the filter preview and Escape. | Contents has a useful landmark name; current location and destination heading are perceivable. Section navigation moves reading/keyboard focus without trapping it. Dialog has a name, traps focus while open, retains an error for retry and returns focus on close. Preview feedback is clearly synthetic; nothing is saved. Record speech and reader-cursor synchronization, not just DOM focus. | Every section is checked at 320/390/1280px; history/reload at 390/1280px. Choice/dialog error/retry/Escape/return focus and unchanged scenario state have regressions. |

## Recording and stop condition

For each journey record pass, concrete finding or not exercised, with the observed
reader output. Reproduce a finding before changing the shared owner; repeat its
real consumer and catalog specimen after a correction. Run relevant regressions
and the full gate after code changes. Do not mark all four passed from this
checklist or from browser preflight. The remaining human work is one real reader
session, followed only by fixes supported by that session; no broad redesign or
WCAG certification is implied.
