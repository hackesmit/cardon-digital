import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sitemap from "./sitemap";
import { locales, stripLocale } from "@/lib/i18n/config";
import { RETIRED_ROUTES, retiredPaths, retiredRoute } from "@/lib/routes";
import { ALL_GUIDES, GUIDES, guidePath } from "@/lib/guides";
import { NextRequest } from "next/server";
import {
  MOVED_ROUTES,
  brandConfig,
  matchesRoute,
  servedRoutes,
  type BrandConfig,
  type BrandEnv,
} from "@/lib/brand";

// This file tests cardondigital.com. The brand is pinned before any import
// reads it (lib/brand.ts), so the suite says the same under NEXT_PUBLIC_SITE=vino;
// the wine brand's own cases are in lib/brand.test.ts.
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SITE = "cardon";
  process.env.NEXT_PUBLIC_VINO_URL = "";
});

/**
 * Nothing on this site links to a page it no longer has (bead hq-4pu0q.8).
 *
 * The routes are read off disk rather than listed here, because a list beside
 * the thing it describes goes stale the day someone adds a page and not the
 * entry. Three properties hold together:
 *
 *   1. A retired path has no page and its target does.
 *   2. Every internal link in app and components points at a page that exists.
 *   3. The sitemap advertises pages, never redirects.
 *
 * The scan reads source as text, so its blind spot is a link built at runtime.
 * That is closed by refusing to pass: an href() call whose argument is not a
 * string literal fails unless DYNAMIC_HREFS says which constant it reads, and
 * the constant itself is then read and checked. A new dynamic link cannot go
 * unnoticed, it can only be declared.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROUTE_ROOT = join(ROOT, "app", "[locale]");

/** A link target read from a registry module rather than a source array. */
type FromRegistry = { paths: () => string[] };

/** Every guide's path, from the registry the guide pages render. All brands'
    guides, because the pages behind the one template serve every brand. */
const guidePaths = () => ALL_GUIDES.map((g) => guidePath(g.slug));

/** The two brands, in the environments that change what they serve. */
const CARDON: BrandEnv = {};
const CARDON_SPLIT: BrandEnv = { vinoUrl: "https://vino.example" };
const VINO: BrandEnv = { site: "vino" };

/** Every nav and footer path of every brand (lib/brand.ts), the links that
    components/site/Nav.tsx and Footer.tsx build from l.path. */
const brandNavPaths = () =>
  [CARDON, CARDON_SPLIT, VINO].flatMap((env) => {
    const b = brandConfig(env);
    return [...b.nav.services, ...b.nav.after, ...b.footer].map((l) => l.path);
  });

/** Every href() argument that is not a string literal, and where it reads from. */
const DYNAMIC_HREFS: Record<string, { file: string; constant: string } | FromRegistry> = {
  "guidePath(guide.slug)": { paths: guidePaths },
  "CASE_ROUTES[0]": { file: "components/pages/home-cardon.tsx", constant: "CASE_ROUTES" },
  "CASE_ROUTES[i]": { file: "components/pages/home-cardon.tsx", constant: "CASE_ROUTES" },
  "SERVICE_ROUTES[i]": { file: "components/pages/home-cardon.tsx", constant: "SERVICE_ROUTES" },
  "l.path": { paths: brandNavPaths },
  route: { file: "components/pages/home/ClientLogos.tsx", constant: "CASE_ROUTES" },
  "STYLE_ROUTES[i]": {
    file: "components/pages/home/StylesPromo.tsx",
    constant: "STYLE_ROUTES",
  },
};

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/** The pages behind each dynamic segment, read from the registry its page
    builds from. A dynamic route missing here fails the scan below. */
const DYNAMIC_ROUTES: Record<string, () => string[]> = {
  "/guias/[slug]": guidePaths,
};

/** The locale-free path of every page.tsx under app/[locale], with each
    dynamic route expanded into the pages it renders. */
const pageDirs = walk(ROUTE_ROOT)
  .filter((f) => basename(f) === "page.tsx")
  .map((f) => {
    const rel = dirname(f).slice(ROUTE_ROOT.length).split(/[\\/]/).join("/");
    return rel === "" ? "/" : rel;
  });
