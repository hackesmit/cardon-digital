#!/usr/bin/env node
/**
 * visibility: an API panel that measures how often AI answer engines name a
 * business, for Cardon and later for its clients.
 *
 *   npm run visibility -- --client cardon                 full run (5 runs per prompt per engine)
 *   npm run visibility -- --client cardon --dry-run       plan and worst-case cost, no calls
 *   npm run visibility -- --client cardon --runs 1 --prompts P0,P9 --engines openai
 *   npm run visibility -- --resume <run dir>              finish a run the cap or an error stopped
 *   npm run visibility -- --analyse <run dir>             rebuild report and summary from stored answers
 *
 * Options: --max-usd N (daily cap across all runs, default 10), --home DIR
 * (tracker home; default the cardon-digital bunker tracker folder, or
 * $VISIBILITY_HOME), --config FILE (instead of --client).
 *
 * Exit 0 when the run is complete, 1 on a config or key error, 3 when the cap
 * stopped it early (the partial report is still written; --resume finishes it).
 *
 * Layout under the tracker home:
 *   clients/<client>.json                 brand, aliases, competitors, prompts, engines
 *   runs/<client>/<stamp>/raw/<engine>/<prompt>-r<n>.json   one stored answer each
 *   runs/<client>/<stamp>/summary.json    machine-readable, diffed by the next run
 *   runs/<client>/<stamp>/report.md       "API panel, directional"
 *   spend/<day>.json                      the daily cap's ledger
 *
 * This lives outside app/ and is never imported by the site, so Next neither
 * builds nor serves it. Client configs and outputs stay in the private bunker:
 * this repository is public.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { detect, domainOf } from "./lib/detect.mjs";
import { summarise } from "./lib/metrics.mjs";
import { ENGINES, redact } from "./lib/engines.mjs";
import { judge } from "./lib/judge.mjs";
import { priceCall, SpendLedger } from "./lib/cost.mjs";
import { renderReport } from "./lib/report.mjs";

const TOOL_DIR = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_HOME = resolve(TOOL_DIR, "../../../../bunkers/cardon-digital/research/2026-10/aeo/tracker");
const PRICING = JSON.parse(readFileSync(join(TOOL_DIR, "pricing.json"), "utf8"));
const INTENTS = ["branded", "category", "comparison"];

export function parseArgs(argv) {
  const opts = { runs: 5, maxUsd: 10, engines: null, prompts: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => {
      if (i + 1 >= argv.length) throw new Error(`${a} needs a value`);
      return argv[++i];
    };
    if (a === "--client") opts.client = val();
    else if (a === "--config") opts.config = val();
    else if (a === "--home") opts.home = val();
    else if (a === "--runs") opts.runs = Number(val());
    else if (a === "--max-usd") opts.maxUsd = Number(val());
    else if (a === "--engines") opts.engines = val().split(",");
    else if (a === "--prompts") opts.prompts = val().split(",");
    else if (a === "--resume") opts.resume = val();
    else if (a === "--analyse" || a === "--analyze") opts.analyse = val();
    else if (a === "--dry-run") opts.dryRun = true;
    else throw new Error(`unknown option ${a}`);
  }
  if (!Number.isInteger(opts.runs) || opts.runs < 1) throw new Error("--runs must be a positive integer");
  if (!(opts.maxUsd >= 0)) throw new Error("--max-usd must be a number");
  return opts;
}

/** Throws on a config the run cannot use; returns it with defaults filled. */
export function validateConfig(c) {
  const fail = (m) => {
    throw new Error(`config: ${m}`);
  };
  if (!c.client) fail("client is required");
  if (!c.brand?.id || !c.brand?.name) fail("brand.id and brand.name are required");
  const ids = new Set([c.brand.id]);
  for (const comp of c.competitors || []) {
    if (!comp.id || !comp.name) fail("every competitor needs id and name");
    if (ids.has(comp.id)) fail(`duplicate brand id ${comp.id}`);
    ids.add(comp.id);
  }
  if (!c.prompts?.length) fail("at least one prompt is required");
  const pids = new Set();
  for (const p of c.prompts) {
    if (!p.id || !p.text) fail("every prompt needs id and text");
    if (pids.has(p.id)) fail(`duplicate prompt id ${p.id}`);
    pids.add(p.id);
    if (!INTENTS.includes(p.intent)) fail(`prompt ${p.id}: intent must be one of ${INTENTS.join(", ")}`);
  }
  for (const [name, e] of Object.entries(c.engines || {})) {
    if (!ENGINES[name]) fail(`unknown engine ${name}`);
    if (!PRICING.models[e.model]) fail(`engine ${name}: model ${e.model} has no price in pricing.json`);
  }
  if (!Object.keys(c.engines || {}).length) fail("at least one engine is required");
  if (!c.judge?.model || !PRICING.models[c.judge.model]) fail("judge.model is required and must be priced");
  return c;
}

