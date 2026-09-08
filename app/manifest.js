export default function manifest() {
  return {
    name: "Insight Beauty",
    short_name: "Insight",
    description: "Dosar de îngrijire și parcurs personalizat.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ee",
    theme_color: "#17332e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }]
  };
}
