# Workspace sidebar/footer boundary

Replace the viewport-fixed desktop sidebar with a sticky sidebar inside a two-column
workspace grid. The workspace frame ends before the shared footer, so the sidebar
must stop at that boundary rather than cover footer content. Preserve 244/212 px
desktop widths and the existing mobile menu. No color or product behavior change.
FEATURES.md reviewed: no update required for this layout correction.

Verify short/long pages, footer geometry, desktop/tablet/mobile and navigation.
Record the separate paper-color audit without applying palette changes.

Verified saved offers and submitted detail at 1440/800 px: after scrolling to the
end, sidebar bottom equals footer top. Mobile menu navigation passes at 320 px.
Separate review confirms sticky positioning is bounded by the workspace grid;
shared footer remains outside it. Full verify passed: 28 unit tests, 46 Chromium
journeys, design-system checks, lint/types/format, packet and build. Diff check passed.

Paper audit: home latest-offers computed background is rgb(244,240,229), matching
`--ed-paper`. Home role sections also use that token. Workspace chrome and framed
panels use `--ed-paper-light` (#fdf9ef). Recommend keeping this canvas/surface split;
legacy workspace route bodies are not migrated by this fix. No palette change made.
Stop for review; continue from the current saved-offers review after acceptance.
