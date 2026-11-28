import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import {
  MAX_AUDIO_BYTES,
  questionContextSchema,
  recordingSchema,
} from "../features/prototype/project-ai";
import { openRouter } from "./openrouter";
import { aiRequestLimits } from "./ai-request-limits";
import { createAiObserver, readAiCallContext } from "./posthog-ai";
import { createPostHogLogger } from "./posthog-logs";

const actions = {
  "/api/project-ai/questions": { operation: "questions", schema: questionContextSchema },
  "/api/project-ai/voice": { operation: "voice", schema: recordingSchema },
} as const;
const maxBodyBytes = (MAX_AUDIO_BYTES * 4) / 3 + 1000;

function json(response: ServerResponse, status: number, data: object) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

async function readBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    size += chunk.length;
    if (size > maxBodyBytes) {
      request.resume();
      throw new Error("Request too large.");
    }
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function projectAiPlugin(env: Record<string, string | undefined>): Plugin {
  const limits = aiRequestLimits();
  const observer = createAiObserver(env);
  const logger = createPostHogLogger(env);
  const ai = openRouter({
    apiKey: env.OPENROUTER_API_KEY?.trim() ?? "",
    textModel: env.OPENROUTER_TEXT_MODEL,
    transcriptionModel: env.OPENROUTER_TRANSCRIPTION_MODEL,
    observer,
  });

  async function handle(request: IncomingMessage, response: ServerResponse, next: () => void) {
    const path = request.url?.split("?")[0] ?? "";
    if (!Object.hasOwn(actions, path)) return next();
    const action = actions[path as keyof typeof actions];
    const { host, origin } = request.headers;
    if (
      !host ||
      !/^(?:127\.0\.0\.1|localhost|\[::1\])(?::\d+)?$/.test(host) ||
      !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(request.socket.remoteAddress ?? "") ||
      (origin && origin !== `http://${host}` && origin !== `https://${host}`)
    ) {
      return json(response, 403, { error: "Usługa AI jest dostępna z lokalnego prototypu." });
    }
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      return json(response, 405, { error: "Metoda jest niedostępna." });
    }
    if (request.headers["content-type"]?.split(";")[0] !== "application/json")
      return json(response, 415, { error: "Usługa akceptuje dane JSON." });
    if (!env.OPENROUTER_API_KEY?.trim())
      return json(response, 503, {
        error: "Brak klucza OpenRouter. Ustaw OPENROUTER_API_KEY i uruchom ponownie aplikację.",
      });

    let body: unknown;
    try {
      body = await readBody(request);
    } catch {
      return json(response, 400, { error: "Nie udało się odczytać danych." });
    }
    const slot = limits.acquire();
    if ("error" in slot) {
      if (slot.retryAfter !== undefined) response.setHeader("Retry-After", slot.retryAfter);
      return json(response, 429, { error: slot.error });
    }
    try {
      logger?.info("project AI request accepted", { operation: action.operation });
      if (action.operation === "questions") {
        const input = action.schema.safeParse(body);
        if (!input.success)
          return json(response, 400, { error: "Sprawdź treść briefu i opisu oferty." });
        const result = await ai.questions(
          input.data,
          readAiCallContext((name) => {
            const value = request.headers[name];
            return Array.isArray(value) ? value[0] : value;
          }),
        );
        logger?.info("project AI request completed", {
          operation: action.operation,
          status_code: 200,
        });
        return json(response, 200, result);
      }
      const input = action.schema.safeParse(body);
      if (!input.success)
        return json(response, 400, { error: "Sprawdź format i rozmiar nagrania." });
      const result = await ai.voice(
        input.data,
        readAiCallContext((name) => {
          const value = request.headers[name];
          return Array.isArray(value) ? value[0] : value;
        }),
      );
      logger?.info("project AI request completed", {
        operation: action.operation,
        status_code: 200,
      });
      return json(response, 200, result);
    } catch {
      logger?.error("project AI request failed", { operation: action.operation, status_code: 502 });
      return json(response, 502, {
        error:
          action.operation === "questions"
            ? "Nie udało się przygotować pytań. Spróbuj ponownie."
            : "Nie udało się przetworzyć nagrania. Możesz zapisać szkic i spróbować ponownie.",
      });
    } finally {
      slot.release();
    }
  }

  return {
    name: "local-project-ai",
    configureServer(server) {
      server.middlewares.use(handle);
      server.httpServer?.once("close", () => {
        void observer?.shutdown();
        void logger?.shutdown();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
      server.httpServer?.once("close", () => {
        void observer?.shutdown();
        void logger?.shutdown();
      });
    },
  };
}
