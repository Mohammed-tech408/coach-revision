import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coach de Révision IA",
    short_name: "Coach IA",
    description:
      "Un assistant de révision pour créer des fiches, quiz, flashcards et plans avant les examens.",
    start_url: "/revision",
    scope: "/",
    display: "standalone",
    background_color: "#f4f2ff",
    theme_color: "#6366f1",
    categories: ["education", "productivity"],
    lang: "fr",
    icons: [
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
