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
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

/** USD for one call: { usd, listUsd }. */
export function priceCall(usage, model, pricing) {
  const p = pricing.models[model];
  if (!p) throw new Error(`no price for model ${model} in pricing.json`);
  const uncached = Math.max(0, usage.input - (usage.cachedInput || 0));
  const tokens = (uncached * p.input + (usage.cachedInput || 0) * (p.cachedInput ?? p.input) + usage.output * p.output) / 1e6;
  const search = (usage.searches || 0) * (p.perSearch || 0) + (usage.searches ? p.perGroundedPrompt || 0 : 0);
  const listUsd = tokens + search;
  return { usd: listUsd, listUsd };
}

/**
 * The most one call to `model` can cost: its price at the limits in
 * pricing.json (the output and search caps sent with the request, and the
 * input ceiling), so the cap's reservation is an upper bound, not a guess.
 */
export function estimatePerCall(model, pricing) {
  const p = pricing.models[model];
  if (!p) throw new Error(`no price for model ${model} in pricing.json`);
  const l = p.limits;
  if (!l || !(l.maxInputTokens > 0) || !(l.maxOutputTokens > 0) || !(l.maxSearches >= 0)) throw new Error(`model ${model} needs limits (maxInputTokens, maxOutputTokens, maxSearches) in pricing.json`);
  return priceCall({ input: l.maxInputTokens, cachedInput: 0, output: l.maxOutputTokens, searches: l.maxSearches }, model, pricing).usd;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export class SpendLedger {
  constructor(home, capUsd, day = today()) {
    this.dir = join(home, "spend");
    this.file = join(this.dir, `${day}.json`);
    this.cap = capUsd;
    this.spent = existsSync(this.file) ? JSON.parse(readFileSync(this.file, "utf8")).usd : 0;
  }

  /** True when a call estimated at `estimate` USD still fits under the cap,
   * counting what calls already in flight have reserved. */
  allows(estimate) {
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
    this.spent += usd;
    mkdirSync(this.dir, { recursive: true });
    writeFileSync(this.file, JSON.stringify({ usd: Math.round(this.spent * 1e6) / 1e6 }) + "\n");
  }
}
