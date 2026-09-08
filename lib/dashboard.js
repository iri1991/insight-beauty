import { connectDb } from "./db";
import { Client, Professional, Salon, Visit } from "./models";

export async function getClientDossier(accountId) {
  await connectDb();
  const client = await Client.findOne({ accountId }).lean();
  if (!client) return null;
  const [professional, salon, visits] = await Promise.all([
    Professional.findById(client.professionalId).lean(),
    Salon.findById(client.salonId).lean(),
    Visit.find({ clientId: String(client._id) }).sort({ date: -1 }).lean()
  ]);
  return { client, professional, salon, visits };
}

export async function getProfessionalWorkspace(account) {
  await connectDb();
  const professional = await Professional.findById(account.professionalId).lean();
  if (!professional) return null;
  const clients = await Client.find({ professionalId: String(professional._id) }).sort({ updatedAt: -1 }).lean();
  const clientIds = clients.map((client) => String(client._id));
  const visits = clientIds.length ? await Visit.find({ clientId: { $in: clientIds } }).sort({ date: -1 }).lean() : [];
  return { professional, clients, visits };
}

export async function getSalonWorkspace(account) {
  await connectDb();
  const salon = await Salon.findById(account.salonId).lean();
  if (!salon) return null;
  const professionals = await Professional.find({ salonId: String(salon._id) }).lean();
  const clients = await Client.find({ salonId: String(salon._id) }).sort({ updatedAt: -1 }).lean();
  return { salon, professionals, clients };
}
