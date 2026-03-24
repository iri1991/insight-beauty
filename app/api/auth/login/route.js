import { NextResponse } from "next/server";
import { AUTH_COOKIE, createUserSession, isDatabaseConfigured } from "../../../../lib/auth";
import { connectMongo } from "../../../../lib/mongodb";
import { getModels } from "../../../../lib/mongoose-models";
import { verifyPassword } from "../../../../lib/security";

export async function POST(request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const payload = await request.json();
  await connectMongo();
  const { Salon, User } = getModels();
  const user = await User.findOne({
    email: payload.email?.toLowerCase()
  }).exec();

  if (!user || !verifyPassword(payload.password, user.passwordSalt, user.passwordHash)) {
    return NextResponse.json({ error: "Email sau parola invalida." }, { status: 401 });
  }

  const token = await createUserSession(user);
  const salon = user.salonId ? await Salon.findById(user.salonId).lean().exec() : null;
  const professionalId = user.professionalId || (user.role === "professional" ? String(user._id) : null);
  let redirectTo = "/";

  if (user.role === "admin") {
    redirectTo = "/admin";
  } else if (user.role === "salon-manager" && salon?.slug) {
    redirectTo = `/salon/${salon.slug}`;
  } else if (user.role === "professional" && salon?.slug && professionalId) {
    redirectTo = `/salon/${salon.slug}/professionals/${professionalId}`;
  }

  const response = NextResponse.json({
    ok: true,
    redirectTo
  });

  response.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  return response;
}
