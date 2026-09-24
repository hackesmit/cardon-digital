import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Same test-only shim as winery-page.test.ts: vitest compiles this app's JSX
// with the classic runtime, and pages build glyphs at module scope, so every
// page is loaded with a dynamic import after this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../lib/i18n/LocaleProvider";
import { locales, type Locale } from "../../lib/i18n/config";
import { addOnAvailable, addOns, modules, type ModuleId, type Size } from "../../lib/pricing";

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
 * the home page stayed wrong. So this suite is not about the home page, and
 * after round one's review it is not about pages either. The surfaces are:
 *  - every page.tsx under app/[locale], found by walking, served per locale;
 *  - every dictionary under lib/i18n, found by walking, because the consent
 *    banner and the nav are client components no page render reaches and a
 *    dictionary added later must be covered without anyone listing it;
 *  - the shell's server children, Footer and NotFoundBody, rendered;
 *  - every string literal and JSX text in every component and route source,
 *    which is where a sentence typed straight into a .tsx file lives.
 * It is DEFAULT DENY: any block that mentions ads must carry the size
 * condition in the sentence that makes the offer, or be a one-sentence heading
 * directly above the block that does, or be made only of phrases on the short
 * list below that are not offers of ad management. A new page, a new sentence
 * or a reworded one fails until someone rules on it.
 *
 * The condition is derived from pricing, not asserted flat, and from the whole
 * row rather than one cell of it: the FIRST size at which every module ads
 * attach to can buy them decides the words that are owed. Today that is M, so
 * "from the middle size up" is owed. S would forbid any size condition, L would
 * demand different words, and no size at all would forbid the offer. An offer
 * sentence may carry the owed size's words and no other size's. The module
 * condition is derived the same way from addOn.attachesTo.
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

const SIZES: Size[] = ["S", "M", "L"];
/** The first size at which every module ads attach to can buy ad management, or null when none can. */
const firstSize: Size | null =
  SIZES.filter((z) => attachesTo.every((m) => addOnAvailable(ADS_ID, [m], z)))[0] ?? null;
/** True while the ads BUILD is a catalogue feature priced at every size of every module ads attach to. */
const buildAtEverySize = attachesTo.every((m) =>
  modules[m].catalogue.some(
    (f) => f.id === "google-ads-build" && f.hours.S !== null && f.hours.M !== null && f.hours.L !== null,
  ),
);

/**
 * Any mention of advertising, in either language. Wide on purpose: the ways
 * to say ads without the word (paid search, Google spend, marketing) are here
 * too. Google's bare name is not: the privacy page says it eleven times about
 * measurement cookies, and a list of eleven exemptions guards nothing.
 * A vocabulary is never complete. What it buys is that the ordinary rewordings
 * fail, and each miss found becomes a word on this line.
 */
const ADS =
  /\bads?\b|\badvertis|\banuncio|\bpublicidad|\bpauta|\bcampaign|\bcampaña|\bppc\b|\bsem\b|\bgoogle (?:spend|search|budget)\b|\b(?:gasto|inversión|presupuesto) en google\b|\bmarketing\b|\bmercadotecnia\b|\bpaid (?:search|media|social|traffic)\b|\bpay.per.click\b|\b(?:búsqueda|medios|tráfico) pagad|\bpago por clic\b/i;

/** The verb of the thing pricing refuses at S, for blocks whose ads noun sits in a stripped phrase. */
const MANAGES =
  /\bmanag(?:e|es|ed|ing|ement)\b|\b(?:run|runs|running|ran)\b|\boperat(?:e|es|ed|ing)\b|\bhandl(?:e|es|ed|ing)\b|\bmanej|\bgesti[o\u00f3]n|\badministr|\bllev(?:a|an|amos|e|en|o|ar)\b|\boper(?:a|an|amos|e|en|o|ar)\b/i;

/**
 * The words that state each first size, in precios' words or the S M L letters
 * /modulos uses. S is every way of saying the entry size or all of them. L has
 * no served wording today and gets one here so that M going null cannot leave
 * "from the middle size up" standing.
 */
