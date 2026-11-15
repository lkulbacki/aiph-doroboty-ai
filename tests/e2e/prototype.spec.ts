import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { initialState } from "../../src/features/prototype/model";
import { STORAGE_KEY } from "../../src/features/prototype/storage";
import { readFile } from "node:fs/promises";
async function choose(page: Page, name: string) {
  await page.goto("/#/auth/sign-in");
  await page.getByRole("button", { name: `Wejdź jako ${name}`, exact: true }).click();
}
async function application(page: Page) {
  await choose(page, "Anna Kowalska");
  await page.goto("/#/aplikuj/ai-product-manager");
  await page
    .getByLabel("Dlaczego pasujesz do tej roli?")
    .fill(
      "Zaprojektowałam proces automatyzacji i przeprowadziłam badania użytkowników. Wynik: krótszy czas obsługi zgłoszeń o 30%.",
    );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Wyślij aplikację", exact: true }).click();
}

for (const [name, filename] of [
  ["Anna Kowalska", "anna-kowalska-cv-v1.pdf"],
  ["Marek Nowak", "marek-nowak-cv-v1.pdf"],
]) {
  test(`${name} has the same local PDF in profile, application and employer detail`, async ({
    page,
  }) => {
    const external: string[] = [];
    page.on("request", (request) => {
      if (!request.url().startsWith("http://127.0.0.1:3106")) external.push(request.url());
    });
    await choose(page, name);
    await page.goto("/#/app/profil");
    const downloadLink = page.getByRole("link", { name: "Pobierz CV (PDF)", exact: true });
    const href = await downloadLink.getAttribute("href");
    const response = await page.request.get(href!);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    const bytes = await response.body();
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    const downloaded = page.waitForEvent("download");
    await downloadLink.focus();
    await page.keyboard.press("Enter");
    const download = await downloaded;
    expect(download.suggestedFilename()).toBe(filename);
    expect(await readFile((await download.path())!)).toEqual(bytes);
    await page.getByLabel("Imię i nazwisko").fill(`Zmieniony profil ${name}`);
    await page.getByRole("button", { name: "Zapisz profil", exact: true }).click();
    await page.reload();
    await expect(downloadLink).toHaveAttribute("href", href!);
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(downloadLink).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: `artifacts/${filename}-mobile.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/#/aplikuj/ai-operations-specialist");
    await expect(downloadLink).toHaveAttribute("href", href!);
    await expect(page.getByRole("link", { name: "Otwórz CV (PDF)", exact: false })).toHaveAttribute(
      "target",
      "_blank",
    );
    await page
      .getByLabel("Dlaczego pasujesz do tej roli?")
      .fill("Mam doświadczenie w rozwoju produktów i automatyzacji obsługi zgłoszeń.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Wyślij aplikację", exact: true }).click();
    await page.getByRole("link", { name: "AI Operations Specialist", exact: true }).click();
    await page.getByRole("tab", { name: "CV", exact: true }).click();
    await expect(downloadLink).toHaveAttribute("href", href!);
    const id = page.url().split("/").pop();
    await choose(page, "Karolina Wiśniewska");
    await page.goto(`/#/app/kandydaci/${id}`);
    await page.reload();
    await expect(downloadLink).toHaveCount(0);
    await page.getByRole("tab", { name: "CV", exact: true }).click();
    await expect(downloadLink).toHaveAttribute("href", href!);
    await page.screenshot({ path: `artifacts/${filename}-employer-desktop.png`, fullPage: true });
    expect(external).toEqual([]);
  });
}

