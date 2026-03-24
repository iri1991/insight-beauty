import { NextResponse } from "next/server";
import { canAccessClientDossier, getCurrentUser, isDatabaseConfigured } from "../../../../../lib/auth";
import { appendClientSession, getClientById, getSalonById } from "../../../../../lib/repositories";

function buildSessionId() {
  return `sess-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export async function POST(request, { params }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "MongoDB nu este configurat." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Sesiunea nu este valida." }, { status: 401 });
  }

  const client = await getClientById(params.clientId);

  if (!client) {
    return NextResponse.json({ error: "Dosarul clientului nu a fost gasit." }, { status: 404 });
  }

  const salon = await getSalonById(client.salonId);

  if (!canAccessClientDossier(user, salon, client)) {
    return NextResponse.json({ error: "Nu ai acces la acest dosar." }, { status: 403 });
  }

  const payload = await request.json();

  if (!payload.date || !payload.service || !payload.objective) {
    return NextResponse.json({ error: "Completeaza data, serviciul si obiectivul sedintei." }, { status: 422 });
  }

  const updatedClient = await appendClientSession(
    params.clientId,
    {
      id: buildSessionId(),
      date: String(payload.date),
      service: String(payload.service).trim(),
      status: String(payload.status || "scheduled"),
      objective: String(payload.objective).trim(),
      notes: String(payload.notes || "").trim(),
      outcome: String(payload.outcome || "").trim()
    },
    payload.nextSession || null
  );

  return NextResponse.json({
    ok: true,
    client: updatedClient
  });
}
