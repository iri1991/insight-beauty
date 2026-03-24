import { IntakeWorkbench } from "../../../components/intake-workbench";
import { isDatabaseConfigured } from "../../../lib/auth";
import { listPublicQuestionnairesAsync } from "../../../lib/questionnaire-engine";
import { getProfessionalById, getSalonBySlug, listAllProfessionals, listSalons } from "../../../lib/repositories";

export default async function ClientIntakePage({ searchParams }) {
  const params = await searchParams;
  const [questionnaires, salons, professionals] = await Promise.all([
    listPublicQuestionnairesAsync(),
    listSalons(),
    listAllProfessionals()
  ]);
  const requestedSalon = params?.salon ? await getSalonBySlug(params.salon) : null;
  const requestedProfessional = params?.professional ? await getProfessionalById(params.professional) : null;
  const questionnaireExists = questionnaires.some((questionnaire) => questionnaire.slug === params?.questionnaire);
  const shareMatchesProfessional =
    !params?.share || requestedProfessional?.shareCode === params.share;
  const professionalBelongsToSalon = requestedSalon && requestedProfessional && requestedProfessional.salonId === requestedSalon._id;

  const initialState =
    requestedSalon && requestedProfessional && professionalBelongsToSalon && questionnaireExists && shareMatchesProfessional
      ? {
          salonSlug: requestedSalon.slug,
          professionalId: requestedProfessional._id,
          questionnaireSlug: params.questionnaire
        }
      : null;

  const shareContext =
    initialState && shareMatchesProfessional
      ? {
          salonName: requestedSalon.name,
          professionalName:
            requestedProfessional.displayName ||
            [requestedProfessional.firstName, requestedProfessional.lastName].filter(Boolean).join(" "),
          shareCode: requestedProfessional.shareCode
        }
      : null;

  if (!isDatabaseConfigured()) {
    return (
      <div className="stack page-stack">
        <section className="section-block">
          <div className="detail-card">
            <p>Fluxul public de intake necesita Mongo configurat si date seed reale pentru saloane si profesionisti.</p>
          </div>
        </section>
      </div>
    );
  }

  if (salons.length === 0 || professionals.length === 0) {
    return (
      <div className="stack page-stack">
        <section className="section-block">
          <div className="detail-card">
            <p>Nu exista inca saloane sau profesionisti in baza de date. Ruleaza seed-ul initial si reincearca.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <IntakeWorkbench
      questionnaires={questionnaires}
      salons={salons}
      professionals={professionals}
      initialState={initialState}
      shareContext={shareContext}
    />
  );
}
