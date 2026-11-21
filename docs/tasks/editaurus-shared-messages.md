# Shared Editaurus messages

## Intent and acceptance

Migrate the catalog's existing host Empty/Notice owners and their application
consumers to Editaurus. Include the adjacent Shell operation-error message so
recovery feedback is coherent. Preserve wording, status/alert semantics, recovery
navigation, storage operations and all pre-existing worktree changes. No new
primitive, dependency, portable skill update or historical-kit change.

Use self-scoped DM Sans, ink/light-paper panels, 1px contours and 4px corners;
nonblocking information has a green leading rule, failures retain the existing
rose/warm-paper distinction. Empty content is neutral. Links remain underlined
with explicit keyboard focus. Check real unreadable-save recovery as well as the
catalog, desktop/mobile, forced colors and reduced motion. Run ./scripts/verify
and a separate source/consumer review; record actual results below.

FEATURES reviewed: no flow/data behavior changes; SYS-12 already describes these
production-owner examples. Catalog labels are updated to describe current visuals.

## Review and observations

Separate source/consumer review: Empty has only the catalog consumer; Notice is
used by the catalog, already-submitted application guidance and Shell storage
recovery. The adjacent Shell error uses the same self-scoped recipe with rose
failure colors. No generic prototype-panel or global token was changed, so case
material and unrelated legacy panels retain their scope. Roles, children, store
operations and navigation are unchanged. React review: no added state, effect,
primitive or dependency; existing semantic links and live regions retained.

Manually inspected the live catalog at desktop and 390px: heading, light-paper
panels, leading information rule and wrapping recovery links are visible. Temporary
viewport override reset. Local screenshot: /tmp/editaurus-shared-messages.png.

Extended the existing unreadable-save journey at 320px to check the real Notice
surface, keyboard recovery link, forced-colors focus and unchanged original save.
The first full gate passed 28 unit tests and 52/53 browser journeys; the new focus
assertion failed because programmatic focus alone did not enter keyboard modality.
The harness now goes backward/forward with Shift+Tab/Tab before asserting focus;
no product workaround was added. The focused recovery rerun passed (1/1).

Final ./scripts/verify: passed formatting, historical-kit integrity (67 unchanged
files and six kit tests), lint, types, 28 unit tests, baseline packet, static build
and all 53 Chromium journeys (29.5s). Existing Zod annotation, large-chunk and
color-environment warnings remain. The recovery assertions pass with actual
keyboard modality. No claim of exhaustive assistive-technology coverage or human
visual approval. No commit, push, publish, skill edit or dependency change.
