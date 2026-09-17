"use client";

import { useState } from "react";

export function DeleteClientButton({ clientId, clientName }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    if (!window.confirm(`Arhivezi dosarul pentru ${clientName}? Datele nu vor fi șterse definitiv și nu vor mai apărea în portofoliul activ.`)) return;
    setBusy(true); setError("");
    const response = await fetch(`/api/professional/clients/${clientId}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setError(data.error); setBusy(false); return; }
    window.location.assign("/professional");
  }
  return <div className="delete-client-control"><button className="delete-client-button" onClick={remove} disabled={busy}>{busy ? "Se arhivează..." : "Arhivează clientul"}</button>{error && <p className="form-error">{error}</p>}</div>;
}
