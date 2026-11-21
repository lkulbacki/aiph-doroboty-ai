import { Autocomplete } from "@base-ui/react/autocomplete";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Users, MapPin, BriefcaseBusiness, Bookmark } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Monitor, X } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { ResponsivePanel } from "@/components/responsive-panel";
import { SalaryFact } from "@/features/jobs/salary-fact";
import { functionLabels } from "@/features/jobs/presentation";
import { HeroLink } from "@/components/editaurus/hero-button";
import { SecondaryButton } from "@/components/editaurus/secondary-button";
import { CompanyLogo } from "@/features/jobs/company-logo";
import { JobCard } from "@/features/jobs/job-card";
import { JobFiltersForm } from "@/features/jobs/job-filters";
import { JobPagination } from "@/features/jobs/job-pagination";
import { JobDescription } from "@/features/jobs/job-description";
import { filterJobs, parseJobFilters, sortJobs } from "@/features/jobs/filters";
import { paginateJobs, jobListingHref } from "@/features/jobs/pagination";
import {
  categoryLabels,
  remoteLabels,
  seniorityLabels,
  contractLabels,
} from "@/features/jobs/presentation";
import type { JobWithCompany } from "@/features/jobs/types";
import { usePrototype } from "./store";
import { currentPerson, publishedJobs } from "./model";
import { NotFound } from "./shell";
import centaurBuild from "@/features/editaurus/assets/centaur-build.webp";
import centaurApply from "@/features/editaurus/assets/centaur-apply.webp";
import centaurLead from "@/features/editaurus/assets/centaur-lead.webp";
import centaurHero from "@/features/editaurus/assets/centaur-hero.webp";
import { cn } from "@/lib/utils";