test("published job → saved offer/draft → submitted application → employer decision survives reload", async ({
  page,
}) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1:3106") &&
      !r.url().startsWith("data:") &&
      !r.url().startsWith("blob:")
    )
      external.push(r.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await choose(page, "Karolina Wiśniewska");
  await page.getByRole("link", { name: "Dodaj ofertę", exact: true }).click();
  await page.getByLabel("Nazwa stanowiska").fill("Product Designer do automatyzacji");
  await page
    .getByLabel("Brief — kogo szukasz i do jakiego zadania?")
    .fill("Szukamy osoby do badań z klientami, prototypowania i wdrażania automatyzacji obsługi.");
  await page.getByRole("button", { name: "Przygotuj opis z AI" }).click();
  await page.getByRole("button", { name: "Użyj propozycji" }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Opublikuj ofertę" }).click();
  await expect(
    page.getByRole("link", { name: "Product Designer do automatyzacji", exact: true }),
  ).toBeVisible();
  await choose(page, "Anna Kowalska");
  await page.goto("/#/oferty");
  await page.getByLabel("Szukaj ofert", { exact: true }).fill("Product Designer do automatyzacji");
  await page.getByRole("button", { name: "Szukaj", exact: true }).click();
  await page.reload();
  await page.getByRole("link", { name: "Product Designer do automatyzacji", exact: true }).click();
  await page.getByRole("button", { name: "Zapisz ofertę", exact: true }).click();
  await page.getByRole("link", { name: "Aplikuj", exact: true }).click();
  const answer = page.getByLabel("Dlaczego pasujesz do tej roli?");
  const draftAnswer =
    "Przeprowadziłam badania z użytkownikami i wdrożyłam automatyzację. Czas obsługi skrócił się o 30%.";
  await expect(page.getByLabel("Twoje notatki do aplikacji (opcjonalnie)")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Przygotuj propozycję z AI" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Użyj propozycji" })).toHaveCount(0);
  await answer.fill(draftAnswer);
  await page.getByRole("button", { name: "Zapisz szkic" }).click();
  await expect(page.getByRole("status")).toHaveText("Szkic został zapisany.");
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).drafts.at(-1), STORAGE_KEY),
  ).toMatchObject({ notes: "", generated: "", answer: draftAnswer });
  await page.reload();
  await expect(answer).toHaveValue(draftAnswer);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Wyślij aplikację", exact: true }).click();
  await expect(page.getByText("Aplikacja została wysłana.", { exact: false })).toBeVisible();
  await page.reload();
  await page.getByRole("link", { name: "Product Designer do automatyzacji", exact: true }).click();
  const candidateUrl = page.url();
  await expect(page.getByText("Match Score: 84%", { exact: true })).toBeVisible();
  await choose(page, "Karolina Wiśniewska");
  await page.getByRole("link", { name: "Kandydaci", exact: true }).click();
  await page.getByRole("link", { name: "Anna Kowalska", exact: true }).click();
  await page
    .getByLabel("Notatka rekrutacyjna (widoczna pracodawcy)")
    .fill("Notatka pracodawcy — tylko panel firmy.");
  await page.getByRole("button", { name: "W przeglądzie", exact: true }).click();
  for (const label of ["Zaproszenie na rozmowę", "Pierwsza rozmowa odbyta", "Kolejny etap"])
    await page.getByRole("button", { name: label, exact: true }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Zatrudnienie", exact: true })).toBeVisible();
  await choose(page, "Anna Kowalska");
  await page.goto(candidateUrl);
  await expect(page.locator(".record-stage")).toHaveText("Kolejny etap");
  await expect(
    page.getByText("Notatka pracodawcy — tylko panel firmy.", { exact: true }),
  ).toHaveCount(0);
  await page.screenshot({ path: "artifacts/candidate-desktop.png", fullPage: true });
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test("another company cannot see or change a candidate application", async ({ page }) => {
  await choose(page, "Tomasz Zieliński");
  await page.goto("/#/app/kandydaci");
  await expect(page.getByRole("link", { name: "Marek Nowak", exact: true })).toHaveCount(0);
  await page.goto("/#/app/kandydaci/application-example");
  await expect(page.getByRole("heading", { name: "Nie znaleziono strony" })).toBeVisible();
});
test("candidate withdrawal is confirmed and terminal", async ({ page }) => {
  await application(page);
  await page.getByRole("link", { name: "AI Product Manager", exact: true }).click();
  await page.getByRole("button", { name: "Wycofaj aplikację", exact: true }).click();
  await page.getByRole("button", { name: "Anuluj", exact: true }).click();
  await expect(page.getByRole("button", { name: "Wycofaj aplikację", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Wycofaj aplikację", exact: true }).click();
  await page.getByRole("button", { name: "Potwierdź wycofanie", exact: true }).click();
  await page.reload();
  await expect(page.locator(".record-stage")).toHaveText("Wycofana");
});
test("profile changes do not rewrite a submitted application snapshot", async ({ page }) => {
  await application(page);
  await page.goto("/#/app/profil");
  await page.getByLabel("Imię i nazwisko").fill("Nowa Anna");
  await page.getByRole("button", { name: "Zapisz profil", exact: true }).click();
  await page.goto("/#/app/aplikacje");
  await page.getByRole("link", { name: "AI Product Manager", exact: true }).click();
  await expect(page.locator("main")).toContainText("Anna Kowalska");
});
test("invalid import preserves state, valid import replaces state, reset asks for confirmation", async ({
  page,
}) => {
  await choose(page, "Anna Kowalska");
  await page.goto("/#/app/settings");
  const before = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  await page.getByLabel("Importuj plik scenariusza").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await page.getByRole("button", { name: "Importuj", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Nieprawidłowy plik");
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(before);
  const imported = initialState();
  imported.activePersonId = "candidate-anna";
  imported.people[0].name = "Zaimportowana Anna";
  await page.getByLabel("Importuj plik scenariusza").setInputFiles({
    name: "scenario.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(imported)),
  });
  await page.getByRole("button", { name: "Importuj", exact: true }).click();
  await expect(page.getByText("Zaimportowana Anna", { exact: true }).first()).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Eksportuj dane" }).click();
  expect((await download).suggestedFilename()).toBe("doroboty-scenariusz.json");
  await page.getByRole("button", { name: "Resetuj scenariusz", exact: true }).click();
  await page.getByRole("button", { name: "Anuluj", exact: true }).click();
  await expect(page.getByText("Zaimportowana Anna", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Resetuj scenariusz", exact: true }).click();
  await page.getByRole("button", { name: "Resetuj", exact: true }).click();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).activePersonId,
      STORAGE_KEY,
    ),
  ).toBe(null);
});
test("unreadable save stays untouched while the user works in memory", async ({ page }) => {
  await page.goto("/");
  await page.evaluate((key) => localStorage.setItem(key, '{"version":999}'), STORAGE_KEY);
  await page.reload();
  await expect(page.getByRole("status")).toContainText("nie zostaną nadpisane");
  await choose(page, "Anna Kowalska");
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(
    '{"version":999}',
  );
  await page.goto("/#/app/settings");
  await expect(page.getByRole("button", { name: "Pobierz poprzedni zapis" })).toBeVisible();
});
test("storage denial keeps the app usable and offers export", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "setItem", {
      value() {
        throw new Error("Storage denied");
      },
    });
  });
  await choose(page, "Anna Kowalska");
  await expect(page.getByRole("status")).toContainText("Wyeksportuj");
  await page.goto("/#/app/profil");
  await expect(page.getByLabel("Imię i nazwisko")).toHaveValue("Anna Kowalska");
});
test("map, hash deep links and unknown records work without external requests", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (r.url().startsWith("https://")) external.push(r.url());
  });
  await page.goto("/#/oferty?view=map");
  await page
    .getByRole("region", { name: "Mapa ofert w Polsce" })
    .getByRole("button")
    .first()
    .click();
  await page.getByRole("link", { name: "Zobacz rolę", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: "artifacts/job-desktop.png", fullPage: true });
  expect(external).toEqual([]);
  await page.goto("/#/oferty/missing");
  await expect(page.getByRole("heading", { name: "Nie znaleziono strony" })).toBeVisible();
});
test("mobile navigation, light-only appearance and keyboard person selection", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/#/auth/sign-in");
  const anna = page.getByRole("button", { name: "Wejdź jako Anna Kowalska", exact: true });
  await anna.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Otwórz menu" }).click();
  await page.getByRole("link", { name: "Profil", exact: true }).click();
  await expect(page.getByLabel("Imię i nazwisko")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "artifacts/profile-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Otwórz menu" }).click();
  await page.getByRole("link", { name: "Ustawienia", exact: true }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Motyw" })).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(244, 244, 240)");
  await page.screenshot({ path: "artifacts/settings-mobile-light.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("core screens have no serious accessibility violations", async ({ page }) => {
  await page.goto("/#/oferty");
  let results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
  await choose(page, "Anna Kowalska");
  await page.goto("/#/app/profil");
  results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("public home and filters reflow at 320px with no external requests", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("/");
  const hero = page.getByRole("region", { name: /AI samo się/ });
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText(/AI samo się\s*nie zatrudni/);
  await expect(hero).toHaveCSS("background-color", "rgb(16, 61, 53)");
  const centaur = hero.getByRole("img", { name: /centaur/ });
  await expect.poll(() => centaur.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(1122);
  await expect(centaur).toHaveAttribute("style", /translateY/);
  await page.evaluate(() => window.scrollTo(0, 350));
  await expect(centaur).not.toHaveAttribute("style", /translateY\(0px\)/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(centaur).not.toHaveAttribute("style", /translateY/);
  await page.evaluate(() => window.scrollTo(0, 0));
  const header = page.getByRole("banner");
  await expect(header).toHaveCSS("background-color", "rgb(16, 61, 53)");
  const brand = header.getByRole("link", { name: "DoRoboty.ai — strona główna" });
  await brand.hover();
  await expect(brand).toHaveCSS("text-decoration-line", "underline");
  await expect(brand).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  const offers = hero.getByRole("link", { name: "Zobacz oferty", exact: true });
  await expect(offers).toHaveText("Zobacz oferty");
  await offers.hover();
  await expect(offers).toHaveCSS("transform", "matrix(1, 0, 0, 1, -3, -3)");
  await expect(offers).toHaveCSS("background-color", "rgb(241, 243, 106)");
  await expect(offers).toHaveCSS("box-shadow", /8px 8px/);
  await expect(offers).toHaveCSS("box-shadow", /rgb\(168, 199, 250\)/);
  await expect(offers).toHaveCSS("box-shadow", /rgb\(242, 130, 183\)/);
  await page.mouse.down();
  await expect(offers).toHaveCSS("transform", "matrix(1, 0, 0, 1, -1, -1)");
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
  await hero.getByRole("button", { name: "Poznaj trzy z nich" }).click();
  await expect(page.getByRole("heading", { name: "Ta sama moc. Różna robota." })).toBeFocused();
  const roles = hero.getByRole("button", { name: "Kogo szukamy" });
  await roles.hover();
  await expect(roles).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(roles).toHaveCSS("text-decoration-line", "underline");
  await expect(roles).toHaveCSS("box-shadow", /-1px.*inset/);
  const dimensions = (button: HTMLElement) => [button.offsetWidth, button.offsetHeight];
  expect(await roles.evaluate(dimensions)).toEqual(await offers.evaluate(dimensions));
  await expect(roles).toHaveCSS("border-bottom-width", "1px");
  await expect(roles).toHaveCSS("padding-inline-start", "16px");
  await expect(roles).toHaveText("Kogo szukamy");
  await roles.click();
  await expect(page.getByRole("heading", { name: "Ta sama moc. Różna robota." })).toBeFocused();
  await offers.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#\/oferty$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "artifacts/jobs-mobile.png", fullPage: true });
  await page.goto("/#/");
  const employer = header.getByRole("link", { name: "Dla firm" });
  await expect(employer).toHaveCSS("color", "rgb(244, 240, 229)");
  await employer.click();
  await page.getByRole("button", { name: "Wejdź jako Karolina Wiśniewska" }).click();
  await expect(page.getByRole("link", { name: "Dodaj ofertę", exact: true })).toBeVisible();
});

test("application submission explains short answers and missing approval without losing input", async ({
  page,
}) => {
  await choose(page, "Anna Kowalska");
  await page.goto("/#/aplikuj/ai-product-manager");
  const answer = page.getByLabel("Dlaczego pasujesz do tej roli?");
  const send = page.getByRole("button", { name: "Wyślij aplikację", exact: true });
  await answer.fill("krótka odpowiedź");
  await page.getByRole("checkbox").check();
  await expect(send).toBeEnabled();
  await send.click();
  await expect(page.getByRole("alert")).toContainText("Odpowiedź jest za krótka");
  await expect(answer).toBeFocused();
  await expect(answer).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("checkbox")).toBeChecked();
  await expect(answer).toHaveValue("krótka odpowiedź");
  await answer.fill("Moje doświadczenie pasuje do odpowiedzialności opisanej w tej ofercie.");
  await send.click();
  await expect(page.getByRole("alert")).toHaveText(
    "Zatwierdź treść aplikacji i jej przesłanie pracodawcy.",
  );
  await expect(page.getByRole("checkbox")).toBeFocused();
  await page.getByRole("checkbox").check();
  await send.click();
  await expect(page.getByText("Aplikacja została wysłana.", { exact: false })).toBeVisible();
});

for (const width of [1440, 375]) {
  test(`legacy application draft stays compatible without notes or AI controls at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const legacy = initialState();
    legacy.activePersonId = "candidate-anna";
    const job = legacy.jobs.find((job) => job.slug === "ai-product-manager")!;
    const draft = {
      candidateId: "candidate-anna",
      jobId: job.id,
      notes: "Dawne notatki źródłowe kandydata",
      generated: "Dawna propozycja AI, która nie jest zatwierdzoną odpowiedzią",
      answer: "Zapisana wcześniej odpowiedź kandydata do dalszej edycji.",
    };
    legacy.drafts.push(draft);
    await choose(page, "Anna Kowalska");
    await page.goto("/#/app/settings");
    await page.getByLabel("Importuj plik scenariusza").setInputFiles({
      name: "legacy-draft.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(legacy)),
    });
    await page.getByRole("button", { name: "Importuj", exact: true }).click();
    await page.goto(`/#/aplikuj/${job.slug}`);
    await page.reload();
    const form = page.locator("main form");
    const answer = page.getByLabel("Dlaczego pasujesz do tej roli?");
    await expect(answer).toHaveValue(draft.answer);
    await expect(form.getByRole("textbox")).toHaveCount(1);
    await expect(page.getByLabel("Twoje notatki do aplikacji (opcjonalnie)")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Przygotuj propozycję z AI" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Użyj propozycji" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Propozycja odpowiedzi" })).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(draft.notes);
    await expect(page.locator("main")).not.toContainText(draft.generated);
    const cvSection = form.getByRole("region", { name: "Twoje CV", exact: true });
    await expect(cvSection).toBeVisible();
    await expect(answer).toBeVisible();
    expect(
      await cvSection.evaluate((element) =>
        Boolean(
          element.compareDocumentPosition(document.querySelector("textarea")!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ),
    ).toBe(true);
    await answer.focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("checkbox")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Wyślij aplikację", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Zapisz szkic", exact: true })).toBeFocused();
    const editedAnswer = "Moja poprawiona odpowiedź opisuje doświadczenie potrzebne w tej roli.";
    await answer.fill(editedAnswer);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toHaveText("Szkic został zapisany.");
    expect(
      await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)!).drafts.at(-1),
        STORAGE_KEY,
      ),
    ).toEqual({ ...draft, answer: editedAnswer });
    await page.reload();
    await expect(answer).toHaveValue(editedAnswer);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: `artifacts/application-simplified-${width}.png`,
      fullPage: true,
    });
    await answer.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Aplikacja została wysłana.", { exact: false })).toBeVisible();
    expect(
      await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)!).applications.at(-1),
        STORAGE_KEY,
      ),
    ).toMatchObject({
      sourceNotes: draft.notes,
      generatedAnswer: draft.generated,
      answer: editedAnswer,
    });
    await page.reload();
    await page.getByRole("link", { name: job.title, exact: true }).click();
    await expect(page.locator("main")).toContainText(editedAnswer);
    await expect(page.locator("main")).not.toContainText(draft.notes);
    await expect(page.locator("main")).not.toContainText(draft.generated);
  });
}

