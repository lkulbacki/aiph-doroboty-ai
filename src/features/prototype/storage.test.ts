import { describe, expect, it } from "vitest";
import { initialState, transition } from "./model";
import {
  MAX_IMPORT_BYTES,
  parseState,
  readState,
  saveState,
  serializeState,
  STORAGE_KEY,
  StorageConflictError,
} from "./storage";
function memory(raw: string | null = null) {
  const values = new Map(raw === null ? [] : [[STORAGE_KEY, raw]]);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
describe("browser persistence and recovery", () => {
  it("round-trips a complete valid scenario", () => {
    const storage = memory();
    const s = initialState();
    saveState(storage, s);
    expect(readState(storage).state).toEqual(s);
    expect(parseState(serializeState(s))).toEqual(s);
  });
  it("rejects a stale snapshot without overwriting another tab's data", () => {
    const storage = memory();
    const original = readState(storage);
    const changed = { ...original.state, activePersonId: "candidate-anna" };
    saveState(storage, changed, original.snapshot);
    const saved = storage.getItem(STORAGE_KEY);
    expect(() => saveState(storage, original.state, original.snapshot)).toThrow(
      StorageConflictError,
    );
    expect(storage.getItem(STORAGE_KEY)).toBe(saved);
    saveState(storage, original.state, saved);
    expect(readState(storage).state).toEqual(original.state);
  });
  it("protects incompatible/corrupt original saves", () => {
    for (const raw of ["{", JSON.stringify({ ...initialState(), version: 2 })]) {
      const storage = memory(raw);
      const loaded = readState(storage);
      expect(loaded.blocked).toBe(true);
      expect(loaded.original).toBe(raw);
      expect(storage.getItem(STORAGE_KEY)).toBe(raw);
    }
  });
  it("does not fail startup when storage access is denied", () => {
    expect(readState(null).state.jobs.length).toBeGreaterThan(0);
    expect(
      readState({
        getItem() {
          throw new Error("Denied");
        },
        setItem() {},
      }).blocked,
    ).toBe(true);
  });
  it("reports quota/write failure without altering the original", () => {
    const old = "old";
    const storage = {
      getItem: () => old,
      setItem() {
        throw new Error("QuotaExceededError");
      },
    };
    expect(() => saveState(storage, initialState())).toThrow("Wyeksportuj");
    expect(storage.getItem()).toBe(old);
  });
  it("rejects invalid references and oversized files", () => {
    const s = initialState();
    s.saved = [{ candidateId: "missing", jobId: s.jobs[0].id }];
    expect(() => parseState(JSON.stringify(s))).toThrow("Dotychczasowy stan");
    expect(() => parseState(" ".repeat(MAX_IMPORT_BYTES + 1))).toThrow("za duży");
  });
  it("accepts legacy appearance preferences without changing scenario data", () => {
    const state = initialState();
    for (const theme of ["dark", "system", "light"]) {
      expect(parseState(JSON.stringify({ ...state, theme }))).toEqual(state);
    }
  });
  it("resumes version-1 drafts and keeps legacy submissions without a project response", () => {
    const state = initialState();
    state.activePersonId = "candidate-anna";
    const draft = {
      candidateId: "candidate-anna",
      jobId: state.jobs[0].id,
      notes: "Legacy source notes",
      generated: "Legacy proposal",
      answer: "Approved answer with sufficient context.",
    };
    state.drafts.push(draft);
    const imported = parseState(serializeState(state));
    expect(imported).toStrictEqual(state);
    const submitted = transition(imported, {
      type: "submit",
      ...draft,
      projectAnswer: "An answer for a question that is not present.",
      consent: true,
    });
    expect(submitted.applications.at(-1)).toMatchObject({
      answer: draft.answer,
      sourceNotes: draft.notes,
      generatedAnswer: draft.generated,
    });
    expect(submitted.applications.at(-1)).not.toHaveProperty("projectResponse");
    expect(submitted.applications[0]).toEqual(state.applications[0]);
  });
  it("round-trips a pending job revision, project draft and skipped submission", () => {
    const state = initialState();
    state.activePersonId = "employer-brightlabs";
    const job = { ...state.jobs[0], projectQuestion: "Za co odpowiadałeś osobiście?" };
    let next = transition(state, { type: "publish", job });
    const revision = {
      ...job,
      publicationStatus: "draft" as const,
      projectQuestion: "Jaki był efekt?",
    };
    next = transition(next, { type: "save_job_draft", job: revision });
    expect(next.jobs[0]).toStrictEqual(job);
    expect(next.jobRevisions).toStrictEqual([revision]);
    next = transition(next, { type: "select_person", id: "candidate-anna" });
    const input = {
      jobId: job.id,
      notes: "",
      generated: "",
      answer: "Approved answer with sufficient context.",
    };
    next = transition(next, { type: "draft", ...input, projectAnswer: "  Własny wkład.  " });
    const storage = memory();
    saveState(storage, next);
    const loaded = readState(storage).state;
    expect(loaded).toStrictEqual(next);
    expect(loaded.drafts[0].projectResponse).toEqual({
      question: job.projectQuestion,
      answer: "Własny wkład.",
    });
    next = transition(loaded, { type: "submit", ...input, projectAnswer: "  ", consent: true });
    expect(parseState(serializeState(next)).applications.at(-1)?.projectResponse).toEqual({
      question: job.projectQuestion,
      answer: "",
    });
    expect(next.drafts).toHaveLength(0);
    expect(() =>
      parseState(serializeState({ ...next, jobRevisions: [{ ...revision, slug: "wrong-slug" }] })),
    ).toThrow("Nieprawidłowy plik");
  });
});
