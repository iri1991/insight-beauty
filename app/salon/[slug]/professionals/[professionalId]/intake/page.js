import { notFound, redirect } from "next/navigation";
import { AccessDenied } from "../../../../../../components/access-denied";
import { ProfessionalIntake } from "../../../../../../components/professional-intake";
import { canAccessProfessional, isDatabaseConfigured, requireUser } from "../../../../../../lib/auth";
import { listPublicEvaluableDefinitions } from "../../../../../../lib/questionnaire-db";
import {
  getClientById,
  getProfessionalById,
  getSalonBySlug,
  listClientsForProfessional,
  listClientsForSalon
} from "../../../../../../lib/repositories";

export default async function ProfessionalIntakePage({ params }) {
  const resolvedParams = await params;

  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Mongo neconfigurat" body="Configureaza baza de date." />;
  }

  const salon = await getSalonBySlug(resolvedParams.slug);
  const professional = await getProfessionalById(resolvedParams.professionalId);

  if (!salon || !professional) notFound();

  const user = await requireUser();

  if (!canAccessProfessional(user, salon, professional)) {
    return <AccessDenied body="Accesul la evaluare este rezervat profesionistului autentificat." />;
  }

  const [clients, questionnaires] = await Promise.all([
    listClientsForSalon(salon._id),
    listPublicEvaluableDefinitions().then((qs) =>
      qs.filter((q) => q.questions?.length > 0 || (q.dimensions && Object.keys(q.dimensions).length > 0))
    )
  ]);

  const allQuestionnaires = await Promise.all([
    listPublicEvaluableDefinitions()
  ]).then(([list]) =>
    list.filter((q) => q.questions?.length > 0 || (q.dimensions && Object.keys(q.dimensions).length > 0))
  );

  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Evaluare nouă</span>
            <h1>Completează un chestionar pentru un client</h1>
            <p className="lead-copy">
              Selectează clientul, chestionarul și completează răspunsurile. Fișa se actualizează automat.
            </p>
          </div>
          <a className="button secondary" href={`/salon/${salon.slug}/professionals/${professional._id}`}>
            ← Înapoi la workspace
          </a>
        </div>
      </section>

      <section className="section-block">
        <ProfessionalIntake clients={clients} questionnaires={allQuestionnaires} />
      </section>
    </div>
  );
}
