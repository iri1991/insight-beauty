import { notFound } from "next/navigation";
import { OnboardingFlow } from "../../../components/onboarding-flow";
import { connectDb } from "../../../lib/db";
import { Client } from "../../../lib/models";
import { BAUMANN_QUESTIONS } from "../../../lib/questionnaires";

export default async function OnboardingPage({ params }) { const { token } = await params; await connectDb(); const client = await Client.findOne({ onboardingToken: token, onboardingStatus: "invited" }).lean(); if (!client) notFound(); return <main className="onboarding-page"><OnboardingFlow token={token} clientName={client.name} questions={BAUMANN_QUESTIONS} /></main>; }
