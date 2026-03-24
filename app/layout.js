import "./globals.css";
import { AppShell } from "../components/app-shell";
import { PwaFoundation } from "../components/pwa-foundation";
import { getCurrentUser } from "../lib/auth";

export const metadata = {
  title: "Insight Beauty",
  description: "Platforma multi-tenant pentru saloane, profesionisti si intake clinic orientat beauty-health.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Insight Beauty"
  }
};

export const viewport = {
  themeColor: "#c76447"
};

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="ro">
      <body>
        <AppShell currentUser={currentUser}>{children}</AppShell>
        <PwaFoundation />
      </body>
    </html>
  );
}
