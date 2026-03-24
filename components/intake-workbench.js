"use client";

import { useMemo, useState, useTransition } from "react";

function buildInitialAnswers(questionnaire) {
  if (!questionnaire) return {};
  return (questionnaire.questions || []).reduce((state, q) => {
    state[q.id] = "";
    return state;
  }, {});
}

function parseDisplayName(displayName) {
  const parts = (displayName || "").trim().split(" ");
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" };
}

export function IntakeWorkbench({ questionnaires, currentUser, shareContext, existingProfile }) {
  const questionnaireMap = useMemo(
    () => Object.fromEntries(questionnaires.map((q) => [q.slug, q])),
    [questionnaires]
  );

  const initialSlug = shareContext?.questionnaireSlug && questionnaireMap[shareContext.questionnaireSlug]
    ? shareContext.questionnaireSlug
    : questionnaires[0]?.slug || "";

  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [answers, setAnswers] = useState(buildInitialAnswers(questionnaireMap[initialSlug]));

  const parsedName = parseDisplayName(currentUser?.displayName);
  const [phone, setPhone] = useState(existingProfile?.phone || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedQuestionnaire = questionnaireMap[selectedSlug];
  const hasContext = Boolean(shareContext || existingProfile);

  function handleQuestionnaireChange(nextSlug) {
    setSelectedSlug(nextSlug);
    setAnswers(buildInitialAnswers(questionnaireMap[nextSlug]));
    setResult(null);
    setError("");
  }

  function handleSubmit() {
    if (!hasContext) {
      setError("Nu există context de salon/profesionist. Accesați pagina printr-un link primit de la profesionistul dvs.");
      return;
    }

    setError("");
    startTransition(() => {
      void (async () => {
        try {
          const body = {
            questionnaireSlug: selectedSlug,
            answers
          };

          if (shareContext) {
            body.salonSlug = shareContext.salonSlug;
            body.professionalId = shareContext.professionalId;
          }

          if (phone.trim()) {
            body.phone = phone.trim();
          }

          const response = await fetch("/api/intake/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });

          const payload = await response.json();

          if (!response.ok) {
            setResult(null);
            setError(payload.error || "Nu am putut procesa evaluarea.");
            return;
          }

          setResult(payload);
        } catch {
          setResult(null);
          setError("Eroare de rețea. Verificați conexiunea și încercați din nou.");
        }
      })();
    });
  }

  return (
    <div className="workspace-grid">
      <section className="panel form-shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Evaluare personalizată</span>
            <h1>Chestionar de evaluare a pielii</h1>
          </div>
          <span className="tag tag-soft">date confidențiale</span>
        </div>

        {/* Context banner */}
        {shareContext ? (
          <div className="banner banner-context">
            <div className="banner-row">
              <strong>{shareContext.professionalName}</strong>
              <span className="tag tag-soft">{shareContext.salonName}</span>
            </div>
            <p>Link de evaluare primit de la profesionistul tău. Contextul a fost pre-setat automat.</p>
          </div>
        ) : existingProfile ? (
          <div className="banner banner-profile">
            <p>Evaluare asociată automat cu profilul tău existent din salon.</p>
          </div>
        ) : (
          <div className="banner banner-warn">
            <p>
              <strong>Atenție:</strong> Nu ai un link de evaluare de la un profesionist. Accesează pagina prin
              linkul primit prin email sau contactează salonul tău.
            </p>
          </div>
        )}

        {/* Date identificare (pre-completate, read-only) */}
        <div className="auth-identity-card">
          <div className="identity-row">
            <span className="field-label">Evaluat ca</span>
            <strong>
              {existingProfile?.firstName || parsedName.firstName}{" "}
              {existingProfile?.lastName || parsedName.lastName}
            </strong>
          </div>
          <div className="identity-row">
            <span className="field-label">Email</span>
            <strong>{currentUser?.email}</strong>
          </div>
          {!existingProfile?.phone && (
            <div className="identity-row">
              <span className="field-label">Telefon</span>
              <input
                className="field-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+40 7xx xxx xxx"
              />
            </div>
          )}
        </div>

        {/* Selector chestionar */}
        {!shareContext?.questionnaireSlug && (
          <div className="field-group">
            <label className="field-label">Chestionar de completat</label>
            <select
              className="field-input"
              value={selectedSlug}
              onChange={(e) => handleQuestionnaireChange(e.target.value)}
            >
              {questionnaires.map((q) => (
                <option key={q.slug} value={q.slug}>
                  {q.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {shareContext?.questionnaireSlug && selectedQuestionnaire && (
          <div className="questionnaire-title-row">
            <span className="eyebrow">Chestionar selectat</span>
            <h2>{selectedQuestionnaire.title}</h2>
          </div>
        )}

        {/* Întrebări */}
        <div className="question-stack">
          {(selectedQuestionnaire?.questions || []).map((question) => (
            <article key={question.id} className="question-card">
              <div className="question-head">
                <h3>{question.label}</h3>
              </div>
              <div className="option-grid">
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`option-card${isSelected ? " active" : ""}`}
                      onClick={() =>
                        setAnswers((current) => ({ ...current, [question.id]: option.value }))
                      }
                    >
                      <span>{option.label}</span>
                      <strong>{option.points}p</strong>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        {error ? <p className="inline-error">{error}</p> : null}

        <div className="button-row">
          <button
            className="button primary"
            type="button"
            disabled={isPending || !hasContext}
            onClick={handleSubmit}
          >
            {isPending ? "Se procesează..." : "Trimite evaluarea"}
          </button>
          <p className="helper-copy">
            Fișa ta personală se actualizează automat și vei primi un email cu rezultatele.
          </p>
        </div>
      </section>

      {/* Rezultate */}
      <aside className="panel results-shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Rezultat</span>
            <h2>Interpretare și recomandări</h2>
          </div>
        </div>

        {result ? (
          <div className="stack">
            <div className="hero-card inset-card result-spotlight">
              <p className="metric-caption">{result.questionnaire?.title}</p>
              <h3>{result.evaluation?.band?.label}</h3>
              <p className="lead-copy">{result.evaluation?.band?.summary}</p>
              {typeof result.evaluation?.score === "number" ? (
                <div className="metric-row">
                  <span>Scor calculat</span>
                  <strong>{result.evaluation.score}p</strong>
                </div>
              ) : null}
              {result.evaluation?.code ? (
                <div className="metric-row">
                  <span>Tipologie Baumann</span>
                  <strong className="tag">{result.evaluation.code}</strong>
                </div>
              ) : null}
              {result.evaluation?.band?.recommendation ? (
                <div className="result-recommendation" style={{ marginTop: "0.75rem" }}>
                  <span className="field-label">Recomandare</span>
                  <p>{result.evaluation.band.recommendation}</p>
                </div>
              ) : null}
            </div>

            <div className="detail-card">
              <span className="eyebrow">Fișa personală</span>
              <h3>#{result.dossier?.dossierId?.slice(-8)?.toUpperCase()}</h3>
              <p className="helper-copy">
                {result.emailSent
                  ? "Email de confirmare trimis. Verificați căsuța poștală."
                  : "Datele au fost salvate în fișa ta personală."}
              </p>
              <a className="text-link" href="/client/portal">
                Vezi fișa completă →
              </a>
            </div>

            {result.dossier?.nextStep ? (
              <div className="detail-card">
                <span className="eyebrow">Pasul următor</span>
                <p>{result.dossier.nextStep.note}</p>
                <div className="metric-row">
                  <span>Interval propus</span>
                  <strong>{result.dossier.nextStep.slotWindow}</strong>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="empty-state">
            <p>Rezultatul evaluării va apărea aici după completarea chestionarului.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
