# Privacy and not-found presentation

Next bounded rollout after methodology/case: reuse Editaurus information-page
recipes for privacy and the existing not-found owner. Preserve privacy wording,
role boundaries, all fallback route behavior and the offer return destination.
No new claims about law/privacy, dependencies, primitives or portable-skill edits.
FEATURES reviewed: visual change only, no product behavior update required.
Acceptance: paper canvas, DM Sans/ink headings, light-paper content, existing
HeroLink return action, keyboard and narrow reflow retained. Run ./scripts/verify.

## Verification and review

Initial full gate passed (28 unit / 53 Chromium). Desktop browser review in Ardia
confirmed unchanged privacy wording and the shared return action. It exposed a
legacy header on unknown public routes, corrected by using the editorial header
and canvas for all non-workspace routes. Existing homepage special handling and
workspace/person-picker boundaries are preserved. Separate source review confirms
no new effects, state or persistence changes, and native HeroLink navigation.
Final ./scripts/verify passed formatting, kit integrity/six kit tests, lint,
types, 28 unit tests, baseline packet, build and 53 Chromium journeys (27.7s).
Existing annotation/chunk/color-environment warnings remain. The subsequent Ardia
batch stalled and was interrupted, so final post-correction manual and mobile
screenshots were not obtained; existing automated responsive journeys passed.
No claim of exhaustive manual mobile or mode coverage. No commit/push/publication.
