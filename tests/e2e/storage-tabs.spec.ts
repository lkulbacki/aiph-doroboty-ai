import { expect, test } from "@playwright/test";
import { STORAGE_KEY } from "../../src/features/prototype/storage";

test("a second tab cannot overwrite, import or reset the writer's scenario", async ({
  page,
  context,
}) => {
  await page.goto("/#/auth/sign-in");
  await page.getByRole("button", { name: "Wejdź jako Anna Kowalska", exact: true }).click();
  const second = await context.newPage();
  await second.goto("/#/app/settings");
  await expect(second.getByRole("status").filter({ hasText: "tylko do podglądu" })).toBeVisible();
  const original = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  await second.getByRole("button", { name: "Resetuj scenariusz", exact: true }).click();
  await second
    .getByRole("alertdialog")
    .getByRole("button", { name: "Resetuj", exact: true })
    .click();
  await expect(second.getByText("Nie można zapisać w tej karcie.", { exact: false })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(original);
  await second.getByLabel("Importuj plik scenariusza").setInputFiles({
    name: "scenario.json",
    mimeType: "application/json",
    buffer: Buffer.from(original!),
  });
  await second
    .getByRole("alertdialog")
    .getByRole("button", { name: "Importuj", exact: true })
    .click();
  await expect(second.getByText("Dane zostały zaimportowane.", { exact: true })).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(original);
  await second.goto("/#/auth/sign-in");
  await second.getByRole("button", { name: "Wejdź jako Marek Nowak", exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(original);
  await page.close();
  await second.reload();
  await second.goto("/#/auth/sign-in");
  await second.getByRole("button", { name: "Wejdź jako Marek Nowak", exact: true }).click();
  await expect
    .poll(() =>
      second.evaluate((key) => JSON.parse(localStorage.getItem(key)!).activePersonId, STORAGE_KEY),
    )
    .toBe("candidate-marek");
});

test("a writer rejects storage changed outside the tab lock without replacing it", async ({
  page,
}) => {
  await page.goto("/#/auth/sign-in");
  await page.getByRole("button", { name: "Wejdź jako Anna Kowalska", exact: true }).click();
  const external = await page.evaluate((key) => {
    const state = JSON.parse(localStorage.getItem(key)!);
    state.activePersonId = "candidate-marek";
    const raw = JSON.stringify(state);
    localStorage.setItem(key, raw);
    return raw;
  }, STORAGE_KEY);
  await page.goto("/#/app/settings");
  await page.getByRole("button", { name: "Resetuj scenariusz", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Resetuj", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Scenariusz zmienił się" }),
  ).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(external);
});

test("a browser without Web Locks rejects writes and explains recovery", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "locks", { value: undefined, configurable: true });
  });
  await page.goto("/#/auth/sign-in");
  await expect(
    page.getByRole("status").filter({ hasText: "nie udostępnia blokady kart" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Wejdź jako Anna Kowalska", exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
  await expect(
    page.getByRole("status").filter({ hasText: "nie udostępnia blokady kart" }),
  ).toBeVisible();
});
