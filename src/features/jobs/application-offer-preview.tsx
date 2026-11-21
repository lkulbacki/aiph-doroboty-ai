import { ChevronDown, MapPin } from "lucide-react";
import { CompanyLogo } from "./company-logo";
import { JobDescription } from "./job-description";
import { SalaryFact } from "./salary-fact";
import { categoryLabels, contractLabels, remoteLabels, seniorityLabels } from "./presentation";
import type { JobWithCompany } from "./types";

export function ApplicationOfferPreview({ job }: { job: JobWithCompany }) {
  return (
    <aside
      className="editaurus-surface editaurus-panel application-offer"
      data-category={job.category}
      aria-labelledby="application-offer-title"
    >
      <p className="application-eyebrow editorial-offer-eyebrow">Oferta, na którą aplikujesz</p>
      <div className="application-company editorial-offer-identity">
        <CompanyLogo company={job.company} />
        <span>{job.company.name}</span>
        <span className="editorial-job-category">{categoryLabels[job.category]}</span>
      </div>
      <h2 id="application-offer-title">{job.title}</h2>
      <p className="application-location">
        <MapPin size={16} aria-hidden="true" />
        {job.locations.join(" / ")}
      </p>
      <div className="application-pay editorial-offer-pay">
        <p className="editorial-offer-eyebrow">Wynagrodzenie</p>
        <SalaryFact job={job} showContract={false} />
      </div>
      <dl className="editorial-offer-terms">
        <div>
          <dt>Tryb pracy</dt>
          <dd>{remoteLabels[job.remoteStatus]}</dd>
        </div>
        <div>
          <dt>Doświadczenie</dt>
          <dd>{seniorityLabels[job.seniority]}</dd>
        </div>
        <div>
          <dt>Forma współpracy</dt>
          <dd>{contractLabels[job.contract]}</dd>
        </div>
      </dl>
      <p className="application-offer-summary">{job.summary}</p>
      <details className="application-description">
        <summary>
          Pełny opis oferty
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <JobDescription description={job.description} compact />
      </details>
    </aside>
  );
}
