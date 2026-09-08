import { redirect } from "next/navigation";
import { ProfessionalPortal } from "../../components/professional-portal";
import { currentAccount } from "../../lib/auth";
import { getProfessionalWorkspace } from "../../lib/dashboard";
import { connectDb } from "../../lib/db";
import { Salon } from "../../lib/models";

export default async function ProfessionalPage() {
  const account = await currentAccount(); if (!account || account.role !== "professional") redirect("/login");
  const workspace = await getProfessionalWorkspace(account); if (!workspace) redirect("/login");
  const { professional, clients, visits } = workspace;
  await connectDb(); const salon = await Salon.findById(professional.salonId).lean();
  const visitByClient = visits.reduce((result, visit) => ({ ...result, [visit.clientId]: [...(result[visit.clientId] || []), visit] }), {});
  const serializedClients = clients.map((client) => { const clientVisits = visitByClient[String(client._id)] || []; return { id: String(client._id), name: client.name, baumannType: client.baumannType, visitCount: clientVisits.length, lastVisit: clientVisits[0] ? new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium" }).format(new Date(clientVisits[0].date)) : null }; });
  return <ProfessionalPortal account={{ name: account.name }} salonName={salon?.name} clients={serializedClients} />;
}
