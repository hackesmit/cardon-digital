/**
 * The brand switch (bead hq-3f6ut.1, Daniel 2026-11-03): one codebase builds
 * either cardondigital.com or the wine-software brand's own site, chosen at
 * build time by NEXT_PUBLIC_SITE. docs/BRANDS.md says how it works and how to
 * give a brand a route.
 *
 * Every string that names a brand (name, short name, domain, email) is read
 * from here, never typed in copy. The wine brand's name is not chosen yet:
 * "Cosecha" is a working placeholder, and it ships only behind noindex
 * (brandIndexable in lib/brand-env.mjs) until NEXT_PUBLIC_SITE_URL names the
 * brand's own domain.
 *
 * This module imports no dictionary and no page data, so the middleware can
 * read the route lists without pulling page copy into the edge bundle.
 */
import { brandIndexable, parseBrand, parseOrigin } from "./brand-env.mjs";
import type { Locale } from "./i18n/config";

export type Brand = "cardon" | "vino";

/** cardondigital.com, the parent brand's address on both sites. */
export const CARDON_URL = "https://cardondigital.com";

/** Where the wine brand answers before its domain exists (Vercel project
    cardon-vino). Always noindex: it ends in .vercel.app. */
export const VINO_FALLBACK_URL = "https://cardon-vino.vercel.app";

/**
 * A nav or footer entry: a locale-free path and the key of its label. The
 * labels stay in the dictionaries (components/site/navLabel.ts resolves them),
 * so this file holds no copy and the copy checker reads none of it.
 */
export type NavLabel =
  | "sitios"
  | "estilos"
  | "anuncios"
  | "software"
  | "modules"
  | "wineries"
  | "demos"
  | "pricing"
  | "work"
  | "guias"
  | "about"
  | "contact"
  | "footerWork"
  | "footerAbout"
  | "footerContact";

export type NavItem = { path: string; label: NavLabel };

export type BrandConfig = {
  id: Brand;
  /** The full name, as in the title, the manifest and the JSON-LD. */
  name: string;
  shortName: string;
  /** The endorsement shown beside the name; null for the parent brand. */
  endorsement: Record<Locale, string> | null;
  /** Absolute origin, no trailing slash. */
  siteUrl: string;
  email: string;
  /** The ground and ink the manifest and the browser bar take. */
  theme: { ground: string; ink: string };
  /** Every locale-free route the brand serves; "[slug]" matches one segment. */
  routes: readonly string[];
  nav: { services: readonly NavItem[]; after: readonly NavItem[] };
  footer: readonly NavItem[];
  /** The other brand's site, or null when it has no address yet. */
  crossLink: string | null;
  /** False means noindex on every page and file (lib/brand-env.mjs). */
  indexable: boolean;
};

/**
 * The routes cardondigital.com keeps. /software stays: it becomes custom
 * software for any business in a later bead. The wine pages it serves today
 * are not here; they are the moved routes below.
 */
const CARDON_ROUTES = [
  "/",
  "/sitios-web",
  "/anuncios",
  "/visibilidad-ia",
  "/guias",
  "/guias/[slug]",
  "/about",
  "/contacto",
  "/precios",
  "/privacy",
  "/terms",
  "/estilos",
  "/coming-soon",
  "/software",
] as const;

/** The routes the wine brand serves. Its /software is the modules page and
    its guides are the wine guides only (Guide.brand, lib/guides). */
const VINO_ROUTES = [
  "/",
  "/software",
  "/demos",
  "/demo",
  "/industries/winery",
  "/work/monte-xanic",
  "/work/enkanto",
  "/precios",
  "/contacto",
  "/about",
  "/privacy",
  "/terms",
  "/guias",
  "/guias/[slug]",
] as const;

/**
 * The wine routes that leave cardondigital.com: on the wine brand's list and
 * not on Cardon's. Once NEXT_PUBLIC_VINO_URL is set they 301 from cardon to
 * the same path on the wine domain (lib/routes.ts); until then cardon keeps
 * serving them, so nothing breaks before the domain exists.
 */
export const MOVED_ROUTES: readonly string[] = VINO_ROUTES.filter(
  (r) => !(CARDON_ROUTES as readonly string[]).includes(r),
);

/* The nav and footer of cardondigital.com, exactly as they were before the
   split (the arc of 2026-09-28; the reasons per entry are in Nav.tsx). The
   wine entries leave in bead hq-3f6ut.3, not here. */
const CARDON_NAV = {
  services: [
    { path: "/sitios-web", label: "sitios" },
    { path: "/estilos", label: "estilos" },
    { path: "/anuncios", label: "anuncios" },
    { path: "/software", label: "software" },
    { path: "/industries/winery", label: "wineries" },
  ],
  after: [
    { path: "/demos", label: "demos" },
    { path: "/precios", label: "pricing" },
    { path: "/work/monte-xanic", label: "work" },
    { path: "/about", label: "about" },
    { path: "/contacto", label: "contact" },
  ],
} satisfies BrandConfig["nav"];

