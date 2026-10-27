/**
 * Tests for the engine parsers, cost and cap, config checks, and one
 * end-to-end run of main() against a stubbed fetch, so no test spends money
 * or needs a key.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { parseOpenAI, parseGemini, cleanUrl, redact } from "../lib/engines.mjs";
import { judgePrompt } from "../lib/judge.mjs";
import { priceCall, SpendLedger } from "../lib/cost.mjs";
import { validateConfig, analyse, judgeCandidates, parseArgs, main } from "../run.mjs";

const fixtureText = readFileSync(new URL("./fixtures/client.json", import.meta.url), "utf8");
const config = () => JSON.parse(fixtureText);
const pricing = JSON.parse(readFileSync(new URL("../pricing.json", import.meta.url), "utf8"));

const ANSWER = "Opciones:\n\n1. **Ola Studio** ([olastudio.test](https://olastudio.test/?utm_source=openai))\n2. **Nopal Digital**, sitios y software.";

const openaiBody = (text = ANSWER) => ({
  model: "gpt-5.4-mini-2026-03-17",
  output: [
    { type: "web_search_call", action: { type: "search", query: "q" } },
    { type: "web_search_call", action: { type: "search", query: "q2" } },
    { type: "message", content: [{ type: "output_text", text, annotations: [
      { type: "url_citation", url: "https://olastudio.test/?utm_source=openai" },
      { type: "url_citation", url: "https://olastudio.test/?utm_source=openai" },
      { type: "url_citation", url: "https://guia.test/top" },
    ] }] },
  ],
  usage: { input_tokens: 9000, input_tokens_details: { cached_tokens: 1000 }, output_tokens: 300 },
});

const geminiBody = (text = "Nopal es una opcion, igual que Ola Studio.") => ({
  modelVersion: "gemini-2.5-flash",
  candidates: [{
    content: { parts: [{ text }] },
    groundingMetadata: {
      webSearchQueries: ["agencias ensenada"],
      groundingChunks: [
        { web: { uri: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc", title: "periodico.test", resolved: "https://www.periodico.test/nota?utm_medium=x" } },
        { web: { uri: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/def", title: "olastudio.test" } },
      ],
    },
  }],
  usageMetadata: { promptTokenCount: 12, candidatesTokenCount: 200, thoughtsTokenCount: 50 },
});

test("parseOpenAI reads text, distinct cited urls without utm, and usage", () => {
  const p = parseOpenAI(openaiBody());
  assert.equal(p.text, ANSWER);
  assert.deepEqual(p.citations, ["https://olastudio.test/", "https://guia.test/top"]);
  assert.deepEqual(p.usage, { input: 9000, cachedInput: 1000, output: 300, searches: 2 });
});

test("parseGemini prefers the resolved redirect, then a domain-shaped title", () => {
  const p = parseGemini(geminiBody());
  assert.deepEqual(p.citations, ["https://www.periodico.test/nota", "https://olastudio.test/"]);
  assert.deepEqual(p.usage, { input: 12, cachedInput: 0, output: 250, searches: 1 });
});

test("cleanUrl drops only utm parameters", () => {
  assert.equal(cleanUrl("https://a.test/x?utm_source=openai&id=3"), "https://a.test/x?id=3");
});

test("redact removes known keys and key-shaped strings", () => {
  const out = redact("bad key sk-proj-abcdefghijklmnop and AIzaSyA1234567890abcdef and secret123456789", ["secret123456789"]);
  assert.ok(!out.includes("abcdefghijklmnop"));
  assert.ok(!out.includes("1234567890abcdef"));
  assert.ok(!out.includes("secret123456789"));
});

test("priceCall prices tokens and searches, and a free model bills 0", () => {
  const p = priceCall({ input: 9000, cachedInput: 1000, output: 300, searches: 2 }, "gpt-5.4-mini", pricing);
  // 8000 * 0.75 + 1000 * 0.075 + 300 * 4.5 per 1M, plus 2 * $0.01
  assert.ok(Math.abs(p.usd - (0.006 + 0.000075 + 0.00135 + 0.02)) < 1e-9);
  const g = priceCall({ input: 12, output: 250, searches: 1 }, "gemini-2.5-flash", pricing);
  assert.equal(g.usd, 0);
  assert.ok(g.listUsd > 0.035);
  assert.throws(() => priceCall({ input: 1, output: 1 }, "nope", pricing), /no price/);
});

test("the spend ledger stops a call that would cross the daily cap and persists", () => {
  const home = mkdtempSync(join(tmpdir(), "vis-"));
  const l = new SpendLedger(home, 1, "2026-01-01");
  assert.ok(l.allows(0.9));
  l.add(0.6);
  assert.ok(!l.allows(0.5));
  const again = new SpendLedger(home, 1, "2026-01-01");
  assert.equal(again.spent, 0.6);
  assert.ok(new SpendLedger(home, 1, "2026-01-02").allows(0.9));
});

test("validateConfig rejects what a run cannot use", () => {
  assert.ok(validateConfig(config()));
  const bad = (mut, re) => {
    const c = config();
    mut(c);
    assert.throws(() => validateConfig(c), re);
  };
  bad((c) => (c.prompts[0].intent = "other"), /intent/);
  bad((c) => (c.prompts[1].id = "P0"), /duplicate prompt/);
  bad((c) => (c.competitors[0].id = "us"), /duplicate brand/);
  bad((c) => (c.engines.openai.model = "gpt-unknown"), /no price/);
  bad((c) => (c.engines = { bing: { model: "gpt-5.4-mini" } }), /unknown engine/);
});

test("parseArgs reads options and refuses bad ones", () => {
  assert.deepEqual(parseArgs(["--client", "x", "--runs", "2", "--engines", "openai"]).engines, ["openai"]);
  assert.throws(() => parseArgs(["--runs", "0"]), /positive/);
  assert.throws(() => parseArgs(["--wat"]), /unknown option/);
});

test("analyse counts an unclear hit only when the judge accepts it", () => {
  const c = config();
  const rec = { engine: "gemini", promptId: "P0", run: 1, response: geminiBody() };
  const without = analyse(rec, c);
  assert.deepEqual(Object.keys(without.mentions), ["ola"]);
  assert.equal(without.mentions.ola.sentiment, "unknown");
  const accepted = analyse({ ...rec, judge: { verdicts: { us: { refers: true, sentiment: "positive" }, ola: { refers: true, sentiment: "neutral" } } } }, c);
  assert.deepEqual(Object.keys(accepted.mentions).sort(), ["ola", "us"]);
  assert.equal(accepted.mentions.us.sentiment, "positive");
  const rejected = analyse({ ...rec, judge: { verdicts: { us: { refers: false, sentiment: "neutral" } } } }, c);
  assert.ok(!rejected.mentions.us);
  assert.deepEqual(rejected.domains, ["periodico.test", "olastudio.test"]);
});

test("judge candidates mark unclear hits, and the prompt lists them", () => {
  const cands = judgeCandidates("Nopal es una opcion, igual que Ola Studio.", config());
  assert.deepEqual(cands.map((x) => [x.id, x.unclear]), [["ola", false], ["us", true]]);
  assert.match(judgePrompt("t", cands), /id "us": Nopal Digital, a web and software studio in Ensenada \(UNCLEAR/);
  assert.deepEqual(judgeCandidates("Nada que ver.", config()), []);
});

/** A fetch that answers like both engines and the judge, and counts calls. */
function stubFetch(calls) {
  return async (url, init) => {
    calls.push({ url, auth: init.headers?.Authorization || init.headers?.["x-goog-api-key"] });
    const json = (o) => ({ ok: true, status: 200, headers: new Headers(), text: async () => JSON.stringify(o) });
    if (init.method === "HEAD") return { ok: false, status: 302, headers: new Headers({ location: "https://periodico.test/x" }) };
    if (url.includes("generativelanguage")) return json(geminiBody());
    const body = JSON.parse(init.body);
    if (body.text?.format) {
      return json({ model: "gpt-5.4-nano", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ brands: [
        { id: "us", refers: true, sentiment: "positive" }, { id: "ola", refers: true, sentiment: "neutral" },
      ] }) }] }], usage: { input_tokens: 500, output_tokens: 40 } });
    }
    return json(openaiBody());
  };
}

