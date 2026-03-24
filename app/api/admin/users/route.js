import { NextResponse } from "next/server";
import { canAccessAdmin, getCurrentUser, isDatabaseConfigured } from "../../../../lib/auth";
import { connectMongo } from "../../../../lib/mongodb";
import { getModels } from "../../../../lib/mongoose-models";
import { createPasswordRecord } from "../../../../lib/security";

function generateShareCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Acces refuzat." }, { status: 403 });
  }

  const payload = await request.json();
  const { role, email, firstName, lastName, salonId, specialty, password } = payload;

  const allowedRoles = ["salon-manager", "professional"];

  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Rolul specificat nu este permis." }, { status: 422 });
  }

  if (!email?.trim()) {
    return NextResponse.json({ error: "Emailul este obligatoriu." }, { status: 422 });
  }

  if (!firstName?.trim() || !lastName?.trim()) {
    return NextResponse.json({ error: "Prenumele și numele sunt obligatorii." }, { status: 422 });
  }

  if (!salonId) {
    return NextResponse.json({ error: "Salonul este obligatoriu." }, { status: 422 });
  }

  const rawPassword = password?.trim() || "InsightPro123";

  await connectMongo();
  const { User, Salon } = getModels();

  const salon = await Salon.findById(salonId).lean().exec();

  if (!salon) {
    return NextResponse.json({ error: "Salonul specificat nu există." }, { status: 422 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail }).lean().exec();

  if (existing) {
    return NextResponse.json({ error: "Există deja un cont cu acest email." }, { status: 409 });
  }

  const { hash, salt } = createPasswordRecord(rawPassword);
  const displayName = [firstName.trim(), lastName.trim()].join(" ");

  const newUser = await User.create({
    role,
    email: normalizedEmail,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    displayName,
    salonId: String(salon._id),
    passwordHash: hash,
    passwordSalt: salt,
    specialty: specialty?.trim() || "",
    shareCode: role === "professional" ? generateShareCode() : undefined,
    preferredQuestionnaireSlugs: role === "professional" ? ["fitzpatrick", "acne-severity"] : [],
    status: "active",
    activeClients: 0,
    todayFollowUps: 0,
    weeklyCapacity: 20
  });

  await Salon.updateOne({ _id: salon._id }, { $addToSet: { professionalIds: String(newUser._id) } });

  return NextResponse.json(
    {
      ok: true,
      user: {
        _id: String(newUser._id),
        email: newUser.email,
        role: newUser.role,
        displayName: newUser.displayName,
        salonId: newUser.salonId,
        shareCode: newUser.shareCode
      },
      temporaryPassword: rawPassword
    },
    { status: 201 }
  );
}
