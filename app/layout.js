import "./globals.css";
import { AppShell } from "../components/app-shell";
import { PwaFoundation } from "../components/pwa-foundation";
import { getCurrentUser } from "../lib/auth";

export const metadata = {
  metadataBase: new URL("https://insightbeauty.ro"),
  title: {
    default: "Insight Beauty — Platformă Clinică pentru Saloane Premium",
    template: "%s | Insight Beauty"
  },
  description:
    "Insight Beauty este prima platformă de beauty intelligence din România. Intake clinic digital, analiză Baumann automată, dosar evolutiv și plan de tratament integrat pentru saloane premium și skin studios.",
  keywords: [
    "software salon",
    "intake clinic beauty",
    "analiza Baumann digital",
    "dosar client salon",
    "skin care platform",
    "beauty intelligence",
    "management salon premium",
    "skin studio software",
    "plan tratament piele",
    "platforma beauty Romania"
  ],
  authors: [{ name: "Insight Beauty" }],
  creator: "Insight Beauty",
  publisher: "Insight Beauty",
  category: "Beauty & Wellness Software",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "Insight Beauty",
    title: "Insight Beauty — Platformă Clinică pentru Saloane Premium",
    description:
      "Prima platformă de beauty intelligence din România: intake clinic digital, analiză Baumann, dosar evolutiv și plan de tratament pentru saloane premium.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Insight Beauty — Platformă Clinică pentru Saloane Premium"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Insight Beauty — Platformă Clinică pentru Saloane Premium",
    description:
      "Prima platformă de beauty intelligence din România: intake clinic, dosar evolutiv și plan de tratament.",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Insight Beauty"
  }
};

export const viewport = {
  themeColor: "#c76447",
  width: "device-width",
  initialScale: 1
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
