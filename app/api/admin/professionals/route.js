import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";
import { connectDb } from "../../../../lib/db";
import { Account, Professional, Salon } from "../../../../lib/models";
import { hashPassword } from "../../../../lib/passwords";

export async function POST(request) {
  const admin = await requireRole("admin");
  if (!admin) return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
  const { salonId, name, specialty, email, password } = await request.json();
  if (![salonId, name, specialty, email, password].every((value) => value?.trim())) return NextResponse.json({ error: "Completează toate datele profesionistului." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Parola trebuie să aibă minimum 8 caractere." }, { status: 400 });
  await connectDb();
  const [salon, exists] = await Promise.all([Salon.findById(salonId).lean(), Account.exists({ email: email.trim().toLowerCase() })]);
  if (!salon) return NextResponse.json({ error: "Salon inexistent." }, { status: 404 });
  if (exists) return NextResponse.json({ error: "Emailul este deja utilizat." }, { status: 409 });
  const account = await Account.create({ email: email.trim().toLowerCase(), passwordHash: hashPassword(password), name: name.trim(), role: "professional", salonId });
  const professional = await Professional.create({ salonId, accountId: String(account._id), name: name.trim(), specialty: specialty.trim() });
  account.professionalId = String(professional._id);
  await account.save();
  return NextResponse.json({ professional: { id: String(professional._id), name: professional.name } }, { status: 201 });
}
