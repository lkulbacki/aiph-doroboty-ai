import { useLayoutEffect, useRef, useState } from "react";
import { usePostHog } from "@posthog/react";
import { SecondaryButton } from "@/components/editaurus/secondary-button";
import { ApplicationRecord } from "./application-record";
import type { Application } from "./model";
import { usePrototype } from "./store";

export function CandidateApplication({ application }: { application: Application }) {
  const { state, run } = usePrototype();
  const posthog = usePostHog();
  const [confirming, setConfirming] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const statusRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const focusAfter = useRef<"status" | "trigger" | "confirm" | null>(null);
  const company = state.companies.find((item) => item.id === application.companyId);
  const terminal = ["withdrawn", "rejected", "hired"].includes(application.stage);

  useLayoutEffect(() => {
    const targets = { status: statusRef, trigger: triggerRef, confirm: confirmRef };
    if (focusAfter.current) targets[focusAfter.current].current?.focus();
    focusAfter.current = null;
  }, [confirming, application.stage]);

  return (
    <>
      <ApplicationRecord
        application={application}
        companyName={company?.name ?? ""}
        audience="candidate"
        history={application.events.map(({ stage, at }) => ({ stage, at }))}
        statusRef={statusRef}
        footer={
          terminal ? (
            <p className="record-caption">
              {application.stage === "withdrawn"
                ? "Aplikacja została wycofana."
                : "Proces rekrutacyjny został zakończony."}
            </p>
          ) : confirming ? (
            <div className="record-withdrawal">
              <p>Czy na pewno chcesz wycofać aplikację?</p>
              <div className="record-actions">
                <SecondaryButton
                  ref={confirmRef}
                  className="editaurus-danger-button"
                  onClick={() => {
                    if (run({ type: "withdraw", applicationId: application.id })) {
                      posthog.capture("application_withdrawn");
                      focusAfter.current = "status";
                      setConfirming(false);
                      setAnnouncement("Aplikacja została wycofana.");
                    }
                  }}
                >
                  Potwierdź wycofanie
                </SecondaryButton>
                <SecondaryButton
                  onClick={() => {
                    focusAfter.current = "trigger";
                    setConfirming(false);
                  }}
                >
                  Anuluj
                </SecondaryButton>
              </div>
            </div>
          ) : (
            <div className="record-withdrawal">
              <p className="record-caption">
                To kopia aplikacji z momentu wysłania. Późniejsze zmiany profilu jej nie zmieniają.
              </p>
              <div className="record-actions">
                <SecondaryButton
                  ref={triggerRef}
                  onClick={() => {
                    focusAfter.current = "confirm";
                    setConfirming(true);
                  }}
                >
                  Wycofaj aplikację
                </SecondaryButton>
              </div>
            </div>
          )
        }
      />
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
