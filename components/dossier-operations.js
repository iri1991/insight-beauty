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
          setError("Salvarea a eșuat. Verifică conexiunea și încearcă din nou.");
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
            setError(payload.error || "Nu am putut adăuga ședința.");
            return;
          }

          setSessionDate("");
          setSessionService("");
          setSessionObjective("");
          setSessionStatus("scheduled");
          setSessionNotes("");
          setSessionOutcome("");
          setFeedback("Ședința a fost adăugată în istoric.");
          router.refresh();
        } catch (requestError) {
          setError("Adăugarea ședinței a eșuat. Verifică conexiunea și încearcă din nou.");
        }
      })();
    });
  }

  return (
    <div className="card-grid two-up">
      <article className="detail-card stack">
        <div>
          <span className="eyebrow">Plan de îngrijire</span>
          <h3>Actualizează planul de tratament</h3>
        </div>

        <label className="field">
          <span>Rezumat plan</span>
          <textarea rows={3} value={planSummary} onChange={(event) => setPlanSummary(event.target.value)} />
        </label>

        <div className="field-grid">
          <label className="field">
            <span>Status plan</span>
            <select value={planStatus} onChange={(event) => setPlanStatus(event.target.value)}>
              <option value="draft">Draft</option>
              <option value="pending-debrief">Necesită debriefing</option>
              <option value="active">Activ</option>
              <option value="paused">În pauză</option>
              <option value="completed">Finalizat</option>
            </select>
          </label>
          <label className="field">
            <span>Cadență ședințe</span>
            <input
              value={cadence}
              onChange={(event) => setCadence(event.target.value)}
              placeholder="ex. 1 ședință la 2 săptămâni"
            />
          </label>
          <label className="field">
            <span>Cadență revizuire</span>
            <input
              value={reviewCadence}
              onChange={(event) => setReviewCadence(event.target.value)}
              placeholder="ex. revizuire lunară"
            />
          </label>
        </div>

        <label className="field">
          <span>Obiective</span>
          <textarea
            rows={4}
            value={goals}
            onChange={(event) => setGoals(event.target.value)}
            placeholder="un obiectiv pe linie"
          />
        </label>

        <label className="field">
          <span>Protocoale în cabinet</span>
          <textarea
            rows={4}
            value={inCabinProtocols}
            onChange={(event) => setInCabinProtocols(event.target.value)}
            placeholder="un protocol pe linie"
          />
        </label>

        <label className="field">
          <span>Rutină acasă</span>
          <textarea
            rows={4}
            value={homecare}
            onChange={(event) => setHomecare(event.target.value)}
            placeholder="un pas pe linie"
          />
        </label>

        <div className="field-grid">
          <label className="field">
            <span>Tendință</span>
            <select value={trend} onChange={(event) => setTrend(event.target.value)}>
              <option value="baseline">Baseline</option>
              <option value="upward">În îmbunătățire</option>
              <option value="stable">Stabil</option>
              <option value="downward">În regresie</option>
            </select>
          </label>
          <label className="field">
            <span>Focus actual</span>
            <input
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
              placeholder="ex. refacere barieră cutanată"
            />
          </label>
          <label className="field">
            <span>Următoarea ședință</span>
            <input
              type="datetime-local"
              value={nextSessionDate}
              onChange={(event) => setNextSessionDate(event.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span>Stare inițială (baseline)</span>
          <textarea rows={3} value={baseline} onChange={(event) => setBaseline(event.target.value)} />
        </label>

        <label className="field">
          <span>Stare curentă</span>
          <textarea rows={3} value={current} onChange={(event) => setCurrent(event.target.value)} />
        </label>

        <div className="field-grid">
          <label className="field">
            <span>Preocupări principale</span>
            <textarea rows={4} value={concerns} onChange={(event) => setConcerns(event.target.value)} />
          </label>
          <label className="field">
            <span>Semnale de risc</span>
            <textarea rows={4} value={flags} onChange={(event) => setFlags(event.target.value)} />
          </label>
        </div>

        {error ? <p className="inline-error">{error}</p> : null}
        {feedback ? <p className="inline-success">{feedback}</p> : null}

        <div className="button-row">
          <button className="button primary" type="button" disabled={isPending} onClick={handleSavePlan}>
            {isPending ? "Se salvează…" : "Salvează planul"}
          </button>
        </div>
      </article>

      <article className="detail-card stack">
        <div>
          <span className="eyebrow">Jurnal ședințe</span>
          <h3>Adaugă o ședință sau un follow-up</h3>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>Dată</span>
            <input type="date" value={sessionDate} onChange={(event) => setSessionDate(event.target.value)} />
          </label>
          <label className="field">
            <span>Serviciu</span>
            <input
              value={sessionService}
              onChange={(event) => setSessionService(event.target.value)}
              placeholder="ex. LED calmare"
            />
          </label>
          <label className="field">
            <span>Status</span>
            <select value={sessionStatus} onChange={(event) => setSessionStatus(event.target.value)}>
              <option value="scheduled">Programată</option>
              <option value="completed">Finalizată</option>
              <option value="cancelled">Anulată</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span>Obiectiv</span>
          <input
            value={sessionObjective}
            onChange={(event) => setSessionObjective(event.target.value)}
            placeholder="ex. reducere inflamație"
          />
        </label>

        <label className="field">
          <span>Note de ședință</span>
          <textarea rows={4} value={sessionNotes} onChange={(event) => setSessionNotes(event.target.value)} />
        </label>

        <label className="field">
          <span>Rezultat</span>
          <textarea rows={3} value={sessionOutcome} onChange={(event) => setSessionOutcome(event.target.value)} />
        </label>

        {error ? <p className="inline-error">{error}</p> : null}
        {feedback ? <p className="inline-success">{feedback}</p> : null}

        <div className="button-row">
          <button className="button primary" type="button" disabled={isPending} onClick={handleAppendSession}>
            {isPending ? "Se adaugă…" : "Adaugă ședința"}
          </button>
        </div>
      </article>
    </div>
  );
}
