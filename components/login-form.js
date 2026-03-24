"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
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
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        });

        const payload = await response.json();

        if (!response.ok) {
          setError(payload.error || "Autentificarea a esuat.");
          return;
        }

        router.push(payload.redirectTo || "/");
        router.refresh();
      })();
    });
  }

  return (
    <form className="detail-card auth-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@insightbeauty.local" />
      </label>

      <label className="field">
        <span>Parola</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
      </label>

      {error ? <p className="inline-error">{error}</p> : null}

      <button className="button primary" type="submit" disabled={isPending}>
        {isPending ? "Autentificare..." : "Login"}
      </button>
    </form>
  );
}

