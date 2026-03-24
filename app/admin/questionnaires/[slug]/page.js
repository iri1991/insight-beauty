import { notFound } from "next/navigation";
import { AccessDenied } from "../../../../components/access-denied";
import { QuestionnaireEditor } from "../../../../components/questionnaire-editor";
import { canAccessAdmin, isDatabaseConfigured, requireUser } from "../../../../lib/auth";
import { getQuestionnaireTemplateBySlug, saveQuestionnaireTemplate } from "../../../../lib/questionnaire-db";

export default async function EditQuestionnairePage({ params, searchParams }) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);

  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Mongo neconfigurat" body="Configureaza baza de date pentru a edita chestionare." />;
  }

  const user = await requireUser();

  if (!canAccessAdmin(user)) {
    return <AccessDenied body="Accesul este restrictionat la administratori." />;
  }

  let template = await getQuestionnaireTemplateBySlug(resolvedParams.slug);

  if (!template) {
    notFound();
  }

  if (template.source === "static" || resolvedSearch?.import === "1") {
    template = await saveQuestionnaireTemplate({
      slug: template.slug,
      title: template.title,
      kind: template.kind || "choice-sum",
      audience: template.audience || "client",
      deliveryMode: template.deliveryMode || "public",
      status: template.status || "active",
      description: template.description || "",
      sourceRefs: template.sourceRefs || [],
      definition: template.definition || { questions: [], bands: [] }
    });
  }

  return (
    <div className="stack page-stack">
      <QuestionnaireEditor initialTemplate={template} isNew={false} />
    </div>
  );
}
