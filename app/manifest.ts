import type { MetadataRoute } from "next";

// The installable-app card: the line-cactus tile (app/icon.svg) on its ink.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cardon Digital",
    short_name: "Cardon",
    start_url: "/",
    display: "standalone",
    background_color: "#161A1B",
    theme_color: "#161A1B",
    icons: [
      { src: "/brand/cardon-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/cardon-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
