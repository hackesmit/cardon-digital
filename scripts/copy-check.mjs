#!/usr/bin/env node
/**
 * copy-check: the runnable half of docs/copy-doctrine.md.
 *
 * Reads lib/i18n/<page>.ts, pulls the string literals out of the `en` and `es`
 * declarations, and checks each locale on its own. It never writes to lib/i18n.
 *
 *   node scripts/copy-check.mjs home winery
 *   node scripts/copy-check.mjs --all
 *
 * Exit 0 clean, 1 on a violation, 2 on a usage or config error.
 *
 * No dependencies. Node built-ins only.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/**
 * The word target table. One line per page, one target per LOCALE, because a
 * single number for both locales hands the shorter one free headroom.
 *
 * `budget` is half of what that locale measured when the doctrine landed,
 * which is doctrine section 7 rule 1 ("half the words"). `measured` is that
 * landing number, kept so a later reader can see where the page started.
 *
 * ADVISORY, never blocking (Daniel's decision on escalation hq-9qqdm). A
 * locale over its target is reported as a note and the page still exits 0.
 *
 * Why it is not a blocking ratchet. It used to be, in both directions: over
 * the number failed, and so did a page more than 25 words UNDER it, which
 * printed the lower number to write into this table. A rewritten page hit the
 * second rule, and writing the number it printed then failed the suite, which
 * pins every line here to half of `measured`. No value of this table let a
 * rewritten page pass both, and the only file that could resolve it is this
 * one, which no rewrite bead owns. Half the words is still the target; it is
 * carried where a human can judge it, in each rewrite bead's own Definition of
 * Done. This checker does not claim a ratchet it cannot enforce.
 */
export const PAGES = {
  home: { en: { budget: 696, measured: 1391 }, es: { budget: 785, measured: 1570 } },
  winery: { en: { budget: 828, measured: 1656 }, es: { budget: 941, measured: 1882 } },
  "monte-xanic": { en: { budget: 684, measured: 1367 }, es: { budget: 763, measured: 1526 } },
  enkanto: { en: { budget: 1191, measured: 2381 }, es: { budget: 1277, measured: 2553 } },
  modulos: { en: { budget: 1404, measured: 2808 }, es: { budget: 1545, measured: 3090 } },
  precios: { en: { budget: 650, measured: 1300 }, es: { budget: 717, measured: 1434 } },
  showcase: { en: { budget: 325, measured: 649 }, es: { budget: 337, measured: 673 } },
  about: { en: { budget: 231, measured: 461 }, es: { budget: 237, measured: 474 } },
  contact: { en: { budget: 288, measured: 576 }, es: { budget: 273, measured: 545 } },
};

/**
 * At most three emphasis spans per locale. Both of rich.tsx's markers count:
 * `**x**` renders a <b> and `__x__` renders a coloured accent span, so a rule
 * written against `**` alone is one `sed 's/[*][*]/__/g'` away from being
 * bypassed while the page still shouts.
 */
export const MAX_BOLD = 3;

/**
 * One deliberate contrast per page per locale, kept on purpose. The entry is
 * the exact dictionary string that carries it, so the exemption reads in the
 * diff. More than one entry for a page and locale is a config error, and the
 * cap is counted a second time in OCCURRENCES while the page is checked:
 * `ALLOWLIST_PER_LOCALE` entries used to exempt any number of contrasts,
 * because one string can carry several and the cap counted array entries.
 */
export const CONTRAST_ALLOWLIST = {
  // home: { en: ["..."], es: ["..."] },
};

export const ALLOWLIST_PER_LOCALE = 1;

/**
 * Spanish determiners. `no es` on its own is ordinary negation ("no es
 * deducible", "no es algo que la ley permita"), but `no es` followed by an
 * article or `otro` is the definitional shape the doctrine bans ("No es otra
 * suscripcion", "no son el precio de entrada"). See the doctrine header.
 */
const ES_DETERMINER = "un|una|unos|unas|el|la|los|las|otro|otra|otros|otras";

/**
 * The definitional shapes. Each is matched case-insensitively against the
 * dictionary string with the emphasis markers stripped.
 *
 * The Spanish shapes carry word boundaries so "mano es" and "camino otro" do
 * not read as "no es" and "no otro".
 */
