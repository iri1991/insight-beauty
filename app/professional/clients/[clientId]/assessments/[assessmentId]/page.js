import { notFound, redirect } from "next/navigation";
import { AssessmentRunner } from "../../../../../../components/assessment-runner";
import { currentAccount } from "../../../../../../lib/auth";
import { connectDb } from "../../../../../../lib/db";
import { Client, Professional, Salon } from "../../../../../../lib/models";
import { getAssessmentDefinition, getNextAssessment } from "../../../../../../lib/questionnaires";

export default async function AssessmentPage({ params }) {
  const account = await currentAccount(); if (!account || account.role !== "professional") redirect("/login");
  const { clientId, assessmentId } = await params; await connectDb();
  const [client, professional] = await Promise.all([Client.findOne({ _id: clientId, professionalId: account.professionalId, deletedAt: null }).lean(), Professional.findById(account.professionalId).lean()]);
  if (!client || !professional || getNextAssessment(client.questionnaireHistory || [])?.id !== assessmentId) notFound();
  const definition = getAssessmentDefinition(assessmentId); if (!definition) notFound();
  const salon = await Salon.findById(professional.salonId).lean();
  return <AssessmentRunner account={{ name: account.name }} salonName={salon?.name} client={{ id: String(client._id), name: client.name }} assessmentId={assessmentId} definition={definition} />;
}
