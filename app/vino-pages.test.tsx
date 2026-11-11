import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// This file tests the wine brand's build. The brand is pinned before any
// import reads it (lib/brand.ts reads NEXT_PUBLIC_SITE at module load), with
// no domain of its own yet, which is how cardon-vino builds today.
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SITE = "vino";
  process.env.NEXT_PUBLIC_SITE_URL = "";
  process.env.NEXT_PUBLIC_VINO_URL = "";
});

// The working name is also a common word ("cosecha" is harvest), so a page
// could carry it without naming the brand. A sentinel no copy can contain
// proves each page reads the name from lib/brand.ts and types none.
const SENTINEL = vi.hoisted(() => "Zentinelvo");
vi.mock("../lib/brand", async (importOriginal) => {
  const real = await importOriginal<typeof import("../lib/brand")>();
  return { ...real, BRAND: { ...real.BRAND, name: SENTINEL, shortName: SENTINEL } };
});

// The same test-only shim the other page suites use: vitest compiles this
// app's JSX with the classic runtime, so the pages resolve a global React.
// The pages are loaded with dynamic imports, after this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { BRAND, CARDON_URL, servesPath } from "../lib/brand";
import { DEMO_HOST } from "../lib/demo";
import { GUIDES } from "../lib/guides";
import { LocaleProvider } from "../lib/i18n/LocaleProvider";
import { locales, stripLocale, type Locale } from "../lib/i18n/config";
import { SITE_URL } from "../lib/i18n/metadata";
import { llmsTxt } from "./llms.txt/llms";

/**
 * Every page of the wine brand links only within the wine site (bead
 * hq-3f6ut.2, the DoD line the hq-3f6ut.1 review added): no page links a
 * route that answers 404 on vino, nothing in a page body links
 * cardondigital.com (the footer carries the one cross link, lib/brand.ts
 * crossLink), no body names the parent brand as the seller, and the copy names
 * the wine brand only through lib/brand.ts.
 *
 * The pages are rendered, not read as source, so a link built at runtime from
 * a dictionary or a helper is checked as the visitor gets it. The chrome (Nav,
 * Footer) builds its links from BRAND.nav and BRAND.footer, which
 * app/routes.test.ts holds against the brand's routes.
 */

type Props = { params: Promise<{ locale: string; slug?: string }> };
type Loaded = {
  default: (props: Props) => Promise<React.ReactElement> | React.ReactElement;
  generateMetadata?: (props: Props) => Promise<{ title?: unknown }>;
};

/** The page module behind each route the wine brand serves. */
const PAGES: Record<string, () => Promise<unknown>> = {
  "/": () => import("./[locale]/page"),
  "/software": () => import("./[locale]/software/page"),
  "/demos": () => import("./[locale]/demos/page"),
  "/demo": () => import("./[locale]/demo/page"),
  "/industries/winery": () => import("./[locale]/industries/winery/page"),
  "/work/monte-xanic": () => import("./[locale]/work/monte-xanic/page"),
  "/work/enkanto": () => import("./[locale]/work/enkanto/page"),
  "/precios": () => import("./[locale]/precios/page"),
  "/contacto": () => import("./[locale]/contacto/page"),
  "/about": () => import("./[locale]/about/page"),
  "/privacy": () => import("./[locale]/privacy/page"),
  "/terms": () => import("./[locale]/terms/page"),
  "/guias": () => import("./[locale]/guias/page"),
  "/guias/[slug]": () => import("./[locale]/guias/[slug]/page"),
};

/**
 * The shared pages another bead of this epic rewrites, with the bead that
 * owns them and the shape of what they still show the wine brand. Each entry
 * is checked to still fail, so the list empties itself: the day the owning
 * bead lands, its entry fails this suite until it is removed.
 */
const PENDING: Record<string, string> = {
  // hq-3f6ut.3 splits /precios: the web and ads packages leave vino.
  "/precios": "hq-3f6ut.3",
};

/** The wine pages this bead owns: they say the brand's name in the body. */
const MOVED = ["/", "/software", "/demos", "/industries/winery", "/work/monte-xanic", "/work/enkanto"];

