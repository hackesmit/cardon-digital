/**
 * The browser-driven Gemini engine: its parser on a saved answer page, its
 * failure and page-state checks, and a run end to end with the browser call
 * stubbed (no Chrome, no Google account, no network).
 *
 * test/fixtures/gemini-web.json keeps the markup of a real gemini.google.com
 * answer (2026-11-03: chips with base64 jslog metadata, nested lists, a table)
 * with the fixture client's made-up businesses, since this repo is public.
 */

import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { parseGeminiWeb, failureGeminiWeb, classifyPage, htmlToMarkdown, chipCitations } from "../lib/gemini-web.mjs";
import { ENGINES } from "../lib/engines.mjs";
import { listItems } from "../lib/detect.mjs";
import { validateConfig, analyse, main } from "../run.mjs";

const page = JSON.parse(readFileSync(new URL("./fixtures/gemini-web.json", import.meta.url), "utf8"));
const client = JSON.parse(readFileSync(new URL("./fixtures/client.json", import.meta.url), "utf8"));
const webClient = { ...client, engines: { "gemini-web": { model: "gemini-app" } } };

test("parseGeminiWeb turns a saved answer page into markdown text, cited urls and zero usage", () => {
  const p = parseGeminiWeb(page);
  const lines = p.text.split("\n");
  assert.equal(lines[0], "Si buscas una agencia web en Ensenada, estas son las opciones con más presencia & experiencia:", "entities decode, chips stay out of the text");
  assert.ok(lines.includes("### Opciones locales destacadas"));
  assert.ok(lines.includes("1. **Ola Studio**"));
  assert.ok(lines.includes("  - **Ubicación:** Zona Centro, Ensenada."), "a nested item keeps its indent");
  assert.ok(lines.includes("3. **Treinta y Tres**"));
  assert.ok(lines.includes("| Agencia | Enfoque |") && lines.includes("| --- | --- |") && lines.includes("| Ola Studio | Tiendas \\| catálogos |"));
  for (const chrome of ["Gemini said", "Good response", "thumb_up", "Copiar", "Fuentes:", "olastudio.test", "Guia Baja"]) assert.ok(!p.text.includes(chrome), `no ${chrome} in the text`);
  assert.deepEqual(p.citations, [
    "https://www.directorio.test/agencias",
    "https://olastudio.test/servicios/",
    "https://nopaldigital.test/",
    "https://guia.test/top",
    "https://treintaytres.test/",
    "https://www.periodico.test/nota",
  ], "jslog urls without utm or text fragments, a domain title as fallback, a multi-source chip, an inline link; Google's own links dropped");
  assert.deepEqual(p.usage, { input: 0, cachedInput: 0, output: 0, searches: 0 });
  assert.equal(p.model, "gemini-app (Flash)");
  assert.equal(failureGeminiWeb(page), null);
});

test("the parsed answer ranks list items the way the API engines' markdown does", () => {
  const ranks = listItems(parseGeminiWeb(page).text).map((i) => i.rank);
  assert.deepEqual(ranks.slice(0, 3), [1, 2, 3]);
  const a = analyse({ engine: "gemini-web", promptId: "P0", run: 1, response: page, judge: { verdicts: { us: { refers: true, sentiment: "positive" } } } }, validateConfig(webClient));
  assert.equal(a.mentions.ola.position, 1);
  assert.equal(a.mentions.us.position, 2);
  assert.equal(a.mentions.ttt.position, 3);
  assert.ok(a.domains.includes("periodico.test") && a.domains.includes("nopaldigital.test"));
});

test("chip metadata that is not base64 JSON falls back to a domain title, and a name title gives no url", () => {
  const chip = (attrs, title) => `<source-inline-chip><button ${attrs}><span class="source-title" style="x">${title}</span></button></source-inline-chip>`;
  assert.deepEqual(chipCitations(chip('jslog="1;BardVeMetadataKey:@@notbase64@@"', "Ejemplo.TEST") + chip("", "Grupo Ejemplo")), ["https://ejemplo.test/"]);
});

test("htmlToMarkdown numbers an ordered list from its start attribute and skips chrome", () => {
  assert.equal(htmlToMarkdown('<ol start="4"><li>A<button>x</button></li><li><p>B</p></li></ol><svg><text>no</text></svg>'), "4. A\n5. B");
});

