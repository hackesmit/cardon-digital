import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as winery-page.test.ts: vitest compiles this app's JSX
// with the classic runtime, and pages build glyphs at module scope, so every
// page is loaded with a dynamic import after this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../lib/i18n/LocaleProvider";
import { locales, type Locale } from "../../lib/i18n/config";
import { site } from "../../lib/i18n/site";
import { addOnAvailable, addOns, modules, type ModuleId } from "../../lib/pricing";

/**
 * Every ads claim on every public page, held to lib/pricing.ts (bead
 * hq-4pu0q.20).
 *
 * lib/pricing.ts gives google-ads-management hours { S: null, M: 3, L: 3.5 },
 * so ad management cannot be bought at the entry size at any price, while
 * floorFor() builds every published entry price out of quote([module], "S").
 * lib/i18n/precios.ts says so in words ("ad management from the middle size
 * up", "el manejo de anuncios desde el mediano"). The home page dropped the
 * clause and sold ads beside the entry price; the winery page had dropped it
 * before (hq-4pu0q.6), and that fix guarded one card on one page, which is how
 * the home page stayed wrong. So this suite is not about the home page. It
 * walks app/[locale] for every page.tsx, serves each one in each locale, and
 * is DEFAULT DENY: any block that mentions ads must either carry the size
 * condition, sit directly above the block that does, or be made only of
 * phrases on the short list below that are not offers of ad management. A new
 * page, a new sentence or a reworded one fails until someone rules on it.
 *
 * Both directions are derived from pricing rather than asserted flat:
 *  - while addOnAvailable says ads cannot be bought at S, the condition must
 *    be served;
 *  - the day it says they can, the same cases demand the condition be GONE,
 *    because a surface may not carry a condition its policy source lacks.
 * The module condition is derived the same way from addOn.attachesTo.
 */

type Params = { params: { locale: Locale } };
type PageModule = {
  default: (props: Params) => React.ReactElement | Promise<React.ReactElement>;
  generateMetadata?: (props: Params) => unknown;
};

const ADS_ID = "google-ads-management" as const;
const ads = addOns.filter((a) => a.id === ADS_ID)[0];
const attachesTo = ads.attachesTo as ModuleId[];
const allModuleIds = Object.keys(modules) as ModuleId[];
const excludedIds = allModuleIds.filter((m) => attachesTo.indexOf(m) < 0);

/** True while pricing refuses ad management at the entry size on every module it attaches to. */
const refusedAtEntry = attachesTo.every((m) => !addOnAvailable(ADS_ID, [m], "S"));
/** True while the ads BUILD is a catalogue feature priced at every size of every module ads attach to. */
const buildAtEverySize = attachesTo.every((m) =>
  modules[m].catalogue.some(
    (f) => f.id === "google-ads-build" && f.hours.S !== null && f.hours.M !== null && f.hours.L !== null,
  ),
);

/** Any mention of advertising, in either language. Wide on purpose. */
const ADS = /\bads?\b|\badvertis|\banuncio|\bpublicidad|\bpauta|\bcampaign|\bcampaña|\bppc\b|\bsem\b/i;

/** The size condition, in precios' words or the S M L letters /modulos uses. */
const SIZE: Record<Locale, RegExp> = {
  en: /from the middle size up|from M\b/,
  es: /desde el (?:tamaño )?mediano|desde M\b/,
};

/** A module named as something ads attach to. Display names are the ids, capitalised, in both locales. */
function names(id: ModuleId): RegExp {
  return new RegExp(id.replace("produccion", "producci[oó]n"), "i");
}

/**
 * Phrases that mention ads and are not an offer of ad management. Each is
 * stripped from a block before the block is judged, so a block is exempt only
 * if NOTHING about ads is left once they are gone: "your ads, managed inside
 * the monthly fee" strips to a sentence that still has to carry the condition.
 */
