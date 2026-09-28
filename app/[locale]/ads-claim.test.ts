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
import {
  adsManagement,
  currencyByLocale,
  formatAmount,
  type AdsScope,
  type CurrencyCode,
} from "../../lib/pricing";

/**
 * Every ads claim on every public surface, held to lib/pricing.ts (bead
 * hq-4pu0q.20, rewritten for Daniel's direction of 2026-09-28).
 *
 * Google Ads management used to be a module add-on sold from the middle size
 * up, and this suite held every offer to that size condition. It is now a
 * standalone service anyone can buy, carried by `adsManagement` in
 * lib/pricing.ts: two scopes, a FLAT monthly fee each, never a percentage of
 * spend, and a minimum monthly ad budget the client pays straight to Google.
 * What an offer owes changed with it. The surfaces did not:
 *  - every page.tsx under app/[locale], found by walking, served per locale;
 *  - every dictionary under lib/i18n, found by walking, because the consent
 *    banner and the nav are client components no page render reaches and a
 *    dictionary added later must be covered without anyone listing it;
 *  - the shell's server children, Footer and NotFoundBody, rendered;
 *  - every string literal and JSX text in every component and route source,
 *    which is where a sentence typed straight into a .tsx file lives.
 * It is DEFAULT DENY: any block that offers ad management must say the fee is
 * flat in a sentence that makes the offer, or sit directly under a one-sentence
 * heading that says it, or be made only of phrases on the short list below
 * that are not offers of ad management. A new page, a new sentence or a
 * reworded one fails until someone rules on it. On top of that, no block
 * anywhere may claim a percentage or share of spend, and a block that states a
 * minimum budget states the one lib/pricing.ts carries.
 *
 * The owed words are derived from pricing, not asserted flat: they are owed
 * because every scope carries `percentOfSpend: false`. If that ever turns
 * true the flat-fee words become a false claim, and the suite fails loudly on
 * the policy test rather than passing a page that says "flat".
 */

type Params = { params: { locale: Locale } };
type PageModule = {
  default: (props: Params) => React.ReactElement | Promise<React.ReactElement>;
  generateMetadata?: (props: Params) => unknown;
};

/** True while every scope lib/pricing.ts sells is a flat fee. */
const flatPolicy = adsManagement.every((s) => s.percentOfSpend === false);

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

/**
 * The verbs of the service. "llevar" only as "llevamos" and "llevar": "lleva"
 * and "llevan" are mostly "takes you to" ("su anuncio lo lleva a una página"),
 * which describes the click, not the service.
 */
const MANAGES =
  /\bmanag(?:e|es|ed|ing|ement)\b|\b(?<!-)(?:run|runs|running|ran)\b|\boperat(?:e|es|ed|ing)\b|\bhandl(?:e|es|ed|ing)\b|\bmanej|\bgesti[oó]n|\badministr|\bllev(?:amos|ar)\b|\boper(?:a|an|amos|e|en|o|ar)\b/i;

/** The words that state the fee is flat, owed by every offer while `flatPolicy` holds. */
const FLAT: Record<Locale, RegExp> = {
  en: /\bflat (?:monthly )?fee\b/i,
  es: /\bcuota (?:mensual )?fija\b/i,
};

/**
 * A fee stated as a percentage or share of spend. Forbidden in every block of
 * every surface, not only in offers, unless the same clause denies it ("a
 * flat fee, never a percentage of your budget"), which is the policy said the
 * other way round. The listed phrases plus their plain variants (your, the,
 * ad, monthly).
 */
const SHARE_OF_SPEND: Record<Locale, RegExp> = {
  en: /\b(?:percent(?:age)? of (?:your |the )?(?:ad |monthly )?(?:spend|budget)|percent(?:age)? of what you spend|share of (?:your |the )?(?:ad )?spend|share of what you spend)\b/gi,
  es: /\bporcentaje (?:de la inversión|del presupuesto|de lo que (?:usted )?invierte)/gi,
};
const DENIED_BEFORE: Record<Locale, RegExp> = {
  en: /\b(?:never|not|no|nor|without)\b(?:\s+[\w,]+){0,4}\s*$/i,
  es: /\b(?:nunca|no|ni|sin|jamás)\b(?:\s+[\wáéíóúñ,]+){0,4}\s*$/i,
};

/**
 * A price or a fee: a currency figure, the placeholder a page fills with one
 * from lib/pricing.ts (lib/i18n/anuncios.ts), or the words for a fee. A "$"
 * that opens a template substitution ("${s.id}" in a source literal) is not money.
 */
