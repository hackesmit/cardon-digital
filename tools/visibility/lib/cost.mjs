/**
 * cost: prices a call from its usage, and enforces the daily cost cap.
 *
 * Prices live in pricing.json with the date and page they were read from; they
 * are list prices, so the report states an estimate, not an invoice. Every
 * model is charged its list price: no free tier is modelled (Gemini runs on
 * a billed project), and a "free" flag in pricing.json is ignored, so the cap
 * never treats a paid call as costing nothing. `usd` and `listUsd` are equal;
 * both stay so older summaries keep their shape.
 *
 * The cap is per UTC day across every run and client: spend/<day>.json in the
 * tracker home holds what was spent today, and a call starts only if today's
 * spend plus the call's upper-bound estimate (estimatePerCall) fits under
 * --max-usd.
 *
 * Rates are effective-dated (see rateAt): a call is charged the rate in force
 * when it was reserved, and the stored record keeps that rate, so a later
 * price change never reprices a stored run.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const RATE_KEYS = ["input", "cachedInput", "output", "perSearch", "perGroundedPrompt"];

/** A UTC date (YYYY-MM-DD) for a Date, an ISO string or nothing (now). */
function dayOf(at) {
  if (at == null) return new Date().toISOString().slice(0, 10);
  const d = at instanceof Date ? at : new Date(at);
  if (Number.isNaN(d.getTime())) throw new Error(`bad timestamp ${at}`);
  return d.toISOString().slice(0, 10);
}

/**
 * The rate a call to `model` started at `at` is charged: the last entry of
 * its `rates` whose `from` (a UTC date) is on or before that day; an entry
 * with no `from` covers every earlier day. A model written as one flat rate
 * (no `rates` list) is that rate at every date. The result carries the model
 * and its `from`, so a stored record can keep exactly what it was charged.
 */
export function rateAt(model, pricing, at) {
  const p = pricing.models[model];
  if (!p) throw new Error(`no price for model ${model} in pricing.json`);
  const rates = Array.isArray(p.rates) ? p.rates : [p];
  if (!rates.length) throw new Error(`no price for model ${model} in pricing.json`);
  const day = dayOf(at);
  let pick = rates[0];
  for (const r of rates) if (!r.from || r.from <= day) pick = r;
  const out = { model, from: pick.from || null };
  for (const k of RATE_KEYS) if (pick[k] != null) out[k] = pick[k];
  return out;
}

/** True when `model` is marked retired: priced for stored runs, never called again. */
export function isRetired(model, pricing) {
  return Boolean(pricing.models[model]?.retired);
}

/** USD for one call's usage at a given rate: { usd, listUsd, rate }. */
export function priceAtRate(usage, rate) {
  const uncached = Math.max(0, usage.input - (usage.cachedInput || 0));
  const tokens = (uncached * rate.input + (usage.cachedInput || 0) * (rate.cachedInput ?? rate.input) + usage.output * rate.output) / 1e6;
  const search = (usage.searches || 0) * (rate.perSearch || 0) + (usage.searches ? rate.perGroundedPrompt || 0 : 0);
  const listUsd = tokens + search;
  return { usd: listUsd, listUsd, rate };
}

/** USD for one call to `model` started at `at` (default now): { usd, listUsd, rate }. */
export function priceCall(usage, model, pricing, at) {
  return priceAtRate(usage, rateAt(model, pricing, at));
}

/**
 * The most one call to `model` started at `at` can cost: its price at the
 * limits in pricing.json (the output and search caps sent with the request,
 * and the input ceiling), so the cap's reservation is an upper bound, not a
 * guess. The rate is the one in force at `at` (the reservation time).
 */
export function estimatePerCall(model, pricing, at) {
  const p = pricing.models[model];
  if (!p) throw new Error(`no price for model ${model} in pricing.json`);
  const l = p.limits;
  if (!l || !(l.maxInputTokens > 0) || !(l.maxOutputTokens > 0) || !(l.maxSearches >= 0)) throw new Error(`model ${model} needs limits (maxInputTokens, maxOutputTokens, maxSearches) in pricing.json`);
  return priceCall({ input: l.maxInputTokens, cachedInput: 0, output: l.maxOutputTokens, searches: l.maxSearches }, model, pricing, at).usd;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export class SpendLedger {
  constructor(home, capUsd, day, clock) {
    this.dir = join(home, "spend");
    this.cap = capUsd;
    // A day given without a clock stays fixed (tests, replays); the default
    // follows the UTC date.
    this.clock = clock || (day ? () => day : today);
    this.load(day || today());
  }

  load(day) {
    this.day = day;
    this.file = join(this.dir, `${day}.json`);
    this.spent = existsSync(this.file) ? JSON.parse(readFileSync(this.file, "utf8")).usd : 0;
  }

  /** A run that crosses UTC midnight starts charging the new day's file,
   * so the next run that day sees what this one spent after midnight. */
  roll() {
    const d = this.clock();
    if (d !== this.day) this.load(d);
  }

  /** True when a call estimated at `estimate` USD still fits under the cap,
   * counting what calls already in flight have reserved. */
  allows(estimate) {
    this.roll();
    return this.spent + (this.reserved || 0) + estimate <= this.cap;
  }

  /** Holds `estimate` USD for a call about to start. Returns false, holding
   * nothing, when it would not fit. Concurrent workers check against the
   * reservations of calls still in flight, so the cap holds under load. */
  reserve(estimate) {
    if (!this.allows(estimate)) return false;
    this.reserved = (this.reserved || 0) + estimate;
    return true;
  }

  /** Gives back a reservation once its call has settled (spend goes through add). */
  release(estimate) {
    this.reserved = Math.max(0, (this.reserved || 0) - estimate);
  }

  add(usd) {
    this.roll();
    this.spent += usd;
    mkdirSync(this.dir, { recursive: true });
    writeFileSync(this.file, JSON.stringify({ usd: Math.round(this.spent * 1e6) / 1e6 }) + "\n");
  }
}
