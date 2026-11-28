import { describe, expect, it, vi } from "vitest";
import { openRouter } from "./openrouter";

function completion(content: string) {
  return Response.json({ choices: [{ message: { content } }] });
}

describe("the OpenRouter project answer adapter", () => {
  it("sends the offer context and parses between one and three distinct questions", async () => {
    const question = "Jaki był Twój wkład w projekt i jego rezultat?";
    const upstream = vi.fn<typeof fetch>().mockResolvedValue(
      completion(
        JSON.stringify({
          questions: [question, question],
        }),
      ),
    );
    const ai = openRouter({ apiKey: "example-key" }, upstream);
    const context = {
      title: "Projektant",
      brief: "Projekt dla biblioteki",
      description: "Testowanie formularza",
    };
    await expect(ai.questions(context)).resolves.toEqual({ questions: [question] });
    const [url, init] = upstream.mock.calls[0];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(init?.headers).toMatchObject({ Authorization: "Bearer example-key" });
    expect(JSON.parse(String(init?.body))).toMatchObject({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "system" }, { role: "user", content: JSON.stringify(context) }],
      response_format: { type: "json_schema" },
      provider: {
        require_parameters: true,
        order: ["groq", "deepinfra"],
        only: ["groq", "deepinfra"],
      },
    });
  });

  it("transcribes only the recording and summarizes the returned transcript", async () => {
    const transcript = "Samodzielnie zaprojektowałam formularz.";
    const contribution = "Samodzielne zaprojektowanie formularza.";
    const summary = `Wkład: ${contribution}`;
    const upstream = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ text: transcript, usage: { cost: 0.00018 } }))
      .mockResolvedValueOnce(completion(JSON.stringify({ contribution, outcome: "" })));
    const ai = openRouter({ apiKey: "example-key" }, upstream);
    const audio = { format: "webm" as const, data: "GkXfow==" };
    await expect(ai.voice(audio)).resolves.toEqual({ transcript, summary });
    const [[audioUrl, request], [chatUrl, chatRequest]] = upstream.mock.calls;
    expect(audioUrl).toBe("https://openrouter.ai/api/v1/audio/transcriptions");
    expect(JSON.parse(String(request?.body))).toEqual({
      model: "openai/whisper-large-v3-turbo",
      language: "pl",
      input_audio: audio,
    });
    expect(chatUrl).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(JSON.parse(String(chatRequest?.body))).toMatchObject({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "system" }, { role: "user", content: JSON.stringify({ transcript }) }],
      response_format: { json_schema: { name: "project_summary", strict: true } },
    });
  });

  it("stops before summarizing if transcription fails", async () => {
    const upstream = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        Response.json(
          { error: { message: "Provider returned confidential diagnostics" } },
          { status: 502 },
        ),
      );
    const ai = openRouter({ apiKey: "example-key" }, upstream);
    await expect(ai.voice({ format: "webm", data: "GkXfow==" })).rejects.toThrow(
      "OpenRouter request failed.",
    );
    expect(upstream).toHaveBeenCalledTimes(1);
  });

  it("reports voice usage without audio, transcripts or generated content", async () => {
    const captureGeneration = vi.fn();
    const observer = { captureGeneration, flush: vi.fn(), shutdown: vi.fn() };
    const context = {
      distinctId: "candidate-example",
      sessionId: "session-example",
      traceId: "trace-example",
    };
    const upstream = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json({ text: "PRIVATE_TRANSCRIPT", usage: { cost: 0.00018 } }),
      )
      .mockResolvedValueOnce(
        completion(JSON.stringify({ contribution: "PRIVATE_SUMMARY", outcome: "" })),
      );
    const ai = openRouter({ apiKey: "example-key", observer }, upstream);
    await ai.voice({ format: "webm", data: "PRIVATE_AUDIO" }, context);
    expect(captureGeneration).toHaveBeenCalledTimes(2);
    expect(captureGeneration).toHaveBeenCalledWith(
      context,
      expect.objectContaining({
        $ai_model: "openai/whisper-large-v3-turbo",
        $ai_total_cost_usd: 0.00018,
        $ai_http_status: 200,
      }),
    );
    const telemetry = JSON.stringify(captureGeneration.mock.calls);
    for (const value of [
      "PRIVATE_AUDIO",
      "PRIVATE_TRANSCRIPT",
      "PRIVATE_SUMMARY",
      '$ai_input"',
      "$ai_output_choices",
    ])
      expect(telemetry).not.toContain(value);
  });

  it.each([false, true])(
    "keeps question content out of telemetry on success/error=%s",
    async (failed) => {
      const captureGeneration = vi.fn();
      const observer = { captureGeneration, flush: vi.fn(), shutdown: vi.fn() };
      const context = {
        distinctId: "candidate-example",
        sessionId: "session-example",
        traceId: "trace-example",
      };
      const upstream = vi.fn<typeof fetch>();
      if (failed) upstream.mockRejectedValue(new Error("PRIVATE_PROVIDER_ERROR"));
      else
        upstream.mockResolvedValue(completion(JSON.stringify({ questions: ["PRIVATE_QUESTION"] })));
      const ai = openRouter({ apiKey: "example-key", observer }, upstream);
      const result = ai.questions(
        { title: "PRIVATE_TITLE", brief: "PRIVATE_BRIEF", description: "PRIVATE_DESCRIPTION" },
        context,
      );
      if (failed) await expect(result).rejects.toThrow("PRIVATE_PROVIDER_ERROR");
      else await expect(result).resolves.toEqual({ questions: ["PRIVATE_QUESTION"] });
      expect(captureGeneration).toHaveBeenCalledWith(
        context,
        expect.objectContaining({ $ai_provider: "openrouter" }),
      );
      expect(JSON.stringify(captureGeneration.mock.calls)).not.toContain("PRIVATE_");
    },
  );
});
