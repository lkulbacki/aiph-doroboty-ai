# Editorial v9 marketplace listing

Use the user-supplied Editorial v9 HTML as the visual reference for the published listing. Keep the home headline shared in wording, use the existing centaur asset, and replace the reference search with a two-field form and icon submit. Put desktop filters on the right and retain the accessible mobile filter dialog. Reuse the accepted Editorial job row with the candidate save action. Preserve real job and company destinations, map, counts, all existing filters, URL behavior, empty states and pagination. Adapt the reference sorting and minimum pay control to real currency and period data. Stop before migrating offer details.

## Result and handoff

The hero uses the landing headline, local centaur illustration and monochrome wordmark on Editorial v9 paper. Search submits both text fields via the magnifying-glass button or Enter. The location field includes suggestions from published offers. The right-hand desktop sidebar and mobile dialog share the same facet groups. The home and listing reuse one Editorial job row, with a separate save action for signed-in candidates on the listing.

The default sort stays newest first. The salary sort uses the upper published monthly PLN figure with a lower-bound fallback. A selected minimum tests the lower published monthly PLN figure, dividing annual PLN figures by 12. Salary actions do not convert currency or tax basis. EUR and unavailable figures appear after priced PLN offers in the salary sort and are excluded by a positive minimum. The full terms continue to display in each row. Search, filters, sorting, view and page use the hash URL.

`./scripts/verify` passed with 28 unit tests and 45 Chromium scenarios. Reviewed desktop and mobile previews. Browser checks covered the location and keyword search, right-hand filters, mobile filter dialog and focus return, saving across reload, empty results and map recovery. A separate browser-only fixture checked undisclosed pay and long title and company text at 320 px. The offer detail route is the next candidate for review after approval.
