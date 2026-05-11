import { notFound } from "next/navigation";
import { AccessDenied } from "../../../../../components/access-denied";
import { DossierOperations } from "../../../../../components/dossier-operations";
import { canAccessClientDossier, isDatabaseConfigured, requireUser } from "../../../../../lib/auth";
import { getClientById, getProfessionalById, getSalonBySlug } from "../../../../../lib/repositories";
import { getTipologyByCode } from "../../../../../lib/source-library";

const TREATMENT_STATUS_LABELS = {
  draft: "Draft",
  active: "Activ",
  "pending-debrief": "Necesită debriefing",
  complete: "Finalizat",
  paused: "În pauză"
};

const ASSIGNMENT_STATUS_LABELS = {
  pending: "Necompletat",
  completed: "Completat",
  expired: "Expirat"
};

const CHANNEL_LABELS = {
  link: "Link direct",
  email: "Email",
  sms: "SMS",
  app: "Aplicație"
};

function formatDate(d) {
  if (!d) return "—";
  return String(d).slice(0, 10);
}

export default async function ClientDossierPage({ params }) {
  const resolvedParams = await params;

  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Serviciu indisponibil" body="Configurează baza de date pentru a accesa dosarele clienților." />;
  }

  const salon = await getSalonBySlug(resolvedParams.slug);
  const client = await getClientById(resolvedParams.clientId);

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
            <span className="eyebrow">Dosar client</span>
            <h1>
              {client.firstName} {client.lastName}
            </h1>
          </div>
          {client.dossierId ? (
            <span className="tag tag-soft">#{client.dossierId.slice(-8).toUpperCase()}</span>
          ) : null}
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
            <strong>{client.latestAssessment?.label || "Fără evaluare"}</strong>
          </article>
          <article className="metric-card">
            <span>Evoluție</span>
            <strong>
              {client.progressSnapshot?.trend === "improving" ? "Îmbunătățire" :
               client.progressSnapshot?.trend === "worsening" ? "În creștere" :
               client.progressSnapshot?.trend === "stable" ? "Stabil" : "—"}
            </strong>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="workspace-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Profil clinic</span>
                <h2>Date personale și context de îngrijire</h2>
              </div>
            </div>

            <div className="card-grid two-up">
              <article className="detail-card">
                <h3>Date de bază</h3>
                <div className="metric-row">
                  <span>Email</span>
                  <strong>{client.email}</strong>
                </div>
                <div className="metric-row">
                  <span>Telefon</span>
                  <strong>{client.phone || "—"}</strong>
                </div>
                <div className="metric-row">
                  <span>Segment vârstă</span>
                  <strong>{client.ageBand || "—"}</strong>
                </div>
              </article>

              <article className="detail-card">
                <h3>Consimțământ și confidențialitate</h3>
                <p>Datele acestui dosar sunt vizibile exclusiv în cadrul salonului și pentru personalul autorizat.</p>
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
                <h3>Preocupări principale</h3>
                {client.baumannType ? <span className="tag">{client.baumannType}</span> : null}
              </div>
              <div className="tags-row">
                {(client.primaryConcerns || []).map((concern) => (
                  <span key={concern} className="tag tag-soft">
                    {concern}
                  </span>
                ))}
              </div>
              {client.progressSnapshot?.baseline ? (
                <p className="helper-copy">{client.progressSnapshot.baseline}</p>
              ) : null}
              {client.progressSnapshot?.current ? (
                <p>{client.progressSnapshot.current}</p>
              ) : null}
            </article>
          </div>

          <aside className="panel results-shell">
            <div className="hero-card inset-card">
              <span className="eyebrow">Profil Baumann</span>
              <h3>{client.baumannProfile?.code || client.baumannType || "Necompletat"}</h3>
              <p className="lead-copy">
                {client.baumannProfile?.summary || "Profilul Baumann va fi populat după evaluarea profesională."}
              </p>
            </div>

            {Object.keys(client.baumannProfile?.dimensions || {}).length > 0 ? (
              <div className="detail-card">
                <span className="eyebrow">Dimensiuni</span>
                {Object.entries(client.baumannProfile.dimensions).map(([key, value]) => (
                  <div key={key} className="metric-row">
                    <span>{key}</span>
                    <strong>{value}p</strong>
                  </div>
                ))}
              </div>
            ) : null}

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
            <span className="eyebrow">Plan de tratament</span>
            <h2>Program activ și rutină de îngrijire</h2>
          </div>
          <span className="tag">
            {TREATMENT_STATUS_LABELS[client.treatmentProgram?.status] || client.treatmentProgram?.status || "Draft"}
          </span>
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
            <h3>Protocol în cabinet</h3>
            <div className="stack compact-list">
              {(client.treatmentProgram?.inCabinProtocols || []).map((protocol) => (
                <p key={protocol}>{protocol}</p>
              ))}
            </div>
          </article>

          <article className="detail-card">
            <h3>Rutină acasă</h3>
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
              <span>Cadență ședințe</span>
              <strong>{client.treatmentProgram?.cadence || "Nesetată"}</strong>
            </div>
            <div className="metric-row">
              <span>Revizuire plan</span>
              <strong>{client.treatmentProgram?.reviewCadence || "Nesetată"}</strong>
            </div>
          </article>

          <article className="detail-card">
            <div className="metric-row">
              <span>Următoarea ședință</span>
              <strong>{client.nextSession ? client.nextSession.slice(0, 16).replace("T", " ") : "Nesetată"}</strong>
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
            <span className="eyebrow">Istoric</span>
            <h2>Evaluări, chestionare distribuite și ședințe</h2>
          </div>
        </div>

        <div className="card-grid two-up">
          <article className="detail-card">
            <h3>Istoric evaluări</h3>
            <div className="timeline compact-timeline">
              {(client.assessmentHistory || []).map((assessment) => (
                <article key={`${assessment.questionnaireSlug}-${assessment.submittedAt}`} className="timeline-card">
                  <strong>{assessment.label}</strong>
                  {assessment.insight ? <p>{assessment.insight}</p> : null}
                  <p className="helper-copy">{formatDate(assessment.submittedAt)}</p>
                </article>
              ))}
              {(client.assessmentHistory || []).length === 0 ? (
                <p className="helper-copy">Nicio evaluare înregistrată.</p>
              ) : null}
            </div>
          </article>

          <article className="detail-card">
            <h3>Chestionare distribuite</h3>
            <div className="timeline compact-timeline">
              {(client.questionnaireAssignments || []).map((assignment) => (
                <article key={`${assignment.questionnaireSlug}-${assignment.sharedAt}`} className="timeline-card">
                  <strong>{assignment.questionnaireSlug}</strong>
                  <p className="helper-copy">
                    {ASSIGNMENT_STATUS_LABELS[assignment.status] || assignment.status}
                    {" · "}
                    {CHANNEL_LABELS[assignment.channel] || assignment.channel || ""}
                    {" · "}
                    {formatDate(assignment.sharedAt)}
                  </p>
                </article>
              ))}
              {(client.questionnaireAssignments || []).length === 0 ? (
                <p className="helper-copy">Niciun chestionar distribuit.</p>
              ) : null}
            </div>
          </article>
        </div>

        <article className="detail-card">
          <h3>Istoric ședințe</h3>
          <div className="timeline">
            {(client.sessionHistory || []).map((session) => (
              <article key={session.id} className="timeline-card">
                <strong>{session.service}</strong>
                {session.objective ? <p>{session.objective}</p> : null}
                {session.notes ? <p>{session.notes}</p> : null}
                <p className="helper-copy">
                  {formatDate(session.date)}
                  {session.status ? ` · ${session.status}` : ""}
                </p>
              </article>
            ))}
            {(client.sessionHistory || []).length === 0 ? (
              <p className="helper-copy">Nicio ședință înregistrată.</p>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  );
}
