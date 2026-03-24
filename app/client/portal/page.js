import { redirect } from "next/navigation";
import { AccessDenied } from "../../../components/access-denied";
import { isDatabaseConfigured, requireUser } from "../../../lib/auth";
import { connectMongo } from "../../../lib/mongodb";
import { getModels } from "../../../lib/mongoose-models";
import { getSalonById } from "../../../lib/repositories";

async function getClientDossier(email) {
  if (!isDatabaseConfigured()) return null;
  await connectMongo();
  const { ClientProfile } = getModels();
  return ClientProfile.findOne({ email: email.toLowerCase() }).sort({ createdAt: 1 }).lean().exec();
}

function formatDate(dateString) {
  if (!dateString) return "—";
  return dateString.slice(0, 10);
}

export default async function ClientPortalPage() {
  if (!isDatabaseConfigured()) {
    return (
      <AccessDenied
        title="Portal indisponibil"
        body="Baza de date nu este configurată. Contactează salonul pentru acces la dosarul tău."
      />
    );
  }

  const user = await requireUser();

  if (user.role !== "client") {
    if (user.role === "admin") redirect("/admin");
    if (user.salonSlug) redirect(`/salon/${user.salonSlug}`);
    redirect("/");
  }

  const dossier = await getClientDossier(user.email);
  const salon = dossier?.salonId ? await getSalonById(dossier.salonId) : null;

  if (!dossier) {
    return (
      <div className="stack page-stack">
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Portalul tău</span>
              <h1>Bun venit, {user.displayName}</h1>
            </div>
          </div>
          <div className="detail-card" style={{ maxWidth: 500 }}>
            <h3>Nu ai nicio fișă înregistrată</h3>
            <p>
              Fișa ta personală se creează automat după completarea primului chestionar de evaluare. Accesează linkul primit
              de la profesionistul tău pentru a începe.
            </p>
            <a className="button primary" href="/client/intake">
              Completează un chestionar
            </a>
          </div>
        </section>
      </div>
    );
  }

  const assessments = dossier.assessmentHistory || [];
  const sessions = dossier.sessionHistory || [];
  const timeline = dossier.timeline || [];
  const treatmentProgram = dossier.treatmentProgram || {};

  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Dosarul tău personal</span>
            <h1>
              {dossier.firstName} {dossier.lastName}
            </h1>
          </div>
          <div className="tag-cluster">
            {dossier.baumannType ? <span className="tag">{dossier.baumannType}</span> : null}
            <span className="tag tag-soft">#{dossier.dossierId?.slice(-8)?.toUpperCase()}</span>
          </div>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Evaluări completate</span>
            <strong>{assessments.length}</strong>
          </article>
          <article className="metric-card">
            <span>Ședințe înregistrate</span>
            <strong>{sessions.length}</strong>
          </article>
          <article className="metric-card">
            <span>Salon</span>
            <strong>{salon?.name || "—"}</strong>
          </article>
          <article className="metric-card">
            <span>Următoarea ședință</span>
            <strong>{dossier.nextSession ? formatDate(dossier.nextSession) : "Nesetată"}</strong>
          </article>
        </div>
      </section>

      {dossier.latestAssessment ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Ultima evaluare</span>
              <h2>Rezultatul tău curent</h2>
            </div>
          </div>
          <div className="detail-card result-spotlight">
            <div className="card-row">
              <h3>{dossier.latestAssessment.label}</h3>
              {typeof dossier.latestAssessment.score === "number" ? (
                <span className="tag">{dossier.latestAssessment.score} puncte</span>
              ) : null}
            </div>
            {dossier.latestAssessment.insight ? <p>{dossier.latestAssessment.insight}</p> : null}
            <p className="helper-copy">
              {dossier.latestAssessment.questionnaireSlug} · {formatDate(dossier.latestAssessment.submittedAt)}
            </p>
          </div>
        </section>
      ) : null}

      {treatmentProgram.status ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Planul tău de îngrijire</span>
              <h2>Program activ</h2>
            </div>
            <span className="tag">{treatmentProgram.status}</span>
          </div>
          <div className="card-grid two-up">
            {treatmentProgram.goals?.length > 0 ? (
              <article className="detail-card">
                <h3>Obiective</h3>
                <ul className="plain-list">
                  {treatmentProgram.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </article>
            ) : null}
            {treatmentProgram.homecare?.length > 0 ? (
              <article className="detail-card">
                <h3>Rutina acasă</h3>
                <ul className="plain-list">
                  {treatmentProgram.homecare.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}
            {treatmentProgram.inCabinProtocols?.length > 0 ? (
              <article className="detail-card">
                <h3>Protocoale în cabinet</h3>
                <ul className="plain-list">
                  {treatmentProgram.inCabinProtocols.map((protocol, index) => (
                    <li key={index}>{protocol}</li>
                  ))}
                </ul>
              </article>
            ) : null}
            {treatmentProgram.cadence ? (
              <article className="detail-card">
                <h3>Cadență tratamente</h3>
                <p>{treatmentProgram.cadence}</p>
                {treatmentProgram.reviewCadence ? <p className="helper-copy">Review: {treatmentProgram.reviewCadence}</p> : null}
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {assessments.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Istoricul evaluărilor</span>
              <h2>Evoluția ta în timp</h2>
            </div>
          </div>
          <div className="card-grid two-up">
            {assessments.map((assessment, index) => (
              <article key={index} className="detail-card">
                <div className="card-row">
                  <h3>{assessment.label}</h3>
                  {typeof assessment.score === "number" ? <span className="tag">{assessment.score}p</span> : null}
                </div>
                {assessment.insight ? <p>{assessment.insight}</p> : null}
                <p className="helper-copy">{assessment.questionnaireSlug} · {formatDate(assessment.submittedAt)}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {sessions.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Ședințe înregistrate</span>
              <h2>Traseul terapeutic</h2>
            </div>
          </div>
          <div className="timeline">
            {sessions.map((session, index) => (
              <article key={index} className="timeline-card">
                <strong>{session.service}</strong>
                <p>{session.notes || "—"}</p>
                <p className="helper-copy">{formatDate(session.date)} · {session.status}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {timeline.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Timeline</span>
              <h2>Istoricul complet</h2>
            </div>
          </div>
          <div className="timeline">
            {[...timeline].reverse().map((event, index) => (
              <article key={index} className="timeline-card">
                <strong>{formatDate(event.date)}</strong>
                <p>{event.event}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
