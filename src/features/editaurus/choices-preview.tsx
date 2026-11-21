import { ListingFiltersGuide } from "./listing-filters-guide";
import { useState } from "react";
import { Link } from "react-router";
import { FormSelect } from "@/components/ui/form-select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { SecondaryButton } from "@/components/editaurus/secondary-button";
import { ResponsivePanel } from "@/components/responsive-panel";
import { Empty, Notice } from "@/features/prototype/shell";

const options = [
  { value: "research", label: "Badania i odkrywanie potrzeb" },
  { value: "delivery", label: "Dostarczanie rozwiązań i współpraca z zespołem" },
];

export function ChoicesPreview() {
  const [value, setValue] = useState("research");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  return (
    <section aria-labelledby="ed-choices-title">
      <h2 id="ed-choices-title">Wybory, dialogi i odzyskiwanie</h2>
      <p>Przykłady zmieniają tylko stan podglądu. Nie importują ani nie resetują scenariusza.</p>
      <div className="editaurus-catalog-grid">
        <article className="editaurus-catalog-card">
          <h2>Wyszukiwany zamknięty wybór</h2>
          <label className="editaurus-catalog-field" htmlFor="ed-choice">
            Obszar podglądu
          </label>
          <FormSelect
            required
            describedBy="ed-choice-help"
            id="ed-choice"
            name="previewArea"
            ariaLabel="Obszar podglądu"
            searchable
            value={value}
            onValueChange={setValue}
            options={options}
          />
          <p id="ed-choice-help">
            Wybrana wartość: {value || "brak"}. Wpisanie tekstu wyszukuje, potwierdzenie wybiera
            opcję.
          </p>
        </article>
        <article className="editaurus-catalog-card">
          <h2>Zwykły wybór</h2>
          <FormSelect
            ariaLabel="Kolejność podglądu"
            defaultValue="recent"
            options={[
              { value: "recent", label: "Najnowsze" },
              { value: "az", label: "Nazwa A–Z" },
            ]}
            triggerClassName="editaurus-select-trigger"
            contentClassName="editaurus-surface editaurus-select-menu"
          />
          <FormSelect
            ariaLabel="Nieaktywny wybór"
            disabled
            defaultValue="research"
            options={options}
            triggerClassName="editaurus-select-trigger"
          />
          <Link className="editaurus-catalog-link" to="/oferty">
            Sprawdź wyszukiwanie miejsca i sortowanie ofert
          </Link>
        </article>
        <article className="editaurus-catalog-card">
          <h2>Potwierdzenie i błąd</h2>
          <p>Pierwsze potwierdzenie pokazuje błąd podglądu. Ponowne kończy przykład.</p>
          <SecondaryButton
            type="button"
            onClick={() => {
              setError("");
              setOpen(true);
            }}
          >
            Otwórz potwierdzenie podglądu
          </SecondaryButton>
        </article>
        <article className="editaurus-catalog-card">
          <h2>Filtry na małym ekranie</h2>
          <ResponsivePanel
            title="Filtry podglądu"
            description="Izolowany podgląd panelu; wyniki ofert pozostają bez zmian."
            resultCount={0}
          >
            <p>W tym przykładzie nie wybrano filtrów.</p>
          </ResponsivePanel>
          <Link className="editaurus-catalog-link" to="/oferty">
            Otwórz rzeczywiste filtry ofert
          </Link>
        </article>
      </div>
      <ListingFiltersGuide />
      <h2 id="ed-messages">Komunikaty i puste stany Editaurusa</h2>
      <p>Te same komponenty obsługują informacje i odzyskiwanie danych w aplikacji.</p>
      <Empty>
        Brak wyników podglądu.{" "}
        <Link className="editaurus-catalog-link" to="/oferty">
          Wróć do ofert i zmień filtry
        </Link>
      </Empty>
      <Notice>
        Przykład informacji o zapisie: przy problemie z pamięcią zachowaj kopię danych.{" "}
        <Link className="underline" to="/app/settings">
          Otwórz ustawienia danych
        </Link>
      </Notice>
      {message && (
        <p className="editaurus-form-status" role="status">
          {message}
        </p>
      )}
      <ConfirmDialog
        appearance="editaurus"
        open={open}
        onOpenChange={setOpen}
        pending={false}
        title="Potwierdzić przykład?"
        description="To podgląd błędu i ponowienia. Dane scenariusza pozostają bez zmian."
        error={error}
        label={error ? "Ponów podgląd" : "Potwierdź podgląd"}
        onConfirm={() => {
          if (!error)
            setError("Przykładowy błąd — zachowano otwarty dialog. Możesz ponowić lub anulować.");
          else {
            setOpen(false);
            setMessage("Podgląd zakończony. Dane pozostały bez zmian.");
          }
        }}
      />
    </section>
  );
}
