import { NextResponse } from "next/server";
import { connectDb } from "../../../../lib/db";
import { Account, Client } from "../../../../lib/models";
import { hashPassword } from "../../../../lib/passwords";
import { getBaumannType } from "../../../../lib/questionnaires";

export async function POST(request, { params }) {
  const { token } = await params;
  const { password, gdprAccepted, answers } = await request.json();
  if (!gdprAccepted) return NextResponse.json({ error: "Consimțământul GDPR este necesar pentru a continua." }, { status: 400 });
  if (!password || password.length < 8) return NextResponse.json({ error: "Parola trebuie să aibă minimum 8 caractere." }, { status: 400 });
  if (!answers || Object.keys(answers).length !== 4) return NextResponse.json({ error: "Răspunde la toate întrebările înainte de trimitere." }, { status: 400 });
  await connectDb();
  const client = await Client.findOne({ onboardingToken: token, onboardingStatus: "invited" });
  if (!client) return NextResponse.json({ error: "Invitația nu mai este disponibilă." }, { status: 404 });
  if (await Account.exists({ email: client.email })) return NextResponse.json({ error: "Există deja un cont asociat acestui email." }, { status: 409 });
  const type = getBaumannType(answers);
  const account = await Account.create({ email: client.email, passwordHash: hashPassword(password), name: client.name, role: "client", salonId: client.salonId, professionalId: client.professionalId });
  client.accountId = String(account._id);
  client.gdprConsent = { acceptedAt: new Date(), version: "2026-09" };
  client.baumannType = type;
  client.questionnaireHistory = [{ id: "baumann", submittedAt: new Date(), answers, result: type }];
  client.onboardingToken = undefined;
  client.onboardingStatus = "completed";
  await client.save();
  const response = NextResponse.json({ result: type });
  response.cookies.set("ib_session", String(account._id), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return response;
}
