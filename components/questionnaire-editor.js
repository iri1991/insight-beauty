"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer, useRef, useState, useTransition } from "react";

/* ─── Helpers ─────────────────────────────────────────────────────── */

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyQuestion() {
  return { _key: uid(), id: "", label: "", options: [] };
}

function emptyOption() {
  return { _key: uid(), value: "", label: "", points: 0 };
}

function emptyBand() {
  return { _key: uid(), min: 0, max: 0, label: "", summary: "", recommendation: "", code: "" };
}

function emptyDimension() {
  return { _key: uid(), id: "", label: "", inputLabel: "", bands: [] };
}

function emptyDimBand() {
  return { _key: uid(), min: 0, max: 0, code: "", label: "", summary: "" };
}

function addKey(items) {
  if (!items) return [];
  return items.map((item) => ({ _key: uid(), ...item }));
}

function stripKeys(items) {
  if (!items) return [];
  return items.map(({ _key, ...rest }) => rest);
}

function stripDimKeys(dimObj) {
  if (!dimObj) return null;
  const result = {};
  for (const [key, dim] of Object.entries(dimObj)) {
    const { _key, ...dimRest } = dim;
    result[key] = { ...dimRest, bands: stripKeys(dim.bands || []) };
  }
  return result;
}

function templateToState(template) {
  const def = template.definition || {};
  return {
    slug: template.slug || "",
    title: template.title || "",
    kind: template.kind || "choice-sum",
    audience: template.audience || "client",
    deliveryMode: template.deliveryMode || "public",
    status: template.status || "draft",
    description: template.description || "",
    sourceRefs: (template.sourceRefs || []).join(", "),
    questions: addKey(def.questions || []).map((q) => ({
      ...q,
      options: addKey(q.options || [])
    })),
    bands: addKey(def.bands || []),
    dimensions: Object.entries(def.dimensions || {}).map(([key, dim]) => ({
      _key: uid(),
      id: key,
      label: dim.label || "",
      inputLabel: dim.inputLabel || "",
      sourceRef: dim.sourceRef || "",
      bands: addKey(dim.bands || [])
    }))
  };
}

