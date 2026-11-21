# Catalog offer title hover

The catalog title link inherited the host pink hover fallback, while listing
ancestors supplied a transparent override. Give the shared editorial title link
its own transparent hover and ink text contract. Retain category-colored row
highlight and keyboard outline. All editorial JobCard consumers share this fix;
no data/API/navigation change. FEATURES reviewed, no behavior update needed.
Preserve prior uncommitted catalog corrections. Verify catalog/listing hover in
isolated Chromium and run the full gate. No skill/kit/publication changes.

Verified actual hovered title computed styles in isolated Chromium on both catalog
and listing: transparent background rgba(0,0,0,0), ink text rgb(16,46,42).
Full ./scripts/verify passed: formatting, kit integrity/six tests, lint, types,
28 unit tests, baseline packet, build and 73 Chromium tests (41.2s). Existing build
warnings remain. Separate review confirms the shared title-only variables leave
row category hover, save controls and keyboard outlines intact. No new automated
tests for this reversible style correction; actual browser comparison executed.
