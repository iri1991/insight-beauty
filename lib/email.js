import nodemailer from "nodemailer";

function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
  if (!isEmailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function getFromAddress() {
  const name = process.env.EMAIL_FROM_NAME || "Insight Beauty";
  const address = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || "noreply@insightbeauty.ro";
  return `"${name}" <${address}>`;
}

function buildResultsHtml(evaluation) {
  if (!evaluation) return "";

  const band = evaluation.band;
  const score = typeof evaluation.score === "number" ? evaluation.score : null;
  const dimensions = evaluation.dimensions;

  let html = "";

  if (band) {
    html += `
      <div style="background:#fdf6f2;border-left:3px solid #c76447;padding:16px 20px;border-radius:0 12px 12px 0;margin:16px 0;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#c76447;font-weight:600;margin-bottom:4px;">Rezultat evaluare</div>
        <div style="font-size:18px;font-weight:700;color:#231815;">${band.label || "Rezultat calculat"}</div>
        ${score !== null ? `<div style="font-size:13px;color:#665550;margin-top:2px;">${score} puncte</div>` : ""}
      </div>
    `;

    if (band.summary) {
      html += `
        <p style="font-size:14px;line-height:1.7;color:#3d2c26;background:#fff;padding:14px 16px;border-radius:10px;margin:12px 0;">
          ${band.summary}
        </p>
      `;
    }

    if (band.recommendation) {
      html += `
        <div style="margin:12px 0;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#7da495;font-weight:600;margin-bottom:6px;">Recomandare</div>
          <p style="font-size:13px;line-height:1.65;color:#3d2c26;margin:0;">${band.recommendation}</p>
        </div>
      `;
    }
  }

  if (evaluation.code) {
    html += `
      <div style="display:inline-block;background:linear-gradient(135deg,#c76447,#934329);color:#fff;padding:6px 14px;border-radius:20px;font-size:14px;font-weight:700;letter-spacing:0.06em;margin:10px 0;">
        Tipologie Baumann: ${evaluation.code}
      </div>
    `;
  }

  if (dimensions && dimensions.length > 0) {
    html += `
      <div style="margin:16px 0;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#c76447;font-weight:600;margin-bottom:8px;">Dimensiuni analizate</div>
        <table style="width:100%;border-collapse:collapse;">
    `;
    for (const dim of dimensions) {
      if (!dim.missing) {
        html += `
          <tr>
            <td style="padding:5px 8px;font-size:13px;color:#665550;vertical-align:top;">${dim.label || dim.id}</td>
            <td style="padding:5px 8px;font-size:13px;font-weight:600;color:#231815;text-align:right;vertical-align:top;">${dim.band?.label || dim.score}</td>
          </tr>
        `;
      }
    }
    html += `</table></div>`;
  }

  return html;
}

function buildIntakeConfirmationHtml({ client, salon, professional, questionnaire, evaluation, dossier }) {
  const clientName = [client.firstName, client.lastName].filter(Boolean).join(" ");
  const professionalName =
    professional?.displayName ||
    [professional?.firstName, professional?.lastName].filter(Boolean).join(" ") ||
    "Profesionistul tău";

  const resultsHtml = buildResultsHtml(evaluation);

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmare Intake — Insight Beauty</title>
</head>
<body style="margin:0;padding:0;background:#f7f2ea;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#231815;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f2ea;padding:40px 20px;">
    <tr>
      <td>
        <table width="600" align="center" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(94,52,37,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#231815 0%,#3d2c26 100%);padding:36px 40px;">
              <div style="font-size:13px;text-transform:uppercase;letter-spacing:0.18em;color:#c76447;font-weight:600;margin-bottom:8px;">Insight Beauty</div>
              <h1 style="margin:0;font-size:26px;color:#fff;font-weight:700;line-height:1.25;">Evaluarea ta a fost înregistrată</h1>
              <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.5;">
                Bună ziua, ${clientName} — iată un rezumat al rezultatelor tale.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Questionnaire badge -->
              <div style="display:inline-block;background:#fdf6f2;border:1px solid #f0d5cb;padding:5px 12px;border-radius:20px;font-size:12px;color:#c76447;font-weight:600;margin-bottom:20px;text-transform:uppercase;letter-spacing:0.06em;">
                ${questionnaire.title}
              </div>

              <!-- Results section -->
              ${resultsHtml}

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #f0e6de;margin:28px 0;" />

              <!-- Appointment proposal -->
              <div style="margin-bottom:24px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#7da495;font-weight:600;margin-bottom:10px;">Pasul următor</div>
                <div style="background:#f6faf8;border-radius:12px;padding:18px 20px;">
                  <p style="margin:0 0 8px;font-size:14px;line-height:1.65;color:#3d2c26;">
                    Pe baza evaluării tale, <strong>${professionalName}</strong> îți propune o sesiune de debriefing personalizat la <strong>${salon.name}</strong>.
                  </p>
                  <p style="margin:0;font-size:13px;color:#665550;line-height:1.55;">
                    Vei fi contactat în cel mai scurt timp pentru a stabili data și ora potrivite.
                  </p>
                </div>
              </div>

              <!-- Dossier info -->
              <div style="background:#fdf6f2;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#c76447;font-weight:600;margin-bottom:8px;">Fișa ta personală</div>
                <p style="margin:0 0 6px;font-size:13px;color:#3d2c26;line-height:1.5;">
                  A fost creată fișa personală <strong>#${dossier.dossierId?.slice(-8)?.toUpperCase()}</strong>. 
                  Toate evaluările viitoare și planul de tratament vor fi stocate acolo.
                </p>
                <p style="margin:4px 0 0;font-size:12px;color:#998077;">
                  Data primului intake: ${dossier.createdAt ? dossier.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10)}
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin:28px 0;">
                <a href="mailto:${professional?.email || ''}" style="display:inline-block;background:linear-gradient(135deg,#c76447,#934329);color:#fff;text-decoration:none;padding:13px 28px;border-radius:50px;font-size:14px;font-weight:600;letter-spacing:0.04em;">
                  Contactează ${salon.name}
                </a>
              </div>

              <p style="font-size:12px;color:#998077;line-height:1.6;margin-top:24px;">
                Datele tale sunt gestionate confidențial și sunt disponibile exclusiv pentru ${salon.name} și echipa sa.
                Evaluarea a fost realizată prin Insight Beauty, platforma dedicată salonelor premium.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f7f2ea;padding:20px 40px;border-top:1px solid #ede4da;">
              <p style="margin:0;font-size:11px;color:#998077;text-align:center;line-height:1.6;">
                Insight Beauty · Platformă multi-tenant pentru saloane premium<br />
                Acest email a fost generat automat după completarea chestionarului de evaluare.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function buildIntakeConfirmationText({ client, salon, professional, questionnaire, evaluation }) {
  const clientName = [client.firstName, client.lastName].filter(Boolean).join(" ");
  const band = evaluation?.band;
  const score = typeof evaluation?.score === "number" ? ` (${evaluation.score} puncte)` : "";
  const professionalName =
    professional?.displayName ||
    [professional?.firstName, professional?.lastName].filter(Boolean).join(" ") ||
    "Profesionistul tău";

  return [
    `Bună ziua, ${clientName},`,
    "",
    `Evaluarea ta — ${questionnaire.title} — a fost înregistrată cu succes.`,
    "",
    band ? `Rezultat: ${band.label}${score}` : "",
    band?.summary ? `\n${band.summary}` : "",
    evaluation?.code ? `Tipologie Baumann: ${evaluation.code}` : "",
    "",
    "─────────────────────────────",
    "Pasul următor",
    "",
    `${professionalName} îți propune o sesiune de debriefing personalizat la ${salon.name}.`,
    "Vei fi contactat în cel mai scurt timp.",
    "",
    "─────────────────────────────",
    "Insight Beauty · Platformă pentru saloane premium",
    "Datele tale sunt gestionate confidențial."
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export async function sendIntakeConfirmation({ client, salon, professional, questionnaire, evaluation, dossier }) {
  const transporter = createTransporter();

  const subject = `Evaluarea ta la ${salon.name} — ${questionnaire.title}`;
  const html = buildIntakeConfirmationHtml({ client, salon, professional, questionnaire, evaluation, dossier });
  const text = buildIntakeConfirmationText({ client, salon, professional, questionnaire, evaluation });

  if (!transporter) {
    console.log("[email] SMTP neconfigurat — email preview:");
    console.log("  To:", client.email);
    console.log("  Subject:", subject);
    console.log("  Text preview:", text.slice(0, 300));
    return { sent: false, reason: "smtp-not-configured", preview: { subject, text: text.slice(0, 300) } };
  }

  try {
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: `"${[client.firstName, client.lastName].filter(Boolean).join(" ")}" <${client.email}>`,
      subject,
      text,
      html
    });

    console.log("[email] Trimis:", info.messageId, "→", client.email);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("[email] Eroare la trimitere:", error.message);
    return { sent: false, reason: "smtp-error", error: error.message };
  }
}
