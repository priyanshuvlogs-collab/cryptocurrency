import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Indi Radio – Live Punjabi Radio",
    short_name: "Indi Radio",
    description: "Live Punjabi radio from Surrey, Canada, hosted by Indi Jaswal.",
    start_url: "/en",
    display: "standalone",
    background_color: "#12090f",
    theme_color: "#12090f",
    lang: "en-CA",
    categories: ["music", "entertainment", "news"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