/**
 * "not X but Y" in the general form, which is the headline Claudism and the
 * whole point of this linter. It used to permit only a|an|the|just|only|
 * another after "not", so "This is not software but certainty." walked
 * straight through the rule written to catch it.
 *
 * Two things keep it off honest prose. It never crosses a clause boundary
 * (`.`, `;`, `:`, `!`, `?`), so "We do not guess. But we do measure." is clean,
 * and the two halves have to be close: at most 60 characters apart, which is
 * about the distance a replacement stays readable over. "You will not wait
 * sixty days for the invoice, because the module files it the same afternoon,
 * but that is a different page." is clean for that reason. `n't` counts,
 * because "It isn't a report but a decision." is the same sentence.
 *
 * Today it hits nothing on any of the nine pages, honest or otherwise. An
 * honest English line that really is shaped this way goes in
 * CONTRAST_ALLOWLIST, where a reviewer sees it, exactly like `, not `.
 */
const NOT_BUT = /\b(?:not|\w+n['\u2019]t)\b[^.;:!?]{0,60}?\bbut\b/gi;

export const BLOCKING_SHAPES = [
  { id: ", not", locale: "en", re: /,\s+not\s/gi },
  { id: "not just", locale: "en", re: /\bnot just\b/gi },
  { id: "not another", locale: "en", re: /\bnot another\b/gi },
  { id: "never a", locale: "en", re: /\bnever an?\b/gi },
  { id: "not X but Y", locale: "en", re: NOT_BUT },
  { id: "no es/son + article", locale: "es", re: new RegExp(`\\bno (?:es|son)\\s+(?:${ES_DETERMINER})\\b`, "gi") },
  { id: "no solo", locale: "es", re: /\bno s[o\u00f3]lo\b/gi },
  { id: ", sino", locale: "es", re: /,\s+sino\b/gi },
  { id: "no otra", locale: "es", re: /\bno otra\b/gi },
  { id: "no otro", locale: "es", re: /\bno otro\b/gi },
];

/**
 * Real tells, but not separable from honest prose by any lexical rule.
 * Reported on every run, never blocking. See the doctrine header.
 *
 * `rather than` / `instead of`: "four minutes instead of forty" is the copy
 * the doctrine asks for.
 * `no es` / `no son` without an article: "un gasto sin CFDI no es deducible"
 * is a tax fact and "no son datos de cliente" is the honesty disclaimer the
 * doctrine wants kept, but "no es administracion. Es la unica forma" is a
 * definitional contrast. Spanish does not separate the two lexically, so a
 * human reads every hit.
 */
export const ADVISORY_SHAPES = [
  { id: "rather than", locale: "en", re: /\brather than\b/gi },
  { id: "instead of", locale: "en", re: /\binstead of\b/gi },
  {
    id: "no es/son (plain negation)",
    locale: "es",
    re: new RegExp(`\\bno (?:es|son)\\b(?!\\s+(?:${ES_DETERMINER})\\b)`, "gi"),
  },
];

export const EM_DASH = /\u2014/g;

/** rich.tsx renders these two markers, and `|` is its line break. */
const BOLD_SPAN = /\*\*[^*]*\*\*/g;
const ACCENT_SPAN = /__[^_]*__/g;

function stripMarkers(text) {
  return text.replace(/\*\*|__/g, "").replace(/\|/g, " ");
}

function decodeEscapes(raw) {
  const simple = { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f", v: "\v", "0": "\0" };
  return raw.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/g, (_m, esc) => {
    if ((esc[0] === "u" || esc[0] === "x") && esc.length > 1) {
      const hex = esc[1] === "{" ? esc.slice(2, -1) : esc.slice(1);
      return String.fromCodePoint(parseInt(hex, 16));
    }
    if (esc === "\n") return "";
    return Object.prototype.hasOwnProperty.call(simple, esc) ? simple[esc] : esc;
  });
}

/**
 * Finds the `=` that opens a declaration's initializer, starting just after the
 * declaration name, so a type annotation carrying its own braces
 * (`const en: Record<string, { h: string }> = {`) does not get scanned as if it
 * were the copy. Returns the index just after the `=`, or -1.
 */
function findAssignment(src, from) {
  let depth = 0;
  let i = from;
  while (i < src.length) {
    const c = src[i];
    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      i++;
      while (i < src.length && src[i] !== quote) i += src[i] === "\\" ? 2 : 1;
      i++;
      continue;
    }
    if (c === "{" || c === "[" || c === "(") { depth++; i++; continue; }
    if (c === "}" || c === "]" || c === ")") { depth--; i++; continue; }
    if (c === ";" && depth === 0) return -1;
    if (c === "=" && depth === 0 && src[i + 1] !== "=" && src[i + 1] !== ">" && !"=!<>".includes(src[i - 1])) {
      return i + 1;
    }
    i++;
  }
  return -1;
}

/** Values that are not copy and never were: a dictionary may hold them. */
const SCALAR = /^(?:-?(?:\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?|0[xXbBoO][\da-fA-F_]+)n?|true|false|null|undefined)$/;

/** A `/` here opens a regex literal rather than dividing. */
function regexCanStart(prev) {
  return prev === "" || "(,=:[!&|?{};+-*%~^<>".includes(prev);
}

/**
 * Walks one declaration's initializer and returns every string literal that is
 * in VALUE position, with the line it starts on.
 *
 * What it handles, because the rewrite beads own these files next:
 *   - string, template, array and object initializers, at any nesting;
 *   - quoted and computed object keys, which are not copy and are skipped;
 *   - comments, so an apostrophe in prose cannot open a string and a banned
 *     phrase in a comment cannot fail a page;
 *   - template substitutions walked as code, including regex literals, so a
 *     `}` inside `/}/g` does not end the substitution early.
 * Anything else is a loud extraction error, never a silent zero. That holds at
 * every depth: `body: buildCopy(x)` two levels into a dictionary is copy this
 * checker cannot read, exactly like `const enCopy = buildCopy(x)` at the top,
 * and it used to be swallowed in silence while the page measured short.
 */
function scanInitializer(src, start, label, known = new Set()) {
  const strings = [];
  const errors = [];
  let substDepth = 0;
  let line = 1;
  for (let k = 0; k < start; k++) if (src[k] === "\n") line++;
  let i = start;

  const bump = (n = 1) => {
    for (let k = 0; k < n && i < src.length; k++) {
      if (src[i] === "\n") line++;
      i++;
    }
  };

  function skipTrivia() {
    for (;;) {
      if (i >= src.length) return;
      const c = src[i];
      if (c === " " || c === "\t" || c === "\r" || c === "\n") { bump(); continue; }
      if (c === "/" && src[i + 1] === "/") {
        while (i < src.length && src[i] !== "\n") bump();
        continue;
      }
      if (c === "/" && src[i + 1] === "*") {
        bump(2);
        while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) bump();
        bump(2);
        continue;
      }
      return;
    }
  }

  function readString(record) {
    const quote = src[i];
    const startLine = line;
    bump();
    let raw = "";
    while (i < src.length && src[i] !== quote) {
      if (src[i] === "\\") { raw += src.slice(i, i + 2); bump(2); continue; }
      raw += src[i];
      bump();
    }
    bump();
    if (record) strings.push({ value: decodeEscapes(raw), line: startLine });
  }

  function readTemplate(record) {
    bump();
    for (;;) {
      const startLine = line;
      let raw = "";
      while (i < src.length && src[i] !== "`" && !(src[i] === "$" && src[i + 1] === "{")) {
        if (src[i] === "\\") { raw += src.slice(i, i + 2); bump(2); continue; }
        raw += src[i];
        bump();
      }
      if (record) strings.push({ value: decodeEscapes(raw), line: startLine });
      if (i >= src.length) return;
      if (src[i] === "`") { bump(); return; }
      bump(2);
      substDepth++;
      readExpression("}", record);
      substDepth--;
      if (src[i] === "}") bump();
    }
  }

  function readRegex() {
    bump();
    let inClass = false;
    while (i < src.length) {
      const c = src[i];
      if (c === "\n") return;
      if (c === "\\") { bump(2); continue; }
      if (c === "[") inClass = true;
      else if (c === "]") inClass = false;
      else if (c === "/" && !inClass) { bump(); break; }
      bump();
    }
    while (i < src.length && /[a-z]/.test(src[i])) bump();
  }

  /** Consumes code until one of `stop` at this depth. Leaves `i` on it. */
  function readExpression(stop, record) {
    let prev = "";
    for (;;) {
      skipTrivia();
      if (i >= src.length) return;
      const c = src[i];
      if (stop.includes(c)) return;
      if (c === '"' || c === "'") { readString(record); prev = '"'; continue; }
      if (c === "`") { readTemplate(record); prev = "`"; continue; }
      if (c === "{") { bump(); readObject(record); if (src[i] === "}") bump(); prev = "}"; continue; }
      if (c === "[") { bump(); readArray(record); if (src[i] === "]") bump(); prev = "]"; continue; }
      if (c === "(") { bump(); readExpression(")", record); if (src[i] === ")") bump(); prev = ")"; continue; }
      if (c === "/" && regexCanStart(prev)) { readRegex(); prev = "x"; continue; }
      prev = c;
      bump();
    }
  }

  /** Consumes one key and returns its source text. Keys are never copy. */
  function readKey() {
    skipTrivia();
    const from = i;
    const c = src[i];
    if (c === '"' || c === "'") { readString(false); return src.slice(from, i); }
    if (c === "`") { readTemplate(false); return src.slice(from, i); }
    if (c === "[") { bump(); readExpression("]", false); if (src[i] === "]") bump(); return src.slice(from, i); }
    while (i < src.length && !":,}".includes(src[i]) && !" \t\r\n".includes(src[i])) {
      if (src[i] === "(") { bump(); readExpression(")", false); if (src[i] === ")") bump(); continue; }
      bump();
    }
    return src.slice(from, i);
  }

  /**
   * One value in a dictionary: an object property's value or an array entry.
   * Here, unlike anywhere else in the walk, copy has to BE a literal, because a
   * value assembled somewhere else is copy this checker cannot see. Numbers,
   * booleans and null are not copy and pass quietly; anything else is a loud
   * error naming the key and the line.
   *
   * Template substitutions are ordinary code and are exempt (`substDepth`):
   * `${plural(n, { one: "dia" })}` is not a dictionary. So is a reference to
   * another locale declaration in the same file, because that declaration is
   * scanned in its own right: contact.ts writes `description: enDescription`
   * and those words are counted once, at `const enDescription`.
   */
  function readValue(stop, record, what) {
    skipTrivia();
    const startLine = line;
    const from = i;
    const c = src[i];
    let literal = true;
    if (c === '"' || c === "'") readString(record);
    else if (c === "`") readTemplate(record);
    else if (c === "{") { bump(); readObject(record); if (src[i] === "}") bump(); }
    else if (c === "[") { bump(); readArray(record); if (src[i] === "]") bump(); }
    else literal = false;

    if (literal) {
      skipTrivia();
      if (i >= src.length || stop.includes(src[i])) return;
      // `["a"] as const` and `{ ... } satisfies Dict` are still literal copy.
      if (/^(?:as|satisfies)\b/.test(src.slice(i, i + 10))) { readExpression(stop, false); return; }
    }

    readExpression(stop, false);
    if (!record || substDepth > 0) return;
    const text = src.slice(from, i).trim().replace(/\s+/g, " ");
    if (SCALAR.test(text) || known.has(text)) return;
    errors.push(
      `${label} (line ${startLine}): ${what} is not a string, template, array or object literal, so copy-check cannot read it: ${text.slice(0, 60)}. Give the locale its copy as a literal.`,
    );
  }

  function readObject(record) {
    for (;;) {
      skipTrivia();
      if (i >= src.length || src[i] === "}") return;
      if (src[i] === ",") { bump(); continue; }
      const keyLine = line;
      const key = readKey();
      if (record && substDepth === 0 && key.startsWith("...")) {
        errors.push(
          `${label} (line ${keyLine}): a spread (${key.slice(0, 40)}) can carry copy copy-check cannot read. Write the strings into this dictionary.`,
        );
      }
      skipTrivia();
      if (src[i] === ":") { bump(); readValue(",}", record, `the value of ${key.trim() || "a key"}`); continue; }
      if (src[i] === "{") { bump(); readObject(record); if (src[i] === "}") bump(); continue; }
    }
  }

  function readArray(record) {
    for (;;) {
      skipTrivia();
      if (i >= src.length || src[i] === "]") return;
      if (src[i] === ",") { bump(); continue; }
      readValue(",]", record, "an array entry");
    }
  }

  skipTrivia();
  const c = src[i];
  if (c === '"' || c === "'") readString(true);
  else if (c === "`") readTemplate(true);
  else if (c === "{") { bump(); readObject(true); if (src[i] === "}") bump(); }
  else if (c === "[") { bump(); readArray(true); if (src[i] === "]") bump(); }
  else {
    errors.push(
      `${label}: the initializer is not a string, template, array or object literal, so copy-check cannot read it. Give the locale its copy as a literal, or rename the declaration so it is not read as copy.`,
    );
    readExpression(";", false);
  }

  return { strings, errors, end: i };
}