test("unfinished, missing, empty and canned replies are failures, not answers", () => {
  const wrap = (inner) => `<model-response><message-content><div class="markdown"><p>${inner}</p></div></message-content></model-response>`;
  assert.equal(failureGeminiWeb(null), "no stored page");
  assert.equal(failureGeminiWeb({ ...page, complete: false }), "the answer never finished");
  assert.equal(failureGeminiWeb({ html: "<model-response></model-response>", complete: true }), "no answer element");
  assert.equal(failureGeminiWeb({ html: wrap(""), complete: true }), "empty text");
  assert.match(failureGeminiWeb({ html: wrap("Soy un modelo de lenguaje, así que no tengo esa capacidad."), complete: true }), /^canned refusal/);
  assert.equal(failureGeminiWeb({ html: wrap("Ola Studio y Nopal Digital."), complete: true }), null);
});

test("classifyPage stops on a captcha, a usage limit or a sign-in challenge, and asks for a login when signed out", () => {
  assert.match(classifyPage({ url: "https://www.google.com/sorry/index?continue=x", text: "" }).stop, /captcha/);
  assert.match(classifyPage({ url: "https://gemini.google.com/app", text: "Our systems have detected unusual traffic from your computer network" }).stop, /captcha/);
  assert.match(classifyPage({ url: "https://gemini.google.com/app/1", text: "Has alcanzado el límite de Gemini. Vuelve más tarde." }).stop, /usage limit/);
  assert.match(classifyPage({ url: "https://accounts.google.com/v3/signin/challenge/pwd", text: "" }).stop, /challenge/);
  assert.deepEqual(classifyPage({ url: "https://accounts.google.com/v3/signin/identifier?x", text: "Accede a tu cuenta" }), { login: true });
  assert.equal(classifyPage({ url: "https://gemini.google.com/app", text: "Hola, Daniel" }), null);
});

test("a browser engine needs only a model label: no price, no key", () => {
  assert.doesNotThrow(() => validateConfig(webClient, { newCalls: true }));
  assert.throws(() => validateConfig({ ...client, engines: { "gemini-web": {} } }), /model \(a label/);
  assert.equal(ENGINES["gemini-web"].browser, true);
  assert.equal(ENGINES["gemini-web"].keyName, null);
});

/** Only the judge goes over fetch; it accepts the bare Nopal. */
function judgeFetch(calls) {
  return async (url, init) => {
    calls.push(url);
    return { ok: true, status: 200, headers: new Headers(), text: async () => JSON.stringify({
      model: "gpt-6-luna", status: "completed",
      output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ brands: JSON.parse(init.body).input.includes('"ttt"') ? [{ id: "us", refers: true, sentiment: "positive" }, { id: "ola", refers: true, sentiment: "neutral" }, { id: "ttt", refers: true, sentiment: "neutral" }] : [{ id: "us", refers: true, sentiment: "positive" }, { id: "ola", refers: true, sentiment: "neutral" }] }) }] }],
      usage: { input_tokens: 500, output_tokens: 40 },
    }) };
  };
}

function home() {
  const h = mkdtempSync(join(tmpdir(), "vis-web-"));
  mkdirSync(join(h, "clients"));
  writeFileSync(join(h, "clients", "fixture.json"), JSON.stringify(webClient));
  return h;
}