const NOT_AN_OFFER: Record<Locale, RegExp[]> = {
  en: [
    // The reader's own ads, as the diagnostic's input.
    /\byour ads\b/gi,
    /\bads and books\b/gi,
    // Their money, which never reaches us.
    /\bad (?:spend|budget)\b/gi,
    // Privacy: what the measurement script is and does.
    /\bGoogle Ads conversion measurement\b/g,
    /\bwhich ads brought them here\b/g,
    // About: what the founders have worked in, no offer and no price.
    /\bGoogle Ads, websites\b/g,
    // Site description, a positioning line.
    /\bAds, website, and operations\b/g,
    // /modulos L scale line: what a business that size already runs.
    /\bdirect booking and ads\b/g,
    // Terms: points at the site's description and defers to the signed
    // agreement for scope and amounts. Flagged on the bead, not an offer.
    /Where the site describes[^.]*ad management inside the monthly fee/g,
  ],
  es: [
    /\bsus anuncios\b/gi,
    /\b(?:inversión en|presupuesto de) anuncios\b/gi,
    /\bmedición de conversiones de Google Ads\b/g,
    /\bqué anuncios trajeron\b/g,
    /\bGoogle Ads, sitios web\b/g,
    /\breserva directa y anuncios\b/g,
    /Donde el sitio describe[^.]*manejo de anuncios dentro de la cuota mensual/g,
  ],
};

/** The ads BUILD is sold at every size, so naming it needs no size condition, for as long as that is true. */
const BUILD: Record<Locale, RegExp[]> = {
  en: [/\b(?:Google )?Ads build\b/gi],
  es: [/\bconstrucción de (?:Google Ads|anuncios)\b/gi],
};

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (f === "page.tsx") out.push(p);
  }
  return out;
}

const here = join(process.cwd(), "app/[locale]");
const pages = walk(here)
  .map((p) => "./" + relative(here, p).replace(/\\/g, "/").replace(/\.tsx$/, ""))
  .sort();

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object")
    Object.keys(value).forEach((k) => strings((value as Record<string, unknown>)[k], out));
  return out;
}

/**
 * What a visitor is served, as blocks in document order: the text of every
 * block element, every attribute a reader or a crawler gets, and the page's
 * metadata. Inline tags are dropped without a break, so a sentence split
 * across <b> or a text node assembled at runtime still reads as one block.
 */
async function served(page: string, locale: Locale): Promise<string[]> {
  const mod = (await import(/* @vite-ignore */ page)) as PageModule;
  const props: Params = { params: { locale } };
  let html = "";
  try {
    const Page = mod.default;
    const el =
      Page.constructor.name === "AsyncFunction"
        ? await Page(props)
        : React.createElement(Page as React.FunctionComponent<Params>, props);
    html = renderToStaticMarkup(
      // LocaleProvider declares children as required, see winery-page.test.ts.
      // eslint-disable-next-line react/no-children-prop
      React.createElement(LocaleProvider, { locale, children: el }),
    );
  } catch (e) {
    // /demo redirects off-site when the demo host is set. Nothing is served.
    if (!/NEXT_REDIRECT/.test(String((e as { digest?: string }).digest ?? e))) throw e;
  }
  const out: string[] = [];
  if (mod.generateMetadata) strings(mod.generateMetadata(props), out);
  const attr = /\b(?:content|aria-label|alt|title|placeholder)="([^"]*)"/g;
  let m = attr.exec(html);
  while (m !== null) {
    out.push(decode(m[1]));
    m = attr.exec(html);
  }
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<\/?(?:p|div|li|h[1-6]|section|article|header|footer|figure|figcaption|td|th|tr|dt|dd|dl|text|button|a|label|summary|details|nav|main|ul|ol|table|svg|g|br|span)(?: [^>]*)?\/?>/g,
      "\n",
    )
    .replace(/<[^>]*>/g, "");
  for (const line of decode(text).split("\n")) {
    const t = line.replace(/\s+/g, " ").trim();
    if (t) out.push(t);
  }
  return out;
}

/** What is left of a block once everything that is not an offer is stripped. */
function offerIn(block: string, locale: Locale): string {
  let rest = block;
  for (const re of NOT_AN_OFFER[locale]) rest = rest.replace(re, " ");
  if (buildAtEverySize) for (const re of BUILD[locale]) rest = rest.replace(re, " ");
  return rest;
}

