# Candidate home role categories

The user requested the original landing's Build, Apply and Lead section with its scroll choreography. Replace the interim cards with the original sticky stage, overlapping scenes, artwork, progress line, and role controls. Keep the original narrow-screen layout and honor reduced motion. Adapt the descriptions for candidates and link each scene to its real offer filter. Stop after visual review of this section.

The restored stage uses the original scroll distances, layer movement, fades, and progress line. The three controls also scroll to their scenes. At narrow widths or with reduced motion, scenes are presented sequentially as in the original. The local preview was checked by scrolling into Apply, Lead, and back to Build. Desktop scene screenshots and the 390 px layout were inspected. The full gate passed 27 unit tests and 44 Chromium journeys. After attaching the stylesheet directly to the section to resolve stale styling in the running development server, the build and two affected Chromium journeys passed again.

Removed the decorative arrow from all three offer links. The centered label has 16 px of space on each side inside the bottom rule. Reviewed `FEATURES.md`; destination and behavior remain the same.

The hero roles shortcut matches the offer CTA dimensions. Hover underlines its text and thickens its bottom rule inward. The scene offer links use the same inward thickening on a transparent background. Only inactive buttons in the top role selector use the scene accents on hover.
