import { Link } from "react-router";
import {
  contractLabels,
  functionLabels,
  remoteLabels,
  seniorityLabels,
} from "@/features/jobs/presentation";

export function ListingFiltersGuide() {
  return (
    <section aria-labelledby="ed-listing-filters-title" className="mt-8">
      <h2 id="ed-listing-filters-title">Filtry ofert z listingu</h2>
      <p>
        Filtry zawężają te same wyniki na liście i mapie. Poniżej opisujemy rzeczywiste kontrolki;
        linki otwierają listing z wybranym stanem.
      </p>
      <div className="editaurus-catalog-grid">
        <article className="editaurus-catalog-card">
          <h3>Grupy wyboru</h3>
          <p>
            W każdej grupie można wybrać jeden warunek. Zaznaczenie innego zastępuje poprzedni, a
            ponowne kliknięcie zaznaczonego usuwa warunek. Warunki różnych grup działają łącznie.
          </p>
          <dl>
            {(
              [
                ["Tryb pracy", remoteLabels],
                ["Doświadczenie", seniorityLabels],
                ["Forma współpracy", contractLabels],
                ["Funkcja", functionLabels],
              ] as const
            ).map(([label, values]) => (
              <div key={label} className="mb-3">
                <dt className="font-bold">{label}</dt>
                <dd>{Object.values(values).join(" · ")}</dd>
              </div>
            ))}
          </dl>
          <p>
            Nagłówek rozwija i zwija grupę. Tryb pracy jest początkowo rozwinięty. Pole pokazuje
            zaznaczenie, a fokus klawiatury pozostaje widoczny. W wysokim kontraście używamy
            natywnego checkboxa.
          </p>
        </article>
        <article className="editaurus-catalog-card">
          <h3>Minimalne wynagrodzenie</h3>
          <p>
            Suwak od 0 do 30 000 zł, co 1 000 zł. Zero oznacza „Bez limitu”. Warunek porównuje dolną
            granicę widełek w PLN miesięcznie; kwotę roczną dzieli przez 12. Przy aktywnym limicie
            oferty bez kwoty lub w EUR nie przechodzą filtra. Nie przeliczamy walut ani kwot netto
            na brutto.
          </p>
          <p>Klawiatura: strzałki zmieniają wartość. Etykieta i bieżąca kwota opisują suwak.</p>
        </article>
        <article className="editaurus-catalog-card">
          <h3>Kategoria i wyszukiwanie</h3>
          <p>
            Wszystkie oferty / Build / Apply / Lead wybierają jedną kategorię. Szukaj ofert sprawdza
            tytuł, podsumowanie i nazwę firmy. Miejsce pracy wyszukuje miasto lub region w
            lokalizacjach oferty. Wpisaną frazę zatwierdza przycisk „Szukaj”.
          </p>
          <p>Wyszukiwarka pozostaje poza panelem filtrów również na telefonie.</p>
        </article>
        <article className="editaurus-catalog-card">
          <h3>Aktywne warunki i reset</h3>
          <p>
            Wybrane warunki pojawiają się jako usuwalne etykiety nad wynikami. Usunięcie jednej
            zachowuje pozostałe i przekazuje fokus do sąsiedniej etykiety lub nagłówka wyników.
            „Wyczyść” usuwa filtry, wyszukiwanie i sortowanie, zachowując widok mapy, jeśli był
            aktywny. Brak wyników pozwala zmienić warunki lub je wyczyścić.
          </p>
        </article>
        <article className="editaurus-catalog-card">
          <h3>Sortowanie, adres i wyniki</h3>
          <p>
            Najnowsze zachowuje kolejność listingu; pozostałe opcje porządkują po tytule A–Z lub
            wynagrodzeniu malejąco. Sortowanie nie jest filtrem. Zmiana warunku wraca na pierwszą
            stronę wyników. Adres zapisuje zatwierdzone wybory: można go skopiować oraz używać
            przycisków Wstecz i Dalej przeglądarki.
          </p>
        </article>
        <article className="editaurus-catalog-card">
          <h3>Panel na telefonie</h3>
          <p>
            Do 850 px włącznie filtry otwiera przycisk w dialogu; powyżej są obok wyników. Zmiany
            działają od razu. „Pokaż … ofert”, zamknięcie i Escape zamykają panel, zachowując wybory
            i przywracając fokus do przycisku filtrów. To nie jest formularz z osobnym
            zatwierdzeniem zmian.
          </p>
        </article>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link className="editaurus-catalog-link" to="/oferty?remote=remote">
          Sprawdź filtr pracy zdalnej
        </Link>
        <Link className="editaurus-catalog-link" to="/oferty?view=map&minSalary=15000">
          Sprawdź wynagrodzenie na mapie
        </Link>
        <Link className="editaurus-catalog-link" to="/oferty?query=nieistniejaca-oferta">
          Sprawdź brak wyników i reset
        </Link>
      </div>
    </section>
  );
}