const SIZE: Record<Locale, Record<Size, RegExp>> = {
  en: {
    S: /\b(?:entry|every|any|each|small|smallest|first) size\b|\ball (?:the |three )?sizes\b|\b(?:from|at) S\b/i,
    M: /\bfrom the middle size up\b|\bfrom M\b/,
    L: /\bonly at the large(?:st)? size\b|\b(?:from|at) L\b/,
  },
  es: {
    S: /\btamaño (?:de entrada|chico|pequeño|inicial)\b|\b(?:cualquier|cada) tamaño\b|\btodos los tamaños\b|\b(?:desde|en) S\b/i,
    M: /\bdesde el (?:tamaño )?mediano\b|\bdesde M\b/,
    L: /\bsolo en el (?:tamaño )?grande\b|\b(?:desde|en) L\b/,
  },
};

/** A size condition that is denied rather than stated: "not only from the middle size up". */
const NEGATED: Record<Locale, RegExp> = {
  en: /\b(?:not|never|no longer)\b(?:\s+\w+){0,2}\s+from (?:the middle|M\b)/i,
  es: /\b(?:no|nunca|ni|ya no)\b(?:\s+\w+){0,2}\s+desde (?:el (?:tamaño )?mediano|M\b)/i,
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
    // Consent banner, served on every page from a client chunk: the same script, asked about.
    /\bGoogle Analytics and Google Ads measurement\b/g,
    // Privacy again: what we do NOT do with a visitor's details.
    /\bfor marketing\b/g,
    /\bmarketing database\b/g,
    // Showcase positioning line: marketing as a whole, which content makes true
    // at the entry size. Flagged on the bead for Daniel, not an ad management offer.
    /\bwe run the marketing that fills the tasting room\b/g,
    // Precios: the OTHER add-on's size, stated beside this one's.
    /\bContent from the entry size\b/g,
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
    /\bmedición de Google Analytics y Google Ads\b/g,
    /\bfines de mercadotecnia\b/g,
    /\bbase de datos de mercadotecnia\b/g,
    /\boperamos el marketing que llena la sala de degustación/g,
    /\bEl contenido va desde el tamaño de entrada\b/g,
    /\bqué anuncios trajeron\b/g,
    /\bGoogle Ads, sitios web\b/g,
    /\breserva directa y anuncios\b/g,
    /Donde el sitio describe[^.]*manejo de anuncios dentro de la cuota mensual/g,
    // Terms again: data handling, which is not ads and shares the verb.
    /\bmanejo de datos\b/g,
  ],
};

/**
 * The ads BUILD is sold at every size, so naming it needs no size condition,
 * for as long as that is true. The phrase takes its own "at any size" with it,
 * because those words are about the build and an offer sentence may not carry
 * another size's words about management.
 */
const BUILD: Record<Locale, RegExp[]> = {
  en: [/\b(?:Google )?Ads build(?: at any size)?/gi],
  es: [/\bconstrucción de (?:Google Ads|anuncios)(?: en cualquier tamaño)?/gi],
};

function walk(dir: string, keep: (file: string) => boolean, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, keep, out);
    else if (keep(f)) out.push(p);
  }
  return out;
}

const root = process.cwd();
const slash = (p: string) => p.replace(/\\/g, "/");
const here = join(root, "app/[locale]");
const pages = walk(here, (f) => f === "page.tsx")
  .map((p) => "./" + slash(relative(here, p)).replace(/\.tsx$/, ""))
  .sort();

/**
 * Every module under lib/i18n, found by walking. The four below are the
 * machinery and hold no copy. Every other file must export at least one
 * dictionary, an object keyed by every locale, or the suite fails: a file
 * that holds copy in some other shape is a surface this guard cannot read.
 */
const I18N_MACHINERY = ["LocaleProvider.tsx", "config.ts", "metadata.ts", "rich.tsx"];
const i18nDir = join(root, "lib/i18n");
const dictionaryFiles = walk(i18nDir, (f) => /\.tsx?$/.test(f) && !/\.test\./.test(f))
  .map((p) => slash(relative(i18nDir, p)))
  .filter((f) => I18N_MACHINERY.indexOf(f) < 0)
  .sort();

async function dictionaries(file: string, locale: Locale): Promise<string[]> {
  const mod = (await import(/* @vite-ignore */ "../../lib/i18n/" + file.replace(/\.tsx?$/, ""))) as Record<
    string,
    unknown
  >;
  const out: string[] = [];
  for (const name of Object.keys(mod)) {
    const v = mod[name] as Record<string, unknown> | null;
    if (!v || typeof v !== "object" || !locales.every((l) => l in v)) continue;
    // Dictionary prose carries rich.tsx's markers, which no reader is served.
    for (const s of strings(v[locale])) out.push(s.replace(/\*\*|__/g, "").replace(/\s*\|\s*/g, " "));
  }
  return out;
}

