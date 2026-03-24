import { NextResponse } from "next/server";
import { canAccessClientDossier, getCurrentUser, isDatabaseConfigured } from "../../../../../lib/auth";
import { getClientById, getSalonById, updateClientCarePlan } from "../../../../../lib/repositories";

function sanitizeStringList(value) {
  return Array.isArray(value) ? value.map((entry) => String(entry).trim()).filter(Boolean) : [];
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
  const timeline = [
    ...(client.timeline || []),
    {
      date: new Date().toISOString().slice(0, 10),
      event: `Planul de tratament a fost actualizat de ${user.displayName}`
    }
  ];

  const updatedClient = await updateClientCarePlan(params.clientId, {
    treatmentPlanSummary: String(payload.treatmentPlanSummary || "").trim(),
    treatmentProgram: {
      status: String(payload.treatmentProgram?.status || "draft"),
      cadence: String(payload.treatmentProgram?.cadence || "").trim(),
      reviewCadence: String(payload.treatmentProgram?.reviewCadence || "").trim(),
      goals: sanitizeStringList(payload.treatmentProgram?.goals),
      inCabinProtocols: sanitizeStringList(payload.treatmentProgram?.inCabinProtocols),
      homecare: sanitizeStringList(payload.treatmentProgram?.homecare)
    },
    progressSnapshot: {
      trend: String(payload.progressSnapshot?.trend || "baseline"),
      focus: String(payload.progressSnapshot?.focus || "").trim(),
      baseline: String(payload.progressSnapshot?.baseline || "").trim(),
      current: String(payload.progressSnapshot?.current || "").trim()
    },
    primaryConcerns: sanitizeStringList(payload.primaryConcerns),
    riskFlags: sanitizeStringList(payload.riskFlags),
    nextSession: payload.nextSession || null,
    timeline
  });

  return NextResponse.json({
    ok: true,
    client: updatedClient
  });
}
