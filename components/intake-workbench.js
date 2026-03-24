"use client";

import { useMemo, useState, useTransition } from "react";

function buildInitialAnswers(questionnaire) {
  if (!questionnaire) {
    return {};
  }

  return questionnaire.questions.reduce((state, question) => {
    state[question.id] = "";
    return state;
  }, {});
}

function getSalonBySlug(salons, salonSlug) {
  return salons.find((salon) => salon.slug === salonSlug) || null;
}

function getProfessionalLabel(professional) {
  return professional?.displayName || [professional?.firstName, professional?.lastName].filter(Boolean).join(" ").trim();
}

function findFirstProfessionalForSalon(salons, professionals, salonSlug) {
  const salon = getSalonBySlug(salons, salonSlug);

  return professionals.find((professional) => professional.salonId === salon?._id)?._id || "";
}

function findProfessionalById(professionals, professionalId) {
  return professionals.find((professional) => professional._id === professionalId) || null;
}

export function IntakeWorkbench({ questionnaires, salons, professionals, initialState, shareContext }) {
  const questionnaireMap = useMemo(
    () => Object.fromEntries(questionnaires.map((questionnaire) => [questionnaire.slug, questionnaire])),
    [questionnaires]
  );
  const initialQuestionnaireSlug =
    initialState?.questionnaireSlug && questionnaireMap[initialState.questionnaireSlug]
      ? initialState.questionnaireSlug
      : questionnaires[0]?.slug || "";
  const initialSalonSlug = initialState?.salonSlug || salons[0]?.slug || "";
  const initialProfessionalId =
    initialState?.professionalId || findFirstProfessionalForSalon(salons, professionals, initialSalonSlug);
  const initialProfessional = findProfessionalById(professionals, initialProfessionalId);

  const [selectedSlug, setSelectedSlug] = useState(initialQuestionnaireSlug);
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    salonSlug: initialSalonSlug,
    professionalId: initialProfessionalId,
    shareCode: shareContext?.shareCode || initialProfessional?.shareCode || ""
  });
  const [answers, setAnswers] = useState(buildInitialAnswers(questionnaireMap[initialQuestionnaireSlug]));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedQuestionnaire = questionnaireMap[selectedSlug];
  const selectedSalon = getSalonBySlug(salons, client.salonSlug);
  const filteredProfessionals = professionals.filter((professional) => professional.salonId === selectedSalon?._id);

  function handleQuestionnaireChange(nextSlug) {
    setSelectedSlug(nextSlug);
    setAnswers(buildInitialAnswers(questionnaireMap[nextSlug]));
    setResult(null);
    setError("");
  }

  function handleSubmit() {
    setError("");
    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/questionnaires/${selectedSlug}/submit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              client,
              answers
            })
          });

          const payload = await response.json();

          if (!response.ok) {
            setResult(null);
            setError(payload.error || "Nu am putut procesa chestionarul.");
            return;
          }

          setResult(payload);
        } catch (submissionError) {
          setResult(null);
          setError("Submit-ul a esuat. Verifica route-ul API sau configurarea proiectului.");
        }
      })();
    });
  }

  return (
    <div className="workspace-grid">
      <section className="panel form-shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Client flow</span>
            <h1>Intake public cu rezultat instant</h1>
          </div>
          <span className="tag tag-soft">confidential per salon</span>
        </div>

        {shareContext ? (
          <div className="banner">
            Link partajat de {shareContext.professionalName} din {shareContext.salonName}. Formularul a fost preselectat
            pentru acest context.
          </div>
        ) : null}

        <div className="field-grid compact-grid">
          <label className="field">
            <span>Chestionar</span>
            <select value={selectedSlug} onChange={(event) => handleQuestionnaireChange(event.target.value)}>
              {questionnaires.map((questionnaire) => (
                <option key={questionnaire.slug} value={questionnaire.slug}>
                  {questionnaire.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Salon</span>
            <select
              value={client.salonSlug}
              onChange={(event) => {
                const nextSalonSlug = event.target.value;
                const nextProfessionalId = findFirstProfessionalForSalon(salons, professionals, nextSalonSlug);
                const nextProfessional = findProfessionalById(professionals, nextProfessionalId);

                setClient((current) => ({
                  ...current,
                  salonSlug: nextSalonSlug,
                  professionalId: nextProfessionalId,
                  shareCode: nextProfessional?.shareCode || ""
                }));
              }}
            >
              {salons.map((salon) => (
                <option key={salon.slug} value={salon.slug}>
                  {salon.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Profesionist</span>
            <select
              value={client.professionalId}
              onChange={(event) => {
                const nextProfessional = findProfessionalById(professionals, event.target.value);

                setClient((current) => ({
                  ...current,
                  professionalId: event.target.value,
                  shareCode: nextProfessional?.shareCode || ""
                }));
              }}
            >
              {filteredProfessionals.map((professional) => (
                <option key={professional._id} value={professional._id}>
                  {getProfessionalLabel(professional)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>Prenume</span>
            <input
              value={client.firstName}
              onChange={(event) => setClient((current) => ({ ...current, firstName: event.target.value }))}
              placeholder="Ana"
            />
          </label>
          <label className="field">
            <span>Nume</span>
            <input
              value={client.lastName}
              onChange={(event) => setClient((current) => ({ ...current, lastName: event.target.value }))}
              placeholder="Radu"
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={client.email}
              onChange={(event) => setClient((current) => ({ ...current, email: event.target.value }))}
              placeholder="ana@example.com"
            />
          </label>
          <label className="field">
            <span>Telefon</span>
            <input
              value={client.phone}
              onChange={(event) => setClient((current) => ({ ...current, phone: event.target.value }))}
              placeholder="+40 7xx xxx xxx"
            />
          </label>
        </div>

        <div className="question-stack">
          {selectedQuestionnaire?.questions.map((question) => (
            <article key={question.id} className="question-card">
              <div className="question-head">
                <h3>{question.label}</h3>
                <span className="tag">{selectedQuestionnaire.audience}</span>
              </div>
              <div className="option-grid">
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`option-card${isSelected ? " active" : ""}`}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
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
          <button className="button primary" type="button" disabled={isPending} onClick={handleSubmit}>
            {isPending ? "Procesare..." : "Trimite si interpreteaza"}
          </button>
          <p className="helper-copy">
            Dupa submit se genereaza o fisa personala, un rezumat pe email si o propunere de programare.
          </p>
        </div>
      </section>

      <aside className="panel results-shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Outcome</span>
            <h2>Rezultat si follow-up</h2>
          </div>
          <span className="tag tag-soft">server-evaluated</span>
        </div>

        {result ? (
          <div className="stack">
            <div className="hero-card inset-card">
              <p className="metric-caption">{result.questionnaire.title}</p>
              <h3>{result.evaluation.band?.label}</h3>
              <p className="lead-copy">{result.evaluation.band?.summary}</p>
              {typeof result.evaluation.score === "number" ? (
                <div className="metric-row">
                  <span>Scor calculat</span>
                  <strong>{result.evaluation.score}p</strong>
                </div>
              ) : null}
              {result.evaluation.code ? (
                <div className="metric-row">
                  <span>Cod Baumann</span>
                  <strong>{result.evaluation.code}</strong>
                </div>
              ) : null}
            </div>

            <div className="detail-card">
              <span className="eyebrow">Fisa personala</span>
              <h3>{result.dossier.dossierId}</h3>
              <p>{result.dossier.confidentiality}</p>
            </div>

            <div className="detail-card">
              <span className="eyebrow">Propunere de programare</span>
              <p>{result.dossier.nextStep.note}</p>
              <div className="metric-row">
                <span>Interval</span>
                <strong>{result.dossier.nextStep.slotWindow}</strong>
              </div>
            </div>

            <div className="detail-card">
              <span className="eyebrow">Preview email</span>
              <p className="email-subject">{result.emailPreview.subject}</p>
              <div className="email-body">
                {result.emailPreview.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Rezultatul va aparea aici dupa submit.</p>
            <p className="helper-copy">
              Pentru rolul client am activat acum fluxurile `Fitzpatrick` si `Acne Severity`.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