const existingRoutes = new Set(
  pageDirs.flatMap((r) => (r.includes("[") ? (DYNAMIC_ROUTES[r]?.() ?? [r]) : [r])),
);

/** Source files that can carry a link. Tests are not a surface a visitor sees. */
const sourceFiles = [join(ROOT, "app"), join(ROOT, "components")]
  .flatMap((d) => walk(d))
  .filter((f) => f.endsWith(".tsx") && !f.includes(".test."));

type Link = { file: string; path: string; raw: string };

function linksIn(file: string): Link[] {
  const src = readFileSync(file, "utf8");
  const rel = file.slice(ROOT.length + 1);
  const found: Link[] = [];

  for (const m of Array.from(src.matchAll(/(?<![A-Za-z0-9_$])href\(([^)]*)\)/g))) {
    const arg = m[1].trim();
    const literal = /^"([^"]*)"$/.exec(arg);
    if (literal) {
      found.push({ file: rel, path: literal[1], raw: arg });
      continue;
    }
    // The regex stops at the first ")", so a call inside the argument loses
    // its own closing paren; put it back before looking the argument up.
    const key = arg.split("(").length > arg.split(")").length ? arg + ")" : arg;
    const declared = DYNAMIC_HREFS[key];
    expect(
      declared,
      `${rel}: href(${key}) is not a string literal. Add it to DYNAMIC_HREFS ` +
        `in app/routes.test.ts with the constant it reads, or this audit is ` +
        `blind to it.`,
    ).toBeDefined();
    if ("paths" in declared!) {
      for (const path of declared.paths()) found.push({ file: rel, path, raw: `${key} -> registry` });
      continue;
    }
    const source = readFileSync(join(ROOT, declared.file), "utf8");
    const array = new RegExp(
      `const ${declared.constant}\\s*(?::[^=]*)?=\\s*\\[([^\\]]*)\\]`,
    ).exec(source);
    expect(array, `${declared.file}: no const ${declared.constant} array`).not.toBeNull();
    for (const entry of Array.from(array![1].matchAll(/"([^"]*)"/g))) {
      found.push({ file: rel, path: entry[1], raw: `${arg} -> ${declared.constant}` });
    }
  }

  // A literal href attribute that is a site path rather than an anchor, a
  // mailto or an outside address.
  for (const m of Array.from(src.matchAll(/href="(\/[^"]*)"/g))) {
    found.push({ file: rel, path: m[1], raw: `href="${m[1]}"` });
  }

  return found;
}

/** Links a guide's own data carries (its service block), which the page
    builds with localePath() out of the scan's sight. */
const guideLinks: Link[] = GUIDES.flatMap((g) =>
  Object.values(g.copy).flatMap((c) =>
    c.sections.flatMap((s) =>
      s.blocks.flatMap((b) =>
        b.kind === "service" ? [{ file: `lib/guides/${g.slug}.ts`, path: b.path, raw: b.path }] : [],
      ),
    ),
  ),
);

const links = [...sourceFiles.flatMap(linksIn), ...guideLinks];

/** A link target, with any fragment taken off, as a locale-free route. */
function routeOf(path: string): string {
  const withoutHash = path.split("#")[0];
  return withoutHash === "" ? "/" : withoutHash;
}

describe("retired routes", () => {
  it("names at least the modules page", () => {
    expect(retiredPaths).toContain("/modulos");
    expect(RETIRED_ROUTES["/modulos"]).toEqual({ to: "/precios", status: 308 });
  });

  it.each(retiredPaths)("%s has no page left under app/[locale]", (path) => {
    expect(existingRoutes.has(path)).toBe(false);
  });

  it.each(retiredPaths)("%s lands on a page that exists", (path) => {
    expect(existingRoutes.has(RETIRED_ROUTES[path].to)).toBe(true);
  });
});

