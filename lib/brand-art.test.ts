import { readdirSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Each brand's share card and icons (bead hq-3f6ut.8). Red-team hq-3f6ut.5
 * found the wine build serving Cardon's og.png (the CARDON DIGITAL card with
 * cardondigital.com on it) and the saguaro icons. This suite loads every place
 * that names an image URL fresh under each brand's environment and fails if a
 * wine build points at any of Cardon's art.
 */

vi.mock("@/lib/fonts", () => ({ fontVariables: "" }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function under(site: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE", site);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", site === "vino" ? "https://cardon-vino.vercel.app" : "");
  vi.stubEnv("NEXT_PUBLIC_VINO_URL", "");
  vi.stubEnv("COMING_SOON", "");
  vi.stubEnv("VERCEL_ENV", "");
}

/** Every image URL a build's pages, manifest and JSON-LD reference. */
async function imageUrls(): Promise<string[]> {
  const urls: string[] = [];
  const manifest = (await import("../app/manifest")).default();
  for (const i of manifest.icons ?? []) urls.push(i.src);

  const root = await import("../app/layout");
  const icons = root.metadata.icons as { icon: { url: string }[]; apple: { url: string }[] };
  for (const i of [...icons.icon, ...icons.apple]) urls.push(i.url);

  const layout = await import("../app/[locale]/layout");
  const { pageMetadata } = await import("./i18n/metadata");
  for (const locale of ["es", "en"] as const) {
    const metas = [
      await layout.generateMetadata({ params: Promise.resolve({ locale }) }),
      pageMetadata(locale, "/precios", { title: "t", description: "d" }),
    ];
    for (const m of metas) {
      for (const img of [m.openGraph?.images, m.twitter?.images].flat()) {
        if (img === undefined) continue;
        urls.push(typeof img === "string" ? img : String((img as { url: string | URL }).url));
      }
    }
  }

  const { organizationLd } = await import("./seo/jsonld");
  const org = organizationLd("es");
  urls.push(String(org.logo), String(org.image));
  return urls;
}

/** Cardon's art: the card, the saguaro tiles and the root icons. */
const CARDON_ART = /(^|\/\/[^/]+)\/(og\.png|icon\.svg|favicon\.ico|apple-icon\.png)$|\/brand\/cardon-/;

describe("brand art", () => {
  it("vino: every image the pages, manifest and JSON-LD name is the wine brand's own", async () => {
    await under("vino");
    const urls = await imageUrls();
    expect(urls.length).toBeGreaterThanOrEqual(12);
    for (const u of urls) {
      expect(u, u).not.toMatch(CARDON_ART);
      expect(new URL(u, "https://x.example").pathname, u).toMatch(/^\/brand-art\/[a-z0-9-]+\.png$/);
    }
  });

  it("cardon: the card and icons are unchanged", async () => {
    await under("");
    const urls = await imageUrls();
    for (const u of urls) expect(u, u).toMatch(CARDON_ART);
    const manifest = (await import("../app/manifest")).default();
    expect(manifest.icons?.map((i) => i.src)).toEqual([
      "/brand/cardon-icon-192.png",
      "/brand/cardon-icon-512.png",
    ]);
  });

  it("vino: every wine art path the build links is a file the art route draws", async () => {
    await under("vino");
    const { VINO_ART_FILES } = await import("./brand-art");
    const route = await import("../app/brand-art/[file]/route");
    const drawn = route.generateStaticParams().map((p) => "/brand-art/" + p.file);
    expect(drawn.sort()).toEqual(Object.keys(VINO_ART_FILES).map((f) => "/brand-art/" + f).sort());
    for (const u of await imageUrls()) expect(drawn, u).toContain(new URL(u, "https://x.example").pathname);
  });

  it("cardon: the wine art route serves nothing", async () => {
    await under("");
    const route = await import("../app/brand-art/[file]/route");
    expect(route.generateStaticParams()).toEqual([]);
    const res = await route.GET(new Request("https://x.example"), { params: Promise.resolve({ file: "og.png" }) });
    expect(res.status).toBe(404);
  });

  it("vino: Cardon's root art paths are rewritten to wine art; cardon rewrites none", async () => {
    await under("vino");
    const vino = (await import("../next.config.mjs")).default;
    const { beforeFiles } = (await vino.rewrites!()) as { beforeFiles: { source: string; destination: string }[] };
    expect(beforeFiles.map((r) => r.source).sort()).toEqual(
      ["/apple-icon.png", "/favicon.ico", "/icon.svg", "/og.png"],
    );
    const { VINO_ART_FILES } = await import("./brand-art");
    for (const r of beforeFiles) {
      expect(Object.keys(VINO_ART_FILES).map((f) => "/brand-art/" + f), r.source).toContain(r.destination);
    }
    await under("");
    const cardon = (await import("../next.config.mjs")).default;
    expect(((await cardon.rewrites!()) as { beforeFiles: unknown[] }).beforeFiles).toEqual([]);
  });

  it("app/ holds no icon, favicon or Open Graph file convention, which Next would link on both brands", () => {
    const appDir = path.join(__dirname, "..", "app");
    const conventions = /^(icon|apple-icon|favicon|opengraph-image|twitter-image)(\d*)\.(ico|svg|png|jpe?g|gif|tsx?|jsx?)$/;
    const found: string[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) walk(path.join(dir, e.name));
        else if (conventions.test(e.name)) found.push(path.relative(appDir, path.join(dir, e.name)));
      }
    };
    walk(appDir);
    expect(found).toEqual([]);
  });
});
