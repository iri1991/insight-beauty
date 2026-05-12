import Link from "next/link";
import { AccessDenied } from "../../components/access-denied";
import { AdminCreateSalonForm } from "../../components/admin-create-salon-form";
import { AdminCreateUserForm } from "../../components/admin-create-user-form";
import { canAccessAdmin, isDatabaseConfigured, requireUser } from "../../lib/auth";
import { listQuestionnaireCatalog } from "../../lib/questionnaire-engine";
import { getAdminSnapshot, listClientsForSalon, listProfessionalsForSalon, listSalons } from "../../lib/repositories";

const STATUS_LABELS = {
  active: "Activ",
  draft: "Draft",
  archived: "Arhivat"
};

export default async function AdminPage() {
  if (!isDatabaseConfigured()) {
    return (
      <AccessDenied
        title="Baza de date neconfigurată"
        body="Configurează baza de date și rulează seed-ul inițial pentru a folosi consola admin."
      />
    );
  }

  const user = await requireUser();

  if (!canAccessAdmin(user)) {
    return <AccessDenied body="Accesul în consola de administrare este rezervat utilizatorilor cu rol de admin." />;
  }

  const questionnaireCatalog = listQuestionnaireCatalog();
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
            <span className="eyebrow">Consolă administrativă</span>
            <h1>Panou de control global</h1>
            <p className="lead-copy">Gestionează saloane, profesioniști, chestionare și configurările platformei.</p>
          </div>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Saloane active</span>
            <strong>{adminSnapshot.salons}</strong>
          </article>
          <article className="metric-card">
            <span>Profesioniști</span>
            <strong>{adminSnapshot.professionals}</strong>
          </article>
          <article className="metric-card">
            <span>Clienți activi</span>
            <strong>{adminSnapshot.activeClients}</strong>
          </article>
          <article className="metric-card">
            <span>Chestionare active</span>
            <strong>{questionnaireCatalog.filter((q) => q.status === "active").length}</strong>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Chestionare</span>
            <h2>Registrul de formulare și chestionare</h2>
          </div>
          <Link className="button primary" href="/admin/questionnaires">
            Gestionează →
          </Link>
        </div>
        <div className="card-grid three-up">
          {questionnaireCatalog.map((questionnaire) => (
            <article key={questionnaire.slug} className="detail-card">
              <div className="card-row">
                <h3>{questionnaire.title}</h3>
                <span className={`tag ${questionnaire.status === "active" ? "tag-success" : "tag-soft"}`}>
                  {STATUS_LABELS[questionnaire.status] || questionnaire.status}
                </span>
              </div>
              <p>{questionnaire.description}</p>
              <div className="metric-row">
                <span>Public țintă</span>
                <strong>{questionnaire.audience === "client" ? "Client" : questionnaire.audience === "professional" ? "Profesionist" : questionnaire.audience}</strong>
              </div>
              <Link className="text-link" href={`/admin/questionnaires/${questionnaire.slug}`}>
                Editează →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Saloane</span>
            <h2>Saloane și spații de lucru gestionate</h2>
          </div>
          <AdminCreateSalonForm />
        </div>
        <div className="card-grid three-up">
          {salonCards.map((salon) => (
            <article key={salon._id} className="detail-card">
              <div className="card-row">
                <h3>{salon.name}</h3>
                <span className="tag tag-soft">{salon.theme}</span>
              </div>
              <p className="helper-copy">{salon.city}</p>
              <div className="metric-row">
                <span>Profesioniști</span>
                <strong>{salon.professionals.length}</strong>
              </div>
              <div className="metric-row">
                <span>Clienți</span>
                <strong>{salon.clients.length}</strong>
              </div>
              <Link className="text-link" href={`/salon/${salon.slug}?asAdmin=1`}>
                Deschide workspace →
              </Link>
            </article>
          ))}
          {salonCards.length === 0 ? (
            <article className="detail-card empty-card">
              <p className="helper-copy">Niciun salon creat încă. Folosește butonul de mai sus pentru a adăuga primul salon.</p>
            </article>
          ) : null}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Utilizatori</span>
            <h2>Profesioniști și manageri de salon</h2>
          </div>
          <AdminCreateUserForm salons={salonCards} />
        </div>
        <div className="card-grid three-up">
          {salonCards.flatMap((salon) =>
            salon.professionals.map((professional) => (
              <article key={professional._id} className="detail-card">
                <div className="card-row">
                  <h3>{professional.displayName || [professional.firstName, professional.lastName].filter(Boolean).join(" ")}</h3>
                  <span className="tag">{professional.role === "salon-manager" ? "Manager" : "Profesionist"}</span>
                </div>
                <p className="helper-copy">{professional.email}</p>
                <div className="metric-row">
                  <span>Salon</span>
                  <strong>{salon.name}</strong>
                </div>
                {professional.specialty ? (
                  <div className="metric-row">
                    <span>Specialitate</span>
                    <strong>{professional.specialty}</strong>
                  </div>
                ) : null}
                {professional.shareCode ? (
                  <div className="metric-row">
                    <span>Cod de distribuire</span>
                    <strong className="tag">{professional.shareCode}</strong>
                  </div>
                ) : null}
              </article>
            ))
          )}
          {salonCards.every((s) => s.professionals.length === 0) ? (
            <article className="detail-card empty-card">
              <p className="helper-copy">Niciun utilizator adăugat. Creează primul profesionist sau manager.</p>
            </article>
          ) : null}
        </div>
      </section>

    </div>
  );
}
