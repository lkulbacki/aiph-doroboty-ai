import { Check } from "lucide-react";
import type { JobFilters } from "./types";
import { contractLabels, functionLabels, remoteLabels, seniorityLabels } from "./presentation";
export function JobFiltersForm({
  filters,
  onChange,
  onReset,
}: {
  filters: JobFilters;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="editorial-filters">
      <div className="editorial-filters-heading">
        <h2>Filtruj oferty</h2>
        <button className="pp-text-button" onClick={onReset}>
          Wyczyść
        </button>
      </div>
      {(
        [
          ["remote", "Tryb pracy", remoteLabels],
          ["seniority", "Doświadczenie", seniorityLabels],
          ["contract", "Forma współpracy", contractLabels],
          ["function", "Funkcja", functionLabels],
        ] as const
      ).map(([key, label, options]) => (
        <details key={key} open={key === "remote"}>
          <summary>
            <span>{label}</span>
          </summary>
          <fieldset aria-label={label}>
            {Object.entries(options).map(([value, text]) => (
              <label key={value}>
                <input
                  type="checkbox"
                  checked={filters[key] === value}
                  onChange={() => onChange(key, filters[key] === value ? "" : value)}
                />
                <span className="editorial-filter-check" aria-hidden="true">
                  <Check size={12} strokeWidth={2.5} />
                </span>
                {text}
              </label>
            ))}
          </fieldset>
        </details>
      ))}
      <details>
        <summary>
          <span>Minimalne wynagrodzenie</span>
        </summary>
        <label className="editorial-salary-filter">
          <span>Minimalne wynagrodzenie w PLN / mies.</span>
          <output>
            {filters.minSalary ? `${filters.minSalary.toLocaleString("pl-PL")} zł` : "Bez limitu"}
          </output>
          <input
            type="range"
            min="0"
            max="30000"
            step="1000"
            value={filters.minSalary ?? 0}
            aria-valuetext={
              filters.minSalary ? `${filters.minSalary} zł miesięcznie` : "Bez limitu"
            }
            onChange={(event) =>
              onChange("minSalary", event.target.value === "0" ? "" : event.target.value)
            }
          />
        </label>
      </details>
    </div>
  );
}