/** Brands in the shape detect() wants: us first, then competitors. */
export function brandsOf(config) {
  return [config.brand, ...(config.competitors || [])];
}

/**
 * One stored record to the analysed answer metrics.mjs consumes. Unclear hits
 * count only when the stored judge verdict accepts them.
 */
export function analyse(record, config) {
  const parsed = ENGINES[record.engine].parse(record.response);
  const prompt = config.prompts.find((p) => p.id === record.promptId);
  const { mentions, unclear } = detect(parsed.text, brandsOf(config));
  const verdicts = record.judge?.verdicts || {};
  const out = {};
  for (const m of mentions) out[m.id] = { position: m.position, sentiment: verdicts[m.id]?.sentiment || "unknown" };
  for (const u of unclear) if (verdicts[u.id]?.refers) out[u.id] = { position: u.position, sentiment: verdicts[u.id].sentiment };
  const domains = [...new Set(parsed.citations.map(domainOf).filter(Boolean))];
  return { engine: record.engine, promptId: record.promptId, intent: prompt?.intent, run: record.run, mentions: out, domains, usage: parsed.usage };
}

/** The judge candidates for one answer, or [] when it names nobody tracked. */
export function judgeCandidates(text, config) {
  const { mentions, unclear } = detect(text, brandsOf(config));
  const byId = Object.fromEntries(brandsOf(config).map((b) => [b.id, b]));
  return [
    ...mentions.map((m) => ({ id: m.id, name: byId[m.id].name, description: byId[m.id].description, unclear: false })),
    ...unclear.map((u) => ({ id: u.id, name: byId[u.id].name, description: byId[u.id].description, unclear: true })),
  ];
}

/** A key from the environment, then the env file, then Proton Pass. Never printed. */
function getKey(name, config) {
  if (process.env[name]) return process.env[name];
  const envFile = process.env.VISIBILITY_ENV_FILE || resolve(TOOL_DIR, "../../../../ops/config/visibility.env");
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, "utf8").split("\n")) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (m && m[1] === name && m[2]) return m[2].replace(/^["']|["']$/g, "");
    }
  }
  const src = config.keys?.[name];
  if (src) {
    const r = spawnSync("pp", ["item", "view", "--vault-name", src.vault, "--item-title", src.item, "--field", src.field], {
      encoding: "utf8",
      env: { ...process.env, PROTON_PASS_AGENT_REASON: `visibility tracker ${name}` },
    });
    const k = (r.stdout || "").trim();
    if (r.status === 0 && k) return k;
  }
  throw new Error(`no ${name}: set it in the environment, in ops/config/visibility.env, or as keys.${name} in the client config`);
}

/** Runs async jobs with at most `n` in flight. */
async function pool(jobs, n) {
  const results = [];
  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const i = next++;
      results[i] = await jobs[i]();
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, n) }, worker));
  return results;
}

const stamp = () => new Date().toISOString().slice(0, 16).replace(/:/g, "") + "Z";
const readJson = (f) => JSON.parse(readFileSync(f, "utf8"));
const writeJson = (f, o) => {
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, JSON.stringify(o, null, 2) + "\n");
};

function loadConfig(opts, home) {
  const file = opts.config ? resolve(opts.config) : join(home, "clients", `${opts.client}.json`);
  if (!existsSync(file)) throw new Error(`config not found: ${file}`);
  return { config: validateConfig(readJson(file)), file };
}

/** The newest earlier summary of the same client, or null. */
function previousSummary(home, client, runDir) {
  const dir = join(home, "runs", client);
  if (!existsSync(dir)) return null;
  const earlier = readdirSync(dir).filter((d) => join(dir, d) !== runDir && d < basename(runDir) && existsSync(join(dir, d, "summary.json"))).sort();
  return earlier.length ? readJson(join(dir, earlier.at(-1), "summary.json")) : null;
}

