# Home latest-offers trial

## Intent

Bring the existing latest-offers section into the candidate landing design. Keep its four real published offers and destination links. Reuse JobCard, CompanyLogo, and SalaryFact. Apply the new appearance only to this section so it can be reviewed before migrating the offer list.

## Acceptance

The real home section displays the latest published offers, clear title and salary hierarchy, all-offers and offer-detail links, and an informative empty state. At 320 px the cards wrap without horizontal overflow. Desktop and keyboard navigation preserve the real destinations. Stop for visual review before expanding the card treatment.

## Result and handoff

The home section now uses the landing display type, paper and ink, yellow compensation tags, and links with an inward bottom rule. The shared card still renders the publication date and original job facts where its responsive layout allows. No duplicate card implementation was introduced.

`./scripts/verify` passed with 27 unit tests and 44 Chromium journeys. The amended home journey checked four cards, the all-offers route and keyboard entry to an actual offer at 320 px. A separate local Chromium session checked a long title, missing salary and the empty section at 320 px. Reviewed the desktop capture. Wait for visual acceptance of the home cards before applying the treatment to the list.
