import Link from "next/link";
import { redirect } from "next/navigation";
import { AccessDenied } from "../../../components/access-denied";
import { ClientQuestionnaireFiller } from "../../../components/client-questionnaire-filler";
import { isDatabaseConfigured, requireUser } from "../../../lib/auth";
import { connectMongo } from "../../../lib/mongodb";
import { getModels } from "../../../lib/mongoose-models";
import { listQuestionnairesForAdmin } from "../../../lib/questionnaire-db";
import { getSalonById } from "../../../lib/repositories";

async function getClientDossier(email) {
  if (!isDatabaseConfigured()) return null;
  await connectMongo();
  const { ClientProfile } = getModels();
  return ClientProfile.findOne({ email: email.toLowerCase() }).sort({ createdAt: 1 }).lean().exec();
}

function formatDate(d) {
  if (!d) return "—";
  return String(d).slice(0, 10);
}

function scoreTrend(assessments) {
  if (assessments.length < 2) return null;
  const scores = assessments.filter((a) => typeof a.score === "number").map((a) => a.score);
  if (scores.length < 2) return null;
  const first = scores[0];
  const last = scores[scores.length - 1];
  return last < first ? "improving" : last > first ? "worsening" : "stable";
}

function TrendBadge({ trend }) {
  if (!trend) return null;
  const map = {
    improving: { label: "Îmbunătățire", cls: "trend-good" },
    worsening: { label: "În creștere", cls: "trend-bad" },
    stable: { label: "Stabil", cls: "trend-neutral" },
    baseline: { label: "Baseline", cls: "trend-neutral" }
  };
  const info = map[trend] || map.stable;
  return <span className={`trend-badge ${info.cls}`}>{info.label}</span>;
}

function ScoreBar({ score, maxScore = 40, label }) {
  const pct = Math.min(100, Math.round((score / maxScore) * 100));
  return (
    <div className="score-bar-wrap">
      {label ? <span className="score-bar-label">{label}</span> : null}
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="score-bar-value">{score}p</span>
    </div>
  );
}

function BaumannDimensionBar({ code, label, score, maxScore }) {
  const pct = maxScore ? Math.min(100, Math.round((score / maxScore) * 100)) : 50;
  return (
    <div className="baumann-dim-bar">
      <span className="baumann-dim-code">{code}</span>
      <span className="baumann-dim-label">{label}</span>
      <div className="score-bar-track">
        <div className="score-bar-fill baumann-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="score-bar-value">{score}p</span>
    </div>
  );
}

