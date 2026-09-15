/**
 * Unit tests for scripts/copy-check.mjs.
 *
 *   node --test scripts/copy-check.test.mjs
 *
 * Every rule gets a fixture that passes and a fixture that fails. Fixtures are
 * inline dictionary sources, so the tests never depend on today's site copy.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

import {
  PAGES,
  MAX_BOLD,
  CONTRAST_ALLOWLIST,
  ALLOWLIST_PER_LOCALE,
  extractLocaleStrings,
  countWords,
  checkSource,
  validateAllowlist,
  main,
} from "./copy-check.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const LIMITS = { budget: 100, target: 50, measured: 200 };

/** Builds a dictionary source out of one prose line per locale. */
function dict(enLine, esLine) {
  return [
    'import type { Dict } from "./rich";',
    "",
    "const en = {",
    `  body: ${JSON.stringify(enLine)},`,
    "};",
    "",
    "const es: typeof en = {",
    `  body: ${JSON.stringify(esLine)},`,
    "};",
    "",
    "export const fixture: Dict<typeof en> = { en, es };",
    "",
  ].join("\n");
}

function check(source, options = {}) {
  return checkSource("fixture", source, { limits: LIMITS, allowlist: {}, ...options });
}

function rules(result, locale) {
  return result.violations.filter((v) => !locale || v.locale === locale).map((v) => v.rule);
}

// --- extraction -------------------------------------------------------------

test("extraction: splits the en and es objects", () => {
  const x = extractLocaleStrings(dict("A winery floor.", "Una bodega."));
  assert.deepEqual(x.en.map((s) => s.value), ["A winery floor."]);
  assert.deepEqual(x.es.map((s) => s.value), ["Una bodega."]);
});

test("extraction: an apostrophe inside a double quoted string does not open a string", () => {
  const src = dict("The waiter's phone, and the cash cut.", "El telefono del mesero.");
  const x = extractLocaleStrings(src);
  assert.deepEqual(x.en.map((s) => s.value), ["The waiter's phone, and the cash cut."]);
  assert.equal(x.es.length, 1);
});

test("extraction: prose in comments is not counted as copy", () => {
  const src = [
    "const en = {",
    "  // This comment says not just anything, and it isn't copy.",
    "  /* Neither is this one, which is not another string. */",
    '  body: "Clean prose.",',
    "};",
    "const es: typeof en = {",
    '  body: "Prosa limpia.",',
    "};",
  ].join("\n");
  const x = extractLocaleStrings(src);
  assert.deepEqual(x.en.map((s) => s.value), ["Clean prose."]);
  assert.equal(check(src).violations.length, 0);
});

test("extraction: a template literal contributes its text, not its substitution", () => {
  const src = [
    "const en = {",
    "  body: `Harvest ${year} closed.`,",
    "};",
    "const es: typeof en = {",
    '  body: "Cosecha cerrada.",',
    "};",
  ].join("\n");
  const x = extractLocaleStrings(src);
  assert.deepEqual(x.en.map((s) => s.value), ["Harvest ", " closed."]);
});

test("extraction: every top level en/es declaration feeds its locale", () => {
  const src = [
    'const enIntro = { title: "Two words" };',
    'const en = { body: "Three more words" };',
    'const esIntro = { title: "Dos palabras" };',
    'const es: typeof en = { body: "Tres palabras mas" };',
  ].join("\n");
  const x = extractLocaleStrings(src);
  assert.equal(countWords(x.en), 5);
  assert.equal(countWords(x.es), 5);
});

test("extraction: escapes decode and emphasis markers are not words", () => {
  const src = dict('A quote: "true", and **bold** __accent__', "Uno");
  assert.match(src, /\\"true\\"/, "the fixture must reach the tokenizer escaped");
  const x = extractLocaleStrings(src);
  assert.match(x.en[0].value, /"true"/);
  assert.equal(countWords(x.en), 6);
});

test("extraction: a page with no matching locale object fails loudly", () => {
  const result = check('const en = { body: "Only English here." };');
  assert.deepEqual(rules(result, "es"), ["extract"]);
});

// --- word budget ------------------------------------------------------------

