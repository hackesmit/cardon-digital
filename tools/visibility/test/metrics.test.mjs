/**
 * Unit tests for tools/visibility/lib/metrics.mjs on hand-built analysed
 * answers, so each number can be checked by counting.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { wilson, classify, sliceMetrics, domainTable, gapList, summarise } from "../lib/metrics.mjs";

const config = JSON.parse(readFileSync(new URL("./fixtures/client.json", import.meta.url), "utf8"));

const near = (a, b, eps = 1e-4) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);

test("wilson matches published values", () => {
  const a = wilson(5, 10);
  near(a.lo, 0.2366);
  near(a.hi, 0.7634);
  const b = wilson(0, 10);
  near(b.lo, 0);
  near(b.hi, 0.2775);
  const c = wilson(1, 40);
  near(c.lo, 0.00443, 1e-4);
  near(c.hi, 0.12880, 1e-4);
  assert.deepEqual(wilson(0, 0), { p: 0, lo: 0, hi: 0 });
});

test("classify sorts own, competitor, directory, ugc and other", () => {
  assert.equal(classify("nopaldigital.test", config), "own");
  assert.equal(classify("blog.olastudio.test", config), "competitor");
  assert.equal(classify("directorio.test", config), "directory");
  assert.equal(classify("clutch.co", config), "directory");
  assert.equal(classify("m.facebook.com", config), "ugc");
  assert.equal(classify("periodico.test", config), "other");
});

// Four answers on one engine:
//   a1 category: Ola #1, us #3, cites olastudio + guia + nopaldigital
//   a2 category: Ola and Treinta, cites guia + directorio + periodico
//   a3 comparison: Ola only, cites periodico
//   a4 branded: us, passing mention, cites nopaldigital
const answers = [
  { engine: "openai", promptId: "P0", intent: "category", run: 1, mentions: { ola: { position: 1 }, us: { position: 3, sentiment: "positive" } }, domains: ["olastudio.test", "guia.test", "nopaldigital.test"] },
  { engine: "openai", promptId: "P0", intent: "category", run: 2, mentions: { ola: { position: 1 }, ttt: { position: 2 } }, domains: ["guia.test", "directorio.test", "periodico.test"] },
  { engine: "openai", promptId: "P1", intent: "comparison", run: 1, mentions: { ola: { position: null } }, domains: ["periodico.test"] },
  { engine: "gemini", promptId: "P2", intent: "branded", run: 1, mentions: { us: { position: null, sentiment: "neutral" } }, domains: ["nopaldigital.test"] },
];

test("visibility, non-branded visibility and citation share count answers", () => {
  const m = sliceMetrics(answers, config);
  assert.equal(m.answers, 4);
  assert.equal(m.mentioned, 2);
  assert.equal(m.visibility.pct, 50);
  assert.equal(m.nonBranded.answers, 3);
  assert.equal(m.nonBranded.mentioned, 1);
  assert.equal(m.citationShare.cited, 2);
  assert.equal(m.citationShare.pct, 50);
});

test("share of voice divides our mentioning answers by all tracked brands'", () => {
  // us 2, ola 3, ttt 1 -> 2 / 6
  assert.equal(sliceMetrics(answers, config).shareOfVoice, 33.3);
  assert.equal(sliceMetrics([], config).shareOfVoice, 0);
});

test("average position uses only mentions inside a list", () => {
  const m = sliceMetrics(answers, config);
  assert.equal(m.avgPosition, 3);
  assert.equal(m.positioned, 1);
  assert.deepEqual(m.sentiment, { positive: 1, neutral: 1, negative: 0, unknown: 0 });
});

test("domain table counts answers per host and who they sat next to", () => {
  const rows = Object.fromEntries(domainTable(answers, config).map((r) => [r.host, r]));
  assert.deepEqual({ ...rows["guia.test"] }, { host: "guia.test", cls: "other", answers: 2, withUs: 1, withCompetitor: 2 });
  assert.equal(rows["periodico.test"].withUs, 0);
  assert.equal(rows["nopaldigital.test"].cls, "own");
});

test("gap list keeps third-party hosts cited with competitors and never with us", () => {
  const gaps = gapList(answers, config).map((r) => r.host);
  // periodico: 2 competitor answers, 0 with us. directorio: 1, 0. guia is out
  // (cited with us once); olastudio is a competitor's own site.
  assert.deepEqual(gaps, ["periodico.test", "directorio.test"]);
});

test("summarise splits by engine and by prompt", () => {
  const s = summarise(answers, config);
  assert.deepEqual(Object.keys(s.engines), ["gemini", "openai"]);
  assert.equal(s.engines.openai.mentioned, 1);
  assert.deepEqual(s.prompts.P0.openai, { k: 1, n: 2, competitors: { ola: 2, ttt: 1 } });
  assert.equal(s.overall.brands.ola.mentioned, 3);
});
