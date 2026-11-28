import { useEffect, useRef, useState } from "react";
import { SecondaryButton } from "@/components/editaurus/secondary-button";
import {
  MAX_AUDIO_BYTES,
  MAX_RECORDING_SECONDS,
  recordingSchema,
  recordingUrl,
  type Recording,
} from "./project-ai";

const formats = [
  { format: "webm", mimeType: "audio/webm;codecs=opus" },
  { format: "ogg", mimeType: "audio/ogg;codecs=opus" },
  { format: "m4a", mimeType: "audio/mp4" },
] as const;

function readRecording(blob: Blob, format: Recording["format"]): Promise<Recording> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const parsed = recordingSchema.safeParse({
        format,
        data: String(reader.result).split(",", 2)[1],
      });
      if (parsed.success) resolve(parsed.data);
      else reject(new Error("Invalid recording."));
    };
    reader.readAsDataURL(blob);
  });
}

export function ProjectVoiceRecorder({
  recording,
  disabled,
  onChange,
  onBusyChange,
}: {
  recording: Recording | undefined;
  disabled: boolean;
  onChange: (recording: Recording | undefined) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [phase, setPhase] = useState<"idle" | "opening" | "recording" | "saving">("idle");
  const [error, setError] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const session = useRef<{ disposed: boolean; stop: () => void } | null>(null);

  useEffect(
    () => () => {
      if (session.current) {
        session.current.disposed = true;
        session.current.stop();
      }
    },
    [],
  );

  async function start() {
    if (session.current || disabled) return;
    setError("");
    const supported =
      typeof MediaRecorder !== "undefined" &&
      formats.find(({ mimeType }) => MediaRecorder.isTypeSupported(mimeType));
    if (!supported || !navigator.mediaDevices?.getUserMedia) {
      setError("Nagrywanie jest niedostępne w tej przeglądarce. Możesz wpisać odpowiedź.");
      return;
    }
    const current = { disposed: false, stop() {} };
    session.current = current;
    setElapsedSeconds(0);
    setPhase("opening");
    onBusyChange(true);
    let stream: MediaStream | undefined;
    let timer: number | undefined;
    let clock: number | undefined;
    function finish() {
      stream?.getTracks().forEach((track) => track.stop());
      window.clearTimeout(timer);
      window.clearInterval(clock);
      if (current.disposed) return;
      session.current = null;
      setPhase("idle");
      onBusyChange(false);
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } });
      if (current.disposed) {
        finish();
        return;
      }
      const recorder = new MediaRecorder(stream, {
        mimeType: supported.mimeType,
        audioBitsPerSecond: 32_000,
      });
      const chunks: Blob[] = [];
      let size = 0;
      current.stop = () => {
        if (recorder.state !== "inactive") recorder.stop();
        stream?.getTracks().forEach((track) => track.stop());
        window.clearTimeout(timer);
        window.clearInterval(clock);
        if (!current.disposed) setPhase("saving");
      };
      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
        size += event.data.size;
        if (size >= MAX_AUDIO_BYTES * 0.9 && recorder.state !== "inactive") current.stop();
      };
      recorder.onerror = () => {
        if (current.disposed) return;
        setError("Nagrywanie zostało przerwane. Spróbuj ponownie.");
        current.disposed = true;
        current.stop();
        session.current = null;
        setPhase("idle");
        onBusyChange(false);
      };
      recorder.onstop = async () => {
        if (current.disposed) return;
        try {
          if (size === 0 || size > MAX_AUDIO_BYTES) throw new Error("Invalid size.");
          const next = await readRecording(new Blob(chunks), supported.format);
          if (!current.disposed) onChange(next);
        } catch {
          if (!current.disposed)
            setError("Nie udało się zapisać nagrania. Spróbuj nagrać krótszą odpowiedź.");
        } finally {
          finish();
        }
      };
      recorder.start(250);
      const startedAt = performance.now();
      setPhase("recording");
      clock = window.setInterval(() => {
        setElapsedSeconds(
          Math.min(MAX_RECORDING_SECONDS, Math.floor((performance.now() - startedAt) / 1000)),
        );
      }, 250);
      timer = window.setTimeout(() => current.stop(), MAX_RECORDING_SECONDS * 1000);
    } catch {
      if (!current.disposed)
        setError("Brak dostępu do mikrofonu. Zezwól na nagrywanie lub wpisz odpowiedź.");
      finish();
    }
  }

  const elapsed = `${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, "0")}`;
  return (
    <div className="grid gap-3">
      {phase === "recording" && (
        <div className="project-recording-indicator">
          <span role="status">Nagrywanie trwa</span>
          <span className="project-recording-clock" role="timer" aria-label="Czas nagrania">
            {elapsed} / 1:00
          </span>
        </div>
      )}
      {recording && (
        <audio
          aria-label="Twoje nagranie"
          className="w-full"
          controls
          src={recordingUrl(recording)}
        />
      )}
      <div className="flex flex-wrap gap-2">
        <SecondaryButton
          type="button"
          onClick={() => (phase === "recording" ? session.current?.stop() : void start())}
          disabled={disabled || phase === "opening" || phase === "saving"}
        >
          {phase === "recording"
            ? "Zakończ nagrywanie"
            : recording
              ? "Nagraj ponownie"
              : "Nagraj odpowiedź"}
        </SecondaryButton>
        {recording && (
          <SecondaryButton
            type="button"
            onClick={() => onChange(undefined)}
            disabled={disabled || phase !== "idle"}
          >
            Usuń nagranie
          </SecondaryButton>
        )}
      </div>
      {(phase === "opening" || phase === "saving") && (
        <p className="application-help" role="status">
          {phase === "opening"
            ? "Oczekujemy na dostęp do mikrofonu…"
            : "Przygotowujemy nagranie do odsłuchu…"}
        </p>
      )}
      {error && (
        <p className="editaurus-form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
