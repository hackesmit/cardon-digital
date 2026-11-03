/**
 * Tests for the engine parsers, cost and cap, config checks, and one
 * end-to-end run of main() against a stubbed fetch, so no test spends money
 * or needs a key.
 */

import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { parseOpenAI, parseGemini, cleanUrl, redact, postJson, resolveRedirect, failureOpenAI, failureGemini } from "../lib/engines.mjs";
import { judgePrompt } from "../lib/judge.mjs";
import { priceCall, estimatePerCall, rateAt, SpendLedger } from "../lib/cost.mjs";
import { validateConfig, analyse, judgeCandidates, parseArgs, main, allocateRunDir } from "../run.mjs";

const fixtureText = readFileSync(new URL("./fixtures/client.json", import.meta.url), "utf8");
const config = () => JSON.parse(fixtureText);
const pricing = JSON.parse(readFileSync(new URL("../pricing.json", import.meta.url), "utf8"));

const ANSWER = "Opciones:\n\n1. **Ola Studio** ([olastudio.test](https://olastudio.test/?utm_source=openai))\n2. **Nopal Digital**, sitios y software.";

const openaiBody = (text = ANSWER) => ({
  model: "gpt-6-sol",
  status: "completed",
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
  modelVersion: "gemini-3.8-flash",
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
  const out = redact("bad key sk-proj-abcdefghijklmnop and AIzaSyA1234567890abcdef and AQ.Ab8RN6Kq_zzzzyyyyxxxx and secret123456789", ["secret123456789"]);
  assert.ok(!out.includes("Ab8RN6Kq_zzzzyyyyxxxx"), "new-style Google keys start with AQ.");
  assert.ok(!out.includes("abcdefghijklmnop"));
  assert.ok(!out.includes("1234567890abcdef"));
  assert.ok(!out.includes("secret123456789"));
});

test("priceCall prices tokens and searches, and charges list price even for a model flagged free", () => {
  const p = priceCall({ input: 9000, cachedInput: 1000, output: 300, searches: 2 }, "gpt-6-sol", pricing);
  // 8000 * 2 + 1000 * 0.2 + 300 * 10 per 1M, plus 2 * $0.01
  assert.ok(Math.abs(p.usd - (0.016 + 0.0002 + 0.003 + 0.02)) < 1e-9);
  const g = priceCall({ input: 12, output: 250, searches: 1 }, "gemini-3.8-flash", pricing, "2026-11-03T12:00:00Z");
  // 12 * 0.75 + 250 * 3.75 per 1M, plus one $0.014 search query
  assert.ok(Math.abs(g.usd - (0.000009 + 0.0009375 + 0.014)) < 1e-9, "Gemini is billed: list price by default");
  assert.equal(g.usd, g.listUsd);
  for (const [m, p] of Object.entries(pricing.models)) assert.ok(!p.free, `${m} must not be marked free`);
  const flagged = { models: { x: { input: 1, output: 1, free: true } } };
  assert.ok(priceCall({ input: 1e6, output: 0 }, "x", flagged).usd === 1, "a free flag never zeroes the charge");
  assert.throws(() => priceCall({ input: 1, output: 1 }, "nope", pricing), /no price/);
});

