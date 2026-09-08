import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "../../components/app-shell";
import { CreateClientForm } from "../../components/create-client-form";
import { currentAccount } from "../../lib/auth";
import { getProfessionalWorkspace } from "../../lib/dashboard";

export default async function ProfessionalPage() {
  const account = await currentAccount(); if (!account || account.role !== "professional") redirect("/login");
  const workspace = await getProfessionalWorkspace(account); if (!workspace) redirect("/login");
  const { professional, clients, visits } = workspace;
  const visitCount = visits.reduce((result, visit) => ({ ...result, [visit.clientId]: (result[visit.clientId] || 0) + 1 }), {});
  return <AppShell account={account}><header className="page-header"><div><p className="eyebrow">Portofoliu profesional</p><h1>Clienții tăi, în continuitate.</h1><p>{professional.specialty}. Invită, evaluează și păstrează fiecare intervenție în dosarul corect.</p></div><div className="metric"><strong>{clients.length}</strong><span>clienți în portofoliu</span></div></header><CreateClientForm /><section className="content-section"><div className="section-heading"><div><p className="eyebrow">Dosare active</p><h2>Clienți</h2></div></div><div className="client-grid">{clients.map((client) => <Link className="client-card" key={String(client._id)} href={`/professional/clients/${client._id}`}><div className="avatar">{client.name.slice(0, 1)}</div><div><h3>{client.name}</h3><p>{client.onboardingStatus === "completed" ? `Baumann ${client.baumannType}` : "Invitație în așteptare"}</p></div><span>{visitCount[String(client._id)] || 0} vizite</span></Link>)}</div>{!clients.length && <div className="empty-state">Nu există clienți încă. Creează prima invitație pentru a începe un dosar.</div>}</section></AppShell>;
}
