/**
 * cost: prices a call from its usage, and enforces the daily cost cap.
 *
 * Prices live in pricing.json with the date and page they were read from; they
 * are list prices, so the report states an estimate, not an invoice. A model
 * marked "free": true (Gemini on a free AI Studio key) costs 0 but its
 * list-price equivalent is still computed, so a later move to a paid key has
 * a number to compare against.
 *
 * The cap is per UTC day across every run and client: spend/<day>.json in the
 * tracker home holds what was spent today, and a call starts only if today's
 * spend plus the model's worst-case estimate fits under --max-usd.
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
  return { usd: p.free ? 0 : listUsd, listUsd };
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

  /** True when a call estimated at `estimate` USD still fits under the cap. */
  allows(estimate) {
    return this.spent + estimate <= this.cap;
  }

  add(usd) {
    this.spent += usd;
    mkdirSync(this.dir, { recursive: true });
    writeFileSync(this.file, JSON.stringify({ usd: Math.round(this.spent * 1e6) / 1e6 }) + "\n");
  }
}
