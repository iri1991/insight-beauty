"use client";

import { useState } from "react";

export function VisitForm({ clientId }) {
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault(); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/visits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(form), clientId }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error); return; }
    setMessage("Vizita a fost adăugată în dosar."); event.currentTarget.reset();
  }
  return <form className="inline-form" onSubmit={submit}><h2>Înregistrează vizita</h2><div className="form-grid"><label>Data vizitei<input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></label><label>Următorul pas<input name="nextStep" placeholder="Ex. control peste 4 săptămâni" /></label></div><label>Proceduri<textarea name="procedures" placeholder="Câte o procedură pe rând nou" /></label><label>Tratamente administrate<textarea name="treatments" placeholder="Câte un tratament pe rând nou" /></label><label>Observații clinice<textarea name="notes" required /></label><button className="primary-button">Salvează vizita</button>{message && <p className={message.startsWith("Vizita") ? "form-success" : "form-error"}>{message}</p>}</form>;
}
