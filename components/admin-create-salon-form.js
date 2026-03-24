"use client";

import { useState, useTransition } from "react";

export function AdminCreateSalonForm({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", theme: "classic" });
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setResult(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch("/api/admin/salons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
          });
          const data = await response.json();

          if (!response.ok) {
            setError(data.error || "Eroare la crearea salonului.");
            return;
          }

          setResult(data.salon);
          setForm({ name: "", city: "", theme: "classic" });
          if (onSuccess) onSuccess(data.salon);
        } catch {
          setError("Eroare de rețea. Încearcă din nou.");
        }
      })();
    });
  }

  if (!open) {
    return (
      <button className="button primary" onClick={() => setOpen(true)} type="button">
        + Salon nou
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="modal-panel">
        <div className="modal-header">
          <h3>Creare salon nou</h3>
          <button className="modal-close" onClick={() => setOpen(false)} type="button" aria-label="Închide">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="field-group">
            <label className="field-label">Numele salonului *</label>
            <input
              className="field-input"
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="ex: Studio Lumière"
              required
              autoFocus
            />
          </div>

          <div className="field-group">
            <label className="field-label">Oraș</label>
            <input
              className="field-input"
              type="text"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="ex: București"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Temă / Concept</label>
            <select className="field-input" value={form.theme} onChange={(e) => handleChange("theme", e.target.value)}>
              <option value="classic">Classic</option>
              <option value="medical">Medical</option>
              <option value="wellness">Wellness</option>
              <option value="luxury">Luxury</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          {result ? (
            <div className="form-success">
              <strong>Salon creat:</strong> {result.name} <span className="tag">{result.slug}</span>
            </div>
          ) : null}

          <div className="form-actions">
            <button className="button secondary" type="button" onClick={() => setOpen(false)}>
              Anulează
            </button>
            <button className="button primary" type="submit" disabled={isPending}>
              {isPending ? "Se creează..." : "Creează salonul"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
