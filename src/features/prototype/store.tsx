import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { initialState, transition, type Action, type State } from "./model";
import {
  MAX_IMPORT_BYTES,
  serializeState,
  parseState,
  readState,
  saveState,
  type StoragePort,
} from "./storage";
function browserStorage(): StoragePort | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function useStore() {
  const [loaded] = useState(() => readState(browserStorage()));
  const [state, setState] = useState(loaded.state);
  const [issue, setIssue] = useState(loaded.issue);
  const [error, setError] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [blocked, setBlocked] = useState(loaded.blocked);
  const latest = useRef(state);
  function commit(next: State, replace = false) {
    latest.current = next;
    setState(next);
    setError("");
    setRecoveryMessage("");
    if (blocked && !replace) return;
    try {
      saveState(browserStorage(), next);
      setIssue("");
      if (replace) setBlocked(false);
    } catch (e) {
      setIssue((e as Error).message);
    }
  }
  function run(action: Action) {
    try {
      const next = transition(latest.current, action);
      if (
        ((action.type === "draft" && action.recording) ||
          (action.type === "submit" && action.voice)) &&
        new TextEncoder().encode(serializeState(next)).length > MAX_IMPORT_BYTES
      )
        throw new Error(
          "Zapis scenariusza przekroczyłby 2 MB. Skróć nagranie lub wpisz odpowiedź.",
        );
      commit(next);
      return true;
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "ZodError"
          ? e.message
          : "Sprawdź poprawność i długość wprowadzonych danych.",
      );
      return false;
    }
  }
  function importState(raw: string) {
    setRecoveryMessage("");
    try {
      const next = parseState(raw);
      commit(next, true);
      setRecoveryMessage("Dane zostały zaimportowane.");
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  return {
    state,
    issue,
    error,
    blocked,
    original: loaded.original,
    run,
    importState,
    recoveryMessage,
    clearFeedback: () => {
      setError("");
      setRecoveryMessage("");
    },
    reset: () => {
      commit(initialState(), true);
      setRecoveryMessage("Przywrócono scenariusz początkowy.");
    },
  };
}
type Store = ReturnType<typeof useStore>;
const Context = createContext<Store | null>(null);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function usePrototype() {
  const store = useContext(Context);
  if (!store) throw new Error("PrototypeProvider is required");
  return store;
}
