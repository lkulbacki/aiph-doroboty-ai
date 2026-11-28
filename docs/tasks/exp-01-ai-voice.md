# EXP-01 · AI question suggestions and voice answers

## Scope and acceptance

- Offer editors can request up to three Polish project-contribution questions
  based on their current brief and description. Picking one fills the editable
  field and revokes prior approval. Saving a draft and publishing use the
  existing employer controls.
- Candidates can record, play, replace or remove an optional voice answer.
  An explicit draft save survives reload. Writing an answer remains available
  as a fallback. A submitted recording, its transcription and its AI summary
  travel with the question snapshot to the existing recruiter view.
- Use OpenRouter's dedicated transcription endpoint on the original recording
  and generate a short factual Polish summary from its transcript. Existing
  notes, CV and human stage decisions continue to apply.
- Keep the API key on the local Vite server and bound requests and recordings.
  Tell candidates when audio goes to the external service. Use synthetic data.
  Failed AI calls provide feedback and preserve current form inputs.
- Verify legacy imports, a mocked-provider browser journey with actual
  MediaRecorder audio, and a live provider smoke test when a key is available.

## Separate review

The offer, application and recruiter screens share the Editaurus project card.
The review checked approval after applying suggestions, native radio keyboard
navigation, recording cleanup, retry behavior, version-1 snapshot compatibility
and local storage limits. The voice browser test exercises a fake microphone at
390 px and checks the recruiter card at 390 and 1440 px. Request validation and
the localhost boundary were checked separately. Serving `.env.local` and
calling the proxy from a foreign origin both returned HTTP 403. The participant
package included the example environment file and excluded the local key file.

## Live OpenRouter evidence

The final Chromium journey generated three Polish questions, recorded 13.14
seconds of synthetic Polish WebM audio, and displayed the recording, transcript,
summary and saved invitation rationale. The text model used Groq for both
requests. Groq was preferred after earlier text samples contained non-Polish
fragments, and the summary now validates separate contribution and result fields.

Whisper preserved the eight tests and the 61% to 78% change. It changed the
speaker's first-person feminine verb endings to masculine endings. The original
recording remains available in the record. An earlier live check also accepted
M4A. The final journey reported costs of USD 0.0000600 for suggestions, USD
0.0001460 for transcription and USD 0.0000642 for the summary, a total of USD
0.0002702. The verified recruiter screenshot is
`artifacts/exp-01-rekruter-glos.png`.

## Local verification

The final `CI=1 ./scripts/verify` passed formatting, lint, type checking,
the reference kit check with six renderer tests, all 33 unit tests, the baseline
packet check, the static build and all 81 Chromium tests. The build reported
warnings about Zod annotations and JavaScript chunk size.
