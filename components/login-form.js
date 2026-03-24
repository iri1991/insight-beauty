"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm({ returnTo }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const payload = await response.json();

        if (!response.ok) {
          setError(payload.error || "Autentificarea a eșuat.");
          return;
        }

        const destination = returnTo || payload.redirectTo || "/";
        router.push(destination);
        router.refresh();
      })();
    });
  }

  return (
    <form className="detail-card auth-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="field-label">Email</label>
        <input
          className="field-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplu@salon.ro"
          required
          autoFocus
        />
      </div>

      <div className="field-group">
        <label className="field-label">Parolă</label>
        <input
          className="field-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="button primary" type="submit" disabled={isPending} style={{ width: "100%" }}>
        {isPending ? "Autentificare..." : "Intră în platformă"}
      </button>

      {returnTo ? (
        <p className="helper-copy" style={{ marginTop: "0.5rem", textAlign: "center" }}>
          După autentificare vei fi redirecționat la evaluarea ta.
        </p>
      ) : null}
    </form>
  );
}
