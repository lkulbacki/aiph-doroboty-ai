import { expect, test, type Page } from "@playwright/test";

test.use({
  launchOptions: {
    args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"],
  },
});

const recruiter = "Karolina Wiśniewska";
const candidate = "Anna Kowalska";
const title = "Projektantka usług cyfrowych · EXP-01";
const question =
  "Opisz jeden wcześniejszy projekt, w którym wykorzystałeś umiejętność przydatną w tej roli. Za co odpowiadałeś osobiście i jaki był efekt Twojej pracy?";
const revisedQuestion = "Którą decyzję podjąłeś samodzielnie i jak sprawdziłeś jej efekt?";
const mainAnswer = "Prowadziłam badania użytkowników i wdrażałam usprawnienia usług cyfrowych.";
const projectAnswer =
  "W projekcie portalu biblioteki samodzielnie zaprojektowałam formularz rezerwacji i przeprowadziłam 8 testów użyteczności. Po wdrożeniu odsetek ukończonych rezerwacji wzrósł z 61% do 78%.";
const note =
  "Zapraszam na rozmowę. Kandydatka samodzielnie zaprojektowała formularz i przeprowadziła 8 testów. Na rozmowie dopytam o pomiar wzrostu z 61% do 78%.";

async function choose(page: Page, person: string) {
  await page.goto("/#/auth/sign-in");
  await page.getByRole("button", { name: `Wejdź jako ${person}`, exact: true }).click();
}

