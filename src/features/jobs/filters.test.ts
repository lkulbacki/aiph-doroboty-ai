import { describe, expect, it } from "vitest";
import {
  filterJobs,
  hasIndexableFilters,
  parseJobFilters,
  sortJobs,
} from "@/features/jobs/filters";
import { initialState, publishedJobs } from "@/features/prototype/model";
const joinJobsWithCompanies = () => publishedJobs(initialState());

describe("job filters", () => {
  it("accepts controlled filter values", () => {
    expect(
      parseJobFilters({ category: "build", remote: "remote", page: "2", query: "engineer" }),
    ).toEqual({ category: "build", remote: "remote", page: 2, query: "engineer" });
  });

  it("accepts empty values emitted by the native GET form", () => {
    expect(
      parseJobFilters({
        query: "",
        category: "lead",
        function: "",
        remote: "",
        seniority: "",
        contract: "",
      }),
    ).toMatchObject({ category: "lead", page: 1 });
  });

  it("falls back safely when controlled values are invalid", () => {
    expect(parseJobFilters({ category: "everything", page: "-1" })).toEqual({ page: 1 });
  });

  it("keeps filters for invalid page values and allows clamping large valid pages", () => {
    expect(parseJobFilters({ category: "build", page: "999" })).toMatchObject({
      category: "build",
      page: 999,
    });
    for (const page of ["0", "-1", "1.5", "NaN", "Infinity", "999999999999999999999"])
      expect(parseJobFilters({ category: "build", page })).toMatchObject({
        category: "build",
        page: 1,
      });
  });

  it("filters deterministic jobs by taxonomy and text", () => {
    const items = joinJobsWithCompanies();
    expect(filterJobs(items, { category: "build", page: 1 })).toHaveLength(2);
    expect(filterJobs(items, { query: "northstar", page: 1 }).map((job) => job.slug)).toEqual([
      "staff-ai-engineer",
      "growth-lead-ai-products",
    ]);
  });

  it("compares monthly PLN bounds without guessing EUR rates or missing pay", () => {
    const [job] = joinJobsWithCompanies();
    const annual = {
      ...job!,
      slug: "annual",
      salaryPeriod: "year",
      salaryMin: 252000,
      salaryMax: 360000,
    } as const;
    const euros = { ...annual, slug: "euros", salaryCurrency: "EUR" } as const;
    const monthly = { ...job!, slug: "monthly", salaryMin: 20000, salaryMax: 25000 };
    const missing = { ...job!, slug: "missing", salaryMin: undefined, salaryMax: undefined };
    expect(filterJobs([euros, monthly, missing, annual], { page: 1, minSalary: 21000 })).toEqual([
      annual,
    ]);
    expect(sortJobs([euros, missing, monthly, annual], "salary")).toEqual([
      annual,
      monthly,
      euros,
      missing,
    ]);
  });

  it("marks filtered combinations as non-indexable", () => {
    expect(hasIndexableFilters({ page: 1 })).toBe(false);
    expect(hasIndexableFilters({ function: "product", page: 1 })).toBe(true);
  });
});