const FIGURE = /\$(?!\{)|\b\d{1,3}(?:,\d{3})+\b|\{(?:local|crecimiento|minLocal|minCrecimiento|setupLocal|setupCrecimiento)\}/;
const PRICE: Record<Locale, RegExp> = {
  en: new RegExp(FIGURE.source + "|\\bfees?\\b|\\bprices?\\b|\\ba month\\b|\\bmonthly\\b", "i"),
  es: new RegExp(FIGURE.source + "|\\bcuotas?\\b|\\bprecios?\\b|\\bal mes\\b|\\bmensual(?:es)?\\b", "i"),
};

/** A sentence that states a minimum ad budget. */
const MINIMUM_BUDGET: Record<Locale, RegExp> = {
  en: /\bminimum\b[^.]*\b(?:budget|spend)\b|\b(?:budget|spend)\b[^.]*\b(?:minimum|at least)\b/i,
  es: /\bm[ií]nim[oa]\b[^.]*\b(?:presupuesto|inversi[oó]n)\b|\b(?:presupuesto|inversi[oó]n)\b[^.]*\b(?:m[ií]nim[oa]|al menos)\b/i,
};

/** The larger scope named in copy: its id, and in English its likely name too. */
const NAMES_CRECIMIENTO: Record<Locale, RegExp> = {
  en: /\b(?:crecimiento|growth)\b/i,
  es: /\bcrecimiento\b/i,
};

function scope(id: AdsScope["id"]): AdsScope {
  const found = adsManagement.filter((s) => s.id === id)[0];
  if (!found) throw new Error(`lib/pricing.ts has no ads scope ${id}`);
  return found;
}

/** A figure as the locale prints it, bounded so 10,000 does not match inside 110,000. */
function figure(amount: number, locale: Locale): RegExp {
  const text = formatAmount(amount, locale).replace(/[.,]/g, "[.,]");
  return new RegExp(`(?<![\\d.,])${text}(?!\\d|[.,]\\d)`);
}

/** Every amount a sentence prints, as numbers. */
function amountsIn(sentence: string): number[] {
  return (sentence.match(/\d{1,3}(?:,\d{3})+|\d+/g) ?? []).map((n) => Number(n.replace(/,/g, "")));
}

/**
 * Phrases that mention ads and are not an offer of ad management. Each is
 * stripped from a block before the block is judged, so a block is exempt only
 * if NOTHING about ads is left once they are gone: "your ads, managed for a
 * set price" strips to a sentence that still has to carry the words.
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
    // Showcase positioning line: marketing as a whole, carrying no fee and no
    // scope. Flagged on the bead for Daniel, not an ad management offer.
    /\bwe run the marketing that fills the tasting room\b/g,
    /\bwhich ads brought them here\b/g,
    // About: what the founders have worked in, no offer and no price.
    /\bGoogle Ads, websites\b/g,
    // About, the one-line statement of the three services (2026-09-28). The
    // verb makes it read as an offer; it names a service and prices nothing,
    // and /anuncios and /precios carry the fee.
    /\bCardon Digital builds websites, runs Google Ads and builds the software an owner-run business operates on\b/g,
    // Site description, a positioning line.
    /\bAds, website, and operations\b/g,
    // /modulos L scale line: what a business that size already runs.
    /\bdirect booking and ads\b/g,
    // Terms: points at the site's description and defers to the signed
    // agreement for scope and amounts. Flagged on the bead, not an offer.
    /Where the site describes[^.]*ad management inside the monthly fee/g,
    // The one-time campaign build is a setup line, not the monthly
    // management the flat-fee words are about.
    /\b(?:Google )?Ads build\b/gi,
    /\bCampaign build\b/gi,
    // Added for /anuncios (lib/i18n/anuncios.ts), 2026-09-28. Measurement:
    // the call is attributed to the ad, like "which ads brought them here".
    /\bwith the ad that brought it\b/g,
    // The client's own account, which is a statement of ownership.
    /\bThe Google Ads account is yours\b/g,
    // Objections, in the reader's words (/anuncios and the home page).
    /\bI (?:tried|paid for) ads once\b/g,
    // A scope's counts, which are lib/pricing.ts data (campaigns, adGroups)
    // printed inside a card whose fee line says flat.
    /\bone search campaign\b/gi,
    /\bup to (?:two|three|\d+) campaigns\b/gi,
    /\b(?:(?:and )?(?:up to )?(?:\w+ )?)ad groups\b/gi,
    /\bhow many campaigns\b/gi,
    // The three services named as a list, with no claim about any of them:
    // the same class as "Ads, website, and operations" above.
    /\bWebsites, (?:Google )?ads,? and (?:custom )?software\b/gi,
    /\ba site, a campaign or a system\b/g,
    // A page's bare name, as a nav label, eyebrow or link: names the page and
    // offers nothing. Anchored, so a label with a single word more is judged.
    /^(?:See )?(?:Google )?Ads$/i,
  ],
  es: [
    /\bsus anuncios\b/gi,
    /\b(?:inversión en|presupuesto de) anuncios\b/gi,
    /\bmedición de conversiones de Google Ads\b/g,
    /\bmedición de Google Analytics y Google Ads\b/g,
    /\bfines de mercadotecnia\b/g,
    /\bbase de datos de mercadotecnia\b/g,
    /\boperamos el marketing que llena la sala de degustación/g,
    /\bqué anuncios trajeron\b/g,
    /\bGoogle Ads, sitios web\b/g,
    /\bCardon Digital hace sitios web, maneja anuncios en Google y construye el software con el que opera un negocio\b/g,
    /\breserva directa y anuncios\b/g,
    /Donde el sitio describe[^.]*manejo de anuncios dentro de la cuota mensual/g,
    // Terms again: data handling, which is not ads and shares the verb.
    /\bmanejo de datos\b/g,
    /\bconstrucción de (?:Google Ads|anuncios|la campaña)\b/gi,
    // Added for /anuncios, the same five as in English.
    /\bcon el anuncio que lo trajo\b/g,
    /\bLa cuenta de Google Ads es suya\b/g,
    /\bYa (?:probé|pagué) anuncios\b/g,
    /\buna campaña de búsqueda\b/gi,
    /\bhasta (?:dos|tres|\d+) campañas\b/gi,
    /\b(?:(?:y )?(?:hasta )?(?:\w+ )?)grupos de anuncios\b/gi,
    /\bcuántas campañas\b/gi,
    /\bsitios web, anuncios(?: en Google)? y software(?: a la medida)?\b/gi,
    /\bun sitio, una campaña o un sistema\b/g,
    /^(?:Ver )?anuncios(?: en Google)?$/i,
  ],
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
/**
 * Dictionaries no route serves. modulos.ts belongs to the retired /modulos
 * page: its route is a 308 to /precios and no page renders it, so its module-
 * gated ads lines ("with its monthly management from M") reach no reader.
 * precios.test.ts still reads it as a policy source, which is why it exists.
 * If a page imports it again, take it off this list.
 */
const UNSERVED_DICTIONARIES = ["modulos.ts"];
const i18nDir = join(root, "lib/i18n");
const dictionaryFiles = walk(i18nDir, (f) => /\.tsx?$/.test(f) && !/\.test\./.test(f))
  .map((p) => slash(relative(i18nDir, p)))
  .filter((f) => I18N_MACHINERY.indexOf(f) < 0 && UNSERVED_DICTIONARIES.indexOf(f) < 0)
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
    // A bare lowercase token ("anuncios" as a card's id) is a key or a slug
    // the page matches on, never copy; a served label is judged on the render.
    for (const s of strings(v[locale]))
      if (!/^[a-z0-9-]+$/.test(s)) out.push(s.replace(/\*\*|__/g, "").replace(/\s*\|\s*/g, " "));
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
  // A route path ("/anuncios" in the sitemap) is an address, not copy.
  return out
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s && !/^\/[\w\-/[\]]*$/.test(s));
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
  return rest;
}

