import { NextResponse } from "next/server";
import { getCurrentUser, isDatabaseConfigured } from "../../../../lib/auth";
import { assignQuestionnaireToClient } from "../../../../lib/intake";

export async function POST(request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user || (user.role !== "professional" && user.role !== "salon-manager" && user.role !== "admin")) {
    return NextResponse.json({ error: "Autentificare necesară ca profesionist." }, { status: 401 });
  }

  const { clientId, questionnaireSlug } = await request.json();

  if (!clientId || !questionnaireSlug) {
    return NextResponse.json({ error: "clientId și questionnaireSlug sunt obligatorii." }, { status: 422 });
  }

  const client = await assignQuestionnaireToClient(clientId, questionnaireSlug, user.professionalId || user.id);
  return NextResponse.json({ ok: true, client: { _id: String(client._id), questionnaireAssignments: client.questionnaireAssignments } });
}
