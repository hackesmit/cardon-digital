import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

// The installable-app card: the saguaro tile (app/icon.svg) on its ink, named
// for the build's brand (lib/brand.ts). The wine brand shares the tile until it
// has icons of its own.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    start_url: "/",
    display: "standalone",
    background_color: BRAND.theme.ink,
    theme_color: BRAND.theme.ink,
    icons: [
      { src: "/brand/cardon-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/cardon-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