function stateToPayload(state) {
  const definition =
    state.kind === "baumann-dimensions"
      ? {
          dimensions: Object.fromEntries(
            state.dimensions.map((dim) => [
              dim.id,
              {
                id: dim.id,
                label: dim.label,
                inputLabel: dim.inputLabel,
                sourceRef: dim.sourceRef,
                bands: stripKeys(dim.bands)
              }
            ])
          )
        }
      : {
          questions: stripKeys(
            state.questions.map((q) => ({
              ...q,
              options: stripKeys(q.options)
            }))
          ),
          bands: stripKeys(state.bands)
        };

  return {
    slug: state.slug,
    title: state.title,
    kind: state.kind,
    audience: state.audience,
    deliveryMode: state.deliveryMode,
    status: state.status,
    description: state.description,
    sourceRefs: state.sourceRefs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    definition
  };
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function FieldGroup({ label, hint, children }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}

function OptionRow({ option, onChange, onRemove }) {
  return (
    <div className="option-row">
      <input
        className="field-input option-val"
        placeholder="value"
        value={option.value}
        onChange={(e) => onChange({ ...option, value: e.target.value })}
      />
      <input
        className="field-input option-lbl"
        placeholder="Eticheta afișată clientului"
        value={option.label}
        onChange={(e) => onChange({ ...option, label: e.target.value })}
      />
      <input
        className="field-input option-pts"
        type="number"
        placeholder="Pts"
        value={option.points}
        onChange={(e) => onChange({ ...option, points: Number(e.target.value) })}
      />
      <button className="icon-btn danger" onClick={onRemove} type="button" title="Șterge opțiunea">
        ✕
      </button>
    </div>
  );
}

function QuestionCard({ question, index, total, onChange, onRemove, onMoveUp, onMoveDown }) {
  const [open, setOpen] = useState(true);

  function updateOption(optIndex, updated) {
    const options = question.options.map((o, i) => (i === optIndex ? updated : o));
    onChange({ ...question, options });
  }

  function removeOption(optIndex) {
    onChange({ ...question, options: question.options.filter((_, i) => i !== optIndex) });
  }

  function addOption() {
    onChange({ ...question, options: [...question.options, emptyOption()] });
  }

  function autoId(label) {
    if (!question.id || question.id === slugify(question.label || "")) {
      onChange({ ...question, label, id: slugify(label) });
    } else {
      onChange({ ...question, label });
    }
  }

  return (
    <div className={`q-card${open ? " q-card-open" : ""}`}>
      <div className="q-card-header" onClick={() => setOpen((v) => !v)}>
        <div className="q-card-title">
          <span className="q-index">{index + 1}</span>
          <span>{question.label || <em className="muted">Fără etichetă</em>}</span>
          {question.options.length > 0 ? (
            <span className="tag tag-soft">{question.options.length} opțiuni</span>
          ) : null}
        </div>
        <div className="q-card-actions" onClick={(e) => e.stopPropagation()}>
          <button className="icon-btn" onClick={onMoveUp} disabled={index === 0} type="button" title="Sus">
            ↑
          </button>
          <button className="icon-btn" onClick={onMoveDown} disabled={index === total - 1} type="button" title="Jos">
            ↓
          </button>
          <button className="icon-btn danger" onClick={onRemove} type="button" title="Șterge întrebarea">
            ✕
          </button>
          <button className="icon-btn" onClick={() => setOpen((v) => !v)} type="button">
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="q-card-body">
          <div className="field-row two-col">
            <FieldGroup label="Etichetă întrebare">
              <input
                className="field-input"
                value={question.label}
                onChange={(e) => autoId(e.target.value)}
                placeholder="ex: Culoarea ochilor"
              />
            </FieldGroup>
            <FieldGroup label="ID câmp (auto-generat)" hint="Folosit intern la evaluare">
              <input
                className="field-input"
                value={question.id}
                onChange={(e) => onChange({ ...question, id: slugify(e.target.value) })}
                placeholder="ex: eye-color"
              />
            </FieldGroup>
          </div>

          <div className="options-section">
            <div className="options-header">
              <span className="field-label">Opțiuni de răspuns</span>
              <button className="button secondary small" onClick={addOption} type="button">
                + Adaugă opțiune
              </button>
            </div>
            {question.options.length > 0 ? (
              <div className="options-list">
                <div className="option-row option-header">
                  <span className="option-val field-label">Value</span>
                  <span className="option-lbl field-label">Etichetă</span>
                  <span className="option-pts field-label">Puncte</span>
                  <span style={{ width: 32 }} />
                </div>
                {question.options.map((opt, oi) => (
                  <OptionRow
                    key={opt._key}
                    option={opt}
                    onChange={(updated) => updateOption(oi, updated)}
                    onRemove={() => removeOption(oi)}
                  />
                ))}
              </div>
            ) : (
              <p className="helper-copy">Nicio opțiune adăugată. Apasă „+ Adaugă opțiune".</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BandRow({ band, onChange, onRemove, showCode }) {
  return (
    <div className="band-row">
      <input
        className="field-input band-min"
        type="number"
        placeholder="Min"
        value={band.min}
        onChange={(e) => onChange({ ...band, min: Number(e.target.value) })}
      />
      <input
        className="field-input band-max"
        type="number"
        placeholder="Max"
        value={band.max}
        onChange={(e) => onChange({ ...band, max: Number(e.target.value) })}
      />
      {showCode ? (
        <input
          className="field-input band-code"
          placeholder="Cod"
          value={band.code || ""}
          onChange={(e) => onChange({ ...band, code: e.target.value })}
        />
      ) : null}
      <input
        className="field-input band-label"
        placeholder="Etichetă rezultat"
        value={band.label}
        onChange={(e) => onChange({ ...band, label: e.target.value })}
      />
      <input
        className="field-input band-summary"
        placeholder="Rezumat / interpretare"
        value={band.summary}
        onChange={(e) => onChange({ ...band, summary: e.target.value })}
      />
      <input
        className="field-input band-rec"
        placeholder="Recomandare"
        value={band.recommendation || ""}
        onChange={(e) => onChange({ ...band, recommendation: e.target.value })}
      />
      <button className="icon-btn danger" onClick={onRemove} type="button" title="Șterge banda">
        ✕
      </button>
    </div>
  );
}

function DimensionCard({ dimension, index, onChange, onRemove }) {
  const [open, setOpen] = useState(true);

  function updateBand(bi, updated) {
    onChange({ ...dimension, bands: dimension.bands.map((b, i) => (i === bi ? updated : b)) });
  }
  function removeBand(bi) {
    onChange({ ...dimension, bands: dimension.bands.filter((_, i) => i !== bi) });
  }
  function addBand() {
    onChange({ ...dimension, bands: [...dimension.bands, emptyDimBand()] });
  }

  return (
    <div className={`q-card${open ? " q-card-open" : ""}`}>
      <div className="q-card-header" onClick={() => setOpen((v) => !v)}>
        <div className="q-card-title">
          <span className="q-index">{index + 1}</span>
          <span>{dimension.label || dimension.id || <em className="muted">Fără etichetă</em>}</span>
          <span className="tag tag-soft">{dimension.id || "fără id"}</span>
        </div>
        <div className="q-card-actions" onClick={(e) => e.stopPropagation()}>
          <button className="icon-btn danger" onClick={onRemove} type="button">
            ✕
          </button>
          <button className="icon-btn" onClick={() => setOpen((v) => !v)} type="button">
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="q-card-body">
          <div className="field-row two-col">
            <FieldGroup label="ID dimensiune" hint="ex: oiliness, sensitivity">
              <input
                className="field-input"
                value={dimension.id}
                onChange={(e) => onChange({ ...dimension, id: e.target.value })}
                placeholder="oiliness"
              />
            </FieldGroup>
            <FieldGroup label="Etichetă afișată">
              <input
                className="field-input"
                value={dimension.label}
                onChange={(e) => onChange({ ...dimension, label: e.target.value })}
                placeholder="ex: O vs D"
              />
            </FieldGroup>
          </div>
          <div className="field-row two-col">
            <FieldGroup label="Label input pentru profesionist">
              <input
                className="field-input"
                value={dimension.inputLabel}
                onChange={(e) => onChange({ ...dimension, inputLabel: e.target.value })}
                placeholder="ex: Scor O/D"
              />
            </FieldGroup>
            <FieldGroup label="Sursă document">
              <input
                className="field-input"
                value={dimension.sourceRef || ""}
                onChange={(e) => onChange({ ...dimension, sourceRef: e.target.value })}
                placeholder="ex: raport baumann O vs D.docx"
              />
            </FieldGroup>
          </div>

          <div className="options-section">
            <div className="options-header">
              <span className="field-label">Benzi de scorare</span>
              <button className="button secondary small" onClick={addBand} type="button">
                + Bandă
              </button>
            </div>
            {dimension.bands.length > 0 ? (
              <div className="bands-list">
                <div className="band-row band-header">
                  <span className="band-min field-label">Min</span>
                  <span className="band-max field-label">Max</span>
                  <span className="band-code field-label">Cod</span>
                  <span className="band-label field-label">Etichetă</span>
                  <span className="band-summary field-label">Rezumat</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ width: 32 }} />
                </div>
                {dimension.bands.map((band, bi) => (
                  <BandRow
                    key={band._key}
                    band={band}
                    onChange={(u) => updateBand(bi, u)}
                    onRemove={() => removeBand(bi)}
                    showCode={true}
                  />
                ))}
              </div>
            ) : (
              <p className="helper-copy">Nicio bandă adăugată.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ─── Main Editor ────────────────────────────────────────────────── */

export function QuestionnaireEditor({ initialTemplate, isNew }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [state, setState] = useState(() => templateToState(initialTemplate || {}));

  const slugTouched = useRef(!isNew);

  function set(field, value) {
    setSaved(false);
    setError("");
    setState((prev) => ({ ...prev, [field]: value }));
  }

  function setTitleAndSlug(title) {
    setState((prev) => ({
      ...prev,
      title,
      slug: slugTouched.current ? prev.slug : slugify(title)
    }));
    setSaved(false);
    setError("");
  }

  /* Questions */
  function addQuestion() {
    setState((prev) => ({ ...prev, questions: [...prev.questions, emptyQuestion()] }));
  }
  function updateQuestion(index, updated) {
    setState((prev) => ({ ...prev, questions: prev.questions.map((q, i) => (i === index ? updated : q)) }));
  }
  function removeQuestion(index) {
    setState((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
  }
  function moveQuestion(index, direction) {
    setState((prev) => {
      const arr = [...prev.questions];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...prev, questions: arr };
    });
  }

  /* Bands */
  function addBand() {
    setState((prev) => ({ ...prev, bands: [...prev.bands, emptyBand()] }));
  }
  function updateBand(index, updated) {
    setState((prev) => ({ ...prev, bands: prev.bands.map((b, i) => (i === index ? updated : b)) }));
  }
  function removeBand(index) {
    setState((prev) => ({ ...prev, bands: prev.bands.filter((_, i) => i !== index) }));
  }

  /* Dimensions */
  function addDimension() {
    setState((prev) => ({ ...prev, dimensions: [...prev.dimensions, emptyDimension()] }));
  }
  function updateDimension(index, updated) {
    setState((prev) => ({ ...prev, dimensions: prev.dimensions.map((d, i) => (i === index ? updated : d)) }));
  }
  function removeDimension(index) {
    setState((prev) => ({ ...prev, dimensions: prev.dimensions.filter((_, i) => i !== index) }));
  }

  /* Save */
  function handleSave() {
    setError("");
    setSaved(false);

    if (!state.title.trim()) {
      setError("Titlul este obligatoriu.");
      return;
    }
    if (!state.slug.trim()) {
      setError("Slug-ul este obligatoriu.");
      return;
    }

    const payload = stateToPayload(state);
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/admin/questionnaires" : `/api/admin/questionnaires/${state.slug}`;

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await response.json();

          if (!response.ok) {
            setError(data.error || "Eroare la salvare.");
            return;
          }

          setSaved(true);
          if (isNew) {
            router.push(`/admin/questionnaires/${data.template.slug}`);
          }
        } catch {
          setError("Eroare de rețea.");
        }
      })();
    });
  }

  /* Delete */
  function handleDelete() {
    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/admin/questionnaires/${state.slug}`, { method: "DELETE" });
          const data = await response.json();

          if (!response.ok) {
            setError(data.error || "Eroare la ștergere.");
            setDeleteConfirm(false);
            return;
          }

          router.push("/admin/questionnaires");
        } catch {
          setError("Eroare de rețea.");
        }
      })();
    });
  }

  const isBaumann = state.kind === "baumann-dimensions";

  return (
    <div className="editor-shell">
      {/* Sticky toolbar */}
      <div className="editor-toolbar">
        <div className="editor-toolbar-left">
          <a className="text-link" href="/admin/questionnaires">
            ← Înapoi la liste
          </a>
          <span className="editor-title-hint">{state.title || "Chestionar fără titlu"}</span>
          {state.slug ? <span className="tag tag-soft">{state.slug}</span> : null}
        </div>
        <div className="editor-toolbar-right">
          {!isNew && initialTemplate?.source !== "static" ? (
            deleteConfirm ? (
              <>
                <span className="helper-copy" style={{ color: "#a23d22" }}>
                  Confirmi ștergerea?
                </span>
                <button className="button danger small" onClick={handleDelete} disabled={isPending} type="button">
                  Da, șterge
                </button>
                <button className="button secondary small" onClick={() => setDeleteConfirm(false)} type="button">
                  Anulează
                </button>
              </>
            ) : (
              <button className="button secondary small" onClick={() => setDeleteConfirm(true)} type="button">
                Șterge
              </button>
            )
          ) : null}
          <button className="button primary" onClick={handleSave} disabled={isPending} type="button">
            {isPending ? "Se salvează..." : isNew ? "Creează chestionarul" : "Salvează modificările"}
          </button>
        </div>
      </div>

      {error ? <div className="form-error editor-error">{error}</div> : null}
      {saved ? <div className="form-success editor-success">Chestionar salvat cu succes.</div> : null}

      {/* Metadata */}
      <section className="editor-section">
        <h2 className="editor-section-title">Metadata</h2>
        <div className="field-row two-col">
          <FieldGroup label="Titlu *">
            <input
              className="field-input"
              value={state.title}
              onChange={(e) => setTitleAndSlug(e.target.value)}
              placeholder="ex: Fitzpatrick Phototype"
              autoFocus={isNew}
            />
          </FieldGroup>
          <FieldGroup label="Slug (URL key) *" hint="Identificator unic, generat automat din titlu">
            <input
              className="field-input"
              value={state.slug}
              onChange={(e) => {
                slugTouched.current = true;
                set("slug", slugify(e.target.value));
              }}
              placeholder="ex: fitzpatrick-screening"
            />
          </FieldGroup>
        </div>

        <div className="field-row three-col">
          <FieldGroup label="Tip de evaluare">
            <select className="field-input" value={state.kind} onChange={(e) => set("kind", e.target.value)}>
              <option value="choice-sum">Choice Sum — Sumă puncte</option>
              <option value="acne-index">Acne Index — DIA + override chisturi</option>
              <option value="baumann-dimensions">Baumann Dimensions — 4 dimensiuni</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Audiență">
            <select className="field-input" value={state.audience} onChange={(e) => set("audience", e.target.value)}>
              <option value="client">Client — self-service</option>
              <option value="client-assisted">Client asistat</option>
              <option value="professional">Profesionist</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Mod livrare">
            <select className="field-input" value={state.deliveryMode} onChange={(e) => set("deliveryMode", e.target.value)}>
              <option value="public">Public — vizibil în intake</option>
              <option value="public-assisted">Public asistat</option>
              <option value="workspace">Workspace profesionist</option>
            </select>
          </FieldGroup>
        </div>

        <div className="field-row two-col">
          <FieldGroup label="Status">
            <select className="field-input" value={state.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">Draft — în lucru</option>
              <option value="active">Activ — disponibil pentru completare</option>
              <option value="archived">Arhivat</option>
            </select>
          </FieldGroup>
          <FieldGroup label="Surse documentare" hint="Separate prin virgulă">
            <input
              className="field-input"
              value={state.sourceRefs}
              onChange={(e) => set("sourceRefs", e.target.value)}
              placeholder="ex: chestionar.docx, interpretari.docx"
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Descriere">
          <textarea
            className="field-input"
            value={state.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="Descrie scopul și audiența chestionarului"
          />
        </FieldGroup>
      </section>

      {/* Questions section (choice-sum / acne-index) */}
      {!isBaumann ? (
        <section className="editor-section">
          <div className="editor-section-header">
            <div>
              <h2 className="editor-section-title">Întrebări</h2>
              <p className="helper-copy">
                {state.questions.length} întrebări · Totalul punctelor maxime:{" "}
                {state.questions.reduce(
                  (sum, q) => sum + Math.max(0, ...q.options.map((o) => Number(o.points) || 0)),
                  0
                )}
              </p>
            </div>
            <button className="button primary small" onClick={addQuestion} type="button">
              + Adaugă întrebare
            </button>
          </div>

          {state.questions.length > 0 ? (
            <div className="questions-list">
              {state.questions.map((q, index) => (
                <QuestionCard
                  key={q._key}
                  question={q}
                  index={index}
                  total={state.questions.length}
                  onChange={(updated) => updateQuestion(index, updated)}
                  onRemove={() => removeQuestion(index)}
                  onMoveUp={() => moveQuestion(index, -1)}
                  onMoveDown={() => moveQuestion(index, 1)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nicio întrebare adăugată. Apasă „+ Adaugă întrebare" pentru a începe.</p>
            </div>
          )}
        </section>
      ) : null}

      {/* Dimensions section (baumann) */}
      {isBaumann ? (
        <section className="editor-section">
          <div className="editor-section-header">
            <div>
              <h2 className="editor-section-title">Dimensiuni Baumann</h2>
              <p className="helper-copy">
                Fiecare dimensiune generează o literă în codul tipologiei (ex: OSPT, DRNW).
              </p>
            </div>
            <button className="button primary small" onClick={addDimension} type="button">
              + Adaugă dimensiune
            </button>
          </div>
          {state.dimensions.length > 0 ? (
            <div className="questions-list">
              {state.dimensions.map((dim, index) => (
                <DimensionCard
                  key={dim._key}
                  dimension={dim}
                  index={index}
                  onChange={(updated) => updateDimension(index, updated)}
                  onRemove={() => removeDimension(index)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nicio dimensiune. Adaugă dimensiunile O/D, S/R, P/N, T/W.</p>
            </div>
          )}
        </section>
      ) : null}

      {/* Scoring bands (choice-sum / acne-index only) */}
      {!isBaumann ? (
        <section className="editor-section">
          <div className="editor-section-header">
            <div>
              <h2 className="editor-section-title">Benzi de scorare și interpretare</h2>
              <p className="helper-copy">
                Definește intervalele de scor și interpretările corespunzătoare.
              </p>
            </div>
            <button className="button primary small" onClick={addBand} type="button">
              + Adaugă bandă
            </button>
          </div>

          {state.bands.length > 0 ? (
            <div className="bands-list">
              <div className="band-row band-header">
                <span className="band-min field-label">Min</span>
                <span className="band-max field-label">Max</span>
                <span className="band-label field-label">Etichetă</span>
                <span className="band-summary field-label">Rezumat / interpretare</span>
                <span className="band-rec field-label">Recomandare</span>
                <span style={{ width: 32 }} />
              </div>
              {state.bands.map((band, index) => (
                <BandRow
                  key={band._key}
                  band={band}
                  onChange={(updated) => updateBand(index, updated)}
                  onRemove={() => removeBand(index)}
                  showCode={false}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nicio bandă de scorare. Adaugă benzi pentru a defini interpretările rezultatelor.</p>
            </div>
          )}

          {state.kind === "acne-index" ? (
            <div className="info-banner">
              <strong>Acne Index:</strong> Chestionarul va folosi ultima bandă definită ca rezultat implicit pentru prezența
              chisturilor (override automat), indiferent de scorul total.
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Preview section */}
      <section className="editor-section">
        <h2 className="editor-section-title">Preview JSON</h2>
        <p className="helper-copy">Structura care va fi salvată în baza de date.</p>
        <pre className="json-preview">{JSON.stringify(stateToPayload(state), null, 2)}</pre>
      </section>
    </div>
  );
}
