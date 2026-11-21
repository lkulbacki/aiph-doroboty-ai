# Searchable editor taxonomy dropdowns

Use the listing's below-field popup and light-paper interaction for the editor's
five closed taxonomy lists. Add an opt-in searchable FormSelect composition using
existing Base UI Combobox; keep option values, defaults, required/disabled state
and form serialization. Free-text location remains free text, without inventing
a closed city catalog. Normal Select uses alignItemWithTrigger=false.

Verify filtered selection/no results, keyboard/Escape, portal position, preserved
FormData values and publish, desktop/mobile. Update behavior register for searchable
taxonomies. No dependencies/assets. Stop after this request.

## Composition and review

The trigger keeps the selected label; a named search input lives at the top of
the named popup dialog. This keeps filtering separate from the selected form
value. Root options serialize their stable taxonomy values, not display labels or
search queries. Default labels, form names and domain validation remain unchanged.

A new browser regression checks below-field geometry, one-result filtering, empty
results, Escape/trigger focus, selection serialization and mobile keyboard choice.
Targeted browser inspection verified the popup screenshot and zero Axe violations
for the open named popup and closed form. Initial inline-input composition produced
background-focus audit findings; moving search into the named popup resolved them.

Separate review confirmed Base UI owns filtering, selection and keyboard behavior,
normal Select remains supported, and both new/existing editors use the same API.
FEATURES.md now records searchable closed taxonomies. A short-viewport regression caught automatic popup flipping above the field. The
searchable positioner now keeps the bottom side; opening near the viewport bottom
scrolls the anchor to the center to leave room. Full ./scripts/verify passed: formatting, kit integrity/tests, lint/types,
28 unit tests, packet, build and 47 Chromium journeys. A final short-viewport
visibility check moved room-making to onOpenChangeComplete (after popup focus),
with a corresponding in-viewport assertion. Final build and targeted Chromium regression both passed.
Existing build warnings unchanged. Diff check passed.
Stop here for human review; no commit/push/deployment performed.