/**
 * Every top-level `const en...` / `const es...` declaration belongs to its
 * locale, so contact.ts's `enIntro` and `esDescription` are counted with the
 * page they feed. `export const` counts too.
 */
const DECL_RE = /^(?:export\s+)?const\s+(en|es)([A-Z]\w*)?\b/gm;

export function extractLocaleStrings(source) {
  const byLocale = { en: [], es: [], errors: [] };

  // Every locale declaration in the file, gathered first: one of them naming
  // another (`intro: enIntro`) is copy this checker already counts.
  const known = new Set();
  DECL_RE.lastIndex = 0;
  let d;
  while ((d = DECL_RE.exec(source)) !== null) known.add(d[1] + (d[2] ?? ""));

  DECL_RE.lastIndex = 0;
  let m;
  while ((m = DECL_RE.exec(source)) !== null) {
    const label = m[0].replace(/^export\s+/, "").replace(/\s+/g, " ");
    const eq = findAssignment(source, m.index + m[0].length);
    if (eq === -1) {
      byLocale.errors.push(`${label}: no "=" initializer found, so its copy cannot be read`);
      continue;
    }
    const { strings, errors, end } = scanInitializer(source, eq, label, known);
    byLocale[m[1]].push(...strings);
    byLocale.errors.push(...errors);
    DECL_RE.lastIndex = Math.max(DECL_RE.lastIndex, end);
  }
  return byLocale;
}

