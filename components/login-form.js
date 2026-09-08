"use client";

import { useState } from "react";

const destinations = { admin: "/admin", salon: "/salon", professional: "/professional", client: "/client" };

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error); setBusy(false); return; }
    window.location.assign(destinations[data.role]);
  }
  return <form className="auth-card" onSubmit={submit}>
    <p className="eyebrow">Acces securizat</p><h1>Îngrijire personalizată, organizată.</h1><p>Intră în spațiul tău Insight Beauty.</p>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Parolă<input name="password" type="password" autoComplete="current-password" required /></label>
    {error && <p className="form-error">{error}</p>}
    <button className="primary-button" disabled={busy}>{busy ? "Se verifică..." : "Intră în cont"}</button>
  </form>;
}