test("words: a page at the budget passes", () => {
  const line = Array.from({ length: 100 }, () => "palabra").join(" ");
  const result = check(dict(line, line));
  assert.deepEqual(rules(result), []);
});

test("words: a page over the budget fails and names both numbers", () => {
  const line = Array.from({ length: 101 }, () => "palabra").join(" ");
  const result = check(dict(line, line));
  assert.deepEqual(rules(result, "en"), ["words"]);
  const v = result.violations.find((x) => x.rule === "words");
  assert.match(v.text, /101 words/);
  assert.match(v.text, /budget 100/);
  assert.match(v.text, /target 50/);
});

test("words: each locale is budgeted on its own", () => {
  const short = "Corta.";
  const long = Array.from({ length: 101 }, () => "palabra").join(" ");
  const result = check(dict(short, long));
  assert.deepEqual(rules(result, "en"), []);
  assert.deepEqual(rules(result, "es"), ["words"]);
});

// --- bold -------------------------------------------------------------------

test("bold: three spans pass", () => {
  const line = "**one** plain **two** plain **three**";
  const result = check(dict(line, line));
  assert.deepEqual(rules(result), []);
  assert.equal(result.stats.en.bold, MAX_BOLD);
});

test("bold: four spans fail", () => {
  const line = "**one** **two** **three** **four**";
  const result = check(dict(line, line));
  assert.deepEqual(rules(result, "en"), ["bold"]);
  assert.match(result.violations[0].text, /4 bold spans/);
});

test("bold: an unclosed span fails as malformed", () => {
  const result = check(dict("**one** and **two", "Dos."));
  const v = result.violations.find((x) => x.locale === "en" && x.rule === "bold");
  assert.match(v.text, /odd number/);
});

test("bold: the accent marker is not bold", () => {
  const line = "__one__ __two__ __three__ __four__ __five__";
  const result = check(dict(line, line));
  assert.deepEqual(rules(result), []);
});

// --- negative contrast ------------------------------------------------------

const CONTRAST_FIXTURES = [
  ["en", "A written memo, not a sales deck.", ", not"],
  ["en", "It is not just a dashboard.", "not just"],
  ["en", "Not another subscription.", "not another"],
  ["en", "Paid inside the fee, never a share of your spend.", "never a"],
  ["es", "No es otra suscripcion.", "no es"],
  ["es", "Las hojas no son la verdad.", "no son"],
  ["es", "No pagamos comision, sino una tarifa fija.", ", sino"],
  ["es", "El modelo es suyo, no otra suscripcion.", "no otra"],
  ["es", "Es un sistema, no otro proveedor.", "no otro"],
];

for (const [locale, line, shape] of CONTRAST_FIXTURES) {
  test(`negative contrast: "${shape}" fails in ${locale}`, () => {
    const result = check(locale === "en" ? dict(line, "Limpio.") : dict("Clean.", line));
    const hits = result.violations.filter((v) => v.rule === "negative-contrast");
    assert.equal(hits.length, 1, JSON.stringify(result.violations));
    assert.equal(hits[0].locale, locale);
    assert.match(hits[0].text, new RegExp(`^"${shape.replace(/[,]/g, ",")}"`));
    assert.ok(hits[0].text.includes(line.slice(0, 20)), hits[0].text);
  });
}

test("negative contrast: honest prose passes", () => {
  const result = check(
    dict(
      "You stop arguing about which spreadsheet is right. Close the till in four minutes.",
      "Deje de discutir cual hoja tiene razon. Cierre la caja en cuatro minutos.",
    ),
  );
  assert.deepEqual(rules(result), []);
});

test("negative contrast: word boundaries keep honest Spanish out of it", () => {
  // "Ninguno es" contains "no es", and "camino otro" contains "no otro".
  const result = check(dict("Clean.", "Ninguno es la traduccion del otro. Un camino otro dia."));
  assert.deepEqual(rules(result, "es"), []);
});

test("negative contrast: a hit reports the locale, the shape and the text", () => {
  const result = check(dict("A written memo, not a sales deck.", "Limpio."));
  const v = result.violations.find((x) => x.rule === "negative-contrast");
  assert.equal(v.locale, "en");
  assert.ok(v.line > 0);
  assert.match(v.text, /", not" in: .*written memo, not a sales deck/);
});

