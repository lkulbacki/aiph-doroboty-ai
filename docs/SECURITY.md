# Prototype data boundary

Role-specific UI and local transition checks organize the scenario. Anyone using the browser can inspect all stored data. Use synthetic data only.

Keep the optional OpenRouter key in Git-ignored `.env.local`. The Vite process reads it server-side and restricts the AI endpoints to the local origin. Requests send offer context for suggestions, and recordings and transcripts for voice processing. Exports contain the entire local scenario, including source and recruiter notes, recordings, transcripts and summaries. Keep real CVs, credentials and private material out of the scenario.

Render imported text through React text nodes, validate imports with shared Zod schemas, reject unsupported versions, duplicate IDs, broken references and oversized files. Never overwrite an unreadable save automatically.

## Local cost and write safeguards

Both local AI endpoints share a single active request, 10 attempts per fixed minute and a 100-attempt Vite-process budget. Failed/invalid attempts after body parsing also count. Rejected calls return 429, with Retry-After for a temporary limit. Limits reset when the server restarts; they are not a provider spending cap. Set provider account budgets separately and review usage before restarting.

Web Locks give one tab per origin exclusive ownership of scenario writes. Other tabs remain read-only and must reload after the writer closes to take over. Without Web Locks, writes fail closed. A snapshot check additionally rejects storage changed by older app versions or external scripts; it does not claim coordination with arbitrary code that ignores the lock. Preserve unsaved form text before reloading. Storage denial/quota recovery still keeps in-memory state available for export.

On Vercel, set OPENROUTER_API_KEY as a server-side Secret without a VITE_ prefix. The hosted AI endpoints validate origin when present, method, content type and bounded domain payloads; the origin check is not authentication. They are public prototype operations and rely on the configured provider key budget ($1, no renewal for this experiment). Local per-process counters do not provide hosted global limits. Provider errors return generic Polish messages and never log input or credentials.
