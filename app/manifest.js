export default function manifest() {
  return {
    name: "Insight Beauty",
    short_name: "Insight Beauty",
    description: "PWA pentru intake clinic, operare salon si urmarirea clientului in beauty-health.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f2ea",
    theme_color: "#c76447",
    categories: ["beauty", "health", "productivity", "lifestyle"],
    lang: "ro",
    icons: [
      {
        src: "/pwa-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any maskable"
      },
      {
        src: "/pwa-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}
