import Link from "next/link";
import { AccessDenied } from "../../components/access-denied";
import { canAccessAdmin, isDatabaseConfigured, requireUser } from "../../lib/auth";
import { listQuestionnaireCatalog } from "../../lib/questionnaire-engine";
import { getAdminSnapshot, listClientsForSalon, listProfessionalsForSalon, listSalons } from "../../lib/repositories";
import { getSourceDocuments, getSourceStats } from "../../lib/source-library";

export default async function AdminPage() {
  if (!isDatabaseConfigured()) {
    return (
      <AccessDenied
        title="Mongo neconfigurat"
        body="Configureaza baza de date si ruleaza seed-ul initial pentru a folosi consola admin cu date reale."
      />
    );
  }

  const user = await requireUser();

  if (!canAccessAdmin(user)) {
    return <AccessDenied body="Doar un utilizator cu rol admin poate accesa consola globala." />;
  }

  const questionnaireCatalog = listQuestionnaireCatalog();
  const sourceStats = getSourceStats();
  const sourceDocuments = getSourceDocuments().slice(0, 8);
  const adminSnapshot = await getAdminSnapshot();
  const salons = await listSalons();
  const salonCards = await Promise.all(
    salons.map(async (salon) => ({
      ...salon,
      professionals: await listProfessionalsForSalon(salon._id),
      clients: await listClientsForSalon(salon._id)
    }))
  );

  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Admin console</span>
            <h1>Control tower pentru intrebari, interpretari, tenanturi si impersonare.</h1>
          </div>
          <span className="tag tag-soft">cross-salon visibility only for admins</span>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Saloane</span>
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
            <span>Documente sursa</span>
            <strong>{sourceStats.total || adminSnapshot.sourceDocumentsIndexed}</strong>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Questionnaire registry</span>
            <h2>Starea codificarii</h2>
          </div>
        </div>
        <div className="card-grid three-up">
          {questionnaireCatalog.map((questionnaire) => (
            <article key={questionnaire.slug} className="detail-card">
              <div className="card-row">
                <h3>{questionnaire.title}</h3>
                <span className="tag">{questionnaire.status}</span>
              </div>
              <p>{questionnaire.description}</p>
              <div className="detail-list">
                <div className="metric-row">
                  <span>Audience</span>
                  <strong>{questionnaire.audience}</strong>
                </div>
                <div className="metric-row">
                  <span>Coverage</span>
                  <strong>{questionnaire.sourceCoverage}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Tenant boundaries</span>
            <h2>Acces si impersonare</h2>
          </div>
        </div>
        <div className="card-grid three-up">
          {salonCards.map((salon) => (
            <article key={salon._id} className="detail-card">
              <h3>{salon.name}</h3>
              <p>{salon.city}</p>
              <div className="metric-row">
                <span>Profesionisti</span>
                <strong>{salon.professionals.length}</strong>
              </div>
              <div className="metric-row">
                <span>Clienti</span>
                <strong>{salon.clients.length}</strong>
              </div>
              <p className="helper-copy">
                Datele sunt izolate la nivel de salon; doar adminii pot inspecta alt tenant prin impersonare controlata.
              </p>
              <Link className="text-link" href={`/salon/${salon.slug}`}>
                Deschide tenantul
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Source library</span>
            <h2>Trasabilitate documentara</h2>
          </div>
        </div>
        <div className="card-grid two-up">
          {sourceDocuments.map((document) => (
            <article key={document.id} className="detail-card">
              <div className="card-row">
                <h3>{document.fileName}</h3>
                <span className="tag">{document.kind}</span>
              </div>
              <p>{document.preview}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