const CARDON_FOOTER = [
  { path: "/sitios-web", label: "sitios" },
  { path: "/estilos", label: "estilos" },
  { path: "/anuncios", label: "anuncios" },
  { path: "/software", label: "software" },
  { path: "/industries/winery", label: "wineries" },
  { path: "/precios", label: "pricing" },
  { path: "/work/monte-xanic", label: "footerWork" },
  { path: "/guias", label: "guias" },
  { path: "/about", label: "footerAbout" },
  { path: "/contacto", label: "footerContact" },
] satisfies readonly NavItem[];

/* The wine brand sells one thing, so it has no services dropdown: the
   modules, the demos, the winery page, the price, the case, about, contact.
   The guides join the footer once a wine guide exists. */
const VINO_NAV = {
  services: [],
  after: [
    { path: "/software", label: "modules" },
    { path: "/demos", label: "demos" },
    { path: "/industries/winery", label: "wineries" },
    { path: "/precios", label: "pricing" },
    { path: "/work/monte-xanic", label: "work" },
    { path: "/about", label: "about" },
    { path: "/contacto", label: "contact" },
  ],
} satisfies BrandConfig["nav"];

const VINO_FOOTER = [
  { path: "/software", label: "modules" },
  { path: "/demos", label: "demos" },
  { path: "/industries/winery", label: "wineries" },
  { path: "/precios", label: "pricing" },
  { path: "/work/monte-xanic", label: "footerWork" },
  { path: "/about", label: "footerAbout" },
  { path: "/contacto", label: "footerContact" },
] satisfies readonly NavItem[];

/** The Tinto y Laton ground and ink (app/globals.css), shared by both. */
const THEME = { ground: "#F4EDEA", ink: "#161A1B" };

/** The environment the switch reads, as values, so a test can pass its own. */
export type BrandEnv = {
  site?: string;
  siteUrl?: string;
  vinoUrl?: string;
};

/** The environment of this build. Each variable is written out literally so
    Next inlines it in the browser bundle too. */
export function buildEnv(): BrandEnv {
  return {
    site: process.env.NEXT_PUBLIC_SITE,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    vinoUrl: process.env.NEXT_PUBLIC_VINO_URL,
  };
}

/** The brand of a build. Unset is cardon; an unknown value throws. */
export function brandOf(env: BrandEnv): Brand {
  return parseBrand(env.site);
}

export function brandConfig(env: BrandEnv): BrandConfig {
  const id = brandOf(env);
  const vinoOrigin = parseOrigin(env.vinoUrl);
  if (id === "cardon") {
    /* Once the wine domain is set the moved routes redirect away, so the nav
       and footer stop linking them rather than sending a reader through a
       301. Unset, both lists are exactly as they were. */
    const here = (l: NavItem) => vinoOrigin === "" || !MOVED_ROUTES.includes(l.path);
    return {
      id,
      name: "Cardon Digital",
      shortName: "Cardon",
      endorsement: null,
      siteUrl: CARDON_URL,
      email: "daniel@cardondigital.com",
      theme: THEME,
      routes: CARDON_ROUTES,
      nav: { services: CARDON_NAV.services.filter(here), after: CARDON_NAV.after.filter(here) },
      footer: CARDON_FOOTER.filter(here),
      crossLink: vinoOrigin === "" ? null : vinoOrigin,
      indexable: true,
    };
  }
  const siteOrigin = parseOrigin(env.siteUrl);
  return {
    id,
    // Working placeholder name; see the note at the top of this file.
    name: "Cosecha",
    shortName: "Cosecha",
    endorsement: { es: "por Cardon", en: "by Cardon" },
    siteUrl: siteOrigin === "" ? VINO_FALLBACK_URL : siteOrigin,
    // The brand has no mailbox of its own until its domain exists.
    email: "daniel@cardondigital.com",
    theme: THEME,
    routes: VINO_ROUTES,
    nav: VINO_NAV,
    footer: VINO_FOOTER,
    crossLink: CARDON_URL,
    indexable: brandIndexable(id, siteOrigin),
  };
}

/** This build's brand. */
export function currentBrand(): Brand {
  return brandOf(buildEnv());
}

/** This build's brand configuration, read once. An unknown NEXT_PUBLIC_SITE
    throws here, at module load, so every page fails to build with it. */
export const BRAND: BrandConfig = brandConfig(buildEnv());

/** A path with its trailing slash taken off, the root left alone. */
export function cleanPath(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/** True when a route pattern matches a locale-free path. "[x]" is one segment. */
export function matchesRoute(pattern: string, path: string): boolean {
  const want = pattern.split("/");
  const got = path.split("/");
  if (want.length !== got.length) return false;
  return want.every((seg, i) => (/^\[[^\]]+\]$/.test(seg) ? got[i] !== "" : seg === got[i]));
}

/**
 * The routes a brand answers with a page. Cardon adds the moved wine routes
 * for as long as the wine domain is unset, so they keep serving there.
 */
export function servedRoutes(config: BrandConfig): readonly string[] {
  if (config.id === "cardon" && config.crossLink === null) {
    return [...config.routes, ...MOVED_ROUTES];
  }
  return config.routes;
}

/** Whether the brand serves a locale-free path with a page. */
export function servesPath(config: BrandConfig, path: string): boolean {
  const p = cleanPath(path);
  return servedRoutes(config).some((r) => matchesRoute(r, p));
}