export function countWords(strings) {
  let n = 0;
  for (const s of strings) {
    for (const token of stripMarkers(s.value).split(/\s+/)) {
      if (/[\p{L}\p{N}]/u.test(token)) n++;
    }
  }
  return n;
}

/**
 * Counts emphasis the way rich.tsx renders it: a span is a marker pair with
 * something between it, and any marker left over renders as literal asterisks
 * or underscores on the page. Both are per string, because rich() runs per
 * string and two separately malformed strings do not cancel out.
 */
export function countEmphasis(value) {
  const spans = [];
  for (const re of [BOLD_SPAN, ACCENT_SPAN]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(value)) !== null) {
      if (m[0].length > 4) spans.push(m[0]);
      else re.lastIndex = m.index + 2;
    }
  }
  let rest = value;
  for (const re of [BOLD_SPAN, ACCENT_SPAN]) {
    rest = rest.replace(re, (span) => (span.length > 4 ? "" : span));
  }
  const strays = (rest.match(/\*\*|__/g) ?? []).length;
  return { spans: spans.length, strays };
}

function excerpt(text, index, length) {
  const from = Math.max(0, index - 30);
  const to = Math.min(text.length, index + length + 30);
  return (from > 0 ? "..." : "") + text.slice(from, to).trim() + (to < text.length ? "..." : "");
}

