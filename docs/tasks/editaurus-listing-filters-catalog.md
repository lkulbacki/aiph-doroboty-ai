# Listing filter catalog documentation

Add a Polish catalog guide for existing listing groups, selection/clearing,
salary limits and normalization boundaries, category/query/location, chips/reset,
sort/URL/page behavior, mobile immediate updates and keyboard/focus. Import option
labels from production and link to actual listing states; no duplicate filtering
controller or new primitive. Sources: JobFiltersForm, filters.ts, JobsPage and
ResponsivePanel. FEATURES reviewed: documentation only, no domain behavior change.
Preserve earlier uncommitted visual fixes. Verify layout/links and full project gate.

Separate review: option labels come from presentation maps, salary text matches
monthlyPln and the lower-bound filter, reset retains only map view, and mobile
breakpoint/close behavior matches ResponsivePanel. The guide uses h3 within its
h2 section; the catalog heading recipe now covers both levels to retain DM Sans.
No new controller, persistence, dependency, fixture, skill or historical-kit change.
Initial full gate passed 28 unit / 73 Chromium (37.0s). Inspected 390px guide and
measured 390/1280px without document overflow; all three preset links rendered.
Actual remote preset navigation produced a checked Zdalnie checkbox in isolated
Chromium. Heading typography correction prompted a final full verification.

Final ./scripts/verify passed: formatting, historical kit integrity/six kit tests,
lint, types, 28 unit tests, baseline packet, build and 73 Chromium tests (34.8s).
Final isolated browser probe confirms DM Sans on guide h3 headings. Existing build
warnings remain. No added tests for static documentation; real layout/link checks
and existing listing/catalog journeys executed. No commit/push/publication.
