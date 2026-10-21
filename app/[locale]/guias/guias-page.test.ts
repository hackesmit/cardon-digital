import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as visibilidad-page.test.ts: vitest compiles this app's
// JSX with the classic runtime, so the pages load with a dynamic import after
// this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../../lib/i18n/LocaleProvider";
import { locales, localePath, type Locale } from "../../../lib/i18n/config";
import { SITE_URL } from "../../../lib/i18n/metadata";
import { site } from "../../../lib/i18n/site";
import { guias } from "../../../lib/i18n/guias";
import { BASELINE } from "../../../lib/i18n/visibilidad-ia";
import { CREDENTIALS } from "../../../lib/credentials";
import { GUIDES, guidePath } from "../../../lib/guides";
import { FOUNDER_ID } from "../../../lib/seo/jsonld";
import { currencyByLocale, formatPrice, webCareMonthly, webPackages } from "../../../lib/pricing";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Guards for /guias and every guide (bead hq-i4b5.11, AEO spec in
 * bunkers/cardon-digital/research/2026-10/aeo/SPEC.md, page standard in
 * content-checklist.txt), held against what the pages SERVE:
 *  - answer first: a 40 to 60 word lede right after the H1, the same words
 *    the Article markup uses for its description;
 *  - question headings, each section opening with a paragraph;
 *  - Daniel Hack's byline with visible publish and update dates that are the
 *    Article's dates, his bio linking /about and the certificate;
 *  - sources linked, an FAQ marked up exactly as shown, a BreadcrumbList that
 *    is the trail on screen;
 *  - one link to a service, AEO named once if at all, no promise;
 *  - no typed price: a figure that reads as money is one lib/pricing.ts
 *    computes, and the guide's own file holds no price literal (bead
 *    hq-i4b5.12, the first guide that prints our prices).
 * Every guide in lib/guides runs through the same checks.
 */

/** Every money figure a guide may print in a locale: the published website
    prices, formatted by lib/pricing.ts the way every page prints them. */
function publishedPrices(locale: Locale): Set<string> {
  const c = currencyByLocale[locale];
  return new Set(
    [...webPackages.map((p) => p.from[c]), webCareMonthly()[c]].map((n) => formatPrice(locale, n)),
  );
}

const MONEY = /\$\s?\d[\d,.]*(?:\s?(?:MXN|USD))?|\d[\d,.]*\s?(?:MXN|USD|pesos|d[oó]lares|dollars)/gi;

async function serveGuide(locale: Locale, slug: string): Promise<string> {
  const Page = (await import("./[slug]/page")).default;
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    React.createElement(LocaleProvider, {
      locale,
      children: React.createElement(Page, { params: { locale, slug } }),
    }),
  );
}

async function serveIndex(locale: Locale): Promise<string> {
  const Page = (await import("./page")).default;
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    React.createElement(LocaleProvider, {
      locale,
      children: React.createElement(Page, { params: { locale } }),
    }),
  );
}

