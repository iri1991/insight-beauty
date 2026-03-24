"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function toLines(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function fromLines(value) {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function DossierOperations({
  clientId,
  treatmentProgram,
  treatmentPlanSummary,
  progressSnapshot,
  primaryConcerns,
  riskFlags,
  nextSession
}) {
  const router = useRouter();
  const [planSummary, setPlanSummary] = useState(treatmentPlanSummary);
  const [planStatus, setPlanStatus] = useState(treatmentProgram?.status || "draft");
  const [cadence, setCadence] = useState(treatmentProgram?.cadence || "");
  const [reviewCadence, setReviewCadence] = useState(treatmentProgram?.reviewCadence || "");
  const [goals, setGoals] = useState(toLines(treatmentProgram?.goals));
  const [inCabinProtocols, setInCabinProtocols] = useState(toLines(treatmentProgram?.inCabinProtocols));
  const [homecare, setHomecare] = useState(toLines(treatmentProgram?.homecare));
  const [trend, setTrend] = useState(progressSnapshot?.trend || "baseline");
  const [focus, setFocus] = useState(progressSnapshot?.focus || "");
  const [baseline, setBaseline] = useState(progressSnapshot?.baseline || "");
  const [current, setCurrent] = useState(progressSnapshot?.current || "");
  const [concerns, setConcerns] = useState(toLines(primaryConcerns));
  const [flags, setFlags] = useState(toLines(riskFlags));
  const [nextSessionDate, setNextSessionDate] = useState(nextSession ? nextSession.slice(0, 16) : "");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionService, setSessionService] = useState("");
  const [sessionObjective, setSessionObjective] = useState("");
  const [sessionStatus, setSessionStatus] = useState("scheduled");
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionOutcome, setSessionOutcome] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSavePlan() {
    setFeedback("");
    setError("");

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/clients/${clientId}/care-plan`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              treatmentPlanSummary: planSummary,
              treatmentProgram: {
                status: planStatus,
                cadence,
                reviewCadence,
                goals: fromLines(goals),
                inCabinProtocols: fromLines(inCabinProtocols),
                homecare: fromLines(homecare)
              },
              progressSnapshot: {
                trend,
                focus,
                baseline,
                current
              },
              primaryConcerns: fromLines(concerns),
              riskFlags: fromLines(flags),
              nextSession: nextSessionDate ? new Date(nextSessionDate).toISOString() : null
            })
          });

          const payload = await response.json();

          if (!response.ok) {
            setError(payload.error || "Nu am putut salva planul.");
            return;
          }

          setFeedback("Planul de tratament a fost salvat.");
          router.refresh();
        } catch (requestError) {
          setError("Salvarea a esuat. Verifica ruta API si conexiunea la baza de date.");
        }
      })();
    });
  }

  function handleAppendSession() {
    setFeedback("");
    setError("");

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/clients/${clientId}/sessions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              date: sessionDate,
              service: sessionService,
              objective: sessionObjective,
              status: sessionStatus,
              notes: sessionNotes,
              outcome: sessionOutcome,
              nextSession: nextSessionDate ? new Date(nextSessionDate).toISOString() : null
            })
          });

          const payload = await response.json();

          if (!response.ok) {
            setError(payload.error || "Nu am putut adauga sedinta.");
            return;
          }

          setSessionDate("");
          setSessionService("");
          setSessionObjective("");
          setSessionStatus("scheduled");
          setSessionNotes("");
          setSessionOutcome("");
          setFeedback("Sedinta a fost adaugata in istoric.");
          router.refresh();
        } catch (requestError) {
          setError("Adaugarea sedintei a esuat. Verifica ruta API si conexiunea la baza de date.");
        }
      })();
    });
  }

  return (
    <div className="card-grid two-up">
      <article className="detail-card stack">
        <div>
          <span className="eyebrow">Plan operations</span>
          <h3>Actualizeaza planul de tratament</h3>
        </div>

        <label className="field">
          <span>Rezumat plan</span>
          <textarea rows={3} value={planSummary} onChange={(event) => setPlanSummary(event.target.value)} />
        </label>

        <div className="field-grid compact-grid">
          <label className="field">
            <span>Status</span>
            <select value={planStatus} onChange={(event) => setPlanStatus(event.target.value)}>
              <option value="draft">draft</option>
              <option value="pending-debrief">pending-debrief</option>
              <option value="active">active</option>
              <option value="paused">paused</option>
              <option value="completed">completed</option>
            </select>
          </label>
          <label className="field">
            <span>Cadenta</span>
            <input value={cadence} onChange={(event) => setCadence(event.target.value)} placeholder="1 sedinta la 2 saptamani" />
          </label>
          <label className="field">
            <span>Review cadence</span>
            <input
              value={reviewCadence}
              onChange={(event) => setReviewCadence(event.target.value)}
              placeholder="review lunar"
            />
          </label>
        </div>

        <label className="field">
          <span>Obiective</span>
          <textarea rows={4} value={goals} onChange={(event) => setGoals(event.target.value)} placeholder="un obiectiv pe linie" />
        </label>

        <label className="field">
          <span>Protocoale in cabinet</span>
          <textarea
            rows={4}
            value={inCabinProtocols}
            onChange={(event) => setInCabinProtocols(event.target.value)}
            placeholder="un protocol pe linie"
          />
        </label>

        <label className="field">
          <span>Homecare</span>
          <textarea rows={4} value={homecare} onChange={(event) => setHomecare(event.target.value)} placeholder="un pas pe linie" />
        </label>

        <div className="field-grid compact-grid">
          <label className="field">
            <span>Trend</span>
            <select value={trend} onChange={(event) => setTrend(event.target.value)}>
              <option value="baseline">baseline</option>
              <option value="upward">upward</option>
              <option value="stable">stable</option>
              <option value="downward">downward</option>
            </select>
          </label>
          <label className="field">
            <span>Focus</span>
            <input value={focus} onChange={(event) => setFocus(event.target.value)} placeholder="barrier reset" />
          </label>
          <label className="field">
            <span>Next session</span>
            <input
              type="datetime-local"
              value={nextSessionDate}
              onChange={(event) => setNextSessionDate(event.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span>Baseline</span>
          <textarea rows={3} value={baseline} onChange={(event) => setBaseline(event.target.value)} />
        </label>

        <label className="field">
          <span>Status curent</span>
          <textarea rows={3} value={current} onChange={(event) => setCurrent(event.target.value)} />
        </label>

        <div className="field-grid compact-grid">
          <label className="field">
            <span>Preocupari principale</span>
            <textarea rows={4} value={concerns} onChange={(event) => setConcerns(event.target.value)} />
          </label>
          <label className="field">
            <span>Risk flags</span>
            <textarea rows={4} value={flags} onChange={(event) => setFlags(event.target.value)} />
          </label>
        </div>

        {error ? <p className="inline-error">{error}</p> : null}
        {feedback ? <p className="inline-success">{feedback}</p> : null}

        <div className="button-row">
          <button className="button primary" type="button" disabled={isPending} onClick={handleSavePlan}>
            {isPending ? "Salvare..." : "Salveaza planul"}
          </button>
        </div>
      </article>

      <article className="detail-card stack">
        <div>
          <span className="eyebrow">Session logging</span>
          <h3>Adauga o sedinta sau un follow-up</h3>
        </div>

        <div className="field-grid compact-grid">
          <label className="field">
            <span>Data</span>
            <input type="date" value={sessionDate} onChange={(event) => setSessionDate(event.target.value)} />
          </label>
          <label className="field">
            <span>Serviciu</span>
            <input value={sessionService} onChange={(event) => setSessionService(event.target.value)} placeholder="LED calmare" />
          </label>
          <label className="field">
            <span>Status</span>
            <select value={sessionStatus} onChange={(event) => setSessionStatus(event.target.value)}>
              <option value="scheduled">scheduled</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span>Obiectiv</span>
          <input value={sessionObjective} onChange={(event) => setSessionObjective(event.target.value)} placeholder="reducere inflamatie" />
        </label>

        <label className="field">
          <span>Note</span>
          <textarea rows={4} value={sessionNotes} onChange={(event) => setSessionNotes(event.target.value)} />
        </label>

        <label className="field">
          <span>Outcome</span>
          <textarea rows={3} value={sessionOutcome} onChange={(event) => setSessionOutcome(event.target.value)} />
        </label>

        {error ? <p className="inline-error">{error}</p> : null}
        {feedback ? <p className="inline-success">{feedback}</p> : null}

        <div className="button-row">
          <button className="button secondary" type="button" disabled={isPending} onClick={handleAppendSession}>
            {isPending ? "Adaugare..." : "Adauga sedinta"}
          </button>
        </div>
      </article>
    </div>
  );
}
