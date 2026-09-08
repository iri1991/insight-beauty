import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";
import { connectDb } from "../../../../lib/db";
import { Account, Salon } from "../../../../lib/models";
import { hashPassword } from "../../../../lib/passwords";

export async function POST(request) {
  const admin = await requireRole("admin");
  if (!admin) return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
  const { name, city, ownerName, ownerEmail, password } = await request.json();
  if (![name, city, ownerName, ownerEmail, password].every((value) => value?.trim())) {
    return NextResponse.json({ error: "Completează toate datele salonului și ale administratorului local." }, { status: 400 });
  }
  if (password.length < 8) return NextResponse.json({ error: "Parola trebuie să aibă minimum 8 caractere." }, { status: 400 });
  await connectDb();
  if (await Account.exists({ email: ownerEmail.trim().toLowerCase() })) return NextResponse.json({ error: "Emailul este deja utilizat." }, { status: 409 });
  const owner = await Account.create({ email: ownerEmail.trim().toLowerCase(), passwordHash: hashPassword(password), name: ownerName.trim(), role: "salon" });
  const salon = await Salon.create({ name: name.trim(), city: city.trim(), ownerId: String(owner._id) });
  owner.salonId = String(salon._id);
  await owner.save();
  return NextResponse.json({ salon: { id: String(salon._id), name: salon.name } }, { status: 201 });
}
