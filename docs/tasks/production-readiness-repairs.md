# Production readiness repairs

## Intent and authorization

The user authorized fixing the three defects identified by the readiness audit: unbounded optional AI calls, cross-tab scenario overwrites, and vulnerable development dependencies. Preserve existing uncommitted EXP-01 work. No deployment, paid provider calls or account-policy changes are included.

## Acceptance criteria

- Local AI endpoints share one in-flight slot, a 10-request fixed-minute window and a 100-request process budget. Rejected requests return HTTP 429, useful Polish feedback and Retry-After when retry is possible. Failures release the active slot but still consume the attempt budget.
- One browser tab owns the scenario writer lock. Other tabs cannot persist domain actions, import or reset, and receive recovery guidance. A stale snapshot cannot overwrite storage changed outside the lock protocol. Unsupported lock APIs fail closed for writes.
- Preserve version-1 imports, unavailable-storage memory recovery and all existing flows.
- Remove reported dependency vulnerabilities using npm and its generated lockfile, without force or unrelated major upgrades.
- Add focused unit and multi-tab browser regression tests; run ./scripts/verify, npm audit and participant packaging.
- Update FEATURES.md and operating documentation. Perform a separate review and refresh the offline readiness audit with actual evidence.

## Design decisions

The writer lock is held for the lifetime of the tab using the browser Web Locks API. This deliberately avoids merging stale form state. Close the writer and reload another tab to hand over. A storage snapshot comparison also detects changes by older app versions or external scripts. AI limits bound attempts rather than currency because provider prices vary; provider account budgets remain a separate human control.

## Separate review

Reviewed the changed persistence and proxy paths after implementation. The writer lock covers domain actions, import and reset; a snapshot conflict returns failure before replacing memory or storage. Existing corrupt-save and quota/denied-storage recovery is retained. Lock acquisition is deferred to a microtask so StrictMode's discarded first effect does not compete with the surviving effect. Cleanup releases an acquired lock and ignores disposed callbacks.

The AI gate is shared across endpoints; its active slot is released in finally, while failed attempts still consume the finite budget. Rate-limit responses retain no user input in logs. Provider timeouts remain unchanged. npm generated the dependency lockfile with audit fix --ignore-scripts and no --force; package.json ranges were preserved.

Initial new browser tests used dialog instead of the existing alertdialog role and expected transient persona-selection feedback after navigation. Those test assertions were corrected against the actual interface without changing unrelated tests. A separate dev smoke exposed the StrictMode lock acquisition issue; the permanent storage-dev regression exercises acquisition, rejected secondary-tab writes and handover.
