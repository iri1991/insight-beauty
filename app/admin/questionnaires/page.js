import Link from "next/link";
import { AccessDenied } from "../../../components/access-denied";
import { canAccessAdmin, isDatabaseConfigured, requireUser } from "../../../lib/auth";
import { listQuestionnairesForAdmin } from "../../../lib/questionnaire-db";

const KIND_LABELS = {
  "choice-sum": "Choice Sum",
  "acne-index": "Acne Index",
  "baumann-dimensions": "Baumann Dims",
  custom: "Custom"
};

const STATUS_COLORS = {
  active: "tag-success",
  draft: "tag-draft",
  archived: "tag",
  "mapped-source": "tag tag-soft",
  "awaiting-question-bank": "tag tag-warn",
  "source-indexed": "tag tag-soft"
};

const DELIVERY_LABELS = {
  public: "Public",
  "public-assisted": "Asistat",
  workspace: "Workspace"
};

export default async function QuestionnairesAdminPage() {
  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Mongo neconfigurat" body="Configureaza baza de date pentru a gestiona chestionarele." />;
  }

  const user = await requireUser();

  if (!canAccessAdmin(user)) {
    return <AccessDenied body="Accesul este restrictionat la administratori." />;
  }

  const questionnaires = await listQuestionnairesForAdmin();
  const dbCount = questionnaires.filter((q) => q.source === "db").length;
  const activeCount = questionnaires.filter((q) => q.status === "active").length;

  return (
    <div className="stack page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Questionnaire registry</span>
            <h1>Gestionare formulare și chestionare</h1>
            <p className="lead-copy">
              Creează, editează și configurează orice chestionar: întrebări, opțiuni, punctaje și interpretări.
            </p>
          </div>
          <Link className="button primary" href="/admin/questionnaires/new">
            + Chestionar nou
          </Link>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Total chestionare</span>
            <strong>{questionnaires.length}</strong>
          </article>
          <article className="metric-card">
            <span>Active</span>
            <strong>{activeCount}</strong>
          </article>
          <article className="metric-card">
            <span>Gestionate în DB</span>
            <strong>{dbCount}</strong>
          </article>
          <article className="metric-card">
            <span>Template statice</span>
            <strong>{questionnaires.length - dbCount}</strong>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="q-registry-table">
          <div className="q-registry-header">
            <span>Titlu / Slug</span>
            <span>Tip</span>
            <span>Audienta</span>
            <span>Livrare</span>
            <span>Status</span>
            <span>Actiuni</span>
          </div>
          {questionnaires.map((q) => (
            <div key={q.slug} className={`q-registry-row${q.source === "static" ? " q-row-static" : ""}`}>
              <div className="q-cell-main">
                <strong>{q.title}</strong>
                <span className="q-slug">{q.slug}</span>
                {q.description ? <span className="q-desc">{q.description}</span> : null}
              </div>
              <div className="q-cell">
                <span className="tag">{KIND_LABELS[q.kind] || q.kind}</span>
              </div>
              <div className="q-cell">
                <span className="tag tag-soft">{q.audience}</span>
              </div>
              <div className="q-cell">
                <span className="tag tag-soft">{DELIVERY_LABELS[q.deliveryMode] || q.deliveryMode}</span>
              </div>
              <div className="q-cell">
                <span className={STATUS_COLORS[q.status] || "tag"}>{q.status}</span>
              </div>
              <div className="q-cell-actions">
                {q.source === "static" ? (
                  <ImportToDbButton slug={q.slug} template={q} />
                ) : (
                  <Link className="button secondary small" href={`/admin/questionnaires/${q.slug}`}>
                    Editează
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ImportToDbButton({ slug, template }) {
  return (
    <form action={`/api/admin/questionnaires`} method="POST">
      <input type="hidden" name="_template" value={JSON.stringify(template)} />
      <Link className="button secondary small" href={`/admin/questionnaires/${slug}?import=1`}>
        Import &amp; Editează
      </Link>
    </form>
  );
}