function emptyPart(model) {
  return { model, calls: 0, input: 0, output: 0, searches: 0, usd: 0, listUsd: 0 };
}

function addUsage(part, usage, model) {
  const p = priceCall(usage, model, PRICING);
  part.calls += 1;
  part.input += usage.input;
  part.output += usage.output;
  part.searches += usage.searches || 0;
  part.usd += p.usd;
  part.listUsd += p.listUsd;
  return p;
}

/** Builds summary.json and report.md from every stored record in a run dir. */
function writeOutputs(runDir, plan, config, home, extra) {
  const records = [];
  for (const engine of plan.engines) {
    const d = join(runDir, "raw", engine);
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d).filter((x) => x.endsWith(".json")).sort()) records.push(readJson(join(d, f)));
  }
  const inPlan = records.filter((r) => plan.promptIds.includes(r.promptId) && r.run <= plan.runs);
  const answers = inPlan.map((r) => analyse(r, config));
  const parts = {};
  for (const r of inPlan) {
    const model = r.model;
    addUsage((parts[r.engine] ||= emptyPart(model)), ENGINES[r.engine].parse(r.response).usage, model);
    if (r.judge) addUsage((parts.judge ||= emptyPart(r.judge.model)), r.judge.usage, r.judge.model);
  }
  const sum = (k) => Object.values(parts).reduce((s, p) => s + p[k], 0);
  const expected = plan.engines.length * plan.promptIds.length * plan.runs;
  const summary = {
    schema: 1,
    label: "API panel, directional",
    client: config.client,
    runDir: relative(home, runDir),
    startedAt: plan.startedAt,
    finishedAt: new Date().toISOString(),
    runs: plan.runs,
    promptIds: plan.promptIds,
    engines: Object.fromEntries(plan.engines.map((e) => [e, { model: config.engines[e].model }])),
    judge: { model: config.judge.model },
    expectedAnswers: expected,
    partial: answers.length < expected,
    partialReason: answers.length < expected ? `${answers.length} of ${expected} answers stored${extra.stopReason ? `; ${extra.stopReason}` : ""}` : null,
    metrics: summarise(answers, config),
    cost: {
      parts: Object.fromEntries(Object.entries(parts).map(([k, p]) => [k, { ...p, usd: Math.round(p.usd * 1e4) / 1e4, listUsd: Math.round(p.listUsd * 1e4) / 1e4 }])),
      calls: sum("calls"), input: sum("input"), output: sum("output"), searches: sum("searches"),
      usd: Math.round(sum("usd") * 1e4) / 1e4, listUsd: Math.round(sum("listUsd") * 1e4) / 1e4,
    },
    errors: extra.errors || [],
  };
  writeJson(join(runDir, "summary.json"), summary);
  writeFileSync(join(runDir, "report.md"), renderReport(summary, config, previousSummary(home, config.client, runDir)));
  return summary;
}

