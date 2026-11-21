import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { initialState } from "../../src/features/prototype/model";
import { STORAGE_KEY } from "../../src/features/prototype/storage";

for (const failedLogo of [false, true]) {
  test(`company boundary review with ${failedLogo ? "failed" : "missing"} logo`, async ({
    page,
  }) => {
    const state = initialState();
    const company = state.companies[0];
    company.name = "Nazwa".repeat(40);
    company.summary = "";
    company.description = "";
    company.websiteUrl = "";
    company.logoUrl = failedLogo ? "/missing-company-audit.png" : undefined;
    state.jobs
      .filter((job) => job.companyId === company.id)
      .forEach((job) => {
        job.publicationStatus = "archived";
      });
    await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), {
      key: STORAGE_KEY,
      state,
    });
    await page.goto(`/#/firmy/${company.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(company.name);
    const logo = page.locator(".editorial-offer-identity [data-company-logo]");
    await expect(logo).toHaveText("N");
    await expect(logo.locator("img")).toHaveCount(0);
    await expect(page.getByText("Firma nie dodała jeszcze podsumowania.")).toBeVisible();
    await expect(page.getByText("Firma nie dodała jeszcze opisu.")).toBeVisible();
    await expect(page.getByText("Ta firma nie ma teraz aktywnych ofert.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Strona firmy" })).toHaveCount(0);
    await expect(page.getByText(/Profil i oferty zawierają dane demonstracyjne/)).toBeVisible();
    for (const width of [320, 850, 851, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(logo).toHaveCSS("border-top-width", "1px");
      await expect(page.getByRole("complementary", { name: "Informacje o firmie" })).toHaveCSS(
        "border-top-width",
        "1px",
      );
      await page.screenshot({
        path: `artifacts/company-boundary-${failedLogo}-${width}.png`,
        fullPage: true,
      });
    }
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    const result = await new AxeBuilder({ page }).include("main").analyze();
    expect(result.violations).toEqual([]);
    const back = page.getByRole("link", { name: "Wróć do ofert", exact: true });
    await back.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#\/oferty$/);
  });
}

for (const width of [320, 851]) {
  test(`form controls retain keyboard and forced-color boundaries at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await page.goto("/#/auth/sign-in");
    await page.getByRole("button", { name: "Wejdź jako Karolina Wiśniewska", exact: true }).click();
    await page.goto("/#/app/oferty/nowa");
    const category = page.getByRole("combobox", { name: "Kategoria", exact: true });
    await page.getByRole("button", { name: "Wyczyść: Kategoria", exact: true }).click();
    expect(await category.evaluate((el) => (el as HTMLInputElement).reportValidity())).toBe(false);
    await expect(category).toBeFocused();
    await expect(category).toHaveAccessibleDescription("Wybierz opcję z listy.");
    await expect(page.locator(".editaurus-form-combobox").first()).toHaveCSS(
      "outline-style",
      "solid",
    );
    await category.fill("lea");
    await expect(page.getByRole("option", { name: "Lead", exact: true })).toBeVisible();
    await page.screenshot({ path: `artifacts/forced-picker-${width}.png` });
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(category).toHaveValue("Lead");
    const approval = page.getByRole("checkbox", {
      name: "Zatwierdzam treść oferty do publikacji.",
      exact: true,
    });
    await approval.focus();
    await page.keyboard.press("Space");
    await expect(approval).toBeChecked();
    await expect(approval).toHaveCSS("outline-style", "solid");
    await page.screenshot({ path: `artifacts/forced-approval-${width}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.goto("/#/oferty");
    const remote = page.getByRole("checkbox", { name: "Zdalnie", exact: true });
    if (width < 850)
      await page
        .getByRole("button", { name: /Filtry/ })
        .first()
        .click();
    await remote.click();
    await expect(remote).toBeChecked();
    await page.screenshot({ path: `artifacts/forced-filter-${width}.png` });
    const analysis = await new AxeBuilder({ page })
      .include(width < 850 ? '[role="dialog"]' : "main")
      .analyze();
    expect(analysis.violations).toEqual([]);
  });
}