/**
 * Returns every blocking hit, plus `used`: how many OCCURRENCES each allowlist
 * entry suppressed. The count is what the cap is applied to, because one
 * string can carry several contrasts.
 */
function matchShapes(strings, shapes, locale, allowed) {
  const hits = [];
  const used = new Map();
  for (const s of strings) {
    const text = stripMarkers(s.value);
    for (const shape of shapes) {
      if (shape.locale !== locale) continue;
      shape.re.lastIndex = 0;
      let m;
      while ((m = shape.re.exec(text)) !== null) {
        if (m[0].length === 0) { shape.re.lastIndex++; continue; }
        if (allowed && allowed.has(s.value)) { used.set(s.value, (used.get(s.value) ?? 0) + 1); continue; }
        hits.push({ shape: shape.id, line: s.line, text: excerpt(text, m.index, m[0].length) });
      }
    }
  }
  return { hits, used };
}

/**
 * Checks one page's source. Returns violations (exit 1), advisories (never
 * block) and the stats worth printing on a clean run.
 */
export function checkSource(page, source, options = {}) {
  const limits = options.limits ?? PAGES[page];
  const allowlist = options.allowlist ?? CONTRAST_ALLOWLIST;
  if (!limits) throw new Error(`no budget line for page "${page}"`);

  const byLocale = extractLocaleStrings(source);
  const violations = [];
  const advisories = [];
  const stats = {};

  for (const e of byLocale.errors) violations.push({ locale: "-", rule: "extract", text: e });

  for (const locale of ["en", "es"]) {
    const strings = byLocale[locale];
    const allowed = new Set(allowlist?.[page]?.[locale] ?? []);
    const words = countWords(strings);
    const budget = limits[locale].budget;
    stats[locale] = { strings: strings.length, words, bold: 0, budget };

    if (strings.length === 0) {
      violations.push({ locale, rule: "extract", text: `no ${locale} strings found; is there a "const ${locale} = {" block?` });
      continue;
    }

    if (words > budget) {
      advisories.push({
        locale,
        rule: "words",
        text: `${words} words against a target of ${budget} (half of the ${limits[locale].measured} this page carried when the doctrine landed). Advisory: the number that gates a rewrite lives in that bead's own Definition of Done.`,
      });
    }

    let bold = 0;
    for (const s of strings) {
      const { spans, strays } = countEmphasis(s.value);
      bold += spans;
      if (strays) {
        violations.push({
          locale,
          rule: "bold",
          line: s.line,
          text: `${strays} stray "**" or "__" marker(s) in one string, so the marker renders as text: ${excerpt(s.value, 0, 60)}`,
        });
      }
    }
    stats[locale].bold = bold;
    if (bold > MAX_BOLD) {
      violations.push({ locale, rule: "bold", text: `${bold} emphasis spans ("**" and "__" both render), at most ${MAX_BOLD} allowed` });
    }

    const { hits, used } = matchShapes(strings, BLOCKING_SHAPES, locale, allowed);
    for (const h of hits) {
      violations.push({ locale, rule: "negative-contrast", line: h.line, text: `"${h.shape}" in: ${h.text}` });
    }
    let exempted = 0;
    for (const n of used.values()) exempted += n;
    if (exempted > ALLOWLIST_PER_LOCALE) {
      violations.push({
        locale,
        rule: "allowlist",
        text: `the allowlist exempts ${exempted} contrast occurrences here; the doctrine allows ${ALLOWLIST_PER_LOCALE} deliberate contrast per page per locale, and the cap counts hits, not entries`,
      });
    }
    for (const entry of allowed) {
      if (!used.has(entry)) {
        advisories.push({ locale, rule: "allowlist-stale", text: `allowlisted string carries no contrast any more, drop it: ${JSON.stringify(entry.slice(0, 60))}` });
      }
    }

    for (const h of matchShapes(strings, ADVISORY_SHAPES, locale, null).hits) {
      advisories.push({ locale, rule: "comparative", line: h.line, text: `"${h.shape}" in: ${h.text}` });
    }

    for (const s of strings) {
      EM_DASH.lastIndex = 0;
      let m;
      while ((m = EM_DASH.exec(s.value)) !== null) {
        violations.push({ locale, rule: "em-dash", line: s.line, text: excerpt(s.value, m.index, 1) });
      }
    }
  }

  return { violations, advisories, stats };
}

