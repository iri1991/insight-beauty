"use client";

import { useMemo, useState } from "react";
import { questionnaireDefinitions } from "../lib/questionnaires";

const baumannDefinition = questionnaireDefinitions["baumann-profile"];
const initialScores = {
  oiliness: 24,
  sensitivity: 31,
  pigmentation: 35,
  wrinkling: 37
};

function findBand(bands, score) {
  return bands.find((band) => score >= band.min && score <= band.max) || null;
}

export function BaumannWorkbench({ tipologyCatalog = [] }) {
  const [scores, setScores] = useState(initialScores);

  const evaluation = useMemo(() => {
    const dimensions = Object.values(baumannDefinition.dimensions).map((dimension) => {
      const value = Number(scores[dimension.id]);
      const band = findBand(dimension.bands, value);

      return {
        id: dimension.id,
        label: dimension.label,
        inputLabel: dimension.inputLabel,
        score: value,
        band
      };
    });

    const hasInvalid = dimensions.some((dimension) => !dimension.band);

    if (hasInvalid) {
      return {
        complete: false,
        dimensions
      };
    }

    const code = dimensions.map((dimension) => dimension.band.code).join("");
    const tipology = tipologyCatalog.find((entry) => entry.code === code);

    return {
      complete: true,
      dimensions,
      code,
      tipology
    };
  }, [scores, tipologyCatalog]);

  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Professional tool</span>
          <h2>Baumann 16-Type Workbench</h2>
        </div>
        <span className="tag tag-soft">source-backed scoring</span>
      </div>

      <div className="workspace-grid">
        <div className="panel">
          <div className="field-grid compact-grid">
            {Object.values(baumannDefinition.dimensions).map((dimension) => (
              <label key={dimension.id} className="field">
                <span>{dimension.inputLabel}</span>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={scores[dimension.id]}
                  onChange={(event) =>
                    setScores((current) => ({
                      ...current,
                      [dimension.id]: event.target.value
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <div className="card-grid two-up">
            {evaluation.dimensions.map((dimension) => (
              <article key={dimension.id} className="detail-card">
                <div className="card-row">
                  <h3>{dimension.label}</h3>
                  <span className="tag">{dimension.score}p</span>
                </div>
                <p>{dimension.band ? dimension.band.label : "Scor in afara baremului actual."}</p>
                <p className="helper-copy">{dimension.band?.summary || "Introdu un scor din documentele profesionale."}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="panel results-shell">
          {evaluation.complete ? (
            <div className="stack">
              <div className="hero-card inset-card">
                <span className="eyebrow">Rezultat compus</span>
                <h3>Tipologie {evaluation.code}</h3>
                <p className="lead-copy">
                  {evaluation.tipology?.preview ||
                    "Tipologia compusa a fost rezolvata din cele patru dimensiuni si este gata pentru debriefing."}
                </p>
              </div>

              <div className="detail-card">
                <span className="eyebrow">Interpretare rapida</span>
                <p>
                  {evaluation.dimensions
                    .map((dimension) => `${dimension.label}: ${dimension.band.label}`)
                    .join(" · ")}
                </p>
              </div>

              <div className="detail-card">
                <span className="eyebrow">Utilizare in cabinet</span>
                <p>
                  Foloseste acest rezultat ca baza pentru protocol, homecare si alegerea tratamentelor tolerate in
                  urmatoarele 30-90 zile.
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Introdu toate cele patru scoruri pentru a genera tipologia Baumann.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
