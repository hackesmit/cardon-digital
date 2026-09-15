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
  RATCHET_SLACK,
  CONTRAST_ALLOWLIST,
  ALLOWLIST_PER_LOCALE,
  extractLocaleStrings,
  countWords,
  countEmphasis,
  checkSource,
  validateAllowlist,
  main,
} from "./copy-check.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const LIMITS = { en: { budget: 100, measured: 200 }, es: { budget: 100, measured: 200 } };

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

/**
 * The ratchet is off by default here: a one-line fixture is always far under a
 * 100 word budget, and the budget-slack rule has its own tests below.
 */
function check(source, options = {}) {
  return checkSource("fixture", source, { limits: LIMITS, allowlist: {}, ratchet: false, ...options });
}

function rules(result, locale) {
  return result.violations.filter((v) => !locale || v.locale === locale).map((v) => v.rule);
}

// --- extraction -------------------------------------------------------------

test("extraction: splits the en and es objects", () => {
  const x = extractLocaleStrings(dict("A winery floor.", "Una bodega."));
  assert.deepEqual(x.en.map((s) => s.value), ["A winery floor."]);
  assert.deepEqual(x.es.map((s) => s.value), ["Una bodega."]);
  assert.deepEqual(x.errors, []);
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

// The four extractor traps the round one review found. Today's nine files are
// all plain object declarations, so these are about the rewrite beads that own
// lib/i18n next: each one used to be silent.

test("extraction: an object type annotation is not mistaken for the copy", () => {
  const src = [
    "const en: Record<string, { h: string }> = {",
    '  body: "Real English copy.",',
    "};",
    "const es: Record<string, { h: string }> = {",
    '  body: "Copia real.",',
    "};",
  ].join("\n");
  const x = extractLocaleStrings(src);
  assert.deepEqual(x.en.map((s) => s.value), ["Real English copy."]);
  assert.deepEqual(x.es.map((s) => s.value), ["Copia real."]);
  assert.deepEqual(x.errors, []);
});

test("extraction: export const is read like const", () => {
  const src = 'export const en = {\n  body: "Real English copy.",\n};\nexport const es = {\n  body: "Copia real.",\n};\n';
  const x = extractLocaleStrings(src);
  assert.deepEqual(x.en.map((s) => s.value), ["Real English copy."]);
  assert.deepEqual(x.es.map((s) => s.value), ["Copia real."]);
});

test("extraction: quoted and computed keys are keys, not copy", () => {
  const src = [
    "const en = {",
    '  "kitchen-screen": "Kitchen screen",',
    '  "not just": "Clean customer copy.",',
    "  [slug]: \"Another value.\",",
    "};",
    'const es: typeof en = { a: "Uno." };',
  ].join("\n");
  const x = extractLocaleStrings(src);
  assert.deepEqual(x.en.map((s) => s.value), ["Kitchen screen", "Clean customer copy.", "Another value."]);
  assert.deepEqual(rules(check(src), "en"), [], "a banned shape in a key is not copy");
});

test("extraction: a scalar or array locale declaration is read, not skipped", () => {
  const src = [
    'const enBullets = ["alpha words here", "beta words here"];',
    'const enIntro = "Gamma words here";',
    'const es = {',
    '  a: "hola mundo",',
    "};",
  ].join("\n");
  const x = extractLocaleStrings(src);
  assert.deepEqual(x.en.map((s) => s.value), ["alpha words here", "beta words here", "Gamma words here"]);
  assert.deepEqual(x.es.map((s) => s.value), ["hola mundo"], "the es object is not swallowed by the array above it");
});

test("extraction: a regex literal inside a substitution does not end it early", () => {
  const src = [
    "const en = {",
    "  body: `Result: ${value.replace(/}/g, \"\")} after close.`,",
    "};",
    'const es: typeof en = { body: "Uno." };',
  ].join("\n");
  const x = extractLocaleStrings(src);
  assert.deepEqual(x.en.map((s) => s.value), ["Result: ", "", " after close."]);
});

test("extraction: an initializer copy-check cannot read is a loud error, not a silent zero", () => {
  const src = ['const enCopy = buildCopy(source);', 'const es = { a: "hola" };'].join("\n");
  const x = extractLocaleStrings(src);
  assert.equal(x.errors.length, 1);
  assert.match(x.errors[0], /const enCopy: the initializer is not a string, template, array or object literal/);
  const result = checkSource("fixture", src, { limits: LIMITS, allowlist: {}, ratchet: false });
  assert.ok(rules(result).includes("extract"), JSON.stringify(result.violations));
});

// --- word budget ------------------------------------------------------------

test("words: a page at its locale budget passes", () => {
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
});

test("words: each locale carries its own budget, so the shorter one gets no headroom", () => {
  // The round one shape: one budget per page, seeded at the larger locale. 60
  // words of English used to pass under a budget that only Spanish needed.
  const limits = { en: { budget: 50, measured: 100 }, es: { budget: 100, measured: 200 } };
  const en = Array.from({ length: 60 }, () => "word").join(" ");
  const es = Array.from({ length: 60 }, () => "palabra").join(" ");
  const result = check(dict(en, es), { limits });
  assert.deepEqual(rules(result, "en"), ["words"]);
  assert.deepEqual(rules(result, "es"), []);
});

test("ratchet: a page well under its budget fails until the budget line comes down", () => {
  const line = Array.from({ length: 40 }, () => "word").join(" ");
  const result = check(dict(line, line), { ratchet: true });
  assert.deepEqual(rules(result, "en"), ["budget-slack"]);
  const v = result.violations.find((x) => x.rule === "budget-slack");
  assert.match(v.text, /lower this page's en budget to 40/);
});

test(`ratchet: up to ${RATCHET_SLACK} words of slack is allowed`, () => {
  const exact = Array.from({ length: 100 - RATCHET_SLACK }, () => "word").join(" ");
  assert.deepEqual(rules(check(dict(exact, exact), { ratchet: true })), []);
  const one = Array.from({ length: 100 - RATCHET_SLACK - 1 }, () => "word").join(" ");
  assert.deepEqual(rules(check(dict(one, one), { ratchet: true }), "en"), ["budget-slack"]);
});

test("ratchet: words and budget-slack never fire on the same locale", () => {
  const over = Array.from({ length: 300 }, () => "word").join(" ");
  const result = check(dict(over, over), { ratchet: true });
  assert.deepEqual(rules(result, "en"), ["words"]);
});

// --- emphasis ---------------------------------------------------------------

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
  assert.match(result.violations[0].text, /4 emphasis spans/);
});

test("bold: the accent marker counts too, so the sed bypass is closed", () => {
  // rich.tsx renders __x__ as a coloured accent span, so `sed 's/[*][*]/__/g'`
  // used to take a page from FAIL to clean while the page still shouted.
  const line = "__one__ __two__ __three__ __four__";
  const result = check(dict(line, line));
  assert.deepEqual(rules(result, "en"), ["bold"]);
  assert.equal(result.stats.en.bold, 4);

  const mixed = "**one** **two** __three__ __four__";
  assert.deepEqual(rules(check(dict(mixed, mixed)), "en"), ["bold"]);
});

test("bold: a stray marker is reported per string, so two of them do not cancel out", () => {
  const src = [
    "const en = {",
    '  a: "**Unclosed",',
    '  b: "also unclosed**",',
    "};",
    'const es: typeof en = { a: "Uno.", b: "Dos." };',
  ].join("\n");
  const result = check(src);
  const bold = result.violations.filter((v) => v.locale === "en" && v.rule === "bold");
  assert.equal(bold.length, 2, JSON.stringify(result.violations));
  assert.match(bold[0].text, /stray/);
  assert.notEqual(bold[0].line, bold[1].line, "each malformed string names its own line");
});

test("bold: an unclosed span inside one string fails as malformed", () => {
  const result = check(dict("**one** and **two", "Dos."));
  const v = result.violations.find((x) => x.locale === "en" && x.rule === "bold");
  assert.match(v.text, /stray/);
});

test("bold: counting matches what rich.tsx renders", () => {
  assert.deepEqual(countEmphasis("**a** __b__"), { spans: 2, strays: 0 });
  assert.deepEqual(countEmphasis("plain text"), { spans: 0, strays: 0 });
  // rich.tsx needs something between the markers: `****` renders as text.
  assert.deepEqual(countEmphasis("****"), { spans: 0, strays: 2 });
  assert.deepEqual(countEmphasis("**one"), { spans: 0, strays: 1 });
});

// --- negative contrast ------------------------------------------------------

const CONTRAST_FIXTURES = [
  ["en", "A written memo, not a sales deck.", ", not"],
  ["en", "It is not just a dashboard.", "not just"],
  ["en", "Not another subscription.", "not another"],
  ["en", "Paid inside the fee, never a share of your spend.", "never a"],
  ["en", "This is not a dashboard but the number you can act on.", "not X but Y"],
  ["es", "No es otra suscripcion.", "no es/son + article"],
  ["es", "Las hojas no son la verdad.", "no es/son + article"],
  ["es", "No solo muestra ventas; explica que hacer.", "no solo"],
  ["es", "No sólo muestra ventas; explica que hacer.", "no solo"],
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
    assert.ok(hits[0].text.startsWith(`"${shape}"`), hits[0].text);
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

/**
 * The round one blocker: `no es` and `no son` are ordinary Spanish negation, so
 * blocking on them alone blocked true statements this site has to be able to
 * make. These three are the live strings the review found. They pass now, and
 * every one of them is still reported as an advisory for a human to read.
 */
const HONEST_SPANISH = [
  "Para deducir un gasto en Mexico hace falta un CFDI, y un gasto sin CFDI no es deducible.",
  "Vender del otro lado de la frontera siendo una bodega mexicana no es algo que la ley permita sin estructura.",
  "Vista ilustrativa, no son datos de cliente.",
  "Si el total no es correcto, revise el corte.",
  "Un grupo que opera varias no es para lo que esta hecho este modulo.",
];

for (const line of HONEST_SPANISH) {
  test(`negative contrast: honest Spanish negation passes: ${line.slice(0, 34)}...`, () => {
    const result = check(dict("Clean.", line));
    assert.deepEqual(rules(result, "es"), [], JSON.stringify(result.violations));
    assert.deepEqual(
      result.advisories.map((a) => a.rule),
      ["comparative"],
      "the hit is still reported so a human reads it",
    );
  });
}

test("negative contrast: the narrowed Spanish rule still catches the real tells", () => {
  for (const line of ["No es otra suscripcion.", "Las hojas no son la verdad.", "No es una version recortada."]) {
    const result = check(dict("Clean.", line));
    assert.deepEqual(rules(result, "es"), ["negative-contrast"], line);
  }
});

test("negative contrast: the plain negation advisory does not double report an article hit", () => {
  const result = check(dict("Clean.", "No es otra suscripcion."));
  assert.deepEqual(rules(result, "es"), ["negative-contrast"]);
  assert.deepEqual(result.advisories, []);
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
    "const en = {",
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

test("allowlist: a malformed allowlist is a reported config error, never a throw", () => {
  // Object.entries(null) used to throw, and a bare string used to pass the
  // length test and then be read one character at a time.
  for (const bad of [null, "nope", ["home"], 7]) {
    const errors = validateAllowlist(bad);
    assert.equal(errors.length, 1, JSON.stringify(bad));
    assert.match(errors[0], /must be an object keyed by page/);
  }
  assert.match(validateAllowlist({ home: null })[0], /must be an object keyed by locale, got null/);
  assert.match(validateAllowlist({ home: { en: "one string" } })[0], /must be an array of exact dictionary strings/);
  assert.match(validateAllowlist({ home: { en: [1] } })[0], /entry 0 must be an exact dictionary string/);
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

function run(argv, overrides = {}) {
  const out = [];
  const code = main(argv, (l) => out.push(l), (l) => out.push(l), overrides);
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

test("cli: a config error exits 2 and never throws", () => {
  const over = run(["home"], { allowlist: { home: { en: ["one", "two"] } } });
  assert.equal(over.code, 2);
  assert.match(over.text, /config error: .*allows 1 per page per locale/);

  const malformed = run(["home"], { allowlist: { home: null } });
  assert.equal(malformed.code, 2);
  assert.match(malformed.text, /config error: .*keyed by locale/);

  // Anything that throws on the way through is a config error too, not a stack
  // trace in a worker's face.
  const throws = run(["home"], {
    allowlist: {
      get home() {
        throw new Error("boom");
      },
    },
  });
  assert.equal(throws.code, 2);
  assert.match(throws.text, /config error: boom/);
});

test("cli: the shipped allowlist is within the doctrine's cap", () => {
  assert.deepEqual(validateAllowlist(CONTRAST_ALLOWLIST), []);
});

// --- the budget table matches the repo --------------------------------------

test("budget table: every page has a dictionary with both locales", () => {
  for (const [page, limits] of Object.entries(PAGES)) {
    const source = readFileSync(resolve(ROOT, join("lib", "i18n", `${page}.ts`)), "utf8");
    const x = extractLocaleStrings(source);
    assert.deepEqual(x.errors, [], `${page}: the extractor could not read a declaration`);
    for (const locale of ["en", "es"]) {
      assert.ok(x[locale].length > 0, `${page}: no ${locale} strings`);
      assert.ok(limits[locale].budget > 0, `${page}: bad ${locale} budget line`);
      assert.equal(
        limits[locale].budget,
        Math.round(limits[locale].measured / 2),
        `${page}.${locale}: the budget is half the measured count`,
      );
    }
  }
});

test("budget table: no page can grow past what it measured when the doctrine landed", () => {
  // The ratchet, stated as the doctrine states it. Every page is over budget
  // today; this asserts the budgets themselves never drift back up.
  for (const [page, limits] of Object.entries(PAGES)) {
    for (const locale of ["en", "es"]) {
      assert.ok(limits[locale].budget < limits[locale].measured, `${page}.${locale} budget is not below its seed`);
    }
  }
});
