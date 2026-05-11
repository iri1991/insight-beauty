import Link from "next/link";
import { notFound } from "next/navigation";
import { AccessDenied } from "../../../../../components/access-denied";
import { BaumannWorkbench } from "../../../../../components/baumann-workbench";
import { canAccessProfessional, isDatabaseConfigured, requireUser } from "../../../../../lib/auth";
import { getProfessionalShareBundles } from "../../../../../lib/repositories";
import { getTipologyCatalog } from "../../../../../lib/source-library";

function formatDate(d) {
  if (!d) return "—";
  return String(d).slice(0, 10);
}

export default async function ProfessionalWorkspacePage({ params }) {
  const resolvedParams = await params;

  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Serviciu indisponibil" body="Configurează baza de date pentru a folosi workspace-ul profesionistului." />;
  }

  const { getSalonBySlug, getProfessionalById, listClientsForProfessional, listRecentResponsesForProfessional } = await import(
    "../../../../../lib/repositories"
  );

  const salon = await getSalonBySlug(resolvedParams.slug);
  const professional = await getProfessionalById(resolvedParams.professionalId);

  if (!salon || !professional || professional.salonId !== salon._id) {
    notFound();
  }

  const user = await requireUser();

  if (!canAccessProfessional(user, salon, professional)) {
    return <AccessDenied body="Nu ai acces la workspace-ul acestui profesionist." />;
  }

  const clients = await listClientsForProfessional(professional._id);
  const responses = await listRecentResponsesForProfessional(professional._id);
  const shareBundles = await getProfessionalShareBundles(salon, professional);
  const tipologyCatalog = getTipologyCatalog().map((entry) => ({
    code: entry.code,
    preview: entry.preview,
    fileName: entry.fileName
  }));

  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Workspace profesionist</span>
            <h1>{professional.displayName || [professional.firstName, professional.lastName].filter(Boolean).join(" ")}</h1>
          </div>
          <div className="button-row">
            <a className="button primary" href={`/salon/${salon.slug}/professionals/${professional._id}/intake`}>
              + Evaluare nouă
            </a>
            {professional.specialty ? <span className="tag tag-soft">{professional.specialty}</span> : null}
          </div>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Salon</span>
            <strong>{salon.name}</strong>
          </article>
          <article className="metric-card">
            <span>Clienți activi</span>
            <strong>{clients.length}</strong>
          </article>
          <article className="metric-card">
            <span>Follow-up azi</span>
            <strong>{professional.todayFollowUps || 0}</strong>
          </article>
          <article className="metric-card">
            <span>Capacitate săptămânală</span>
            <strong>{professional.weeklyCapacity || 0}</strong>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Link-uri de evaluare</span>
            <h2>Chestionare gata de trimis clienților</h2>
          </div>
        </div>

        <div className="card-grid two-up">
          {shareBundles.map((bundle) => (
            <article key={bundle.questionnaireSlug} className="detail-card">
              <div className="card-row">
                <h3>{bundle.title}</h3>
                <span className="tag tag-soft">{bundle.shareCode}</span>
              </div>
              <p>{bundle.description}</p>
              <p className="helper-copy">{bundle.intakeLink}</p>
              <Link className="text-link" href={bundle.intakeLink}>
                Deschide link-ul de evaluare →
              </Link>
            </article>
          ))}
          {shareBundles.length === 0 ? (
            <article className="detail-card empty-card">
              <p className="helper-copy">Niciun link de evaluare generat. Adaugă clienți pentru a genera link-uri personalizate.</p>
            </article>
          ) : null}
        </div>
      </section>

      <BaumannWorkbench tipologyCatalog={tipologyCatalog} />

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Dosare active</span>
            <h2>Clienții alocați</h2>
          </div>
        </div>

        <div className="card-grid two-up">
          {clients.map((client) => (
            <article key={client._id} className="detail-card">
              <div className="card-row">
                <h3>
                  {client.firstName} {client.lastName}
                </h3>
                <span className="tag">{client.baumannType}</span>
              </div>
              <p>{client.treatmentPlanSummary || "Planul va fi completat după evaluarea curentă."}</p>
              <div className="metric-row">
                <span>Ultima evaluare</span>
                <strong>{client.latestAssessment?.label || "Fără evaluare"}</strong>
              </div>
              <div className="metric-row">
                <span>Evoluție</span>
                <strong>
                  {client.progressSnapshot?.trend === "improving" ? "Îmbunătățire" :
                   client.progressSnapshot?.trend === "worsening" ? "În creștere" :
                   client.progressSnapshot?.trend === "stable" ? "Stabil" : "—"}
                </strong>
              </div>
              <div className="tags-row">
                {(client.primaryConcerns || []).map((concern) => (
                  <span key={concern} className="tag tag-soft">
                    {concern}
                  </span>
                ))}
              </div>
              <Link className="text-link" href={`/salon/${salon.slug}/clients/${client._id}`}>
                Deschide fișa completă →
              </Link>
            </article>
          ))}
          {clients.length === 0 ? (
            <article className="detail-card empty-card">
              <p className="helper-copy">Niciun client alocat. Trimite un link de evaluare pentru a înregistra primul client.</p>
            </article>
          ) : null}
        </div>
      </section>

      {responses.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Activitate recentă</span>
              <h2>Ultimele evaluări primite</h2>
            </div>
          </div>

          <div className="timeline">
            {responses.map((response) => (
              <article key={response._id} className="timeline-card">
                <strong>{response.evaluation?.band?.label || response.resultLabel || "Evaluare completată"}</strong>
                <p className="helper-copy">{formatDate(response.createdAt || response.submittedAt)}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
