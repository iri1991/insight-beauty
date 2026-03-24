import Link from "next/link";
import { notFound } from "next/navigation";
import { AccessDenied } from "../../../../../components/access-denied";
import { BaumannWorkbench } from "../../../../../components/baumann-workbench";
import { canAccessProfessional, isDatabaseConfigured, requireUser } from "../../../../../lib/auth";
import { getProfessionalShareBundles } from "../../../../../lib/repositories";
import { getTipologyCatalog } from "../../../../../lib/source-library";

export default async function ProfessionalWorkspacePage({ params }) {
  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Mongo neconfigurat" body="Configureaza baza de date pentru a folosi workspace-ul profesionistului." />;
  }

  const { getSalonBySlug, getProfessionalById, listClientsForProfessional, listRecentResponsesForProfessional } = await import(
    "../../../../../lib/repositories"
  );

  const salon = await getSalonBySlug(params.slug);
  const professional = await getProfessionalById(params.professionalId);

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
            <span className="eyebrow">Professional workspace</span>
            <h1>{professional.displayName || [professional.firstName, professional.lastName].filter(Boolean).join(" ")}</h1>
          </div>
          <span className="tag tag-soft">{professional.specialty}</span>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Salon</span>
            <strong>{salon.name}</strong>
          </article>
          <article className="metric-card">
            <span>Clienti activi</span>
            <strong>{clients.length}</strong>
          </article>
          <article className="metric-card">
            <span>Follow-up azi</span>
            <strong>{professional.todayFollowUps}</strong>
          </article>
          <article className="metric-card">
            <span>Capacitate saptamanala</span>
            <strong>{professional.weeklyCapacity || 0}</strong>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Share questionnaires</span>
            <h2>Linkuri gata de trimis catre client</h2>
          </div>
        </div>

        <div className="card-grid two-up">
          {shareBundles.map((bundle) => (
            <article key={bundle.questionnaireSlug} className="detail-card">
              <div className="card-row">
                <h3>{bundle.title}</h3>
                <span className="tag">{bundle.shareCode}</span>
              </div>
              <p>{bundle.description}</p>
              <p className="helper-copy">{bundle.intakeLink}</p>
              <Link className="text-link" href={bundle.intakeLink}>
                Deschide linkul de intake
              </Link>
            </article>
          ))}
        </div>
      </section>

      <BaumannWorkbench tipologyCatalog={tipologyCatalog} />

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Active dossiers</span>
            <h2>Clientii alocati acestui profesionist</h2>
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
              <p>{client.treatmentPlanSummary || "Planul va fi completat dupa evaluarea curenta."}</p>
              <div className="metric-row">
                <span>Ultima evaluare</span>
                <strong>{client.latestAssessment?.label || "Fara evaluare"}</strong>
              </div>
              <div className="metric-row">
                <span>Trend</span>
                <strong>{client.progressSnapshot?.trend || "n/a"}</strong>
              </div>
              <div className="tags-row">
                {(client.primaryConcerns || []).map((concern) => (
                  <span key={concern} className="tag tag-soft">
                    {concern}
                  </span>
                ))}
              </div>
              <Link className="text-link" href={`/salon/${salon.slug}/clients/${client._id}`}>
                Deschide fisa completa
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Recent responses</span>
            <h2>Ultimele raspunsuri primite</h2>
          </div>
        </div>

        <div className="timeline">
          {responses.map((response) => (
            <article key={response._id} className="timeline-card">
              <strong>{response.evaluation?.band?.label || response.resultLabel}</strong>
              <p>{response.questionnaireSlug}</p>
              <p className="helper-copy">{(response.createdAt || response.submittedAt || "").slice(0, 10)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
