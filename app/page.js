import Link from "next/link";
import { PwaFoundation } from "../components/pwa-foundation";
import { isDatabaseConfigured } from "../lib/auth";
import { listQuestionnaireCatalog } from "../lib/questionnaire-engine";
import { getAdminSnapshot } from "../lib/repositories";
import { getSourceStats } from "../lib/source-library";

const roleColumns = [
  {
    title: "Admini",
    copy: "Controleaza configuratia platformei, formularele, interpretarile, impersonarea per salon si observabilitatea globala."
  },
  {
    title: "Saloane",
    copy: "Functioneaza ca tenant separat, cu acces strict la propriii profesionisti, clienti, raspunsuri si planuri de tratament."
  },
  {
    title: "Profesionisti",
    copy: "Distribuie chestionare, interpreteaza raspunsurile, construiesc planuri si urmaresc evolutia in fisa clientului."
  },
  {
    title: "Clienti",
    copy: "Completeaza intake-ul, primesc confirmari pe email, interpretari si propuneri de programare pentru debriefing."
  }
];

const journey = [
  "Adminul construieste biblioteca de formulare, seturile de raspuns si regulile de interpretare din documentele sursa.",
  "Salonul isi configureaza echipa, iar profesionistii distribuie linkurile de chestionar catre clienti.",
  "Clientul completeaza datele personale si raspunsurile, iar sistemul evalueaza rezultatul pe server.",
  "Se genereaza fisa personala, istoricul longitudinal, recomandarea de tratament si propunerea de debriefing."
];

export default async function HomePage() {
  const questionnaireCatalog = listQuestionnaireCatalog();
  const sourceStats = getSourceStats();
  const adminSnapshot = await getAdminSnapshot();

  return (
    <div className="stack page-stack">
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Beauty intelligence platform</span>
            <h1>O aplicatie fullstack JS + Mongo gandita pentru beauty, health si confidentialitate reala per salon.</h1>
            <p className="lead-copy">
              MVP-ul de aici pune in acelasi sistem: intake clinic, motor configurabil de formulare si scoruri, profil
              longitudinal client, spatiu de lucru pentru salon si consola de admin.
            </p>
            {!isDatabaseConfigured() ? (
              <p className="inline-error">Mongo nu este configurat inca. Runtime-ul real necesita `MONGODB_URI` si seed initial.</p>
            ) : null}
            <div className="button-row">
              <Link className="button primary" href="/client/intake">
                Testeaza fluxul client
              </Link>
              <Link className="button secondary" href="/admin">
                Vezi consola admin
              </Link>
            </div>
          </div>

          <div className="hero-card spotlight">
            <div className="metric-grid">
              <article className="metric-card">
                <span>Tenanturi active</span>
                <strong>{adminSnapshot.salons}</strong>
              </article>
              <article className="metric-card">
                <span>Profesionisti</span>
                <strong>{adminSnapshot.professionals}</strong>
              </article>
              <article className="metric-card">
                <span>Clienti activi</span>
                <strong>{adminSnapshot.activeClients}</strong>
              </article>
              <article className="metric-card">
                <span>Formulare active</span>
                <strong>{adminSnapshot.activeForms}</strong>
              </article>
            </div>
            <div className="insight-panel">
              <span className="eyebrow">Source traceability</span>
              <h3>{sourceStats.total || 0} documente sursa indexate</h3>
              <p>
                Documentele din `source` sunt tratate ca strat editorial: intrebari, interpretari, tipologii si
                consimtamant.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Operating model</span>
            <h2>Patru entitati, un singur nucleu de date</h2>
          </div>
        </div>
        <div className="card-grid four-up">
          {roleColumns.map((role) => (
            <article key={role.title} className="detail-card">
              <h3>{role.title}</h3>
              <p>{role.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Client journey</span>
            <h2>Fluxul cap-coada</h2>
          </div>
        </div>
        <div className="timeline">
          {journey.map((step) => (
            <article key={step} className="timeline-card">
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Form engine</span>
            <h2>Ce este activ in primul increment</h2>
          </div>
        </div>
        <div className="card-grid three-up">
          {questionnaireCatalog.map((questionnaire) => (
            <article key={questionnaire.slug} className="detail-card">
              <div className="card-row">
                <h3>{questionnaire.title}</h3>
                <span className={`tag ${questionnaire.status === "active" ? "tag-soft" : ""}`}>{questionnaire.status}</span>
              </div>
              <p>{questionnaire.description}</p>
              <p className="helper-copy">Sursa: {questionnaire.sourceRefs.join(", ")}</p>
            </article>
          ))}
        </div>
      </section>

      <PwaFoundation />
    </div>
  );
}
