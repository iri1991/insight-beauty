import { notFound } from "next/navigation";
import { AccessDenied } from "../../../../../components/access-denied";
import { DossierOperations } from "../../../../../components/dossier-operations";
import { canAccessClientDossier, isDatabaseConfigured, requireUser } from "../../../../../lib/auth";
import { getClientById, getProfessionalById, getSalonBySlug } from "../../../../../lib/repositories";
import { getTipologyByCode } from "../../../../../lib/source-library";

export default async function ClientDossierPage({ params }) {
  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Mongo neconfigurat" body="Configureaza baza de date pentru a accesa dosarele clientilor." />;
  }

  const salon = await getSalonBySlug(params.slug);
  const client = await getClientById(params.clientId);

  if (!salon || !client || client.salonId !== salon._id) {
    notFound();
  }

  const user = await requireUser();

  if (!canAccessClientDossier(user, salon, client)) {
    return <AccessDenied body="Nu ai acces la acest dosar de client." />;
  }

  const professional = await getProfessionalById(client.professionalId);
  const tipologyDocument = getTipologyByCode(client.baumannType);

  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Client dossier</span>
            <h1>
              {client.firstName} {client.lastName}
            </h1>
          </div>
          <span className="tag tag-soft">{client.dossierId}</span>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Salon</span>
            <strong>{salon.name}</strong>
          </article>
          <article className="metric-card">
            <span>Profesionist</span>
            <strong>{professional?.displayName || [professional?.firstName, professional?.lastName].filter(Boolean).join(" ") || "Nealocat"}</strong>
          </article>
          <article className="metric-card">
            <span>Ultima evaluare</span>
            <strong>{client.latestAssessment?.label || "Fara evaluare"}</strong>
          </article>
          <article className="metric-card">
            <span>Trend</span>
            <strong>{client.progressSnapshot?.trend || "n/a"}</strong>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="workspace-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Snapshot</span>
                <h2>Context clinic si confidentialitate</h2>
              </div>
            </div>

            <div className="card-grid two-up">
              <article className="detail-card">
                <h3>Date de baza</h3>
                <div className="metric-row">
                  <span>Email</span>
                  <strong>{client.email}</strong>
                </div>
                <div className="metric-row">
                  <span>Telefon</span>
                  <strong>{client.phone}</strong>
                </div>
                <div className="metric-row">
                  <span>Segment varsta</span>
                  <strong>{client.ageBand}</strong>
                </div>
              </article>

              <article className="detail-card">
                <h3>Confidentialitate</h3>
                <p>Datele acestui dosar sunt vizibile doar in tenantul salonului si pentru admin prin impersonare controlata.</p>
                <div className="tags-row">
                  {(client.consentStatus || []).map((item) => (
                    <span key={item} className="tag tag-soft">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </div>

            <article className="detail-card">
              <div className="card-row">
                <h3>Preocupari principale</h3>
                <span className="tag">{client.baumannType}</span>
              </div>
              <div className="tags-row">
                {(client.primaryConcerns || []).map((concern) => (
                  <span key={concern} className="tag tag-soft">
                    {concern}
                  </span>
                ))}
              </div>
              <p className="helper-copy">{client.progressSnapshot?.baseline || "Baseline in curs de completare."}</p>
              <p>{client.progressSnapshot?.current || "Snapshot-ul curent va fi actualizat dupa debriefing."}</p>
            </article>
          </div>

          <aside className="panel results-shell">
            <div className="hero-card inset-card">
              <span className="eyebrow">Baumann profile</span>
              <h3>{client.baumannProfile?.code || client.baumannType || "Necompletat"}</h3>
              <p className="lead-copy">
                {client.baumannProfile?.summary || "Profilul Baumann va fi populat dupa evaluarea profesionala."}
              </p>
            </div>

            <div className="detail-card">
              <span className="eyebrow">Dimensiuni</span>
              {Object.entries(client.baumannProfile?.dimensions || {}).map(([key, value]) => (
                <div key={key} className="metric-row">
                  <span>{key}</span>
                  <strong>{value}p</strong>
                </div>
              ))}
            </div>

            {tipologyDocument ? (
              <div className="detail-card">
                <span className="eyebrow">Interpretare tipologie</span>
                <p>{tipologyDocument.preview}</p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Treatment plan</span>
            <h2>Plan activ si homecare</h2>
          </div>
          <span className="tag">{client.treatmentProgram?.status || "draft"}</span>
        </div>

        <DossierOperations
          clientId={client._id}
          treatmentProgram={client.treatmentProgram || null}
          treatmentPlanSummary={client.treatmentPlanSummary || ""}
          progressSnapshot={client.progressSnapshot || null}
          primaryConcerns={client.primaryConcerns || []}
          riskFlags={client.riskFlags || []}
          nextSession={client.nextSession || ""}
        />

        <div className="card-grid three-up">
          <article className="detail-card">
            <h3>Obiective</h3>
            <div className="stack compact-list">
              {(client.treatmentProgram?.goals || []).map((goal) => (
                <p key={goal}>{goal}</p>
              ))}
            </div>
          </article>

          <article className="detail-card">
            <h3>Protocol in cabinet</h3>
            <div className="stack compact-list">
              {(client.treatmentProgram?.inCabinProtocols || []).map((protocol) => (
                <p key={protocol}>{protocol}</p>
              ))}
            </div>
          </article>

          <article className="detail-card">
            <h3>Homecare</h3>
            <div className="stack compact-list">
              {(client.treatmentProgram?.homecare || []).map((step) => (
                <p key={step}>{step}</p>
              ))}
            </div>
          </article>
        </div>

        <div className="card-grid two-up">
          <article className="detail-card">
            <div className="metric-row">
              <span>Cadenta</span>
              <strong>{client.treatmentProgram?.cadence || "Nesetata"}</strong>
            </div>
            <div className="metric-row">
              <span>Review</span>
              <strong>{client.treatmentProgram?.reviewCadence || "Nesetat"}</strong>
            </div>
          </article>

          <article className="detail-card">
            <div className="metric-row">
              <span>Next session</span>
              <strong>{client.nextSession ? client.nextSession.slice(0, 16).replace("T", " ") : "Nesetata"}</strong>
            </div>
            <div className="tags-row">
              {(client.riskFlags || []).map((flag) => (
                <span key={flag} className="tag tag-soft">
                  {flag}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Tracking</span>
            <h2>Evaluari, alocari si sedinte</h2>
          </div>
        </div>

        <div className="card-grid two-up">
          <article className="detail-card">
            <h3>Istoric evaluari</h3>
            <div className="timeline compact-timeline">
              {(client.assessmentHistory || []).map((assessment) => (
                <article key={`${assessment.questionnaireSlug}-${assessment.submittedAt}`} className="timeline-card">
                  <strong>{assessment.label}</strong>
                  <p>{assessment.questionnaireSlug}</p>
                  <p>{assessment.insight}</p>
                  <p className="helper-copy">{assessment.submittedAt ? assessment.submittedAt.slice(0, 10) : "fara data"}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="detail-card">
            <h3>Chestionare distribuite</h3>
            <div className="timeline compact-timeline">
              {(client.questionnaireAssignments || []).map((assignment) => (
                <article key={`${assignment.questionnaireSlug}-${assignment.sharedAt}`} className="timeline-card">
                  <strong>{assignment.questionnaireSlug}</strong>
                  <p>{assignment.channel}</p>
                  <p className="helper-copy">
                    {assignment.status} · {assignment.sharedAt ? assignment.sharedAt.slice(0, 10) : "fara data"}
                  </p>
                </article>
              ))}
            </div>
          </article>
        </div>

        <article className="detail-card">
          <h3>Istoric sedinte</h3>
          <div className="timeline">
            {(client.sessionHistory || []).map((session) => (
              <article key={session.id} className="timeline-card">
                <strong>{session.service}</strong>
                <p>{session.objective}</p>
                <p>{session.notes}</p>
                <p className="helper-copy">
                  {session.date} · {session.status}
                </p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