test("main runs a small panel end to end and writes raw answers, summary and report", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-home-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  const calls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = stubFetch(calls);
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  const log = [];
  try {
    const code = await main(["--client", "fixture", "--home", home, "--runs", "2", "--max-usd", "5"], (l) => log.push(l));
    assert.equal(code, 0, log.join("\n"));
  } finally {
    globalThis.fetch = realFetch;
  }
  const runs = readdirSync(join(home, "runs", "fixture"));
  assert.equal(runs.length, 1);
  const dir = join(home, "runs", "fixture", runs[0]);
  assert.equal(readdirSync(join(dir, "raw", "openai")).length, 6);
  assert.equal(readdirSync(join(dir, "raw", "gemini")).length, 6);
  const summary = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
  assert.equal(summary.partial, false);
  assert.equal(summary.metrics.overall.answers, 12);
  assert.equal(summary.metrics.engines.openai.mentioned, 6);
  assert.equal(summary.metrics.engines.openai.avgPosition, 2);
  assert.equal(summary.metrics.engines.gemini.mentioned, 6, "judge accepted the bare Nopal");
  assert.ok(summary.cost.usd > 0 && summary.cost.parts.gemini.usd === 0);
  const report = readFileSync(join(dir, "report.md"), "utf8");
  assert.match(report, /API panel, directional/);
  assert.match(report, /\| guia\.test \| other \|/);
  for (const c of calls) assert.ok(!c.url.includes("test-gemini-key"), "a key never travels in a url");
  for (const f of ["summary.json", "report.md", "config.json", "plan.json"]) {
    assert.ok(!readFileSync(join(dir, f), "utf8").includes("test-openai-key"), `${f} carries no key`);
  }
  assert.ok(existsSync(join(home, "spend")));
});