function sentencesOf(block: string): string[] {
  return block.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
}

/** Every place a block states a fee as a share of spend without denying it. */
function shareOfSpendClaims(block: string, locale: Locale): string[] {
  const out: string[] = [];
  for (const sentence of sentencesOf(block)) {
    const re = new RegExp(SHARE_OF_SPEND[locale].source, "gi");
    let m = re.exec(sentence);
    while (m !== null) {
      const clause = sentence.slice(0, m.index).split(/[;:]/).pop() ?? "";
      if (!DENIED_BEFORE[locale].test(clause)) out.push(m[0]);
      m = re.exec(sentence);
    }
  }
  return out;
}

/**
 * What a block that states a minimum budget owes. Each such sentence prints
 * the local scope's minimum in the locale's currency, or the crecimiento
 * scope's when the block names that scope, and prints no other amount that is
 * not an ads figure lib/pricing.ts carries: "a minimum of 5,000" fails, and so
 * does "10,000 or more for Local, 20,000 for Crecimiento".
 */
function budgetProblem(block: string, locale: Locale): string | null {
  const currency: CurrencyCode = currencyByLocale[locale];
  const local = scope("local");
  const crecimiento = scope("crecimiento");
  const namesCrecimiento = NAMES_CRECIMIENTO[locale].test(block);
  const owed = [local.minimumBudget[currency]];
  if (namesCrecimiento) owed.push(crecimiento.minimumBudget[currency]);
  // Every ads figure, in either currency, is a legitimate number to print
  // beside a budget; so are the small counts of the scope (campaigns, groups).
  const known = new Set<number>();
  for (const s of adsManagement) {
    for (const f of [s.monthly, s.setup, s.minimumBudget]) {
      known.add(f.MXN);
      known.add(f.USD);
    }
  }
  // A dictionary sentence may carry the figure as the placeholder the page
  // fills from lib/pricing.ts; the served render of that page is then judged
  // on the filled figure. Only the placeholder of the owed scope counts.
  const owedTokens = namesCrecimiento ? ["{minLocal}", "{minCrecimiento}"] : ["{minLocal}"];
  for (const sentence of sentencesOf(block)) {
    if (!MINIMUM_BUDGET[locale].test(sentence)) continue;
    // A label ("Minimum monthly budget") prints no figure and states none.
    if (amountsIn(sentence).length === 0 && !/\{\w+\}/.test(sentence)) continue;
    if (owedTokens.some((t) => sentence.includes(t))) continue;
    if (!owed.some((amount) => figure(amount, locale).test(sentence))) {
      return `states a minimum budget without ${owed
        .map((a) => formatAmount(a, locale))
        .join(" or ")} ${currency}, the figure lib/pricing.ts carries`;
    }
    const stray = amountsIn(sentence).filter((n) => n >= 100 && !known.has(n));
    if (stray.length > 0) return `states a minimum budget beside amounts lib/pricing.ts does not carry: ${stray.join(", ")}`;
    if (!namesCrecimiento && figure(crecimiento.minimumBudget[currency], locale).test(sentence)) {
      return "prints the crecimiento minimum without naming that scope";
    }
  }
  return null;
}

