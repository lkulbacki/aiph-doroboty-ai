import {
  MAX_AUDIO_BYTES,
  questionContextSchema,
  recordingSchema,
} from "../features/prototype/project-ai.js";
import { openRouter } from "./openrouter.js";
import { createAiObserver, readAiCallContext } from "./posthog-ai.js";
import { createPostHogLogger } from "./posthog-logs.js";

type Operation = "questions" | "voice";
const maxBodyBytes = (MAX_AUDIO_BYTES * 4) / 3 + 1000;

function json(status: number, data: object, headers: Record<string, string> = {}) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        throw new Error("Request too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

/** Public prototype endpoint; spending is bounded by the provider key budget. */
export async function handleProjectAi(
  operation: Operation,
  request: Request,
  env: Record<string, string | undefined> = process.env,
) {
  if (request.method !== "POST")
    return json(405, { error: "Metoda jest niedostępna." }, { Allow: "POST" });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return json(403, { error: "Wyślij żądanie z aplikacji." });
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json")
    return json(415, { error: "Usługa akceptuje dane JSON." });
  if (!env.OPENROUTER_API_KEY?.trim())
    return json(503, { error: "Usługa AI nie jest skonfigurowana. Spróbuj ponownie później." });

  let body: unknown;
  try {
    body = await readBody(request);
  } catch {
    return json(400, { error: "Nie udało się odczytać danych." });
  }
  const observer = createAiObserver(env);
  const logger = createPostHogLogger(env);
  const context = readAiCallContext((name) => request.headers.get(name));
  const ai = openRouter({
    apiKey: env.OPENROUTER_API_KEY.trim(),
    textModel: env.OPENROUTER_TEXT_MODEL,
    transcriptionModel: env.OPENROUTER_TRANSCRIPTION_MODEL,
    observer,
  });
  try {
    logger?.info("project AI request accepted", { operation });
    if (operation === "questions") {
      const input = questionContextSchema.safeParse(body);
      if (!input.success) return json(400, { error: "Sprawdź treść briefu i opisu oferty." });
      const result = await ai.questions(input.data, context);
      logger?.info("project AI request completed", { operation, status_code: 200 });
      return json(200, result);
    }
    const input = recordingSchema.safeParse(body);
    if (!input.success) return json(400, { error: "Sprawdź format i rozmiar nagrania." });
    const result = await ai.voice(input.data, context);
    logger?.info("project AI request completed", { operation, status_code: 200 });
    return json(200, result);
  } catch {
    logger?.error("project AI request failed", { operation, status_code: 502 });
    return json(502, {
      error:
        operation === "questions"
          ? "Nie udało się przygotować pytań. Spróbuj ponownie."
          : "Nie udało się przetworzyć nagrania. Możesz zapisać szkic i spróbować ponownie.",
    });
  } finally {
    await observer?.flush();
  }
}
