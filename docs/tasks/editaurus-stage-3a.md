# Stage 3A — Catalog organization

Scope: organize current coverage into foundations, components and patterns with
section navigation. Preserve Editaurus appearance, production examples, existing
local state and all links. No new component families or domain controllers.
Use React Router section hashes within the hash route for direct links/history;
focus the section heading after navigation. Mobile contents stay in normal flow;
desktop contents are sticky. Current-location marking reflects the URL selection,
not an unimplemented scroll spy. Brief visual foundations reuse current tokens.
Acceptance: keyboard/mobile/deep link/back navigation and unchanged examples/data.
FEATURES catalog entry updated; full verification and separate review required.

Separate review: navigation is a semantic nav/ul/Link structure, targets are
whitelisted from its own entries, and the effect only synchronizes scroll/focus
with the router hash. No observer, domain state, global controller or dependency.
Current selection follows URL clicks/history, not arbitrary scroll position.
Existing catalog components remain mounted, preserving preview state. No source
assets, historical kit or portable skill changed; no commit/push/publication.
Initial verification found a TypeScript readonly-tuple union inference error in
the navigation list. Explicit readonly group/item types corrected it before rerun.

The next gate reached 74 passes / one failure: an older secondary-button test
indexed all cards by position, so the new foundations shifted its target. Scope
its card locator to the existing direct component grids, retaining its original
state/hover/forced-color assertions. The first rerun had already loaded the old
spec before this test-only correction; final gate rerun uses the corrected file.
Screenshot review also identified browser scroll restoration after reload overriding
an early heading scroll. Two animation frames now synchronize focus/scroll after
layout; the new tests assert heading viewport visibility as well as focus. Final
desktop capture shows the URL-selected filter heading and sidebar together.

Final ./scripts/verify passed: formatting, historical kit integrity/six tests,
lint, types, 28 unit tests, baseline packet, build and 75 Chromium journeys (37.1s).
The two navigation regressions exercise 390/1280px direct section load, keyboard
Enter, current-location marking, back/forward, reload, focused heading in viewport,
no document overflow and unchanged scenario storage. Existing catalog/real-route
journeys pass with the corrected test scope. Final desktop/mobile screenshots
reviewed: active filter section is visible and sidebar/mobile content stays within
width. Existing build warnings remain. 3A implementation complete; 3B human
visual/API review remains next. No new component families or automatic acceptance.
