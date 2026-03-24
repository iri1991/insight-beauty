import { NextResponse } from "next/server";
import { AUTH_COOKIE, deleteSessionToken } from "../../../../lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  await deleteSessionToken(token);

  const response = NextResponse.json({
    ok: true
  });

  response.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0)
  });

  return response;
}
