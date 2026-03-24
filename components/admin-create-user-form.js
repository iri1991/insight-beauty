"use client";

import { useState, useTransition } from "react";

export function AdminCreateUserForm({ salons, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    role: "professional",
    firstName: "",
    lastName: "",
    email: "",
    salonId: salons[0]?._id || "",
    specialty: "",
    password: ""
  });
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
          const response = await fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
          });
          const data = await response.json();

          if (!response.ok) {
            setError(data.error || "Eroare la crearea utilizatorului.");
            return;
          }

          setResult(data);
          setForm({
            role: "professional",
            firstName: "",
            lastName: "",
            email: "",
            salonId: salons[0]?._id || "",
            specialty: "",
            password: ""
          });
          if (onSuccess) onSuccess(data.user);
        } catch {
          setError("Eroare de rețea. Încearcă din nou.");
        }
      })();
    });
  }

  if (!open) {
    return (
      <button className="button primary" onClick={() => setOpen(true)} type="button">
        + Utilizator nou
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="modal-panel">
        <div className="modal-header">
          <h3>Adaugă utilizator</h3>
          <button className="modal-close" onClick={() => setOpen(false)} type="button" aria-label="Închide">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="field-row two-col">
            <div className="field-group">
              <label className="field-label">Prenume *</label>
              <input
                className="field-input"
                type="text"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Ana"
                required
                autoFocus
              />
            </div>
            <div className="field-group">
              <label className="field-label">Nume *</label>
              <input
                className="field-input"
                type="text"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Ionescu"
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Email *</label>
            <input
              className="field-input"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="ana.ionescu@salon.ro"
              required
            />
          </div>

          <div className="field-row two-col">
            <div className="field-group">
              <label className="field-label">Rol *</label>
              <select className="field-input" value={form.role} onChange={(e) => handleChange("role", e.target.value)}>
                <option value="professional">Profesionist</option>
                <option value="salon-manager">Manager salon</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Salon *</label>
              <select className="field-input" value={form.salonId} onChange={(e) => handleChange("salonId", e.target.value)} required>
                <option value="">Selectează salonul</option>
                {salons.map((salon) => (
                  <option key={salon._id} value={salon._id}>
                    {salon.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.role === "professional" ? (
            <div className="field-group">
              <label className="field-label">Specialitate</label>
              <input
                className="field-input"
                type="text"
                value={form.specialty}
                onChange={(e) => handleChange("specialty", e.target.value)}
                placeholder="ex: Skin therapist, Cosmetician medical"
              />
            </div>
          ) : null}

          <div className="field-group">
            <label className="field-label">Parolă temporară</label>
            <input
              className="field-input"
              type="text"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Lasă gol pentru parola implicită"
            />
            <span className="field-hint">Dacă lași gol, parola implicită este InsightPro123</span>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          {result ? (
            <div className="form-success">
              <strong>{result.user.displayName}</strong> a fost creat ca{" "}
              <span className="tag">{result.user.role}</span> în salonul selectat.
              <br />
              <span className="helper-copy">Parolă temporară: {result.temporaryPassword}</span>
            </div>
          ) : null}

          <div className="form-actions">
            <button className="button secondary" type="button" onClick={() => setOpen(false)}>
              Anulează
            </button>
            <button className="button primary" type="submit" disabled={isPending}>
              {isPending ? "Se creează..." : "Creează utilizatorul"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
