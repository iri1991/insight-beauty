import { NextResponse } from "next/server";
import { requireRole } from "../../../lib/auth";
import { connectDb } from "../../../lib/db";
import { Client, Professional, Visit } from "../../../lib/models";

const splitValues = (value) => String(value || "").split("\n").map((item) => item.trim()).filter(Boolean);

export async function POST(request) {
  const account = await requireRole("professional");
  if (!account) return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
  const { clientId, date, procedures, treatments, notes, nextStep } = await request.json();
  if (!clientId || !date) return NextResponse.json({ error: "Clientul și data vizitei sunt obligatorii." }, { status: 400 });
  await connectDb();
  const professional = await Professional.findById(account.professionalId).lean();
  const client = await Client.findOne({ _id: clientId, professionalId: account.professionalId, salonId: professional?.salonId }).lean();
  if (!client || !professional) return NextResponse.json({ error: "Client indisponibil în portofoliul tău." }, { status: 404 });
  const visit = await Visit.create({ clientId, salonId: professional.salonId, professionalId: account.professionalId, date: new Date(date), procedures: splitValues(procedures), treatments: splitValues(treatments), notes: notes?.trim(), nextStep: nextStep?.trim() });
  return NextResponse.json({ visit: { id: String(visit._id) } }, { status: 201 });
}
