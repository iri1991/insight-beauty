import { cookies } from "next/headers";
import { connectDb } from "./db";
import { Account } from "./models";

export async function currentAccount() {
  const id = (await cookies()).get("ib_session")?.value;
  if (!id) return null;
  await connectDb();
  return Account.findById(id).lean();
}

export async function requireRole(...roles) {
  const account = await currentAccount();
  if (!account || !roles.includes(account.role)) return null;
  return account;
}
