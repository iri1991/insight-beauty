import { LoginForm } from "../../components/login-form";
import { isDatabaseConfigured } from "../../lib/auth";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const returnTo = params?.returnTo || null;

  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Autentificare</span>
            <h1>Intră în Insight Beauty</h1>
            {returnTo ? (
              <p className="lead-copy">Autentifică-te pentru a continua evaluarea.</p>
            ) : null}
          </div>
        </div>

        {isDatabaseConfigured() ? (
          <div className="card-grid two-up">
            <div className="detail-card">
              <h3>Acces securizat pe roluri</h3>
              <p>
                Adminii, managerii de salon și profesioniștii accesează platforma cu conturile lor.
                Clienții se autentifică cu contul primit de la salon.
              </p>
              <p className="helper-copy">
                Nu ai cont? Contactează salonul sau profesionistul tău pentru a-ți fi creat un cont.
              </p>
            </div>
            <LoginForm returnTo={returnTo} />
          </div>
        ) : (
          <div className="detail-card">
            <p>
              Configurează <code>MONGODB_URI</code> în fișierul <code>.env</code>, rulează seed-ul
              inițial (<code>npm run seed</code>) și apoi autentifică-te.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
