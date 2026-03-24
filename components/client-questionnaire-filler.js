"use client";

import { useState, useTransition } from "react";

export function ClientQuestionnaireFiller({ questionnaire }) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const questions = questionnaire.questions || [];
  const dimensions = questionnaire.dimensions ? Object.values(questionnaire.dimensions) : [];
  const isBaumann = questionnaire.kind === "baumann-dimensions";

  function setAnswer(id, val) {
    setAnswers((p) => ({ ...p, [id]: val }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const totalFields = isBaumann ? dimensions.length : questions.length;
    if (Object.keys(answers).length < totalFields) {
      setError("Completează toate câmpurile.");
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          const res = await fetch("/api/intake/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionnaireSlug: questionnaire.slug, answers })
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || "Eroare la salvare.");
            return;
          }
          setResult(data);
          setOpen(false);
        } catch {
          setError("Eroare de rețea.");
        }
      })();
    });
  }

  if (result) {
    const band = result.evaluation?.band;
    return (
      <div className="form-success" style={{ marginTop: "1rem" }}>
        <strong>Evaluare înregistrată!</strong>
        {band?.label ? <> · {band.label}</> : null}
        {typeof result.evaluation?.score === "number" ? <> · {result.evaluation.score}p</> : null}
        <br />
        <span className="helper-copy">Datele au fost salvate în fișa ta. Reîncarcă pagina pentru a vedea progresul.</span>
      </div>
    );
  }

  if (!open) {
    return (
      <button className="button primary small" style={{ marginTop: "0.75rem" }} onClick={() => setOpen(true)} type="button">
        Completează acum →
      </button>
    );
  }

  return (
    <div className="client-filler-panel">
      <form className="form-stack" onSubmit={handleSubmit}>
        {isBaumann ? (
          dimensions.map((dim) => (
            <div key={dim.id} className="field-group">
              <label className="field-label">{dim.label || dim.id} — {dim.inputLabel}</label>
              <input
                className="field-input"
                type="number"
                value={answers[dim.id] || ""}
                onChange={(e) => setAnswer(dim.id, e.target.value)}
                placeholder={`Scor ${dim.label}`}
                min={0} max={200}
              />
            </div>
          ))
        ) : (
          questions.map((q) => (
            <div key={q.id} className="field-group intake-question">
              <label className="field-label">{q.label}</label>
              <div className="intake-options compact">
                {q.options.map((opt) => (
                  <label key={opt.value} className={`intake-option${answers[q.id] === opt.value ? " selected" : ""}`}>
                    <input
                      type="radio"
                      name={`cf-${questionnaire.slug}-${q.id}`}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => setAnswer(q.id, opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions">
          <button className="button secondary small" type="button" onClick={() => { setOpen(false); setAnswers({}); setError(""); }}>
            Anulează
          </button>
          <button className="button primary small" type="submit" disabled={isPending}>
            {isPending ? "Se salvează…" : "Trimite evaluarea"}
          </button>
        </div>
      </form>
    </div>
  );
}
