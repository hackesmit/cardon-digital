#!/usr/bin/env node
/**
 * copy-check: the runnable half of docs/copy-doctrine.md.
 *
 * Reads lib/i18n/<page>.ts, pulls the string literals out of the `en` and `es`
 * objects, and checks each locale on its own. It never writes to lib/i18n.
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
 * The budget table. One line per page.
 *
 * `budget` is the per-locale word ceiling. It is seeded at the larger of the
 * two locales as this script measures them today, so the seed is a ratchet
 * line (a page may not grow) rather than a failure that has nothing to do with
 * the bead that landed the doctrine. `target` is half of that, which is what
 * doctrine section 7 rule 1 actually asks for. Every copy bead that rewrites a
 * page lowers `budget` toward `target` in the same diff as the rewrite.
 *
 * `measured` records what this script counted on 2026-09-14, en + es combined,
 * so a later reader can see whether the page moved. Doctrine section 2 quotes
 * different numbers because those were taken from the rendered pages; see the
 * note in the doctrine header.
 */
export const PAGES = {
  home: { budget: 1570, target: 785, measured: 2961 },
  winery: { budget: 1882, target: 941, measured: 3538 },
  "monte-xanic": { budget: 1526, target: 763, measured: 2893 },
  enkanto: { budget: 2553, target: 1277, measured: 4934 },
  modulos: { budget: 3090, target: 1545, measured: 5898 },
  precios: { budget: 1467, target: 734, measured: 2800 },
  showcase: { budget: 673, target: 337, measured: 1322 },
  about: { budget: 474, target: 237, measured: 935 },
  contact: { budget: 576, target: 288, measured: 1121 },
};

export const MAX_BOLD = 3;

/**
 * One deliberate contrast per page per locale, kept on purpose. The entry is
 * the exact dictionary string that carries it, so the exemption reads in the
 * diff. More than one entry for a page and locale is a config error.
 */
export const CONTRAST_ALLOWLIST = {
  // home: { en: ["..."], es: ["..."] },
};

export const ALLOWLIST_PER_LOCALE = 1;

/**
 * The definitional shapes. Each is matched case-insensitively against the
 * dictionary string with the emphasis markers stripped.
 *
 * The Spanish shapes carry word boundaries so "mano es" and "camino otro" do
 * not read as "no es" and "no otro".
 */
export const BLOCKING_SHAPES = [
  { id: ", not", locale: "en", re: /,\s+not\s/gi },
  { id: "not just", locale: "en", re: /\bnot just\b/gi },
  { id: "not another", locale: "en", re: /\bnot another\b/gi },
  { id: "never a", locale: "en", re: /\bnever an?\b/gi },
  { id: "no es", locale: "es", re: /\bno es\b/gi },
  { id: "no son", locale: "es", re: /\bno son\b/gi },
  { id: ", sino", locale: "es", re: /,\s+sino\b/gi },
  { id: "no otra", locale: "es", re: /\bno otra\b/gi },
  { id: "no otro", locale: "es", re: /\bno otro\b/gi },
];

/**
 * Real tells, but not separable from honest comparative prose by any lexical
 * rule. "four minutes instead of forty" is the copy the doctrine asks for.
 * Reported on every run, never blocking. See the doctrine header.
 */
export const ADVISORY_SHAPES = [
  { id: "rather than", locale: "en", re: /\brather than\b/gi },
  { id: "instead of", locale: "en", re: /\binstead of\b/gi },
];

export const EM_DASH = /\u2014/g;

/** Markdown-ish emphasis markers that rich.tsx consumes, plus its line break. */
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
 * Walks one `const <name> = { ... }` declaration and returns every string
 * literal inside it, with the line it starts on. Comments are skipped, so an
 * apostrophe in a prose comment cannot open a string, and template
 * substitutions are walked as code rather than as text.
 */
