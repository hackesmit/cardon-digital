import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as winery-page.test.ts: vitest compiles this app's JSX
// with the classic runtime, so the page is loaded with a dynamic import after
// this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../../lib/i18n/LocaleProvider";
import { locales, localePath, type Locale } from "../../../lib/i18n/config";
import { site } from "../../../lib/i18n/site";
import { sitios } from "../../../lib/i18n/sitios";
import { webPackages } from "../../../lib/pricing";

/**
 * Guards for the answer-first /sitios-web (bead hq-i4b5.6, AEO spec in
 * bunkers/cardon-digital/research/2026-10/aeo/SPEC.md), held against what the
 * page SERVES:
 *  - it opens with a 40 to 60 word answer that names the business, so the
 *    passage stands alone when an answer engine lifts it;
 *  - the FAQPage markup asks exactly the questions the page shows, 5 to 7;
 *  - a Service node describes the page in the words of that opening answer;
 *  - AEO is named once per locale, with its definition beside it;
 *  - no typed price in the FAQ, no promise to rank or to appear;
 *  - every web package carries the AEO-ready feature.
 */

async function serve(locale: Locale): Promise<string> {
  const SitiosPage = (await import("./page")).default;
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    React.createElement(LocaleProvider, {
      locale,
      children: React.createElement(SitiosPage, { params: { locale } }),
    }),
  );
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const text = (inner: string) =>
  decode(inner.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

function all(re: RegExp, html: string): string[] {
  const out: string[] = [];
  for (let m = re.exec(html); m !== null; m = re.exec(html)) out.push(m[1]);
  return out;
}

type Node = { "@type": string; [k: string]: unknown };
function ldNodes(html: string): Node[] {
  return all(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, html).flatMap(
    (raw) => (JSON.parse(raw) as { "@graph": Node[] })["@graph"],
  );
}

/** Visible copy: scripts dropped, markup stripped. */
const visible = (html: string) => text(html.replace(/<script[\s\S]*?<\/script>/g, ""));

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe.each(locales)("/sitios-web served in %s", (locale) => {
  it("opens with a self-contained 40 to 60 word answer", async () => {
    const html = await serve(locale);
    const answer = text(all(/<p class="hero-sub">([\s\S]*?)<\/p>/g, html)[0] ?? "");
    expect(words(answer)).toBeGreaterThanOrEqual(40);
    expect(words(answer)).toBeLessThanOrEqual(60);
    expect(answer).toContain("Cardon Digital");
  });

  it("marks up exactly the FAQ it shows, five to seven different questions", async () => {
    const html = await serve(locale);
    const shown = all(/<h3 class="faq-q">([\s\S]*?)<\/h3>/g, html).map(text);
    const answers = all(/<p class="faq-a">([\s\S]*?)<\/p>/g, html).map(text);
    const faq = ldNodes(html).filter((n) => n["@type"] === "FAQPage");
    expect(faq).toHaveLength(1);
    const entities = faq[0].mainEntity as {
      name: string;
      acceptedAnswer: { text: string };
    }[];
    expect(entities.map((q) => q.name)).toEqual(shown);
    expect(entities.map((q) => q.acceptedAnswer.text)).toEqual(answers);
    expect(shown.length).toBeGreaterThanOrEqual(5);
    expect(shown.length).toBeLessThanOrEqual(7);
    expect(new Set(shown).size).toBe(shown.length);
    for (const q of shown) expect(q.endsWith("?")).toBe(true);
  });

  it("answers the delivery question from lib/pricing.ts, with nothing left unfilled", async () => {
    const html = await serve(locale);
    const answers = all(/<p class="faq-a">([\s\S]*?)<\/p>/g, html).map(text);
    const min = Math.min(...webPackages.map((p) => p.deliveryDays.min));
    const max = Math.max(...webPackages.map((p) => p.deliveryDays.max));
    expect(answers.some((a) => a.includes(String(min)) && a.includes(String(max)))).toBe(true);
    for (const a of answers) expect(a).not.toMatch(/[{}]/);
  });

  it("types no price in the FAQ and links cost to /precios", async () => {
    const html = await serve(locale);
    const faqHtml = html.slice(html.indexOf('class="faq"'));
    const answers = all(/<p class="faq-a">([\s\S]*?)<\/p>/g, html).map(text);
    for (const a of answers) {
      expect(a).not.toMatch(/\$\s?\d|\d[\d,.]*\s?(MXN|USD|pesos|d[oó]lares|dollars)/i);
    }
    expect(faqHtml).toContain(`href="${localePath(locale, "/precios")}"`);
  });

  it("carries a Service node in the words of the opening answer", async () => {
    const html = await serve(locale);
    const answer = text(all(/<p class="hero-sub">([\s\S]*?)<\/p>/g, html)[0] ?? "");
    const service = ldNodes(html).filter((n) => n["@type"] === "Service");
    expect(service).toHaveLength(1);
    expect(service[0].description).toBe(answer);
    expect(service[0].url).toBe("https://cardondigital.com" + localePath(locale, "/sitios-web"));
  });

  it("names AEO once, with its definition, and promises no ranking", async () => {
    const page = visible(await serve(locale));
    expect(page.match(/\bAEO\b/g) ?? []).toHaveLength(1);
    const sentence = page.split(/(?<=[.:])\s/).find((s) => /\bAEO\b/.test(s)) ?? "";
    expect(sentence).toMatch(/optimizaci[oó]n|optimization/i);
    expect(page).not.toMatch(
      /garantizamos|le garantiza|garantizado|we guarantee|guaranteed|primer lugar en|rank (first|#1|number one)|top of google/i,
    );
    expect(page).not.toContain("—");
  });

  it("keeps the title tag under 60 characters with the brand template", () => {
    const full = site[locale].meta.titleTemplate.replace("%s", sitios[locale].meta.title);
    expect(full.length).toBeLessThan(60);
  });
});

describe("the AEO-ready feature", () => {
  it("is in every web package, with a name in both dictionaries", () => {
    for (const p of webPackages) expect(p.features).toContain("aeo-ready");
    for (const l of locales) expect(sitios[l].packages.features["aeo-ready"]).toBeTruthy();
  });
});