describe("dynamic routes", () => {
  it("expands every dynamic segment into the pages it renders", () => {
    for (const r of pageDirs.filter((d) => d.includes("["))) {
      expect(DYNAMIC_ROUTES[r], `${r}: add it to DYNAMIC_ROUTES`).toBeDefined();
      expect(DYNAMIC_ROUTES[r]().length, r).toBeGreaterThan(0);
    }
    expect(existingRoutes.has("/guias/aparecer-en-chatgpt")).toBe(true);
  });

  it("lists every guide in the sitemap", () => {
    const listed = new Set(sitemap().map((e) => stripLocale(new URL(e.url).pathname)));
    for (const path of guidePaths()) expect(listed.has(path), path).toBe(true);
  });
});

describe("internal links", () => {
  it("finds the links it is meant to be auditing", () => {
    // A scan that matched nothing would pass every case below in silence.
    expect(links.length).toBeGreaterThan(20);
    expect(new Set(links.map((l) => l.file)).size).toBeGreaterThan(5);
  });

  it("points at no retired page", () => {
    const dead = links.filter((l) => retiredRoute(routeOf(l.path)));
    expect(
      dead.map((l) => `${l.file}: ${l.raw}`),
      "these links go to a page the site no longer has",
    ).toEqual([]);
  });

  it("points at nothing that was never a page", () => {
    const missing = links.filter((l) => !existingRoutes.has(routeOf(l.path)));
    expect(missing.map((l) => `${l.file}: ${l.raw}`)).toEqual([]);
  });
});

describe("sitemap", () => {
  const entries = sitemap();

  it("lists every locale of every page it carries", () => {
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.length % locales.length).toBe(0);
  });

  it("advertises pages and never a redirect", () => {
    for (const entry of entries) {
      const path = stripLocale(new URL(entry.url).pathname);
      expect(retiredRoute(path), `${entry.url} is a retired path`).toBeUndefined();
      expect(existingRoutes.has(path), `${entry.url} has no page`).toBe(true);
    }
  });
});

/**
 * The brand switch (bead hq-3f6ut.1, lib/brand.ts). One tree of pages serves
 * two sites, so each brand's list is checked against the tree, and the
 * middleware is run per brand over every route the tree has: a route the
 * brand lists is passed through to its page, any other answers 404, and
 * cardon moves the wine routes to the wine domain only once it is set.
 */