type Verdict = {
  offer: boolean;
  states: boolean;
  /** The block says the fee is flat anywhere, which is what a heading lends the block beside it. */
  flatWords: boolean;
  wrong: string | null;
  sentences: number;
};

/**
 * One block. It OWES the flat-fee words only when it makes an offer, which is
 * docs/copy-doctrine.md section 10: the check protects a good-faith author, so
 * a sentence that describes what an ad does or what happens after the click
 * ("your ad comes up and takes them to a page", "ads that say what you sell")
 * owes nothing. A block offers when:
 *  (a) after the NOT_AN_OFFER strip it still mentions ads AND it states a
 *      price or a fee (PRICE), or
 *  (b) one of its sentences mentions ads AND what survives the strip of that
 *      sentence MANAGES something,
 *      which keeps "a Google Ads build, with its monthly management" an offer
 *      after the build phrase strips.
 * The words may sit anywhere in the block; `judged` also lets a heading lend
 * them. `wrong` is judged on every block, offer or not, and is DEFAULT DENY:
 * a share-of-spend claim, a minimum budget that is not lib/pricing.ts's, or
 * any offer at all while the policy is not flat.
 */
function judge(block: string, locale: Locale): Verdict {
  const all = sentencesOf(block);
  const rest = offerIn(block, locale);
  // (b) is judged sentence by sentence: in a long block a managing verb three
  // sentences away from an ads word ("the paid year runs to its end") is not
  // an offer of ad management.
  const manages = all.some((sentence) => ADS.test(sentence) && MANAGES.test(offerIn(sentence, locale)));
  const offer = (ADS.test(rest) && PRICE[locale].test(rest)) || manages;
  let wrong: string | null = null;
  const claims = shareOfSpendClaims(block, locale);
  if (claims.length > 0) wrong = `claims a share of spend (${claims.join(", ")}) while lib/pricing.ts charges a flat fee`;
  if (offer && !flatPolicy) wrong = "offered as a flat fee while lib/pricing.ts has a scope priced on spend";
  wrong = wrong ?? budgetProblem(block, locale);
  const flatWords = flatPolicy && FLAT[locale].test(block);
  return { offer, states: flatWords, flatWords, wrong, sentences: all.length };
}

type Offer = { page: string; block: string; bad: string | null };

