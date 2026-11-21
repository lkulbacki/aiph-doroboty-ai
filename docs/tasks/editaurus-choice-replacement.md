# Replace existing picker values by typing

User requests select-on-entry, Backspace clearing and typing to replace an existing
selection in the editor and listing workplace. Remove editor input read-only.
Select current text on focus/click; Backspace/Delete on an unchanged selection
uses Base UI Clear. Typing filters the closed options; confirming a choice selects
its stable enum. Listing workplace selects existing text, Backspace/Delete removes
the applied location preserving other filters/focus; replacement query still uses
the existing search confirmation. Preserve URL/history and form/domain contracts.

FEATURES.md updated for the editor interaction. Verify mouse/keyboard selection,
type replacement, Backspace, enum serialization, location URL clearing/replacement,
mobile and existing workflows. No dependencies/assets. Stop after this request.

## Review and verification

Both editor click/focus handlers select the current label, and Backspace/Delete
use the existing clear operation. Auto-highlight makes Enter confirm a typed
matching option. Listing focus/click selects the applied location; clearing keeps
category and other URL criteria. Added explicit workplace aria-label so its name
survives Base UI popup isolation.

The new regression covers text selection, typing Build→Apply and confirming with
Enter, clearing/reselecting, Warsaw removal and Warsaw→Wrocław replacement with
the category preserved. Initial harness used an unavailable Kraków suggestion;
corrected it to baseline Wrocław. The earlier name lookup while the popup was open
exposed the workplace accessible-name issue, fixed above. No user data changed.

Separate review: no new domain operation or controller; hidden form values remain
selected enums and query typing does not create an option. Listing still applies
replacement through its existing search confirmation. Full ./scripts/verify passed: formatting, kit integrity/tests, lint/types,
28 unit tests, packet, build and 48 Chromium journeys. Existing build warnings
unchanged. Diff check passed. Stop
for human review after this correction.