/**
 * Every string literal, template string and run of JSX text in the component
 * and route sources. A sentence typed into Footer.tsx or the consent banner is
 * in no dictionary, and a client component is in no render this suite can do,
 * so the source is read instead. Parsed, not grepped, so a comment is not copy.
 * Imports, class names and the other attributes no reader is served are left
 * out by name.
 */
const UNSERVED_ATTRS = /^(?:className|id|aria-labelledby|aria-describedby|aria-controls|href|src|key|type|rel|target|role|viewBox|d|fill|stroke|style|name|htmlFor|data-.*)$/;
function literals(file: string): string[] {
  const src = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out: string[] = [];
  const visit = (n: ts.Node): void => {
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return;
    if (ts.isJsxAttribute(n) && UNSERVED_ATTRS.test(n.name.getText(src))) return;
    if (ts.isTypeNode(n)) return;
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isJsxText(n)) out.push(n.text);
    else if (ts.isTemplateExpression(n)) out.push(n.getText(src).slice(1, -1));
    ts.forEachChild(n, visit);
  };
  visit(src);
  return out.map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
}
const sourceFiles = ["app", "components"]
  .map((d) => walk(join(root, d), (f) => /\.tsx?$/.test(f) && !/\.test\./.test(f)))
  .reduce((a, b) => a.concat(b), [])
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

