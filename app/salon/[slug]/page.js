import Link from "next/link";
import { notFound } from "next/navigation";
import { AccessDenied } from "../../../components/access-denied";
import { canAccessSalon, isDatabaseConfigured, requireUser } from "../../../lib/auth";
import {
  getProfessionalShareBundles,
  getRecentResponsesForSalon,
  getSalonBySlug,
  listClientsForSalon,
  listProfessionalsForSalon
} from "../../../lib/repositories";

function formatDate(d) {
  if (!d) return "—";
  return String(d).slice(0, 10);
}

export default async function SalonPage({ params, searchParams }) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);

  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Serviciu indisponibil" body="Configurează baza de date pentru a folosi workspace-ul salonului." />;
  }

  const salon = await getSalonBySlug(resolvedParams.slug);

  if (!salon) {
    notFound();
  }

  const user = await requireUser();

  if (!canAccessSalon(user, salon)) {
    return <AccessDenied body="Nu ai acces la acest spațiu de lucru." />;
  }

  const professionals = await listProfessionalsForSalon(salon._id);
  const clients = await listClientsForSalon(salon._id);
  const responses = await getRecentResponsesForSalon(salon._id);
  const professionalsWithShareCounts = await Promise.all(
    professionals.map(async (professional) => ({
      ...professional,
      shareBundles: await getProfessionalShareBundles(salon, professional)
    }))
  );
  const isAdminImpersonating = resolvedSearch?.asAdmin === "1";

  return (
    <div className="stack page-stack">
      {isAdminImpersonating ? (
        <div className="banner">
          Vizualizare în modul admin. Datele salonului sunt accesate în scop de audit și suport operațional.
        </div>
      ) : null}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Spațiu de lucru</span>
            <h1>{salon.name}</h1>
          </div>
          <span className="tag tag-soft">{salon.theme}</span>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Profesioniști</span>
            <strong>{professionals.length}</strong>
          </article>
          <article className="metric-card">
            <span>Clienți activi</span>
            <strong>{clients.length}</strong>
          </article>
          <article className="metric-card">
            <span>Evaluări recente</span>
            <strong>{responses.length}</strong>
          </article>
          <article className="metric-card">
            <span>Confidențialitate</span>
            <strong>Per salon</strong>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Echipă</span>
            <h2>Profesioniști și link-uri de evaluare</h2>
          </div>
        </div>
        <div className="card-grid three-up">
          {professionalsWithShareCounts.map((professional) => (
            <article key={professional._id} className="detail-card">
              <div className="card-row">
                <h3>{professional.displayName || [professional.firstName, professional.lastName].filter(Boolean).join(" ")}</h3>
                <span className="tag tag-soft">{professional.shareCode}</span>
              </div>
              <p>{professional.specialty}</p>
              <div className="metric-row">
                <span>Clienți activi</span>
                <strong>{professional.activeClients}</strong>
              </div>
              <div className="metric-row">
                <span>Follow-up azi</span>
                <strong>{professional.todayFollowUps}</strong>
              </div>
              <div className="metric-row">
                <span>Link-uri active</span>
                <strong>{professional.shareBundles.length}</strong>
              </div>
              <div className="tags-row">
                {(professional.focusAreas || []).map((area) => (
                  <span key={area} className="tag tag-soft">
                    {area}
                  </span>
                ))}
              </div>
              <Link className="text-link" href={`/salon/${salon.slug}/professionals/${professional._id}`}>
                Deschide workspace →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Dosare clienți</span>
            <h2>Istoricul clienților și al evaluărilor</h2>
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
              <p>{client.treatmentPlanSummary || "Planul de tratament se completează după evaluarea inițială."}</p>
              <div className="metric-row">
                <span>Ultima evaluare</span>
                <strong>
                  {client.latestAssessment?.label || "Fără evaluare"}{" "}
                  {typeof client.latestAssessment?.score === "number" ? `· ${client.latestAssessment.score}p` : ""}
                </strong>
              </div>
              <div className="metric-row">
                <span>Profesionist</span>
                <strong>
                  {professionalsWithShareCounts.find((p) => p._id === client.professionalId)?.displayName ||
                    professionalsWithShareCounts.find((p) => p._id === client.professionalId)?.firstName ||
                    "Nealocat"}
                </strong>
              </div>
              <div className="metric-row">
                <span>Următoarea ședință</span>
                <strong>{client.nextSession ? formatDate(client.nextSession) : "Nesetată"}</strong>
              </div>
              <div className="tags-row">
                {(client.riskFlags || []).map((flag) => (
                  <span key={flag} className="tag tag-soft">
                    {flag}
                  </span>
                ))}
              </div>
              <Link className="text-link" href={`/salon/${salon.slug}/clients/${client._id}`}>
                Deschide fișa completă →
              </Link>
              <div className="timeline compact-timeline">
                {(client.timeline || []).map((event) => (
                  <article key={event.date} className="timeline-card">
                    <strong>{formatDate(event.date)}</strong>
                    <p>{event.event}</p>
                  </article>
                ))}
              </div>
            </article>
          ))}
          {clients.length === 0 ? (
            <article className="detail-card empty-card">
              <p className="helper-copy">Niciun client adăugat încă. Distribuie un link de evaluare pentru a înregistra primul client.</p>
            </article>
          ) : null}
        </div>
      </section>

      {responses.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Activitate recentă</span>
              <h2>Ultimele evaluări trimise</h2>
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
