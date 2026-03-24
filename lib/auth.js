import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectMongo } from "./mongodb";
import { getModels } from "./mongoose-models";
import { createPasswordRecord, hashToken, verifyPassword } from "./security";

export const AUTH_COOKIE = "insight_auth";

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export async function createUserSession(user) {
  await connectMongo();
  const { UserSession } = getModels();
  const token = randomBytes(32).toString("hex");

  await UserSession.create({
    tokenHash: hashToken(token),
    userId: user._id,
    role: user.role,
    salonId: user.salonId || null,
    professionalId: user.professionalId || (user.role === "professional" ? String(user._id) : null),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  });

  return token;
}

export async function deleteSessionToken(token) {
  if (!token || !isDatabaseConfigured()) {
    return;
  }

  await connectMongo();
  const { UserSession } = getModels();
  await UserSession.deleteOne({
    tokenHash: hashToken(token)
  });
}

export async function getCurrentUser() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  await connectMongo();
  const { User, UserSession, Salon } = getModels();
  const session = await UserSession.findOne({
    tokenHash: hashToken(token),
    expiresAt: {
      $gt: new Date()
    }
  })
    .lean()
    .exec();

  if (!session) {
    return null;
  }

  const user = await User.findById(session.userId).lean().exec();

  if (!user || user.status !== "active") {
    return null;
  }

  const salon = user?.salonId ? await Salon.findById(user.salonId).lean().exec() : null;

  return {
    id: String(user._id),
    email: user.email,
    role: user.role,
    displayName: user.displayName || [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email,
    salonId: user.salonId || null,
    salonSlug: salon?.slug || null,
    professionalId: user.professionalId || (user.role === "professional" ? String(user._id) : null)
  };
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export function canAccessAdmin(user) {
  return user?.role === "admin";
}

export function canAccessSalon(user, salon) {
  if (!user || !salon) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  return user.salonId === String(salon._id);
}

export function canAccessProfessional(user, salon, professional) {
  if (!user || !salon || !professional) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  if (user.role === "salon-manager") {
    return user.salonId === String(salon._id) && String(professional.salonId) === String(salon._id);
  }

  return user.role === "professional" && user.professionalId === String(professional._id);
}

export function canAccessClientDossier(user, salon, client) {
  if (!user || !salon || !client) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  if (user.role === "salon-manager") {
    return user.salonId === String(salon._id) && String(client.salonId) === String(salon._id);
  }

  return user.role === "professional" && user.professionalId === String(client.professionalId);
}
