# Inline taxonomy search and clearing

User replaces the popup search field with one main input, matching listing
workplace anatomy. Existing selected values remain visible/read-only until cleared
with X; after clearing, the same input filters the closed options. Selection still
serializes stable enum values, not queries. No second search input in the popup.
Preserve defaults, popup position, keyboard and domain validation.

Update the prior regression to exercise clearing, editable empty input, filtering,
selection and form values. No new dependency/assets. Stop after this correction.

Browser inspection at 1280x720 confirms clearing Build, typing lea in the main
input, only Lead in the popup, no popup input, selecting Lead and serialized
category=lead. Screenshot inspected. Shared component affects all five taxonomy
fields in both new/existing job editors; no domain/schema changes. FEATURES.md
records the inline search and clear behavior.

Separate review checked controlled defaults, null selection, Base UI Clear,
keyboard focus, no duplicate form names and selected-only enum serialization.
The prior popup-search decision is explicitly superseded in decisions.md.
The initial accessibility regression identified a non-focusable scrollable popup;
made that popup keyboard-focusable while keeping input focus/active-descendant
navigation. Final ./scripts/verify passed: formatting, kit integrity/tests, lint/types,
28 unit tests, packet, build and 47 Chromium journeys. Updated regression
closes the popup before using its external clear control, then checks inline
filtering, selected enum values, no nested input, Escape and mobile keyboard.
Existing build warnings unchanged. Diff check passed. Stop for human review after this correction.
