import { NextResponse } from "next/server";
import { canAccessAdmin, getCurrentUser, isDatabaseConfigured } from "../../../../../lib/auth";
import { deleteQuestionnaireTemplate, getQuestionnaireTemplateBySlug, saveQuestionnaireTemplate } from "../../../../../lib/questionnaire-db";

export async function GET(request, { params }) {
  const { slug } = await params;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Acces refuzat." }, { status: 403 });
  }

  const template = await getQuestionnaireTemplateBySlug(slug);

  if (!template) {
    return NextResponse.json({ error: "Chestionar negăsit." }, { status: 404 });
  }

  return NextResponse.json({ template });
}

export async function PUT(request, { params }) {
  const { slug } = await params;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Acces refuzat." }, { status: 403 });
  }

  const payload = await request.json();

  if (!payload.title?.trim()) {
    return NextResponse.json({ error: "Titlul este obligatoriu." }, { status: 422 });
  }

  const template = await saveQuestionnaireTemplate({ ...payload, slug });

  return NextResponse.json({ ok: true, template });
}

export async function DELETE(request, { params }) {
  const { slug } = await params;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Acces refuzat." }, { status: 403 });
  }

  const existing = await getQuestionnaireTemplateBySlug(slug);

  if (existing?.source === "static") {
    return NextResponse.json(
      { error: "Chestionarele statice nu pot fi șterse. Importă-l în DB și dezactivează-l." },
      { status: 400 }
    );
  }

  await deleteQuestionnaireTemplate(slug);
  return NextResponse.json({ ok: true });
}
