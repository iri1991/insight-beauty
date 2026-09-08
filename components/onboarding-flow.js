"use client";

import { useState } from "react";

export function OnboardingFlow({ token, clientName, questions }) {
  const [consented, setConsented] = useState(false);
  const [password, setPassword] = useState("");
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const complete = Object.keys(answers).length === questions.length;
  async function submit(event) {
    event.preventDefault(); setError(""); setBusy(true);
    const response = await fetch(`/api/onboarding/${token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, gdprAccepted: consented, answers }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error); setBusy(false); return; }
    window.location.assign("/client");
  }
  return <form className="onboarding-card" onSubmit={submit}>
    <p className="eyebrow">Dosar de client</p><h1>Bun venit, {clientName}.</h1><p>Începem cu acordul tău și evaluarea Baumann. Rezultatul devine punctul de plecare al planului tău de îngrijire.</p>
    <section className="consent-card"><h2>Consimțământ GDPR</h2><p>Datele sunt păstrate exclusiv în dosarul tău și sunt vizibile profesionistului desemnat, salonului acestuia și administratorilor platformei pentru suport tehnic.</p><label className="check-label"><input type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} required /> Sunt de acord cu prelucrarea datelor mele pentru furnizarea serviciilor Insight Beauty.</label></section>
    <label>Setează parola contului<input type="password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
    <div className="question-list">{questions.map((question, index) => <fieldset key={question.id}><legend><span>{String(index + 1).padStart(2, "0")}</span>{question.label}</legend>{question.options.map(([label, value]) => <label className="option" key={label}><input type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => setAnswers({ ...answers, [question.id]: value })} />{label}</label>)}</fieldset>)}</div>
    {error && <p className="form-error">{error}</p>}<button disabled={busy || !complete || !consented} className="primary-button">{busy ? "Se salvează..." : "Finalizează dosarul"}</button>
  </form>;
}
