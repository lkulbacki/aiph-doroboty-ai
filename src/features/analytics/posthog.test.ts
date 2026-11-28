import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sdk = vi.hoisted(() => ({ init: vi.fn(), capture: vi.fn() }));
vi.mock("posthog-js", () => ({ default: sdk }));
const config = { enabled: true, key: "phc_test", host: "https://eu.i.posthog.com" };

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  sdk.init.mockImplementation(() => undefined);
  sdk.capture.mockImplementation(() => undefined);
  vi.stubGlobal("window", {
    location: { hash: "#/oferty/private-title?answer=secret" },
    addEventListener: vi.fn(),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("PostHog browser analytics", () => {
  it("stays inactive without production configuration", async () => {
    const { startAnalytics, trackAction } = await import("./posthog");
    await startAnalytics({ ...config, enabled: false });
    await startAnalytics({ ...config, key: "" });
    await startAnalytics({ ...config, host: "" });
    trackAction("submit");
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.capture).not.toHaveBeenCalled();
  });

  it("tracks initial and hash navigation once and emits only action types", async () => {
    const { startAnalytics, trackAction } = await import("./posthog");
    await startAnalytics(config);
    await startAnalytics(config);
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.capture).toHaveBeenLastCalledWith("$pageview", { route: "/oferty/:slug" });
    window.location.hash = "#/app/aplikacje/private-id/wyslano";
    const onHashChange = vi.mocked(window.addEventListener).mock.calls[0][1] as EventListener;
    onHashChange(new Event("hashchange"));
    expect(sdk.capture).toHaveBeenLastCalledWith("$pageview", {
      route: "/app/aplikacje/:id/wyslano",
    });
    trackAction("submit");
    expect(sdk.capture).toHaveBeenLastCalledWith("prototype_action_completed", {
      action: "submit",
      route: "/app/aplikacje/:id/wyslano",
    });
  });

  it("drops unexpected SDK events and properties, including URLs and free text", async () => {
    const { startAnalytics } = await import("./posthog");
    await startAnalytics(config);
    const options = sdk.init.mock.calls[0][1];
    expect(options).toMatchObject({
      autocapture: false,
      disable_session_recording: true,
      person_profiles: "never",
      persistence: "memory",
      respect_dnt: true,
    });
    expect(options.before_send({ event: "$autocapture", properties: {} })).toBeNull();
    expect(
      options.before_send({
        event: "$pageview",
        properties: {
          route: "/oferty/:slug",
          distinct_id: "anonymous",
          $process_person_profile: false,
          $current_url: "https://example.com/?secret",
          $referrer: "https://private.example.com",
          $set: { email: "private" },
          answer: "private",
        },
      }).properties,
    ).toEqual({ route: "/oferty/:slug", distinct_id: "anonymous", $process_person_profile: false });
  });

  it("does not interrupt app operations when loading or capture fails", async () => {
    const { startAnalytics, trackAction } = await import("./posthog");
    sdk.init.mockImplementationOnce(() => {
      throw new Error("blocked");
    });
    await expect(startAnalytics(config)).resolves.toBeUndefined();
    expect(() => trackAction("submit")).not.toThrow();
    vi.resetModules();
    const retry = await import("./posthog");
    sdk.capture.mockImplementation(() => {
      throw new Error("offline");
    });
    await expect(retry.startAnalytics(config)).resolves.toBeUndefined();
    expect(() => retry.trackAction("submit")).not.toThrow();
  });

  it("redacts unknown routes and treats empty hashes as home", async () => {
    const { analyticsRoute } = await import("./posthog");
    expect(analyticsRoute("#/private/value?email=secret")).toBe("/unknown");
    expect(analyticsRoute("")).toBe("/");
  });
});
