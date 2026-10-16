/**
 * The package builder (Daniel, 2026-10-16): a client picks a website package,
 * an ads scope and any software modules, and sees what each includes and what
 * the whole comes to, so there are no questions later.
 *
 * Nothing here is a price. Every figure is read from lib/pricing.ts, and only
 * at the entry size, because the per-size table never goes public (memo 8.1):
 * a website package from its published figure, ads at its published scope,
 * software as quote(modules, "S"), which is what the mix example on /precios
 * already publishes. The estimate is a floor and says so; the final figure is
 * set in the written proposal after the diagnostic.
 *
 * The same module runs in the browser, to draw the estimate, and on the
 * server, to rebuild it for the lead email from the ids alone. A selection
 * that does not parse is dropped, never trusted and never fatal: a lead with a
 * bad package is still a lead.
 */

import {
  adsManagement,
  adsScope,
  moduleIds,
  quote,
  sumPriced,
  webCareMonthly,
  webPackageById,
  webPackages,
  type AdsScopeId,
  type CurrencyCode,
  type ModuleId,
  type WebPackageId,
} from "@/lib/pricing";

export type Priced = Record<CurrencyCode, number>;

export type BuilderSelection = {
  /** One website package, or none. */
  web: WebPackageId | null;
  /** Monthly website care; only meaningful with a website package. */
  care: boolean;
  /** One ads scope, or none. */
  ads: AdsScopeId | null;
  /** Any of the software modules, each at most once, in catalogue order. */
  modules: ModuleId[];
};

export const EMPTY_SELECTION: BuilderSelection = {
  web: null,
  care: false,
  ads: null,
  modules: [],
};

const WEB_IDS = new Set<string>(webPackages.map((p) => p.id));
const ADS_IDS = new Set<string>(adsManagement.map((s) => s.id));
const MODULE_IDS = new Set<string>(moduleIds);

/** True when nothing is picked. */
export function isEmptySelection(s: BuilderSelection): boolean {
  return s.web === null && s.ads === null && s.modules.length === 0;
}

/** Modules in catalogue order, each once, unknown ids gone. */
function cleanModules(list: readonly string[]): ModuleId[] {
  const picked = new Set(list.filter((m) => MODULE_IDS.has(m)));
  return moduleIds.filter((m) => picked.has(m));
}

/**
 * Reads a selection from untrusted input: the JSON body of the contact form.
 * Anything that is not exactly a known id is dropped. Returns null when the
 * input is not a selection at all or picks nothing.
 */
export function parseSelection(raw: unknown): BuilderSelection | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const web = typeof r.web === "string" && WEB_IDS.has(r.web) ? (r.web as WebPackageId) : null;
  const ads = typeof r.ads === "string" && ADS_IDS.has(r.ads) ? (r.ads as AdsScopeId) : null;
  const modules = Array.isArray(r.modules)
    ? cleanModules(r.modules.filter((m): m is string => typeof m === "string"))
    : [];
  const sel: BuilderSelection = { web, care: web !== null && r.care === true, ads, modules };
  return isEmptySelection(sel) ? null : sel;
}

/**
 * The selection as one short query value, so /precios can hand a package to
 * /contacto in a link: "w:negocio,c,a:local,m:hospitalidad+restaurante".
 */
export function encodeSelection(s: BuilderSelection): string {
  const parts: string[] = [];
  if (s.web) parts.push("w:" + s.web);
  if (s.web && s.care) parts.push("c");
  if (s.ads) parts.push("a:" + s.ads);
  if (s.modules.length > 0) parts.push("m:" + s.modules.join("+"));
  return parts.join(",");
}

/** The inverse of encodeSelection, as forgiving as parseSelection. */
export function decodeSelection(value: string | null | undefined): BuilderSelection | null {
  if (!value) return null;
  const raw: Record<string, unknown> = {};
  for (const part of value.slice(0, 200).split(",")) {
    if (part === "c") raw.care = true;
    else if (part.startsWith("w:")) raw.web = part.slice(2);
    else if (part.startsWith("a:")) raw.ads = part.slice(2);
    else if (part.startsWith("m:")) raw.modules = part.slice(2).split("+");
  }
  return parseSelection(raw);
}

export type EstimateLine =
  | { kind: "web"; id: WebPackageId; setup: Priced }
  | { kind: "care"; monthly: Priced }
  | {
      kind: "ads";
      id: AdsScopeId;
      setup: Priced;
      /** Charged in advance with the monthly fee. */
      base: Priced;
      /** Charged the month after, per qualified contact. */
      perContact: Priced;
      /** The most base plus contacts can come to in a month. */
      cap: Priced;
      /** Paid by the client straight to Google, never through Cardon. */
      minimumBudget: Priced;
    }
  | {
      kind: "software";
      modules: ModuleId[];
      setup: Priced;
      monthly: Priced;
      /** Each module's mix discount, as quote() applied it (0 for the first). */
      discounts: { module: ModuleId; rate: number }[];
    };

export type Estimate = {
  lines: EstimateLine[];
  /** Everything paid once, at entry size. */
  setup: Priced;
  /** Everything charged monthly in advance, at entry size; ads at its base. */
  monthly: Priced;
  /** setup + 12 x monthly; the ads per-contact fee is not in it. */
  yearOne: Priced;
  /** True when the ads per-contact fee comes on top of `monthly`. */
  perContactOnTop: boolean;
};

const ZERO: Priced = { MXN: 0, USD: 0 };

function times(p: Priced, n: number): Priced {
  return { MXN: p.MXN * n, USD: p.USD * n };
}

/** The estimate for a selection, or null when nothing is picked. */
export function estimate(s: BuilderSelection): Estimate | null {
  if (isEmptySelection(s)) return null;
  const lines: EstimateLine[] = [];
  const setups: Priced[] = [];
  const monthlies: Priced[] = [];

  if (s.web) {
    const setup = webPackageById(s.web).from;
    lines.push({ kind: "web", id: s.web, setup });
    setups.push(setup);
    if (s.care) {
      const monthly = webCareMonthly();
      lines.push({ kind: "care", monthly });
      monthlies.push(monthly);
    }
  }

  if (s.ads) {
    const a = adsScope(s.ads);
    lines.push({
      kind: "ads",
      id: s.ads,
      setup: a.setup,
      base: a.base,
      perContact: a.perContact,
      cap: a.cap,
      minimumBudget: a.minimumBudget,
    });
    setups.push(a.setup);
    monthlies.push(a.base);
  }

  if (s.modules.length > 0) {
    // Ads stay out of the module quote: they are priced above as the
    // standalone scope, which is the same base either way (memo section 5).
    const q = quote(s.modules, "S");
    lines.push({
      kind: "software",
      modules: q.lines.map((l) => l.module),
      setup: q.setup,
      monthly: q.monthly,
      discounts: q.lines.map((l) => ({ module: l.module, rate: l.mixDiscount })),
    });
    setups.push(q.setup);
    monthlies.push(q.monthly);
  }

  const setup = setups.length > 0 ? sumPriced(setups) : ZERO;
  const monthly = monthlies.length > 0 ? sumPriced(monthlies) : ZERO;
  return {
    lines,
    setup,
    monthly,
    yearOne: sumPriced([setup, times(monthly, 12)]),
    perContactOnTop: s.ads !== null,
  };
}
