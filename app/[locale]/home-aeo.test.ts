import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as winery-page.test.ts: vitest compiles this app's JSX
// with the classic runtime, so the page is loaded with a dynamic import after
// this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../lib/i18n/LocaleProvider";
import { locales, localePath, type Locale } from "../../lib/i18n/config";
import { site } from "../../lib/i18n/site";
import { home } from "../../lib/i18n/home";

/**
 * The home page and the diagnostic block in the AEO program (bead hq-i4b5.10,
 * bunkers/cardon-digital/research/2026-10/aeo/SPEC.md), held against what the
 * home SERVES:
 *  - the title tag is under 60 characters and carries Ensenada, and the meta
 *    description opens with the answer and names Ensenada too, because the
 *    location left the hero H1 (Daniel, 2026-10-21) and moves to where search
 *    and AI engines weigh it;
 *  - the website card says the site is built to be read and cited in AI
 *    answers, and the services block links /visibilidad-ia from outside the
 *    card, since the card is itself a link;
 *  - the diagnostic block states the AI answers check, through site.diag.price,
 *    the one line every diagnostic block on the site renders;
 *  - no promise that an engine will cite anyone, and the one CTA unchanged.
 */

async function serve(locale: Locale): Promise<string> {
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

/** The inner html of the first element `open` matches, up to its balanced close tag. */
function block(html: string, open: RegExp, tag: string): string {
  const m = open.exec(html);
  if (!m) return "";
  const re = new RegExp(`<${tag}\\b|</${tag}>`, "g");
  re.lastIndex = m.index + m[0].length;
  let depth = 1;
  for (let t = re.exec(html); t; t = re.exec(html)) {
    depth += t[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(m.index + m[0].length, t.index);
  }
  return "";
}

const AI_ENGINES = /ChatGPT/;
const PROMISE =
  /garantizamos|le garantiza|garantizado|we guarantee|guaranteed|primer lugar en|rank (first|#1|number one)|top of google|vas a aparecer|va a aparecer|aparecer[áa] en|will (show up|appear)|you'll (show up|appear)/i;

describe.each(locales)("home (%s) in the AEO program", (locale) => {
  const d = home[locale];
  const s = site[locale];

  it("has a title under 60 characters that carries Ensenada", () => {
    expect(d.meta.title.length, d.meta.title).toBeLessThan(60);
    expect(d.meta.title).toContain("Ensenada");
    expect(d.meta.title).toContain("Cardon");
  });

  it("opens the meta description with the answer, names Ensenada and the AI answers check", () => {
    expect(d.meta.description.startsWith("Cardon Digital "), d.meta.description).toBe(true);
    expect(d.meta.description).toContain("Ensenada");
    expect(d.meta.description).toMatch(AI_ENGINES);
  });

  it("keeps Ensenada in the eyebrow and out of the H1", async () => {
    const html = await serve(locale);
    const h1 = text(block(html, /<h1\b[^>]*>/, "h1"));
    expect(h1).not.toContain("Ensenada");
    expect(h1).toContain(text(d.hero.titleAccent));
    expect(d.hero.eyebrow).toBe("Ensenada, Baja California");
    expect(html).toContain(d.hero.eyebrow);
  });

  it("says on the website card that the site is built to be cited in AI answers", async () => {
    const html = await serve(locale);
    const sitios = d.services.items.find((i) => i.id === "sitios")!;
    expect(sitios.body).toMatch(AI_ENGINES);
    const services = block(html, /<section[^>]*id="servicios"[^>]*>/, "section");
    expect(text(services)).toContain(text(sitios.body));
  });

  it("links /visibilidad-ia from the services block, outside any other link", async () => {
    const html = await serve(locale);
    const services = block(html, /<section[^>]*id="servicios"[^>]*>/, "section");
    const target = localePath(locale, "/visibilidad-ia");
    const links = Array.from(services.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g));
    const ai = links.find((m) => m[1] === target);
    expect(ai, `no link to ${target}`).toBeDefined();
    expect(ai![2]).not.toMatch(/<a\b/);
    expect(text(ai![2])).toBe(text(d.services.aiLink));
    expect(text(ai![2])).toMatch(AI_ENGINES);
  });

  it("states the AI answers check in the diagnostic block, with the one CTA unchanged", async () => {
    const html = await serve(locale);
    expect(s.diag.price).toMatch(AI_ENGINES);
    const diag = block(html, /<section[^>]*id="diagnostic"[^>]*>/, "section");
    expect(text(diag)).toContain(text(s.diag.price.replace(/\*\*/g, "")));
    expect(s.diag.cta).toBe(locale === "es" ? "Pedir el diagnóstico sin costo" : "Get the free diagnostic");
  });

  it("promises no appearance in any engine and carries no em dash", async () => {
    const html = await serve(locale);
    const visible = text(html);
    expect(visible.match(PROMISE), visible.match(PROMISE)?.[0]).toBeNull();
    for (const line of [d.meta.title, d.meta.description, d.services.aiLead, d.services.aiLink, s.diag.price]) {
      expect(line).not.toContain("\u2014");
      expect(line).not.toMatch(PROMISE);
    }
  });
});
