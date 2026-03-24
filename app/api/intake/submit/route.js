import { NextResponse } from "next/server";
import { getCurrentUser, isDatabaseConfigured } from "../../../../lib/auth";
import { ensureClientUserAccount, persistIntakeResult } from "../../../../lib/intake";
import { connectMongo } from "../../../../lib/mongodb";
import { getModels } from "../../../../lib/mongoose-models";
import { getEvaluableDefinition } from "../../../../lib/questionnaire-db";
import { getClientById, getProfessionalById, getSalonById, getSalonBySlug } from "../../../../lib/repositories";

export async function POST(request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Autentificare necesară." }, { status: 401 });
  }

  const payload = await request.json();
  const { questionnaireSlug, answers, clientId, newClient } = payload;

  if (!questionnaireSlug) {
    return NextResponse.json({ error: "questionnaireSlug este obligatoriu." }, { status: 422 });
  }

  const questionnaire = await getEvaluableDefinition(questionnaireSlug);
  if (!questionnaire) {
    return NextResponse.json({ error: "Chestionarul nu a fost găsit." }, { status: 404 });
  }

  /* ── PROFESSIONAL filling for a client ── */
  if (user.role === "professional" || user.role === "salon-manager") {
    const professional = await getProfessionalById(user.professionalId || user.id);
    if (!professional) {
      return NextResponse.json({ error: "Profesionistul nu a fost găsit." }, { status: 404 });
    }

    const salon = await getSalonById(user.salonId);
    if (!salon) {
      return NextResponse.json({ error: "Salonul nu a fost găsit." }, { status: 404 });
    }

    let clientData;

    if (clientId) {
      const existingClient = await getClientById(clientId);
      if (!existingClient || String(existingClient.salonId) !== String(salon._id)) {
        return NextResponse.json({ error: "Clientul nu aparține acestui salon." }, { status: 422 });
      }
      clientData = {
        firstName: existingClient.firstName,
        lastName: existingClient.lastName,
        email: existingClient.email,
        phone: existingClient.phone || ""
      };
    } else if (newClient) {
      const { firstName, lastName, email, phone } = newClient;
      if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
        return NextResponse.json({ error: "Prenumele, numele și emailul sunt obligatorii pentru un client nou." }, { status: 422 });
      }
      clientData = { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || "" };
    } else {
      return NextResponse.json({ error: "Specifică un client existent (clientId) sau datele unui client nou (newClient)." }, { status: 422 });
    }

    if (clientId || newClient) {
      await ensureClientUserAccount(clientData.email, clientData.firstName, clientData.lastName);
    }

    const result = await persistIntakeResult({
      questionnaire, answers: answers || {},
      client: clientData, salon, professional,
      submittedByRole: user.role, channel: "professional-intake"
    });

    if (!result.ok) {
      return NextResponse.json({ error: "Răspunsuri incomplete.", missingQuestionIds: result.missingQuestionIds }, { status: 422 });
    }

    return NextResponse.json(result);
  }

  /* ── CLIENT self-service ── */
  if (user.role === "client") {
    await connectMongo();
    const { ClientProfile } = getModels();
    const existingProfile = await ClientProfile.findOne({ email: user.email.toLowerCase() }).lean().exec();

    if (!existingProfile) {
      return NextResponse.json({ error: "Nu ai o fișă înregistrată. Contactează profesionistul tău." }, { status: 404 });
    }

    const salon = await getSalonById(existingProfile.salonId);
    const professional = await getProfessionalById(existingProfile.professionalId);

    if (!salon || !professional) {
      return NextResponse.json({ error: "Contextul salonului sau profesionistului nu este valid." }, { status: 422 });
    }

    const clientData = {
      firstName: existingProfile.firstName,
      lastName: existingProfile.lastName,
      email: existingProfile.email,
      phone: existingProfile.phone || ""
    };

    const result = await persistIntakeResult({
      questionnaire, answers: answers || {},
      client: clientData, salon, professional,
      submittedByRole: "client", channel: "client-self-service"
    });

    if (!result.ok) {
      return NextResponse.json({ error: "Răspunsuri incomplete.", missingQuestionIds: result.missingQuestionIds }, { status: 422 });
    }

    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Rolul tău nu permite completarea chestionarelor." }, { status: 403 });
}
