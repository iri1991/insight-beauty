import { NextResponse } from "next/server";
import { requireRole } from "../../../../../lib/auth";
import { connectDb } from "../../../../../lib/db";
import { Client } from "../../../../../lib/models";

export async function DELETE(request, { params }) {
  const account = await requireRole("professional");
  if (!account) return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
  const { clientId } = await params;
  await connectDb();
  const client = await Client.findOneAndUpdate({ _id: clientId, professionalId: account.professionalId, deletedAt: null }, { deletedAt: new Date(), deletedBy: String(account._id) }, { new: true }).lean();
  if (!client) return NextResponse.json({ error: "Clientul nu există în portofoliul tău sau este deja arhivat." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
