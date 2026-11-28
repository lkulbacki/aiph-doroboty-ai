import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createServer, type ViteDevServer } from "vite";
import { projectAiPlugin } from "./project-ai-plugin";

const provider = vi.hoisted(() => ({ questions: vi.fn(), voice: vi.fn() }));
vi.mock("./openrouter", () => ({ openRouter: () => provider }));
let server: ViteDevServer;
let address: string;
const context = { title: "Przykład", brief: "Syntetyczny brief", description: "" };
function post(operation = "questions", body: object = context) {
  return fetch(`${address}api/project-ai/${operation}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  provider.questions.mockReset().mockResolvedValue({ questions: ["Jaki był efekt?"] });
  provider.voice.mockReset().mockResolvedValue({ transcript: "Przykład", summary: "Efekt" });
  server = await createServer({
    configFile: false,
    plugins: [projectAiPlugin({ OPENROUTER_API_KEY: "synthetic-test-key" })],
    server: { host: "127.0.0.1", port: 0 },
  });
  await server.listen();
  address = server.resolvedUrls!.local[0];
});
afterEach(async () => {
  await server?.close();
});

describe("local AI HTTP limits", () => {
  it("rejects a competing voice operation and releases the slot when questions fail", async () => {
    let reject!: (reason: Error) => void;
    provider.questions.mockImplementationOnce(
      () =>
        new Promise((_, fail) => {
          reject = fail;
        }),
    );
    const pending = post();
    await vi.waitFor(() => expect(provider.questions).toHaveBeenCalledOnce());
    const rejected = await post("voice", { format: "webm", data: "AAAA" });
    expect(rejected.status).toBe(429);
    expect(rejected.headers.get("Retry-After")).toBe("1");
    expect(provider.voice).not.toHaveBeenCalled();
    reject(new Error("Provider unavailable"));
    expect((await pending).status).toBe(502);
    expect((await post("voice", { format: "webm", data: "AAAA" })).status).toBe(200);
    expect(provider.voice).toHaveBeenCalledOnce();
  });
  it("enforces the shared minute budget at the HTTP boundary", async () => {
    for (let n = 0; n < 10; n++) expect((await post()).status).toBe(200);
    const rejected = await post("voice", { format: "webm", data: "AAAA" });
    expect(rejected.status).toBe(429);
    expect(Number(rejected.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect((await rejected.json()).error).toContain("10 żądań");
    expect(provider.voice).not.toHaveBeenCalled();
  });
});
