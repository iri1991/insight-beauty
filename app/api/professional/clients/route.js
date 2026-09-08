import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";
import { connectDb } from "../../../../lib/db";
import { Client, Professional } from "../../../../lib/models";

export async function POST(request) {
  const account = await requireRole("professional");
  if (!account) return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
  const { name, email, phone } = await request.json();
  if (!name?.trim() || !email?.trim()) return NextResponse.json({ error: "Numele și emailul sunt obligatorii." }, { status: 400 });
  await connectDb();
  const professional = await Professional.findById(account.professionalId).lean();
  if (!professional) return NextResponse.json({ error: "Profil profesional indisponibil." }, { status: 404 });
  const onboardingToken = randomBytes(24).toString("hex");
  const client = await Client.create({ salonId: professional.salonId, professionalId: String(professional._id), name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim(), onboardingToken });
  return NextResponse.json({ client: { id: String(client._id), name: client.name }, onboardingUrl: `/onboarding/${onboardingToken}` }, { status: 201 });
}
