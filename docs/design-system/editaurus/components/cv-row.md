# Application CV row — editaurus

Status: implemented on the candidate application form and partial component preview; awaiting human review.

The existing `CvAttachment` in `src/features/prototype/cv-attachment.tsx` owns the row, local PDF match, open/download links and full-text fallback. Scoped rules in `src/app/editaurus.css` style its 44 px dark-green icon, ink metadata, outlined paper action links that lift 3 px up and left on hover/keyboard focus with a 4 px dark-green shadow, light paper `#fdf9ef` hover fill, and ink focus outline. On press, each link moves diagonally toward rest but stops 1 px above/left of it; the shadow contracts to 2 px. The custom-text left rule remains. The owning form keeps the `CV z Twojego profilu` context. The component preview uses synthetic fixture data only.

Use this treatment inside `.editaurus-surface` with `layout="row"`. Keep both PDF links reachable, preserve filename wrapping at mobile width, and show the complete custom text without claiming a mismatched PDF. Other profile and submitted-record CV views remain outside this stage.
