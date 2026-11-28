import type { z } from "zod";
import posthog from "posthog-js";
import {
  questionsSchema,
  voiceAnalysisSchema,
  type questionContextSchema,
  type Recording,
} from "./project-ai";

async function requestAi<T>(
  operation: "questions" | "voice",
  input: object,
  schema: z.ZodType<T>,
  signal: AbortSignal,
): Promise<T> {
  const distinctId = posthog.get_distinct_id();
  const sessionId = posthog.get_session_id();
  const response = await fetch(`./api/project-ai/${operation}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-POSTHOG-DISTINCT-ID": distinctId,
      "X-POSTHOG-SESSION-ID": sessionId,
      "X-POSTHOG-TRACE-ID": crypto.randomUUID(),
    },
    body: JSON.stringify(input),
    signal,
  });
  const payload: unknown = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : null;
  if (!response.ok && payload && typeof payload === "object" && "error" in payload) {
    if (typeof payload.error === "string") {
      posthog.logger.error("project AI response failed", {
        operation,
        status_code: response.status,
      });
      throw new Error(payload.error);
    }
  }
  const parsed = schema.safeParse(payload);
  if (!response.ok || !parsed.success) {
    posthog.logger.error("project AI response failed", { operation, status_code: response.status });
    throw new Error("Nie udało się połączyć z usługą AI. Spróbuj ponownie później.");
  }
  posthog.logger.info("project AI response completed", { operation, status_code: response.status });
  return parsed.data;
}

export function suggestQuestions(
  input: z.infer<typeof questionContextSchema>,
  signal: AbortSignal,
) {
  return requestAi("questions", input, questionsSchema, signal);
}

export function analyzeRecording(recording: Recording, signal: AbortSignal) {
  return requestAi("voice", recording, voiceAnalysisSchema, signal);
}
