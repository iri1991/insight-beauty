"use client";

import { useState } from "react";

export function CreateClientForm() {
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  async function submit(event) {
    event.preventDefault(); setMessage(""); setUrl("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/professional/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error); return; }
    setMessage(`Invitația pentru ${data.client.name} este pregătită.`); setUrl(`${window.location.origin}${data.onboardingUrl}`); event.currentTarget.reset();
  }
  return <form className="inline-form" onSubmit={submit}><h2>Client nou</h2><p>Generează invitația de creare a dosarului și evaluare.</p><div className="form-grid"><label>Nume<input name="name" required /></label><label>Email<input name="email" type="email" required /></label><label>Telefon<input name="phone" /></label></div><button className="primary-button">Creează invitația</button>{message && <p className={url ? "form-success" : "form-error"}>{message}</p>}{url && <label className="share-link">Link securizat<input value={url} readOnly onFocus={(event) => event.target.select()} /></label>}</form>;
}
