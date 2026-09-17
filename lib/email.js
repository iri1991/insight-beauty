const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

export async function sendEmail({ to, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Email configuration is missing.");
    return { sent: false, error: "Email configuration is missing." };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text, html })
    });
    if (!response.ok) {
      console.error("Resend rejected an email.", await response.text());
      return { sent: false, error: "Resend rejected the email." };
    }
    const payload = await response.json();
    return { sent: true, id: payload.id };
  } catch (error) {
    console.error("Unable to send email through Resend.", error);
    return { sent: false, error: "Unable to send email." };
  }
}

export function invitationEmail({ clientName, professionalName, salonName, onboardingUrl }) {
  const name = escapeHtml(clientName);
  const professional = escapeHtml(professionalName);
  const salon = escapeHtml(salonName);
  const url = escapeHtml(onboardingUrl);
  return {
    subject: "Invitația ta în Insight Beauty",
    text: `Bună, ${clientName}. ${professional} de la ${salon} ți-a pregătit dosarul Insight Beauty. Creează-ți contul, oferă acordul GDPR și completează evaluarea inițială: ${onboardingUrl}`,
    html: `<main style="max-width:600px;margin:0 auto;padding:40px 24px;background:#f8f7f2;color:#31413b;font-family:Georgia,serif"><p style="margin:0 0 22px;color:#9d5868;font:700 11px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase">Insight Beauty</p><h1 style="margin:0 0 18px;font-size:38px;font-weight:500">Bună, ${name}.</h1><p style="font:17px/1.6 Arial,sans-serif">${professional} de la ${salon} ți-a pregătit dosarul personal de îngrijire.</p><p style="font:17px/1.6 Arial,sans-serif">Creează-ți contul, confirmă acordul GDPR și completează evaluarea inițială. Rezultatele vor deveni punctul de plecare al recomandărilor tale.</p><p style="margin:32px 0"><a href="${url}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#9d5868;color:#fff;text-decoration:none;font:700 13px Arial,sans-serif">Începe evaluarea</a></p><p style="font:13px/1.6 Arial,sans-serif;color:#77817c">Linkul este personal și nu trebuie distribuit altor persoane.</p></main>`
  };
}

export function onboardingConfirmationEmail({ clientName, baumannType, salonName, professionalName }) {
  const name = escapeHtml(clientName);
  const type = escapeHtml(baumannType);
  const salon = escapeHtml(salonName);
  const professional = escapeHtml(professionalName);
  return {
    subject: "Evaluarea ta inițială este gata",
    text: `Bună, ${clientName}. Evaluarea inițială Insight Beauty a fost salvată. Tipologia ta Baumann este ${baumannType}. ${professional} de la ${salon} va discuta rezultatele și următorii pași la debriefing.`,
    html: `<main style="max-width:600px;margin:0 auto;padding:40px 24px;background:#f8f7f2;color:#31413b;font-family:Georgia,serif"><p style="margin:0 0 22px;color:#9d5868;font:700 11px Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase">Insight Beauty</p><h1 style="margin:0 0 18px;font-size:38px;font-weight:500">Evaluarea ta este gata, ${name}.</h1><p style="font:17px/1.6 Arial,sans-serif">Profilul tău inițial Baumann este <strong>${type}</strong>. Acesta orientează discuția despre nivelul de hidratare, reactivitate, predispoziție la pigmentare și semnele de îmbătrânire ale pielii.</p><p style="font:17px/1.6 Arial,sans-serif">${professional} de la ${salon} va analiza rezultatul împreună cu tine și va propune următorii pași la debriefing.</p><p style="font:13px/1.6 Arial,sans-serif;color:#77817c">Poți consulta oricând evoluția dosarului din contul tău Insight Beauty.</p></main>`
  };
}