test("legacy dark preference keeps scenario data and renders the light interface", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  const legacy = { ...initialState(), activePersonId: "candidate-anna", theme: "dark" };
  legacy.people[0].bio = "Zachowaj mój profil";
  await page.goto("/");
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: STORAGE_KEY,
    raw: JSON.stringify(legacy),
  });
  await page.reload();
  await page.goto("/#/app/profil");
  await expect(page.getByRole("textbox", { name: "O mnie", exact: true })).toHaveValue(
    "Zachowaj mój profil",
  );
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(244, 244, 240)");
  await page.getByRole("button", { name: "Zapisz profil", exact: true }).click();
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).theme, STORAGE_KEY),
  ).toBeUndefined();
});

test("Editorial offer keeps desktop conditions/actions and places them before mobile reading", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await choose(page, "Anna Kowalska");
  await page.goto("/#/oferty/ai-product-manager");
  const article = page.locator(".editorial-offer");
  const hero = article.locator("header");
  await expect(hero).toContainText(
    "Poprowadź produkt od problemu operacyjnego do mierzalnego wdrożenia AI.",
  );
  await expect(hero.getByText("Senior", { exact: true })).toBeVisible();
  const facts = article.getByRole("complementary");
  await expect(facts.getByRole("heading", { name: "Konkrety", exact: true })).toHaveCount(1);
  await expect(facts).toContainText("Wynagrodzenie");
  const description = article.locator("[data-job-description]");
  const heroBox = await hero.boundingBox();
  const descriptionBox = await description.boundingBox();
  const factsBox = await facts.boundingBox();
  expect(heroBox!.width).toBeLessThanOrEqual(1024);
  expect(factsBox!.x).toBeGreaterThan(descriptionBox!.x + descriptionBox!.width);
  const apply = article.getByRole("link", { name: "Aplikuj", exact: true });
  await expect(apply).toHaveClass(/editaurus-hero-button/);
  await expect(facts.getByRole("button", { name: "Zapisz ofertę" })).toHaveClass(
    /editaurus-secondary-button/,
  );
  await expect(article.locator(".editorial-offer-related .editorial-job-row")).toHaveCount(3);
  const applyBox = await apply.boundingBox();
  expect(applyBox!.x).toBeGreaterThan(descriptionBox!.x + descriptionBox!.width);
  await page.screenshot({ path: "artifacts/editorial-job-layout-desktop.png", fullPage: true });
  const nav = page.getByRole("navigation", { name: "Główna nawigacja" });
  await expect(nav.getByRole("link", { name: "Aplikacje", exact: true })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Profil", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await facts.boundingBox())!.y).toBeLessThan((await description.boundingBox())!.y);
  await page.screenshot({ path: "artifacts/editorial-job-layout-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await nav.getByRole("link", { name: "Dla firm", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Karolina Wiśniewska", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Anna Kowalska", exact: true })).toHaveCount(0);
});

test("restored company and public navigation keep their structure across screen sizes", async ({
  page,
}) => {
  await choose(page, "Anna Kowalska");
  await page.goto("/#/firmy/brightlabs");
  await expect(page.getByRole("heading", { name: "BrightLabs", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Otwarte role", exact: true })).toBeVisible();
  await expect(page.locator("main")).toContainText("51–200 osób");
  await expect(page.getByRole("link", { name: "Strona firmy", exact: false })).toHaveAttribute(
    "href",
    "https://example.com/brightlabs",
  );
  await page.screenshot({ path: "artifacts/original-company-layout-desktop.png", fullPage: true });
  for (const width of [320, 640, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    const nav = await page.getByRole("navigation", { name: "Główna nawigacja" }).boundingBox();
    expect(nav!.x + nav!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.goto("/#/oferty");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /AI samo się\s*nie zatrudni\./,
  );
  await expect(page.getByRole("textbox", { name: "Szukaj ofert", exact: true })).toBeVisible();
  await expect(page.locator("[data-job-page-summary]")).toHaveText("Oferty 1–6 z 6");
  await page.screenshot({ path: "artifacts/original-list-layout-desktop.png", fullPage: true });
});

test("mobile search stays visible and filter dialog restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/oferty");
  const input = page.getByRole("textbox", { name: "Szukaj ofert", exact: true });
  await expect(input).toBeVisible();
  await input.fill("Product");
  await page.getByRole("button", { name: "Szukaj", exact: true }).click();
  await expect(page).toHaveURL(/query=Product/);
  const trigger = page.getByRole("button", { name: "Filtry", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Filtry", exact: true });
  await dialog.getByRole("checkbox", { name: "Zdalnie", exact: true }).click();
  await expect(dialog.getByRole("checkbox", { name: "Zdalnie", exact: true })).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page).toHaveURL(/remote=remote/);
  await trigger.click();
  await dialog.getByRole("button", { name: /Pokaż \d+ ofert/ }).click();
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Wyczyść", exact: true }).click();
  await expect(input).toHaveValue("");
  await expect(page).toHaveURL(/#\/oferty$/);
  await page.goBack();
  await expect(input).toHaveValue("Product");
});

test("editorial listing combines workplace, sorting, pay, map and saving", async ({ page }) => {
  await choose(page, "Anna Kowalska");
  await page.goto("/#/oferty");
  const keyword = page.getByRole("textbox", { name: "Szukaj ofert" });
  await keyword.hover();
  await expect(keyword).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await keyword.fill("AI Product Manager");
  await expect(keyword).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await expect(keyword).toHaveCSS("box-shadow", "rgb(16, 46, 42) 0px -3px 0px 0px inset");
  const workplace = page.getByLabel("Miejsce pracy", { exact: true });
  await workplace.click();
  const warsaw = page.getByRole("option", { name: "Warszawa", exact: true });
  await warsaw.hover();
  await expect(warsaw).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await warsaw.click();
  await expect(workplace).toHaveValue("Warszawa");
  await expect(workplace).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await page.getByRole("button", { name: "Usuń filtr miejsca pracy" }).click();
  await expect(workplace).toHaveValue("");
  await expect(workplace).toBeFocused();
  await workplace.fill("Warsz");
  await workplace.press("Escape");
  await workplace.press("Enter");
  await expect(page).toHaveURL(/query=AI\+Product\+Manager&location=Warsz$/);
  const bookmark = page.getByRole("button", { name: "Zapisz ofertę: AI Product Manager" });
  await bookmark.click();
  await expect(bookmark).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(bookmark).toHaveAttribute("aria-pressed", "true");
  const sort = page.getByRole("combobox", { name: "Sortuj oferty" });
  await expect(sort).toHaveCSS("border-top-width", "1px");
  await expect(sort).toHaveCSS("box-shadow", "none");
  await sort.hover();
  await expect(sort).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await sort.click();
  await expect(sort).toHaveCSS("border-bottom-width", "1px");
  await expect(sort).toHaveCSS("box-shadow", "rgb(16, 46, 42) 0px -3px 0px 0px inset");
  await expect(sort).toHaveCSS("background-color", "rgb(253, 249, 239)");
  const salary = page.getByRole("option", { name: "Wynagrodzenie PLN ↓" });
  await expect(page.getByRole("option", { name: "Najnowsze" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await salary.hover();
  await expect(salary).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await expect(page.getByRole("option", { name: "Najnowsze" })).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await salary.click();
  await page.getByText("Minimalne wynagrodzenie", { exact: true }).click();
  await page.getByRole("slider").press("End");
  await expect(page.getByRole("heading", { name: "Brak ofert dla tych filtrów" })).toBeVisible();
  await expect(page.locator(".editorial-listing-empty")).toHaveCSS(
    "background-color",
    "rgb(244, 240, 229)",
  );
  await expect(page.getByRole("link", { name: "Lista", exact: true })).toHaveCSS(
    "background-color",
    "rgb(16, 61, 53)",
  );
  const map = page.getByRole("link", { name: "Mapa", exact: true });
  await map.hover();
  await expect(map).toHaveCSS("transform", "matrix(1, 0, 0, 1, -2, -2)");
  await expect(map).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await map.click();
  await expect(page).toHaveURL(/minSalary=30000&sort=salary&view=map/);
  await expect(map).toHaveCSS("background-color", "rgb(16, 61, 53)");
  await keyword.fill("Nowe wyszukiwanie");
  await page.getByRole("button", { name: "Usuń filtr miejsca pracy" }).click();
  await expect(page).not.toHaveURL(/location=/);
  await expect(page).toHaveURL(/minSalary=30000&sort=salary&view=map/);
  await expect(keyword).toHaveValue("Nowe wyszukiwanie");
  await expect(workplace).toHaveValue("");
  await expect(workplace).toBeFocused();
  const reset = page.getByRole("button", { name: "Pokaż wszystkie oferty" });
  await reset.hover();
  await page.mouse.down();
  await expect(reset).toHaveCSS("translate", "1px 1px");
  await page.mouse.up();
  await expect(page.getByRole("region", { name: "Mapa ofert w Polsce" })).toBeVisible();
});

test("desktop reset synchronizes search, category and facets with the URL", async ({ page }) => {
  await page.goto("/#/oferty");
  const input = page.getByRole("textbox", { name: "Szukaj ofert", exact: true });
  await input.fill("Product");
  await page.getByRole("button", { name: "Szukaj", exact: true }).click();
  const remoteHeading = page.getByText("Tryb pracy", { exact: true });
  await remoteHeading.hover();
  await expect(remoteHeading).toHaveCSS("text-decoration-line", "underline");
  const remoteOption = page.getByRole("checkbox", { name: "Zdalnie", exact: true });
  await remoteOption.hover();
  await expect(page.locator(".editorial-filters label").filter({ has: remoteOption })).toHaveCSS(
    "background-color",
    "rgb(16, 61, 53)",
  );
  await page.getByRole("checkbox", { name: "Zdalnie", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Zdalnie", exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Wyczyść", exact: true }).first().click();
  await expect(input).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: "Zdalnie", exact: true })).not.toBeChecked();
  await expect(page.getByRole("button", { name: /Wszystkie oferty/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("editorial listing keeps right-hand filters and offer details use shared editorial typography", async ({
  page,
}) => {
  for (const width of [1280, 1100, 850, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/oferty");
    await expect(page.locator(".editorial-listing-art img")).toBeVisible();
    const results = page.locator(".editorial-listing-results");
    const sidebar = page.getByRole("complementary", { name: "Filtry ofert" });
    if (width > 850)
      expect((await sidebar.boundingBox())!.x).toBeGreaterThan((await results.boundingBox())!.x);
    else await expect(sidebar.getByRole("button", { name: "Filtry", exact: true })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Szukaj ofert", exact: true })).toBeVisible();
    await expect(page.getByLabel("Miejsce pracy", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  for (const width of [1280, 850, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/oferty/ai-product-manager");
    await expect(page.locator(".editorial-offer-hero h1")).toHaveCSS("font-weight", "900");
    await expect(page.locator(".editorial-offer-pay .pp-salary-tag")).toHaveCSS(
      "font-weight",
      "900",
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test("offer section links survive copied URLs and restore section focus through history", async ({
  page,
  context,
}) => {
  await page.goto("/#/oferty/ai-product-manager");
  const employer = page.getByRole("link", { name: "O firmie", exact: true });
  const destination = await employer.evaluate((link) => (link as HTMLAnchorElement).href);
  expect(destination).toContain("#/oferty/ai-product-manager#employer");
  await employer.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#employer")).toBeFocused();
  await expect(page).toHaveURL(/#\/oferty\/ai-product-manager#employer$/);
  const copied = await context.newPage();
  await copied.goto(destination);
  await expect(copied.locator(".editorial-offer-hero h1")).toHaveText("AI Product Manager");
  await expect(copied.locator("#employer")).toBeFocused();
  expect((await copied.locator("#employer").boundingBox())!.y).toBeLessThan(50);
  await copied.close();
  await page.getByRole("link", { name: "O roli", exact: true }).click();
  await expect(page.locator("#role")).toBeFocused();
  await page.goBack();
  await expect(page.locator("#employer")).toBeFocused();
  await page.goForward();
  await expect(page.locator("#role")).toBeFocused();
});

for (const width of [1280, 390])
  test(`keyboard chip removal keeps a logical focus successor at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/oferty?query=Product&remote=remote");
    const remote = page.getByRole("button", { name: "Usuń filtr: remote", exact: true });
    await remote.focus();
    await page.keyboard.press("Enter");
    const query = page.getByRole("button", { name: "Usuń filtr: Product", exact: true });
    await expect(query).toBeFocused();
    await expect(page).not.toHaveURL(/remote=/);
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Znajdź swoją rolę.", exact: true }),
    ).toBeFocused();
    await expect(page.getByRole("textbox", { name: "Szukaj ofert", exact: true })).toHaveValue("");
  });

test("homepage surfaces and marketplace action type roles match the shared reference", async ({
  page,
}) => {
  await page.goto("/#/");
  const roles = page.getByRole("region", { name: "Ta sama moc. Różna robota." });
  await page.setViewportSize({ width: 1366, height: 900 });
  await roles.evaluate((element) => element.scrollIntoView());
  await expect(roles).toHaveAttribute("data-motion", "spatial");
  for (const [label, slug] of [
    ["Build", "build"],
    ["Apply", "apply"],
    ["Lead", "lead"],
    ["Build", "build"],
  ] as const) {
    const control = roles.getByRole("button", { name: label, exact: true });
    const accent = await roles
      .locator(`.scene-${slug} .role-shape`)
      .evaluate((shape) => getComputedStyle(shape).backgroundColor);
    const selected = (await control.getAttribute("aria-pressed")) === "true";
    await control.hover();
    await expect(control).toHaveCSS("background-color", selected ? "rgb(16, 46, 42)" : accent);
    await control.click();
    await expect(control).toHaveAttribute("aria-pressed", "true");
    await expect(roles.getByRole("link", { name: `Zobacz oferty ${label}` })).toHaveAttribute(
      "href",
      `#/oferty?category=${slug}`,
    );
    await expect(roles.locator(".is-current .role-art img")).toHaveAttribute(
      "style",
      /translate3d/,
    );
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(roles).not.toHaveAttribute("data-motion", "spatial");
  for (const label of ["Build", "Apply", "Lead"]) {
    const link = roles.getByRole("link", { name: `Zobacz oferty ${label}` });
    await link.hover();
    await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(link).toHaveCSS("box-shadow", /-1px.*inset/);
  }
  const build = roles.getByRole("link", { name: "Zobacz oferty Build" });
  await build.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/category=build/);
  await page.goto("/#/");
  const latest = page.getByRole("region", { name: "Najnowsze oferty" });
  await expect(latest.getByRole("article")).toHaveCount(4);
  for (const [category, accent] of [
    ["build", "rgb(242, 130, 183)"],
    ["apply", "rgb(241, 243, 106)"],
    ["lead", "rgb(169, 220, 198)"],
  ] as const) {
    const row = latest.locator(`article[data-category="${category}"]`).first();
    await row.hover();
    await expect(row).toHaveCSS("background-color", accent);
  }
  const lead = latest.locator('article[data-category="lead"]').first();
  const company = lead.getByRole("link", { name: "BrightLabs" });
  await expect(company).toHaveAttribute("href", "#/firmy/brightlabs");
  await expect(lead.getByText("Warszawa · Hybrydowo", { exact: true })).toBeVisible();
  await expect(lead.getByText("Umowa o pracę", { exact: true })).toBeVisible();
  await expect(lead.getByText("Product", { exact: true })).toBeVisible();
  await expect(lead.getByText("brutto / mies.", { exact: true })).toBeVisible();
  await expect(lead.locator("time")).toHaveAttribute("datetime", "2026-09-28T09:00:00.000Z");
  await company.click();
  await expect(page).toHaveURL(/#\/firmy\/brightlabs$/);
  await page.goto("/#/");
  await expect(latest.getByRole("link", { name: "Wszystkie oferty" })).toHaveAttribute(
    "href",
    "#/oferty",
  );
  await page.setViewportSize({ width: 320, height: 740 });
  const offer = latest.getByRole("link", { name: "AI Product Manager", exact: true });
  await latest.getByRole("link", { name: "Wszystkie oferty" }).focus();
  await page.keyboard.press("Tab");
  await expect(offer).toBeFocused();
  await expect(offer).toHaveCSS("outline-width", "3px", { pseudo: "after" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#\/oferty\/ai-product-manager$/);
  const action = page.getByRole("link", { name: "Wybierz osobę i aplikuj" });
  await expect(action).toHaveClass(/editaurus-hero-button/);
  await expect(action).toHaveAttribute("href", /next=%2Faplikuj%2Fai-product-manager/);
});

test("process sheet keeps notes across keyboard tabs and saves stage history with focus", async ({
  page,
}) => {
  await choose(page, "Karolina Wiśniewska");
  await page.goto("/#/app/kandydaci/application-example");
  const note = page.getByLabel("Notatka rekrutacyjna (widoczna pracodawcy)");
  await expect(
    page.locator(".record-meta").getByText("Match Score: 72%", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Wynik przykładowy", { exact: true })).toHaveCount(0);
  await expect(page.locator("iframe[title='Podgląd CV (PDF)']")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Pobierz CV (PDF)", exact: true })).toHaveCount(0);
  const text = "Dopytać o decyzje dotyczące automatyzacji obsługi.";
  await note.fill(text);
  const answer = page.getByRole("tab", { name: "Odpowiedź", exact: true });
  const cv = page.getByRole("tab", { name: "CV", exact: true });
  await answer.focus();
  await page.keyboard.press("ArrowRight");
  await expect(cv).toBeFocused();
  await expect(cv).toHaveAttribute("aria-selected", "true");
  const preview = page.locator("iframe[title='Podgląd CV (PDF)']");
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute("src", /^\.?\/cv\/marek-nowak-cv-v1\.pdf#view=FitH$/);
  await page.setViewportSize({ width: 390, height: 900 });
  expect(
    await preview.evaluate((element) => element.getBoundingClientRect().right <= innerWidth),
  ).toBe(true);
  await page.setViewportSize({ width: 1280, height: 1000 });
  await expect(note).toHaveValue(text);
  await expect(page.getByRole("link", { name: "Pobierz CV (PDF)", exact: true })).toHaveAttribute(
    "href",
    /^\.?\/cv\/marek-nowak-cv-v1\.pdf$/,
  );
  await page.keyboard.press("Home");
  await expect(answer).toBeFocused();
  await expect(page.getByRole("tabpanel", { name: "Odpowiedź", exact: true })).toContainText(
    "Przesłana aplikacja",
  );
  await expect(note).toHaveValue(text);
  await expect(preview).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Pobierz CV (PDF)", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "W przeglądzie", exact: true }).click();
  await expect(page.locator(".record-stage")).toBeFocused();
  await expect(note).toHaveValue("");
  await expect(page.locator(".process-timeline")).toContainText(text);
  await page.reload();
  await expect(page.locator(".process-timeline")).toContainText(text);
  await note.fill("Zakończenie przykładowego procesu.");
  await page.getByRole("button", { name: "Proces zakończony", exact: true }).click();
  await expect(page.locator(".record-stage")).toBeFocused();
  await expect(note).toHaveCount(0);
  await expect(page.locator(".record-actions")).toHaveCount(0);
  await expect(page.locator(".process-timeline li")).toHaveCount(3);
  const accessibility = await new AxeBuilder({ page }).include(".recruiting-record").analyze();
  expect(accessibility.violations).toEqual([]);
  await choose(page, "Marek Nowak");
  await page.goto("/#/app/aplikacje/application-example");
  await expect(page.getByText(text, { exact: true })).toHaveCount(0);
});

test("process sheet renders custom snapshots and long content on narrow screens", async ({
  page,
}) => {
  const state = initialState();
  state.activePersonId = "employer-brightlabs";
  const record = state.applications[0];
  record.candidateName = "Marek Nowak z bardzo długim przykładowym nazwiskiem";
  record.jobTitle =
    "Lider rozwoju produktów i automatyzacji procesów z wykorzystaniem sztucznej inteligencji";
  record.cv = "Zapisane niestandardowe CV z importu.\n" + "DoświadczenieBezSpacji".repeat(50);
  record.answer =
    "Długa polska odpowiedź z wieloma przykładami. ".repeat(60) + "DługiWyraz".repeat(60);
  await page.goto("/");
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: STORAGE_KEY,
    raw: JSON.stringify(state),
  });
  await page.reload();
  await choose(page, "Karolina Wiśniewska");
  await page.goto("/#/app/kandydaci/application-example");
  await expect(page.getByText("Zapisana treść CV", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Pobierz CV (PDF)", exact: true })).toHaveCount(0);
  await page.getByRole("tab", { name: "CV", exact: true }).click();
  await expect(page.getByText("Zapisana treść CV", { exact: true })).toBeVisible();
  await expect(page.locator("iframe[title='Podgląd CV (PDF)']")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Pobierz CV (PDF)", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tabpanel", { name: "CV", exact: true })).toContainText(record.cv);
  for (const width of [1280, 951, 950, 768, 767, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => {
        const elements = [...document.querySelectorAll(".recruiting-record, .recruiting-record *")];
        return (
          document.documentElement.scrollWidth <= innerWidth &&
          elements.every((element) => {
            const rect = element.getBoundingClientRect();
            return !rect.width || (rect.left >= -1 && rect.right <= innerWidth + 1);
          })
        );
      }),
    ).toBe(true);
  }
  await page.getByRole("tab", { name: "Odpowiedź", exact: true }).click();
  await expect(page.getByRole("tabpanel", { name: "Odpowiedź", exact: true })).toContainText(
    record.answer,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const width of [1280, 390]) {
  test(`application keeps editable draft while reading offer context at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await choose(page, "Anna Kowalska");
    await page.goto("/#/oferty/ai-product-manager");
    const gap = await page.locator(".editorial-offer-actions").evaluate((element) => {
      const [apply, save] = element.querySelectorAll("a, button");
      return save.getBoundingClientRect().top - apply.getBoundingClientRect().bottom;
    });
    expect(gap).toBeGreaterThanOrEqual(10);
    await page.getByRole("link", { name: "Aplikuj", exact: true }).click();
    const offer = page.getByRole("complementary", { name: "AI Product Manager", exact: true });
    await expect(offer).toContainText("BrightLabs");
    await expect(offer).toContainText("Hybrydowo");
    const form = page.getByRole("form", { name: "Twoja aplikacja", exact: true });
    const answer = form.getByLabel("Dlaczego pasujesz do tej roli?");
    const text = "Prowadziłam badania i wdrożenie automatyzacji obsługi zgłoszeń w produkcie B2B.";
    await answer.fill(text);
    await form.getByRole("checkbox").check();
    const description = offer.locator("summary");
    await description.focus();
    await page.keyboard.press("Enter");
    await expect(offer.locator("[data-job-description]")).toBeVisible();
    await expect(answer).toHaveValue(text);
    await expect(form.getByRole("checkbox")).toBeChecked();
    await page.keyboard.press("Enter");
    await expect(offer.locator("[data-job-description]")).toBeHidden();
    await expect(form.getByRole("region", { name: "Twoje CV", exact: true })).toContainText(
      "CV z Twojego profilu",
    );
    await expect(form.getByRole("link", { name: "Pobierz CV (PDF)", exact: true })).toHaveAttribute(
      "href",
      /^\.?\/cv\/anna-kowalska-cv-v1\.pdf$/,
    );
    await form.getByRole("button", { name: "Zapisz szkic", exact: true }).click();
    await page.reload();
    await expect(answer).toHaveValue(text);
    await expect(form.getByRole("checkbox")).not.toBeChecked();
    const accessibility = await new AxeBuilder({ page }).include(".application-page").analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test("editaurus application form keeps focus and hero states within the pilot surface", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await choose(page, "Anna Kowalska");
  await page.goto("/#/aplikuj/ai-product-manager");
  const form = page.getByRole("form", { name: "Twoja aplikacja", exact: true });
  const answer = form.getByLabel("Dlaczego pasujesz do tej roli?");
  const send = form.getByRole("button", { name: "Wyślij aplikację", exact: true });

  await answer.click();
  expect(
    await answer.evaluate((element) => ({
      shadow: getComputedStyle(element).boxShadow,
      radius: getComputedStyle(element).borderRadius,
      family: getComputedStyle(element).fontFamily,
    })),
  ).toEqual({
    shadow: "rgb(16, 46, 42) 0px -3px 0px 0px inset",
    radius: "0px",
    family: '"DM Sans", Arial, sans-serif',
  });
  await expect(page.locator(".application-offer")).toHaveCSS("border-radius", "24px");

  await send.hover();
  const first = await send.evaluate((element) => [
    element.style.getPropertyValue("--ed-shadow-first"),
    element.style.getPropertyValue("--ed-shadow-last"),
  ]);
  await page.getByRole("heading", { name: "Aplikuj na ofertę" }).hover();
  await send.hover();
  const second = await send.evaluate((element) => [
    element.style.getPropertyValue("--ed-shadow-first"),
    element.style.getPropertyValue("--ed-shadow-last"),
  ]);
  expect(second).not.toEqual(first);
  await expect(send).toHaveCSS("background-color", "rgb(16, 61, 53)");
  await expect(send).toHaveCSS("box-shadow", /rgb\(16, 61, 53\)/);

  await page.emulateMedia({ forcedColors: "active" });
  await answer.focus();
  await expect(answer).toHaveCSS("outline-style", "solid");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("editaurus hero action preview reuses the application component", async ({ page }) => {
  await choose(page, "Anna Kowalska");
  await page.goto("/#/design-system/editaurus");
  await expect(page.getByRole("heading", { name: "Główna akcja" })).toBeVisible();
  const active = page.getByRole("button", { name: "Wyślij aplikację", exact: true });
  await expect(active).toHaveCSS("font-family", '"DM Sans", Arial, sans-serif');
  await expect(active).toHaveCSS("text-align", "center");
  await expect(active).not.toContainText("↗");
  await expect(page.getByRole("button", { name: "Wysłano!" })).toBeDisabled();
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const longButtonFits = await page
      .getByRole("button", { name: "Zatwierdź i wyślij aplikację" })
      .evaluate((element) => {
        const card = element.closest(".editaurus-catalog-card");
        return Boolean(
          card && element.getBoundingClientRect().right <= card.getBoundingClientRect().right,
        );
      });
    expect(longButtonFits).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await active.hover();
  await expect(active).toHaveCSS("box-shadow", /rgb\(16, 61, 53\)/);
  await page.getByRole("link", { name: /Sprawdź komponenty w formularzu/ }).click();
  await expect(page).toHaveURL(/#\/aplikuj\/ai-product-manager$/);
  await expect(page.getByRole("form", { name: "Twoja aplikacja" })).toBeVisible();
});

test("editaurus hero action keeps its initial accent pair on touch", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/#/design-system/editaurus");
    const active = page.getByRole("button", { name: "Wyślij aplikację", exact: true });
    await active.tap();
    expect(
      await active.evaluate((element) => [
        element.style.getPropertyValue("--ed-shadow-first"),
        element.style.getPropertyValue("--ed-shadow-last"),
      ]),
    ).toEqual(["", ""]);
  } finally {
    await context.close();
  }
});

test("editaurus preview links to an unsubmitted application for the current candidate", async ({
  page,
}) => {
  await application(page);
  await page.goto("/#/design-system/editaurus");
  await page.getByRole("link", { name: /Sprawdź komponenty w formularzu/ }).click();
  await expect(page).not.toHaveURL(/#\/aplikuj\/ai-product-manager$/);
  await expect(page.getByRole("form", { name: "Twoja aplikacja" })).toBeVisible();
});

test("editaurus preview returns to the job chooser after selecting a candidate", async ({
  page,
}) => {
  await page.goto("/#/design-system/editaurus");
  await page.getByRole("link", { name: "Wybierz kandydata, aby sprawdzić formularz ↗" }).click();
  await expect(page).toHaveURL(/audience=candidate&next=\/design-system\/editaurus/);
  await page.getByRole("button", { name: "Wejdź jako Anna Kowalska" }).click();
  await expect(page).toHaveURL(/#\/design-system\/editaurus$/);
  await page
    .getByRole("link", { name: /Sprawdź komponenty w formularzu: AI Product Manager/ })
    .click();
  await expect(page.getByRole("form", { name: "Twoja aplikacja" })).toBeVisible();
});

test("editaurus secondary action shares the real draft control and state examples", async ({
  page,
}) => {
  await page.goto("/#/design-system/editaurus");
  const cards = page.locator(".editaurus-catalog-card");
  const active = cards.nth(3).getByRole("button", { name: "Zapisz szkic" });
  await expect(active).toHaveCSS("border-radius", "4px");
  await expect(active).toHaveCSS("background-color", "rgb(244, 240, 229)");
  await expect(cards.nth(4).getByRole("button", { name: "Zapisz szkic" })).toBeDisabled();
  await active.hover();
  await expect(active).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await expect(active).toHaveCSS("transform", "matrix(1, 0, 0, 1, -3, -3)");
  await expect(active).toHaveCSS("box-shadow", "rgb(16, 61, 53) 4px 4px 0px 0px");
  await page.mouse.down();
  await expect(active).toHaveCSS("transform", "matrix(1, 0, 0, 1, -1, -1)");
  await expect(active).toHaveCSS("box-shadow", "rgb(16, 61, 53) 2px 2px 0px 0px");
  await page.mouse.up();
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const fits = await cards
      .nth(5)
      .getByRole("button", { name: "Zapisz odpowiedź jako szkic" })
      .evaluate((element) => {
        const card = element.closest(".editaurus-catalog-card");
        return Boolean(
          card && element.getBoundingClientRect().right <= card.getBoundingClientRect().right,
        );
      });
    expect(fits).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.emulateMedia({ forcedColors: "active" });
  await active.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(active).toBeFocused();
  await expect(active).toHaveCSS("outline-style", "solid");
  await choose(page, "Anna Kowalska");
  await page.goto("/#/aplikuj/ai-product-manager");
  const draft = page.getByRole("form", { name: "Twoja aplikacja" }).getByRole("button", {
    name: "Zapisz szkic",
  });
  await expect(draft).toHaveClass(/editaurus-secondary-button/);
});

test("editaurus answer field shows the same focus and error states as the real form", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/design-system/editaurus");
  const answer = page.locator("#ed-answer-default");
  await expect(page.locator(".editaurus-field-option")).toHaveCount(0);
  await expect(answer).toHaveCSS("background-color", "rgb(244, 240, 229)");
  await answer.hover();
  await expect(answer).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await answer.fill("Prowadziłam badania i wdrożenia produktów AI.");
  await answer.focus();
  await expect(answer).toHaveCSS("box-shadow", "rgb(16, 46, 42) 0px -3px 0px 0px inset");
  const invalid = page.locator("#ed-answer-error");
  await expect(invalid).toHaveAttribute("aria-invalid", "true");
  await expect(invalid).toHaveCSS("border-color", "rgb(137, 39, 70)");
  await expect(invalid).toHaveCSS("background-color", "rgb(249, 233, 217)");
  await invalid.hover();
  await expect(invalid).toHaveCSS("background-color", "rgb(250, 241, 221)");
  await invalid.focus();
  await expect(invalid).toHaveCSS("background-color", "rgb(250, 241, 221)");
  await expect(invalid).toHaveCSS("box-shadow", "rgb(137, 39, 70) 0px -3px 0px 0px inset");
  await expect(page.locator("#ed-answer-disabled")).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ forcedColors: "active" });
  await answer.focus();
  await expect(answer).toHaveCSS("outline-style", "solid");

  await page.emulateMedia({ forcedColors: "none" });
  await choose(page, "Anna Kowalska");
  await page.goto("/#/aplikuj/ai-product-manager");
  const realAnswer = page.getByLabel("Dlaczego pasujesz do tej roli?");
  await expect(realAnswer).toHaveClass(/editaurus-textarea/);
  await expect(realAnswer).toHaveCSS("background-color", "rgb(244, 240, 229)");
  await realAnswer.hover();
  await expect(realAnswer).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await realAnswer.focus();
  await expect(realAnswer).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await page.getByRole("button", { name: "Wyślij aplikację", exact: true }).click();
  await expect(realAnswer).toBeFocused();
  await expect(realAnswer).toHaveCSS("background-color", "rgb(250, 241, 221)");
  await expect(realAnswer).toHaveCSS("box-shadow", "rgb(137, 39, 70) 0px -3px 0px 0px inset");
});

test("editaurus consent preview matches the real form's required state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/design-system/editaurus");
  const preview = page
    .getByRole("checkbox", { name: "Zatwierdzam treść i przesłanie aplikacji." })
    .first();
  await expect(preview).toHaveCSS("background-color", "rgb(244, 240, 229)");
  await page
    .locator(".editaurus-catalog-consent")
    .first()
    .locator(":scope > span:last-child")
    .hover();
  await expect(preview).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await preview.focus();
  await page.keyboard.press("Space");
  await expect(preview).toBeChecked();
  await expect(preview).toHaveCSS("border-color", "rgb(16, 61, 53)");
  await expect(preview).toHaveCSS("background-color", "rgb(16, 61, 53)");
  const invalid = page
    .getByRole("checkbox", { name: "Zatwierdzam treść i przesłanie aplikacji." })
    .nth(1);
  await expect(invalid).toHaveCSS("border-color", "rgb(137, 39, 70)");
  await expect(invalid).toHaveCSS("background-color", "rgb(249, 239, 217)");
  await page
    .locator(".editaurus-catalog-consent")
    .nth(1)
    .locator(":scope > span:last-child")
    .hover();
  await expect(invalid).toHaveCSS("background-color", "rgb(250, 241, 221)");
  await invalid.focus();
  await expect(invalid).toHaveCSS("outline-color", "rgb(137, 39, 70)");
  await expect(invalid).toHaveCSS("background-color", "rgb(250, 241, 221)");
  const disabled = page
    .getByRole("checkbox", { name: "Zatwierdzam treść i przesłanie aplikacji." })
    .nth(2);
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveCSS("border-color", "rgb(16, 61, 53)");
  await expect(disabled).toHaveCSS("background-color", "rgb(16, 61, 53)");
  await page
    .locator(".editaurus-catalog-consent")
    .nth(2)
    .locator(":scope > span:last-child")
    .hover();
  await expect(disabled).toHaveCSS("border-color", "rgb(27, 81, 72)");
  await expect(disabled).toHaveCSS("background-color", "rgb(27, 81, 72)");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await choose(page, "Anna Kowalska");
  await page.goto("/#/aplikuj/ai-product-manager");
  const consent = page.getByRole("checkbox", { name: "Zatwierdzam treść i przesłanie aplikacji" });
  await expect(consent).toHaveClass(/editaurus-checkbox/);
  await page.locator(".application-consent > span:last-child").hover();
  await expect(consent).toHaveCSS("background-color", "rgb(253, 249, 239)");
  await page
    .getByLabel("Dlaczego pasujesz do tej roli?")
    .fill("Moje doświadczenie pasuje do odpowiedzialności opisanej w tej ofercie.");
  await page.getByRole("button", { name: "Wyślij aplikację", exact: true }).click();
  await expect(consent).toBeFocused();
  await expect(consent).toHaveCSS("border-color", "rgb(137, 39, 70)");
  await expect(consent).toHaveCSS("background-color", "rgb(250, 241, 221)");
});

test("editaurus CV row reuses local PDF and preserves custom text", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/design-system/editaurus");
  const prepared = page.getByRole("article").filter({ hasText: "Przygotowany PDF" });
  await expect(prepared).toContainText("anna-kowalska-cv-v1.pdf");
  await expect(
    prepared.getByRole("link", { name: "Pobierz CV (PDF)", exact: true }),
  ).toHaveAttribute("href", /^\.?\/cv\/anna-kowalska-cv-v1\.pdf$/);
  const openLink = prepared.getByRole("link", { name: /Otwórz CV \(PDF\)/ });
  const downloadLink = prepared.getByRole("link", { name: "Pobierz CV (PDF)", exact: true });
  for (const link of [openLink, downloadLink]) {
    await link.hover();
    await expect(link).toHaveCSS("transform", "matrix(1, 0, 0, 1, -2, -2)");
    await expect(link).toHaveCSS("box-shadow", "rgb(16, 61, 53) 3px 3px 0px 0px");
    await expect(link).toHaveCSS("background-color", "rgb(253, 249, 239)");
    await page.mouse.down();
    await expect(link).toHaveCSS("transform", "matrix(1, 0, 0, 1, -1, -1)");
    await expect(link).toHaveCSS("box-shadow", "rgb(16, 61, 53) 1px 1px 0px 0px");
    await page.mouse.up();
  }
  await downloadLink.focus();
  await expect(downloadLink).toHaveCSS("transform", "matrix(1, 0, 0, 1, -2, -2)");
  await expect(prepared.locator(".cv-file-row > svg")).toHaveCSS(
    "background-color",
    "rgb(16, 61, 53)",
  );
  const custom = page.getByRole("article").filter({ hasText: "Własna treść CV" });
  await expect(custom).toContainText("Dodatkowy akapit zachowuje podział wierszy.");
  await expect(custom.locator(".cv-text")).toHaveCSS("white-space", "pre-wrap");
  expect(await custom.locator(".cv-text").textContent()).toContain("\nDodatkowy akapit");
  await expect(custom.getByRole("link", { name: "Pobierz CV (PDF)" })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await choose(page, "Anna Kowalska");
  await page.goto("/#/aplikuj/ai-product-manager");
  const form = page.getByRole("form", { name: "Twoja aplikacja" });
  await expect(form.getByRole("region", { name: "Twoje CV" })).toContainText(
    "CV z Twojego profilu",
  );
  await expect(form.locator(".cv-file-row > svg")).toHaveCSS("background-color", "rgb(16, 61, 53)");
  await form.getByRole("link", { name: "Pobierz CV (PDF)", exact: true }).hover();
  await expect(form.getByRole("link", { name: "Pobierz CV (PDF)", exact: true })).toHaveCSS(
    "box-shadow",
    "rgb(16, 61, 53) 3px 3px 0px 0px",
  );
});

test("editaurus form feedback mirrors real validation and draft states", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/design-system/editaurus");
  await expect(page.locator(".editaurus-form-help").first()).toContainText("Minimum 20 znaków");
  await expect(page.locator(".editaurus-form-error").first()).toHaveCSS(
    "border-left-color",
    "rgb(137, 39, 70)",
  );
  await expect(page.locator(".editaurus-form-status").first()).toHaveCSS(
    "background-color",
    "rgb(253, 249, 239)",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await choose(page, "Anna Kowalska");
  await page.goto("/#/aplikuj/ai-product-manager");
  const answer = page.getByLabel("Dlaczego pasujesz do tej roli?");
  const form = page.getByRole("form", { name: "Twoja aplikacja" });
  await expect(form.locator("#application-answer-help")).toHaveClass(/editaurus-form-help/);
  await answer.fill("Za krótko");
  await form.getByRole("button", { name: "Wyślij aplikację" }).click();
  await expect(form.locator("#application-answer-help")).toHaveClass(/editaurus-form-error/);
  await expect(answer).toBeFocused();
  await answer.fill("Prowadziłam badania użytkowników i wdrożenie produktu z zespołem.");
  await form.getByRole("button", { name: "Zapisz szkic" }).click();
  await expect(form.getByRole("status")).toContainText("Szkic został zapisany.");
  await expect(form.getByRole("status")).toHaveClass(/editaurus-form-status/);
  await form.getByRole("button", { name: "Wyślij aplikację" }).click();
  await expect(form.locator("#application-consent-error")).toHaveClass(/editaurus-form-error/);
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`submission celebrates only once after success with motion ${reducedMotion}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await choose(page, "Anna Kowalska");
    await page.goto("/#/aplikuj/ai-product-manager");
    const answer = page.getByLabel("Dlaczego pasujesz do tej roli?");
    await answer.fill("krótko");
    await page.getByRole("button", { name: "Wyślij aplikację", exact: true }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Odpowiedź jest za krótka" }),
    ).toContainText("Odpowiedź jest za krótka");
    await expect(page.locator(".confetti-burst")).toHaveCount(0);
    await answer.fill(
      "Prowadziłam badania użytkowników i wdrożenie automatyzacji procesu obsługi.",
    );
    await page.getByRole("button", { name: "Zapisz szkic", exact: true }).click();
    await expect(page.locator(".confetti-burst")).toHaveCount(0);
    await page.getByRole("checkbox").check();
    await page.clock.install({ time: new Date("2026-11-03T10:00:00Z") });
    await page.clock.pauseAt(new Date("2026-11-03T10:00:01Z"));
    await page.getByRole("button", { name: "Wyślij aplikację", exact: true }).click();
    await expect(page.getByRole("button", { name: "Wysłano!", exact: true })).toBeDisabled();
    await expect(answer).toBeDisabled();
    if (reducedMotion === "no-preference") {
      await expect(page.locator(".confetti-burst")).toHaveAttribute("aria-hidden", "true");
      expect(
        await page
          .locator(".confetti-burst")
          .evaluate((element) => getComputedStyle(element).pointerEvents),
      ).toBe("none");
      await expect(page.locator(".confetti-burst span")).toHaveCount(30);
    } else {
      await expect(page.locator(".confetti-burst")).toHaveCount(0);
    }
    await page.locator("form").dispatchEvent("submit");
    expect(
      await page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key)!).applications.filter(
            (item: { candidateId: string }) => item.candidateId === "candidate-anna",
          ).length,
        STORAGE_KEY,
      ),
    ).toBe(1);
    await page.clock.fastForward(reducedMotion === "reduce" ? 1 : 1000);
    await expect(page).toHaveURL(/#\/app\/aplikacje\?wyslano=1$/);
    await expect(page.locator(".confetti-burst")).toHaveCount(0);
    await page.reload();
    await expect(page.locator(".confetti-burst")).toHaveCount(0);
    await page.goto("/#/aplikuj/ai-product-manager");
    await expect(
      page.getByText("Aplikacja na tę ofertę została już wysłana.", { exact: true }),
    ).toBeVisible();
    await expect(page.locator(".confetti-burst")).toHaveCount(0);
  });
}

test("candidate record shares snapshot tabs while excluding employer notes and managing withdrawal focus", async ({
  page,
}) => {
  const state = initialState();
  state.activePersonId = "candidate-marek";
  const record = state.applications[0];
  record.stage = "reviewed";
  record.events.push({
    stage: "reviewed",
    at: "2026-11-02T10:00:00.000Z",
    note: "Notatka wyłącznie dla pracodawcy.",
  });
  record.sourceNotes = "Dawna prywatna notatka źródłowa.";
  record.generatedAnswer = "Dawna propozycja, która nie jest zatwierdzoną odpowiedzią.";
  await page.goto("/");
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: STORAGE_KEY,
    raw: JSON.stringify(state),
  });
  await page.goto("/#/app/aplikacje/application-example");
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: record.jobTitle, exact: true }),
  ).toBeVisible();
  await expect(page.locator(".record-meta")).toContainText("Match Score: 72%");
  await expect(page.locator("main")).not.toContainText(record.events[1].note);
  await expect(page.locator("main")).not.toContainText(record.sourceNotes);
  await expect(page.locator("main")).not.toContainText(record.generatedAnswer);
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Pobierz CV (PDF)", exact: true })).toHaveCount(0);
  await page.getByRole("tab", { name: "Odpowiedź", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "CV", exact: true })).toBeFocused();
  await expect(page.locator("iframe[title='Podgląd CV (PDF)']")).toHaveAttribute(
    "src",
    /^\.?\/cv\/marek-nowak-cv-v1\.pdf#view=FitH$/,
  );
  await expect(page.locator("main")).not.toContainText(record.events[1].note);
  await page.keyboard.press("Home");
  await expect(page.getByRole("tabpanel", { name: "Odpowiedź", exact: true })).toContainText(
    record.answer,
  );
  const trigger = page.getByRole("button", { name: "Wycofaj aplikację", exact: true });
  const confirm = page.getByRole("button", { name: "Potwierdź wycofanie", exact: true });
  await trigger.click();
  await expect(confirm).toBeFocused();
  await page.getByRole("button", { name: "Anuluj", exact: true }).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await confirm.click();
  await expect(page.locator(".record-stage")).toHaveText("Wycofana");
  await expect(page.locator(".record-stage")).toBeFocused();
  await expect(trigger).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("Aplikacja została wycofana.");
  const accessibility = await new AxeBuilder({ page }).include(".recruiting-record").analyze();
  expect(accessibility.violations).toEqual([]);
  await page.reload();
  await expect(page.locator(".record-stage")).toHaveText("Wycofana");
  await expect(trigger).toHaveCount(0);
  await choose(page, "Anna Kowalska");
  await page.goto("/#/app/aplikacje/application-example");
  await expect(
    page.getByRole("heading", { name: "Nie znaleziono strony", exact: true }),
  ).toBeVisible();
});

test("candidate snapshot supports custom CV and long content at desktop and mobile widths", async ({
  page,
}) => {
  const state = initialState();
  state.activePersonId = "candidate-marek";
  const record = state.applications[0];
  record.jobTitle =
    "Starszy lider rozwoju produktów i automatyzacji z wykorzystaniem sztucznej inteligencji";
  record.cv = "Niestandardowa zapisana treść CV.\n" + "DoświadczenieBezSpacji".repeat(70);
  record.answer = "Opis realizowanych projektów i podejmowanych decyzji. ".repeat(40);
  await page.goto("/");
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: STORAGE_KEY,
    raw: JSON.stringify(state),
  });
  await page.goto("/#/app/aplikacje/application-example");
  await page.reload();
  await page.getByRole("tab", { name: "CV", exact: true }).click();
  await expect(page.getByRole("tabpanel", { name: "CV", exact: true })).toContainText(record.cv);
  await expect(page.locator("iframe[title='Podgląd CV (PDF)']")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Pobierz CV (PDF)", exact: true })).toHaveCount(0);
  for (const width of [1280, 1100, 951, 950, 600, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.getByRole("tab", { name: "Odpowiedź", exact: true }).click();
  await expect(page.getByRole("tabpanel", { name: "Odpowiedź", exact: true })).toContainText(
    record.answer,
  );
});
