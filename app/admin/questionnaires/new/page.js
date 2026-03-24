import { AccessDenied } from "../../../../components/access-denied";
import { QuestionnaireEditor } from "../../../../components/questionnaire-editor";
import { canAccessAdmin, isDatabaseConfigured, requireUser } from "../../../../lib/auth";

export default async function NewQuestionnairePage() {
  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Mongo neconfigurat" body="Configureaza baza de date pentru a crea chestionare." />;
  }

  const user = await requireUser();

  if (!canAccessAdmin(user)) {
    return <AccessDenied body="Accesul este restrictionat la administratori." />;
  }

  return (
    <div className="stack page-stack">
      <QuestionnaireEditor
        initialTemplate={{
          slug: "",
          title: "",
          kind: "choice-sum",
          audience: "client",
          deliveryMode: "public",
          status: "draft",
          description: "",
          sourceRefs: [],
          definition: { questions: [], bands: [] }
        }}
        isNew={true}
      />
    </div>
  );
}
