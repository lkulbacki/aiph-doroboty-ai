# Vercel project AI endpoints

## Intent and acceptance criteria

Expose the existing synthetic question and voice operations through Vercel Node.js
Functions while retaining local Vite behavior. Keep the OpenRouter key server-side,
validate methods, content type, origin, bounded JSON and shared domain schemas.
The experiment relies on the user-configured $1 OpenRouter key budget; do not add
a distributed rate-limit service. Local Vite attempt limits remain local only.

Deploy the existing main branch separately, without these uncommitted changes.
Update the behavior register and hosting documentation, add HTTP boundary tests,
run ./scripts/verify and perform a separate review pass. Record actual deployment
and validation outcomes below; neither source coverage nor local tests proves a
successful hosted AI request.

## Implementation and separate review

- Added two Web Request/Response Node.js Function entries and a shared hosted
  handler using the existing OpenRouter operations and Zod schemas. The handler
  bounds streamed JSON, rejects unsupported methods/content types and foreign
  browser origins, keeps responses uncached and hides provider errors.
- Vercel configuration selects Vite, npm ci, dist and a 120-second Function
  duration. Type checking includes API entries. Participant packaging includes
  API source/configuration. Existing local Vite limits are unchanged.
- Separate review checked server/client secret boundaries, both entry points,
  streamed body size, provider timeouts (65s transcription + 25s summary fits
  120s), error recovery, TypeScript coverage and participant-package completeness.
  API dependency imports use .js specifiers for Node.js ESM. Both entries were
  separately compiled with TypeScript NodeNext and loaded in Node.js; each
  returned HTTP 405 for GET without a provider call.
  No additional dependency or distributed limit service was introduced.

## Validation

- ./scripts/verify passed on the working branch: formatting, 67-file historical
  kit integrity and six renderer tests, lint, types, 45 unit tests, baseline
  packet, static build and all 85 Chromium journeys. An initial sandboxed run
  failed because local listening sockets were denied; the full successful run
  used the necessary local-server permissions.
- Participant source packaging passed at
  /tmp/doroboty-vercel-participant-final-20261127, including API/config files.
- The full branch gate was repeated after the Node.js ESM import correction and
  passed again (45 unit tests and 85 Chromium journeys).
- git diff --check passed. Existing build warnings concern Zod annotations and
  the JavaScript chunk size. No live OpenRouter calls were made.

## Main deployment evidence

Remote main was checked against GitHub and matches local main at
47a091a282abb59be692574ec2a26d02e6d0cfc4. Its source was exported into an
isolated temporary directory and npm ci plus npm run build passed using its
own lockfile. Its full ./scripts/verify also passed: formatting, historical kit
checks, lint, types, 28 unit tests, packet verification, build and 78 Chromium
journeys. No working-branch changes were included.

Vercel refused linking lkulbacki/aiph-doroboty-ai to do-roboty-ai, reporting a
missing GitHub Login Connection. A direct Git-source Preview request using the
GitHub numeric repository ID then returned HTTP 429 (GitHub API rate limit),
including a later retry.
There is no new deployment URL yet. Existing Production and Preview key
metadata was inspected without reading its value. Hosting and paid provider
verification remain separate from the successful local checks.

## Connection recheck and successful main Preview — 2026-11-27

This supersedes the earlier deployment blocker. Vercel now reports do-roboty-ai
linked to lkulbacki/aiph-doroboty-ai, with a GitHub installation for lkulbacki.
GitHub main still resolves to 47a091a282abb59be692574ec2a26d02e6d0cfc4.
A deployment from that exact Git source cloned successfully, ran npm ci and
npm run build and reached READY in about 74 seconds. Project defaults were
aligned with Vite, Node.js 24, npm ci, npm run build and dist.

- Preview deployment: dpl_2AA27LWAAZFCZmxiDbp3TWqmP5mZ.
- URL: https://do-roboty-4r63guui7-lukkul.vercel.app.
- HTTP fetch returned 200 and the expected application HTML and asset names.
- Production was not promoted; this Preview contains unchanged main, without
  the working branch's AI Functions. No paid OpenRouter request was made.
- GitHub returned no Actions runs for this main commit. The earlier local gate
  and successful Vercel build are distinct from GitHub CI evidence. Automatic
  push-triggered deployments were not exercised by creating a new commit.
- Isolated Chromium smoke checks at 1280px and 390px returned HTTP 200,
  rendered the application main heading and reported no page JavaScript errors.
