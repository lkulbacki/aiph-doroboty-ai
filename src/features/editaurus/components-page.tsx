import { DomainPreview } from "./domain-preview";
import { ChoicesPreview } from "./choices-preview";
import { useState } from "react";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { HeroButton, HeroLink } from "@/components/editaurus/hero-button";
import { SecondaryButton } from "@/components/editaurus/secondary-button";
import { EditaurusTextarea } from "@/components/editaurus/textarea";
import { EditaurusCheckbox } from "@/components/editaurus/checkbox";
import { CvAttachment } from "@/features/prototype/cv-attachment";
import people from "@/features/prototype/data/people.json" with { type: "json" };
import { currentPerson, publishedJobs } from "@/features/prototype/model";
import { usePrototype } from "@/features/prototype/store";

export function EditaurusComponentsPage() {
  const [previewConsent, setPreviewConsent] = useState(false);
  const [actionPreview, setActionPreview] = useState("");
  const { state } = usePrototype();
  const person = currentPerson(state);
  const jobs = publishedJobs(state);
  const canApply = (jobId: string) =>
    !state.applications.some(
      (application) => application.jobId === jobId && application.candidateId === person?.id,
    );
  const availableJob =
    person?.role === "candidate"
      ? (jobs.find((job) => job.slug === "ai-product-manager" && canApply(job.id)) ??
        jobs.find((job) => canApply(job.id)))
      : null;
  return (
    <section className="editaurus-surface editaurus-catalog" aria-labelledby="editaurus-title">
      <p className="editaurus-catalog-eyebrow">editaurus / akcje i formularz</p>
      <h1 id="editaurus-title">Akcje i komponenty formularza</h1>
      <p>
        Te same przyciski, pole odpowiedzi, zgoda, CV i komunikaty działają w formularzu
        aplikowania. Tutaj możesz obejrzeć ich stany; przykłady na tej stronie nie zapisują danych.
      </p>
      <h2>Główna akcja</h2>
      <div className="editaurus-catalog-grid">
        <article className="editaurus-catalog-card">
          <div>
            <h2>Aktywny</h2>
            <p>Najedź wskaźnikiem, przejdź do przycisku klawiszem Tab i przytrzymaj go.</p>
          </div>
          <HeroButton type="button">Wyślij aplikację</HeroButton>
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Nieaktywny</h2>
            <p>Stan po wysłaniu. Przycisk nie reaguje na naciśnięcie ani nie przyjmuje fokusu.</p>
          </div>
          <HeroButton type="button" disabled>
            <CheckCircle2 aria-hidden="true" />
            Wysłano!
          </HeroButton>
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Dłuższa etykieta</h2>
            <p>Treść ma pozostać czytelna i nie może wypchnąć układu na wąskim ekranie.</p>
          </div>
          <HeroButton type="button">Zatwierdź i wyślij aplikację</HeroButton>
        </article>
      </div>
      <h2>Akcja drugorzędna</h2>
      <p>„Zapisz szkic” zachowuje odpowiedź bez wysyłania aplikacji.</p>
      <div className="editaurus-catalog-grid">
        <article className="editaurus-catalog-card">
          <div>
            <h2>Aktywny szkic</h2>
            <p>Najedź wskaźnikiem, sprawdź fokus klawiatury i naciśnięcie.</p>
          </div>
          <SecondaryButton type="button">Zapisz szkic</SecondaryButton>
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Nieaktywny szkic</h2>
            <p>Po wysłaniu aplikacji nie można już zapisać tego formularza jako szkicu.</p>
          </div>
          <SecondaryButton type="button" disabled>
            Zapisz szkic
          </SecondaryButton>
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Dłuższa etykieta szkicu</h2>
            <p>Tekst zawija się w granicach przycisku na wąskim ekranie.</p>
          </div>
          <SecondaryButton type="button">Zapisz odpowiedź jako szkic</SecondaryButton>
        </article>
      </div>
      <section aria-labelledby="ed-actions-title">
        <h2 id="ed-actions-title">Nawigacja i pozostałe akcje</h2>
        <p>
          Linki prowadzą do rzeczywistych ekranów. Przykładowa akcja niebezpieczna zmienia tylko
          komunikat poniżej — nie resetuje danych. „Wysłano!” oznacza zakończoną czynność;
          niedostępna publikacja ma inny wygląd i wyjaśnienie.
        </p>
        <div className="editaurus-catalog-grid">
          <article className="editaurus-catalog-card">
            <h2>Główna nawigacja</h2>
            <p>Ten sam link co w przeglądzie konta. Enter otwiera oferty.</p>
            <HeroLink to="/oferty">Przeglądaj wszystkie dostępne oferty pracy</HeroLink>
          </article>
          <article className="editaurus-catalog-card editaurus-job-editor">
            <h2>Niedostępna publikacja</h2>
            <p id="ed-publish-unavailable">Najpierw zatwierdź opis oferty.</p>
            <HeroButton type="button" disabled aria-describedby="ed-publish-unavailable">
              Opublikuj ofertę
            </HeroButton>
          </article>
          <article className="editaurus-catalog-card">
            <h2>Akcja niebezpieczna</h2>
            <p>Receptura przycisku z ustawień. To bezpieczny podgląd bez resetowania.</p>
            <SecondaryButton
              type="button"
              className="editaurus-danger-button"
              onClick={() => setActionPreview("Podgląd: dane scenariusza pozostają bez zmian.")}
            >
              Sprawdź wygląd akcji resetowania
            </SecondaryButton>
          </article>
          <article className="editaurus-catalog-card editorial-offer">
            <h2>Cichy link</h2>
            <p>Tekstowy link używany przy ofertach i firmach, bez dominującego wypełnienia.</p>
            <Link className="editorial-offer-text-link" to="/oferty">
              Wszystkie oferty
            </Link>
          </article>
          <article className="editaurus-catalog-card editaurus-record">
            <h2>Powrót do kontekstu</h2>
            <p>Ten sam BackLink co w ofercie, formularzu i historii aplikacji.</p>
            <BackLink to="/oferty">Wróć do ofert</BackLink>
          </article>
        </div>
        <p role="status" className="editaurus-form-status" hidden={!actionPreview}>
          {actionPreview}
        </p>
      </section>
      <section aria-labelledby="ed-inputs-title">
        <h2 id="ed-inputs-title">Pola profilu i oferty</h2>
        <p>Te same pola co w profilu i edytorze oferty. Przykłady nie zapisują danych.</p>
        <div className="editaurus-catalog-grid">
          <article className="editaurus-catalog-card">
            <div className="editaurus-catalog-field">
              <label htmlFor="ed-input-default">Nagłówek zawodowy</label>
              <Input
                id="ed-input-default"
                className="editaurus-input"
                defaultValue="Projektantka produktów AI"
              />
            </div>
          </article>
          <article className="editaurus-catalog-card">
            <div className="editaurus-catalog-field">
              <label htmlFor="ed-input-invalid">Tytuł oferty — błąd</label>
              <Input
                id="ed-input-invalid"
                className="editaurus-input"
                aria-invalid="true"
                aria-describedby="ed-input-error"
              />
              <p id="ed-input-error" data-error>
                Wpisz tytuł oferty.
              </p>
            </div>
          </article>
          <article className="editaurus-catalog-card">
            <div className="editaurus-catalog-field">
              <label htmlFor="ed-input-disabled">Pole nieaktywne</label>
              <Input
                id="ed-input-disabled"
                className="editaurus-input"
                disabled
                defaultValue="Zachowana treść"
              />
            </div>
          </article>
        </div>
      </section>
      <h2>Pole odpowiedzi</h2>
      <p>
        Pole wielowierszowe używa wybranego tła #FDF9EF od hover przez fokus i tej samej dolnej
        linii co formularz kandydata.
      </p>
      <div className="editaurus-catalog-grid">
        <article className="editaurus-catalog-card">
          <div>
            <h2>Spoczynek i fokus</h2>
            <p>Kliknij w pole lub przejdź do niego klawiszem Tab.</p>
          </div>
          <div className="editaurus-catalog-field">
            <label htmlFor="ed-answer-default">Odpowiedź kandydata</label>
            <EditaurusTextarea id="ed-answer-default" aria-describedby="ed-answer-default-help" />
            <p id="ed-answer-default-help">Napisz, dlaczego pasujesz do tej roli.</p>
          </div>
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Błąd</h2>
            <p>Niepoprawna odpowiedź zachowuje treść i powiązany komunikat.</p>
          </div>
          <div className="editaurus-catalog-field">
            <label htmlFor="ed-answer-error">Odpowiedź kandydata</label>
            <EditaurusTextarea
              id="ed-answer-error"
              aria-invalid="true"
              aria-describedby="ed-answer-error-help"
              defaultValue="Za krótka odpowiedź"
            />
            <p id="ed-answer-error-help" data-error>
              Wpisz co najmniej 20 znaków.
            </p>
          </div>
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Nieaktywne</h2>
            <p>Po wysłaniu treść pozostaje widoczna, ale nie można jej już edytować.</p>
          </div>
          <div className="editaurus-catalog-field">
            <label htmlFor="ed-answer-disabled">Odpowiedź kandydata</label>
            <EditaurusTextarea
              id="ed-answer-disabled"
              disabled
              defaultValue="Odpowiedź została wysłana."
            />
          </div>
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Dłuższa treść</h2>
            <p>Tekst zawija się i pozostaje edytowalny na wąskim ekranie.</p>
          </div>
          <div className="editaurus-catalog-field">
            <label htmlFor="ed-answer-long">Odpowiedź kandydata</label>
            <EditaurusTextarea
              id="ed-answer-long"
              defaultValue="Prowadziłam badania użytkowników, wdrożenie i ocenę automatyzacji obsługi. Współpracowałam z zespołem produktu oraz inżynierami, żeby sprawdzić rezultat po uruchomieniu rozwiązania."
            />
          </div>
        </article>
      </div>
      <h2>Zgoda na wysłanie aplikacji</h2>
      <p>
        Przykłady używają tego samego pola wyboru co formularz; kliknięcie tutaj nie wysyła
        aplikacji.
      </p>
      <div className="editaurus-catalog-grid">
        <article className="editaurus-catalog-card">
          <div>
            <h2>Do zaznaczenia</h2>
            <p>Sprawdź hover, Tab i Spację.</p>
          </div>
          <label className="editaurus-catalog-consent">
            <EditaurusCheckbox checked={previewConsent} onCheckedChange={setPreviewConsent} />
            <span>Zatwierdzam treść i przesłanie aplikacji.</span>
          </label>
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Wymagana zgoda</h2>
            <p>Po próbie wysłania bez zgody pole i fokus wskazują błąd.</p>
          </div>
          <label className="editaurus-catalog-consent">
            <EditaurusCheckbox aria-invalid="true" aria-describedby="ed-consent-error" />
            <span>Zatwierdzam treść i przesłanie aplikacji.</span>
          </label>
          <p id="ed-consent-error" data-error>
            Zatwierdź treść aplikacji i jej przesłanie pracodawcy.
          </p>
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Po wysłaniu</h2>
            <p>Zgoda pozostaje widoczna, lecz nie można jej już zmienić.</p>
          </div>
          <label className="editaurus-catalog-consent">
            <EditaurusCheckbox checked disabled />
            <span>Zatwierdzam treść i przesłanie aplikacji.</span>
          </label>
        </article>
      </div>
      <h2>CV w formularzu</h2>
      <p>
        Wiersz używa tego samego załącznika co prawdziwa aplikacja. Linki otwierają i pobierają
        lokalny przykładowy PDF.
      </p>
      <div className="editaurus-catalog-grid">
        <article className="editaurus-catalog-card">
          <div>
            <h2>Przygotowany PDF</h2>
            <p>Nazwa pliku, kontekst i dwie akcje.</p>
          </div>
          <CvAttachment
            candidateId="candidate-anna"
            fallbackText={people[0].cv}
            layout="row"
            contextLabel="CV z Twojego profilu"
          />
        </article>
        <article className="editaurus-catalog-card">
          <div>
            <h2>Własna treść CV</h2>
            <p>
              Zmieniona treść CV tej samej osoby nie może otworzyć starszego PDF. Pokazujemy pełny
              tekst.
            </p>
          </div>
          <CvAttachment
            candidateId="candidate-anna"
            fallbackText={
              "Przykładowe CV — doświadczenie w badaniach użytkowników i wdrażaniu produktów.\nDodatkowy akapit zachowuje podział wierszy."
            }
            layout="row"
            contextLabel="CV z Twojego profilu"
          />
        </article>
      </div>
      <h2>Komunikaty formularza</h2>
      <p>
        Ten sam zestaw pokazuje wskazówkę, błąd walidacji i potwierdzenie zapisu szkicu w prawdziwym
        formularzu.
      </p>
      <div className="editaurus-catalog-grid">
        <article className="editaurus-catalog-card">
          <h2>Wskazówka</h2>
          <p className="editaurus-form-help">Minimum 20 znaków. Obecnie: 0.</p>
        </article>
        <article className="editaurus-catalog-card">
          <h2>Błąd</h2>
          <p className="editaurus-form-error" role="alert">
            Odpowiedź jest za krótka. Wpisz co najmniej 20 znaków (obecnie: 8).
          </p>
        </article>
        <article className="editaurus-catalog-card">
          <h2>Zapisany szkic</h2>
          <p className="editaurus-form-status" role="status">
            Szkic został zapisany.
          </p>
        </article>
      </div>
      <ChoicesPreview />
      <DomainPreview />
      {person?.role !== "candidate" ? (
        <Link
          className="editaurus-catalog-link"
          to="/auth/sign-in?audience=candidate&next=/design-system/editaurus"
        >
          Wybierz kandydata, aby sprawdzić formularz ↗
        </Link>
      ) : availableJob ? (
        <Link className="editaurus-catalog-link" to={`/aplikuj/${availableJob.slug}`}>
          Sprawdź komponenty w formularzu: {availableJob.title} ↗
        </Link>
      ) : (
        <p>Wszystkie dostępne oferty mają już Twoje zgłoszenie.</p>
      )}
    </section>
  );
}
