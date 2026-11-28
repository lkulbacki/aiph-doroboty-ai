import { useState, type ChangeEvent } from "react";
import { SecondaryButton } from "@/components/editaurus/secondary-button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { usePrototype } from "./store";
import { serializeState, MAX_IMPORT_BYTES } from "./storage";
import { PageTitle } from "./shell";

export function downloadText(name: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function SettingsPage() {
  const { state, reset, importState, original, recoveryMessage, clearFeedback } = usePrototype();
  const [pending, setPending] = useState<"reset" | "import" | null>(null);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState("");
  async function readFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setError("");
    if (!file) return;
    clearFeedback();
    if (file.size > MAX_IMPORT_BYTES) {
      setError("Plik jest za duży (maksymalnie 2 MB).");
      return;
    }
    try {
      setRaw(await file.text());
      setPending("import");
    } catch {
      setError("Nie udało się odczytać pliku.");
    }
  }
  function confirm() {
    if (pending === "reset") {
      reset();
    } else if (pending === "import") {
      importState(raw);
    }
    setPending(null);
  }
  return (
    <section className="editaurus-surface editaurus-applications editaurus-settings">
      <PageTitle>Ustawienia prototypu</PageTitle>
      <section className="editaurus-panel editaurus-settings-panel">
        <h2>Dane scenariusza</h2>
        <p>
          Zmiany są zapisane tylko w tej przeglądarce. Wysłanie linku innej osobie nie przenosi
          Twoich danych. Eksport pozwala przekazać scenariusz lub zachować kopię przed resetem.
        </p>
        <div className="flex flex-wrap gap-3">
          <SecondaryButton
            onClick={() => downloadText("doroboty-scenariusz.json", serializeState(state))}
          >
            Eksportuj dane
          </SecondaryButton>
          <SecondaryButton render={<label />}>
            Importuj dane
            <input
              className="sr-only"
              type="file"
              accept="application/json,.json"
              aria-label="Importuj plik scenariusza"
              onChange={readFile}
            />
          </SecondaryButton>
          {original !== null && (
            <SecondaryButton
              onClick={() =>
                downloadText("doroboty-zapis-do-odzyskania.txt", original, "text/plain")
              }
            >
              Pobierz poprzedni zapis
            </SecondaryButton>
          )}
        </div>
        <SecondaryButton
          className="editaurus-danger-button"
          onClick={() => {
            clearFeedback();
            setError("");
            setPending("reset");
          }}
        >
          Resetuj scenariusz
        </SecondaryButton>
        {error && (
          <p className="editaurus-form-error" role="alert">
            {error}
          </p>
        )}
        {recoveryMessage && (
          <p role="status" className="editaurus-form-status">
            {recoveryMessage}
          </p>
        )}
      </section>
      <section className="editaurus-panel editaurus-settings-panel mt-6">
        <h2>O prototypie</h2>
        <p>
          Wybór osoby zastępuje logowanie. Match Score pochodzi z przygotowanego scenariusza.
          OpenRouter przygotowuje propozycje pytań, transkrypcje i krótkie podsumowania odpowiedzi
          głosowych. Używaj przykładowych danych i CV.
        </p>
      </section>
      <ConfirmDialog
        appearance="editaurus"
        open={pending !== null}
        onOpenChange={(v) => {
          if (!v) setPending(null);
        }}
        title={pending === "reset" ? "Zresetować scenariusz?" : "Zastąpić dane scenariusza?"}
        description="Ta operacja zastąpi lokalne zmiany. Możesz najpierw wyeksportować dane."
        label={pending === "reset" ? "Resetuj" : "Importuj"}
        pending={false}
        onConfirm={confirm}
      />
    </section>
  );
}
export function PrivacyPage() {
  return (
    <section className="editaurus-surface editaurus-information editaurus-methodology">
      <h1>Prywatność prototypu</h1>
      <div className="editaurus-panel editaurus-information-panel mt-6">
        <p>
          Ta wersja służy do ćwiczeń i testów interfejsu. Nie wpisuj prawdziwych danych osobowych
          ani poufnych informacji.
        </p>
        <p>
          Przeglądarka przechowuje profile, zgłoszenia i ustawienia. Plik eksportu zawiera cały
          lokalny scenariusz, w tym notatki, nagrania, transkrypcje i podsumowania.
        </p>
        <p>
          Gdy poprosisz o propozycje pytań, lokalny serwer wysyła tytuł, brief i opis do OpenRouter.
          Po wysłaniu odpowiedzi głosowej OpenRouter otrzymuje nagranie do transkrypcji, a następnie
          transkrypcję do przygotowania podsumowania.
        </p>
        <p>
          Jeśli analityka jest włączona w tej wersji, PostHog otrzymuje odsłony ekranów i typy
          wykonanych akcji. Nie przesyłamy treści formularzy, CV, nagrań ani identyfikatorów
          wybranych osób. Nie nagrywamy sesji. Anonimowy identyfikator działa do odświeżenia strony;
          analityka respektuje sygnał „Do Not Track” przeglądarki.
        </p>
        <p>
          Możesz usunąć zmiany przyciskiem „Resetuj scenariusz” w ustawieniach lub wyczyścić dane
          witryny w przeglądarce. Hosting może prowadzić własne logi dostępu.
        </p>
      </div>
    </section>
  );
}
