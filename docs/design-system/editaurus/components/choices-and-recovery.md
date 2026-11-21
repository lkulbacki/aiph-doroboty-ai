# Choices, dialogs, empty states and recovery

Stage 2E, 2026-11-21. Implemented catalog examples; visual/API acceptance remains
pending. The catalog imports existing owners, not replacement shadcn source.

| Pattern                | Owner / retained contract        | Catalog and real verification boundary                                                                                                                                                                                                                                                                                                                                  |
| ---------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Closed searchable enum | ui/FormSelect → Base UI Combobox | Local generic options; entry selects label, typing queries, confirmed option sets stable value, X/Backspace/Delete clears, no-results below field. Unknown query never becomes an enum. Searchable branch ignores trigger/content class hooks; required confirmed choices validate independently of query text; describedBy/error connect help and failure to the input |
| Plain selection/sort   | ui/FormSelect → ui/Select        | Native form names and controlled value remain; selected/disabled examples. Popup below 8px, explicit editaurus scope. No conflation with free text                                                                                                                                                                                                                      |
| Workplace query        | marketplace Autocomplete         | Real listing link instead of a second search controller. Query is confirmed with search and reflected in hash URL/history; filters/reset/list/map/sort remain coupled in that owner                                                                                                                                                                                     |
| Confirmation           | ConfirmDialog → ui/AlertDialog   | Local first-attempt error, retained open state, retry/cancel. Production pending blocks dismissal and actions. Catalog has no asynchronous operation or actual import/reset                                                                                                                                                                                             |
| Mobile filters         | ResponsivePanel → ui/Dialog      | Same 850px breakpoint, heading/close, scrolling body/footer and focus handling. Catalog uses isolated filter-free content; real listing contains actual filters                                                                                                                                                                                                         |
| Empty / storage notice | shell Empty and Notice           | Shared self-scoped Editaurus messages: light paper, ink contour, 4px corners; green information rule and rose error state. Explicit recovery navigation, no hidden deletion or reset                                                                                                                                                                                    |

Alert announces a failure; status announces local completion/information. A status
notice is not proof of storage success. Real recovery preserves the original
unreadable save, memory-only changes, 2 MB import validation and export/reset/cancel
boundaries. Retain inline candidate withdrawal; this dialog example does not
replace it. Failed import, terminal transitions and cross-role data projection
stay in existing domain operations. No domain fixture is overwritten from a demo.

The original stage 2D plan included pickers, while the later handoff put them in 2E;
this batch completes that remaining picker scope and the original 2E messages/
dialog/empty/recovery scope. No family is silently dropped by the naming change.

Official [Base Combobox](https://ui.shadcn.com/docs/components/base/combobox) and
[Base Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog) docs
were rechecked. They identify upstream counterparts; they do not certify local
files as a generated revision. Existing Base UI/render APIs and styles remain.
No source replacement was needed; future API replacement requires a pinned diff.

Focused regression verifies enum query/no-results/confirm/clear, confirmation
error retention/retry/focus and mobile dialog Escape. Existing real editor and
listing journeys cover FormData enum stability, replacement, URLs and recovery.
Full gate results and manual observations are recorded in the task. Open human
decisions include full recovery visual acceptance,
confirmation semantics and exhaustive portal mode/breakpoint review.

## Shared message migration

The later [shared-message task](../../../tasks/editaurus-shared-messages.md) migrates
`Empty`, `Notice` and Shell operation errors together. Each root carries
`editaurus-surface` and `editaurus-message`, so storage recovery on an otherwise
legacy route gets the same DM Sans/paper/ink recipe as the catalog. Empty remains
neutral content; Notice retains `role="status"`; operation errors retain
`role="alert"`. No state, wording, import/reset or recovery operation changes.
Links remain underlined with visible focus, including forced colors.

## Required closed choices

FormSelect accepts `describedBy` (space-separated IDs) and `error` (visible text).
The searchable branch exposes required/invalid semantics on its input. Required
validation uses the confirmed option, not search text, with native custom validity;
blur or attempted invalid submission reveals an associated missing-choice alert.
Confirmation removes that error. Disabled choices do not block validation. The
five employer taxonomy fields use this contract; the catalog uses the same owner
with associated help. Plain selection keeps Base UI required validation and can
receive explicit error/help. No inferred searchable blur validation is added to
plain selects or optional filters. See the required-selects task for executed
verification and remaining human/assistive-technology acceptance limits.
