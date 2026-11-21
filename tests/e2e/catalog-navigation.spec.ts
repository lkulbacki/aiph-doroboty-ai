import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [390, 1280]) {
  test(`catalog section navigation keeps focus and history at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/design-system/editaurus#ed-foundations");
    const nav = page.getByRole("navigation", { name: "Spis treści Editaurusa" });
    await expect(
      page.getByRole("heading", { name: "Fundamenty Editaurusa", exact: true }),
    ).toBeFocused();
    const state = await page.evaluate(() => localStorage.getItem("doroboty.prototype.v1"));
    const filters = nav.getByRole("link", { name: "Filtry ofert", exact: true });
    await filters.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Filtry ofert z listingu", exact: true }),
    ).toBeFocused();
    await expect(
      page.getByRole("heading", { name: "Filtry ofert z listingu", exact: true }),
    ).toBeInViewport();
    await expect(filters).toHaveAttribute("aria-current", "location");
    await page.goBack();
    await expect(
      page.getByRole("heading", { name: "Fundamenty Editaurusa", exact: true }),
    ).toBeFocused();
    await page.goForward();
    await expect(
      page.getByRole("heading", { name: "Filtry ofert z listingu", exact: true }),
    ).toBeInViewport();
    await expect(filters).toHaveAttribute("aria-current", "location");
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Filtry ofert z listingu", exact: true }),
    ).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(await page.evaluate(() => localStorage.getItem("doroboty.prototype.v1"))).toBe(state);
    await page.screenshot({ path: `artifacts/catalog-navigation-${width}.png` });
  });
}

for (const width of [320, 390, 1280]) {
  test(`every catalog section is keyboard reachable without scenario writes at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/design-system/editaurus");
    const nav = page.getByRole("navigation", { name: "Spis treści Editaurusa" });
    const links = nav.getByRole("link");
    const state = await page.evaluate(() => localStorage.getItem("doroboty.prototype.v1"));
    const accessibility = await new AxeBuilder({ page }).include(".editaurus-catalog").analyze();
    expect(accessibility.violations).toEqual([]);
    for (const link of await links.all()) {
      const href = await link.getAttribute("href");
      const id = href!.split("#").at(-1)!;
      const heading = page.locator(`[id="${id}"]`);
      await expect(heading).toHaveCount(1);
      await expect(heading).toHaveRole("heading");
      await link.focus();
      await page.keyboard.press("Enter");
      await expect(heading).toBeFocused();
      await expect(heading).toBeInViewport();
      await expect(link).toHaveAttribute("aria-current", "location");
      await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(await page.evaluate(() => localStorage.getItem("doroboty.prototype.v1"))).toBe(state);
  });
}
