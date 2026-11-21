# Editaurus stage 2E — choices, dialogs, empty and recovery

Authorized on 2026-11-21 as part of completing all remaining stage 2 batches.
Reuse FormSelect, ConfirmDialog, ResponsivePanel and existing messages. Keep
free-text workplace search and domain recovery on their real routes. No duplicate
primitive/controller, dependency or upstream source replacement. Acceptance:
isolated enum selection/clear and confirmation failure/retry retain state, focus
returns, recovery links preserve scenario data; full gate plus browser inspection.
Human visual/API acceptance remains separate from authorization to implement.

Implemented and reviewed: catalog imports production FormSelect/ConfirmDialog/
ResponsivePanel/Empty/Notice; generic selection and retry feedback are local-only.
The empty/notice owners remain visibly identified as host patterns pending visual
migration. Real free-text search and recovery link to their real routes.
Official Base Combobox/AlertDialog docs were checked; no upstream source was copied.
Manual browser inspection showed initial cancel focus and Escape returning to the
trigger. Full verify passed:28 units,51 Chromium (25.4s), baseline120, build,
lint/types/format and immutable67-file kit/six tests. Existing build/color warnings
remain. Separate React review found local state, stable option keys and no new
persistence/effect/network controller. No new primitive API or style was changed.
Human review of picker error API, legacy recovery appearance and complete portal
mode/breakpoint coverage remains pending. User authorization permits continuing2F.
