# editaurus application CV row

Status: implemented; awaiting human review. Stop before the next stage.

## Intent and acceptance

Style the existing candidate application CV row in editaurus without changing which local PDF or custom text it shows. Reuse `CvAttachment` and preserve open/download links, the full custom CV fallback, the profile context label, keyboard focus and mobile wrapping. Show both PDF and custom-text states in the partial preview. Do not change submitted snapshots or other CV consumers.

## Ownership and handoff

`src/features/prototype/cv-attachment.tsx` remains the owner of source matching and rendering. Scoped styling lives in `src/app/editaurus.css`, with the real form in `src/features/prototype/workspace.tsx` and examples in `src/features/editaurus/components-page.tsx`. No new component library or file source was added.

**Done:** Scoped CV icon, metadata, action links and full-text fallback styling; added both states to the preview. **Remaining:** Human review before another component or route. **Start next time:** Compare the preview PDF/custom examples with the real `/#/aplikuj/:slug` CV section on desktop and mobile.

**Checked:** Browser preview inspected at desktop width. `./scripts/verify` passed on 2026-11-14: formatting, historical kit integrity, lint, types, 27 unit tests, baseline packet, build and 42/42 Chromium journeys. The new browser journey checks local PDF link, custom fallback, mobile overflow and real form styling. The visual review found that the sample line break had been supplied as literal characters; corrected to a newline and added a regression assertion. Existing build warnings remain.

## Link hover refinement

The user requested the prepared-PDF actions to lift in the hero action’s direction with a dark-green shadow. Both links now move 3 px up/left on hover or keyboard focus, with a 4 px green shadow and mint fill. Source URLs, download behavior and custom-text fallback remain unchanged. Stop before another stage.

**Final verification:** Both PDF links were checked for hover lift, dark-green shadow and mint fill in the rebuilt preview; the real form's download link was checked too. The full `./scripts/verify` gate passed with 42/42 Chromium journeys. Stop for human review.
