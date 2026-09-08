import { notFound, redirect } from "next/navigation";
import { ProfessionalDossier } from "../../../../components/professional-portal";
import { VisitForm } from "../../../../components/visit-form";
import { currentAccount } from "../../../../lib/auth";
import { connectDb } from "../../../../lib/db";
import { Client, Professional, Salon, Visit } from "../../../../lib/models";
import { TEST_CATALOG } from "../../../../lib/questionnaires";

export default async function ProfessionalClientPage({ params }) {
  const account = await currentAccount(); if (!account || account.role !== "professional") redirect("/login"); const { clientId } = await params;
  await connectDb(); const client = await Client.findOne({ _id: clientId, professionalId: account.professionalId }).lean(); if (!client) notFound();
  const [visits, professional] = await Promise.all([Visit.find({ clientId }).sort({ date: -1 }).lean(), Professional.findById(account.professionalId).lean()]);
  const salon = professional ? await Salon.findById(professional.salonId).lean() : null;
  const serializedVisits = visits.map((visit) => ({ id: String(visit._id), date: new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium" }).format(new Date(visit.date)), procedures: visit.procedures || [], treatments: visit.treatments || [], notes: visit.notes }));
  return <ProfessionalDossier account={{ name: account.name }} salonName={salon?.name} client={{ name: client.name, email: client.email, phone: client.phone, baumannType: client.baumannType, onboardingStatus: client.onboardingStatus }} visits={serializedVisits} questionnaireHistory={client.questionnaireHistory || []} testCatalog={TEST_CATALOG}>{client.onboardingStatus === "completed" ? <VisitForm clientId={String(client._id)} /> : <div className="pro-empty">Clienta trebuie să accepte GDPR și să finalizeze evaluarea inițială înainte de a putea înregistra o vizită.</div>}</ProfessionalDossier>;
}