function describe(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "an array";
  return `a ${typeof value}`;
}

/** Never throws. Every malformed shape comes back as a message, and main exits 2. */
export function validateAllowlist(allowlist) {
  if (allowlist === null || typeof allowlist !== "object" || Array.isArray(allowlist)) {
    return [`CONTRAST_ALLOWLIST must be an object keyed by page, got ${describe(allowlist)}`];
  }
  const errors = [];
  for (const [page, locales] of Object.entries(allowlist)) {
    if (!PAGES[page]) errors.push(`CONTRAST_ALLOWLIST has an unknown page "${page}"`);
    if (locales === null || typeof locales !== "object" || Array.isArray(locales)) {
      errors.push(`CONTRAST_ALLOWLIST ${page} must be an object keyed by locale, got ${describe(locales)}`);
      continue;
    }
    for (const [locale, entries] of Object.entries(locales)) {
      if (locale !== "en" && locale !== "es") {
        errors.push(`CONTRAST_ALLOWLIST ${page} has an unknown locale "${locale}"`);
        continue;
      }
      if (!Array.isArray(entries)) {
        errors.push(`CONTRAST_ALLOWLIST ${page}.${locale} must be an array of exact dictionary strings, got ${describe(entries)}`);
        continue;
      }
      const bad = entries.findIndex((e) => typeof e !== "string");
      if (bad !== -1) {
        errors.push(`CONTRAST_ALLOWLIST ${page}.${locale} entry ${bad} must be an exact dictionary string, got ${describe(entries[bad])}`);
      }
      if (entries.length > ALLOWLIST_PER_LOCALE) {
        errors.push(
          `CONTRAST_ALLOWLIST ${page}.${locale} has ${entries.length} entries; the doctrine allows ${ALLOWLIST_PER_LOCALE} per page per locale`,
        );
      }
    }
  }
  return errors;
}

