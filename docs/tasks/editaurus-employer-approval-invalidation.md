# Reapprove changed offer conditions

Existing text edits revoke publication approval, but location/pay inputs and
confirmed taxonomy changes did not. Revoke approval on their actual changes too,
retaining the existing checkbox/disabled publication guard and all domain data.
Typing an unconfirmed picker search is not a changed enum; confirmation/clear is.
Scope: local employer editor callbacks only, no shared primitive/API changes.
Preserve current worktree. FEATURES EMP-03 updated. Use fresh isolated Chromium
contexts without Ardia or user sessions; run ./scripts/verify and source review.

## Separate review

Three native inputs now reset the existing approved state on change; the five
closed selectors use their existing onValueChange callback, which also handles
clear. There is no form-wide listener that could accidentally revoke approval
when the approval checkbox itself changes. Existing title/brief/summary/description
and proposal handlers already revoke approval and remain unchanged. No new state,
effect, library or domain transition was added. The submit-time !approved guard
and disabled action remain the actual publication protections within this
simulation; this does not add authentication or access security.

The new isolated regression checks each native field and each confirmed selector
at 320px, plus clearing a selection. Each must uncheck approval and disable publish.
It verifies that no edits were persisted, and reload restores the original
location and unchecked approval. Existing publication journeys cover successful
explicit approval/publish. No Ardia/user sessions or persistent user scenario used.

Final ./scripts/verify passed formatting, immutable-kit integrity/six tests,
lint, types, 28 unit tests, baseline packet, build and 57 Chromium journeys
(26.7s). Existing Zod annotation/chunk/color-environment warnings remain. No
visual recipe changes; no new screenshot was needed. This slice closes the
conditions/reapproval inconsistency, not the entire pending product audit.
No dependency/skill/kit changes, commit, push or publication.
