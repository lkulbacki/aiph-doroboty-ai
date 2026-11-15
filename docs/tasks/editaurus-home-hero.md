# Original landing preview

The user requested the complete original landing, including its artwork, motion and interactions. The interim React hero was reverted. Form feedback remains accepted.

## Local preview

Copy the contents of the delivered landing's `dist/` into `artifacts/landing/` and open `/landing/` on the Vite development server. The preview serves the original files without transformation. Git, the application build and the participant packaging list exclude the preview directory. The same files also work as a standalone static site. The prototype remains available at `/#/`.

## Handoff

Confirm visual fidelity against the original. The candidate destination, employer publication or checkout, complete pricing and guarantee terms remain open. Attribution and reuse terms for the adapted sticker footer still need review before public distribution. Keep the original design while resolving those items one at a time.

## Verification

Compared the local copy with the original directory and every served file with its local copy byte for byte. Chromium at 1440 px and 390 px loaded the artwork and checked layout overflow, mobile navigation, the offer dialog and presence of the five footer stickers. The project gate passed through build and all 27 unit tests. Chromium passed 43 of 44 journeys in the full run. The existing application-button shadow assertion that failed in that run passed on its own immediately afterward.