const USAGE = `usage: node scripts/copy-check.mjs <page>... | --all

pages: ${Object.keys(PAGES).join(", ")}

Checks lib/i18n/<page>.ts against docs/copy-doctrine.md.
Exit 0 clean, 1 on a violation, 2 on a usage or config error.`;

function run(argv, out, err, overrides) {
  const args = argv.filter((a) => a !== "--");
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    err(USAGE);
    return 2;
  }

  const allowlist = overrides.allowlist ?? CONTRAST_ALLOWLIST;
  const configErrors = validateAllowlist(allowlist);
  if (configErrors.length) {
    for (const e of configErrors) err(`config error: ${e}`);
    return 2;
  }

  let pages;
  if (args.includes("--all")) {
    const rest = args.filter((a) => a !== "--all");
    if (rest.length) { err(`--all takes no page names, got: ${rest.join(", ")}`); return 2; }
    pages = Object.keys(PAGES);
  } else {
    const unknown = args.filter((a) => !PAGES[a]);
    if (unknown.length) {
      err(`unknown page: ${unknown.join(", ")}`);
      err(USAGE);
      return 2;
    }
    pages = args;
  }

  let failed = 0;
  for (const page of pages) {
    const file = join("lib", "i18n", `${page}.ts`);
    let source;
    try {
      source = readFileSync(resolve(ROOT, file), "utf8");
    } catch (e) {
      err(`cannot read ${file}: ${e.message}`);
      return 2;
    }

    const { violations, advisories, stats } = checkSource(page, source, { allowlist });

    out(
      `${file}  en ${stats.en.words}w/${stats.en.bold}b (target ${stats.en.budget}w)` +
        `  es ${stats.es.words}w/${stats.es.bold}b (target ${stats.es.budget}w)`,
    );
    for (const v of violations) {
      out(`  FAIL  ${file}  ${v.locale}  ${v.rule}${v.line ? `  line ${v.line}` : ""}  ${v.text}`);
    }
    for (const a of advisories) {
      out(`  note  ${file}  ${a.locale}  ${a.rule}${a.line ? `  line ${a.line}` : ""}  ${a.text}`);
    }
    if (violations.length) failed++;
  }

  if (failed) {
    out(`\n${failed} of ${pages.length} page(s) violate docs/copy-doctrine.md`);
    return 1;
  }
  out(`\n${pages.length} page(s) clean`);
  return 0;
}

/**
 * Exit 0 clean, 1 on a violation, 2 on a usage or config error. A thrown error
 * is a config error too: the checker reports it and exits 2 rather than
 * handing a worker a stack trace.
 */
export function main(argv, out = console.log, err = console.error, overrides = {}) {
  try {
    return run(argv, out, err, overrides);
  } catch (e) {
    err(`config error: ${e && e.message ? e.message : e}`);
    return 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
