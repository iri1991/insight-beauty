import { LoginForm } from "../../components/login-form";
import { isDatabaseConfigured } from "../../lib/auth";

export default function LoginPage() {
  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Authentication</span>
            <h1>Login Insight Beauty</h1>
          </div>
        </div>

        {isDatabaseConfigured() ? (
          <div className="card-grid two-up">
            <div className="detail-card">
              <h3>Acces pe roluri</h3>
              <p>Adminii, managerii de salon si profesionistii intra prin sesiuni reale, stocate in Mongo.</p>
              <p className="helper-copy">Dupa seed initial vei avea conturi reale pentru fiecare rol.</p>
            </div>
            <LoginForm />
          </div>
        ) : (
          <div className="detail-card">
            <p>Aplicatia ruleaza fara fallback demo. Configureaza `MONGODB_URI`, ruleaza seed-ul si apoi autentifica-te.</p>
          </div>
        )}
      </section>
    </div>
  );
}

