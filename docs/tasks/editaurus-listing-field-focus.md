# Listing search field focus

Apply the regular form treatment to keyword and workplace focus: warm paper, dark text and a 3 px inner bottom rule. Use 1 px contours on all three search controls and a thinner focus ring on sorting. The feature register was reviewed. Search and sorting behavior remain the same.

Full verification passed with 28 unit tests and 45 Chromium scenarios, including the keyword focus rule, workplace focus fill and sort border width.

The follow-up applies the same warm-paper focus to the sort trigger. Both dropdown panels use 1 px contours and warm-paper option hover or highlight. The selected sort keeps its check and uses the same background rules as the other options.

The sort trigger now has a consistent 1 px border at rest and when open. Remove the host edge shadow. The open trigger uses the same 3 px inner bottom rule as the focused workplace field. Keep the visible keyboard focus outline.
