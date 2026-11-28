import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePostHog } from "@posthog/react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router";
import { CheckCircle2, FileText } from "lucide-react";
import { HeroLink } from "@/components/editaurus/hero-button";
import { HeroButton } from "@/components/editaurus/hero-button";
import { SecondaryButton } from "@/components/editaurus/secondary-button";
import { EditaurusTextarea } from "@/components/editaurus/textarea";
import { EditaurusCheckbox } from "@/components/editaurus/checkbox";
import { ConfettiBurst, type ConfettiOrigin } from "@/components/confetti-burst";
import { BackLink } from "@/components/back-link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/features/jobs/job-card";
import { ApplicationOfferPreview } from "@/features/jobs/application-offer-preview";
import { usePrototype } from "./store";
import { currentPerson, publishedJobs, stageLabels, MIN_APPLICATION_ANSWER_LENGTH } from "./model";
import { PageTitle, NotFound, Notice } from "./shell";
import { CvAttachment } from "./cv-attachment";
import { MatchScore } from "./match-score";
import { RecruitingApplication } from "./recruiting-application";
import { CandidateApplication } from "./candidate-application";
import { analyzeRecording } from "./project-ai-client";
import { MAX_RECORDING_SECONDS, type Recording, type ProjectVoice } from "./project-ai";
import { ProjectVoiceRecorder } from "./project-voice-recorder";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function PersonPicker() {
  const { state, run } = usePrototype();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next");
  const audience = params.get("audience");
  const people =
    audience === "candidate" || audience === "employer"
      ? state.people.filter((person) => person.role === audience)
      : state.people;
  const safeNext = next && /^\/(?!\/)/.test(next) && !next.startsWith("/auth") ? next : null;
  return (
    <section className="editaurus-surface editaurus-applications editaurus-person-picker">
      <h1>Wybierz osobę</h1>
      <p className="editaurus-person-picker-description">
        Wybierz profil, z którego chcesz korzystać w prototypie. Hasło nie jest potrzebne.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {people.map((person) => (
          <article key={person.id} className="editaurus-panel editaurus-person-card">
            <h2 className="editaurus-person-name">{person.name}</h2>
            <p className="editaurus-person-headline">{person.headline}</p>
            <SecondaryButton
              onClick={() => {
                run({ type: "select_person", id: person.id });
                navigate(
                  person.role === "candidate"
                    ? (safeNext ?? "/app")
                    : person.role === "employer"
                      ? "/app/oferty"
                      : "/app/case",
                );
              }}
            >
              Wejdź jako {person.name}
            </SecondaryButton>
          </article>
        ))}
      </div>
    </section>
  );
}
export function RequireRole({
  role,
  children,
}: {
  role?: "candidate" | "employer" | "operator";
  children: ReactNode;
}) {
  const { state } = usePrototype();
  const person = currentPerson(state);
  if (!person) return <PersonPicker />;
  if (role && person.role !== role)
    return (
      <section className="editaurus-surface editaurus-applications">
        <div className="editaurus-panel editaurus-role-gate">
          <p className="mb-4">
            Ten widok jest dostępny dla{" "}
            {role === "candidate"
              ? "kandydata"
              : role === "employer"
                ? "pracodawcy"
                : "prowadzącego"}
            .
          </p>
          <SecondaryButton render={<Link to="/auth/sign-in" />}>Zmień osobę</SecondaryButton>
        </div>
      </section>
    );
  return children;
}
export function WorkspaceHome() {
  const { state } = usePrototype();
  const person = currentPerson(state)!;
  if (person.role === "operator") return <Navigate to="/app/case" replace />;
  const candidate = person.role === "candidate";
  const applications = state.applications.filter((a) =>
    candidate ? a.candidateId === person.id : a.companyId === person.companyId,
  );
  return (
    <section className="editaurus-applications editaurus-overview">
      <PageTitle>Witaj, {person.name.split(" ")[0]}</PageTitle>
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          ["Aplikacje", applications.length],
          [
            candidate ? "Zapisane oferty" : "Twoje oferty",
            candidate
              ? state.saved.filter((x) => x.candidateId === person.id).length
              : state.jobs.filter((x) => x.companyId === person.companyId).length,
          ],
          [
            "W trakcie procesu",
            applications.filter((x) => !["rejected", "withdrawn", "hired"].includes(x.stage))
              .length,
          ],
        ].map(([label, value]) => (
          <div className="editaurus-panel editaurus-overview-stat" key={label}>
            <p>{label}</p>
            <strong className="mt-3 block text-3xl">{value}</strong>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <HeroLink to={candidate ? "/oferty" : "/app/kandydaci"}>
          {candidate ? "Przeglądaj oferty" : "Przejrzyj kandydatów"}
        </HeroLink>
        <SecondaryButton render={<Link to={candidate ? "/app/profil" : "/app/oferty"} />}>
          {candidate ? "Edytuj profil" : "Zarządzaj ofertami"}
        </SecondaryButton>
      </div>
    </section>
  );
}
export function ProfilePage({ preview = false }: { preview?: boolean }) {
  const { state, run } = usePrototype();
  const posthog = usePostHog();
  const person = currentPerson(state)!;
  const [message, setMessage] = useState("");
  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (
      run({
        type: "profile",
        value: {
          name: String(data.get("name")),
          headline: String(data.get("headline")),
          bio: String(data.get("bio")),
          location: String(data.get("location")),
        },
      })
    ) {
      posthog.capture("profile_updated");
      setMessage("Profil został zapisany.");
    }
  }
  return (
    <section className="editaurus-applications editaurus-profile">
      <PageTitle
        action={
          <SecondaryButton render={<Link to={preview ? "/app/profil" : "/app/profil/podglad"} />}>
            {preview ? "Edytuj profil" : "Podgląd profilu"}
          </SecondaryButton>
        }
      >
        {preview ? person.name : "Twój profil"}
      </PageTitle>
      {preview ? (
        <div className="editaurus-panel editaurus-profile-panel space-y-4">
          <h2>{person.headline}</h2>
          <p>{person.location}</p>
          <p>{person.bio}</p>
        </div>
      ) : (
        <form
          onSubmit={save}
          className="editaurus-panel editaurus-profile-panel editaurus-profile-form"
        >
          <Field label="Imię i nazwisko">
            <Input
              className="editaurus-input"
              name="name"
              required
              maxLength={200}
              defaultValue={person.name}
            />
          </Field>
          <Field label="Nagłówek zawodowy">
            <Input
              className="editaurus-input"
              name="headline"
              required
              maxLength={200}
              defaultValue={person.headline}
            />
          </Field>
          <Field label="Lokalizacja">
            <Input
              className="editaurus-input"
              name="location"
              required
              maxLength={200}
              defaultValue={person.location}
            />
          </Field>
          <Field label="O mnie">
            <EditaurusTextarea name="bio" maxLength={12000} defaultValue={person.bio} />
          </Field>
          <HeroButton type="submit">Zapisz profil</HeroButton>
          {message && (
            <p role="status" className="editaurus-form-status">
              {message}
            </p>
          )}
        </form>
      )}
      <section className="editaurus-panel editaurus-profile-panel mt-6">
        <h2 className="mb-4 flex items-center gap-2">
          <FileText className="size-5" />
          CV
        </h2>
        <CvAttachment
          candidateId={person.id}
          fallbackText={person.cv}
          layout="row"
          contextLabel="CV z Twojego profilu"
        />
      </section>
    </section>
  );
}
export function SavedPage() {
  const { state } = usePrototype();
  const person = currentPerson(state)!;
  const jobs = publishedJobs(state).filter((job) =>
    state.saved.some((x) => x.candidateId === person.id && x.jobId === job.id),
  );
  return (
    <section className="editaurus-applications">
      <h1>Zapisane oferty</h1>
      {jobs.length ? (
        jobs.map((job) => <JobCard key={job.id} job={job} saved variant="editorial" />)
      ) : (
        <div className="editaurus-saved-empty">
          <p className="mb-4">Nie masz jeszcze zapisanych ofert.</p>
          <SecondaryButton render={<Link to="/oferty" />}>Przeglądaj oferty</SecondaryButton>
        </div>
      )}
    </section>
  );
}
export function ApplyPage() {
  const { slug } = useParams();
  const { state, run } = usePrototype();
  const posthog = usePostHog();
  const person = currentPerson(state)!;
  const navigate = useNavigate();
  const job = publishedJobs(state).find((x) => x.slug === slug);
  const draft = state.drafts.find((x) => x.jobId === job?.id && x.candidateId === person.id);
  const notes = draft?.notes ?? "";
  const generated = draft?.generated ?? "";
  const [answer, setAnswer] = useState(draft?.answer ?? "");
  const draftProjectResponse =
    draft?.projectResponse?.question === job?.projectQuestion ? draft?.projectResponse : undefined;
  const [projectAnswer, setProjectAnswer] = useState(draftProjectResponse?.answer ?? "");
  const [recording, setRecording] = useState(draftProjectResponse?.recording);
  const [recordingBusy, setRecordingBusy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const analysisRequest = useRef<AbortController | null>(null);
  const voiceResult = useRef<{ recording: Recording; voice: ProjectVoice } | null>(null);
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [attempted, setAttempted] = useState(false);
  const answerInput = useRef<HTMLTextAreaElement>(null);
  const sendButton = useRef<HTMLButtonElement>(null);
  const submittedOnce = useRef(false);
  const [submitted, setSubmitted] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState<ConfettiOrigin | null>(null);
  useEffect(() => () => analysisRequest.current?.abort(), []);
  useEffect(() => {
    if (!submitted) return;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900;
    const timeout = window.setTimeout(() => navigate("/app/aplikacje?wyslano=1"), delay);
    return () => window.clearTimeout(timeout);
  }, [submitted, navigate]);
  const answerLength = answer.trim().length;
  const answerInvalid = attempted && answerLength < MIN_APPLICATION_ANSWER_LENGTH;
  const consentInvalid = attempted && !consent;
  if (!job) return <NotFound />;
  const existing = state.applications.find(
    (x) => x.jobId === job.id && x.candidateId === person.id,
  );
  if (existing && !submitted)
    return (
      <section className="prototype-section">
        <Notice>Aplikacja na tę ofertę została już wysłana.</Notice>
        <Link to={`/app/aplikacje/${existing.id}`} className={buttonVariants()}>
          Zobacz aplikację
        </Link>
      </section>
    );
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (submittedOnce.current || analysisRequest.current || recordingBusy || !job) return;
    setAttempted(true);
    if (answerLength < MIN_APPLICATION_ANSWER_LENGTH) {
      answerInput.current?.focus();
      return;
    }
    if (!consent) {
      document.getElementById("application-consent")?.focus();
      return;
    }
    let voice: ProjectVoice | undefined;
    if (recording) {
      setVoiceError("");
      if (voiceResult.current?.recording === recording) {
        voice = voiceResult.current.voice;
      } else {
        const controller = new AbortController();
        analysisRequest.current = controller;
        setAnalyzing(true);
        try {
          voice = { ...recording, ...(await analyzeRecording(recording, controller.signal)) };
          if (controller.signal.aborted) return;
          voiceResult.current = { recording, voice };
        } catch (error) {
          if (!controller.signal.aborted)
            setVoiceError(error instanceof Error ? error.message : "Spróbuj wysłać ponownie.");
          return;
        } finally {
          analysisRequest.current = null;
          if (!controller.signal.aborted) setAnalyzing(false);
        }
      }
    }
    if (
      run({
        type: "submit",
        jobId: job.id,
        notes,
        generated,
        answer,
        projectAnswer,
        consent,
        voice,
      })
    ) {
      posthog.capture("application_submitted", {
        has_project_response: Boolean(projectAnswer.trim() || recording),
        has_voice_recording: Boolean(recording),
      });
      submittedOnce.current = true;
      setSubmitted(true);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const rect = sendButton.current?.getBoundingClientRect();
        if (rect)
          setConfettiOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    }
  }
  return (
    <section className="pp-container application-page">
      <BackLink to={`/oferty/${job.slug}`}>Wróć do oferty</BackLink>
      <header className="editaurus-surface application-header">
        <h1>Aplikuj na ofertę</h1>
        <p>Sprawdź ofertę i opowiedz, dlaczego pasujesz do tej roli.</p>
      </header>
      <div className="application-layout">
        <ApplicationOfferPreview job={job} />
        <form
          noValidate
          onSubmit={submit}
          className="record-sheet application-form editaurus-surface editaurus-panel editaurus-application"
          aria-labelledby="application-form-title"
        >
          <header className="application-form-intro">
            <h2 id="application-form-title">Twoja aplikacja</h2>
            <p>
              Aplikujesz jako <strong>{person.name}</strong>.
            </p>
          </header>
          <section className="application-form-section" aria-labelledby="application-cv-title">
            <h3 id="application-cv-title">Twoje CV</h3>
            <p className="application-help">Do aplikacji dołączymy CV z Twojego profilu.</p>
            <CvAttachment
              candidateId={person.id}
              fallbackText={person.cv}
              layout="row"
              contextLabel="CV z Twojego profilu"
            />
          </section>
          <section
            className="application-form-section application-answer"
            aria-label="Odpowiedź do aplikacji"
          >
            <Field label="Dlaczego pasujesz do tej roli?">
              <EditaurusTextarea
                disabled={submitted || analyzing}
                ref={answerInput}
                required
                minLength={MIN_APPLICATION_ANSWER_LENGTH}
                maxLength={12000}
                aria-invalid={answerInvalid || undefined}
                aria-describedby="application-answer-help"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setConsent(false);
                }}
              />
            </Field>
            <p
              id="application-answer-help"
              role={answerInvalid ? "alert" : undefined}
              className={
                answerInvalid ? "error-message editaurus-form-error" : "editaurus-form-help"
              }
            >
              {answerInvalid
                ? `Odpowiedź jest za krótka. Wpisz co najmniej ${MIN_APPLICATION_ANSWER_LENGTH} znaków (obecnie: ${answerLength}).`
                : `Minimum ${MIN_APPLICATION_ANSWER_LENGTH} znaków. Obecnie: ${answerLength}.`}
            </p>
          </section>
          {job.projectQuestion && (
            <section
              className="project-response-card application-answer"
              aria-labelledby="application-project-title"
            >
              <h3 id="application-project-title">Odpowiedź projektowa</h3>
              <p className="project-response-prompt">{job.projectQuestion}</p>
              <p id="application-project-help" className="application-help">
                Możesz opisać projekt bez ujawniania poufnych informacji. Odpowiedź jest opcjonalna.
                Nagranie trwa do {MAX_RECORDING_SECONDS} sekund.
              </p>
              <ProjectVoiceRecorder
                recording={recording}
                disabled={submitted || analyzing}
                onBusyChange={setRecordingBusy}
                onChange={(next) => {
                  setRecording(next);
                  setConsent(false);
                  setVoiceError("");
                  voiceResult.current = null;
                }}
              />
              {!recording && (
                <details open={Boolean(draftProjectResponse?.answer)}>
                  <summary className="project-response-disclosure">Wpisz odpowiedź</summary>
                  <Field label="Odpowiedź pisemna (opcjonalnie)">
                    <EditaurusTextarea
                      disabled={submitted || recordingBusy}
                      maxLength={12000}
                      aria-describedby="application-project-help"
                      value={projectAnswer}
                      onChange={(e) => {
                        setProjectAnswer(e.target.value);
                        setConsent(false);
                      }}
                    />
                  </Field>
                </details>
              )}
            </section>
          )}
          <div className="application-form-section application-submit">
            <label className="application-consent">
              <EditaurusCheckbox
                id="application-consent"
                disabled={submitted || analyzing}
                checked={consent}
                onCheckedChange={(v) => setConsent(v)}
                aria-invalid={consentInvalid || undefined}
                aria-describedby={
                  [
                    consentInvalid && "application-consent-error",
                    recording && "application-voice-disclosure",
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                aria-labelledby="application-consent-label"
              />
              <span id="application-consent-label">
                Zatwierdzam treść aplikacji i przesłanie profilu oraz przykładowego CV pracodawcy.
              </span>
            </label>
            {recording && (
              <p id="application-voice-disclosure" className="application-help">
                Po wybraniu „Wyślij aplikację” nagranie trafi do OpenRouter w celu transkrypcji i
                przygotowania podsumowania. Pracodawca zobaczy nagranie, transkrypcję i
                podsumowanie.
              </p>
            )}
            {voiceError && (
              <p className="editaurus-form-error" role="alert">
                {voiceError}
              </p>
            )}
            {consentInvalid && (
              <p
                id="application-consent-error"
                className="error-message editaurus-form-error"
                role="alert"
              >
                Zatwierdź treść aplikacji i jej przesłanie pracodawcy.
              </p>
            )}
            <div className="application-actions">
              <HeroButton
                ref={sendButton}
                type="submit"
                disabled={submitted || analyzing || recordingBusy}
                className="application-send"
              >
                {submitted && <CheckCircle2 aria-hidden="true" />}
                {submitted ? "Wysłano!" : analyzing ? "Przetwarzamy nagranie…" : "Wyślij aplikację"}
              </HeroButton>
              <SecondaryButton
                type="button"
                disabled={submitted || analyzing || recordingBusy}
                className="application-draft"
                onClick={() => {
                  if (
                    run({
                      type: "draft",
                      jobId: job.id,
                      notes,
                      generated,
                      answer,
                      projectAnswer,
                      recording,
                    })
                  ) {
                    posthog.capture("application_draft_saved", {
                      has_project_response: Boolean(projectAnswer.trim() || recording),
                      has_voice_recording: Boolean(recording),
                    });
                    setMessage("Szkic został zapisany.");
                  }
                }}
              >
                Zapisz szkic
              </SecondaryButton>
            </div>
            <p
              role="status"
              className={
                submitted || (!message && !analyzing)
                  ? "sr-only"
                  : "application-save-status editaurus-form-status"
              }
            >
              {submitted
                ? "Wysłano aplikację. Otwieramy listę Twoich aplikacji."
                : analyzing
                  ? "Trwa transkrypcja i przygotowanie podsumowania."
                  : message}
            </p>
            <p className="application-help">
              Zgłoszenie zapisze się w tym przeglądarkowym scenariuszu.
            </p>
          </div>
        </form>
      </div>
      <ConfettiBurst origin={confettiOrigin} />
    </section>
  );
}
export function ApplicationsPage({ employer = false }: { employer?: boolean }) {
  const { state } = usePrototype();
  const person = currentPerson(state)!;
  const [query, setQuery] = useState("");
  const [params] = useSearchParams();
  const applications = state.applications.filter(
    (x) =>
      (employer ? x.companyId === person.companyId : x.candidateId === person.id) &&
      `${x.candidateName} ${x.jobTitle}`
        .toLocaleLowerCase("pl")
        .includes(query.toLocaleLowerCase("pl")),
  );
  return (
    <section className="editaurus-applications" aria-labelledby="my-applications-title">
      <h1 id="my-applications-title">{employer ? "Kandydaci" : "Moje aplikacje"}</h1>
      {params.has("wyslano") && (
        <div role="status" className="editaurus-panel editaurus-applications-notice">
          <CheckCircle2 size={18} aria-hidden="true" />
          Aplikacja została wysłana.
        </div>
      )}
      <label className="editaurus-applications-search">
        <span>{employer ? "Szukaj kandydata lub oferty" : "Szukaj oferty"}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="editaurus-applications-results">
        {applications.length ? (
          applications.map((application) => (
            <article className="editaurus-application-row" key={application.id}>
              <div>
                <h2>
                  <Link to={`${employer ? "/app/kandydaci" : "/app/aplikacje"}/${application.id}`}>
                    {employer ? application.candidateName : application.jobTitle}
                  </Link>
                </h2>
                <p>
                  {employer
                    ? application.jobTitle
                    : state.companies.find((company) => company.id === application.companyId)?.name}
                </p>
              </div>
              <p className="editaurus-application-stage">{stageLabels[application.stage]}</p>
              <MatchScore score={application.score} />
              {employer && <p className="editaurus-candidate-summary">{application.summary}</p>}
            </article>
          ))
        ) : (
          <p role="status" className="editaurus-applications-empty">
            Brak aplikacji spełniających kryteria.
          </p>
        )}
      </div>
    </section>
  );
}
export function ApplicationDetail({ employer = false }: { employer?: boolean }) {
  const { id } = useParams();
  const { state } = usePrototype();
  const person = currentPerson(state)!;
  const application = state.applications.find(
    (x) =>
      x.id === id && (employer ? x.companyId === person.companyId : x.candidateId === person.id),
  );
  if (!application) return <NotFound />;
  if (employer) return <RecruitingApplication key={application.id} application={application} />;
  return <CandidateApplication key={application.id} application={application} />;
}
