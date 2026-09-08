import { NextResponse } from "next/server";
import { connectDb } from "../../../../lib/db";
import { Account } from "../../../../lib/models";
import { verifyPassword } from "../../../../lib/passwords";

export async function POST(request) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: "Emailul și parola sunt obligatorii." }, { status: 400 });
  await connectDb();
  const account = await Account.findOne({ email: email.trim().toLowerCase() });
  if (!account || !verifyPassword(password, account.passwordHash)) {
    return NextResponse.json({ error: "Date de autentificare invalide." }, { status: 401 });
  }
  const response = NextResponse.json({ role: account.role });
  response.cookies.set("ib_session", String(account._id), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return response;
}