test("main stops at the daily cap, writes a partial report, and --resume finishes it", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-cap-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  const realFetch = globalThis.fetch;
  globalThis.fetch = stubFetch([]);
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  const log = [];
  try {
    // gpt-5.4-mini reserves $0.055 per answer with its judge; $0.1 fits one.
    const code = await main(["--client", "fixture", "--home", home, "--runs", "1", "--engines", "openai", "--max-usd", "0.1"], (l) => log.push(l));
    assert.equal(code, 3);
    const dir = join(home, "runs", "fixture", readdirSync(join(home, "runs", "fixture"))[0]);
    const s = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
    assert.equal(s.partial, true);
    assert.match(s.partialReason, /daily cap/);
    assert.match(readFileSync(join(dir, "report.md"), "utf8"), /Partial run/);
    const resumed = await main(["--resume", dir, "--home", home, "--max-usd", "5"], (l) => log.push(l));
    assert.equal(resumed, 0, log.join("\n"));
    assert.equal(JSON.parse(readFileSync(join(dir, "summary.json"), "utf8")).metrics.overall.answers, 3);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("--dry-run prints the plan and makes no call", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-dry-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  const log = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = () => assert.fail("no fetch on a dry run");
  try {
    assert.equal(await main(["--client", "fixture", "--home", home, "--dry-run"], (l) => log.push(l)), 0);
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.match(log[0], /3 prompts x openai\+gemini x 5 runs = 30 answers/);
  assert.ok(!existsSync(join(home, "runs")));
});
