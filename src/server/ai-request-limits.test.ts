import { describe, expect, it } from "vitest";
import { aiRequestLimits } from "./ai-request-limits";

function accepted(limits: ReturnType<typeof aiRequestLimits>) {
  const slot = limits.acquire();
  if (!("release" in slot)) throw new Error(slot.error);
  return slot;
}

describe("local AI attempt limits", () => {
  it("allows only one request across both operations and releases after a failure", () => {
    const limits = aiRequestLimits(() => 0);
    const first = accepted(limits);
    expect(limits.acquire()).toMatchObject({ retryAfter: 1 });
    first.release();
    accepted(limits).release();
  });

  it("rejects the eleventh attempt and opens a new minute without consuming rejected attempts", () => {
    let now = 0;
    const limits = aiRequestLimits(() => now);
    for (let n = 0; n < 10; n++) accepted(limits).release();
    now = 1_001;
    expect(limits.acquire()).toMatchObject({ retryAfter: 59 });
    now = 60_000;
    accepted(limits).release();
  });

  it("keeps the process budget after minute windows reset", () => {
    let now = 0;
    const limits = aiRequestLimits(() => now);
    for (let n = 0; n < 100; n++) {
      accepted(limits).release();
      now += 60_000;
    }
    expect(limits.acquire()).toEqual({
      error: expect.stringContaining("100 żądań"),
    });
  });
});
