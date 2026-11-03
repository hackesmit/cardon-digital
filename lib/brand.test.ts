import { afterEach, describe, expect, it, vi } from "vitest";
import { brandIndexable, parseBrand, parseOrigin } from "./brand-env.mjs";
import { CARDON_URL, VINO_FALLBACK_URL, brandConfig, servesPath } from "./brand";

/**
 * The brand switch (bead hq-3f6ut.1). The fail-closed rules each have a case
 * here: NEXT_PUBLIC_SITE missing means cardon, an unknown value fails the
 * build, and the wine brand with no domain of its own is noindex everywhere.
 * The per-brand files (robots, sitemap, llms.txt, manifest, security.txt,
 * JSON-LD, page metadata) are loaded fresh under each brand's environment,
 * the way a build with that environment would evaluate them.
 */

// The locale layout mounts the site chrome, whose fonts are next/font calls
// that only Next's compiler can run.
vi.mock("@/lib/fonts", () => ({ fontVariables: "" }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

/** Fresh modules under one build environment. */
async function under(env: { site?: string; siteUrl?: string; vinoUrl?: string }) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE", env.site ?? "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", env.siteUrl ?? "");
  vi.stubEnv("NEXT_PUBLIC_VINO_URL", env.vinoUrl ?? "");
  vi.stubEnv("COMING_SOON", "");
  vi.stubEnv("VERCEL_ENV", "");
}

describe("NEXT_PUBLIC_SITE", () => {
  it("means cardon when it is missing or empty", () => {
    expect(parseBrand(undefined)).toBe("cardon");
    expect(parseBrand("")).toBe("cardon");
    expect(parseBrand("  ")).toBe("cardon");
    expect(brandConfig({}).id).toBe("cardon");
  });

  it("accepts the two brands", () => {
    expect(parseBrand("cardon")).toBe("cardon");
    expect(parseBrand("vino")).toBe("vino");
  });

  it("throws on any other value, which fails the build", async () => {
    for (const bad of ["Vino", "wine", "cardon-digital", "1"]) {
      expect(() => parseBrand(bad), bad).toThrow(/NEXT_PUBLIC_SITE/);
    }
    // The module every page imports throws at load, so no page builds...
    await under({ site: "wine" });
    await expect(import("./brand")).rejects.toThrow(/NEXT_PUBLIC_SITE/);
    // ...and next.config.mjs throws before the build compiles anything.
    vi.resetModules();
    await expect(import("../next.config.mjs")).rejects.toThrow(/NEXT_PUBLIC_SITE/);
  });
});

describe("indexing", () => {
  it("always lets cardondigital.com be indexed", () => {
    expect(brandIndexable("cardon", "")).toBe(true);
    expect(brandConfig({}).indexable).toBe(true);
  });

  it("keeps the wine brand noindex with no site URL, a vercel.app one or a bad one", () => {
    for (const siteUrl of [undefined, "", "https://cardon-vino.vercel.app", "http://vino.mx", "vino.mx", "https://vino.mx/es"]) {
      const b = brandConfig({ site: "vino", siteUrl });
      expect(b.indexable, String(siteUrl)).toBe(false);
    }
    expect(brandConfig({ site: "vino" }).siteUrl).toBe(VINO_FALLBACK_URL);
  });

  it("lets the wine brand be indexed on its own https domain", () => {
    const b = brandConfig({ site: "vino", siteUrl: "https://vino.example/" });
    expect(b.indexable).toBe(true);
    expect(b.siteUrl).toBe("https://vino.example");
  });

  it("reads origins strictly", () => {
    expect(parseOrigin("https://a.example")).toBe("https://a.example");
    expect(parseOrigin("https://a.example/")).toBe("https://a.example");
    expect(parseOrigin("https://a.example/x")).toBe("");
    expect(parseOrigin("http://a.example")).toBe("");
    expect(parseOrigin("not a url")).toBe("");
  });

  it("sends noindex on every response of an unindexable wine build", async () => {
    await under({ site: "vino" });
    const config = (await import("../next.config.mjs")).default;
    const [rule] = await config.headers!();
    expect(rule.source).toBe("/:path*");
    expect(rule.headers).toContainEqual({ key: "X-Robots-Tag", value: "noindex, nofollow" });
  });

  it("sends no noindex header on cardon production", async () => {
    await under({});
    const config = (await import("../next.config.mjs")).default;
    const [rule] = await config.headers!();
    expect(rule.headers.some((h: { key: string }) => h.key === "X-Robots-Tag")).toBe(false);
  });
});

describe("brand config", () => {
  it("names each brand and its endorsement", () => {
    const cardon = brandConfig({});
    expect(cardon.name).toBe("Cardon Digital");
    expect(cardon.endorsement).toBeNull();
    expect(cardon.siteUrl).toBe(CARDON_URL);
    const vino = brandConfig({ site: "vino" });
    expect(vino.endorsement).toEqual({ es: "por Cardon", en: "by Cardon" });
    expect(vino.crossLink).toBe(CARDON_URL);
  });

  it("gives cardon a cross link only once the wine domain is set", () => {
    expect(brandConfig({}).crossLink).toBeNull();
    expect(brandConfig({ vinoUrl: "https://vino.example" }).crossLink).toBe("https://vino.example");
  });

  it("matches a guide slug as one segment and nothing deeper", () => {
    const b = brandConfig({});
    expect(servesPath(b, "/guias/cualquiera")).toBe(true);
    expect(servesPath(b, "/guias/a/b")).toBe(false);
    expect(servesPath(b, "/guias/")).toBe(true);
    expect(servesPath(b, "/precios/")).toBe(true);
  });
});

describe("per-brand site files", () => {
  it("cardon: robots, sitemap, manifest and security.txt as before", async () => {
    await under({});
    const robots = (await import("../app/robots")).default();
    expect(robots.sitemap).toBe("https://cardondigital.com/sitemap.xml");
    const sitemap = (await import("../app/sitemap")).default();
    expect(sitemap.length).toBeGreaterThan(0);
    expect(sitemap.every((e) => e.url.startsWith("https://cardondigital.com/"))).toBe(true);
    const manifest = (await import("../app/manifest")).default();
    expect(manifest).toMatchObject({ name: "Cardon Digital", short_name: "Cardon" });
    const { securityTxt } = await import("../app/.well-known/security.txt/security");
    expect(securityTxt()).toContain("Canonical: https://cardondigital.com/.well-known/security.txt");
  });

  it("vino on vercel.app: robots without a sitemap, an empty sitemap, llms.txt 404, noindex metadata", async () => {
    await under({ site: "vino", siteUrl: "https://cardon-vino.vercel.app" });
    const robots = (await import("../app/robots")).default();
    expect(robots.sitemap).toBeUndefined();
    expect(robots.rules).toEqual([{ userAgent: "*", allow: "/" }]);
    expect((await import("../app/sitemap")).default()).toEqual([]);
    const llms = (await import("../app/llms.txt/route")).GET();
    expect(llms.status).toBe(404);
    const { ROBOTS, SITE_URL } = await import("./i18n/metadata");
    expect(ROBOTS).toEqual({ index: false, follow: false });
    expect(SITE_URL).toBe("https://cardon-vino.vercel.app");
    const layout = await import("../app/[locale]/layout");
    const meta = await layout.generateMetadata({ params: Promise.resolve({ locale: "es" }) });
    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(String(meta.metadataBase)).toBe("https://cardon-vino.vercel.app/");
  });

  it("vino with its own domain: its own sitemap, robots, manifest, llms.txt and security.txt", async () => {
    await under({ site: "vino", siteUrl: "https://vino.example" });
    const { BRAND } = await import("./brand");
    const robots = (await import("../app/robots")).default();
    expect(robots.sitemap).toBe("https://vino.example/sitemap.xml");

    const paths = new Set(
      (await import("../app/sitemap")).default().map((e) => new URL(e.url).pathname.replace(/^\/(es|en)/, "") || "/"),
    );
    expect(paths).toContain("/");
    expect(paths).toContain("/software");
    expect(paths).toContain("/work/monte-xanic");
    for (const p of ["/sitios-web", "/anuncios", "/visibilidad-ia", "/estilos"]) expect(paths).not.toContain(p);
    // No wine guide exists yet, so neither the index nor a Cardon guide is listed.
    for (const p of Array.from(paths)) expect(p.startsWith("/guias"), p).toBe(false);

    const manifest = (await import("../app/manifest")).default();
    expect(manifest).toMatchObject({ name: BRAND.name, short_name: BRAND.shortName });

    const llms = await (await import("../app/llms.txt/route")).GET().text();
    expect(llms.startsWith("# " + BRAND.name + "\n")).toBe(true);
    expect(llms).not.toContain("/sitios-web");
    expect(llms).not.toContain("/guias");
    expect(llms).not.toContain("cardondigital.com/");
    expect(llms).toContain("https://vino.example/es/software");

    const { securityTxt } = await import("../app/.well-known/security.txt/security");
    expect(securityTxt()).toContain("Canonical: https://vino.example/.well-known/security.txt");
    expect(securityTxt()).toMatch(/^Contact: mailto:\S+@\S+$/m);
  });

  it("vino: canonical and hreflang on the wine domain", async () => {
    await under({ site: "vino", siteUrl: "https://vino.example" });
    const { pageMetadata, SITE_URL } = await import("./i18n/metadata");
    const m = pageMetadata("en", "/precios", { title: "t", description: "d" });
    expect(SITE_URL).toBe("https://vino.example");
    expect(m.alternates?.canonical).toBe("/en/precios");
    expect(m.openGraph).toMatchObject({ url: "https://vino.example/en/precios" });
  });

  it("vino: the organization is the brand, with Cardon Digital as its parent and no address", async () => {
    await under({ site: "vino", siteUrl: "https://vino.example" });
    const { siteGraph, CARDON_ORGANIZATION_ID } = await import("./seo/jsonld");
    const { BRAND } = await import("./brand");
    const graph = siteGraph("es")["@graph"];
    const org = graph[0];
    expect(org["@type"]).toEqual(["Organization", "Brand"]);
    expect(org["@id"]).toBe("https://vino.example/#organization");
    expect(org.name).toBe(BRAND.name);
    expect(org.parentOrganization).toEqual({
      "@type": "ProfessionalService",
      "@id": "https://cardondigital.com/#organization",
      name: "Cardon Digital",
      url: "https://cardondigital.com",
    });
    expect(JSON.stringify(graph)).not.toMatch(/address|telephone|streetAddress|postalCode/i);
    expect(CARDON_ORGANIZATION_ID).toBe("https://cardondigital.com/#organization");
    const founder = graph.find((n) => n["@type"] === "Person");
    expect(founder?.worksFor).toEqual({ "@id": CARDON_ORGANIZATION_ID });
  });

  it("vino: the guides registry holds only wine guides", async () => {
    await under({ site: "vino" });
    const { GUIDES, ALL_GUIDES } = await import("./guides");
    expect(ALL_GUIDES.length).toBeGreaterThan(0);
    expect(GUIDES.every((g) => g.brand === "vino")).toBe(true);
  });
});
