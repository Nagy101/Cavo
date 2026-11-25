import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CAVO Island — Zamalek, Cairo",
    short_name: "CAVO Island",
    description:
      "Four Nile venues aboard Nile City Boat, Zamalek: Main Restaurant, Boat, Private Yacht (Yachts by Cavo), and CAVO Elite.",
    start_url: "/en",
    display: "standalone",
    background_color: "#f6f3ee",
    theme_color: "#2c241d",
    icons: [
      {
        src: "/media/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/media/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
