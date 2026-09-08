import { redirect } from "next/navigation";
import { currentAccount } from "../lib/auth";

const destination = { admin: "/admin", salon: "/salon", professional: "/professional", client: "/client" };
export default async function Home() { const account = await currentAccount(); redirect(account ? destination[account.role] : "/login"); }
