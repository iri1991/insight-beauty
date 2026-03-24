"use client";

import { useState, useTransition } from "react";

/* ─── Step indicators ────────────────────────────────────────────── */
const STEPS = ["Client", "Chestionar", "Răspunsuri", "Rezultat"];

function StepBar({ current }) {
  return (
    <div className="step-bar">
      {STEPS.map((label, i) => (
        <div key={label} className={`step-item${i <= current ? " step-active" : ""}${i === current ? " step-current" : ""}`}>
          <div className="step-dot">{i < current ? "✓" : i + 1}</div>
          <span>{label}</span>
          {i < STEPS.length - 1 ? <div className="step-line" /> : null}
        </div>
      ))}
    </div>
  );
}

/* ─── Step 1: Client selection ───────────────────────────────────── */
function StepClient({ clients, onSelect }) {
  const [mode, setMode] = useState(clients.length > 0 ? "existing" : "new");
  const [search, setSearch] = useState("");
  const [newClient, setNewClient] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [error, setError] = useState("");

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.firstName?.toLowerCase().includes(q) ||
      c.lastName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  function handleNewSubmit(e) {
    e.preventDefault();
    if (!newClient.firstName || !newClient.lastName || !newClient.email) {
      setError("Prenumele, numele și emailul sunt obligatorii.");
      return;
    }
    onSelect({ type: "new", data: newClient });
  }

  return (
    <div className="intake-step">
      <div className="intake-step-header">
        <h2>Selectează clientul</h2>
        <p className="helper-copy">Alege un client existent din salon sau adaugă unul nou.</p>
      </div>

      {clients.length > 0 ? (
        <div className="tab-toggle">
          <button className={`tab-btn${mode === "existing" ? " active" : ""}`} onClick={() => setMode("existing")} type="button">
            Client existent ({clients.length})
          </button>
          <button className={`tab-btn${mode === "new" ? " active" : ""}`} onClick={() => setMode("new")} type="button">
            Client nou
          </button>
        </div>
      ) : null}

      {mode === "existing" ? (
        <div className="client-select-panel">
          <input
            className="field-input"
            placeholder="Caută după nume sau email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="client-list">
            {filtered.length === 0 ? (
              <p className="helper-copy">Niciun client găsit.</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c._id}
                  className="client-row"
                  type="button"
                  onClick={() => onSelect({ type: "existing", data: c })}
                >
                  <div className="client-row-info">
                    <strong>{c.firstName} {c.lastName}</strong>
                    <span className="helper-copy">{c.email}</span>
                  </div>
                  <div className="client-row-meta">
                    {c.baumannType ? <span className="tag">{c.baumannType}</span> : null}
                    {c.latestAssessment?.label ? (
                      <span className="tag tag-soft">{c.latestAssessment.label}</span>
                    ) : null}
                    <span className="tag tag-soft">{c.assessmentHistory?.length || 0} eval.</span>
                  </div>
                </button>
              ))
            )}
          </div>
          <button
            className="text-link"
            style={{ marginTop: "0.5rem" }}
            type="button"
            onClick={() => setMode("new")}
          >
            + Adaugă client nou
          </button>
        </div>
      ) : (
        <form className="form-stack" onSubmit={handleNewSubmit}>
          <div className="field-row two-col">
            <div className="field-group">
              <label className="field-label">Prenume *</label>
              <input className="field-input" value={newClient.firstName}
                onChange={(e) => setNewClient((p) => ({ ...p, firstName: e.target.value }))}
                placeholder="Ana" autoFocus />
            </div>
            <div className="field-group">
              <label className="field-label">Nume *</label>
              <input className="field-input" value={newClient.lastName}
                onChange={(e) => setNewClient((p) => ({ ...p, lastName: e.target.value }))}
                placeholder="Ionescu" />
            </div>
          </div>
          <div className="field-row two-col">
            <div className="field-group">
              <label className="field-label">Email *</label>
              <input className="field-input" type="email" value={newClient.email}
                onChange={(e) => setNewClient((p) => ({ ...p, email: e.target.value }))}
                placeholder="ana@email.ro" />
            </div>
            <div className="field-group">
              <label className="field-label">Telefon</label>
              <input className="field-input" type="tel" value={newClient.phone}
                onChange={(e) => setNewClient((p) => ({ ...p, phone: e.target.value }))}
                placeholder="07xx xxx xxx" />
            </div>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-actions">
            <button className="button primary" type="submit">Continuă cu clientul nou →</button>
          </div>
          <p className="helper-copy" style={{ marginTop: 0 }}>
            Se va crea automat un cont client și o fișă personală.
          </p>
        </form>
      )}
    </div>
  );
}

/* ─── Step 2: Questionnaire selection ───────────────────────────── */
function StepQuestionnaire({ questionnaires, selectedClient, onSelect, onBack }) {
  return (
    <div className="intake-step">
      <div className="intake-step-header">
        <h2>Selectează chestionarul</h2>
        <p className="helper-copy">
          Client: <strong>{selectedClient?.firstName} {selectedClient?.lastName}</strong>
        </p>
      </div>
      <div className="questionnaire-select-grid">
        {questionnaires.map((q) => (
          <button key={q.slug} className="q-select-card" type="button" onClick={() => onSelect(q)}>
            <div className="q-select-meta">
              <span className="tag">{q.kind}</span>
              <span className="tag tag-soft">{q.audience}</span>
            </div>
            <h3>{q.title}</h3>
            <p className="helper-copy">{q.description || `${q.questions?.length || 0} întrebări`}</p>
          </button>
        ))}
      </div>
      <button className="text-link" onClick={onBack} type="button">← Schimbă clientul</button>
    </div>
  );
}

