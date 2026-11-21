# Sequential review: company boundaries

Review NH-02 panel, NH-03 identity fallback/long content and NH-05 prototype context.
Keep accepted composition, shared logos/cards, saved ownership, local scenarios and
Base UI unchanged. Add explicit empty summary/description and demonstrative context
where source review confirms absence. Exercise normal/failed logo, long identity,
empty content/offers, 320/850/851/1280 layouts, forced colors and keyboard return.
Run full verification; distinguish runtime evidence from human visual approval.
No import feedback fixes, external assets, skill/kit edits or publication.

Company batch full gate passed: 28 unit / 71 Chromium tests (35.4s). The two new
journeys exercise missing/failed local logo, 200-character unbroken name, empty
summary/description/website and archived roles. 320/850/851/1280px screenshots,
no horizontal overflow, logo/panel contours and keyboard back link were checked.
Forced-color/reduced-motion Axe main scans also passed. Inspected 320/851px full
screenshots: long name wraps without truncation; facts/empty roles remain legible.
NH-02/NH-03 runtime boundary evidence supplied; human visual approval not inferred.
NH-05 missing context corrected locally; FEATURES PUB-07 updated. Shared CompanyLogo
required no code change. Data schema still requires nonempty name/location/size;
no invalid imported fixtures or invented metadata were introduced.

Next sequential review: required selection invalid focus and portaled picker,
approval keyboard focus, optional remote filter in forced colors/reduced motion
at narrow and adjacent breakpoint. No product implementation change planned
unless runtime evidence identifies a defect. Existing green gates do not replace
this targeted media-mode inspection or a real assistive-technology session.

The expanded gate exposed two media-review failures (71 passed / 2 failed): the
mobile check helper observed a replaced control after URL updates (fresh snapshot
already checked), and Axe reported paper foreground on forced white backgrounds
for filter hover and selected list view. Screenshot review also showed custom
filter check not reliably conveying selection. Forced colors now uses visible
native checkboxes, hides the duplicate custom glyph, and explicitly uses system
Canvas/CanvasText with Highlight outlines on those states. Standard colors remain
unchanged. Test uses click plus fresh checked assertion and scans the actual mobile
dialog, rather than its inert main backdrop. No suppression of Axe rules.

Separate review: company changes stay in CompanyPage and never alter fixtures,
logos or shared JobCard behavior. Existing shared consumers remain covered by the
full gate. The forced-color fix is media-scoped to existing filter/view owners;
standard color recipes and URL/filter semantics remain intact. FEATURES PUB-07
was updated for company copy; the media fix changes presentation, not filter
behavior, so PUB listing entries were reviewed without adding new domain claims.

The next full run had 72 passes / one mobile failure: scanning the actual dialog
also exposed its footer button's paper foreground on forced white. It now uses
ButtonFace/ButtonText in forced colors. A checked-filter screenshot is captured
at both widths. This is the same targeted media review, not a general theme reset.

## Final result and stop boundary

Final full ./scripts/verify passed: format, historical kit integrity/six tests,
lint, types, 28 unit tests, baseline packet, build and 73/73 isolated Chromium
journeys (35.0s). Existing Zod annotation/chunk-size/color-environment warnings
remain. Final 320/851px forced-color filter screenshots inspected: native checked
mark and focus outline visible, footer readable. Required-field reportValidity
focus, associated errors, popup keyboard confirmation and approval Space passed.
No new defect remains from these targeted reviews. No user browser/Ardia access.

This finishes the actionable company and recent-control boundary review batches.
Remaining ledger items are human visual/API acceptance, exact upstream provenance
before any future replacement, asset publication rights, and real screen-reader/
other-engine testing. They are not silently accepted or treated as implementation
bugs. Rewriting primitives, publishing assets, or certifying accessibility would
change the task context. Import feedback remains deliberately deferred. No commit,
push, deployment, portable skill or historical kit change was made.