test("models of runs stored before the 2026-11-03 switch stay priced, so --analyse and --resume still work", () => {
  // The 2026-10-27 Cardon run answered on gpt-5.5 and judged on gpt-5.4-nano.
  // Earlier runs also used gemini-2.5-flash and gpt-5.4-mini, now retired.
  for (const m of ["gpt-5.5", "gpt-5.4-nano", "gemini-2.5-flash", "gpt-5.4-mini"]) assert.ok(estimatePerCall(m, pricing) > 0, m);
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
  bad((c) => (c.engines = { bing: { model: "gpt-6-sol" } }), /unknown engine/);
  // Retired ids keep their price for stored runs, but a new run naming one
  // fails before any call.
  const badNew = (mut, re) => {
    const c = config();
    mut(c);
    assert.ok(validateConfig(c), "a stored run on it still validates");
    assert.throws(() => validateConfig(c, { newCalls: true }), re);
  };
  badNew((c) => (c.engines.gemini.model = "gemini-2.5-flash"), /gemini-2\.5-flash is retired/);
  badNew((c) => (c.engines.openai.model = "gpt-5.4-mini"), /gpt-5\.4-mini is retired/);
  badNew((c) => (c.judge.model = "gpt-5.4-mini"), /judge: model gpt-5\.4-mini is retired/);
  assert.ok(validateConfig(config(), { newCalls: true }));
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
      return json({ model: "gpt-6-luna", status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ brands: [
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
  assert.ok(summary.cost.usd > 0 && summary.cost.parts.gemini.usd > 0, "Gemini spend counts");
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
    // gpt-6-sol reserves about $0.21 per answer with its judge; $0.25 fits one in flight.
    const code = await main(["--client", "fixture", "--home", home, "--runs", "1", "--engines", "openai", "--max-usd", "0.25"], (l) => log.push(l));
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

test("an exhausted balance fails at once and is marked as quota, not retried", async () => {
  let n = 0;
  const f = async () => {
    n += 1;
    return { ok: false, status: 429, headers: new Headers(), text: async () => '{"error":{"code":"credit_balance_exhausted"}}' };
  };
  await assert.rejects(postJson("https://x.test", {}, {}, { fetchImpl: f }), (e) => e.quota === true);
  assert.equal(n, 1);
});

test("main stops the whole run when an engine is out of credit", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-quota-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  const realFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return { ok: false, status: 429, headers: new Headers(), text: async () => '{"error":{"code":"insufficient_quota"}}' };
  };
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  try {
    const code = await main(["--client", "fixture", "--home", home, "--runs", "5", "--engines", "openai"], () => {});
    assert.equal(code, 3);
  } finally {
    globalThis.fetch = realFetch;
  }
  // Concurrency 2: the two calls in flight fail, nothing after them starts.
  assert.ok(calls <= 2, `${calls} calls`);
  const dir = join(home, "runs", "fixture", readdirSync(join(home, "runs", "fixture"))[0]);
  assert.match(JSON.parse(readFileSync(join(dir, "summary.json"), "utf8")).partialReason, /out of credit/);
});

test("concurrent calls cannot push spend past the cap (reservations held in flight)", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-cap-conc-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  const realFetch = globalThis.fetch;
  // Each answer costs about $0.206 (gpt-6-sol at its limits: 48000 input, 6000 output,
  // 5 searches) and takes 50 ms, so two workers in flight both see the old balance unless
  // the ledger reserves; the $0.21 cap fits exactly one.
  globalThis.fetch = async () => {
    await new Promise((r) => setTimeout(r, 50));
    return { ok: true, status: 200, headers: new Headers(), text: async () => JSON.stringify({
      status: "completed",
      output: [1, 2, 3, 4, 5].map(() => ({ type: "web_search_call" })).concat([{ type: "message", content: [{ type: "output_text", text: "nada", annotations: [] }] }]),
      usage: { input_tokens: 48000, output_tokens: 6000 } }) };
  };
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  try {
    await main(["--client", "fixture", "--home", home, "--runs", "5", "--engines", "openai", "--max-usd", "0.21"], () => {});
    const day = new Date().toISOString().slice(0, 10);
    const spent = JSON.parse(readFileSync(join(home, "spend", `${day}.json`), "utf8")).usd;
    assert.ok(spent <= 0.21, `spent ${spent} past the 0.21 cap`);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("every call carries its output and search limits, and the estimate is the price at those limits", async () => {
  for (const [m, p] of Object.entries(pricing.models)) {
    const l = p.limits;
    assert.ok(l && l.maxInputTokens > 0 && l.maxOutputTokens > 0 && l.maxSearches >= 0, `${m} has limits`);
    const atLimits = priceCall({ input: l.maxInputTokens, output: l.maxOutputTokens, searches: l.maxSearches }, m, pricing).usd;
    assert.equal(estimatePerCall(m, pricing), atLimits, `${m} estimate is derived from its limits`);
    // Any usage inside the limits prices at or below the estimate.
    assert.ok(priceCall({ input: l.maxInputTokens, cachedInput: 1000, output: l.maxOutputTokens - 1, searches: Math.max(0, l.maxSearches - 1) }, m, pricing).usd <= atLimits);
  }
  const home = mkdtempSync(join(tmpdir(), "vis-limits-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  const bodies = [];
  const inner = stubFetch([]);
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (init.method !== "HEAD") bodies.push({ url, body: JSON.parse(init.body) });
    return inner(url, init);
  };
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  try {
    assert.equal(await main(["--client", "fixture", "--home", home, "--runs", "1", "--prompts", "P0", "--max-usd", "5"], () => {}), 0);
  } finally {
    globalThis.fetch = realFetch;
  }
  const c = config();
  const lim = (m) => pricing.models[m].limits;
  const engineCall = bodies.find((b) => b.url.includes("openai") && !b.body.text?.format);
  assert.equal(engineCall.body.max_output_tokens, lim(c.engines.openai.model).maxOutputTokens);
  assert.equal(engineCall.body.max_tool_calls, lim(c.engines.openai.model).maxSearches);
  const gem = bodies.find((b) => b.url.includes("generativelanguage"));
  assert.equal(gem.body.generationConfig?.maxOutputTokens, lim(c.engines.gemini.model).maxOutputTokens);
  const judgeCall = bodies.find((b) => b.body.text?.format);
  assert.equal(judgeCall.body.max_output_tokens, lim(c.judge.model).maxOutputTokens);
});

test("resolveRedirect follows only https grounding redirects on Google's host, with a timeout", async () => {
  const seen = [];
  const f = async (url, init) => {
    seen.push({ url, init });
    return { headers: new Headers({ location: "https://target.test/" }) };
  };
  const ok = "https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc";
  assert.equal(await resolveRedirect(ok, f), "https://target.test/");
  assert.equal(seen.length, 1);
  assert.equal(seen[0].init.method, "HEAD");
  assert.ok(seen[0].init.signal instanceof AbortSignal, "the request has a timeout");
  for (const bad of [
    "http://vertexaisearch.cloud.google.com/grounding-api-redirect/abc",
    "https://evil.test/grounding-api-redirect/abc",
    "https://vertexaisearch.cloud.google.com.evil.test/x",
    "https://user:pw@vertexaisearch.cloud.google.com/x",
    "https://vertexaisearch.cloud.google.com:8443/x",
    "http://169.254.169.254/latest/meta-data/",
    "file:///etc/passwd",
    "not a url",
  ]) assert.equal(await resolveRedirect(bad, f), null, bad);
  assert.equal(seen.length, 1, "no request for anything but a grounding redirect");
  const hang = (url, init) => new Promise((_, rej) => init.signal.addEventListener("abort", () => rej(new Error("aborted"))));
  assert.equal(await resolveRedirect(ok, hang, 20), null, "a stalled redirect gives up");
});

test("two runs in the same second get their own directories; a taken name fails instead of being reused", async () => {
  const parent = join(mkdtempSync(join(tmpdir(), "vis-dirs-")), "runs", "x");
  const now = new Date("2026-10-30T12:34:56.789Z");
  const a = allocateRunDir(parent, now);
  const b = allocateRunDir(parent, now);
  assert.notEqual(a, b);
  assert.match(a, /2026-10-30T123456Z-[0-9a-f]{8}$/);
  allocateRunDir(parent, now, "fixed");
  assert.throws(() => allocateRunDir(parent, now, "fixed"), /EEXIST/);

  const home = mkdtempSync(join(tmpdir(), "vis-twice-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  const realFetch = globalThis.fetch;
  globalThis.fetch = stubFetch([]);
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  try {
    for (let i = 0; i < 2; i++) assert.equal(await main(["--client", "fixture", "--home", home, "--runs", "1", "--prompts", "P0", "--engines", "openai"], () => {}), 0);
  } finally {
    globalThis.fetch = realFetch;
  }
  const runs = readdirSync(join(home, "runs", "fixture"));
  assert.equal(runs.length, 2, "back-to-back runs do not share a directory");
  for (const r of runs) assert.equal(readdirSync(join(home, "runs", "fixture", r, "raw", "openai")).length, 1);
  const reports = runs.map((r) => readFileSync(join(home, "runs", "fixture", r, "report.md"), "utf8"));
  assert.equal(reports.filter((t) => /Against the run of/.test(t)).length, 1, "the later run diffs against the earlier one");
});

test("blocked, incomplete or empty generations are failures, not answers", () => {
  assert.equal(failureOpenAI(openaiBody()), null);
  assert.match(failureOpenAI({ ...openaiBody(), status: "incomplete", incomplete_details: { reason: "max_output_tokens" } }), /incomplete \(max_output_tokens\)/);
  assert.match(failureOpenAI({ ...openaiBody(), status: "failed" }), /failed/);
  assert.match(failureOpenAI({ status: "completed", output: [{ type: "web_search_call" }] }), /no output message/);
  assert.match(failureOpenAI(openaiBody("  ")), /empty text/);
  assert.equal(failureGemini(geminiBody()), null);
  assert.match(failureGemini({ promptFeedback: { blockReason: "SAFETY" } }), /blocked: SAFETY/);
  assert.match(failureGemini({ candidates: [] }), /no candidates/);
  assert.match(failureGemini({ candidates: [{ finishReason: "SAFETY", content: { parts: [] } }] }), /SAFETY/);
  assert.match(failureGemini(geminiBody("")), /empty text/);
});

test("main records a blocked Gemini answer as an error, leaves it out of the metrics, and --resume retries it", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-blocked-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  const good = stubFetch([]);
  let blocked = true;
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    const ok = (o) => ({ ok: true, status: 200, headers: new Headers(), text: async () => JSON.stringify(o) });
    if (blocked && url.includes("generativelanguage")) return ok({ promptFeedback: { blockReason: "OTHER" }, usageMetadata: { promptTokenCount: 10 } });
    if (blocked && url.includes("openai") && !JSON.parse(init.body).text?.format) return ok({ ...openaiBody(), status: "incomplete", incomplete_details: { reason: "max_output_tokens" } });
    return good(url, init);
  };
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  try {
    assert.equal(await main(["--client", "fixture", "--home", home, "--runs", "1", "--prompts", "P0", "--max-usd", "5"], () => {}), 3);
    const dir = join(home, "runs", "fixture", readdirSync(join(home, "runs", "fixture"))[0]);
    const s = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
    assert.equal(s.partial, true);
    assert.equal(s.metrics.overall.answers, 0, "no failed generation enters the denominator");
    assert.equal(s.errors.length, 2);
    assert.ok(s.errors.some((e) => /prompt blocked: OTHER/.test(e.message)));
    assert.ok(s.errors.some((e) => /incomplete/.test(e.message)));
    assert.ok(!existsSync(join(dir, "raw", "gemini")) || readdirSync(join(dir, "raw", "gemini")).length === 0);
    blocked = false;
    assert.equal(await main(["--resume", dir, "--home", home, "--max-usd", "5"], () => {}), 0);
    assert.equal(JSON.parse(readFileSync(join(dir, "summary.json"), "utf8")).metrics.overall.answers, 2);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("a failed judge call is surfaced and makes the run partial; --resume re-runs only the judge", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-judge-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  const good = stubFetch([]);
  let judgeDown = true;
  const seen = { engine: 0, judge: 0 };
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (init.method !== "HEAD") {
      const isJudge = !!JSON.parse(init.body).text?.format;
      seen[isJudge ? "judge" : "engine"] += 1;
      if (isJudge && judgeDown) return { ok: false, status: 400, headers: new Headers(), text: async () => '{"error":"bad request"}' };
    }
    return good(url, init);
  };
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  try {
    assert.equal(await main(["--client", "fixture", "--home", home, "--runs", "1", "--max-usd", "5"], () => {}), 3);
    const dir = join(home, "runs", "fixture", readdirSync(join(home, "runs", "fixture"))[0]);
    const s = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
    assert.equal(s.partial, true);
    assert.equal(s.judgePending, 6, "every answer naming someone awaits the judge");
    assert.equal(s.metrics.overall.answers, 0, "an unjudged answer is not counted as a non-mention");
    assert.match(s.partialReason, /6 stored answers await the judge/);
    assert.ok(s.errors.filter((e) => e.judge).length === 6);
    assert.match(readFileSync(join(dir, "report.md"), "utf8"), /6 stored answers await a judge verdict/);
    judgeDown = false;
    seen.engine = 0;
    seen.judge = 0;
    assert.equal(await main(["--resume", dir, "--home", home, "--max-usd", "5"], () => {}), 0);
    assert.deepEqual(seen, { engine: 0, judge: 6 }, "resume repeats no engine call");
    const after = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
    assert.equal(after.judgePending, 0);
    assert.equal(after.metrics.overall.answers, 6);
    assert.equal(after.metrics.engines.gemini.mentioned, 3, "the judge's verdict now counts the unclear hit");
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("judge rejects a verdict set that does not match the candidates, and the failure carries usage", async () => {
  const { judge } = await import("../lib/judge.mjs");
  const reply = (brands) => async () => ({ ok: true, status: 200, headers: new Headers(), text: async () => JSON.stringify({
    status: "completed", usage: { input_tokens: 100, output_tokens: 20 },
    output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({ brands }) }] }] }) });
  const cands = [{ id: "cardon", name: "Cardon Digital", unclear: true }];
  await assert.rejects(judge("x", cands, { model: "gpt-6-luna", key: "k".repeat(20), fetchImpl: reply([]) }),
    (e) => /do not match/.test(e.message) && e.usage.input === 100);
  await assert.rejects(judge("x", cands, { model: "gpt-6-luna", key: "k".repeat(20),
    fetchImpl: reply([{ id: "cardon", refers: true, sentiment: "neutral" }, { id: "cardon", refers: false, sentiment: "neutral" }]) }), /twice/);
  const ok = await judge("x", cands, { model: "gpt-6-luna", key: "k".repeat(20), fetchImpl: reply([{ id: "cardon", refers: true, sentiment: "positive" }]) });
  assert.equal(ok.verdicts.cardon.refers, true);
});

test("postJson gives up on a response that never finishes", async () => {
  const stall = (url, opts) => new Promise((_, reject) => opts.signal.addEventListener("abort", () => reject(opts.signal.reason)));
  const t0 = Date.now();
  await assert.rejects(postJson("https://example.invalid", {}, {}, { retries: 0, fetchImpl: stall, timeoutMs: 50 }), /network/);
  assert.ok(Date.now() - t0 < 5000);
});

test("the spend ledger rolls over to the new UTC day mid-run", () => {
  const home = mkdtempSync(join(tmpdir(), "vis-roll-"));
  let day = "2026-10-30";
  const l = new SpendLedger(home, 1, day, () => day);
  l.add(0.4);
  day = "2026-10-31";
  l.add(0.3);
  assert.equal(JSON.parse(readFileSync(join(home, "spend", "2026-10-30.json"), "utf8")).usd, 0.4);
  assert.equal(JSON.parse(readFileSync(join(home, "spend", "2026-10-31.json"), "utf8")).usd, 0.3);
  assert.equal(new SpendLedger(home, 1, "2026-10-31").spent, 0.3);
});

test("gemini-3.8-flash is charged its old rate through 2026-12-31 and the doubled rate from 2027-01-01 (UTC)", () => {
  const before = rateAt("gemini-3.8-flash", pricing, "2026-12-31T23:59:59.999Z");
  const after = rateAt("gemini-3.8-flash", pricing, "2027-01-01T00:00:00.000Z");
  assert.deepEqual([before.input, before.output, before.from], [0.75, 3.75, null]);
  assert.deepEqual([after.input, after.output, after.from], [1.5, 7.5, "2027-01-01"]);
  const u = { input: 1e6, output: 1e6, searches: 1 };
  assert.ok(Math.abs(priceCall(u, "gemini-3.8-flash", pricing, "2026-12-31T23:59:59Z").usd - (0.75 + 3.75 + 0.014)) < 1e-9);
  assert.ok(Math.abs(priceCall(u, "gemini-3.8-flash", pricing, "2027-01-01T00:00:00Z").usd - (1.5 + 7.5 + 0.014)) < 1e-9);
  // The cap reserves at the rate in force at reservation time.
  const lo = estimatePerCall("gemini-3.8-flash", pricing, new Date("2026-12-31T23:59:59Z"));
  const hi = estimatePerCall("gemini-3.8-flash", pricing, new Date("2027-01-01T00:00:00Z"));
  // 4000 input and 8000 output tokens plus 6 searches: the token part doubles.
  assert.ok(Math.abs(lo - (4000 * 0.75 + 8000 * 3.75) / 1e6 - 6 * 0.014) < 1e-9, String(lo));
  assert.ok(Math.abs(hi - (4000 * 1.5 + 8000 * 7.5) / 1e6 - 6 * 0.014) < 1e-9, String(hi));
  // A model with one undated rate prices at any date.
  assert.equal(rateAt("gpt-5.5", pricing, "2020-01-01T00:00:00Z").input, 5);
});

/** Writes a run dir by hand: plan, config and stored raw answers. */
function storedRun(home, cfg, records, startedAt = "2026-10-20T10:00:00.000Z") {
  const dir = join(home, "runs", cfg.client, "2026-10-20T100000Z-old00000");
  const engines = [...new Set(records.map((r) => r.engine))];
  const promptIds = [...new Set(records.map((r) => r.promptId))];
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "plan.json"), JSON.stringify({ startedAt, runs: 1, engines, promptIds }));
  writeFileSync(join(dir, "config.json"), JSON.stringify(cfg));
  for (const r of records) {
    mkdirSync(join(dir, "raw", r.engine), { recursive: true });
    writeFileSync(join(dir, "raw", r.engine, `${r.promptId}-r${r.run}.json`), JSON.stringify(r));
  }
  return dir;
}

test("a run stored on the retired gemini-2.5-flash and gpt-5.4-mini still analyses and resumes, but never calls them again", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-retired-"));
  const cfg = config();
  cfg.engines = { openai: { model: "gpt-5.4-mini" }, gemini: { model: "gemini-2.5-flash" } };
  cfg.judge = { model: "gpt-5.4-nano" };
  cfg.prompts = cfg.prompts.slice(0, 1);
  const at = "2026-10-20T10:01:00.000Z";
  const judged = { model: "gpt-5.4-nano", verdicts: { us: { refers: true, sentiment: "positive" }, ola: { refers: true, sentiment: "neutral" } }, usage: { input: 500, cachedInput: 0, output: 40, searches: 0 } };
  // Old-format records: no saved rate, so they price at the rate of their date.
  const dir = storedRun(home, cfg, [
    { engine: "openai", model: "gpt-5.4-mini", promptId: "P0", run: 1, at, prompt: "x", response: openaiBody(), judge: judged },
    { engine: "gemini", model: "gemini-2.5-flash", promptId: "P0", run: 1, at, prompt: "x", response: geminiBody(), judge: judged },
  ]);
  const realFetch = globalThis.fetch;
  globalThis.fetch = () => assert.fail("no API call for a stored run");
  const log = [];
  try {
    assert.equal(await main(["--analyse", dir, "--home", home], (l) => log.push(l)), 0, log.join("\n"));
    const s = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
    assert.equal(s.metrics.overall.answers, 2);
    // 8000 x 0.75 + 1000 x 0.075 + 300 x 4.5 per 1M, plus 2 x $0.01
    assert.ok(Math.abs(s.cost.parts.openai.usd - 0.0274) < 1e-4, String(s.cost.parts.openai.usd));
    // 12 x 0.3 + 250 x 2.5 per 1M, plus one $0.035 grounded prompt
    assert.ok(Math.abs(s.cost.parts.gemini.usd - 0.0356) < 1e-4, String(s.cost.parts.gemini.usd));
    // Everything is stored, so --resume has nothing to call and needs no key.
    delete process.env.OPENAI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    assert.equal(await main(["--resume", dir, "--home", home], (l) => log.push(l)), 0, log.join("\n"));
    // A missing answer on a retired model fails loudly before any call.
    const { rmSync } = await import("node:fs");
    rmSync(join(dir, "raw", "gemini", "P0-r1.json"));
    log.length = 0;
    assert.equal(await main(["--resume", dir, "--home", home], (l) => log.push(l)), 1);
    assert.match(log.join("\n"), /retired models: gemini model gemini-2\.5-flash \(1 calls\)/);
    // And a new run naming a retired model fails at validation.
    mkdirSync(join(home, "clients"), { recursive: true });
    writeFileSync(join(home, "clients", "fixture.json"), JSON.stringify(cfg));
    log.length = 0;
    assert.equal(await main(["--client", "fixture", "--home", home], (l) => log.push(l)), 1);
    assert.match(log.join("\n"), /is retired/);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("a stored record keeps the rate it was charged, so a later price change never reprices it", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-rate-"));
  const cfg = config();
  cfg.engines = { gemini: { model: "gemini-3.8-flash" } };
  cfg.prompts = cfg.prompts.slice(0, 1);
  const verdicts = { us: { refers: true, sentiment: "positive" }, ola: { refers: true, sentiment: "neutral" } };
  const savedRate = { model: "gemini-3.8-flash", from: null, input: 0.75, output: 3.75, perSearch: 0.014 };
  const lunaRate = { model: "gpt-6-luna", from: null, input: 0.1, cachedInput: 0.01, output: 0.5 };
  // Stamped after the 2027 change but charged (and saved) at the old rate.
  const dir = storedRun(home, cfg, [{ engine: "gemini", model: "gemini-3.8-flash", promptId: "P0", run: 1, at: "2027-01-01T00:00:05.000Z", rate: savedRate, prompt: "x", response: geminiBody(),
    judge: { model: "gpt-6-luna", at: "2027-01-01T00:00:05.000Z", rate: lunaRate, verdicts, usage: { input: 500, cachedInput: 0, output: 40, searches: 0 } } }], "2027-01-01T00:00:00.000Z");
  assert.equal(await main(["--analyse", dir, "--home", home], () => {}), 0);
  const s = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
  assert.ok(Math.abs(s.cost.parts.gemini.usd - (12 * 0.75 + 250 * 3.75) / 1e6 - 0.014) < 1e-4, String(s.cost.parts.gemini.usd));
});

test("a live call just after 2027-01-01 reserves, charges and stores the new gemini-3.8-flash rate", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-boundary-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  const realFetch = globalThis.fetch;
  globalThis.fetch = stubFetch([]);
  const run = async (now) => {
    mock.timers.enable({ apis: ["Date"], now: new Date(now) });
    try {
      // The cap is just under the after-change reservation for one answer.
      const cap = estimatePerCall("gemini-3.8-flash", pricing, new Date("2027-01-01T00:00:01Z")) + estimatePerCall("gpt-6-luna", pricing) - 0.001;
      return await main(["--client", "fixture", "--home", home, "--runs", "1", "--engines", "gemini", "--prompts", "P0", "--max-usd", String(cap)], () => {});
    } finally {
      mock.timers.reset();
    }
  };
  try {
    assert.equal(await run("2026-12-31T23:59:58Z"), 0, "before the change the reservation fits");
    assert.equal(await run("2027-01-01T00:00:01Z"), 3, "after it the doubled reservation does not");
  } finally {
    globalThis.fetch = realFetch;
  }
  const dirs = readdirSync(join(home, "runs", "fixture")).sort();
  const rec = JSON.parse(readFileSync(join(home, "runs", "fixture", dirs[0], "raw", "gemini", "P0-r1.json"), "utf8"));
  assert.deepEqual([rec.rate.input, rec.rate.output, rec.rate.from], [0.75, 3.75, null]);
  assert.equal(rec.judge.rate.model, "gpt-6-luna");
  const spent = JSON.parse(readFileSync(join(home, "spend", "2026-12-31.json"), "utf8")).usd;
  assert.ok(Math.abs(spent - priceCall({ input: 12, output: 250, searches: 1 }, "gemini-3.8-flash", pricing, "2026-12-31T00:00:00Z").usd - priceCall({ input: 500, output: 40 }, "gpt-6-luna", pricing).usd) < 1e-6);
  // After the change, with room in the cap, the stored rate is the new one.
  // This run starts in the same (mocked) second as the capped one, so their
  // directories differ only by the random suffix: find it by what is new.
  const before = new Set(readdirSync(join(home, "runs", "fixture")));
  mock.timers.enable({ apis: ["Date"], now: new Date("2027-01-01T00:00:01Z") });
  globalThis.fetch = stubFetch([]);
  try {
    assert.equal(await main(["--client", "fixture", "--home", home, "--runs", "1", "--engines", "gemini", "--prompts", "P0", "--max-usd", "5"], () => {}), 0);
  } finally {
    mock.timers.reset();
    globalThis.fetch = realFetch;
  }
  const latest = readdirSync(join(home, "runs", "fixture")).find((d) => !before.has(d));
  const rec2 = JSON.parse(readFileSync(join(home, "runs", "fixture", latest, "raw", "gemini", "P0-r1.json"), "utf8"));
  assert.deepEqual([rec2.rate.input, rec2.rate.output, rec2.rate.from], [1.5, 7.5, "2027-01-01"]);
});

test("an engine whose model id does not exist stops on its own and names the cause; the other engine finishes", async () => {
  const home = mkdtempSync(join(tmpdir(), "vis-missing-"));
  mkdirSync(join(home, "clients"));
  writeFileSync(join(home, "clients", "fixture.json"), fixtureText);
  process.env.OPENAI_API_KEY = "test-openai-key-123456";
  process.env.GEMINI_API_KEY = "test-gemini-key-123456";
  const realFetch = globalThis.fetch;
  const ok = stubFetch([]);
  let geminiCalls = 0;
  globalThis.fetch = async (url, init) => {
    if (url.includes("generativelanguage") && init.method !== "HEAD") {
      geminiCalls += 1;
      return { ok: false, status: 404, headers: new Headers(), text: async () => '{"error":{"code":404,"message":"models/gemini-3.8-flash is not found for API version v1beta","status":"NOT_FOUND"}}' };
    }
    return ok(url, init);
  };
  const log = [];
  try {
    assert.equal(await main(["--client", "fixture", "--home", home, "--runs", "3"], (l) => log.push(l)), 3);
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.equal(geminiCalls, 1, "gemini concurrency is 1: one failure stops it");
  const dir = join(home, "runs", "fixture", readdirSync(join(home, "runs", "fixture"))[0]);
  const s = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));
  assert.equal(s.metrics.engines.openai.answers, 9, "openai answers every job");
  assert.match(s.partialReason, /gemini model gemini-3\.8-flash does not exist at the provider/);
  assert.match(log.join("\n"), /stopped early: .*does not exist/);
});


test("rateAt picks by date, not list position, and refuses a day before every rate", () => {
  const pr = { models: { m: { rates: [{ from: "2027-01-01", input: 2, output: 2 }, { input: 1, output: 1 }] },
                         f: { rates: [{ from: "2027-01-01", input: 5, output: 5 }] } } };
  assert.equal(rateAt("m", pr, "2027-01-02T00:00:00Z").input, 2);
  assert.equal(rateAt("m", pr, "2026-12-31T23:59:59Z").input, 1);
  assert.throws(() => rateAt("f", pr, "2026-12-31T00:00:00Z"), /no price/);
  assert.equal(rateAt("f", pr, "2027-01-01T00:00:00Z").input, 5);
});
