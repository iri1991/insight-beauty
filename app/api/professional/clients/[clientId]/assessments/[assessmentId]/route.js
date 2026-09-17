import { NextResponse } from "next/server";
import { requireRole } from "../../../../../../../lib/auth";
import { connectDb } from "../../../../../../../lib/db";
import { Client, Professional } from "../../../../../../../lib/models";
import { evaluateAssessment, getAssessmentDefinition, getNextAssessment } from "../../../../../../../lib/questionnaires";

export async function POST(request, { params }) {
  const account = await requireRole("professional");
  if (!account) return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
  const { clientId, assessmentId } = await params;
  const { answers } = await request.json();
  await connectDb();
  const professional = await Professional.findById(account.professionalId).lean();
  const client = await Client.findOne({ _id: clientId, professionalId: account.professionalId, salonId: professional?.salonId, deletedAt: null });
  if (!client || !professional) return NextResponse.json({ error: "Client indisponibil în portofoliul tău." }, { status: 404 });
  const next = getNextAssessment(client.questionnaireHistory || []);
  if (!next || next.id !== assessmentId) return NextResponse.json({ error: "Acest instrument nu este următorul în secvența clinică." }, { status: 409 });
  const definition = getAssessmentDefinition(assessmentId);
  if (!definition) return NextResponse.json({ error: "Definiția completă a acestui instrument nu este disponibilă." }, { status: 422 });
  const result = evaluateAssessment(definition, answers);
  if (!result.ok) return NextResponse.json({ error: "Completează toate câmpurile înainte de salvare.", missingQuestionIds: result.missingQuestionIds }, { status: 400 });
  client.questionnaireHistory.push({ id: assessmentId, submittedAt: new Date(), answers, result: { score: result.score, label: result.label, summary: result.summary } });
  await client.save();
  return NextResponse.json({ result }, { status: 201 });
}