test("main runs gemini-web one prompt at a time, stores the page, and has no cost row for it", async () => {
  const h = home();
  let inFlight = 0;
  let most = 0;
  const seen = [];
  const call = mock.method(ENGINES["gemini-web"], "call", async (prompt, opts, key) => {
    seen.push({ prompt: prompt.id, home: opts.home, key });
    inFlight++;
    most = Math.max(most, inFlight);
    await new Promise((r) => setTimeout(r, 5));
    inFlight--;
    return page;
  });
  const close = mock.method(ENGINES["gemini-web"], "close", async () => {});
  const realFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = judgeFetch(calls);
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  delete process.env.GEMINI_API_KEY;
  const log = [];
  try {
    const code = await main(["--client", "fixture", "--home", h, "--runs", "2", "--max-usd", "1"], (l) => log.push(l));
    assert.equal(code, 0, log.join("\n"));
  } finally {
    globalThis.fetch = realFetch;
    call.mock.restore();
    close.mock.restore();
  }
  assert.equal(seen.length, 6);
  assert.equal(most, 1, "one browser page, one prompt at a time");
  assert.equal(close.mock.callCount(), 1, "the browser is closed at the end");
  assert.ok(seen.every((s) => s.home === h && s.key === undefined), "the engine gets the tracker home and no key");
  const dir = join(h, "runs", "fixture", readdirSync(join(h, "runs", "fixture"))[0]);
  const rec = JSON.parse(readFileSync(join(dir, "raw", "gemini-web", "P0-r1.json"), "utf8"));
  assert.equal(rec.browser, true);
  assert.equal(rec.rate, null);
  assert.equal(rec.response.html, page.html);
  const s = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
  assert.equal(s.engines["gemini-web"].browser, true);
  assert.equal(s.metrics.engines["gemini-web"].answers, 6);
  assert.equal(s.metrics.engines["gemini-web"].mentioned, 6);
  assert.equal(s.cost.parts["gemini-web"], undefined, "no per-token cost row");
  assert.equal(s.cost.parts.judge.calls, 6, "the judge is still charged");
  const report = readFileSync(join(dir, "report.md"), "utf8");
  assert.match(report, /gemini-web is the consumer app driven through a logged-in account in a browser/);
  const spent = JSON.parse(readFileSync(join(h, "spend", readdirSync(join(h, "spend"))[0]), "utf8")).usd;
  assert.ok(Math.abs(spent - s.cost.usd) < 1e-4, "the ledger holds only the judge spend");
});

test("a captcha stops gemini-web cleanly with the reason recorded, and --resume finishes the run", async () => {
  const h = home();
  let n = 0;
  const call = mock.method(ENGINES["gemini-web"], "call", async () => {
    if (++n === 2) throw Object.assign(new Error("gemini-web stopped: Google shows a captcha"), { stop: "Google shows a captcha (unusual traffic)" });
    return page;
  });
  const close = mock.method(ENGINES["gemini-web"], "close", async () => {});
  const realFetch = globalThis.fetch;
  globalThis.fetch = judgeFetch([]);
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  const log = [];
  let dir;
  try {
    const code = await main(["--client", "fixture", "--home", h, "--runs", "1", "--max-usd", "1"], (l) => log.push(l));
    assert.equal(code, 3, "partial");
    assert.equal(n, 2, "no prompt is tried after the stop");
    dir = join(h, "runs", "fixture", readdirSync(join(h, "runs", "fixture"))[0]);
    const s = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
    assert.equal(s.partial, true);
    assert.match(s.partialReason, /gemini-web stopped: Google shows a captcha/);
    assert.equal(s.errors.length, 1);
    assert.match(log.join("\n"), /stopped early: gemini-web stopped: Google shows a captcha/);
    const again = await main(["--resume", dir, "--max-usd", "1"], (l) => log.push(l));
    assert.equal(again, 0, log.join("\n"));
    assert.equal(n, 4, "resume asks only the two missing prompts");
  } finally {
    globalThis.fetch = realFetch;
    call.mock.restore();
    close.mock.restore();
  }
  assert.equal(readdirSync(join(dir, "raw", "gemini-web")).length, 3);
});

test("a canned refusal is stored as an error and retried by --resume, never counted", async () => {
  const h = home();
  const canned = { html: '<model-response><message-content><p>Soy un modelo de lenguaje, así que no tengo esa capacidad.</p></message-content></model-response>', complete: true };
  let n = 0;
  const call = mock.method(ENGINES["gemini-web"], "call", async () => (++n === 1 ? canned : page));
  const close = mock.method(ENGINES["gemini-web"], "close", async () => {});
  const realFetch = globalThis.fetch;
  globalThis.fetch = judgeFetch([]);
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  const log = [];
  try {
    const code = await main(["--client", "fixture", "--home", h, "--runs", "1", "--prompts", "P0", "--max-usd", "1"], (l) => log.push(l));
    assert.equal(code, 3);
    assert.match(log.join("\n"), /no usable answer: canned refusal/);
    const dir = join(h, "runs", "fixture", readdirSync(join(h, "runs", "fixture"))[0]);
    assert.equal(await main(["--resume", dir, "--max-usd", "1"], (l) => log.push(l)), 0);
  } finally {
    globalThis.fetch = realFetch;
    call.mock.restore();
    close.mock.restore();
  }
});