/** The paths a pattern stands for: a slug pattern takes every wine guide. */
function concrete(route: string): Array<{ path: string; params: Record<string, string> }> {
  if (route === "/guias/[slug]") return GUIDES.map((g) => ({ path: "/guias/" + g.slug, params: { slug: g.slug } }));
  if (route === "/guias" && GUIDES.length === 0) return [];
  return [{ path: route, params: {} }];
}

const load = async (route: string) => (await PAGES[route]()) as Loaded;

/** A page that redirects (/demo, to the live demo host) is read as a page
    holding one link, to where it sends the visitor. */
function redirectTarget(e: unknown): string | null {
  const digest = (e as { digest?: unknown } | null)?.digest;
  if (typeof digest !== "string" || !digest.startsWith("NEXT_REDIRECT;")) return null;
  return digest.split(";")[2] ?? null;
}

async function serve(route: string, params: Record<string, string>, locale: Locale): Promise<string> {
  const mod = await load(route);
  const props = { params: Promise.resolve({ locale, ...params }) };
  let body: React.ReactElement;
  try {
    body = await mod.default(props);
  } catch (e) {
    const to = redirectTarget(e);
    if (to === null) throw e;
    return `<a href="${to}"></a>`;
  }
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    React.createElement(LocaleProvider, { locale, children: body }),
  );
}

const unescape = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'");

const hrefs = (html: string) => Array.from(html.matchAll(/\shref="([^"]*)"/g), (m) => unescape(m[1]));