/* ─── Step 3: Answer filling ─────────────────────────────────────── */
function StepAnswers({ questionnaire, selectedClient, onSubmit, onBack, isPending }) {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  const questions = questionnaire.questions || [];
  const isBaumann = questionnaire.kind === "baumann-dimensions";
  const dimensions = questionnaire.dimensions ? Object.values(questionnaire.dimensions) : [];

  function setAnswer(id, val) {
    setAnswers((p) => ({ ...p, [id]: val }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const totalFields = isBaumann ? dimensions.length : questions.length;
    if (Object.keys(answers).length < totalFields) {
      setError("Completează toate câmpurile înainte de a continua.");
      return;
    }
    onSubmit(answers);
  }

  return (
    <div className="intake-step">
      <div className="intake-step-header">
        <h2>{questionnaire.title}</h2>
        <p className="helper-copy">
          Client: <strong>{selectedClient?.firstName} {selectedClient?.lastName}</strong>
        </p>
      </div>

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
                placeholder={`Introdu scorul pentru ${dim.label || dim.id}`}
                min={0} max={200}
              />
              <span className="field-hint">
                Interval: {dim.bands?.[0]?.min ?? "—"} – {dim.bands?.[dim.bands.length - 1]?.max ?? "—"}
              </span>
            </div>
          ))
        ) : (
          questions.map((q) => (
            <div key={q.id} className="field-group intake-question">
              <label className="field-label">{q.label}</label>
              <div className="intake-options">
                {q.options.map((opt) => (
                  <label key={opt.value} className={`intake-option${answers[q.id] === opt.value ? " selected" : ""}`}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => setAnswer(q.id, opt.value)}
                    />
                    <span>{opt.label}</span>
                    <span className="option-pts-badge">{opt.points}p</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions" style={{ justifyContent: "space-between" }}>
          <button className="button secondary" type="button" onClick={onBack}>← Schimbă chestionarul</button>
          <button className="button primary" type="submit" disabled={isPending}>
            {isPending ? "Se evaluează…" : "Trimite evaluarea →"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Step 4: Results ────────────────────────────────────────────── */
function StepResults({ result, selectedClient, onReset }) {
  const { evaluation, dossier, questionnaire } = result;
  const band = evaluation?.band;
  const dims = evaluation?.dimensions;

  return (
    <div className="intake-step">
      <div className="intake-step-header">
        <div className="result-badge">✓</div>
        <h2>Evaluare înregistrată</h2>
        <p className="helper-copy">
          <strong>{selectedClient?.firstName} {selectedClient?.lastName}</strong> · {questionnaire?.title}
        </p>
      </div>

      {band ? (
        <div className="result-card-spotlight">
          <div className="result-band-label">{band.label}</div>
          {typeof evaluation?.score === "number" ? (
            <div className="result-score">{evaluation.score} puncte</div>
          ) : null}
          {evaluation?.code ? (
            <div className="baumann-code-badge">{evaluation.code}</div>
          ) : null}
          {band.summary ? <p className="result-summary">{band.summary}</p> : null}
          {band.recommendation ? (
            <div className="result-recommendation">
              <span className="field-label">Recomandare</span>
              <p>{band.recommendation}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {dims?.length > 0 ? (
        <div className="dims-result-grid">
          {dims.filter((d) => !d.missing).map((d) => (
            <div key={d.id} className="dim-result-card">
              <span className="dim-code">{d.code}</span>
              <span className="dim-label">{d.label}</span>
              <span className="dim-band">{d.band?.label}</span>
              <span className="helper-copy">{d.score}p</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="form-actions" style={{ marginTop: "1.5rem" }}>
        <a className="button secondary" href={`/salon/${dossier?.salonSlug || ""}`}>
          Înapoi la salon
        </a>
        <button className="button primary" type="button" onClick={onReset}>
          + Evaluare nouă
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export function ProfessionalIntake({ clients, questionnaires }) {
  const [step, setStep] = useState(0);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClientSelect(selection) {
    setSelectedClient(selection);
    setStep(1);
  }

  function handleQuestionnaireSelect(q) {
    setSelectedQuestionnaire(q);
    setStep(2);
  }

  function handleSubmit(answers) {
    setError("");
    const body = {
      questionnaireSlug: selectedQuestionnaire.slug,
      answers
    };

    if (selectedClient.type === "existing") {
      body.clientId = selectedClient.data._id;
    } else {
      body.newClient = selectedClient.data;
    }

    startTransition(() => {
      void (async () => {
        try {
          const res = await fetch("/api/intake/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || "Eroare la salvare.");
            return;
          }
          setResult(data);
          setStep(3);
        } catch {
          setError("Eroare de rețea.");
        }
      })();
    });
  }

  function handleReset() {
    setStep(0);
    setSelectedClient(null);
    setSelectedQuestionnaire(null);
    setResult(null);
    setError("");
  }

  const clientData = selectedClient?.data;

  return (
    <div className="professional-intake-shell">
      <StepBar current={step} />
      {error ? <div className="form-error" style={{ margin: "0 0 1rem" }}>{error}</div> : null}

      {step === 0 ? <StepClient clients={clients} onSelect={handleClientSelect} /> : null}
      {step === 1 ? (
        <StepQuestionnaire
          questionnaires={questionnaires}
          selectedClient={clientData}
          onSelect={handleQuestionnaireSelect}
          onBack={() => setStep(0)}
        />
      ) : null}
      {step === 2 ? (
        <StepAnswers
          questionnaire={selectedQuestionnaire}
          selectedClient={clientData}
          onSubmit={handleSubmit}
          onBack={() => setStep(1)}
          isPending={isPending}
        />
      ) : null}
      {step === 3 && result ? (
        <StepResults result={result} selectedClient={clientData} onReset={handleReset} />
      ) : null}
    </div>
  );
}
