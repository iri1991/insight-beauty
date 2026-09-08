import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("ib_session", "", { httpOnly: true, path: "/", maxAge: 0 });
  response.cookies.set("ib_impersonator", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