type Offer = { page: string; block: string; conditioned: boolean };

/**
 * Every block that offers ads. `conditioned` is true when the block carries the
 * size condition itself or one of the two blocks after it does, which is how a
 * label ("Ads") and a heading sit above the sentence that states it.
 */
async function offers(locale: Locale): Promise<Offer[]> {
  const out: Offer[] = [];
  const surfaces: { page: string; blocks: string[] }[] = [
    // The shell's dictionary, because Nav needs a router and is not rendered here.
    { page: "site shell", blocks: strings(site[locale]) },
  ];
  for (const page of pages) surfaces.push({ page, blocks: await served(page, locale) });
  for (const { page, blocks } of surfaces) {
    blocks.forEach((block, i) => {
      if (!ADS.test(offerIn(block, locale))) return;
      const near = blocks.slice(i, i + 3);
      out.push({ page, block, conditioned: near.some((b) => SIZE[locale].test(b)) });
    });
  }
  return out;
}

describe("every served ads claim carries the conditions lib/pricing.ts sets", () => {
  it("finds the pages, so a surface cannot be missed by not being listed", () => {
    expect(pages).toContain("./page");
    expect(pages).toContain("./industries/winery/page");
    expect(pages).toContain("./precios/page");
    expect(pages.length).toBeGreaterThanOrEqual(12);
  });

  for (const locale of locales) {
    it(`${locale}: the home page still makes the claim this suite was written for`, async () => {
      // A guard that finds nothing passes. The home page sells ad management
      // above its entry price line, so zero offers there means the extraction
      // broke, not that the page is clean.
      const home = (await offers(locale)).filter((o) => o.page === "./page");
      expect(home.length).toBeGreaterThan(0);
    });

    it(`${locale}: every ads offer carries the size condition exactly while pricing refuses ads at the entry size`, async () => {
      const all = await offers(locale);
      if (refusedAtEntry) {
        const bare = all.filter((o) => !o.conditioned);
        expect(
          bare.map((o) => `${o.page}: ${o.block}`),
          "sold with no size condition while lib/pricing.ts has google-ads-management at S: null",
        ).toEqual([]);
      } else {
        // The reverse direction. Pricing now sells ads at the entry size, so a
        // served "from the middle size up" is a condition with no source.
        const stale = all.filter((o) => SIZE[locale].test(o.block));
        expect(
          stale.map((o) => `${o.page}: ${o.block}`),
          "carries a size condition lib/pricing.ts no longer has",
        ).toEqual([]);
      }
    });

    it(`${locale}: no ads offer names a module pricing does not attach ads to, unless it is refusing it`, async () => {
      // Reverse direction for the module condition, from addOn.attachesTo. The
      // excluded module may be named only where the block also names every
      // module ads DO attach to, which is the shape of precios' and /modulos'
      // refusal ("Neither attaches to Produccion", "those attach to
      // Hospitalidad and to Restaurante"), or where it refuses outright.
      const refusal = locale === "en" ? /\b(?:neither|never|no version|do(?:es)? not)\b/i : /\b(?:ninguno|nunca|no existe|no se)\b/i;
      const bad = (await offers(locale)).filter(
        (o) => excludedIds.some((m) => names(m).test(o.block)) && !refusal.test(o.block),
      );
      expect(bad.map((o) => `${o.page}: ${o.block}`)).toEqual([]);
    });

    it(`${locale}: a sentence that puts ad management inside the monthly fee names every module it attaches to`, async () => {
      const fee = locale === "en" ? /inside the monthly(?: service)? fee/i : /dentro de la cuota mensual/i;
      const claims = (await offers(locale)).filter(
        (o) => fee.test(o.block) && !excludedIds.some((m) => names(m).test(o.block)),
      );
      expect(claims.length).toBeGreaterThan(0);
      const bad = claims.filter((o) => !attachesTo.every((m) => names(m).test(o.block)));
      expect(bad.map((o) => `${o.page}: ${o.block}`)).toEqual([]);
    });
  }
});
