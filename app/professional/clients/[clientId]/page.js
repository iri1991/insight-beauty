import { notFound, redirect } from "next/navigation";
import { AppShell } from "../../../../components/app-shell";
import { VisitForm } from "../../../../components/visit-form";
import { currentAccount } from "../../../../lib/auth";
import { connectDb } from "../../../../lib/db";
import { Client, Visit } from "../../../../lib/models";

export default async function ProfessionalClientPage({ params }) {
  const account = await currentAccount(); if (!account || account.role !== "professional") redirect("/login"); const { clientId } = await params;
  await connectDb(); const client = await Client.findOne({ _id: clientId, professionalId: account.professionalId }).lean(); if (!client) notFound();
  const visits = await Visit.find({ clientId }).sort({ date: -1 }).lean();
  return <AppShell account={account}><header className="page-header"><div><p className="eyebrow">Dosar client</p><h1>{client.name}</h1><p>{client.email} {client.phone ? `· ${client.phone}` : ""}</p></div><div className="context-label">{client.onboardingStatus === "completed" ? `Baumann ${client.baumannType}` : "Onboarding în așteptare"}</div></header>{client.onboardingStatus === "completed" ? <><VisitForm clientId={String(client._id)} /><section className="content-section"><div className="section-heading"><h2>Istoric intervenții</h2></div><div className="timeline">{visits.map((visit) => <article className="timeline-item" key={String(visit._id)}><p>{new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium" }).format(new Date(visit.date))}</p><div><h3>{visit.procedures?.join(" · ") || "Consultație"}</h3><p>{visit.notes}</p></div></article>)}</div></section></> : <div className="empty-state">Clientul trebuie să accepte GDPR și să finalizeze prima evaluare înainte de înregistrarea unei vizite.</div>}</AppShell>;
}