/** The locale-free path of a link into this site, or null for anything else. */
function internalPath(href: string): string | null {
  let rest: string;
  if (href.startsWith(SITE_URL + "/") || href === SITE_URL) rest = href.slice(SITE_URL.length) || "/";
  else if (href.startsWith("/") && !href.startsWith("//")) rest = href;
  else return null;
  const path = rest.split(/[?#]/)[0] || "/";
  // Files (the media, og.png, a PDF) are not routes.
  if (/\.[a-z0-9]+$/i.test(path) || path.startsWith("/api/")) return null;
  return stripLocale(path);
}

/** True when a link leaves for cardondigital.com itself (apex or www). */
function toCardon(href: string): boolean {
  if (!/^https?:\/\//.test(href)) return false;
  const host = new URL(href).hostname.replace(/^www\./, "");
  return host === new URL(CARDON_URL).hostname;
}

/** The text a visitor reads: tags and scripts out, entities decoded. */
const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

describe("the wine brand's pages", () => {
  it("this suite runs on the wine build, with a page module for every route it serves", () => {
    expect(BRAND.id).toBe("vino");
    for (const route of BRAND.routes) expect(Object.keys(PAGES)).toContain(route);
  });

  for (const route of Object.keys(PAGES)) {
    for (const { path, params } of concrete(route)) {
      for (const locale of locales) {
        const label = `${locale}${path === "/" ? "" : path}`;

        it(`${label}: every internal link is a route the wine brand serves`, async () => {
          const html = await serve(route, params, locale);
          const off = hrefs(html)
            .map((h) => ({ h, p: internalPath(h) }))
            .filter((x) => x.p !== null && !servesPath(BRAND, x.p))
            .map((x) => x.h);
          if (PENDING[route]) {
            expect(off, `${route} is clean now; remove its PENDING entry (${PENDING[route]})`).not.toEqual([]);
            return;
          }
          expect(off).toEqual([]);
        });

        it(`${label}: the body links cardondigital.com nowhere`, async () => {
          const html = await serve(route, params, locale);
          expect(hrefs(html).filter(toCardon)).toEqual([]);
        });
      }
    }
  }

  for (const route of MOVED) {
    for (const locale of locales) {
      it(`${locale}${route}: names the wine brand from lib/brand.ts, never the parent as the seller`, async () => {
        const html = await serve(route, {}, locale);
        const text = visible(html);
        expect(BRAND.name).toBe(SENTINEL);
        expect(text).toContain(SENTINEL);
        // "Cardon Digital" may appear only as the endorser or a credit; the
        // full parent name as the subject of a sentence is the old page.
        expect(text).not.toMatch(/Cardon Digital (builds|desarrolla|construye|is |es )/);
      });

      it(`${locale}${route}: opens with a 40 to 60 word answer that names the brand`, async () => {
        const html = await serve(route, {}, locale);
        const after = html.slice(html.indexOf("</h1>"));
        const first = after.match(/<p[^>]*>([\s\S]*?)<\/p>/);
        expect(first?.[0] ?? "").toContain('class="hero-sub"');
        const text = visible(first![1]).trim();
        const n = text.split(/\s+/).length;
        expect(n, text).toBeGreaterThanOrEqual(40);
        expect(n, text).toBeLessThanOrEqual(60);
        expect(text).toContain(SENTINEL);
      });

      it(`${locale}${route}: sells nothing that stays on cardondigital.com`, async () => {
        const text = visible(await serve(route, {}, locale));
        // Websites, Google Ads and the AI answers check are Cardon's services.
        expect(text).not.toMatch(/google ads|anuncios en google|sitio bilingüe|bilingual site|chatgpt|perplexity/i);
      });

      it(`${locale}${route}: carries an FAQ with its FAQPage markup`, async () => {
        const html = await serve(route, {}, locale);
        const questions = html.match(/class="faq-q"/g) ?? [];
        expect(questions.length).toBeGreaterThanOrEqual(4);
        expect(questions.length).toBeLessThanOrEqual(7);
        expect(html).toContain('"@type":"FAQPage"');
      });

      it(`${locale}${route}: every image has descriptive alt text`, async () => {
        const html = await serve(route, {}, locale);
        for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
          const alt = img.match(/\salt="([^"]*)"/)?.[1];
          if (/aria-hidden="true"|role="presentation"/.test(img)) continue;
          expect(alt, img).toBeDefined();
          expect(alt!.trim().split(/\s+/).length, img).toBeGreaterThanOrEqual(3);
        }
      });

      it(`${locale}${route}: the title fits in 60 characters with the brand template`, async () => {
        const mod = await load(route);
        const meta = await mod.generateMetadata!({ params: Promise.resolve({ locale }) });
        const t = meta.title as string | { absolute?: string; default?: string };
        const full =
          typeof t === "string"
            ? t + " | " + BRAND.name
            : (t.absolute ?? t.default ?? "");
        expect(full.length, full).toBeLessThanOrEqual(60);
      });
    }
  }

  it("/demo sends the visitor to the demo host, off the site", async () => {
    for (const locale of locales) {
      const to = hrefs(await serve("/demo", {}, locale));
      expect(to).toHaveLength(1);
      expect(to[0].startsWith(DEMO_HOST + "/")).toBe(true);
    }
  });

  it("llms.txt, once the brand is indexable, lists only wine routes and the wine home", () => {
    const body = llmsTxt("all");
    const links = Array.from(body.matchAll(/\]\((https?:[^)]+)\)/g), (m) => m[1]);
    expect(links.length).toBeGreaterThan(0);
    for (const url of links) {
      expect(url.startsWith(SITE_URL + "/"), url).toBe(true);
      expect(servesPath(BRAND, stripLocale(url.slice(SITE_URL.length))), url).toBe(true);
    }
    expect(body).toContain("# " + SENTINEL);
    // No line describes Cardon's services, except a PENDING page's own meta.
    const cardonish = /sitios?[ -]web|websites?\b|anuncios|google ads|visibilidad-ia|estilos/i;
    const lines = body.split("\n");
    const isPending = (l: string) => Object.keys(PENDING).some((r) => l.includes(r + ")"));
    expect(lines.filter((l) => !isPending(l) && cardonish.test(l))).toEqual([]);
    for (const route of Object.keys(PENDING)) {
      const own = lines.filter((l) => l.includes(route + ")"));
      expect(own.some((l) => cardonish.test(l)), `${route} meta is clean now; remove its PENDING entry`).toBe(true);
    }
  });

  for (const locale of locales) {
    it(`${locale}: the home answers what, for whom and what next in its first sixty words`, async () => {
      const words = visible(await serve("/", {}, locale)).split(/\s+/).filter(Boolean);
      const first = words.slice(0, 60).join(" ").toLowerCase();
      expect(first).toContain(SENTINEL.toLowerCase());
      expect(first).toContain(BRAND.endorsement![locale].toLowerCase());
      expect(first).toMatch(locale === "es" ? /bodega/ : /winery/);
      expect(first).toMatch(locale === "es" ? /hospedaje/ : /rooms/);
      expect(first).toMatch(/restaurant/);
      expect(first).toMatch(/demo/);
      expect(first).toMatch(locale === "es" ? /diagnóstico/ : /diagnostic/);
    });
  }
});
