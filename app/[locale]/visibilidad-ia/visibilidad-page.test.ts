import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as winery-page.test.ts: vitest compiles this app's JSX
// with the classic runtime, so the page is loaded with a dynamic import after
// this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../../lib/i18n/LocaleProvider";
import { locales, localePath, type Locale } from "../../../lib/i18n/config";
import { SITE_URL } from "../../../lib/i18n/metadata";
import { site } from "../../../lib/i18n/site";
import { BASELINE, visibilidad } from "../../../lib/i18n/visibilidad-ia";
import { CREDENTIALS } from "../../../lib/credentials";
import { ORGANIZATION_ID } from "../../../lib/seo/jsonld";

/**
 * Guards for /visibilidad-ia (bead hq-i4b5.9, AEO spec in
 * bunkers/cardon-digital/research/2026-10/aeo/SPEC.md), held against what the
 * page SERVES:
 *  - the AEO page checklist: a short title, a 40 to 60 word opening answer
 *    that names the business, question headings, an FAQ of 5 to 7 different
 *    questions, a labelled comparison table;
 *  - Service, BreadcrumbList and FAQPage markup that say only what the page
 *    shows;
 *  - AEO named and defined in one section only (the certificate's own name
 *    aside);
 *  - our own measured baseline as the original element, the same figures in
 *    both locales, read from one place;
 *  - no promise that an engine will cite anyone, no typed price, no em dash.
 */