function LocalMap({ jobs }: { jobs: JobWithCompany[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const job = jobs.find((x) => x.id === selected);
  const located = jobs.filter((x) => x.coordinates);
  const locationKey = (x: JobWithCompany) => x.locations[0].trim().toLocaleLowerCase("pl");
  const markers = located.filter(
    (x, index) => located.findIndex((other) => locationKey(other) === locationKey(x)) === index,
  );
  const locationCount = (x: JobWithCompany) =>
    located.filter((other) => locationKey(other) === locationKey(x)).length;
  return (
    <div className="prototype-map-layout">
      <div className="prototype-map" role="region" aria-label="Mapa ofert w Polsce">
        <svg viewBox="0 0 600 520" aria-hidden="true">
          <path
            d="M140 45 220 65 320 40 375 60 440 50 505 150 480 240 520 335 440 420 355 435 310 480 230 435 150 445 90 350 70 260 95 160Z"
            fill="var(--gui-surface-muted)"
            stroke="var(--gui-edge)"
            strokeWidth="2"
          />
        </svg>
        {markers.map((x) => (
          <Button
            key={x.id}
            className="prototype-map-pin"
            size="icon-sm"
            variant={selected === x.id ? "default" : "outline"}
            style={{
              left: `${((x.coordinates!.longitude - 14) / 11) * 80 + 10}%`,
              top: `${((55 - x.coordinates!.latitude) / 6) * 80 + 10}%`,
            }}
            aria-label={`${x.locations.join(" / ")}: ${locationCount(x)} ofert`}
            aria-pressed={selected === x.id}
            onClick={() => setSelected(x.id)}
          >
            {locationCount(x) > 1 ? locationCount(x) : <MapPin />}
          </Button>
        ))}
      </div>
      <div className="editaurus-panel editorial-map-panel">
        {job ? (
          <>
            <h2>{job.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Oferty w tej lokalizacji: {locationCount(job)}
            </p>
            <p className="my-3">
              {job.company.name} · {job.locations.join(" / ")}
            </p>
            <Link to={`/oferty/${job.slug}`} className={buttonVariants({ variant: "outline" })}>
              Zobacz rolę
            </Link>
          </>
        ) : (
          <p>Wybierz znacznik, aby zobaczyć ofertę.</p>
        )}
        <ul className="mt-5 space-y-3">
          {jobs.map((x) => (
            <li key={x.id}>
              <Link className="text-[var(--gui-link)] underline" to={`/oferty/${x.slug}`}>
                {x.title} · {x.company.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
const listingSortOptions = {
  new: "Najnowsze",
  salary: "Wynagrodzenie PLN ↓",
  az: "Nazwa A–Z",
};

const listingCentaurs = [centaurHero, centaurBuild, centaurApply, centaurLead];
const listingArtAccents = ["mint", "pink", "yellow"];

export function JobsPage() {
  const { state } = usePrototype();
  const person = currentPerson(state);
  const [params, setParams] = useSearchParams();
  const filters = parseJobFilters(Object.fromEntries(params));
  const [centaur] = useState(
    () => listingCentaurs[Math.floor(Math.random() * listingCentaurs.length)],
  );
  const [artAccent] = useState(
    () => listingArtAccents[Math.floor(Math.random() * listingArtAccents.length)],
  );
  const workplaceInput = useRef<HTMLInputElement>(null);
  const pendingWorkplaceFocus = useRef(false);
  const chipButtons = useRef(new Map<string, HTMLButtonElement>());
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const pendingChipFocus = useRef<string | null>(null);
  useEffect(() => {
    if (pendingWorkplaceFocus.current) {
      workplaceInput.current?.focus();
      pendingWorkplaceFocus.current = false;
    }
    const target = pendingChipFocus.current;
    if (!target) return;
    (chipButtons.current.get(target) ?? resultsHeading.current)?.focus();
    pendingChipFocus.current = null;
  }, [params]);
  const all = publishedJobs(state);
  const jobs = sortJobs(filterJobs(all, filters), filters.sort);
  const pagination = paginateJobs(jobs, filters.page);
  const view = params.get("view") === "map" ? "map" : "list";
  const savedIds =
    person?.role === "candidate"
      ? new Set(state.saved.filter((x) => x.candidateId === person.id).map((x) => x.jobId))
      : undefined;
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => key !== "page" && key !== "sort" && value,
  );
  function change(key: string, value: string) {
    const next = new URLSearchParams(params);
    next.delete("page");
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }
  function removeFilter(key: string) {
    const keys = activeFilters.map(([name]) => name);
    const index = keys.indexOf(key);
    pendingChipFocus.current = keys[index + 1] ?? keys[index - 1] ?? "results";
    change(key, "");
  }
  function reset() {
    setParams(view === "map" ? { view: "map" } : {});
  }
  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = new URLSearchParams(params);
    next.delete("page");
    for (const key of ["query", "location"]) {
      const value = String(data.get(key) ?? "").trim();
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next);
  }
  const locations = [...new Set(all.flatMap((x) => x.locations))];
  return (
    <div className="editaurus-surface editorial-listing">
      <div className="editorial-listing-container">
        <section className="editorial-listing-hero" aria-labelledby="listing-title">
          <div>
            <p className="editorial-listing-kicker">Praca w świecie AI</p>
            <h1 id="listing-title">
              AI samo się
              <br />
              <em>nie zatrudni.</em>
            </h1>
            <p>
              Znajdź pracę, w której budujesz AI, wdrażasz je w codzienną pracę lub prowadzisz
              zmianę.
            </p>
          </div>
          <div className="editorial-listing-art" data-accent={artAccent} aria-hidden="true">
            <img src={centaur} alt="" width={1122} height={1402} />
          </div>
        </section>
        <div className="editorial-listing-tools">
          <form className="editorial-listing-search" aria-label="Wyszukaj ofertę" onSubmit={search}>
            <label>
              <span>Szukaj ofert</span>
              <input
                key={filters.query ?? ""}
                name="query"
                maxLength={100}
                defaultValue={filters.query ?? ""}
                placeholder="Stanowisko, firma lub słowo kluczowe"
              />
            </label>
            <div className="editorial-workplace">
              <Autocomplete.Root
                key={filters.location ?? ""}
                items={locations}
                defaultValue={filters.location ?? ""}
                name="location"
                openOnInputClick
              >
                <label>
                  <span>Miejsce pracy</span>
                  <Autocomplete.Input
                    ref={workplaceInput}
                    aria-label="Miejsce pracy"
                    onFocus={(event) => event.currentTarget.select()}
                    onClick={(event) => {
                      if (event.currentTarget.value === filters.location)
                        event.currentTarget.select();
                    }}
                    onKeyDown={(event) => {
                      if (
                        (event.key === "Backspace" || event.key === "Delete") &&
                        filters.location &&
                        event.currentTarget.value === filters.location
                      ) {
                        event.preventDefault();
                        pendingWorkplaceFocus.current = true;
                        change("location", "");
                      }
                    }}
                    maxLength={80}
                    placeholder="Miasto lub region"
                  />
                </label>
                <Autocomplete.Portal>
                  <Autocomplete.Positioner sideOffset={8} className="editorial-location-positioner">
                    <Autocomplete.Popup className="editaurus-surface editorial-picker-menu">
                      <Autocomplete.Empty className="editorial-location-empty">
                        Brak podpowiedzi
                      </Autocomplete.Empty>
                      <Autocomplete.List>
                        {(location: string) => (
                          <Autocomplete.Item
                            key={location}
                            value={location}
                            className="editorial-location-option"
                          >
                            {location}
                          </Autocomplete.Item>
                        )}
                      </Autocomplete.List>
                    </Autocomplete.Popup>
                  </Autocomplete.Positioner>
                </Autocomplete.Portal>
                <Autocomplete.Clear
                  tabIndex={0}
                  className="editorial-workplace-clear"
                  aria-label="Usuń filtr miejsca pracy"
                  onClick={() => {
                    if (!filters.location) return;
                    pendingWorkplaceFocus.current = true;
                    change("location", "");
                  }}
                >
                  <X size={17} aria-hidden="true" />
                </Autocomplete.Clear>
              </Autocomplete.Root>
            </div>
            <Button
              type="submit"
              size="icon"
              className="editorial-listing-submit"
              aria-label="Szukaj"
            >
              <Search aria-hidden="true" />
            </Button>
          </form>
          <div className="editorial-listing-sort">
            <span id="editorial-sort-label">Sortuj oferty</span>
            <Select
              items={listingSortOptions}
              value={filters.sort ?? "new"}
              onValueChange={(value) => change("sort", !value || value === "new" ? "" : value)}
            >
              <SelectTrigger
                aria-labelledby="editorial-sort-label"
                className="editorial-sort-trigger"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                sideOffset={8}
                align="start"
                alignItemWithTrigger={false}
                className="editaurus-surface editorial-picker-menu"
              >
                {Object.entries(listingSortOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <section className="editorial-listing-board" aria-label="Oferty i filtry">
          <aside className="editorial-listing-sidebar" aria-label="Filtry ofert">
            <ResponsivePanel
              title="Filtry"
              description="Wyniki zmieniają się od razu. W każdej grupie wybierz jeden warunek."
              resultCount={jobs.length}
            >
              <JobFiltersForm filters={filters} onChange={change} onReset={reset} />
            </ResponsivePanel>
          </aside>
          <div className="editorial-listing-results">
            <div className="editorial-results-heading">
              <div>
                <h2 ref={resultsHeading} tabIndex={-1}>
                  Znajdź swoją <em>rolę.</em>
                </h2>
                <p role="status">
                  Liczba ofert: <strong>{jobs.length}</strong>
                </p>
              </div>
              <nav className="editorial-listing-view" aria-label="Widok ofert">
                <Link
                  className="editaurus-cv-action"
                  aria-current={view === "list" ? "page" : undefined}
                  to={jobListingHref(filters, pagination.page)}
                >
                  Lista
                </Link>
                <Link
                  className="editaurus-cv-action"
                  aria-current={view === "map" ? "page" : undefined}
                  to={jobListingHref(filters, 1, "map")}
                >
                  Mapa
                </Link>
              </nav>
            </div>
            <div className="editorial-category-tabs" role="group" aria-label="Kategorie ofert">
              {(
                [
                  ["", "Wszystkie oferty"],
                  ["build", "Build"],
                  ["apply", "Apply"],
                  ["lead", "Lead"],
                ] as const
              ).map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  data-category={key}
                  aria-pressed={(filters.category ?? "") === key}
                  onClick={() => change("category", key)}
                >
                  {label}{" "}
                  <span>{filterJobs(all, { ...filters, category: key || undefined }).length}</span>
                </button>
              ))}
            </div>
            {activeFilters.length > 0 && (
              <div className="pp-active-filters">
                {activeFilters.map(([key, value]) => {
                  const label = key === "minSalary" ? `Od ${value} zł/mies.` : String(value);
                  return (
                    <button
                      className="pp-filter-chip"
                      key={key}
                      aria-label={`Usuń filtr: ${label}`}
                      ref={(element) => {
                        if (element) chipButtons.current.set(key, element);
                        else chipButtons.current.delete(key);
                      }}
                      onClick={() => removeFilter(key)}
                    >
                      {label} <X className="pp-icon" />
                    </button>
                  );
                })}
                <button className="pp-text-button" onClick={reset}>
                  Wyczyść
                </button>
              </div>
            )}
            {jobs.length ? (
              view === "map" ? (
                <LocalMap jobs={jobs} />
              ) : (
                <>
                  <div>
                    {pagination.items.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        saved={savedIds?.has(job.id)}
                        variant="editorial"
                      />
                    ))}
                  </div>
                  <JobPagination pagination={pagination} filters={filters} />
                </>
              )
            ) : (
              <div className="editorial-listing-empty">
                <h3>Brak ofert dla tych filtrów</h3>
                <p>Wyczyść część kryteriów i spróbuj ponownie.</p>
                <Button onClick={reset}>Pokaż wszystkie oferty</Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export function JobPage() {
  const { slug } = useParams();
  const location = useLocation();
  useEffect(() => {
    const target =
      location.hash === "#role" ? "role" : location.hash === "#employer" ? "employer" : null;
    if (!target) return;
    // Run after the shell's route focus handling, including direct deep links.
    const frame = requestAnimationFrame(() => {
      const section = document.getElementById(target);
      section?.focus({ preventScroll: true });
      section?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.key, slug]);
  const { state, run } = usePrototype();
  const person = currentPerson(state);
  const job = publishedJobs(state).find((x) => x.slug === slug);
  if (!job) return <NotFound />;
  const saved = state.saved.some((x) => x.candidateId === person?.id && x.jobId === job.id);
  const submitted = state.applications.find(
    (x) => x.candidateId === person?.id && x.jobId === job.id,
  );
  const related = publishedJobs(state)
    .filter((x) => x.id !== job.id)
    .sort((a, b) => Number(b.category === job.category) - Number(a.category === job.category))
    .slice(0, 3);
  return (
    <article className="editaurus-surface editorial-offer" data-category={job.category}>
      <div className="editorial-offer-inner">
        <nav className="editorial-offer-breadcrumb" aria-label="Powrót do ofert">
          <BackLink to="/oferty">Wróć do ofert</BackLink>
          <span>{job.company.name}</span>
        </nav>
        <div className="editorial-offer-grid">
          <header className="editorial-offer-hero">
            <div className="editorial-offer-identity">
              <CompanyLogo company={job.company} />
              <div>
                <Link className="editorial-offer-company-link" to={`/firmy/${job.company.slug}`}>
                  {job.company.name}
                  <ArrowUpRight className="pp-icon" />
                </Link>
                <p className="editorial-offer-date">
                  Opublikowano {new Intl.DateTimeFormat("pl-PL").format(new Date(job.publishedAt))}
                </p>
              </div>
              <span className="editorial-job-category">{categoryLabels[job.category]}</span>
            </div>
            <h1>{job.title}</h1>
            <div className="editorial-offer-key-facts">
              <span>
                <MapPin className="pp-icon" />
                {job.locations.join(" / ")}
              </span>
              <span>
                <Monitor className="pp-icon" />
                {remoteLabels[job.remoteStatus]}
              </span>
              <span>
                <BriefcaseBusiness className="pp-icon" />
                {seniorityLabels[job.seniority]}
              </span>
            </div>
            <div className="editorial-offer-skill-row">
              <span>{functionLabels[job.function]}</span>
            </div>
            <div className="editorial-offer-hero-bottom">
              <span>{job.summary}</span>
            </div>
          </header>
          <aside className="editaurus-panel editorial-offer-sidebar">
            <div className="editorial-offer-pay">
              <p className="editorial-offer-eyebrow">Wynagrodzenie</p>
              <SalaryFact job={job} showContract={false} />
            </div>
            <h2 className="sr-only">Konkrety</h2>
            <dl className="editorial-offer-terms">
              {[
                ["Forma współpracy", contractLabels[job.contract]],
                ["Tryb pracy", remoteLabels[job.remoteStatus]],
                ["Lokalizacja", job.locations.join(" / ")],
                ["Doświadczenie", seniorityLabels[job.seniority]],
              ].map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="editorial-offer-actions">
              {person?.role === "candidate" ? (
                <>
                  <HeroLink
                    to={submitted ? `/app/aplikacje/${submitted.id}` : `/aplikuj/${job.slug}`}
                  >
                    {submitted ? "Zobacz swoją aplikację" : "Aplikuj"}
                  </HeroLink>
                  <SecondaryButton
                    aria-label="Zapisz ofertę"
                    aria-pressed={saved}
                    onClick={() => run({ type: "toggle_saved", jobId: job.id })}
                  >
                    <Bookmark className={cn(saved && "fill-current")} />
                    Zapisz ofertę
                  </SecondaryButton>
                </>
              ) : !person ? (
                <HeroLink
                  to={`/auth/sign-in?audience=candidate&next=${encodeURIComponent(`/aplikuj/${job.slug}`)}`}
                >
                  Wybierz osobę i aplikuj
                </HeroLink>
              ) : (
                <p>Aplikacje są dostępne z profilu kandydata.</p>
              )}
              <p>Prototyp: aplikacja zostaje w tym przeglądarkowym scenariuszu.</p>
            </div>
          </aside>
          <div className="editorial-offer-description">
            <nav className="editorial-offer-section-nav" aria-label="Sekcje oferty">
              <Link
                aria-current={location.hash !== "#employer" ? "location" : undefined}
                to={{ pathname: `/oferty/${job.slug}`, hash: "#role" }}
              >
                O roli
              </Link>
              <Link
                aria-current={location.hash === "#employer" ? "location" : undefined}
                to={{ pathname: `/oferty/${job.slug}`, hash: "#employer" }}
              >
                O firmie
              </Link>
            </nav>
            <section id="role" tabIndex={-1} className="editorial-offer-section">
              <h2>O roli</h2>
              <JobDescription description={job.description} />
            </section>
          </div>
          <section className="editorial-offer-employer" id="employer" tabIndex={-1}>
            <div className="editorial-offer-company-top">
              <CompanyLogo company={job.company} />
              <div>
                <p className="editorial-offer-eyebrow">Poznaj firmę</p>
                <h2>{job.company.name}</h2>
              </div>
            </div>
            <div className="editorial-offer-company-copy">
              <p>{job.company.description}</p>
              <Link className="editorial-offer-text-link" to={`/firmy/${job.company.slug}`}>
                Oferty tej firmy
              </Link>
            </div>
          </section>
        </div>
        {related.length > 0 && (
          <section className="editorial-offer-related">
            <div className="editorial-offer-related-heading">
              <h2>Może też Cię zainteresować</h2>
              <Link className="editorial-offer-text-link" to="/oferty">
                Wszystkie oferty
              </Link>
            </div>
            <div>
              {related.map((x) => (
                <JobCard key={x.id} job={x} variant="editorial" />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

export function CompanyPage() {
  const { slug } = useParams();
  const { state } = usePrototype();
  const person = currentPerson(state);
  const company = state.companies.find((x) => x.slug === slug);
  if (!company) return <NotFound />;
  const jobs = publishedJobs(state).filter((x) => x.companyId === company.id);
  return (
    <article className="editaurus-surface editorial-offer editorial-company">
      <div className="editorial-offer-inner">
        <nav className="editorial-offer-breadcrumb" aria-label="Powrót do ofert">
          <BackLink to="/oferty">Wróć do ofert</BackLink>
        </nav>
        <div className="editorial-offer-grid editorial-company-grid">
          <header className="editorial-offer-hero">
            <div className="editorial-offer-identity">
              <CompanyLogo company={company} />
              <p className="editorial-offer-eyebrow">Profil firmy</p>
            </div>
            <h1>{company.name}</h1>
            <p className="editorial-offer-hero-bottom">
              {company.summary.trim() || "Firma nie dodała jeszcze podsumowania."}
            </p>
          </header>
          <aside
            className="editaurus-panel editorial-offer-sidebar"
            aria-label="Informacje o firmie"
          >
            <h2 className="editorial-offer-eyebrow">Informacje o firmie</h2>
            <dl className="editorial-offer-terms">
              <div>
                <dt>
                  <MapPin aria-hidden="true" /> Lokalizacja
                </dt>
                <dd>{company.location}</dd>
              </div>
              <div>
                <dt>
                  <Users aria-hidden="true" /> Wielkość
                </dt>
                <dd>{company.sizeLabel}</dd>
              </div>
            </dl>
            {/^https?:\/\//i.test(company.websiteUrl) && (
              <a
                className="editorial-offer-text-link"
                href={company.websiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                Strona firmy <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </aside>
          <section className="editorial-offer-employer" aria-labelledby="company-about">
            <h2 id="company-about">O firmie</h2>
            <div className="editorial-offer-company-copy">
              <p>{company.description.trim() || "Firma nie dodała jeszcze opisu."}</p>
            </div>
          </section>
        </div>
        <p className="editaurus-form-help">
          Profil i oferty zawierają dane demonstracyjne do ćwiczeń. To prototyp, a nie rzeczywista
          rekrutacja.
        </p>
        <section className="editorial-offer-related" aria-labelledby="company-roles">
          <div className="editorial-offer-related-heading">
            <h2 id="company-roles">Otwarte role</h2>
            <Link className="editorial-offer-text-link" to="/oferty">
              Wszystkie oferty
            </Link>
          </div>
          {jobs.length > 0 ? (
            <div>
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  variant="editorial"
                  saved={
                    person?.role === "candidate"
                      ? state.saved.some(
                          (item) => item.candidateId === person.id && item.jobId === job.id,
                        )
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <p className="editorial-company-empty">Ta firma nie ma teraz aktywnych ofert.</p>
          )}
        </section>
      </div>
    </article>
  );
}
