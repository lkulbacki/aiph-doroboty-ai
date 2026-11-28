import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { initialState, transition, type Action, type State } from "./model";
import {
  MAX_IMPORT_BYTES,
  STORAGE_KEY,
  StorageConflictError,
  parseState,
  readState,
  saveState,
  serializeState,
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
  const snapshot = useRef(loaded.snapshot);
  const writer = useRef(false);
  useEffect(() => {
    let disposed = false;
    let release: (() => void) | undefined;
    const unavailable = () => {
      if (!disposed)
        setIssue(
          "Zapis jest zablokowany: ta przeglądarka nie udostępnia blokady kart. Otwórz prototyp w aktualnej przeglądarce pod adresem localhost lub 127.0.0.1.",
        );
    };
    if (!navigator.locks) {
      unavailable();
      return;
    }
    // StrictMode cleans up its first effect before this microtask acquires a lock.
    void Promise.resolve()
      .then(async () => {
        if (disposed) return;
        await navigator.locks.request(STORAGE_KEY, { ifAvailable: true }, async (lock) => {
          if (disposed) return;
          if (!lock) {
            setIssue(
              "Scenariusz jest otwarty do zapisu w innej karcie. Ta karta służy tylko do podglądu. Zamknij tamtą kartę i odśwież tę, aby kontynuować.",
            );
            return;
          }
          writer.current = true;
          await new Promise<void>((resolve) => {
            release = resolve;
          });
        });
      })
      .catch(unavailable);
    return () => {
      disposed = true;
      writer.current = false;
      release?.();
    };
  }, []);
  function commit(next: State, replace = false) {
    if (!writer.current) {
      setError(
        "Nie można zapisać w tej karcie. Zamknij inną kartę prototypu i odśwież tę stronę. Zachowaj treść formularza przed odświeżeniem.",
      );
      return false;
    }
    setError("");
    setRecoveryMessage("");
    if (!blocked || replace) {
      try {
        saveState(browserStorage(), next, snapshot.current);
        snapshot.current = serializeState(next);
        setIssue("");
        if (replace) setBlocked(false);
      } catch (e) {
        setIssue((e as Error).message);
        if (e instanceof StorageConflictError) return false;
      }
    }
    latest.current = next;
    setState(next);
    return true;
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
      return commit(next);
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
      if (!commit(next, true)) return false;
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
      if (!commit(initialState(), true)) return;
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
