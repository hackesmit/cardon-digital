import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as winery-page.test.ts: vitest compiles this app's JSX
// with the classic runtime, so each page is loaded with a dynamic import after
// this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../lib/i18n/LocaleProvider";
import { locales, localePath, type Locale } from "../../lib/i18n/config";
import { SITE_URL } from "../../lib/i18n/metadata";
import { site } from "../../lib/i18n/site";
import { anuncios } from "../../lib/i18n/anuncios";
import { software } from "../../lib/i18n/software";
import { adsFill } from "../../lib/adsCopy";
import { ORGANIZATION_ID } from "../../lib/seo/jsonld";

/**
 * The AEO page checklist (bunkers/cardon-digital/research/2026-10/aeo/SPEC.md,
 * bead hq-i4b5.7) held on the two service pages it was applied to: a title
 * under 60 characters once the layout template is added, a self-contained
 * opening answer of 40 to 60 words that names the business, at least one
 * question-phrased H2 besides the FAQ, an FAQ of five to seven distinct
 * questions, and FAQPage plus Service JSON-LD that say only what the page
 * shows. Judged on what the page SERVES, so a placeholder left unfilled or a
 * markup string the page never renders fails here.
 */

type PageModule = { default: (props: { params: { locale: string } }) => React.ReactElement };

const PAGES = [
  { path: "/anuncios", load: () => import("./anuncios/page"), dict: anuncios, fill: adsFill },
  { path: "/software", load: () => import("./software/page"), dict: software, fill: (_l: Locale, t: string) => t },
] as const;

async function serve(load: () => Promise<unknown>, locale: Locale): Promise<string> {
  const Page = ((await load()) as PageModule).default;
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    React.createElement(LocaleProvider, {
      locale,
      children: React.createElement(Page, { params: { locale } }),
    }),
  );
}

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/** Text content of an element's inner html, tags dropped, entities decoded. */
const textOf = (inner: string) => decode(inner.replace(/<br\s*\/?>/g, " ").replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();

function all(re: RegExp, html: string): string[] {
  return Array.from(html.matchAll(re)).map((m) => textOf(m[1]));
}

/** The JSON-LD nodes the page body carries (the site graph is the layout's, not rendered here). */
function ldNodes(html: string): Array<Record<string, unknown>> {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  return Array.from(html.matchAll(re)).flatMap((m) => (JSON.parse(m[1]) as { "@graph": Array<Record<string, unknown>> })["@graph"]);
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe.each(PAGES)("$path follows the AEO page checklist", ({ path, load, dict, fill }) => {
  for (const locale of locales) {
    const d = dict[locale];

    it(`${locale}: the title tag is under 60 characters with the template`, () => {
      const full = site[locale].meta.titleTemplate.replace("%s", d.meta.title);
      expect(full.length, full).toBeLessThan(60);
      expect(d.meta.description.length, d.meta.description).toBeLessThanOrEqual(260);
    });

    it(`${locale}: opens with a self-contained answer of 40 to 60 words that names the business`, async () => {
      const html = await serve(load, locale);
      const opening = all(/<p class="hero-sub">([\s\S]*?)<\/p>/g, html);
      expect(opening).toHaveLength(1);
      const n = words(opening[0]);
      expect(n, opening[0]).toBeGreaterThanOrEqual(40);
      expect(n, opening[0]).toBeLessThanOrEqual(60);
      expect(opening[0]).toContain("Cardon Digital");
      // It is the first paragraph of copy after the H1.
      const h1At = html.indexOf("<h1");
      const firstP = html.indexOf("<p", html.indexOf("</h1>"));
      expect(h1At).toBeGreaterThan(-1);
      expect(html.slice(firstP, firstP + 30)).toContain('class="hero-sub"');
    });

    it(`${locale}: some section headings are the questions an owner asks`, async () => {
      const html = await serve(load, locale);
      const h2s = all(/<h2[^>]*>([\s\S]*?)<\/h2>/g, html);
      const faqTitle = plainTitle(d.faq.title);
      const questions = h2s.filter((h) => h !== faqTitle && /\?$/.test(h));
      expect(questions.length, h2s.join(" | ")).toBeGreaterThanOrEqual(1);
    });

    it(`${locale}: an FAQ of five to seven distinct questions, its JSON-LD equal to the visible text`, async () => {
      const html = await serve(load, locale);
      expect(html).not.toMatch(/\{\w+\}/);
      const qs = all(/<h3 class="faq-q">([\s\S]*?)<\/h3>/g, html);
      const as = all(/<p class="faq-a">([\s\S]*?)<\/p>/g, html);
      expect(qs.length).toBeGreaterThanOrEqual(5);
      expect(qs.length).toBeLessThanOrEqual(7);
      expect(new Set(qs).size).toBe(qs.length);
      expect(as).toHaveLength(qs.length);
      for (const q of qs) expect(q, q).toMatch(/\?$/);
      const faq = ldNodes(html).filter((n) => n["@type"] === "FAQPage");
      expect(faq).toHaveLength(1);
      const entities = faq[0].mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>;
      expect(entities.map((e) => e.name)).toEqual(qs);
      expect(entities.map((e) => e.acceptedAnswer.text)).toEqual(as);
    });

    it(`${locale}: Service JSON-LD names what the page shows and points at the organization`, async () => {
      const html = await serve(load, locale);
      const services = ldNodes(html).filter((n) => n["@type"] === "Service");
      expect(services).toHaveLength(1);
      const s = services[0];
      const url = SITE_URL + localePath(locale, path);
      expect(s.url).toBe(url);
      expect(s["@id"]).toBe(url + "#service");
      expect(s.provider).toEqual({ "@id": ORGANIZATION_ID });
      expect(s.name).toBe(d.hero.eyebrow);
      expect(html).toContain(`<p class="eyebrow">${d.hero.eyebrow}</p>`);
      const opening = all(/<p class="hero-sub">([\s\S]*?)<\/p>/g, html)[0];
      expect(s.description).toBe(opening);
      expect(s.description).toBe(fill(locale, d.hero.sub));
    });
  }
});

function plainTitle(t: string): string {
  return t.replace(/\*\*|__/g, "").replace(/\|/g, " ");
}
