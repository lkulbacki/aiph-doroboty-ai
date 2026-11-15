# Listing search and menu colors

Use the existing lighter dark green on search hover and a dark green fill with light text for the selected sort option. Remove the shared popup shadow from sort and workplace menus. The feature register was reviewed. Search, sorting and location behavior remain the same.

The hover fill is `#1b5148`, already used for the post-submit checkbox interaction. Chromium confirmed the hover, the selected sort when another option is hovered, and both shadowless menus. Full verification passed with 28 unit tests and 45 Chromium scenarios.
