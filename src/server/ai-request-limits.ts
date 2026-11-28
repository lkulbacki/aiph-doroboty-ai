/** Shared by both local AI endpoints for one Vite process. */
export function aiRequestLimits(now = Date.now) {
  let active = false;
  let total = 0;
  let windowStart = now();
  let windowCount = 0;

  return {
    acquire(): { release: () => void } | { error: string; retryAfter?: number } {
      const time = now();
      if (time - windowStart >= 60_000) {
        windowStart = time;
        windowCount = 0;
      }
      if (total >= 100)
        return {
          error:
            "Wykorzystano limit 100 żądań AI na uruchomienie serwera. Sprawdź koszty u dostawcy przed ponownym uruchomieniem serwera.",
        };
      if (active)
        return { error: "Trwa inne żądanie AI. Poczekaj na jego zakończenie.", retryAfter: 1 };
      if (windowCount >= 10)
        return {
          error: "Wykorzystano limit 10 żądań AI na minutę. Spróbuj ponownie za chwilę.",
          retryAfter: Math.max(1, Math.ceil((windowStart + 60_000 - time) / 1000)),
        };
      active = true;
      total++;
      windowCount++;
      return {
        release: () => {
          active = false;
        },
      };
    },
  };
}
