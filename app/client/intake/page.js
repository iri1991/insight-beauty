import { redirect } from "next/navigation";
import { IntakeWorkbench } from "../../../components/intake-workbench";
import { getCurrentUser, isDatabaseConfigured } from "../../../lib/auth";
import { connectMongo } from "../../../lib/mongodb";
import { getModels } from "../../../lib/mongoose-models";
import { listPublicQuestionnairesAsync } from "../../../lib/questionnaire-engine";
import { getProfessionalById, getSalonBySlug } from "../../../lib/repositories";

export default async function ClientIntakePage({ searchParams }) {
  const params = await searchParams;

  const user = await getCurrentUser();

  if (!user) {
    const qs = new URLSearchParams(params || {}).toString();
    const returnTo = `/client/intake${qs ? `?${qs}` : ""}`;
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  if (user.role === "professional" && user.salonSlug) {
    redirect(`/salon/${user.salonSlug}/professionals/${user.professionalId}/intake`);
  }
  if (user.role === "salon-manager" && user.salonSlug) {
    redirect(`/salon/${user.salonSlug}`);
  }
  if (user.role === "admin") {
    redirect("/admin");
  }

  if (!isDatabaseConfigured()) {
    return (
      <div className="stack page-stack">
        <section className="section-block">
          <div className="detail-card">
            <p>Fluxul de evaluare necesită baza de date configurată.</p>
          </div>
        </section>
      </div>
    );
  }

  const questionnaires = await listPublicQuestionnairesAsync();

  const requestedSalon = params?.salon ? await getSalonBySlug(params.salon) : null;
  const requestedProfessional = params?.professional ? await getProfessionalById(params.professional) : null;
  const questionnaireExists = questionnaires.some((q) => q.slug === params?.questionnaire);
  const shareMatchesProfessional = !params?.share || requestedProfessional?.shareCode === params.share;
  const professionalBelongsToSalon =
    requestedSalon && requestedProfessional && requestedProfessional.salonId === requestedSalon._id;

  const shareContext =
    requestedSalon && requestedProfessional && professionalBelongsToSalon && shareMatchesProfessional
      ? {
          salonName: requestedSalon.name,
          salonSlug: requestedSalon.slug,
          professionalId: requestedProfessional._id,
          professionalName:
            requestedProfessional.displayName ||
            [requestedProfessional.firstName, requestedProfessional.lastName].filter(Boolean).join(" "),
          shareCode: requestedProfessional.shareCode,
          questionnaireSlug: questionnaireExists ? params.questionnaire : null
        }
      : null;

  let existingProfile = null;
  if (user.role === "client") {
    await connectMongo();
    const { ClientProfile } = getModels();
    existingProfile = await ClientProfile.findOne({ email: user.email.toLowerCase() }).lean().exec();
  }

  return (
    <IntakeWorkbench
      questionnaires={questionnaires}
      currentUser={{
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }}
      shareContext={shareContext}
      existingProfile={
        existingProfile
          ? {
              firstName: existingProfile.firstName,
              lastName: existingProfile.lastName,
              phone: existingProfile.phone || ""
            }
          : null
      }
    />
  );
}
