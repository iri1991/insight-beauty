import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";
import { connectDb } from "../../../../lib/db";
import { Client, Professional, Salon } from "../../../../lib/models";
import { invitationEmail, sendEmail } from "../../../../lib/email";

export async function POST(request) {
  const account = await requireRole("professional");
  if (!account) return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
  const { name, email, phone, gender, age, occupation, city } = await request.json();
  if (!name?.trim() || !email?.trim()) return NextResponse.json({ error: "Numele și emailul sunt obligatorii." }, { status: 400 });
  await connectDb();
  const professional = await Professional.findById(account.professionalId).lean();
  if (!professional) return NextResponse.json({ error: "Profil profesional indisponibil." }, { status: 404 });
  const onboardingToken = randomBytes(24).toString("hex");
  const parsedAge = age === "" || age === undefined ? undefined : Number(age);
  if (parsedAge !== undefined && (!Number.isInteger(parsedAge) || parsedAge < 0 || parsedAge > 130)) return NextResponse.json({ error: "Vârsta trebuie să fie un număr între 0 și 130." }, { status: 400 });
  const client = await Client.create({ salonId: professional.salonId, professionalId: String(professional._id), name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim(), age: parsedAge, occupation: occupation?.trim(), city: city?.trim(), gender: ["female", "male", "other", "undisclosed"].includes(gender) ? gender : "undisclosed", onboardingToken });
  const onboardingUrl = new URL(`/onboarding/${onboardingToken}`, request.url).toString();
  const salon = await Salon.findById(professional.salonId).lean();
  const delivery = await sendEmail({ to: client.email, ...invitationEmail({ clientName: client.name, professionalName: professional.name, salonName: salon?.name || "salonul tău", onboardingUrl }) });
  return NextResponse.json({ client: { id: String(client._id), name: client.name }, onboardingUrl: `/onboarding/${onboardingToken}`, emailSent: delivery.sent }, { status: 201 });
}