async function serve(locale: Locale): Promise<string> {
  const Page = (await import("./page")).default;
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    React.createElement(LocaleProvider, {
      locale,
      children: await Page({ params: Promise.resolve({ locale }) }),
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

/** Visible copy: scripts dropped, markup stripped. */
const visible = (html: string) => text(html.replace(/<script[\s\S]*?<\/script>/g, ""));

/** The inner html of the element that opens with `open`, up to its closing tag. */
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

describe.each(locales)("/visibilidad-ia served in %s", (locale) => {
  const d = visibilidad[locale];

  it("keeps the title tag under 60 characters with the brand template", () => {
    const full = site[locale].meta.titleTemplate.replace("%s", d.meta.title);
    expect(full.length, full).toBeLessThan(60);
    expect(d.meta.description.length, d.meta.description).toBeLessThanOrEqual(260);
  });

  it("opens with a self-contained 40 to 60 word answer, the first copy after the H1", async () => {
    const html = await serve(locale);
    const opening = all(/<p class="hero-sub">([\s\S]*?)<\/p>/g, html).map(text);
    expect(opening).toHaveLength(1);
    expect(words(opening[0]), opening[0]).toBeGreaterThanOrEqual(40);
    expect(words(opening[0]), opening[0]).toBeLessThanOrEqual(60);
    expect(opening[0]).toContain("Cardon Digital");
    const firstP = html.indexOf("<p", html.indexOf("</h1>"));
    expect(html.slice(firstP, firstP + 30)).toContain('class="hero-sub"');
  });

  it("asks the owner's questions in its section headings", async () => {
    const html = await serve(locale);
    const h2s = all(/<h2[^>]*>([\s\S]*?)<\/h2>/g, html).map(text);
    const questions = h2s.filter((h) => h !== text(d.faq.title) && /\?$/.test(h));
    expect(questions.length, h2s.join(" | ")).toBeGreaterThanOrEqual(4);
  });

  it("marks up exactly the FAQ it shows, five to seven different questions", async () => {
    const html = await serve(locale);
    expect(html).not.toMatch(/\{\w+\}/);
    const shown = all(/<h3 class="faq-q">([\s\S]*?)<\/h3>/g, html).map(text);
    const answers = all(/<p class="faq-a">([\s\S]*?)<\/p>/g, html).map(text);
    const faq = ldNodes(html).filter((n) => n["@type"] === "FAQPage");
    expect(faq).toHaveLength(1);
    const entities = faq[0].mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(entities.map((q) => q.name)).toEqual(shown);
    expect(entities.map((q) => q.acceptedAnswer.text)).toEqual(answers);
    expect(shown.length).toBeGreaterThanOrEqual(5);
    expect(shown.length).toBeLessThanOrEqual(7);
    expect(new Set(shown).size).toBe(shown.length);
    for (const q of shown) expect(q.endsWith("?"), q).toBe(true);
  });

  it("carries a Service node in the words of the opening answer", async () => {
    const html = await serve(locale);
    const opening = text(all(/<p class="hero-sub">([\s\S]*?)<\/p>/g, html)[0] ?? "");
    const services = ldNodes(html).filter((n) => n["@type"] === "Service");
    expect(services).toHaveLength(1);
    const s = services[0];
    expect(s.url).toBe(url(locale, "/visibilidad-ia"));
    expect(s["@id"]).toBe(url(locale, "/visibilidad-ia") + "#service");
    expect(s.provider).toEqual({ "@id": ORGANIZATION_ID });
    expect(s.name).toBe(d.hero.eyebrow);
    expect(html).toContain(`<p class="eyebrow">${d.hero.eyebrow}</p>`);
    expect(s.description).toBe(opening);
  });

  it("carries a BreadcrumbList that is the trail the page shows", async () => {
    const html = await serve(locale);
    const crumbs = ldNodes(html).filter((n) => n["@type"] === "BreadcrumbList");
    expect(crumbs).toHaveLength(1);
    const items = crumbs[0].itemListElement as { position: number; name: string; item: string }[];
    expect(items.map((i) => i.item)).toEqual([url(locale, "/"), url(locale, "/visibilidad-ia")]);
    expect(items.map((i) => i.position)).toEqual([1, 2]);
    const trail = block(html, /<nav class="crumbs"/, "nav");
    expect(all(/<li[^>]*>([\s\S]*?)<\/li>/g, trail).map(text)).toEqual(items.map((i) => i.name));
    expect(trail).toContain(`href="${localePath(locale, "/")}"`);
    expect(trail).toContain('aria-current="page"');
  });

  it("names AEO in one section only, with its definition there", async () => {
    const html = await serve(locale);
    const defined = block(html, /<section[^>]*id="que-es-aeo"/, "section");
    expect(defined).not.toBe("");
    // The certificate's own name carries the letters; it is a name, not a use.
    const certs = block(html, /<ul class="cred-list"/, "ul");
    expect(certs).not.toBe("");
    const rest = visible(html.replace(defined, "").replace(certs, ""));
    expect(rest.match(/\bAEO\b/g) ?? [], rest).toEqual([]);
    const sentence = visible(defined).split(/(?<=[.:])\s/).find((x) => /\bAEO\b/.test(x) && x.length > 40) ?? "";
    expect(sentence).toMatch(/optimizaci[oó]n|optimization/i);
  });

  it("compares the two in a labelled table", async () => {
    const html = await serve(locale);
    const table = block(html, /<table/, "table");
    expect(text(all(/<caption[^>]*>([\s\S]*?)<\/caption>/g, table)[0] ?? "")).toBe(d.aeo.table.caption);
    const cols = all(/<th scope="col"[^>]*>([\s\S]*?)<\/th>/g, table).map(text);
    expect(cols).toEqual(d.aeo.table.cols.map(text));
    const rows = all(/<th scope="row"[^>]*>([\s\S]*?)<\/th>/g, table).map(text);
    expect(rows).toEqual(d.aeo.table.rows.map((r) => r.k));
    expect(all(/<td[^>]*>([\s\S]*?)<\/td>/g, block(table, /<tbody/, "tbody"))).toHaveLength(d.aeo.table.rows.length * 2);
  });

  it("shows our own measured baseline, figures read from one place", async () => {
    const page = visible(await serve(locale));
    const own = `${BASELINE.mentioned}`;
    expect(page).toContain(`${own} ${locale === "es" ? "de" : "of"} ${BASELINE.answers}`);
    expect(page).toContain(`${BASELINE.unbrandedMentioned} ${locale === "es" ? "de" : "of"} ${BASELINE.unbranded}`);
    expect(page).toContain(String(BASELINE.prompts));
    expect(page).toContain("2026");
  });

  it("shows the certificate with its verification link", async () => {
    const html = await serve(locale);
    for (const c of CREDENTIALS) {
      expect(html).toContain(`href="${c.verifyUrl}"`);
      expect(html).toContain(c.code);
    }
  });

  it("links the fixes to the website service and its prices, and types no price", async () => {
    const html = await serve(locale);
    expect(html).toContain(`href="${localePath(locale, "/sitios-web")}"`);
    expect(html).toContain(`href="${localePath(locale, "/precios")}"`);
    expect(html).toContain(`href="${localePath(locale, "/contacto")}"`);
    const page = visible(html);
    expect(page).not.toMatch(/\$\s?\d|\d[\d,.]*\s?(MXN|USD|pesos|d[oó]lares|dollars)/i);
  });

  it("promises no ranking and no appearance, and has no em dash or factura language", async () => {
    const page = visible(await serve(locale));
    expect(page).not.toMatch(
      /garantizamos|le garantiza|garantizado|we guarantee|guaranteed|primer lugar en|rank (first|#1|number one)|top of google|vas a aparecer|va a aparecer|aparecer[áa] en|will (show up|appear)|you'll (show up|appear)/i,
    );
    expect(page).not.toContain("\u2014");
    expect(page).not.toMatch(/factura|\bIVA\b|\bVAT\b/i);
  });
});
