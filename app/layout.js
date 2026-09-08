import "./globals.css";
import "./soft-botanical.css";
import { PwaFoundation } from "../components/pwa-foundation";

export const metadata = { title: "Insight Beauty", description: "Dosar de îngrijire personalizat" };

export default function RootLayout({ children }) { return <html lang="ro"><body><PwaFoundation />{children}</body></html>; }
