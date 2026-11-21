# Preserve existing job locations on republication

The editor displays an existing locations array joined with " / ", but previously
always saved that display text as one location and recomputed coordinates using a
small city dictionary. Republication without changing location could therefore
flatten the list and lose imported map coordinates. Preserve the original array
and coordinates when the normalized field text is unchanged. Explicitly changed
free text retains the current single-location contract and dictionary lookup;
unknown changed places must not keep the previous, stale pin.

Scope: employer editor only, no new parser/geocoder/dependency or domain schema.
Preserve dirty worktree, snapshots, approval and ownership. Use isolated Chromium
contexts, no Ardia/user sessions. FEATURES EMP-03 updated. Run ./scripts/verify.

## Separate source review

Both persistence fields use the same unchanged-text guard. The payload still
passes through jobSchema and the existing publish transition/ownership boundary.
The original locations and coordinates are not mutated. Trimming unchanged outer
whitespace preserves metadata. Explicit changes keep the existing free-text
contract; no slash splitting or guessed geocoding is introduced. Unknown changed
locations omit coordinates instead of retaining a pin for the former location.
No extra state/effect, primitive, dependency or presentation change was added.

Browser regression seeds two synthetic locations and a non-dictionary coordinate
pair in a fresh context, reloads before persona selection, then republishes and
reloads. It asserts the exact array/pin survive, edits to an unknown place, and
checks that the new single location survives while the old pin is absent. This
checks the saved scenario, not merely the editor's display string. The file-import
UI itself is not exercised by this fixture setup. No user sessions are touched.

Final ./scripts/verify passed formatting, immutable-kit integrity/six tests,
lint, types, 28 unit tests, baseline packet, build and 56 Chromium journeys
(27.5s). Existing Zod annotation/chunk/color-environment warnings remain. No
visual change required a new screenshot. This bounded data-preservation fix does
not claim a complete candidate/employer audit or human approval of pending UI.
No Ardia, dependency/skill/kit changes, commit, push or publication.