describe("brand routes", () => {
  const brands: Array<[string, BrandEnv]> = [
    ["cardon", CARDON],
    ["cardon with the wine domain set", CARDON_SPLIT],
    ["vino", VINO],
  ];

  /** Every page in the tree, dynamic segments expanded, as locale-free paths. */
  const tree = Array.from(existingRoutes);

  it("gives every page in the tree to at least one brand", () => {
    const listed = [...brandConfig(CARDON).routes, ...brandConfig(VINO).routes];
    const orphans = pageDirs.filter((d) => !listed.includes(d));
    expect(orphans, "a page no brand serves").toEqual([]);
  });

  it.each(brands)("%s lists only routes that have a page", (_, env) => {
    for (const r of servedRoutes(brandConfig(env))) {
      expect(pageDirs, r).toContain(r);
    }
  });

  it.each(brands)("%s links its nav and footer only to routes it serves", (_, env) => {
    const b = brandConfig(env);
    const served = servedRoutes(b);
    for (const l of [...b.nav.services, ...b.nav.after, ...b.footer]) {
      expect(served.some((r) => matchesRoute(r, l.path)), l.path).toBe(true);
    }
  });

  it("keeps cardon's routes as they were until the wine domain is set", () => {
    // Every page the tree had before the split, on cardon, unset domain.
    const before = servedRoutes(brandConfig(CARDON));
    for (const d of pageDirs) expect(before, d).toContain(d);
    expect(brandConfig(CARDON).crossLink).toBeNull();
  });

  it("moves exactly the wine routes off cardon once the domain is set", () => {
    expect([...MOVED_ROUTES].sort()).toEqual(
      ["/demo", "/demos", "/industries/winery", "/work/enkanto", "/work/monte-xanic"].sort(),
    );
    const split = servedRoutes(brandConfig(CARDON_SPLIT));
    for (const r of MOVED_ROUTES) expect(split).not.toContain(r);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  /** The middleware as a build with this environment would run it. */
  async function middlewareFor(env: BrandEnv) {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SITE", env.site ?? "");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", env.siteUrl ?? "");
    vi.stubEnv("NEXT_PUBLIC_VINO_URL", env.vinoUrl ?? "");
    vi.stubEnv("COMING_SOON", "");
    const mod = await import("../middleware");
    const brand = await import("@/lib/brand");
    return { middleware: mod.middleware, NOT_FOUND: mod.BRAND_NOT_FOUND, BRAND: brand.BRAND };
  }

  type Outcome = { kind: "page" } | { kind: "404" } | { kind: "redirect"; status: number; to: string };

  async function outcome(
    mw: (req: NextRequest) => Promise<Response>,
    notFoundPath: string,
    path: string,
  ): Promise<Outcome> {
    const res = await mw(new NextRequest("https://site.example" + path + "?utm_source=x"));
    const rewrite = res.headers.get("x-middleware-rewrite");
    if (rewrite) {
      expect(new URL(rewrite).pathname.endsWith(notFoundPath), rewrite).toBe(true);
      return { kind: "404" };
    }
    if (res.headers.get("x-middleware-next")) return { kind: "page" };
    return { kind: "redirect", status: res.status, to: res.headers.get("location") ?? "" };
  }

  it.each(brands)(
    "%s passes every route it serves to its page and answers 404 for the rest",
    async (_, env) => {
      const { middleware, NOT_FOUND, BRAND } = await middlewareFor(env);
      const config: BrandConfig = brandConfig(env);
      expect(BRAND.id).toBe(config.id);
      const served = servedRoutes(config);
      const moved = config.id === "cardon" && config.crossLink !== null;
      for (const locale of locales) {
        for (const path of tree) {
          const got = await outcome(middleware, NOT_FOUND, "/" + locale + (path === "/" ? "" : path));
          const want = served.some((r) => matchesRoute(r, path))
            ? "page"
            : moved && MOVED_ROUTES.some((r) => matchesRoute(r, path))
              ? "redirect"
              : "404";
          expect(got.kind, `${config.id} /${locale}${path}`).toBe(want);
        }
      }
    },
  );

  it("redirects cardon's wine routes with a 301 to the same page on the wine domain", async () => {
    const { middleware, NOT_FOUND } = await middlewareFor(CARDON_SPLIT);
    for (const path of ["/es/demos", "/en/work/monte-xanic", "/es/industries/winery/"]) {
      const got = await outcome(middleware, NOT_FOUND, path);
      const clean = path.replace(/\/$/, "");
      expect(got, path).toEqual({
        kind: "redirect",
        status: 301,
        to: "https://vino.example" + clean + "?utm_source=x",
      });
    }
    // No locale: one hop, straight to the visitor's language on the wine domain.
    expect(await outcome(middleware, NOT_FOUND, "/demos")).toEqual({
      kind: "redirect",
      status: 301,
      to: "https://vino.example/es/demos?utm_source=x",
    });
  });

  it("keeps cardon's wine routes on cardon while the wine domain is unset", async () => {
    const { middleware, NOT_FOUND } = await middlewareFor(CARDON);
    for (const r of MOVED_ROUTES) {
      expect(await outcome(middleware, NOT_FOUND, "/es" + r), r).toEqual({ kind: "page" });
    }
  });

  it("answers 404 on vino for a cardon-only route and never redirects it", async () => {
    const { middleware, NOT_FOUND } = await middlewareFor({ ...VINO, vinoUrl: "https://vino.example" });
    for (const path of ["/es/sitios-web", "/en/anuncios", "/es/visibilidad-ia", "/es/estilos"]) {
      expect(await outcome(middleware, NOT_FOUND, path), path).toEqual({ kind: "404" });
    }
  });

  it("serves the cardon guides on cardon only", () => {
    expect(GUIDES.length).toBeGreaterThan(0);
    expect(GUIDES.every((g) => (g.brand ?? "cardon") === "cardon")).toBe(true);
  });
});