// --- the deliberate contrast allowlist --------------------------------------

test("allowlist: the exact string is exempt and nothing else is", () => {
  const kept = "A written memo, not a sales deck.";
  const source = [
    'const en = {',
    `  a: ${JSON.stringify(kept)},`,
    '  b: "One slot, not a running discount.",',
    "};",
    'const es: typeof en = { a: "Limpio.", b: "Limpio." };',
  ].join("\n");

  const withAllow = check(source, { allowlist: { fixture: { en: [kept] } } });
  const hits = withAllow.violations.filter((v) => v.rule === "negative-contrast");
  assert.equal(hits.length, 1);
  assert.match(hits[0].text, /running discount/);

  const without = check(source);
  assert.equal(without.violations.filter((v) => v.rule === "negative-contrast").length, 2);
});

test("allowlist: an entry that no longer carries a contrast is reported as stale", () => {
  const result = check(dict("Clean prose now.", "Limpio."), {
    allowlist: { fixture: { en: ["A written memo, not a sales deck."] } },
  });
  assert.deepEqual(rules(result), []);
  assert.deepEqual(result.advisories.map((a) => a.rule), ["allowlist-stale"]);
});

test("allowlist: one entry per page per locale validates, two do not", () => {
  assert.deepEqual(validateAllowlist({ home: { en: ["one"] } }), []);
  const errors = validateAllowlist({ home: { en: ["one", "two"] } });
  assert.equal(errors.length, 1);
  assert.match(errors[0], new RegExp(`allows ${ALLOWLIST_PER_LOCALE} per page per locale`));
});

test("allowlist: an unknown page or locale is a config error", () => {
  assert.match(validateAllowlist({ nosuchpage: {} })[0], /unknown page/);
  assert.match(validateAllowlist({ home: { fr: [] } })[0], /unknown locale/);
});

// --- advisory shapes --------------------------------------------------------

test("advisory: rather than and instead of are reported and never block", () => {
  const result = check(dict("Four minutes instead of forty, rather than a guess.", "Limpio."));
  assert.deepEqual(rules(result), []);
  assert.deepEqual(result.advisories.map((a) => a.rule), ["comparative", "comparative"]);
  assert.match(result.advisories[0].text, /"rather than"|"instead of"/);
});

// --- em dashes --------------------------------------------------------------

test("em dash: a hyphen passes and an em dash fails", () => {
  assert.deepEqual(rules(check(dict("Cash cut - done from the phone.", "Limpio."))), []);
  const result = check(dict("Cash cut \u2014 done from the phone.", "Limpio."));
  assert.deepEqual(rules(result, "en"), ["em-dash"]);
});

// --- the CLI ----------------------------------------------------------------

function run(argv) {
  const out = [];
  const code = main(argv, (l) => out.push(l), (l) => out.push(l));
  return { code, text: out.join("\n") };
}

test("cli: no arguments is a usage error", () => {
  const r = run([]);
  assert.equal(r.code, 2);
  assert.match(r.text, /usage:/);
});

test("cli: an unknown page is a usage error", () => {
  const r = run(["nosuchpage"]);
  assert.equal(r.code, 2);
  assert.match(r.text, /unknown page: nosuchpage/);
});

test("cli: --all does not take page names", () => {
  assert.equal(run(["--all", "home"]).code, 2);
});

test("cli: the shipped allowlist is within the doctrine's cap", () => {
  assert.deepEqual(validateAllowlist(CONTRAST_ALLOWLIST), []);
});

// --- the budget table matches the repo --------------------------------------

test("budget table: every page has a dictionary with both locales", () => {
  for (const [page, limits] of Object.entries(PAGES)) {
    const source = readFileSync(resolve(ROOT, join("lib", "i18n", `${page}.ts`)), "utf8");
    const x = extractLocaleStrings(source);
    assert.ok(x.en.length > 0, `${page}: no en strings`);
    assert.ok(x.es.length > 0, `${page}: no es strings`);
    assert.ok(limits.budget > 0 && limits.target > 0, `${page}: bad budget line`);
    assert.equal(limits.target, Math.round(limits.budget / 2), `${page}: target is half the budget`);
  }
});