const decode = (s: string) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const text = (inner: string) =>
  decode(inner.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .replace(/\s+([.,:;?!])/g, "$1")
    .trim();

function all(re: RegExp, html: string): string[] {
  return Array.from(html.matchAll(re)).map((m) => m[1]);
}

type Node = { "@type": string; [k: string]: unknown };
function ldNodes(html: string): Node[] {
  return all(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, html).flatMap(
    (raw) => (JSON.parse(raw) as { "@graph": Node[] })["@graph"],
  );
}

const visible = (html: string) => text(html.replace(/<script[\s\S]*?<\/script>/g, ""));

/** The html of the element that opens with `open`, up to its closing tag. */
function block(html: string, open: RegExp, tag: string): string {
  const m = open.exec(html);
  if (!m) return "";
  let depth = 0;
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "g");
  re.lastIndex = m.index;
  for (let t = re.exec(html); t !== null; t = re.exec(html)) {
    depth += t[1] ? -1 : 1;
    if (depth === 0) return html.slice(m.index, t.index + t[0].length);
  }
  return "";
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const url = (locale: Locale, path: string) => SITE_URL + localePath(locale, path);
const DAY = 24 * 60 * 60 * 1000;
const days = (from: string, to: string) => (Date.parse(to) - Date.parse(from)) / DAY;

const cases = locales.flatMap((locale) => GUIDES.map((g) => [locale, g.slug] as const));

describe("the guide registry", () => {
  it("holds at least the first guide, each slug once", () => {
    const slugs = GUIDES.map((g) => g.slug);
    expect(slugs).toContain("aparecer-en-chatgpt");
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("types no price in any guide file: every figure is read from lib/pricing.ts", () => {
    for (const g of GUIDES) {
      const src = readFileSync(join(process.cwd(), "lib/guides", g.slug + ".ts"), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      // The whole source, not only its string literals: a price in single
      // quotes, a template part or a number beside its currency all count.
      expect(src, g.slug).not.toMatch(/\$\s?\d|\d[\d,.]*\s?(?:MXN|USD|pesos|d[oó]lares|dollars)\b/i);
    }
  });

  it("dates every guide honestly and schedules its next review within a quarter", () => {
    for (const g of GUIDES) {
      for (const d of [g.datePublished, g.dateModified, g.reviewBy]) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(g.dateModified >= g.datePublished, g.slug).toBe(true);
      expect(days(g.dateModified, g.reviewBy), g.slug).toBeGreaterThan(0);
      expect(days(g.dateModified, g.reviewBy), g.slug).toBeLessThanOrEqual(92);
    }
  });

  it("builds one static page per guide and locale", async () => {
    const { generateStaticParams } = await import("./[slug]/page");
    expect(generateStaticParams()).toEqual(
      locales.flatMap((locale) => GUIDES.map((g) => ({ locale, slug: g.slug }))),
    );
  });
});

describe.each(cases)("guide served in %s: %s", (locale, slug) => {
  const guide = GUIDES.find((g) => g.slug === slug)!;
  const g = guide.copy[locale];
  const here = url(locale, guidePath(slug));

  it("keeps the title tag under 60 characters and the description short", () => {
    const full = site[locale].meta.titleTemplate.replace("%s", g.meta.title);
    expect(full.length, full).toBeLessThan(60);
    expect(g.meta.description.length, g.meta.description).toBeLessThanOrEqual(200);
  });

  it("opens with a self-contained 40 to 60 word answer, the first copy after the H1", async () => {
    const html = await serveGuide(locale, slug);
    expect(all(/<h1[^>]*>([\s\S]*?)<\/h1>/g, html).map(text)).toEqual([g.title]);
    const lede = all(/<p class="guide-lede">([\s\S]*?)<\/p>/g, html).map(text);
    expect(lede).toHaveLength(1);
    expect(words(lede[0]), lede[0]).toBeGreaterThanOrEqual(40);
    expect(words(lede[0]), lede[0]).toBeLessThanOrEqual(60);
    const firstP = html.indexOf("<p", html.indexOf("</h1>"));
    expect(html.slice(firstP, firstP + 30)).toContain('class="guide-lede"');
  });

  it("heads every section with a question and opens it with a paragraph", async () => {
    const html = await serveGuide(locale, slug);
    const sections = all(/(<section class="guide-section"[\s\S]*?<\/section>)/g, html);
    expect(sections.length).toBe(g.sections.length);
    expect(sections.length).toBeGreaterThanOrEqual(5);
    for (const s of sections) {
      const h2 = text(all(/<h2[^>]*>([\s\S]*?)<\/h2>/g, s)[0] ?? "");
      expect(h2.endsWith("?"), h2).toBe(true);
      expect(s.slice(s.indexOf("</h2>") + 5).trimStart().startsWith("<p>"), h2).toBe(true);
    }
    for (const s of g.sections) expect(s.blocks[0].kind, s.id).toBe("p");
  });

  it("labels every list and table", async () => {
    const html = await serveGuide(locale, slug);
    for (const l of all(/(<div class="guide-list">[\s\S]*?<\/div>)/g, html)) {
      expect(text(all(/<h3>([\s\S]*?)<\/h3>/g, l)[0] ?? ""), l.slice(0, 80)).not.toBe("");
    }
    for (const t of all(/(<table[\s\S]*?<\/table>)/g, html)) {
      expect(text(all(/<caption>([\s\S]*?)<\/caption>/g, t)[0] ?? "")).not.toBe("");
      expect(t).toContain('scope="col"');
      expect(t).toContain('scope="row"');
    }
  });

  it("carries Article markup by Daniel Hack with the dates the page prints", async () => {
    const html = await serveGuide(locale, slug);
    const articles = ldNodes(html).filter((n) => n["@type"] === "Article");
    expect(articles).toHaveLength(1);
    const a = articles[0];
    expect(a.headline).toBe(g.title);
    expect(a.description).toBe(text(all(/<p class="guide-lede">([\s\S]*?)<\/p>/g, html)[0]));
    expect(a.url).toBe(here);
    expect(a.mainEntityOfPage).toBe(here);
    expect(a.datePublished).toBe(guide.datePublished);
    expect(a.dateModified).toBe(guide.dateModified);
    expect(a.author).toMatchObject({ "@id": FOUNDER_ID, name: "Daniel Hack", url: url(locale, "/about") });
    const byline = block(html, /<div class="guide-byline"/, "div");
    expect(text(byline)).toContain("Daniel Hack");
    expect(byline).toContain(`href="${localePath(locale, "/about")}"`);
    expect(all(/<time dateTime="([^"]+)"/gi, byline)).toEqual([guide.datePublished, guide.dateModified]);
  });

  it("carries a BreadcrumbList that is the trail the page shows", async () => {
    const html = await serveGuide(locale, slug);
    const crumbs = ldNodes(html).filter((n) => n["@type"] === "BreadcrumbList");
    expect(crumbs).toHaveLength(1);
    const items = crumbs[0].itemListElement as { position: number; name: string; item: string }[];
    expect(items.map((i) => i.item)).toEqual([url(locale, "/"), url(locale, "/guias"), here]);
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    const trail = block(html, /<nav class="crumbs"/, "nav");
    expect(all(/<li[^>]*>([\s\S]*?)<\/li>/g, trail).map(text)).toEqual(items.map((i) => i.name));
    expect(trail).toContain('aria-current="page"');
  });

  it("marks up exactly the FAQ it shows, different questions from the headings", async () => {
    const html = await serveGuide(locale, slug);
    const shown = all(/<h3 class="faq-q">([\s\S]*?)<\/h3>/g, html).map(text);
    const answers = all(/<p class="faq-a">([\s\S]*?)<\/p>/g, html).map(text);
    const faq = ldNodes(html).filter((n) => n["@type"] === "FAQPage");
    expect(faq).toHaveLength(1);
    const entities = faq[0].mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(entities.map((q) => q.name)).toEqual(shown);
    expect(entities.map((q) => q.acceptedAnswer.text)).toEqual(answers);
    expect(shown.length).toBeGreaterThanOrEqual(4);
    expect(shown.length).toBeLessThanOrEqual(7);
    expect(new Set(shown).size).toBe(shown.length);
    const headings = new Set(g.sections.map((s) => s.h));
    for (const q of shown) {
      expect(q.endsWith("?"), q).toBe(true);
      expect(headings.has(q), q).toBe(false);
    }
  });

  it("links every source it lists, in a new tab, on https", async () => {
    const html = await serveGuide(locale, slug);
    const sources = block(html, /<section class="guide-sources"/, "section");
    const hrefs = all(/<a href="([^"]+)"/g, sources);
    expect(hrefs).toEqual(g.sources.map((s) => s.url));
    expect(hrefs.length).toBeGreaterThanOrEqual(1);
    for (const h of hrefs) expect(h).toMatch(/^https:\/\//);
    expect(sources.match(/target="_blank" rel="noopener noreferrer"/g)?.length).toBe(hrefs.length);
  });

  it("shows the author's bio with /about, the certificate and a described badge", async () => {
    const html = await serveGuide(locale, slug);
    const bio = block(html, /<aside class="guide-bio"/, "aside");
    expect(text(bio)).toContain(guias[locale].article.bio);
    expect(bio).toContain(`href="${localePath(locale, "/about")}"`);
    for (const c of CREDENTIALS) {
      expect(bio).toContain(`href="${c.verifyUrl}"`);
      expect(bio).toContain(`alt="${c.alt[locale]}"`);
    }
  });

  it("links once, naturally, to a Cardon service", async () => {
    const html = await serveGuide(locale, slug);
    const declared = g.sections.flatMap((s) => s.blocks).filter((b) => b.kind === "service");
    expect(declared).toHaveLength(1);
    const service = all(/(<p class="guide-service">[\s\S]*?<\/p>)/g, html);
    expect(service).toHaveLength(1);
    const path = (declared[0] as { path: string }).path;
    expect(path.startsWith("/")).toBe(true);
    expect(service[0]).toContain(`href="${localePath(locale, path)}"`);
  });

  it("names AEO in one section only, with its definition there", async () => {
    const html = await serveGuide(locale, slug);
    const naming = g.sections.filter((s) => JSON.stringify(s.blocks).match(/\bAEO\b/));
    expect(naming.length, "sections naming AEO").toBeLessThanOrEqual(1);
    if (naming.length === 0) {
      const bio = block(html, /<aside class="guide-bio"/, "aside");
      expect(visible(html.replace(bio, "")).match(/\bAEO\b/g) ?? []).toEqual([]);
      return;
    }
    const defined = block(html, new RegExp(`<section class="guide-section" id="${naming[0].id}"`), "section");
    expect(defined).not.toBe("");
    // The bio carries the certificate's own name; it is a name, not a use.
    const bio = block(html, /<aside class="guide-bio"/, "aside");
    const rest = visible(html.replace(defined, "").replace(bio, ""));
    expect(rest.match(/\bAEO\b/g) ?? [], rest).toEqual([]);
    const sentence = visible(defined).split(/(?<=\.)\s/).find((x) => /\bAEO\b/.test(x)) ?? "";
    expect(sentence).toMatch(/optimizaci[oó]n para motores de respuesta|answer engine optimization/i);
  });

  it("leaves no placeholder unfilled", async () => {
    expect(await serveGuide(locale, slug)).not.toMatch(/\{\w+\}/);
  });

  it.skipIf(!JSON.stringify(g).includes("{mentioned}"))("states our own baseline, filled from the one place it lives", async () => {
    const html = await serveGuide(locale, slug);
    const page = visible(html);
    const of = locale === "es" ? "de" : "of";
    expect(page).toContain(`${BASELINE.mentioned} ${of} ${BASELINE.answers}`);
    expect(page).toContain(`${BASELINE.unbrandedMentioned} ${of} ${BASELINE.unbranded}`);
  });

  it("promises no appearance, prints only computed prices, and has no em dash or factura language", async () => {
    const page = visible(await serveGuide(locale, slug));
    expect(page).not.toMatch(
      /garantizamos|le garantiza|garantizado|we guarantee|guaranteed|primer lugar en|rank (first|#1|number one)|top of google|vas a aparecer|va a aparecer|aparecer[áa] en|will (show up|appear)|you'll (show up|appear)/i,
    );
    const allowed = publishedPrices(locale);
    for (const m of page.match(MONEY) ?? []) expect(allowed.has(m.trim()), `${m} is not a lib/pricing.ts figure`).toBe(true);
    expect(page).not.toContain("—");
    expect(page).not.toMatch(/factura|\bIVA\b|\bVAT\b/i);
  });
});

describe.each(locales)("the website cost guide in %s (bead hq-i4b5.12)", (locale) => {
  it("prints every package's published price and the care fee, as lib/pricing.ts computes them", async () => {
    const page = visible(await serveGuide(locale, "cuanto-cuesta-pagina-web"));
    const c = currencyByLocale[locale];
    for (const p of webPackages) {
      expect(page, p.id).toContain(formatPrice(locale, p.from[c]));
      expect(page, p.id).toContain(`${p.deliveryDays.min}`);
    }
    expect(page).toContain(formatPrice(locale, webCareMonthly()[c]));
  });

  it("links the price list's package builder", async () => {
    const html = await serveGuide(locale, "cuanto-cuesta-pagina-web");
    expect(html).toContain(`href="${localePath(locale, "/precios#arme")}"`);
  });
});

describe.each(locales)("/guias served in %s", (locale) => {
  const t = guias[locale];

  it("keeps the title tag under 60 characters", () => {
    const full = site[locale].meta.titleTemplate.replace("%s", t.meta.title);
    expect(full.length, full).toBeLessThan(60);
  });

  it("opens with a 40 to 60 word answer and lists every guide with author and date", async () => {
    const html = await serveIndex(locale);
    const lede = text(all(/<p class="guide-lede">([\s\S]*?)<\/p>/g, html)[0] ?? "");
    expect(words(lede), lede).toBeGreaterThanOrEqual(40);
    expect(words(lede), lede).toBeLessThanOrEqual(60);
    const cards = all(/(<li class="guias-card"[\s\S]*?<\/li>)/g, html);
    expect(cards).toHaveLength(GUIDES.length);
    GUIDES.forEach((g, i) => {
      expect(cards[i]).toContain(`href="${localePath(locale, guidePath(g.slug))}"`);
      expect(text(cards[i])).toContain(g.copy[locale].title);
      expect(text(cards[i])).toContain("Daniel Hack");
      expect(cards[i]).toContain(`dateTime="${g.dateModified}"`);
    });
  });

  it("carries a BreadcrumbList that is the trail the page shows", async () => {
    const html = await serveIndex(locale);
    const crumbs = ldNodes(html).filter((n) => n["@type"] === "BreadcrumbList");
    expect(crumbs).toHaveLength(1);
    const items = crumbs[0].itemListElement as { name: string; item: string }[];
    expect(items.map((i) => i.item)).toEqual([url(locale, "/"), url(locale, "/guias")]);
    const trail = block(html, /<nav class="crumbs"/, "nav");
    expect(all(/<li[^>]*>([\s\S]*?)<\/li>/g, trail).map(text)).toEqual(items.map((i) => i.name));
  });
});

describe.each(locales)("footer in %s", (locale) => {
  it("links the guides", async () => {
    const Footer = (await import("../../../components/site/Footer")).default;
    const html = renderToStaticMarkup(React.createElement(Footer, { locale }));
    expect(html).toContain(`href="${localePath(locale, "/guias")}"`);
    expect(html).toContain(`>${guias[locale].navLabel}<`);
  });
});
