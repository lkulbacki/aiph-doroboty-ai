# editaurus continuation

- Workspace: DoRoboty.ai fork. Run Node.js 24 and `npm run dev`, then open `/#/` on port 3001. The original landing is a local comparison at `/landing/` when its preview files are present. The app runs without that local copy.
- Candidate application: the first real-screen pilot uses the shared hero/secondary actions, answer, consent, CV and feedback. The preview at `/#/design-system/editaurus` resolves an available form for the selected candidate. See [decisions](decisions.md).
- Home: candidate hero adapts the original composition, fonts and motion. The header uses the supplied centaur logo and its outline on hover/focus. Build / Apply / Lead preserves the original scroll choreography and opens filtered offers. The scene controls use accents only on inactive hover; text links keep transparent backgrounds.
- Current review slice: the [offer detail](../../tasks/editaurus-offer-detail.md) reuses the accepted listing palette, forms actions and job rows. Review the desktop conditions sidebar, mobile reading order and applicant actions before starting another route.
- Read `AGENTS.md`, `GUI.md`, this guide and the relevant task note. Preserve existing hash routes, Base UI controls, prototype data and user changes. Check the touched route, run `./scripts/verify`, and record actual results. Start each stage only after explicit direction.