async function publish(page: Page) {
  await page.getByRole("checkbox", { name: "Zatwierdzam treść oferty do publikacji." }).check();
  await page.getByRole("button", { name: "Opublikuj ofertę", exact: true }).click();
  await expect(page).toHaveURL(/#\/app\/oferty$/);
}

function jobRow(page: Page, jobTitle: string) {
  return page.locator("article").filter({
    has: page.getByRole("heading", { name: jobTitle, exact: true }),
  });
}

async function openApplication(page: Page, offer: string) {
  await choose(page, candidate);
  await page.goto(offer);
  await page.getByRole("link", { name: "Aplikuj", exact: true }).click();
}

async function openRecruitingRecord(page: Page, person = candidate) {
  await choose(page, recruiter);
  await expect(page.getByRole("heading", { name: "Moje oferty", exact: true })).toBeVisible();
  const menu = page.getByRole("button", { name: "Otwórz menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("link", { name: "Kandydaci", exact: true }).click();
  await page.getByRole("link", { name: person, exact: true }).click();
}

test("EXP-01 with answer preserves draft, recruiting rationale and original question", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1250 });
  await choose(page, recruiter);
  await page.getByRole("link", { name: "Dodaj ofertę", exact: true }).click();
  await page.getByLabel("Nazwa stanowiska").fill(title);
  const editorQuestion = page.getByLabel("Pytanie o wkład w projekt (opcjonalnie)");
  await expect(editorQuestion).toHaveAccessibleDescription(`Przykład: „${question}”.`);
  await editorQuestion.fill(question);
  await page.getByRole("button", { name: "Zapisz szkic", exact: true }).click();

  const row = jobRow(page, title);
  await expect(row.getByRole("link", { name: "Zobacz ofertę", exact: true })).toHaveCount(0);
  await row.getByRole("link", { name: "Edytuj szkic", exact: true }).click();
  await page.reload();
  await expect(editorQuestion).toHaveValue(question);
  const editorUrl = page.url();
  await page
    .getByLabel("Krótkie podsumowanie")
    .fill("Projektowanie usług dla lokalnych instytucji.");
  await page
    .getByLabel("Opis oferty")
    .fill("Szukamy osoby do badań użytkowników, projektowania i testowania usług cyfrowych.");
  await publish(page);

  const publicLink = row.getByRole("link", { name: "Zobacz ofertę", exact: true });
  await publicLink.click();
  const offerUrl = page.url();
  await openApplication(page, offerUrl);
  const answer = page.getByLabel("Dlaczego pasujesz do tej roli?");
  const optional = page.getByRole("textbox", { name: "Odpowiedź pisemna (opcjonalnie)" });
  const projectCard = page.getByRole("region", { name: "Odpowiedź projektowa" });
  await expect(projectCard.getByText(question, { exact: true })).toBeVisible();
  await answer.fill(mainAnswer);
  await answer.press("Tab");
  await expect(projectCard.getByRole("button", { name: "Nagraj odpowiedź" })).toBeFocused();
  await projectCard.getByText("Wpisz odpowiedź", { exact: true }).press("Enter");
  await expect(optional).toHaveAccessibleDescription(/bez ujawniania poufnych informacji/);
  await optional.fill(projectAnswer);
  await page.getByRole("button", { name: "Zapisz szkic", exact: true }).click();
  await page.reload();
  await expect(answer).toHaveValue(mainAnswer);
  await expect(optional).toHaveValue(projectAnswer);
  const consent = page.getByRole("checkbox");
  await consent.check();
  await optional.fill(`${projectAnswer} `);
  await expect(consent).not.toBeChecked();
  await consent.check();
  await page.getByRole("button", { name: "Wyślij aplikację", exact: true }).click();
  await expect(page.getByText("Aplikacja została wysłana.", { exact: true })).toBeVisible();

  await openRecruitingRecord(page);
  const recordUrl = page.url();
  const answerPanel = page.getByRole("tabpanel", { name: "Odpowiedź" });
  await expect(answerPanel.getByText(question, { exact: true })).toBeVisible();
  await expect(answerPanel.getByText(projectAnswer, { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Odpowiedź" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page
      .getByRole("tabpanel", { name: "CV" })
      .getByRole("heading", { name: "CV z momentu aplikowania" }),
  ).toBeVisible();
  await expect(page.getByRole("tabpanel", { name: "CV" }).locator("iframe")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await page.getByRole("button", { name: "W przeglądzie", exact: true }).click();
  await page.getByLabel("Notatka rekrutacyjna (widoczna pracodawcy)").fill(note);
  await page.getByRole("button", { name: "Zaproszenie na rozmowę", exact: true }).click();
  await page.reload();
  await expect(page.locator(".record-stage")).toHaveText("Zaproszenie na rozmowę");
  await expect(page.getByText(note, { exact: true })).toBeVisible();

  await page.goto(editorUrl);
  const approval = page.getByRole("checkbox", { name: "Zatwierdzam treść oferty do publikacji." });
  await approval.check();
  await editorQuestion.fill(revisedQuestion);
  await expect(approval).not.toBeChecked();
  await publish(page);
  await page.goto(recordUrl);
  await expect(answerPanel.getByText(question, { exact: true })).toBeVisible();
  await expect(answerPanel.getByText(projectAnswer, { exact: true })).toBeVisible();
  await expect(answerPanel.getByText(revisedQuestion, { exact: true })).toHaveCount(0);
  await expect(page.getByText(note, { exact: true })).toBeVisible();
  await expect(page.locator(".record-stage")).toHaveText("Zaproszenie na rozmowę");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.mouse.move(1250, 100);
  await page.screenshot({
    path: "artifacts/exp-01-rekruter.png",
    animations: "disabled",
  });
});

test("EXP-01 allows skipping and keeps a published offer live while editing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const existingTitle = "AI Product Manager";
  const offer = "/#/oferty/ai-product-manager";
  await openApplication(page, offer);
  const required = page.getByLabel("Dlaczego pasujesz do tej roli?");
  await required.fill(mainAnswer);
  await page.getByRole("button", { name: "Zapisz szkic", exact: true }).click();

  await choose(page, recruiter);
  const row = jobRow(page, existingTitle);
  await row.getByRole("link", { name: existingTitle, exact: true }).click();
  const editorQuestion = page.getByLabel("Pytanie o wkład w projekt (opcjonalnie)");
  await editorQuestion.fill(question);
  await page.getByRole("button", { name: "Zapisz szkic", exact: true }).click();
  await expect(row.getByText(/Szkic zmian/)).toBeVisible();
  await expect(row.getByRole("link", { name: "Zobacz ofertę", exact: true })).toBeVisible();

  await openApplication(page, offer);
  const projectCard = page.getByRole("region", { name: "Odpowiedź projektowa" });
  await expect(projectCard).toHaveCount(0);
  await choose(page, recruiter);
  await row.getByRole("link", { name: existingTitle, exact: true }).click();
  await page.reload();
  await expect(editorQuestion).toHaveValue(question);
  await publish(page);

  await openRecruitingRecord(page, "Marek Nowak");
  await expect(projectCard).toHaveCount(0);
  await openApplication(page, offer);
  await expect(required).toHaveValue(mainAnswer);
  await expect(projectCard.getByText(question, { exact: true })).toBeVisible();
  await expect(projectCard.getByRole("button", { name: "Nagraj odpowiedź" })).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Wyślij aplikację", exact: true }).click();
  await expect(page.getByText("Aplikacja została wysłana.", { exact: true })).toBeVisible();

  await openRecruitingRecord(page);
  const panel = page.getByRole("tabpanel", { name: "Odpowiedź" });
  await expect(panel.getByText(question, { exact: true })).toBeVisible();
  await expect(
    panel.getByText("Kandydat nie odpowiedział na to pytanie", { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole("tab", { name: "CV", exact: true }).click();
  await expect(page.getByRole("tabpanel", { name: "CV" }).locator("iframe")).toBeVisible();
});

test.describe("EXP-01 voice", () => {
  test.use({
    permissions: ["microphone"],
    reducedMotion: "reduce",
  });

  test("selects an AI question and retains the recorded submission after a retry and republication", async ({
    page,
  }, testInfo) => {
    const generated = [
      "Który projekt pokazał Twoją samodzielność i jak zmierzyłeś jego efekt?",
      revisedQuestion,
      question,
    ];
    const transcript =
      "Samodzielnie zaprojektowałam formularz rezerwacji i przeprowadziłam osiem testów.";
    const summary = "Kandydatka zaprojektowała formularz rezerwacji i przeprowadziła osiem testów.";
    const brief = "Fikcyjny projekt usprawnienia rezerwacji w bibliotece.";
    const description = "Projektowanie usług cyfrowych i badanie potrzeb czytelników.";
    let voiceAttempts = 0;
    await page.route("**/api/project-ai/questions", async (route) => {
      expect(route.request().postDataJSON()).toEqual({
        title: "AI Product Manager",
        brief,
        description,
      });
      await route.fulfill({ json: { questions: generated } });
    });
    await page.route("**/api/project-ai/voice", async (route) => {
      const recording = route.request().postDataJSON();
      expect(recording.format).toBe("webm");
      expect(recording.data).toMatch(/^GkXf/);
      voiceAttempts++;
      if (voiceAttempts === 1) {
        await route.fulfill({
          status: 502,
          json: { error: "Nie udało się przetworzyć nagrania." },
        });
        return;
      }
      await route.fulfill({ json: { transcript, summary } });
    });

    await page.setViewportSize({ width: 1440, height: 1000 });
    await choose(page, recruiter);
    await jobRow(page, "AI Product Manager")
      .getByRole("link", { name: "AI Product Manager" })
      .click();
    const editorUrl = page.url();
    const editorCard = page.getByRole("region", { name: "Pytanie o wkład w projekt" });
    const briefField = page.getByLabel("Brief — kogo szukasz i do jakiego zadania?");
    const descriptionField = page.getByLabel("Opis oferty");
    await briefField.fill(brief);
    await descriptionField.fill(description);
    const proposalButton = editorCard.getByRole("button", { name: "Zaproponuj pytania z AI" });
    await proposalButton.click();
    await expect(editorCard.getByRole("radio")).toHaveCount(3);
    await descriptionField.fill(`${description} Nowy kontekst.`);
    await expect(editorCard.getByRole("radio")).toHaveCount(0);
    await descriptionField.fill(description);
    await expect(editorCard.getByRole("radio")).toHaveCount(0);
    await proposalButton.click();
    const first = editorCard.getByRole("radio", { name: generated[0], exact: true });
    await first.focus();
    await first.press("ArrowDown");
    await expect(editorCard.getByRole("radio", { name: revisedQuestion })).toBeChecked();
    const approval = page.getByRole("checkbox", {
      name: "Zatwierdzam treść oferty do publikacji.",
    });
    await approval.check();
    const questionField = editorCard.getByRole("textbox", {
      name: "Pytanie o wkład w projekt (opcjonalnie)",
    });
    await editorCard.getByRole("button", { name: "Użyj wybranego" }).click();
    await expect(questionField).toBeFocused();
    await expect(questionField).toHaveValue(revisedQuestion);
    await expect(approval).not.toBeChecked();
    await publish(page);

    await page.setViewportSize({ width: 390, height: 844 });
    await openApplication(page, "/#/oferty/ai-product-manager");
    const candidateCard = page.getByRole("region", { name: "Odpowiedź projektowa" });
    await expect(candidateCard.getByText(revisedQuestion, { exact: true })).toBeVisible();
    const recordButton = candidateCard.getByRole("button", { name: "Nagraj odpowiedź" });
    await recordButton.press("Enter");
    await expect(candidateCard.getByRole("timer")).toHaveText("0:01 / 1:00");
    await candidateCard.getByRole("button", { name: "Zakończ nagrywanie" }).press("Enter");
    const recordedAudio = candidateCard.locator("audio");
    await expect(recordedAudio).toHaveJSProperty("readyState", 4);
    const firstRecording = await recordedAudio.getAttribute("src");
    await candidateCard.getByRole("button", { name: "Usuń nagranie" }).click();
    await expect(recordedAudio).toHaveCount(0);
    await recordButton.click();
    await expect(candidateCard.getByRole("timer")).toHaveText("0:02 / 1:00");
    await candidateCard.getByRole("button", { name: "Zakończ nagrywanie" }).click();
    await expect(recordedAudio).toHaveJSProperty("readyState", 4);
    const recording = await recordedAudio.getAttribute("src");
    expect(recording).not.toBe(firstRecording);
    await page.getByLabel("Dlaczego pasujesz do tej roli?").fill(mainAnswer);
    await page.getByRole("button", { name: "Zapisz szkic", exact: true }).click();
    await expect(page.getByText("Szkic został zapisany.")).toBeVisible();
    expect(voiceAttempts).toBe(0);
    await page.reload();
    await expect(recordedAudio).toHaveAttribute("src", recording!);
    await recordedAudio.evaluate((audio: HTMLAudioElement) => audio.play());
    await expect
      .poll(() => recordedAudio.evaluate((audio: HTMLAudioElement) => audio.currentTime))
      .toBeGreaterThan(0);
    const consent = page.getByRole("checkbox");
    await expect(consent).toHaveAccessibleDescription(/nagranie trafi do OpenRouter/);
    await consent.check();
    const send = page.getByRole("button", { name: "Wyślij aplikację", exact: true });
    await send.click();
    await expect(page.getByRole("alert")).toHaveText("Nie udało się przetworzyć nagrania.");
    await expect(recordedAudio).toHaveAttribute("src", recording!);
    await send.click();
    await expect(page.getByText("Aplikacja została wysłana.", { exact: true })).toBeVisible();
    expect(voiceAttempts).toBe(2);

    await openRecruitingRecord(page);
    const recordUrl = page.url();
    await page.goto(editorUrl);
    await questionField.fill(question);
    await publish(page);
    await page.goto(recordUrl);
    await page.reload();
    const recruiterCard = page.getByRole("region", { name: "Odpowiedź projektowa" });
    await expect(recruiterCard.getByText(revisedQuestion, { exact: true })).toBeVisible();
    await expect(recruiterCard.getByText(question, { exact: true })).toHaveCount(0);
    await expect(recruiterCard.getByText(transcript, { exact: true })).toBeVisible();
    await expect(recruiterCard.getByText(summary, { exact: true })).toBeVisible();
    await expect(recruiterCard.locator("audio")).toHaveAttribute("src", recording!);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    await recruiterCard.screenshot({
      path: testInfo.outputPath("odpowiedz-projektowa-mobile.png"),
    });

    await page.getByRole("tab", { name: "CV" }).click();
    await expect(page.getByRole("tabpanel", { name: "CV" }).locator("iframe")).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole("tab", { name: "Odpowiedź" }).click();
    await recruiterCard.screenshot({
      path: testInfo.outputPath("odpowiedz-projektowa-desktop.png"),
    });
  });
});
