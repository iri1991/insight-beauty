"use client";

import { useState } from "react";

export function DemoForm() {
  const [email, setEmail] = useState("");
  const [salon, setSalon] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !salon) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setEmail("");
    setSalon("");
  }

  if (status === "success") {
    return (
      <div className="demo-success" role="status">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="demo-success-icon">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 12l3.5 3.5L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p>
          <strong>Cerere înregistrată!</strong> Te contactăm în maxim 24 de ore pentru a programa demonstrația.
        </p>
      </div>
    );
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit} noValidate>
      <div className="demo-form-row">
        <input
          type="text"
          className="demo-input"
          placeholder="Numele salonului"
          value={salon}
          onChange={(e) => setSalon(e.target.value)}
          required
          aria-label="Numele salonului"
        />
        <input
          type="email"
          className="demo-input"
          placeholder="Adresa ta de email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Adresa de email"
        />
        <button
          type="submit"
          className="button primary demo-submit"
          disabled={status === "loading"}
          aria-label="Solicită demo gratuit"
        >
          {status === "loading" ? (
            <span className="demo-spinner" aria-hidden="true" />
          ) : (
            <>
              Solicită demo gratuit
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="btn-icon">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>
      <p className="demo-disclaimer">
        Fără card de credit. Fără angajament. Configurare în mai puțin de 10 minute.
      </p>
    </form>
  );
}
