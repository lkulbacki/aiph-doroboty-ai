# Prototype data boundary

Role-specific UI and local transition checks organize the scenario. Anyone using the browser can inspect all stored data. Use synthetic data only.

Keep the optional OpenRouter key in Git-ignored `.env.local`. The Vite process reads it server-side and restricts the AI endpoints to the local origin. Requests send offer context for suggestions, and recordings and transcripts for voice processing. Exports contain the entire local scenario, including source and recruiter notes, recordings, transcripts and summaries. Keep real CVs, credentials and private material out of the scenario.

Render imported text through React text nodes, validate imports with shared Zod schemas, reject unsupported versions, duplicate IDs, broken references and oversized files. Never overwrite an unreadable save automatically.

## Local cost and write safeguards

Both local AI endpoints share a single active request, 10 attempts per fixed minute and a 100-attempt Vite-process budget. Failed/invalid attempts after body parsing also count. Rejected calls return 429, with Retry-After for a temporary limit. Limits reset when the server restarts; they are not a provider spending cap. Set provider account budgets separately and review usage before restarting.
