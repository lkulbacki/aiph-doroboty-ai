# Editaurus stage 2D — fields, consent, CV and feedback

Authorized continuation on 2026-11-21, including the requested catalog header
correction. Reuse the existing public editaurus header and inspect it manually;
do not add a dedicated automated header test. Reconcile real production field,
consent, CV and feedback contracts and fill catalog gaps using existing owners.
Preserve validation, snapshots, local persistence, recovery, render APIs and all
pre-existing dirty files. No primitive replacement, dependencies, global styles
or skill changes. Stop before choices/dialogs (2E). Record actual validation and
pending human acceptance separately.

## Outcome and review

The catalog route now selects the same public editorialHeader branch as offers,
with centaur branding, paper and green top rule. It changes only the route
predicate, not header rendering or navigation handlers. The header was viewed in
the browser and captured outside the repository; no dedicated automated header
test was created, as requested.

Added valid/invalid/disabled single-line examples using the production Input and
editaurus-input recipe. Existing answer/consent/feedback examples remain intact.
The custom CV example now passes candidate-anna with changed text: this exercises
the same-person mismatch branch that must never expose Anna's prepared older PDF.
No new field wrapper, validation controller, upload, PDF asset or readonly snapshot
editor was invented. Local edits do not write to profile/job/scenario state.

The field/consent/CV/feedback contract records owners and inherited APIs, native
validation versus aria-invalid, disabled versus readonly, checkbox error-shade
exception, snapshot/PDF matching and global storage recovery. Remaining visual/API
acceptance and employer per-field error association are explicitly pending. The
answer-field document links this extension instead of describing all other fields
as future work. Coverage, handoff and FEATURES SYS-12 were updated without changing
feature IDs or the pre-existing user content.

`./scripts/verify` passed: formatting, immutable 67-file kit and six kit tests,
lint, types, 28 units, baseline 120 journeys, build and 50/50 Chromium checks in 25.0s.
Existing Zod annotation, chunk-size and test color-environment warnings remain.
The new regression checks editable catalog state, accessible error description,
disabled field, mobile bounds, same-person custom CV without links/iframe, unchanged
scenario serialization and reset-on-reload. Existing real application/consent/
draft, profile/snapshot, CV and recovery tests also passed. No dedicated header
test was added. The new input regression checks field bounds rather than forbidding
normal internal horizontal scrolling of a long single-line value.

Separate review verified the one-predicate header change, existing production
imports, local-only catalog edits, exact CV matching source and preserved product
flows. No primitive APIs or CSS changed; no upstream replacement was performed.
Manual browser inspection covered the header and desktop input states; mobile
checks above are automated rather than a claimed full manual breakpoint or screen
reader review. No new human acceptance is inferred from the passing gate.

SHA-256 comparison against 366 baseline files identifies seven modified existing
files: shell, catalog, appended E2E test, FEATURES, coverage, handoff and answer-field
document. Two documents were added (this task and field/feedback contract). The
other 359 baseline files are unchanged, preserving prior dirty work, primitive
owners, configuration/dependencies, historical kit and earlier reports. Local
links, final formatting and diff checks passed. Ignored build/test artifacts were
regenerated. Existing Vite preview remains available for the user's review.
No commit, push, publication, dependency install, asset transfer or skill update.

## Stop point

2D is implemented with the stated human-review boundaries. Proposed 2E is a bounded
choice/dialog slice: closed enum versus workplace free text, clearing/no-results,
portal scope, render composition, keyboard/focus, pending/error and recovery.
Ready means current APIs and behavior are explicit and production-owner examples
are verified on real screens. Any source replacement first needs pinned upstream
comparison; no global restyling. Human approval covers remaining choice/dialog
APIs and states. Stop after that family, before domain migration or portable skill.
**2E has not started.**
