import { useState } from "react";
import { Link } from "react-router";
import { JobCard } from "@/features/jobs/job-card";
import { SalaryFact } from "@/features/jobs/salary-fact";
import { RecordSheet } from "@/components/record-sheet";
import { ProcessTimeline } from "@/components/process-timeline";
import { EditaurusTextarea } from "@/components/editaurus/textarea";
import { MatchScore } from "@/features/prototype/match-score";
import { publishedJobs } from "@/features/prototype/model";
import { usePrototype } from "@/features/prototype/store";

export function DomainPreview() {
  const { state } = usePrototype();
  const job = publishedJobs(state)[0];
  const [note, setNote] = useState("");
  return (
    <section aria-labelledby="ed-domain-title">
      <h2 id="ed-domain-title">Oferty, metadane i historia</h2>
      <p>Wspólne komponenty produktu. Przykładowa notatka i historia nie trafiają do aplikacji.</p>
      {job ? (
        <>
          <JobCard job={job} variant="editorial" />
          <p>Wiersz podglądu nie zapisuje ofert. Zapis sprawdzisz na rzeczywistej stronie firmy.</p>
          <Link className="editaurus-catalog-link" to={`/firmy/${job.company.slug}`}>
            Sprawdź ofertę i zapis na stronie firmy
          </Link>
          <div className="editaurus-catalog-grid">
            <article className="editaurus-catalog-card">
              <h2>Wynagrodzenie i podstawa</h2>
              <div className="editorial-offer-pay">
                <SalaryFact job={job} />
              </div>
            </article>
            <article className="editaurus-catalog-card">
              <h2>Brak wynagrodzenia — wariant przykładowy</h2>
              <div className="editorial-offer-pay">
                <SalaryFact job={{ ...job, salaryMin: undefined, salaryMax: undefined }} />
              </div>
            </article>
          </div>
        </>
      ) : (
        <p>Brak opublikowanej oferty do podglądu.</p>
      )}
      <div className="editaurus-record">
        <RecordSheet
          label="Przykładowy rekord katalogu"
          sections={[
            {
              value: "answer",
              label: "Treść podglądu",
              content: <p>Przykładowa odpowiedź do odczytu, niezwiązana z danymi osoby.</p>,
            },
            {
              value: "history",
              label: "Historia podglądu",
              content: (
                <ProcessTimeline
                  items={[
                    {
                      id: "preview-start",
                      title: "Utworzono przykład",
                      dateTime: "2026-11-20T10:00:00Z",
                    },
                    {
                      id: "preview-review",
                      title: "Przekazano do oceny",
                      dateTime: "2026-11-21T10:00:00Z",
                      content: <p>To ilustracja historii, nie decyzja rekrutacyjna.</p>,
                    },
                  ]}
                />
              ),
            },
          ]}
        >
          <label htmlFor="ed-record-note">Notatka tylko w podglądzie</label>
          <EditaurusTextarea
            id="ed-record-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </RecordSheet>
      </div>
      <p>Przykładowe pasma scenariusza, nie ocena kompetencji:</p>
      <div className="flex flex-wrap gap-3">
        {[39, 40, 60, 80].map((score) => (
          <MatchScore key={score} score={score} />
        ))}
      </div>
      <Link className="editaurus-catalog-link" to="/app/aplikacje">
        Otwórz rzeczywiste aplikacje i historię
      </Link>
      <Link className="editaurus-catalog-link" to="/oferty?view=map">
        Sprawdź listę, mapę, filtry i paginację
      </Link>
    </section>
  );
}
