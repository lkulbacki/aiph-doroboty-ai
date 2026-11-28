import { PostHog } from "posthog-node";

export type AiCallContext = {
  distinctId: string;
  sessionId: string;
  traceId: string;
};

export type AiObserver = {
  captureGeneration: (context: AiCallContext | null, properties: Record<string, unknown>) => void;
  flush: () => Promise<void>;
  shutdown: () => Promise<void>;
};

const aiId = /^[A-Za-z0-9_~.@()!':|-]+$/;

function headerValue(value: string | null | undefined) {
  return value?.trim() || null;
}

export function readAiCallContext(getHeader: (name: string) => string | null | undefined) {
  const distinctId = headerValue(getHeader("x-posthog-distinct-id"));
  const sessionId = headerValue(getHeader("x-posthog-session-id"));
  const traceId = headerValue(getHeader("x-posthog-trace-id"));
  if (
    !distinctId ||
    !sessionId ||
    !traceId ||
    distinctId.length > 200 ||
    !aiId.test(sessionId) ||
    !aiId.test(traceId)
  )
    return null;
  return { distinctId, sessionId, traceId };
}

export function createAiObserver(env: Record<string, string | undefined>): AiObserver | null {
  const token = env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim();
  const host = env.VITE_PUBLIC_POSTHOG_HOST?.trim();
  if (!token || !host) {
    if (env.NODE_ENV !== "production") {
      const missingVariable = token
        ? "VITE_PUBLIC_POSTHOG_HOST"
        : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }
    return null;
  }

  const posthog = new PostHog(token, {
    host,
    privacyMode: false,
    flushAt: 1,
    flushInterval: 0,
    requestTimeout: 2_000,
    fetchRetryCount: 0,
  });

  return {
    captureGeneration(context, properties) {
      if (!context) return;
      try {
        posthog.capture({
          distinctId: context.distinctId,
          event: "$ai_generation",
          properties: {
            $ai_trace_id: context.traceId,
            $ai_session_id: context.sessionId,
            ...properties,
          },
        });
      } catch {
        // AI observability must not affect the OpenRouter request.
      }
    },
    async flush() {
      await posthog.flush().catch(() => {});
    },
    async shutdown() {
      await posthog.shutdown(3_000).catch(() => {});
    },
  };
}
