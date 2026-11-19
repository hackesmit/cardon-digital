import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { brandArt } from "@/lib/brand-art";

// The installable-app card, named for the build's brand (lib/brand.ts), with
// the brand's own tiles (lib/brand-art.ts): the saguaro on cardon, the wine
// brand's generated tile on vino.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    start_url: "/",
    display: "standalone",
    background_color: BRAND.theme.ink,
    theme_color: BRAND.theme.ink,
    icons: [...brandArt(BRAND.id).manifest],
  };
}
