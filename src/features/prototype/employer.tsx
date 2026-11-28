import { useRef, useState, type FormEvent } from "react";
import { usePostHog } from "@posthog/react";
import { Link, useNavigate, useParams } from "react-router";
import { EditaurusTextarea } from "@/components/editaurus/textarea";
import { HeroButton, HeroLink } from "@/components/editaurus/hero-button";
import { SecondaryButton } from "@/components/editaurus/secondary-button";
import { Input } from "@/components/ui/input";
import { EditaurusCheckbox } from "@/components/editaurus/checkbox";
import { FormSelect } from "@/components/ui/form-select";
import {
  categoryLabels,
  functionLabels,
  remoteLabels,
  seniorityLabels,
  contractLabels,
} from "@/features/jobs/presentation";
import { currentPerson, jobSchema } from "./model";
import { usePrototype } from "./store";
import { Field } from "./workspace";
import { NotFound, PageTitle } from "./shell";
import { ProjectQuestionSuggestions } from "./project-question-suggestions";

export function EmployerJobs() {
  const { state } = usePrototype();
  const person = currentPerson(state)!;
  const jobs = state.jobs.filter((x) => x.companyId === person.companyId);
  return (
    <section className="editaurus-applications editaurus-employer-jobs">
      <PageTitle action={<HeroLink to="/app/oferty/nowa">Dodaj ofertę</HeroLink>}>
        Moje oferty
      </PageTitle>
      <div className="editaurus-employer-job-list">
        {jobs.length ? (
          jobs.map((job) => (
            <article key={job.id} className="editaurus-employer-job">
              <div className="editaurus-employer-job-inner">
                <div>
                  <h2>
                    <Link to={`/app/oferty/${job.id}`}>{job.title}</Link>
                  </h2>
                  <p className="editaurus-employer-job-meta">
                    {state.applications.filter((x) => x.jobId === job.id).length} aplikacji ·{" "}
                    {job.publicationStatus === "published" ? "Opublikowana" : "Szkic"}
                    {state.jobRevisions?.some((draft) => draft.id === job.id) && " · Szkic zmian"}
                  </p>
                </div>
                <SecondaryButton
                  render={
                    <Link
                      to={
                        job.publicationStatus === "published"
                          ? `/oferty/${job.slug}`
                          : `/app/oferty/${job.id}`
                      }
                    />
                  }
                >
                  {job.publicationStatus === "published" ? "Zobacz ofertę" : "Edytuj szkic"}
                </SecondaryButton>
              </div>
            </article>
          ))
        ) : (
          <p className="editaurus-applications-empty">
            Nie masz jeszcze ofert. Dodaj pierwszą ofertę.
          </p>
        )}
      </div>
    </section>
  );
}
export function EmployerJobEditor() {
  const { id } = useParams();
  const { state, run } = usePrototype();
  const posthog = usePostHog();
  const person = currentPerson(state)!;
  const navigate = useNavigate();
  const existing = state.jobs.find((x) => x.id === id && x.companyId === person.companyId);
  const draft = existing && state.jobRevisions?.find((x) => x.id === existing.id);
  const fields = draft ?? existing;
  const [title, setTitle] = useState(fields?.title ?? "");
  const [summary, setSummary] = useState(fields?.summary ?? "");
  const [description, setDescription] = useState(fields?.description ?? "");
  const [projectQuestion, setProjectQuestion] = useState(fields?.projectQuestion ?? "");
  const projectQuestionInput = useRef<HTMLTextAreaElement>(null);
  const [source, setSource] = useState(fields?.sourceBrief ?? "");
  const [generated, setGenerated] = useState(fields?.generatedDescription ?? "");
  const salaryCurrency = fields?.salaryCurrency ?? "PLN";
  const salaryPeriod = fields?.salaryPeriod ?? "month";
  const salaryKind = fields?.salaryKind ?? "gross";
  const salaryBasis = `${salaryCurrency} ${salaryKind === "net" ? "netto" : "brutto"} / ${salaryPeriod === "year" ? "rok" : "mies."}`;
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");
  if (id !== "nowa" && !existing) return <NotFound />;
  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const draft = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "draft";
    if (!draft && !approved) {
      setError("Zatwierdź opis przed publikacją.");
      return;
    }
    const data = new FormData(e.currentTarget);
    const newId = existing?.id ?? crypto.randomUUID();
    const location = String(data.get("location")).trim();
    const locationUnchanged = fields && location === fields.locations.join(" / ").trim();
    const parsed = jobSchema.safeParse({
      id: newId,
      slug: existing?.slug ?? `oferta-${newId}`,
      companyId: person.companyId,
      title,
      summary,
      description,
      projectQuestion: projectQuestion.trim() || undefined,
      sourceBrief: source,
      generatedDescription: generated,
      category: data.get("category"),
      function: data.get("function"),
      remoteStatus: data.get("remoteStatus"),
      locations: locationUnchanged ? fields.locations : [location],
      seniority: data.get("seniority"),
      contract: data.get("contract"),
      salaryMin: data.get("salaryMin") ? Number(data.get("salaryMin")) : undefined,
      salaryMax: data.get("salaryMax") ? Number(data.get("salaryMax")) : undefined,
      salaryCurrency,
      salaryPeriod,
      salaryKind,
      coordinates: locationUnchanged
        ? fields.coordinates
        : (
            {
              warszawa: { latitude: 52.2297, longitude: 21.0122 },
              kraków: { latitude: 50.0647, longitude: 19.945 },
              wrocław: { latitude: 51.1079, longitude: 17.0385 },
              gdańsk: { latitude: 54.352, longitude: 18.6466 },
              poznań: { latitude: 52.4064, longitude: 16.9252 },
            } as Record<string, { latitude: number; longitude: number }>
          )[location.toLocaleLowerCase("pl")],
      publicationStatus: draft ? "draft" : "published",
      publishedAt:
        existing && (draft || existing.publicationStatus !== "draft")
          ? existing.publishedAt
          : new Date().toISOString(),
      expiryAt: existing?.expiryAt ?? "2099-12-31T23:59:59.000Z",
      verificationStatus: draft
        ? (existing?.verificationStatus ?? "unverified")
        : "employer_verified",
    });
    if (
      !parsed.success ||
      (parsed.data.salaryMin !== undefined &&
        parsed.data.salaryMax !== undefined &&
        parsed.data.salaryMin > parsed.data.salaryMax)
    ) {
      setError(
        draft
          ? "Sprawdź formularz: tytuł, lokalizację, opcje z list i widełki wynagrodzenia."
          : "Sprawdź formularz: tytuł, lokalizacja, podsumowanie (min. 10 znaków), opis (min. 30 znaków) i widełki wynagrodzenia.",
      );
      return;
    }
    if (run({ type: draft ? "save_job_draft" : "publish", job: parsed.data })) {
      posthog.capture(draft ? "job_draft_saved" : "job_published", {
        is_existing_job: Boolean(existing),
        job_category: parsed.data.category,
        job_function: parsed.data.function,
        has_project_question: Boolean(parsed.data.projectQuestion),
      });
      navigate("/app/oferty");
    }
  }
  return (
    <section className="editaurus-applications editaurus-profile editaurus-job-editor">
      <PageTitle>{existing ? "Edytuj ofertę" : "Nowa oferta"}</PageTitle>
      <form
        className="editaurus-panel editaurus-profile-panel editaurus-profile-form"
        onSubmit={save}
      >
        <Field label="Nazwa stanowiska">
          <Input
            className="editaurus-input"
            required
            maxLength={200}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setApproved(false);
            }}
          />
        </Field>
        <Field label="Brief — kogo szukasz i do jakiego zadania?">
          <EditaurusTextarea
            maxLength={12000}
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setGenerated("");
              setApproved(false);
            }}
          />
        </Field>
        <div>
          <SecondaryButton
            type="button"
            disabled={source.trim().length < 20 || title.trim().length < 3}
            onClick={() => {
              setGenerated(
                `${title}\n\nO roli\n${source.trim().slice(0, 10000)}\n\nJak pracujemy\nŁączymy potrzeby użytkowników, odpowiedzialne wykorzystanie AI i mierzalne efekty.\n\nProces rekrutacji\nPrześlij aplikację i opowiedz o projekcie, w którym Twoje decyzje wpłynęły na wynik.`,
              );
              setApproved(false);
              posthog.capture("job_description_generated");
            }}
          >
            Przygotuj opis z AI
          </SecondaryButton>
        </div>
        {generated && (
          <section className="editaurus-job-proposal">
            <h2 className="mb-4">Propozycja opisu</h2>
            <p className="whitespace-pre-wrap">{generated}</p>
            <SecondaryButton
              type="button"
              className="mt-5"
              onClick={() => {
                setDescription(generated);
                if (!summary) setSummary(source.slice(0, 180));
                setApproved(false);
              }}
            >
              Użyj propozycji
            </SecondaryButton>
          </section>
        )}
        <Field label="Krótkie podsumowanie">
          <EditaurusTextarea
            required
            minLength={10}
            maxLength={12000}
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              setApproved(false);
            }}
          />
        </Field>
        <Field label="Opis oferty">
          <EditaurusTextarea
            required
            minLength={30}
            maxLength={12000}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setApproved(false);
            }}
          />
        </Field>
        <section className="project-response-card" aria-label="Pytanie o wkład w projekt">
          <Field label="Pytanie o wkład w projekt (opcjonalnie)">
            <EditaurusTextarea
              rows={3}
              ref={projectQuestionInput}
              maxLength={12000}
              aria-describedby="job-project-question-example"
              value={projectQuestion}
              onChange={(e) => {
                setProjectQuestion(e.target.value);
                setApproved(false);
              }}
            />
          </Field>
          <p className="editaurus-form-help" id="job-project-question-example">
            Przykład: „Opisz jeden wcześniejszy projekt, w którym wykorzystałeś umiejętność
            przydatną w tej roli. Za co odpowiadałeś osobiście i jaki był efekt Twojej pracy?”.
          </p>
          <ProjectQuestionSuggestions
            key={JSON.stringify([title, source, description])}
            title={title}
            brief={source}
            description={description}
            onSelect={(question) => {
              setProjectQuestion(question);
              setApproved(false);
              posthog.capture("project_question_selected");
              projectQuestionInput.current?.focus();
            }}
          />
        </section>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["category", "Kategoria", categoryLabels, fields?.category ?? "build"],
              ["function", "Funkcja", functionLabels, fields?.function ?? "engineering"],
              ["remoteStatus", "Tryb pracy", remoteLabels, fields?.remoteStatus ?? "hybrid"],
              ["seniority", "Poziom", seniorityLabels, fields?.seniority ?? "mid"],
              ["contract", "Umowa", contractLabels, fields?.contract ?? "employment"],
            ] as const
          ).map(([name, label, values, value]) => (
            <Field key={name} label={label}>
              <FormSelect
                required
                searchable
                triggerClassName="editaurus-select-trigger"
                contentClassName="editaurus-surface editaurus-select-menu"
                name={name}
                ariaLabel={label}
                defaultValue={value}
                onValueChange={() => setApproved(false)}
                options={Object.entries(values).map(([value, label]) => ({ value, label }))}
              />
            </Field>
          ))}
          <Field label="Lokalizacja">
            <Input
              className="editaurus-input"
              name="location"
              onChange={() => setApproved(false)}
              required
              maxLength={200}
              defaultValue={fields?.locations.join(" / ") ?? "Warszawa"}
            />
          </Field>
          <Field label={`Wynagrodzenie od (${salaryBasis})`}>
            <Input
              className="editaurus-input"
              name="salaryMin"
              onChange={() => setApproved(false)}
              type="number"
              min="0"
              defaultValue={fields?.salaryMin}
            />
          </Field>
          <Field label={`Wynagrodzenie do (${salaryBasis})`}>
            <Input
              className="editaurus-input"
              name="salaryMax"
              onChange={() => setApproved(false)}
              type="number"
              min="0"
              defaultValue={fields?.salaryMax}
            />
          </Field>
        </div>
        <label className="application-consent flex items-start gap-3">
          <EditaurusCheckbox
            checked={approved}
            onCheckedChange={setApproved}
            aria-labelledby="job-approval-label"
          />
          <span id="job-approval-label">Zatwierdzam treść oferty do publikacji.</span>
        </label>
        {error && (
          <p role="alert" className="editaurus-form-error">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <HeroButton type="submit" disabled={!approved}>
            Opublikuj ofertę
          </HeroButton>
          <SecondaryButton type="submit" value="draft" formNoValidate>
            Zapisz szkic
          </SecondaryButton>
        </div>
      </form>
    </section>
  );
}
export function CompanyEditor() {
  const { state, run } = usePrototype();
  const posthog = usePostHog();
  const person = currentPerson(state)!;
  const company = state.companies.find((x) => x.id === person.companyId)!;
  const [message, setMessage] = useState("");
  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (
      run({
        type: "company",
        name: String(data.get("name")),
        description: String(data.get("description")),
      })
    ) {
      posthog.capture("company_profile_updated");
      setMessage("Dane firmy zostały zapisane.");
    }
  }
  return (
    <section className="editaurus-applications editaurus-profile">
      <PageTitle>Twoja organizacja</PageTitle>
      <form
        className="editaurus-panel editaurus-profile-panel editaurus-profile-form"
        onSubmit={save}
      >
        <Field label="Nazwa firmy">
          <Input
            className="editaurus-input"
            name="name"
            required
            maxLength={200}
            defaultValue={company.name}
          />
        </Field>
        <Field label="Opis firmy">
          <EditaurusTextarea
            name="description"
            maxLength={12000}
            defaultValue={company.description}
          />
        </Field>
        <HeroButton type="submit">Zapisz dane firmy</HeroButton>
        {message && (
          <p role="status" className="editaurus-form-status">
            {message}
          </p>
        )}
        <SecondaryButton render={<Link to={`/firmy/${company.slug}`} />}>
          Zobacz profil firmy
        </SecondaryButton>
      </form>
    </section>
  );
}
