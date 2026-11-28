import { useEffect, useId, useRef, useState } from "react";
import { SecondaryButton } from "@/components/editaurus/secondary-button";
import { suggestQuestions } from "./project-ai-client";

export function ProjectQuestionSuggestions({
  title,
  brief,
  description,
  onSelect,
}: {
  title: string;
  brief: string;
  description: string;
  onSelect: (question: string) => void;
}) {
  const groupName = useId();
  const [proposals, setProposals] = useState<string[]>([]);
  const [selection, setSelection] = useState<string>();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function generate() {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setError("");
    setProposals([]);
    setSelection(undefined);
    try {
      const { questions } = await suggestQuestions(
        { title, brief, description },
        controller.signal,
      );
      if (!controller.signal.aborted) setProposals(questions);
    } catch (error) {
      if (!controller.signal.aborted)
        setError(error instanceof Error ? error.message : "Spróbuj ponownie.");
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setPending(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div>
        <SecondaryButton
          type="button"
          onClick={generate}
          disabled={pending || !(brief.trim() || description.trim())}
        >
          Zaproponuj pytania z AI
        </SecondaryButton>
      </div>
      <p className="editaurus-form-help">
        Generowanie przesyła tytuł, brief i opis do OpenRouter. Używaj przykładowych danych.
      </p>
      {pending && <p role="status">Przygotowujemy propozycje pytań…</p>}
      {error && (
        <p role="alert" className="editaurus-form-error">
          {error}
        </p>
      )}
      {proposals.length > 0 && (
        <>
          <fieldset className="project-response-options">
            <legend>Propozycje pytań</legend>
            {proposals.map((question) => (
              <label key={question} className="project-response-option">
                <input
                  type="radio"
                  name={groupName}
                  checked={selection === question}
                  onChange={() => setSelection(question)}
                />
                <span>{question}</span>
              </label>
            ))}
          </fieldset>
          <div>
            <SecondaryButton
              type="button"
              disabled={!selection}
              onClick={() => {
                if (selection) onSelect(selection);
              }}
            >
              Użyj wybranego
            </SecondaryButton>
          </div>
        </>
      )}
    </div>
  );
}
