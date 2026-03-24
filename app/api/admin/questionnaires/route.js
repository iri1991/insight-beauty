import { NextResponse } from "next/server";
import { canAccessAdmin, getCurrentUser, isDatabaseConfigured } from "../../../../lib/auth";
import { listQuestionnairesForAdmin, saveQuestionnaireTemplate } from "../../../../lib/questionnaire-db";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Acces refuzat." }, { status: 403 });
  }

  const questionnaires = await listQuestionnairesForAdmin();
  return NextResponse.json({ questionnaires });
}

export async function POST(request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Acces refuzat." }, { status: 403 });
  }

  const payload = await request.json();
  const { title, kind, audience, deliveryMode, status, description, sourceRefs, definition, slug: rawSlug } = payload;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Titlul este obligatoriu." }, { status: 422 });
  }

  function slugify(value) {
    return value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const slug = rawSlug?.trim() ? slugify(rawSlug.trim()) : slugify(title.trim());

  const template = await saveQuestionnaireTemplate({
    slug,
    title: title.trim(),
    kind: kind || "choice-sum",
    audience: audience || "client",
    deliveryMode: deliveryMode || "public",
    status: status || "draft",
    description: description || "",
    sourceRefs: sourceRefs || [],
    definition: definition || { questions: [], bands: [] }
  });

  return NextResponse.json({ ok: true, template }, { status: 201 });
}