/**
 * Judges a surface's blocks in order. A block that offers ads and does not say
 * the fee is flat is excused in two shapes, both about headings:
 *  - it sits directly under a one-sentence heading that says it ("Google Ads
 *    management, one flat monthly fee." above the body);
 *  - it is itself a single sentence (a label or a heading) and one of the two
 *    blocks after it says it cleanly ("Ads" above a card).
 * A heading excuses silence, never a wrong claim: `wrong` fails on its own.
 * A block that states a minimum budget or a share of spend is judged whether
 * or not it is an offer.
 */
function judged(page: string, blocks: string[], locale: Locale): Offer[] {
  const verdicts = blocks.map((b) => judge(b, locale));
  const out: Offer[] = [];
  verdicts.forEach((v, i) => {
    if (!v.offer && !v.wrong) return;
    const above = i > 0 && verdicts[i - 1].sentences === 1 && verdicts[i - 1].flatWords && !verdicts[i - 1].wrong;
    const below = verdicts.slice(i + 1, i + 3).some((n) => n.flatWords && !n.wrong);
    const bad =
      v.wrong ??
      (v.states || above || (v.sentences === 1 && below)
        ? null
        : "offers ad management (a price or a managing verb beside ads) without saying the fee is flat in the block or the heading directly above");
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

describe("every served ads claim carries the policy lib/pricing.ts sets", () => {
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

  it("lib/pricing.ts still sells ad management, at a flat fee, with the budget paid straight to Google", () => {
    // Fails loudly if the policy moves: "flat fee" on the site would then be
    // false, and that is a copy decision, not a green run.
    expect(adsManagement.length).toBeGreaterThan(0);
    expect(adsManagement.filter((s) => s.percentOfSpend !== false).map((s) => s.id)).toEqual([]);
    expect(adsManagement.filter((s) => s.budgetThroughCardon !== false).map((s) => s.id)).toEqual([]);
    expect(flatPolicy).toBe(true);
    expect(scope("local").minimumBudget.MXN).toBeLessThan(scope("crecimiento").minimumBudget.MXN);
  });

  it("the phrase rules catch what they are for", () => {
    // A guard whose regexes drifted passes everything, so pin each one.
    expect(judge("Google Ads management for a flat monthly fee.", "en").states).toBe(true);
    expect(judge("Manejo de Google Ads por una cuota mensual fija.", "es").states).toBe(true);
    expect(judge("We manage your Google Ads for 5,500 a month.", "en")).toMatchObject({ offer: true, states: false });
    expect(judge("Google Ads from {local} a month.", "en").offer).toBe(true);
    expect(judge("Anuncios en Google por $5,500 al mes.", "es").offer).toBe(true);
    // Descriptive sentences owe nothing (copy doctrine section 10).
    expect(judge("Your ad comes up and takes them to a page that says what the ad said.", "en").offer).toBe(false);
    expect(judge("Anuncios que dicen lo que usted vende.", "es").offer).toBe(false);
    expect(judge("Google Ads management for 15 percent of spend.", "en").wrong).not.toBeNull();
    expect(judge("Google Ads management, a share of spend.", "en").wrong).not.toBeNull();
    expect(judge("A flat fee, never a percentage of your budget.", "en").wrong).toBeNull();
    expect(judge("Cobramos un porcentaje de la inversión.", "es").wrong).not.toBeNull();
    expect(judge("Una cuota fija, nunca un porcentaje de lo que usted invierte.", "es").wrong).toBeNull();
    const local = formatAmount(scope("local").minimumBudget.MXN, "es");
    expect(judge(`Con un presupuesto mínimo de $${local} MXN al mes.`, "es").wrong).toBeNull();
    expect(judge("Con un presupuesto mínimo de $5,000 MXN al mes.", "es").wrong).not.toBeNull();
    const usd = formatAmount(scope("local").minimumBudget.USD, "en");
    expect(judge(`A minimum ad budget of $${usd} USD a month.`, "en").wrong).toBeNull();
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
      // A guard that finds nothing passes. The home page sells ad management,
      // so zero offers there means the extraction broke, not that the page is
      // clean.
      const all = await offers(locale);
      expect(all.filter((o) => o.page === "./page").length).toBeGreaterThan(0);
      expect(all.filter((o) => o.page === "lib/i18n/home.ts").length).toBeGreaterThan(0);
    });

    it(`${locale}: every ads offer says the fee is flat, and nothing claims a share of spend or another minimum`, async () => {
      expect(report((await offers(locale)).filter((o) => o.bad))).toEqual([]);
    });
  }
});