export async function main(argv = process.argv.slice(2), log = console.log) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (e) {
    log(`visibility: ${e.message}`);
    return 1;
  }
  const home = resolve(opts.home || process.env.VISIBILITY_HOME || DEFAULT_HOME);
  const existing = opts.resume || opts.analyse;
  let runDir;
  let plan;
  let config;
  try {
    if (existing) {
      runDir = resolve(existing);
      plan = readJson(join(runDir, "plan.json"));
      config = validateConfig(readJson(join(runDir, "config.json")));
    } else {
      if (!opts.client && !opts.config) throw new Error("--client or --config is required");
      ({ config } = loadConfig(opts, home));
      const engines = opts.engines || Object.keys(config.engines);
      for (const e of engines) if (!config.engines[e]) throw new Error(`engine ${e} is not configured for ${config.client}`);
      const promptIds = opts.prompts || config.prompts.map((p) => p.id);
      for (const p of promptIds) if (!config.prompts.some((q) => q.id === p)) throw new Error(`unknown prompt ${p}`);
      plan = { startedAt: new Date().toISOString(), runs: opts.runs, engines, promptIds };
      runDir = join(home, "runs", config.client, stamp());
    }
  } catch (e) {
    log(`visibility: ${e.message}`);
    return 1;
  }

  const calls = plan.engines.length * plan.promptIds.length * plan.runs;
  const worst = plan.engines.reduce((s, e) => s + plan.promptIds.length * plan.runs * (PRICING.models[config.engines[e].model].estimatePerCall + PRICING.models[config.judge.model].estimatePerCall), 0);
  log(`visibility: ${config.client}, ${plan.promptIds.length} prompts x ${plan.engines.join("+")} x ${plan.runs} runs = ${calls} answers; worst case $${worst.toFixed(2)}, cap $${opts.maxUsd}/day`);
  if (opts.dryRun) return 0;

  if (opts.analyse) {
    const s = writeOutputs(runDir, plan, config, home, { errors: readErrors(runDir) });
    log(`visibility: re-analysed ${s.metrics.overall.answers} answers -> ${join(runDir, "report.md")}`);
    return 0;
  }

  if (!existing) {
    writeJson(join(runDir, "plan.json"), plan);
    writeJson(join(runDir, "config.json"), config);
  }

  let keys;
  try {
    keys = { judge: getKey("OPENAI_API_KEY", config) };
    for (const e of plan.engines) keys[e] = getKey(ENGINES[e].keyName, config);
  } catch (e) {
    log(`visibility: ${e.message}`);
    return 1;
  }
  const allKeys = Object.values(keys);

  const ledger = new SpendLedger(home, opts.maxUsd);
  const errors = [];
  let stopReason = null;
  const work = {};
  for (const engine of plan.engines) {
    work[engine] = [];
    for (let run = 1; run <= plan.runs; run++) {
      for (const promptId of plan.promptIds) {
        const file = join(runDir, "raw", engine, `${promptId}-r${run}.json`);
        if (existsSync(file)) continue;
        work[engine].push({ engine, run, promptId, file });
      }
    }
  }

  const doOne = async (job) => {
    if (stopReason) return;
    const model = config.engines[job.engine].model;
    const estimate = PRICING.models[model].estimatePerCall + PRICING.models[config.judge.model].estimatePerCall;
    if (!ledger.allows(estimate)) {
      stopReason ||= `daily cap of $${opts.maxUsd} reached ($${ledger.spent.toFixed(2)} spent today)`;
      return;
    }
    const prompt = config.prompts.find((p) => p.id === job.promptId);
    try {
      const response = await ENGINES[job.engine].call(prompt, { model }, keys[job.engine]);
      const parsed = ENGINES[job.engine].parse(response);
      ledger.add(priceCall(parsed.usage, model, PRICING).usd);
      const record = { engine: job.engine, model, promptId: job.promptId, run: job.run, at: new Date().toISOString(), prompt: prompt.text, response };
      const candidates = judgeCandidates(parsed.text, config);
      if (candidates.length) {
        // A judge failure keeps the paid-for answer: definite mentions still
        // count, sentiment reads "unknown" and unclear hits stay out.
        try {
          const j = await judge(parsed.text, candidates, { model: config.judge.model, key: keys.judge });
          ledger.add(priceCall(j.usage, config.judge.model, PRICING).usd);
          record.judge = { model: config.judge.model, verdicts: j.verdicts, usage: j.usage };
        } catch (e) {
          record.judgeError = redact(e.message, allKeys);
        }
      }
      writeJson(job.file, record);
      log(`  ${job.engine} ${job.promptId} r${job.run}: ${candidates.filter((c) => c.id === config.brand.id).length ? "names us" : "-"}`);
    } catch (e) {
      errors.push({ engine: job.engine, promptId: job.promptId, run: job.run, message: redact(e.message, allKeys) });
      log(`  ${job.engine} ${job.promptId} r${job.run}: failed: ${redact(e.message, allKeys)}`);
    }
  };

  await Promise.all(plan.engines.map((e) => pool(work[e].map((j) => () => doOne(j)), config.engines[e].concurrency || 2)));
  writeJson(join(runDir, "errors.json"), errors);
  const s = writeOutputs(runDir, plan, config, home, { errors, stopReason });
  const o = s.metrics.overall;
  log(`visibility: ${o.mentioned}/${o.answers} answers name ${config.brand.name} (${o.visibility.pct}%); cost $${s.cost.usd.toFixed(2)} (list $${s.cost.listUsd.toFixed(2)}), ${s.cost.calls} calls, ${s.cost.searches} searches`);
  log(`visibility: report ${join(runDir, "report.md")}`);
  if (stopReason) log(`visibility: stopped early: ${stopReason}; finish with --resume ${runDir}`);
  return s.partial ? 3 : 0;
}

function readErrors(runDir) {
  const f = join(runDir, "errors.json");
  return existsSync(f) ? readJson(f) : [];
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => process.exit(code));
}
