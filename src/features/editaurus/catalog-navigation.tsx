import { useEffect } from "react";
import { Link, useLocation } from "react-router";

const groups: ReadonlyArray<readonly [string, ReadonlyArray<readonly [string, string]>]> = [
  ["Fundamenty", [["ed-foundations", "Kolory, typografia i powierzchnie"]]],
  [
    "Komponenty",
    [
      ["ed-primary", "Główna akcja"],
      ["ed-secondary", "Akcja drugorzędna"],
      ["ed-actions-title", "Linki i pozostałe akcje"],
      ["ed-inputs-title", "Pola profilu i oferty"],
      ["ed-answer", "Pole odpowiedzi"],
      ["ed-consent", "Zgoda"],
      ["ed-cv", "CV"],
      ["ed-feedback", "Komunikaty formularza"],
    ],
  ],
  [
    "Wzorce",
    [
      ["ed-choices-title", "Wybory i dialogi"],
      ["ed-listing-filters-title", "Filtry ofert"],
      ["ed-messages", "Puste stany i odzyskiwanie"],
      ["ed-domain-title", "Oferty, metadane i historia"],
    ],
  ],
] as const;

export function CatalogNavigation() {
  const { hash } = useLocation();
  const selected = groups.flatMap(([, items]) => items).find(([id]) => hash === `#${id}`)?.[0];
  useEffect(() => {
    if (!selected) return;
    const heading = document.getElementById(selected);
    heading?.setAttribute("tabindex", "-1");
    let scrollFrame = 0;
    const frame = requestAnimationFrame(() => {
      scrollFrame = requestAnimationFrame(() => {
        heading?.scrollIntoView({ block: "start" });
        heading?.focus({ preventScroll: true });
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
    };
  }, [selected]);
  return (
    <nav className="editaurus-catalog-nav" aria-label="Spis treści Editaurusa">
      <p className="editaurus-catalog-eyebrow">Spis treści</p>
      {groups.map(([label, items]) => (
        <div key={label}>
          <p className="font-bold">{label}</p>
          <ul>
            {items.map(([id, title]) => (
              <li key={id}>
                <Link
                  to={{ pathname: "/design-system/editaurus", hash: `#${id}` }}
                  aria-current={selected === id ? "location" : undefined}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function CatalogFoundations() {
  return (
    <section aria-labelledby="ed-foundations">
      <h2 id="ed-foundations">Fundamenty Editaurusa</h2>
      <p>
        Przegląd zasad już używanych w aplikacji. Katalog pokazuje istniejące komponenty i wzorce;
        nie jest listą funkcji do zbudowania.
      </p>
      <div className="editaurus-catalog-grid">
        <article className="editaurus-catalog-card">
          <h3>Kolory i ich role</h3>
          <ul className="editaurus-palette">
            {[
              ["ink", "Tekst i kontury"],
              ["green", "Główna akcja"],
              ["paper", "Tło strony"],
              ["paper-light", "Panele"],
              ["pink", "Akcent różowy"],
              ["yellow", "Akcent żółty"],
              ["mint", "Akcent miętowy"],
            ].map(([token, label]) => (
              <li key={token}>
                <span aria-hidden="true" style={{ background: `var(--ed-${token})` }} />
                {label}
              </li>
            ))}
          </ul>
        </article>
        <article className="editaurus-catalog-card">
          <h3>Typografia</h3>
          <p>DM Sans prowadzi interfejs, nagłówki, pola i metadane.</p>
          <p style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic" }}>
            Fraunces dodaje redakcyjny akcent.
          </p>
          <p>
            Landing ma własną, istniejącą kompozycję marketingową. Nie zmienia zasad formularzy.
          </p>
        </article>
        <article className="editaurus-catalog-card">
          <h3>Powierzchnie i stany</h3>
          <p>
            Papierowe tło, jaśniejszy panel, cienki kontur i narożniki 4 px. Powtarzane wiersze
            rozdzielają linie.
          </p>
          <p>
            Fokus pozostaje widoczny. Błąd ma tekst i powiązanie z polem; nie polega wyłącznie na
            kolorze. Stan nieaktywny i potwierdzenie wykonania to różne sytuacje.
          </p>
          <p>Przykłady niżej pokazują konkretne zasady i ich zastosowania.</p>
        </article>
      </div>
    </section>
  );
}
