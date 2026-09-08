import { cookies } from "next/headers";
import { connectDb } from "./db";
import { Account } from "./models";

export async function currentAccount() {
  const cookieStore = await cookies();
  const id = cookieStore.get("ib_session")?.value;
  if (!id) return null;
  await connectDb();
  const account = await Account.findById(id).lean();
  if (!account) return null;
  const impersonatedBy = cookieStore.get("ib_impersonator")?.value;
  return { ...account, impersonatedBy: impersonatedBy || null };
}

export async function requireRole(...roles) {
  const account = await currentAccount();
  if (!account || !roles.includes(account.role)) return null;
  return account;
}
