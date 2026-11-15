# Editorial v9 rows on the candidate home

## Intent and acceptance

Use the job-row design in the user-supplied `do_roboty_editorial_v9.html` for the four latest published jobs. Recreate the paper rows, horizontal rules, DM Sans role titles, category badge and category-wide hover. Keep actual marketplace data and links. Fit the company mark and work mode into the company column, function beside seniority, and publication date below compensation. Preserve the full precision, currency, basis and period of compensation and show the contract even for undisclosed compensation. Stack the same facts on mobile without clipping. Keep the company and job independently keyboard-accessible.

The supplied HTML serves as the visual reference. Adapt it in React with bundled fonts and existing company, salary and route components. No reference file, assets, font requests, example data or standalone JavaScript are imported. The full marketplace listing is a separate stage.

## Result and handoff

Home opts into the Editorial variant of JobCard. The title link covers the row, while the company link stays separate. This replaces the trial's repeated “Zobacz rolę” action and aligns the interaction with the reference. The company mark uses the host fallback, and SalaryFact still supplies full amounts and compensation terms. FEATURES.md records the home interaction.

`./scripts/verify` passed formatting, reference integrity, lint, typecheck, the participant packet, the build, 27 unit tests and 44 Chromium journeys. The updated home journey checked all three accent colors, role and company destinations, facts, focus and 320 px reflow. Reviewed desktop and mobile captures. A separate Chromium run clicked the compensation area to open the job and used browser-only data overrides to check long titles and company names, multiple locations, missing salary, empty state and return to the original data.

Stop for visual review. When the full listing is requested, use the supplied Editorial v9 design and carry over the working application filters, links and candidate save controls.
