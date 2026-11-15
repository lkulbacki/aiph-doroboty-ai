import { Link } from "react-router";
import "@/app/home-latest-offers.css";
import { HomeRoles } from "@/features/editaurus/home-roles";
import { CandidateHero } from "@/features/editaurus/candidate-hero";
import { JobCard } from "@/features/jobs/job-card";
import { usePrototype } from "./store";
import { publishedJobs } from "./model";

export default function HomePage() {
  const { state } = usePrototype();
  const latestJobs = publishedJobs(state).slice(0, 4);

  return (
    <>
      <CandidateHero />

      <HomeRoles />

      <section className="editaurus-surface home-latest" aria-labelledby="home-latest-title">
        <div className="home-latest-inner">
          <div className="home-latest-heading">
            <h2 id="home-latest-title">
              Najnowsze <em>oferty</em>
            </h2>
            <Link className="home-latest-all" to="/oferty">
              Wszystkie oferty
            </Link>
          </div>
          {latestJobs.length ? (
            <div>
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} variant="editorial" />
              ))}
            </div>
          ) : (
            <p className="home-latest-empty">Na razie nie ma opublikowanych ofert.</p>
          )}
        </div>
      </section>
    </>
  );
}
