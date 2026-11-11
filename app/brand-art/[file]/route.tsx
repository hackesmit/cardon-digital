import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";
import { VINO_ART_FILES, type VinoArtFile } from "@/lib/brand-art";
import { site } from "@/lib/i18n/site";

/* The wine brand's share card and icons (bead hq-3f6ut.8, lib/brand-art.ts),
   drawn at build time from BRAND.name so a new name redraws them. Static, and
   only on a wine build: cardondigital.com serves none of these paths. The
   middleware matcher skips dotted paths, so the locale tree never sees them. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  if (BRAND.id !== "vino") return [];
  return (Object.keys(VINO_ART_FILES) as VinoArtFile[]).map((file) => ({ file }));
}

/* The wine palette of app/globals.css: the dark ground, the light text, the
   light-mode wine and the dark-mode gold. */
const GROUND = "#120F12";
const TEXT = "#EFE4E6";
const WINE = "#7A1F38";
const GOLD = "#D1AC55";

/** The tile: the name's initial on the wine ground, until the brand has a mark. */
function tile(size: number) {
  const initial = BRAND.name.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: WINE,
        color: TEXT,
        fontSize: Math.round(size * 0.62),
        lineHeight: 1,
      }}
    >
      {initial}
    </div>
  );
}

/** The share card: the name, the brand line and the endorsement, in Spanish,
    the x-default reader's language. */
function card() {
  const line = site.es.brandline;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: GROUND,
        color: TEXT,
        padding: "72px 80px",
        borderLeft: `24px solid ${WINE}`,
      }}
    >
      <div style={{ display: "flex", width: 120, height: 120 }}>{tile(120)}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 132, lineHeight: 1.05, letterSpacing: -2 }}>{BRAND.name}</div>
        <div style={{ fontSize: 46, color: GOLD, marginTop: 24 }}>{line}</div>
      </div>
    </div>
  );
}

export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  if (BRAND.id !== "vino" || !(file in VINO_ART_FILES)) {
    return new Response("Not found\n", { status: 404 });
  }
  const { width, height } = VINO_ART_FILES[file as VinoArtFile];
  return new ImageResponse(file === "og.png" ? card() : tile(width), { width, height });
}
