/**
 * Each brand's share card and icons (bead hq-3f6ut.8). Every page, the
 * manifest and the JSON-LD read their image URLs from here, so a wine-brand
 * build never points at Cardon's card or saguaro tile.
 *
 * Cardon's art is static: public/og.png, public/icon.svg, public/favicon.ico,
 * public/apple-icon.png and the 192 and 512 tiles in public/brand. The wine
 * brand's art is drawn at build time from BRAND.name by app/brand-art/[file]
 * (next/og), because the name is still a placeholder (lib/brand.ts): a new
 * name gives a new card and new icons with no artwork to redo. Until the brand
 * has a mark, its icons are the name's initial on the wine ground.
 *
 * Cardon's root paths (/og.png, /icon.svg, /favicon.ico, /apple-icon.png) are
 * rewritten to the wine art on a wine build (VINO_ART_REWRITES in
 * next.config.mjs), so an old link or a browser's default /favicon.ico request
 * never shows Cardon's art there.
 */
import type { Brand } from "./brand";

export type ManifestIcon = { src: string; sizes: string; type: string };

export type BrandArt = {
  /** The 1200 x 630 Open Graph and Twitter card. */
  og: { url: string; width: number; height: number };
  /** The browser-tab icons, in the order the head lists them. */
  icons: readonly { url: string; sizes: string; type: string }[];
  /** The 180 x 180 home-screen icon; also the JSON-LD logo. */
  apple: string;
  /** The installable-app icons. */
  manifest: readonly ManifestIcon[];
};

/** Where the wine brand's generated art is served. */
export const VINO_ART_DIR = "/brand-art";

/** The wine brand's generated files and their pixel sizes. */
export const VINO_ART_FILES = {
  "og.png": { width: 1200, height: 630 },
  "icon-48.png": { width: 48, height: 48 },
  "icon-192.png": { width: 192, height: 192 },
  "icon-512.png": { width: 512, height: 512 },
  "apple-icon.png": { width: 180, height: 180 },
} as const;

export type VinoArtFile = keyof typeof VINO_ART_FILES;

const CARDON_ART: BrandArt = {
  og: { url: "/og.png", width: 1200, height: 630 },
  icons: [
    { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
  ],
  apple: "/apple-icon.png",
  manifest: [
    { src: "/brand/cardon-icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/brand/cardon-icon-512.png", sizes: "512x512", type: "image/png" },
  ],
};

const vino = (file: VinoArtFile) => `${VINO_ART_DIR}/${file}`;

const VINO_ART: BrandArt = {
  og: { url: vino("og.png"), ...VINO_ART_FILES["og.png"] },
  icons: [
    { url: vino("icon-48.png"), sizes: "48x48", type: "image/png" },
    { url: vino("icon-192.png"), sizes: "192x192", type: "image/png" },
  ],
  apple: vino("apple-icon.png"),
  manifest: [
    { src: vino("icon-192.png"), sizes: "192x192", type: "image/png" },
    { src: vino("icon-512.png"), sizes: "512x512", type: "image/png" },
  ],
};

export function brandArt(id: Brand): BrandArt {
  return id === "cardon" ? CARDON_ART : VINO_ART;
}

