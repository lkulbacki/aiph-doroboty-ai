import { beforeEach, describe, expect, it, vi } from "vitest";
import questions from "../../api/project-ai/questions";
import voice from "../../api/project-ai/voice";
import { handleProjectAi } from "./project-ai-handler";
import { MAX_AUDIO_BYTES } from "../features/prototype/project-ai";

const provider = vi.hoisted(() => ({ questions: vi.fn(), voice: vi.fn() }));
vi.mock("./openrouter", () => ({ openRouter: () => provider }));
const env = { OPENROUTER_API_KEY: "synthetic-test-key" };
const context = { title: "Przykład", brief: "Syntetyczny brief", description: "" };
function request(body: unknown = context, init: RequestInit = {}) {
  return new Request("https://prototype.vercel.app/api/project-ai/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://prototype.vercel.app" },
    body: JSON.stringify(body),
    ...init,
  });
}

beforeEach(() => {
  vi.unstubAllEnvs();
  provider.questions.mockReset().mockResolvedValue({ questions: ["Jaki był efekt?"] });
  provider.voice.mockReset().mockResolvedValue({ transcript: "Przykład", summary: "Efekt" });
});

describe("hosted project AI HTTP boundary", () => {
  it("serves both actual Vercel entry points using the server environment", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", env.OPENROUTER_API_KEY);
    const result = await questions.fetch(request());
    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(await result.json()).toEqual({ questions: ["Jaki był efekt?"] });
    expect(provider.questions).toHaveBeenCalledWith(context, null);
    const recording = { format: "webm", data: "AAAA" };
    expect((await voice.fetch(request(recording))).status).toBe(200);
    expect(provider.voice).toHaveBeenCalledWith(recording, null);
  });

  it("rejects unsupported methods, foreign origins and content types before calling AI", async () => {
    const get = await handleProjectAi(
      "questions",
      request(null, { method: "GET", body: null }),
      env,
    );
    expect(get.status).toBe(405);
    expect(get.headers.get("allow")).toBe("POST");
    expect(
      (
        await handleProjectAi(
          "questions",
          request(context, {
            headers: { "Content-Type": "application/json", Origin: "https://other.example" },
          }),
          env,
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await handleProjectAi(
          "questions",
          request(context, {
            headers: { "Content-Type": "text/plain" },
          }),
          env,
        )
      ).status,
    ).toBe(415);
    expect(provider.questions).not.toHaveBeenCalled();
  });

  it("passes validated PostHog context through the hosted boundary", async () => {
    const trace = {
      distinctId: "candidate-example",
      sessionId: "session-example",
      traceId: "trace-example",
    };
    const response = await handleProjectAi(
      "questions",
      request(context, {
        headers: {
          "Content-Type": "application/json",
          Origin: "https://prototype.vercel.app",
          "x-posthog-distinct-id": trace.distinctId,
          "x-posthog-session-id": trace.sessionId,
          "x-posthog-trace-id": trace.traceId,
        },
      }),
      env,
    );
    expect(response.status).toBe(200);
    expect(provider.questions).toHaveBeenCalledWith(context, trace);
  });

  it("rejects missing configuration, malformed JSON and invalid domain payloads", async () => {
    expect((await handleProjectAi("questions", request(), {})).status).toBe(503);
    expect((await handleProjectAi("questions", request(context, { body: "{" }), env)).status).toBe(
      400,
    );
    expect((await handleProjectAi("questions", request({ brief: "" }), env)).status).toBe(400);
    expect(
      (await handleProjectAi("voice", request({ format: "exe", data: "AAAA" }), env)).status,
    ).toBe(400);
    expect(provider.questions).not.toHaveBeenCalled();
    expect(provider.voice).not.toHaveBeenCalled();
  });

  it("bounds streamed request bodies even without a content-length header", async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(MAX_AUDIO_BYTES * 2));
        controller.close();
      },
    });
    const streamed = new Request("https://prototype.vercel.app/api/project-ai/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: stream,
      duplex: "half",
    } as RequestInit);
    expect((await handleProjectAi("voice", streamed, env)).status).toBe(400);
    expect(provider.voice).not.toHaveBeenCalled();
  });

  it.each(["questions", "voice"] as const)(
    "hides provider errors and credentials for %s",
    async (operation) => {
      provider[operation].mockRejectedValueOnce(new Error(env.OPENROUTER_API_KEY));
      const input = operation === "questions" ? context : { format: "webm", data: "AAAA" };
      const result = await handleProjectAi(operation, request(input), env);
      expect(result.status).toBe(502);
      expect(await result.text()).not.toContain(env.OPENROUTER_API_KEY);
    },
  );
});
