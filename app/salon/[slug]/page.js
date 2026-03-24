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

export default async function SalonPage({ params, searchParams }) {
  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Mongo neconfigurat" body="Configureaza baza de date pentru a folosi workspace-ul salonului." />;
  }

  const salon = await getSalonBySlug(params.slug);

  if (!salon) {
    notFound();
  }

  const user = await requireUser();

  if (!canAccessSalon(user, salon)) {
    return <AccessDenied body="Nu ai acces la acest tenant in sesiunea autentificata." />;
  }

  const professionals = await listProfessionalsForSalon(salon._id);
  const clients = await listClientsForSalon(salon._id);
  const responses = await listRecentResponsesForSalon(salon._id);
  const professionalsWithShareCounts = await Promise.all(
    professionals.map(async (professional) => ({
      ...professional,
      shareBundles: await getProfessionalShareBundles(salon, professional)
    }))
  );
  const isAdminImpersonating = searchParams?.asAdmin === "1";

  return (
    <div className="stack page-stack">
      {isAdminImpersonating ? (
        <div className="banner">
          Vizualizare in mod admin impersonation. Confidentialitatea tenantului este pastrata, dar accesul este extins
          temporar pentru audit si suport operational.
        </div>
      ) : null}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Salon workspace</span>
            <h1>{salon.name}</h1>
          </div>
          <span className="tag tag-soft">{salon.theme}</span>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Profesionisti</span>
            <strong>{professionals.length}</strong>
          </article>
          <article className="metric-card">
            <span>Clienti activi</span>
            <strong>{clients.length}</strong>
          </article>
          <article className="metric-card">
            <span>Raspunsuri recente</span>
            <strong>{responses.length}</strong>
          </article>
          <article className="metric-card">
            <span>Confidentialitate</span>
            <strong>Per salon</strong>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Roster</span>
            <h2>Profesionisti si distribuire chestionare</h2>
          </div>
        </div>
        <div className="card-grid three-up">
          {professionalsWithShareCounts.map((professional) => (
            <article key={professional._id} className="detail-card">
              <div className="card-row">
                <h3>{professional.displayName || [professional.firstName, professional.lastName].filter(Boolean).join(" ")}</h3>
                <span className="tag">{professional.shareCode}</span>
              </div>
              <p>{professional.specialty}</p>
              <div className="metric-row">
                <span>Clienti activi</span>
                <strong>{professional.activeClients}</strong>
              </div>
              <div className="metric-row">
                <span>Follow-up azi</span>
                <strong>{professional.todayFollowUps}</strong>
              </div>
              <div className="metric-row">
                <span>Linkuri active</span>
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
                Deschide workspace profesionist
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Client dossiers</span>
            <h2>Trasabilitate longitudinala</h2>
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
              <p>{client.treatmentPlanSummary || "Planul de tratament va fi setat dupa evaluarea initiala."}</p>
              <div className="metric-row">
                <span>Ultima evaluare</span>
                <strong>
                  {client.latestAssessment?.label || "Fara evaluare"}{" "}
                  {typeof client.latestAssessment?.score === "number" ? `· ${client.latestAssessment.score}p` : ""}
                </strong>
              </div>
              <div className="metric-row">
                <span>Profesionist</span>
                <strong>
                  {professionalsWithShareCounts.find((professional) => professional._id === client.professionalId)?.displayName ||
                    professionalsWithShareCounts.find((professional) => professional._id === client.professionalId)?.firstName ||
                    "Nealocat"}
                </strong>
              </div>
              <div className="metric-row">
                <span>Next session</span>
                <strong>{client.nextSession ? client.nextSession.slice(0, 10) : "Nesetat"}</strong>
              </div>
              <div className="tags-row">
                {(client.riskFlags || []).map((flag) => (
                  <span key={flag} className="tag tag-soft">
                    {flag}
                  </span>
                ))}
              </div>
              <Link className="text-link" href={`/salon/${salon.slug}/clients/${client._id}`}>
                Deschide fisa completa
              </Link>
              <div className="timeline compact-timeline">
                {(client.timeline || []).map((event) => (
                  <article key={event.date} className="timeline-card">
                    <strong>{event.date}</strong>
                    <p>{event.event}</p>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Response feed</span>
            <h2>Raspunsuri recente in tenant</h2>
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
