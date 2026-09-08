"use client";

import { useState } from "react";

export function AdminImpersonation({ salons }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  async function impersonate(salonId) {
    setError(""); setPending(salonId);
    const response = await fetch("/api/admin/impersonate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ salonId }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error); setPending(""); return; }
    window.location.assign(data.destination);
  }
  return <section className="content-section"><div className="section-heading"><div><p className="eyebrow">Suport administrativ</p><h2>Impersonare salon</h2></div><span>Acces temporar, auditabil</span></div><p className="admin-impersonation-copy">Deschide spațiul operațional al unui salon pentru suport. Poți reveni oricând la contul de administrator din header.</p><div className="impersonation-list">{salons.map((salon) => <article key={salon.id}><div><strong>{salon.name}</strong><span>{salon.city}</span></div><button className="primary-button" disabled={pending === salon.id} onClick={() => impersonate(salon.id)}>{pending === salon.id ? "Se deschide..." : "Intră ca salon"}</button></article>)}</div>{!salons.length && <div className="empty-state">Nu există încă saloane configurate.</div>}{error && <p className="form-error">{error}</p>}</section>;
}