function scanDeclaration(src, declStart) {
  const strings = [];
  const open = src.indexOf("{", declStart);
  if (open === -1) return { strings, end: src.length };

  let line = 1;
  for (let k = 0; k < open; k++) if (src[k] === "\n") line++;

  // Each frame is a brace depth we have to unwind: the object itself, then one
  // per `${` we walk into.
  let depth = 0;
  const tplStack = [];
  let i = open;

  while (i < src.length) {
    const c = src[i];

    if (c === "\n") { line++; i++; continue; }

    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) {
        if (src[i] === "\n") line++;
        i++;
      }
      i += 2;
      continue;
    }

    if (c === '"' || c === "'") {
      const startLine = line;
      let j = i + 1;
      let raw = "";
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") { raw += src.slice(j, j + 2); j += 2; continue; }
        if (src[j] === "\n") line++;
        raw += src[j];
        j++;
      }
      strings.push({ value: decodeEscapes(raw), line: startLine });
      i = j + 1;
      continue;
    }

    if (c === "`") {
      const startLine = line;
      let j = i + 1;
      let raw = "";
      let sub = false;
      while (j < src.length) {
        if (src[j] === "\\") { raw += src.slice(j, j + 2); j += 2; continue; }
        if (src[j] === "$" && src[j + 1] === "{") { sub = true; break; }
        if (src[j] === "`") break;
        if (src[j] === "\n") line++;
        raw += src[j];
        j++;
      }
      strings.push({ value: decodeEscapes(raw), line: startLine });
      if (sub) {
        // Step into the substitution as code; the `}` handler pops back out.
        tplStack.push(depth);
        depth++;
        i = j + 2;
        continue;
      }
      i = j + 1;
      continue;
    }

    if (c === "{") { depth++; i++; continue; }

    if (c === "}") {
      depth--;
      i++;
      if (tplStack.length && depth === tplStack[tplStack.length - 1]) {
        // Back out into the rest of the template literal.
        tplStack.pop();
        let j = i;
        let raw = "";
        const startLine = line;
        let sub = false;
        while (j < src.length) {
          if (src[j] === "\\") { raw += src.slice(j, j + 2); j += 2; continue; }
          if (src[j] === "$" && src[j + 1] === "{") { sub = true; break; }
          if (src[j] === "`") break;
          if (src[j] === "\n") line++;
          raw += src[j];
          j++;
        }
        strings.push({ value: decodeEscapes(raw), line: startLine });
        if (sub) { tplStack.push(depth); depth++; i = j + 2; continue; }
        i = j + 1;
        continue;
      }
      if (depth === 0) return { strings, end: i };
      continue;
    }

    i++;
  }

  return { strings, end: src.length };
}

/**
 * Every top-level `const en...` / `const es...` declaration belongs to its
 * locale, so contact.ts's `enIntro` and `esDescription` are counted with the
 * page they feed.
 */
const DECL_RE = /^const (en|es)(?:[A-Z]\w*)?\b/gm;

export function extractLocaleStrings(source) {
  const byLocale = { en: [], es: [] };
  DECL_RE.lastIndex = 0;
  let m;
  while ((m = DECL_RE.exec(source)) !== null) {
    const { strings, end } = scanDeclaration(source, m.index);
    byLocale[m[1]].push(...strings);
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

function excerpt(text, index, length) {
  const from = Math.max(0, index - 30);
  const to = Math.min(text.length, index + length + 30);
  return (from > 0 ? "..." : "") + text.slice(from, to).trim() + (to < text.length ? "..." : "");
}

function matchShapes(strings, shapes, locale, allowed) {
  const hits = [];
  const used = new Set();
  for (const s of strings) {
    const text = stripMarkers(s.value);
    for (const shape of shapes) {
      if (shape.locale !== locale) continue;
      shape.re.lastIndex = 0;
      let m;
      while ((m = shape.re.exec(text)) !== null) {
        if (m[0].length === 0) { shape.re.lastIndex++; continue; }
        if (allowed && allowed.has(s.value)) { used.add(s.value); continue; }
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

  for (const locale of ["en", "es"]) {
    const strings = byLocale[locale];
    const allowed = new Set(allowlist?.[page]?.[locale] ?? []);
    const words = countWords(strings);
    stats[locale] = { strings: strings.length, words, bold: 0 };

    if (strings.length === 0) {
      violations.push({ locale, rule: "extract", text: `no ${locale} strings found; is there a "const ${locale} = {" block?` });
      continue;
    }

    if (words > limits.budget) {
      violations.push({
        locale,
        rule: "words",
        text: `${words} words, budget ${limits.budget}, doctrine target ${limits.target}`,
      });
    }

    let markers = 0;
    for (const s of strings) markers += (s.value.match(/\*\*/g) ?? []).length;
    if (markers % 2 !== 0) {
      violations.push({ locale, rule: "bold", text: `${markers} "**" markers, which is an odd number, so a bold span is unclosed` });
    }
    const bold = Math.floor(markers / 2);
    stats[locale].bold = bold;
    if (bold > MAX_BOLD) {
      violations.push({ locale, rule: "bold", text: `${bold} bold spans, at most ${MAX_BOLD} allowed` });
    }

    const { hits, used } = matchShapes(strings, BLOCKING_SHAPES, locale, allowed);
    for (const h of hits) {
      violations.push({ locale, rule: "negative-contrast", line: h.line, text: `"${h.shape}" in: ${h.text}` });
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

export function validateAllowlist(allowlist) {
  const errors = [];
  for (const [page, locales] of Object.entries(allowlist)) {
    if (!PAGES[page]) errors.push(`CONTRAST_ALLOWLIST has an unknown page "${page}"`);
    for (const [locale, entries] of Object.entries(locales)) {
      if (locale !== "en" && locale !== "es") {
        errors.push(`CONTRAST_ALLOWLIST ${page} has an unknown locale "${locale}"`);
        continue;
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

export function main(argv, out = console.log, err = console.error) {
  const args = argv.filter((a) => a !== "--");
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    err(USAGE);
    return 2;
  }

  const configErrors = validateAllowlist(CONTRAST_ALLOWLIST);
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

    const { violations, advisories, stats } = checkSource(page, source);
    const limits = PAGES[page];

    out(
      `${file}  en ${stats.en.words}w/${stats.en.bold}b  es ${stats.es.words}w/${stats.es.bold}b` +
        `  budget ${limits.budget}w  target ${limits.target}w`,
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