/** Served html as blocks in document order: attributes a reader or crawler gets, then the text of every block element. */
function blocksOf(html: string, out: string[] = []): string[] {
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

/**
 * What a visitor is served by a page: its metadata, then its blocks. Inline
 * tags are dropped without a break, so a sentence split across <b> or a text
 * node assembled at runtime still reads as one block.
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
  return blocksOf(html, out);
}

/** The shell's server children, rendered. Nav and the consent banner are client components: their copy is reached through the dictionary walk and the source literals. */
async function shell(locale: Locale): Promise<string[]> {
  const Footer = (await import("../../components/site/Footer")).default;
  const NotFoundBody = (await import("../../components/site/NotFoundBody")).default;
  const children = [
    React.createElement(NotFoundBody, { locale, key: "404" }),
    React.createElement(Footer, { locale, key: "footer" }),
  ];
  // eslint-disable-next-line react/no-children-prop
  return blocksOf(renderToStaticMarkup(React.createElement(LocaleProvider, { locale, children })));
}

/** What is left of a sentence once everything that is not an offer is stripped. */
function offerIn(sentence: string, locale: Locale): string {
  let rest = sentence;
  for (const re of NOT_AN_OFFER[locale]) rest = rest.replace(re, " ");
  if (buildAtEverySize) for (const re of BUILD[locale]) rest = rest.replace(re, " ");
  return rest;
}

type Verdict = { offer: boolean; states: boolean; wrong: string | null; sentences: number };

/**
 * One block, judged sentence by sentence, because a condition anywhere in the
 * block used to satisfy it and "Content from the middle size up. Ad management
 * at every size" passed. Two ways for a sentence to be an offer: ads
 * vocabulary survives the strip, or the sentence mentions ads at all and what
 * survives still MANAGES something. The second is /modulos' "A Google Ads
 * build at any size, with its monthly management from M": the build phrase
 * strips, and without this the management half had no noun left and lost its
 * condition in silence.
 *
 * `states` is true when an offer sentence carries the owed size's words.
 * `wrong` names the first thing an offer sentence may not carry: another
 * size's words, the owed words negated, or any offer when no size sells ads.
 */
function judge(block: string, locale: Locale): Verdict {
  const all = block.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  const offering = all
    .map((s) => ({ s, rest: offerIn(s, locale) }))
    .filter(({ s, rest }) => ADS.test(rest) || (ADS.test(s) && MANAGES.test(rest)));
  let wrong: string | null = null;
  for (const { rest } of offering) {
    if (firstSize === null) wrong = "offered while lib/pricing.ts sells ad management at no size";
    for (const z of SIZES)
      if (z !== firstSize && SIZE[locale][z].test(rest))
        wrong = `carries the words for size ${z} while lib/pricing.ts first sells ad management at ${firstSize}`;
    if (NEGATED[locale].test(rest)) wrong = "denies the size condition it names";
  }
  const states =
    firstSize === "S" || (firstSize !== null && offering.some(({ rest }) => SIZE[locale][firstSize].test(rest)));
  return { offer: offering.length > 0, states, wrong, sentences: all.length };
}

type Offer = { page: string; block: string; bad: string | null };

/**
 * Judges a surface's blocks in order. A block that offers ads and does not
 * state the condition is excused in exactly one shape: it is a single sentence
 * (a label or a heading) and one of the two blocks after it is itself an offer
 * that states the condition cleanly. That is "Ads" above the home card and
 * precios' title above its body. It excuses silence, never a wrong size: a
 * label reading "managed for you at the entry size" fails on its own words.
 */
function judged(page: string, blocks: string[], locale: Locale): Offer[] {
  const verdicts = blocks.map((b) => judge(b, locale));
  const out: Offer[] = [];
  verdicts.forEach((v, i) => {
    if (!v.offer) return;
    const below = verdicts.slice(i + 1, i + 3).some((n) => n.offer && n.states && !n.wrong);
    const bad =
      v.wrong ??
      (v.states || (v.sentences === 1 && below)
        ? null
        : `sold with no size condition in the offering sentence while lib/pricing.ts first sells ad management at ${firstSize}`);
    out.push({ page, block: blocks[i], bad });
  });
  return out;
}

async function offers(locale: Locale): Promise<Offer[]> {
  const out: Offer[] = [];
  out.push(...judged("site shell", await shell(locale), locale));
  for (const file of dictionaryFiles) out.push(...judged("lib/i18n/" + file, await dictionaries(file, locale), locale));
  for (const page of pages) out.push(...judged(page, await served(page, locale), locale));
  return out;
}

const report = (list: Offer[]) => list.map((o) => `${o.page}: ${o.block}${o.bad ? " [" + o.bad + "]" : ""}`);

describe("every served ads claim carries the conditions lib/pricing.ts sets", () => {
  it("finds the pages, so a surface cannot be missed by not being listed", () => {
    expect(pages).toContain("./page");
    expect(pages).toContain("./industries/winery/page");
    expect(pages).toContain("./precios/page");
    // 12 until bead hq-4pu0q.8 retired /modulos. The floor is a tripwire on
    // the walk going blind, so it moves only when a page is deliberately
    // removed, and it says which one.
    expect(pages.length).toBeGreaterThanOrEqual(11);
  });

  it("finds every dictionary, and every lib/i18n file that is not machinery is one", async () => {
    expect(dictionaryFiles).toContain("consent.ts");
    expect(dictionaryFiles).toContain("site.ts");
    expect(dictionaryFiles).toContain("home.ts");
    for (const file of dictionaryFiles)
      for (const locale of locales)
        expect((await dictionaries(file, locale)).length, `lib/i18n/${file} exports no ${locale} dictionary`).toBeGreaterThan(0);
  });

  it("the pricing row names a first size this suite has words for", () => {
    // Fails loudly if ads stop being sold anywhere: that is a copy decision, not a green run.
    expect(firstSize).not.toBeNull();
  });

  it("no component or route source holds an ads sentence of its own that would fail as a served block", () => {
    // A literal has no locale, so it passes if it would pass in either one.
    expect(sourceFiles.map((f) => slash(relative(root, f)))).toContain("components/site/Footer.tsx");
    expect(sourceFiles.map((f) => slash(relative(root, f)))).toContain("components/consent/ConsentBanner.tsx");
    const bad: string[] = [];
    for (const file of sourceFiles) {
      const blocks = literals(file);
      const perLocale = locales.map((l) => judged(slash(relative(root, file)), blocks, l));
      perLocale[0].forEach((o) => {
        const everywhere = perLocale.every((list) => list.some((x) => x.block === o.block && x.bad));
        if (o.bad && everywhere && bad.indexOf(report([o])[0]) < 0) bad.push(report([o])[0]);
      });
    }
    expect(bad).toEqual([]);
  });

  for (const locale of locales) {
    it(`${locale}: the home page still makes the claim this suite was written for`, async () => {
      // A guard that finds nothing passes. The home page sells ad management
      // above its entry price line, so zero offers there means the extraction
      // broke, not that the page is clean.
      const all = await offers(locale);
      expect(all.filter((o) => o.page === "./page").length).toBeGreaterThan(0);
      expect(all.filter((o) => o.page === "lib/i18n/home.ts").length).toBeGreaterThan(0);
    });

    it(`${locale}: every ads offer states the first size lib/pricing.ts sells ad management at, and no other`, async () => {
      expect(report((await offers(locale)).filter((o) => o.bad))).toEqual([]);
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