export default async function ClientPortalPage() {
  if (!isDatabaseConfigured()) {
    return <AccessDenied title="Portal indisponibil" body="Contactează salonul pentru acces." />;
  }

  const user = await requireUser();

  if (user.role !== "client") {
    if (user.role === "admin") redirect("/admin");
    if (user.salonSlug) redirect(`/salon/${user.salonSlug}`);
    redirect("/");
  }

  const dossier = await getClientDossier(user.email);
  const salon = dossier?.salonId ? await getSalonById(dossier.salonId) : null;
  const allTemplates = await listQuestionnairesForAdmin();

  if (!dossier) {
    return (
      <div className="stack page-stack">
        <section className="section-block hero hero-immersive" style={{ textAlign: "center" }}>
          <span className="eyebrow">Portalul tău personal</span>
          <h1>Bun venit, {user.displayName}</h1>
          <p className="lead-copy">
            Fișa ta personală se creează automat după prima evaluare completată.
          </p>
          <a className="button primary" href="/client/intake">
            Completează prima evaluare
          </a>
        </section>
      </div>
    );
  }

  const assessments = dossier.assessmentHistory || [];
  const sessions = dossier.sessionHistory || [];
  const timeline = dossier.timeline || [];
  const treatmentProgram = dossier.treatmentProgram || {};
  const baumannProfile = dossier.baumannProfile;
  const trend = scoreTrend(assessments);

  const pendingAssignments = (dossier.questionnaireAssignments || []).filter((a) => a.status === "pending");
  const pendingQuestionnaires = pendingAssignments
    .map((a) => allTemplates.find((t) => t.slug === a.questionnaireSlug))
    .filter(Boolean);

  const latestBySlug = {};
  for (const a of assessments) {
    if (!latestBySlug[a.questionnaireSlug] || a.submittedAt > latestBySlug[a.questionnaireSlug].submittedAt) {
      latestBySlug[a.questionnaireSlug] = a;
    }
  }
  const distinctAssessments = Object.values(latestBySlug);

  return (
    <div className="stack page-stack">

      {/* ── Hero header ── */}
      <section className="section-block client-portal-hero">
        <div className="portal-hero-content">
          <div className="portal-hero-text">
            <span className="eyebrow">Dosarul tău personal</span>
            <h1>{dossier.firstName} {dossier.lastName}</h1>
            <p className="lead-copy">
              Urmărește evoluția ta, consultă planul de îngrijire și completează evaluările primite de la profesionistul tău.
            </p>
          </div>
          <div className="portal-hero-meta">
            {dossier.baumannType ? (
              <div className="baumann-hero-badge">
                <span className="eyebrow">Tipologie Baumann</span>
                <strong>{dossier.baumannType}</strong>
              </div>
            ) : null}
            <div className="portal-meta-list">
              <div className="metric-row">
                <span>Salon</span>
                <strong>{salon?.name || "—"}</strong>
              </div>
              <div className="metric-row">
                <span>Fișă</span>
                <strong>#{dossier.dossierId?.slice(-8)?.toUpperCase()}</strong>
              </div>
              <div className="metric-row">
                <span>Primul intake</span>
                <strong>{formatDate(dossier.firstIntakeAt)}</strong>
              </div>
              <div className="metric-row">
                <span>Următoarea ședință</span>
                <strong>{dossier.nextSession ? formatDate(dossier.nextSession) : "Nesetată"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Evaluări completate</span>
            <strong>{assessments.length}</strong>
          </article>
          <article className="metric-card">
            <span>Chestionare în așteptare</span>
            <strong className={pendingQuestionnaires.length > 0 ? "accent-text" : ""}>{pendingQuestionnaires.length}</strong>
          </article>
          <article className="metric-card">
            <span>Ședințe înregistrate</span>
            <strong>{sessions.length}</strong>
          </article>
          <article className="metric-card">
            <span>Evoluție scor</span>
            <strong><TrendBadge trend={trend || dossier.progressSnapshot?.trend} /></strong>
          </article>
        </div>
      </section>

      {/* ── Pending questionnaires ── */}
      {pendingQuestionnaires.length > 0 ? (
        <section className="section-block urgent-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">De completat</span>
              <h2>Chestionare alocate de profesionistul tău</h2>
            </div>
          </div>
          <div className="card-grid two-up">
            {pendingQuestionnaires.map((q) => (
              <article key={q.slug} className="detail-card pending-questionnaire-card">
                <div className="card-row">
                  <h3>{q.title}</h3>
                  <span className="tag tag-warn">Nou</span>
                </div>
                <p>{q.description || "Chestionar de evaluare alocat de profesionistul tău."}</p>
                <div className="metric-row">
                  <span>Tip</span>
                  <strong>{q.kind}</strong>
                </div>
                <ClientQuestionnaireFiller questionnaire={q} />
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Progress overview ── */}
      {assessments.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Progresul tău</span>
              <h2>Evoluția evaluărilor</h2>
            </div>
            {trend ? <TrendBadge trend={trend} /> : null}
          </div>

          <div className="progress-grid">
            {distinctAssessments.map((a) => {
              const prevAssessments = assessments.filter(
                (x) => x.questionnaireSlug === a.questionnaireSlug && x.submittedAt < a.submittedAt
              );
              const prevScore = prevAssessments.length > 0
                ? prevAssessments[prevAssessments.length - 1].score
                : null;
              const scoreDiff = typeof a.score === "number" && typeof prevScore === "number"
                ? a.score - prevScore
                : null;

              return (
                <article key={a.questionnaireSlug} className="progress-card">
                  <div className="card-row">
                    <h3>{a.label}</h3>
                    {typeof a.score === "number" ? <span className="tag">{a.score}p</span> : null}
                  </div>
                  <p className="helper-copy">{a.questionnaireSlug} · {formatDate(a.submittedAt)}</p>

                  {typeof a.score === "number" ? (
                    <ScoreBar score={a.score} maxScore={40} />
                  ) : null}

                  {scoreDiff !== null ? (
                    <div className={`score-delta ${scoreDiff < 0 ? "delta-good" : scoreDiff > 0 ? "delta-bad" : "delta-neutral"}`}>
                      {scoreDiff > 0 ? "+" : ""}{scoreDiff}p față de evaluarea anterioară
                    </div>
                  ) : (
                    <p className="helper-copy" style={{ marginTop: "0.5rem" }}>Prima evaluare cu acest chestionar</p>
                  )}

                  {a.insight ? <p className="progress-insight">{a.insight}</p> : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* ── Baumann profile ── */}
      {baumannProfile?.dimensions && Object.keys(baumannProfile.dimensions).length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Profilul pielii tale</span>
              <h2>Tipologie Baumann — {baumannProfile.code}</h2>
            </div>
          </div>
          <div className="baumann-profile-card detail-card">
            {baumannProfile.summary ? <p style={{ marginBottom: "1.25rem" }}>{baumannProfile.summary}</p> : null}
            <div className="baumann-dims">
              {Object.entries(baumannProfile.dimensions).map(([id, score]) => (
                <BaumannDimensionBar key={id} code={id.toUpperCase().slice(0, 1)} label={id} score={score} maxScore={85} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Treatment plan ── */}
      {treatmentProgram.status ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Planul tău de îngrijire</span>
              <h2>Program activ</h2>
            </div>
            <span className={`tag ${treatmentProgram.status === "pending-debrief" ? "tag-warn" : "tag-success"}`}>
              {treatmentProgram.status}
            </span>
          </div>

          <div className="card-grid two-up">
            {treatmentProgram.goals?.length > 0 ? (
              <article className="detail-card">
                <h3>Obiective de tratament</h3>
                <ul className="checklist">
                  {treatmentProgram.goals.map((g, i) => (
                    <li key={i}><span className="check-dot">◎</span>{g}</li>
                  ))}
                </ul>
              </article>
            ) : null}

            {treatmentProgram.homecare?.length > 0 ? (
              <article className="detail-card">
                <h3>Rutina acasă</h3>
                <ul className="checklist">
                  {treatmentProgram.homecare.map((h, i) => (
                    <li key={i}><span className="check-dot">◎</span>{h}</li>
                  ))}
                </ul>
              </article>
            ) : null}

            {treatmentProgram.inCabinProtocols?.length > 0 ? (
              <article className="detail-card">
                <h3>Protocoale în cabinet</h3>
                <ul className="checklist">
                  {treatmentProgram.inCabinProtocols.map((p, i) => (
                    <li key={i}><span className="check-dot">◎</span>{p}</li>
                  ))}
                </ul>
              </article>
            ) : null}

            {treatmentProgram.cadence ? (
              <article className="detail-card">
                <h3>Cadență și revizuire</h3>
                <div className="metric-row"><span>Cadență</span><strong>{treatmentProgram.cadence}</strong></div>
                {treatmentProgram.reviewCadence ? (
                  <div className="metric-row"><span>Revizuire plan</span><strong>{treatmentProgram.reviewCadence}</strong></div>
                ) : null}
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Assessment history ── */}
      {assessments.length > 1 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Istoricul evaluărilor</span>
              <h2>Toate evaluările tale</h2>
            </div>
          </div>
          <div className="card-grid two-up">
            {[...assessments].reverse().map((a, i) => (
              <article key={`${a.questionnaireSlug}-${i}`} className="detail-card">
                <div className="card-row">
                  <h3>{a.label}</h3>
                  {typeof a.score === "number" ? <span className="tag">{a.score}p</span> : null}
                </div>
                <p className="helper-copy">{a.questionnaireSlug} · {formatDate(a.submittedAt)}</p>
                {a.insight ? <p style={{ fontSize: "0.88rem", margin: "0.5rem 0 0", color: "var(--muted)" }}>{a.insight}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Session history ── */}
      {sessions.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Ședințe</span>
              <h2>Traseul terapeutic</h2>
            </div>
          </div>
          <div className="timeline">
            {[...sessions].reverse().map((s, i) => (
              <article key={i} className="timeline-card">
                <strong>{s.service}</strong>
                <p>{s.objective || s.notes || "—"}</p>
                <p className="helper-copy">{formatDate(s.date)} · {s.status}</p>
                {s.outcome ? <p className="helper-copy">Rezultat: {s.outcome}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Timeline ── */}
      {timeline.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Jurnal</span>
              <h2>Istoricul complet</h2>
            </div>
          </div>
          <div className="timeline">
            {[...timeline].reverse().slice(0, 12).map((ev, i) => (
              <article key={i} className="timeline-card">
                <strong>{formatDate(ev.date)}</strong>
                <p>{ev.event}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
