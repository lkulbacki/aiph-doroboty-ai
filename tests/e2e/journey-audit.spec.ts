import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { initialState, stageLabels } from "../../src/features/prototype/model";
import { STORAGE_KEY } from "../../src/features/prototype/storage";

async function choose(page: Page, name: string) {
  await page.goto("/#/auth/sign-in");
  await page.getByRole("button", { name: `Wejdź jako ${name}`, exact: true }).click();
}

for (const width of [1280, 390]) {
  for (const terminal of ["hired", "rejected"] as const) {
    test(`audit terminal ${terminal} and cross-role projection at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await choose(page, "Karolina Wiśniewska");
      await page.goto("/#/app/kandydaci/application-example");
      const stages =
        terminal === "hired"
          ? ([
              "reviewed",
              "interview_invited",
              "first_conversation_held",
              "continued",
              "hired",
            ] as const)
          : (["rejected"] as const);
      for (const stage of stages) {
        await page
          .getByLabel("Notatka rekrutacyjna (widoczna pracodawcy)")
          .fill(`Audit private note ${stage}`);
        await page.getByRole("button", { name: stageLabels[stage], exact: true }).click();
        await expect(page.locator(".record-stage")).toHaveText(stageLabels[stage]);
        await expect(page.locator(".record-stage")).toBeFocused();
      }
      await page.reload();
      await expect(page.getByLabel("Notatka rekrutacyjna (widoczna pracodawcy)")).toHaveCount(0);
      await expect(page.locator(".record-stage")).toHaveText(stageLabels[terminal]);
      await page.screenshot({ path: `artifacts/audit-${terminal}-${width}.png` });
      await choose(page, "Marek Nowak");
      await page.goto("/#/app/aplikacje/application-example");
      await expect(page.locator(".record-stage")).toHaveText(stageLabels[terminal]);
      await expect(
        page.getByRole("button", { name: "Wycofaj aplikację", exact: true }),
      ).toHaveCount(0);
      await expect(page.locator("main")).not.toContainText("Audit private note");
      await choose(page, "Anna Kowalska");
      await page.goto("/#/app/aplikacje/application-example");
      await expect(page.getByRole("heading", { name: "Nie znaleziono strony" })).toBeVisible();
      await choose(page, "Tomasz Zieliński");
      await page.goto("/#/app/kandydaci/application-example");
      await expect(page.getByRole("heading", { name: "Nie znaleziono strony" })).toBeVisible();
    });
  }

  test(`audit organization and actual exported-file recovery at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await choose(page, "Karolina Wiśniewska");
    await page.goto("/#/app/organizacja");
    await page.getByLabel("Nazwa firmy", { exact: true }).fill("BrightLabs — audyt organizacji");
    await page.getByRole("button", { name: "Zapisz dane firmy", exact: true }).click();
    await page.reload();
    await expect(page.getByLabel("Nazwa firmy", { exact: true })).toHaveValue(
      "BrightLabs — audyt organizacji",
    );
    await page.goto("/#/firmy/brightlabs");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "BrightLabs — audyt organizacji",
    );
    await page.goto("/#/app/settings");
    const exported = page.waitForEvent("download");
    await page.getByRole("button", { name: "Eksportuj dane", exact: true }).click();
    const file = await exported;
    const bytes = await readFile((await file.path())!);
    const expected = JSON.parse(bytes.toString());
    expect(expected).toEqual(
      JSON.parse((await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY))!),
    );
    await page.getByRole("button", { name: "Resetuj scenariusz", exact: true }).click();
    await page.getByRole("button", { name: "Anuluj", exact: true }).click();
    expect(
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY),
    ).toEqual(expected);
    await page.getByRole("button", { name: "Resetuj scenariusz", exact: true }).click();
    await page.getByRole("button", { name: "Resetuj", exact: true }).click();
    await page.reload();
    await page
      .getByLabel("Importuj plik scenariusza")
      .setInputFiles({ name: "roundtrip.json", mimeType: "application/json", buffer: bytes });
    await page.getByRole("button", { name: "Anuluj", exact: true }).click();
    expect(
      await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)!).activePersonId,
        STORAGE_KEY,
      ),
    ).toBeNull();
    await page
      .getByLabel("Importuj plik scenariusza")
      .setInputFiles({ name: "roundtrip.json", mimeType: "application/json", buffer: bytes });
    await page.getByRole("button", { name: "Importuj", exact: true }).click();
    await expect
      .poll(() =>
        page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).activePersonId, STORAGE_KEY),
      )
      .toBe(expected.activePersonId);
    await expect(page.getByRole("status")).toContainText("Dane zostały zaimportowane.");
    await testInfo.attach("import-persona-feedback-observation", {
      body: JSON.stringify({ statuses: await page.getByRole("status").allTextContents() }),
      contentType: "application/json",
    });
    await page
      .getByLabel("Importuj plik scenariusza")
      .setInputFiles({ name: "same-person.json", mimeType: "application/json", buffer: bytes });
    await page.getByRole("button", { name: "Importuj", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("Dane zostały zaimportowane.");
    await page.getByLabel("Importuj plik scenariusza").setInputFiles({
      name: "invalid-after-success.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"version":999}'),
    });
    await page.getByRole("button", { name: "Importuj", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText("Nieprawidłowy plik");
    await expect(page.getByRole("alertdialog")).toHaveCount(0);
    await expect(page.getByRole("status")).toHaveCount(0);
    await testInfo.attach("recovery-feedback-observation", {
      body: JSON.stringify({
        alerts: await page.getByRole("alert").allTextContents(),
        statuses: await page.getByRole("status").allTextContents(),
      }),
      contentType: "application/json",
    });
    await page.screenshot({ path: `artifacts/audit-recovery-feedback-${width}.png` });
    await page.reload();
    expect(
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY),
    ).toEqual(expected);
    await page.getByLabel("Importuj plik scenariusza").setInputFiles({
      name: "oversized.json",
      mimeType: "application/json",
      buffer: Buffer.alloc(2_000_001, " "),
    });
    await expect(page.getByRole("alert")).toContainText("Plik jest za duży");
    expect(
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY),
    ).toEqual(expected);
  });

  test(`audit routed surfaces and accessibility sample at ${width}px`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const evidence = [];
    const jobId = initialState().jobs.find((job) => job.slug === "ai-product-manager")!.id;
    const groups = [
      {
        person: "",
        routes: [
          "/",
          "/oferty",
          "/oferty?view=map",
          "/oferty/ai-product-manager",
          "/firmy/brightlabs",
          "/metodologia",
          "/polityka-prywatnosci",
          "/design-system/editaurus",
          "/nieznany-adres",
        ],
      },
      {
        person: "Anna Kowalska",
        routes: [
          "/app",
          "/app/profil",
          "/app/profil/podglad",
          "/app/onboarding",
          "/app/zapisane",
          "/app/aplikacje",
          "/aplikuj/ai-product-manager",
          "/app/settings",
        ],
      },
      {
        person: "Marek Nowak",
        routes: [
          "/app/aplikacje/application-example",
          "/app/aplikacje/application-example/wyslano",
        ],
      },
      {
        person: "Karolina Wiśniewska",
        routes: [
          "/app",
          "/app/oferty",
          "/app/oferty/nowa",
          `/app/oferty/${jobId}`,
          "/app/organizacja",
          "/app/kandydaci",
          "/app/kandydaci/application-example",
        ],
      },
      { person: "Prowadzący", routes: ["/app/case"] },
    ];
    const axeRoutes = new Set([
      "/aplikuj/ai-product-manager",
      "/app/oferty/nowa",
      "/app/organizacja",
      "/app/kandydaci/application-example",
      "/app/settings",
      "/app/case",
    ]);
    let index = 0;
    for (const group of groups) {
      if (group.person) await choose(page, group.person);
      for (const route of group.routes) {
        await page.goto(`/#${route}`);
        await expect(page.locator("main h1").first()).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const geometry = await page.evaluate(() => ({
          viewport: innerWidth,
          scroll: document.documentElement.scrollWidth,
          heading: document.querySelector("main h1")?.textContent,
        }));
        expect(geometry.scroll).toBeLessThanOrEqual(width);
        const violations = axeRoutes.has(route)
          ? (
              await new AxeBuilder({ page })
                .include("main")
                .withTags(["wcag2a", "wcag2aa"])
                .analyze()
            ).violations.map(({ id, impact, nodes }) => ({
              id,
              impact,
              targets: nodes.map((n) => n.target),
            }))
          : [];
        const screenshot = `artifacts/audit-route-${width}-${index++}.png`;
        await page.screenshot({ path: screenshot });
        evidence.push({
          person: group.person || "public",
          route,
          ...geometry,
          violations,
          axeExecuted: axeRoutes.has(route),
          screenshot,
        });
      }
    }
    await testInfo.attach("route-audit", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
    expect(errors).toEqual([]);
  });
}
