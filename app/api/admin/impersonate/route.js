import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";
import { connectDb } from "../../../../lib/db";
import { Account, Salon } from "../../../../lib/models";

const sessionOptions = { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 4 };

export async function POST(request) {
  const admin = await requireRole("admin");
  if (!admin) return NextResponse.json({ error: "Doar administratorii platformei pot impersona un salon." }, { status: 403 });
  const { salonId } = await request.json();
  await connectDb();
  const salon = await Salon.findById(salonId).lean();
  if (!salon) return NextResponse.json({ error: "Salon inexistent." }, { status: 404 });
  const salonAccount = await Account.findOne({ role: "salon", salonId: String(salon._id) }).lean();
  if (!salonAccount) return NextResponse.json({ error: "Salonul nu are un cont de administrare configurat." }, { status: 409 });
  const response = NextResponse.json({ destination: "/salon" });
  response.cookies.set("ib_session", String(salonAccount._id), sessionOptions);
  response.cookies.set("ib_impersonator", String(admin._id), sessionOptions);
  return response;
}

export async function DELETE() {
  const cookieStore = await cookies();
  const administratorId = cookieStore.get("ib_impersonator")?.value;
  if (!administratorId) return NextResponse.json({ error: "Nu există o sesiune de impersonare activă." }, { status: 400 });
  await connectDb();
  const admin = await Account.findById(administratorId).lean();
  if (!admin || admin.role !== "admin") return NextResponse.json({ error: "Sesiunea inițială de administrator nu mai este validă." }, { status: 403 });
  const response = NextResponse.json({ destination: "/admin" });
  response.cookies.set("ib_session", String(admin._id), sessionOptions);
  response.cookies.set("ib_impersonator", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
