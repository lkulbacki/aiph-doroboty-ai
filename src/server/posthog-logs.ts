import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

type LogAttributes = Record<string, string | number | boolean>;

export type PostHogLogger = {
  info: (body: string, attributes: LogAttributes) => void;
  error: (body: string, attributes: LogAttributes) => void;
  shutdown: () => Promise<void>;
};

let logger: PostHogLogger | null | undefined;

export function createPostHogLogger(env: Record<string, string | undefined>): PostHogLogger | null {
  if (logger !== undefined) return logger;

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
    logger = null;
    return logger;
  }

  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "doroboty-ai-api",
      "deployment.environment": env.NODE_ENV ?? "development",
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, "")}/i/v1/logs`,
          headers: { Authorization: `Bearer ${token}` },
        }),
      }),
    ],
  });
  const posthogLogger = provider.getLogger("doroboty-ai.posthog");

  function emit(severityText: "INFO" | "ERROR", body: string, attributes: LogAttributes) {
    try {
      posthogLogger.emit({ severityText, body, attributes });
    } catch {
      // Log capture must not affect the API response.
    }
  }

  logger = {
    info: (body, attributes) => emit("INFO", body, attributes),
    error: (body, attributes) => emit("ERROR", body, attributes),
    shutdown: () => provider.shutdown().catch(() => {}),
  };
  return logger;
}
