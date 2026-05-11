import { LoginForm } from "../../components/login-form";
import { isDatabaseConfigured } from "../../lib/auth";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const returnTo = params?.returnTo || null;

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-brand">
          <span className="auth-logo-mark" aria-hidden="true">✦</span>
          <span className="auth-brand-name">Insight Beauty</span>
        </div>

        <header className="auth-header">
          <h1>Bun venit înapoi</h1>
          <p className="auth-lead">
            {returnTo
              ? "Autentifică-te pentru a continua evaluarea clientului."
              : "Intră în contul tău pentru a accesa platforma."}
          </p>
        </header>

        {isDatabaseConfigured() ? (
          <LoginForm returnTo={returnTo} />
        ) : (
          <div className="auth-notice">
            <p>Platforma nu este disponibilă momentan. Contactează administratorul pentru asistență.</p>
          </div>
        )}

        <p className="auth-footer-note">
          Nu ai cont? Contactează salonul sau profesionistul tău — accesul îți va fi creat direct.
        </p>
      </div>
    </div>
  );
}
