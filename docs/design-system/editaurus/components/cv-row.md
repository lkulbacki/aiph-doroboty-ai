# Application CV row — editaurus

> Current status (2026-11-22): the user accepted stage 3B for the implemented
> application/catalog appearance and local component/API usage. The
> [current ledger](../coverage.md) supersedes earlier pending-review/next-stage
> statements below. Real-reader behavior, future variants, portable exceptions
> and publication rights are separate boundaries. Historical stage evidence is
> retained; no upstream conformance is inferred.

Status: current application/catalog use accepted in stage 3B.

The existing `CvAttachment` in `src/features/prototype/cv-attachment.tsx` owns the row, local PDF match, open/download links and full-text fallback. Scoped rules in `src/app/editaurus.css` style its 44 px dark-green icon, ink metadata, outlined paper action links that lift 2 px up and left on hover/keyboard focus with a 3 px dark-green shadow, light paper `#fdf9ef` hover fill, and ink focus outline. On press, each link moves diagonally toward rest but stops 1 px above/left of it; the current source shadow contracts to 1 px. The hover values match the later “Error and CV interactions after review” decision; the earlier 3 px lift/4 px shadow description is superseded. The custom-text left rule remains. The owning form keeps the `CV z Twojego profilu` context. The component preview uses synthetic fixture data only.

Use this treatment inside `.editaurus-surface` with `layout="row"`. Keep both PDF links reachable, preserve filename wrapping at mobile width, and show the complete custom text without claiming a mismatched PDF. Profile and submitted-record consumers were outside the original extraction stage; they now have migrated compositions with separate review status in the [current ledger](../coverage.md). The [host CV API](../../RECORDS.md) remains authoritative for matching, snapshots, stack/row and native preview behavior. The current extracted API usage is accepted in 3B; future API expansion requires a new consumer review.
