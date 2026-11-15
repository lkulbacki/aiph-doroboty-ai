import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Bookmark, MapPin, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrototype } from "@/features/prototype/store";
import type { JobWithCompany } from "./types";
import {
  categoryLabels,
  contractLabels,
  functionLabels,
  remoteLabels,
  seniorityLabels,
} from "./presentation";
import { CompanyLogo } from "./company-logo";
import { SalaryFact } from "./salary-fact";
const publicationDate = new Intl.DateTimeFormat("pl-PL");

export function JobCard({
  job,
  saved,
  variant,
}: {
  job: JobWithCompany;
  saved?: boolean;
  variant?: "editorial";
}) {
  const { run } = usePrototype();
  const [justUnsaved, setJustUnsaved] = useState(false);
  const saveButton = saved !== undefined && (
    <Button
      className={variant === "editorial" ? "editorial-job-save" : "pp-save-button"}
      variant="ghost"
      size="icon-sm"
      aria-label={`Zapisz ofertę: ${job.title}`}
      aria-pressed={saved}
      data-just-unsaved={variant === "editorial" && justUnsaved ? "" : undefined}
      onPointerLeave={variant === "editorial" ? () => setJustUnsaved(false) : undefined}
      onClick={() => {
        if (run({ type: "toggle_saved", jobId: job.id }) && variant === "editorial") {
          setJustUnsaved(Boolean(saved));
        }
      }}
    >
      <Bookmark className="pp-icon" />
    </Button>
  );
  if (variant === "editorial") {
    return (
      <article className="editorial-job-row" data-category={job.category}>
        <div>
          <div className="editorial-job-meta">
            <span className="editorial-job-category">{categoryLabels[job.category]}</span>
            <span>{seniorityLabels[job.seniority]}</span>
            <span>{functionLabels[job.function]}</span>
          </div>
          <h3 className="editorial-job-title">
            <Link to={`/oferty/${job.slug}`}>{job.title}</Link>
          </h3>
        </div>
        <div className="editorial-job-company">
          <CompanyLogo company={job.company} />
          <div>
            <Link to={`/firmy/${job.company.slug}`}>{job.company.name}</Link>
            <p>{job.locations.join(" · ")}</p>
            <p>{remoteLabels[job.remoteStatus]}</p>
            <p>{contractLabels[job.contract]}</p>
          </div>
        </div>
        <div className="editorial-job-pay">
          <SalaryFact job={job} showContract={false} />
          <p>
            Dodano{" "}
            <time dateTime={job.publishedAt}>
              {publicationDate.format(new Date(job.publishedAt))}
            </time>
          </p>
        </div>
        {saveButton}
      </article>
    );
  }

  return (
    <article className="pp-job-card">
      <CompanyLogo company={job.company} />
      <div className="pp-job-main">
        <div className="pp-job-topline">
          <Link className="pp-job-company" to={`/firmy/${job.company.slug}`}>
            {job.company.name}
          </Link>
          <span className="pp-separator">/</span>
          <span className="pp-job-category">{categoryLabels[job.category]}</span>
        </div>
        <h3 className="pp-job-title">
          <Link to={`/oferty/${job.slug}`}>{job.title}</Link>
        </h3>
        <div className="pp-job-facts">
          <span>
            <MapPin className="pp-icon" />
            {job.locations.join(" / ")}
          </span>
          <span>
            <Monitor className="pp-icon" />
            {remoteLabels[job.remoteStatus]}
          </span>
          <span>{seniorityLabels[job.seniority]}</span>
        </div>
        <div className="pp-job-tags">
          <span>{functionLabels[job.function]}</span>
        </div>
      </div>
      <div className="pp-job-side">
        <div className="pp-job-side-top">
          <span className="pp-job-age">{publicationDate.format(new Date(job.publishedAt))}</span>
          {saveButton}
        </div>
        <SalaryFact job={job} />
        <Link className="pp-detail-button" to={`/oferty/${job.slug}`}>
          Zobacz rolę <ArrowUpRight className="pp-icon" />
        </Link>
      </div>
    </article>
  );
}
