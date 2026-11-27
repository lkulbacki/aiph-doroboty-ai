# Centaur favicon

## Intent and acceptance criteria

Replace the robot favicon with the existing centaur brand mark on branch
`codex/centaur-favicon`, based on `main`.

- Reuse the five centaur paths from the bundled user-supplied
  `src/features/editaurus/assets/logo-poziome-na-zielonym.svg`.
- Use editaurus dark green on a rounded paper background in a square SVG.
- Preserve the existing favicon URL in `index.html` and Vite asset hashing.
- Keep the original working tree and its uncommitted changes untouched.
- Run `./scripts/verify` and review the final diff.

## Scope and provenance

The existing asset provenance is recorded in
`docs/design-system/editaurus/assets.md`; no external asset is introduced.
FEATURES.md was reviewed and needs no update: this branding-only change does
not alter routes, roles, data or product flows.

## Validation

- `./scripts/verify`: formatting, reference integrity, lint, types, 28 unit
  tests, baseline packet and production build passed. The browser stage was
  initially blocked by sandbox permissions to listen on the local port.
- `npm run test:e2e`, rerun with the required local execution permissions:
  all 78 Chromium tests passed, including desktop/mobile, keyboard and recovery.
- Visual review in Chromium at 16, 32, 64 and 128 px: the complete mark is
  visible without clipping.
- Separate review: all five source paths are unchanged, the production HTML
  points to the emitted SVG, and `git diff --check` passed. No behavior or
  shared component changes; no additional regression test was needed.
- Build emitted existing Zod annotation and chunk-size warnings.
- This worktree shares the already installed dependencies for validation;
  no dependency manifest or lockfile was changed. No merge or publication.
