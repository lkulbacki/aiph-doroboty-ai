import { expect, test } from "@playwright/test";
import { createServer, type ViteDevServer } from "vite";
import { STORAGE_KEY } from "../../src/features/prototype/storage";

let dev: ViteDevServer;
let address: string;
test.beforeAll(async () => {
  dev = await createServer({ server: { host: "127.0.0.1", port: 0, strictPort: false } });
  await dev.listen();
  address = dev.resolvedUrls!.local[0];
});
test.afterAll(async () => {
  await dev?.close();
});

test("development StrictMode keeps a single writer and releases it for another tab", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${address}#/auth/sign-in`);
  await page.getByRole("button", { name: "Wejdź jako Anna Kowalska", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key) ?? "null")?.activePersonId,
        STORAGE_KEY,
      ),
    )
    .toBe("candidate-anna");
  const second = await context.newPage();
  await second.goto(`${address}#/auth/sign-in`);
  await expect(second.getByRole("status").filter({ hasText: "tylko do podglądu" })).toBeVisible();
  await second.getByRole("button", { name: "Wejdź jako Marek Nowak", exact: true }).click();
  expect(
    await second.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).activePersonId,
      STORAGE_KEY,
    ),
  ).toBe("candidate-anna");
  await page.close();
  await second.reload();
  await second.goto(`${address}#/auth/sign-in`);
  await second.getByRole("button", { name: "Wejdź jako Marek Nowak", exact: true }).click();
  await expect
    .poll(() =>
      second.evaluate((key) => JSON.parse(localStorage.getItem(key)!).activePersonId, STORAGE_KEY),
    )
    .toBe("candidate-marek");
  expect(errors).toEqual([]);
});
