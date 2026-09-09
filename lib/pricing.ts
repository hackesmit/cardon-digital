import type { Locale } from "./i18n/config";

/**
 * Pricing data module. Data only: no formatting decisions about how a page
 * lays a scope out, no copy. Every string a reader sees lives in lib/i18n, so
 * what travels from here is ids, hours and figures.
 *
 * Source: research/2026-09/pricing-modules.md at commit 9dfa3b8 (approved
 * round two, bead hq-ggot1.1). Nothing here is a transcribed price. Every
 * figure below is derived from Daniel hours and the two rates by the memo's
 * own order of operations (memo section 1), so a change of hours moves the
 * price and a price nobody can rebuild from hours does not exist.
 *
 * The three floors this module publishes are STANDALONE figures (memo 8.3):
 * the packaged setup of a module's standard S bundle bought on its own. Inside
 * a mix a module line sits legitimately below its standalone floor, because an
 * added module is a smaller build; what binds every line there is the
 * cost-recovery amount for the hours actually built. The two are held apart
 * deliberately and `QuoteLine.boundBy` names which one bound each line.
 */

export type CurrencyCode = "MXN" | "USD";

export const currencyByLocale: Record<Locale, CurrencyCode> = {
  es: "MXN",
  en: "USD",
};

const groupLocale: Record<Locale, string> = { es: "es-MX", en: "en-US" };

/** Formats an amount for display, grouped for the locale. No currency word. */
export function formatAmount(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(groupLocale[locale], {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Amount with its currency mark and code, as a public floor figure reads. */
export function formatPrice(locale: Locale, amount: number): string {
  return "$" + formatAmount(amount, locale) + " " + currencyByLocale[locale];
}

/**
 * A policy rate as the percent number copy prints, so a page states 10 and 12
 * because `mixDiscountByRank` says so and not because somebody typed it. No
 * percent sign and no word: the dictionaries own how a locale says "percent".
 */
export function formatPercent(locale: Locale, fraction: number): string {
  return new Intl.NumberFormat(groupLocale[locale], {
    maximumFractionDigits: 1,
  }).format(fraction * 100);
}

/* ============================== RATES AND SIZES ==========================
   Carried over untouched from pricing-features.md, per memo "What carries
   over untouched". All prices exclude IVA. */

/** MXN per Daniel hour of build work. */
export const setupRate = 2700;
/** MXN per Daniel hour of monthly service work. */
export const serviceRate = 1225;
/**
 * Working rate against a Banxico FIX of 16.9852 published for 2026-09-02. USD
 * is always a conversion of the ROUNDED MXN figure, never of the raw amount.
 */
export const usdRate = 17.0;

export type Size = "S" | "M" | "L";
export const sizes = ["S", "M", "L"] as const;

export type BySize<T> = Record<Size, T>;

const sizeOrder: BySize<number> = { S: 0, M: 1, L: 2 };

/**
 * The largest of a set of sizes. Size is set per module (memo section 3), so a
 * mix can be M on one module and S on another, and the shared service base is
 * charged at the largest of them (memo 5.1).
 */
export function largestSize(sizesBought: Size[]): Size {
  if (sizesBought.length === 0) throw new Error("no size to compare");
  return sizesBought.reduce((a, b) => (sizeOrder[b] > sizeOrder[a] ? b : a));
}

/** Scope factor. At S it is 1.00, so there is no value premium to spend. */
export const scopeFactor: BySize<number> = { S: 1.0, M: 1.5, L: 2.05 };

/**
 * The share of the build-only price the service fee funds, so the packaged
 * setup sits below it (BUSINESS-PLAN 6.1 restated as ratios, memo section 1).
 * At S it never survives the cost-recovery cap.
 */
export const serviceFundedConcession: BySize<number> = {
  S: 0.3,
  M: 0.26,
  L: 0.18,
};

/**
 * Mix discount by rank, modules ranked by their own build-only price, most
 * expensive first (memo 6.1). Two thirds of the least-overlapping module's
 * modelled shared build, so a third of an estimate is held back everywhere.
 */
export const mixDiscountByRank = [0, 0.1, 0.12] as const;

/** Fraction of a twelve-month shared service base given back for a prepaid year. */
export const annualPrepayRate = 0.04;

/**
 * The half of `client-admin-and-case-study` that is invoicing, CFDI and
 * collection (memo 7.2). Eleven of those twelve cycles are what funds the
 * annual concession. An allocation, not a measurement (open item 8).
 */
export const collectionShareOfAdmin = 0.5;

/* ================================ ROUNDING ===============================
   pricing-features.md 2.4 with the memo's two clarifications. An exact half
   rounds DOWN, which is the convention the original catalogue was built on
   and which reproduces it cell for cell. */

/** Guards the tie test against binary float noise; 1e-9 of one increment. */
const tieEpsilon = 1e-9;

/** Rounds to the nearest `step`, an exact half going down. */
export function roundHalfDown(value: number, step: number): number {
  // A value under half a step lands on Math.ceil(-something) === -0, which
  // formats as "-0" through Intl. Adding 0 normalises -0 to 0 and leaves every
  // other result untouched (bead hq-ggot1.15).
  return Math.ceil(value / step - 0.5 - tieEpsilon) * step + 0;
}

/** Setup figures take the nearest 500 MXN. */
export function round500(value: number): number {
  return roundHalfDown(value, 500);
}

/** Monthly figures take the nearest 100 MXN. */
export function round100(value: number): number {
  return roundHalfDown(value, 100);
}

/** The smallest multiple of `step` at or above `value`. */
export function ceilTo(value: number, step: number): number {
  return Math.ceil(value / step - tieEpsilon) * step;
}

/**
 * A quote line is moved up one increment when it lands on a bare multiple:
 * 10,000 for a setup figure, 1,000 for a monthly one. A concession moves the
 * other way, because for a discount the direction that favours the floor is
 * down. An internal catalogue line is not a quote line and is never bumped.
 */
export function bumpOffBareMultiple(
  value: number,
  bare: number,
  increment: number,
  direction: "up" | "down",
): number {
  if (value % bare !== 0) return value;
  const bumped = direction === "up" ? value + increment : value - increment;
  // A downward bump never carries a figure below zero: a zero-valued line or a
  // zero-fee mix would otherwise print as a negative price (bead hq-ggot1.15).
  return bumped < 0 ? value : bumped;
}

/**
 * USD from the rounded MXN figure: nearest 10 at or above 100 USD, nearest 5
 * below, an exact half going down like every other rounding here.
 */
export function usdFromMxn(mxn: number): number {
  const raw = mxn / usdRate;
  return roundHalfDown(raw, raw >= 100 ? 10 : 5);
}

/** Both currencies for one MXN figure. USD is never priced independently. */
export function priced(mxn: number): Record<CurrencyCode, number> {
  return { MXN: mxn, USD: usdFromMxn(mxn) };
}

/**
 * Adds priced figures currency by currency, so a total a page prints adds up in
 * whichever currency it is read. USD stays a sum of the per-module USD figures
 * (each itself a conversion of a rounded MXN amount, memo rate note), never a
 * fresh conversion of the MXN sum: converting the sum and summing the
 * conversions differ by a rounding step, which is what made the /en cards and
 * the bought-separately row disagree (bead hq-ggot1.13).
 */
export function sumPriced(
  figures: Record<CurrencyCode, number>[],
): Record<CurrencyCode, number> {
  return {
    MXN: figures.reduce((sum, f) => sum + f.MXN, 0),
    USD: figures.reduce((sum, f) => sum + f.USD, 0),
  };
}

/** Hours carry at most three decimals; keeps derived hour counts readable. */
function hours3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

/** Two decimals, which is as fine as a peso amount ever needs to be shown. */
function pesos2(value: number): number {
  return Math.round(value * 100) / 100;
}

/* ========================== THE THREE MODULES ============================ */

export type ModuleId = "produccion" | "hospitalidad" | "restaurante";

export const moduleIds: readonly ModuleId[] = [
  "produccion",
  "hospitalidad",
  "restaurante",
] as const;

/**
 * A module bought at its own size. Size is set per module at the Diagnostico
 * (memo section 3), which is what lets a client be M on one module and S on
 * another, so a quote takes a selection rather than one size for the mix.
 */
export type ModuleSelection = { module: ModuleId; size: Size };

/**
 * A build feature. `hours` is null at a size where the feature does not exist.
 * `requires` marks a feature quotable only when another module is bought, which
 * is why it is in no standard bundle.
 */
export type CatalogueFeature = {
  id: string;
  hours: BySize<number | null>;
  requires?: ModuleId;
};

/**
 * A monthly service line. `providerCash` is money Cardon pays a provider on
 * the client's behalf, measured in ownership-handover.md 3.5 at S and
 * estimated above it (open item 5). A line never rounds below its own cash.
 */
export type ServiceLine = {
  id: string;
  hours: BySize<number | null>;
  providerCash?: BySize<number>;
};

/** A standard bundle entry: a catalogue feature and how many of it. */
export type BundleItem = { feature: string; count: number };

export type PricingModule = {
  id: ModuleId;
  catalogue: CatalogueFeature[];
  service: ServiceLine[];
  bundles: BySize<BundleItem[]>;
  /**
   * The feature whose environment, accounts, auth and roles are already
   * standing when this module is added to a client we already serve. One of
   * the four shared-build items behind the mix discount (memo 6.2).
   */
  recordFeature: string;
};

const one = (feature: string): BundleItem => ({ feature, count: 1 });
const many = (feature: string, count: number): BundleItem => ({ feature, count });

const produccion: PricingModule = {
  id: "produccion",
  recordFeature: "production-record",
  catalogue: [
    { id: "production-record", hours: { S: 3.6, M: 5, L: 6 } },
    { id: "extra-data-source-connector", hours: { S: 1.1, M: 1.1, L: 1.2 } },
    { id: "vintage-comparison", hours: { S: 1.4, M: 1.8, L: 2.4 } },
    { id: "commercial-record", hours: { S: 1.2, M: 2.2, L: 3 } },
    { id: "historical-vintage-load", hours: { S: 0.6, M: 0.6, L: 0.45 } },
    { id: "monthly-report-generator", hours: { S: 0.7, M: 1, L: 1.3 } },
    { id: "the-assistant", hours: { S: 2.4, M: 3.75, L: 5 } },
    { id: "prediction-or-classification-model", hours: { S: null, M: 6, L: 6 } },
    { id: "finance-workflow-automation", hours: { S: null, M: 4, L: 4 } },
    { id: "training-and-handover-pack", hours: { S: 7.4, M: 7.4, L: 7.4 } },
  ],
  service: [
    { id: "feed-and-job-watch", hours: { S: 0.06, M: 0.1, L: 0.2 } },
    { id: "module-care-and-corrections", hours: { S: 0.5, M: 0.55, L: 0.6 } },
    { id: "production-section-of-the-report", hours: { S: 0.21, M: 0.25, L: 0.3 } },
    { id: "the-assistant-upkeep", hours: { S: 0.51, M: 0.6, L: 0.7 } },
    { id: "model-and-automation-watch", hours: { S: null, M: 0.15, L: 0.25 } },
  ],
  bundles: {
    S: [
      one("production-record"),
      one("vintage-comparison"),
      one("commercial-record"),
      one("historical-vintage-load"),
      one("monthly-report-generator"),
      one("the-assistant"),
      one("training-and-handover-pack"),
    ],
    M: [
      one("production-record"),
      many("extra-data-source-connector", 2),
      one("vintage-comparison"),
      one("commercial-record"),
      many("historical-vintage-load", 2),
      one("monthly-report-generator"),
      one("the-assistant"),
      one("training-and-handover-pack"),
    ],
    L: [
      one("production-record"),
      many("extra-data-source-connector", 3),
      one("vintage-comparison"),
      one("commercial-record"),
      many("historical-vintage-load", 4),
      one("monthly-report-generator"),
      one("the-assistant"),
      one("prediction-or-classification-model"),
      one("finance-workflow-automation"),
      one("training-and-handover-pack"),
    ],
  },
};

const hospitalidad: PricingModule = {
  id: "hospitalidad",
  recordFeature: "unit-and-stay-record",
  catalogue: [
    { id: "unit-and-stay-record", hours: { S: 2.8, M: 4, L: 5.2 } },
    { id: "channel-feed-connector", hours: { S: 1, M: 1.1, L: 1.2 } },
    { id: "master-calendar", hours: { S: 1.6, M: 2.2, L: 3 } },
    { id: "day-view", hours: { S: 1, M: 1.3, L: 1.6 } },
    { id: "unit-status-board", hours: { S: 1.4, M: 1.9, L: 2.4 } },
    { id: "guest-record", hours: { S: 0.8, M: 1.1, L: 1.4 } },
    { id: "occupancy-and-revenue-by-channel", hours: { S: 1.3, M: 1.8, L: 2.4 } },
    { id: "direct-booking-capture", hours: { S: 1.5, M: 1.9, L: 2.3 } },
    { id: "tasting-room-and-event-booking", hours: { S: null, M: 1.5, L: 1.8 } },
    { id: "channel-manager-connector", hours: { S: null, M: 2.4, L: 2.8 } },
    {
      id: "restaurant-bridge",
      hours: { S: 0.8, M: 1.1, L: 1.4 },
      requires: "restaurante",
    },
    { id: "direct-and-club-follow-up", hours: { S: null, M: 1.8, L: 2.2 } },
    { id: "historical-stay-load", hours: { S: 0.6, M: 0.6, L: 0.45 } },
    { id: "brochure-or-booking-site", hours: { S: 1.75, M: 2, L: null } },
    { id: "conversion-tracking-and-ga4", hours: { S: 1, M: 1.45, L: 2 } },
    { id: "google-ads-build", hours: { S: 4.05, M: 6.55, L: 9.05 } },
    { id: "monthly-report-generator", hours: { S: 0.7, M: 1, L: 1.3 } },
    { id: "the-assistant", hours: { S: 2, M: 3, L: 4 } },
    { id: "training-and-handover-pack", hours: { S: 6, M: 6, L: 6 } },
  ],
  service: [
    { id: "channel-feed-watch", hours: { S: 0.3, M: 0.45, L: 0.65 } },
    { id: "module-care-and-corrections", hours: { S: 0.55, M: 0.65, L: 0.75 } },
    { id: "hospitality-section-of-the-report", hours: { S: 0.2, M: 0.25, L: 0.3 } },
    { id: "the-assistant-upkeep", hours: { S: 0.4, M: 0.5, L: 0.6 } },
    { id: "occupancy-and-revenue-data-checks", hours: { S: 0.4, M: 0.5, L: 0.55 } },
  ],
  bundles: {
    S: [
      one("unit-and-stay-record"),
      many("channel-feed-connector", 2),
      one("master-calendar"),
      one("day-view"),
      one("unit-status-board"),
      one("guest-record"),
      one("occupancy-and-revenue-by-channel"),
      one("monthly-report-generator"),
      one("the-assistant"),
      one("training-and-handover-pack"),
    ],
    M: [
      one("unit-and-stay-record"),
      many("channel-feed-connector", 3),
      one("master-calendar"),
      one("day-view"),
      one("unit-status-board"),
      one("guest-record"),
      one("occupancy-and-revenue-by-channel"),
      one("direct-booking-capture"),
      one("channel-manager-connector"),
      one("historical-stay-load"),
      one("monthly-report-generator"),
      one("the-assistant"),
      one("training-and-handover-pack"),
    ],
    L: [
      one("unit-and-stay-record"),
      many("channel-feed-connector", 4),
      one("master-calendar"),
      one("day-view"),
      one("unit-status-board"),
      one("guest-record"),
      one("occupancy-and-revenue-by-channel"),
      one("direct-booking-capture"),
      one("channel-manager-connector"),
      many("historical-stay-load", 2),
      one("monthly-report-generator"),
      one("the-assistant"),
      one("training-and-handover-pack"),
    ],
  },
};

const restaurante: PricingModule = {
  id: "restaurante",
  recordFeature: "menu-categories-and-modifiers",
  catalogue: [
    { id: "menu-categories-and-modifiers", hours: { S: 2.2, M: 3, L: 3.8 } },
    { id: "order-taking-on-the-phone", hours: { S: 3, M: 4.2, L: 5.4 } },
    { id: "send-to-kitchen-and-course-firing", hours: { S: 1.4, M: 1.9, L: 2.4 } },
    { id: "kitchen-screen", hours: { S: 2.4, M: 3.2, L: 4 } },
    { id: "station-split", hours: { S: null, M: 1.2, L: 1.6 } },
    { id: "table-map-and-host-screen", hours: { S: 1.8, M: 2.5, L: 3.2 } },
    { id: "checkout-with-split-and-tip", hours: { S: 2, M: 2.7, L: 3.4 } },
    { id: "cash-and-manually-recorded-card", hours: { S: 0.8, M: 1, L: 1.2 } },
    { id: "payment-link-and-qr-connector", hours: { S: null, M: 1.9, L: 2.2 } },
    { id: "card-payment-reconciliation", hours: { S: null, M: null, L: 1.4 } },
    { id: "invoice-request-capture", hours: { S: 0.7, M: 0.9, L: 1.1 } },
    { id: "cancellations-and-comps-log", hours: { S: 0.6, M: 0.8, L: 1 } },
    { id: "daily-summary", hours: { S: 1.4, M: 1.9, L: 2.4 } },
    { id: "cash-cut", hours: { S: 0.8, M: 1, L: 1.2 } },
    { id: "table-reservation-seating", hours: { S: 0.9, M: 1.1, L: 1.4 } },
    {
      id: "wine-list-wired-to-the-cellar",
      hours: { S: 0.7, M: 0.9, L: 1.1 },
      requires: "produccion",
    },
    { id: "historical-menu-and-sales-load", hours: { S: 0.6, M: 0.9, L: 1.2 } },
    { id: "brochure-or-booking-site", hours: { S: 1.75, M: 2, L: null } },
    { id: "conversion-tracking-and-ga4", hours: { S: 1, M: 1.45, L: 2 } },
    { id: "google-ads-build", hours: { S: 4.05, M: 6.55, L: 9.05 } },
    { id: "monthly-report-generator", hours: { S: 0.7, M: 1, L: 1.3 } },
    { id: "the-assistant", hours: { S: 2, M: 3, L: 4 } },
    { id: "training-and-handover-pack", hours: { S: 7, M: 7, L: 7 } },
  ],
  service: [
    { id: "service-hours-watch", hours: { S: 0.5, M: 0.7, L: 0.95 } },
    { id: "module-care-and-corrections", hours: { S: 0.65, M: 0.8, L: 0.95 } },
    { id: "menu-and-price-upkeep", hours: { S: 0.35, M: 0.45, L: 0.55 } },
    { id: "payment-upkeep-and-reconciliation", hours: { S: 0.3, M: 0.4, L: 0.5 } },
    { id: "restaurant-section-of-the-report", hours: { S: 0.2, M: 0.25, L: 0.3 } },
    { id: "the-assistant-upkeep", hours: { S: 0.4, M: 0.5, L: 0.6 } },
  ],
  bundles: {
    S: [
      one("menu-categories-and-modifiers"),
      one("order-taking-on-the-phone"),
      one("send-to-kitchen-and-course-firing"),
      one("kitchen-screen"),
      one("table-map-and-host-screen"),
      one("checkout-with-split-and-tip"),
      one("cash-and-manually-recorded-card"),
      one("invoice-request-capture"),
      one("cancellations-and-comps-log"),
      one("daily-summary"),
      one("cash-cut"),
      one("monthly-report-generator"),
      one("the-assistant"),
      one("training-and-handover-pack"),
    ],
    M: [
      one("menu-categories-and-modifiers"),
      one("order-taking-on-the-phone"),
      one("send-to-kitchen-and-course-firing"),
      one("kitchen-screen"),
      one("station-split"),
      one("table-map-and-host-screen"),
      one("checkout-with-split-and-tip"),
      one("cash-and-manually-recorded-card"),
      one("payment-link-and-qr-connector"),
      one("invoice-request-capture"),
      one("cancellations-and-comps-log"),
      one("daily-summary"),
      one("cash-cut"),
      one("table-reservation-seating"),
      one("historical-menu-and-sales-load"),
      one("monthly-report-generator"),
      one("the-assistant"),
      one("training-and-handover-pack"),
    ],
    L: [
      one("menu-categories-and-modifiers"),
      one("order-taking-on-the-phone"),
      one("send-to-kitchen-and-course-firing"),
      one("kitchen-screen"),
      one("station-split"),
      one("table-map-and-host-screen"),
      one("checkout-with-split-and-tip"),
      one("cash-and-manually-recorded-card"),
      one("payment-link-and-qr-connector"),
      one("invoice-request-capture"),
      one("cancellations-and-comps-log"),
      one("daily-summary"),
      one("cash-cut"),
      one("table-reservation-seating"),
      one("historical-menu-and-sales-load"),
      one("card-payment-reconciliation"),
      one("monthly-report-generator"),
      one("the-assistant"),
      one("training-and-handover-pack"),
    ],
  },
};

export const modules: Record<ModuleId, PricingModule> = {
  produccion,
  hospitalidad,
  restaurante,
};

/* ====================== CATALOGUE AND SERVICE LINES ====================== */

function featureOf(module: PricingModule, id: string): CatalogueFeature {
  const found = module.catalogue.find((f) => f.id === id);
  if (!found) throw new Error(`${module.id}: no catalogue feature ${id}`);
  return found;
}

/** Hours of one unit of a feature at a size, or null where it does not exist. */
export function featureHours(
  moduleId: ModuleId,
  featureId: string,
  size: Size,
): number | null {
  return featureOf(modules[moduleId], featureId).hours[size];
}

/**
 * An internal catalogue line: the nearest 100 MXN with no anti-round bump,
 * which is why a connector may read 3,000. Never a quote line on its own.
 */
export function featureSetup(
  moduleId: ModuleId,
  featureId: string,
  size: Size,
): Record<CurrencyCode, number> | null {
  const h = featureHours(moduleId, featureId, size);
  if (h === null) return null;
  return priced(round100(h * setupRate * scopeFactor[size]));
}

/**
 * The cross-module features, in the memo's catalogue order: a feature quotable
 * only when another module is bought, which is why it is in no standard bundle
 * (memo 2.2 and 2.3). /modulos calls them the bridges. A mix makes them
 * quotable, it does not put them in the quote, so a page that names the build a
 * worked example buys has to say they are quoted on top the way memo 8.2's
 * third example says it of the payment link (Lucy 2026-09-08, first finding).
 */
export function bridgeFeatures(
  moduleIdsBought: ModuleId[],
): { module: ModuleId; feature: string; requires: ModuleId }[] {
  const bought = new Set(moduleIdsBought);
  return moduleIds.flatMap((id) =>
    bought.has(id)
      ? modules[id].catalogue
          .filter((f) => f.requires !== undefined && bought.has(f.requires))
          .map((f) => ({
            module: id,
            feature: f.id,
            requires: f.requires as ModuleId,
          }))
      : [],
  );
}

/** Daniel hours a module's standard bundle at this size actually buys. */
export function bundleHours(moduleId: ModuleId, size: Size): number {
  const module = modules[moduleId];
  return hours3(
    module.bundles[size].reduce((total, item) => {
      const h = featureOf(module, item.feature).hours[size];
      if (h === null) {
        throw new Error(`${moduleId} ${size} bundle: ${item.feature} is n/a`);
      }
      return total + h * item.count;
    }, 0),
  );
}

/** One monthly service line: Daniel time at the rate, plus any absorbed cash. */
function serviceLineMonthly(line: ServiceLine, size: Size): number {
  const h = line.hours[size];
  if (h === null) return 0;
  const cash = line.providerCash?.[size] ?? 0;
  const monthly = round100(h * serviceRate * scopeFactor[size] + cash);
  // A line never rounds below its own cash component: that money is already
  // out of the door, which is why the assistant account reads 500 and not 400.
  return monthly < cash ? ceilTo(cash, 100) : monthly;
}

/* ========================= SHARED SERVICE BASE =========================== */

/**
 * Charged once per client whatever the mix, at the size of the LARGEST module
 * bought (memo 5.1). These are the parts of the monthly that do not multiply
 * when a second module arrives: one stack, one assistant account, one care
 * queue, one weekly call, one report, one invoice.
 */
export const sharedServiceBaseLines: ServiceLine[] = [
  {
    id: "hosting-monitoring-and-backups",
    hours: { S: 0.1, M: 0.13, L: 0.18 },
    providerCash: { S: 762, M: 1012, L: 1462 },
  },
  {
    id: "the-assistants-provider-account",
    hours: { S: 0, M: 0, L: 0 },
    providerCash: { S: 441, M: 700, L: 1000 },
  },
  { id: "care-queue-and-judgement", hours: { S: 0.3, M: 0.35, L: 0.4 } },
  { id: "weekly-call-and-whatsapp", hours: { S: 5, M: 5.45, L: 6.2 } },
  { id: "report-assembly-and-readout", hours: { S: 0.4, M: 0.45, L: 0.5 } },
  { id: "client-admin-and-case-study", hours: { S: 0.68, M: 0.75, L: 0.85 } },
];

/** The shared base as its named lines, which is how it is written on a quote. */
export function sharedServiceBaseBreakdown(
  size: Size,
): { id: string; monthly: number }[] {
  return sharedServiceBaseLines.map((line) => ({
    id: line.id,
    monthly: serviceLineMonthly(line, size),
  }));
}

/** The quoted shared-base line: the sum of its rounded lines. */
export function sharedServiceBase(size: Size): number {
  const total = sharedServiceBaseBreakdown(size).reduce(
    (sum, line) => sum + line.monthly,
    0,
  );
  return bumpOffBareMultiple(total, 1000, 100, "up");
}

/** Provider cash Cardon absorbs per client per month at this size. */
export function absorbedProviderCash(size: Size): number {
  return sharedServiceBaseLines.reduce(
    (sum, line) => sum + (line.providerCash?.[size] ?? 0),
    0,
  );
}

/** Daniel hours a month inside the shared base. */
export function sharedServiceBaseHours(size: Size): number {
  return hours3(
    sharedServiceBaseLines.reduce((sum, l) => sum + (l.hours[size] ?? 0), 0),
  );
}

/* ============================== RUN COSTS ================================ */

/** A module's own half of the monthly fee, as its named lines. */
export function runCostBreakdown(
  moduleId: ModuleId,
  size: Size,
): { id: string; monthly: number }[] {
  return modules[moduleId].service
    .filter((line) => line.hours[size] !== null)
    .map((line) => ({ id: line.id, monthly: serviceLineMonthly(line, size) }));
}

/**
 * The quoted run-cost line for one module. Additive across modules.
 *
 * A run cost is the sum of its own rounded lines, so it can sit a little under
 * the service-rate amount for the hours it carries: Restaurante at S reads
 * 2,900 against 2.4 hours at 1,225, which is 2,940. That is the rounding
 * tolerance memo section 1 states out loud ("the memo does not bump a fee by
 * 100 to chase 31 pesos"), not a discount, and it is bounded by one rounding
 * increment. What the memo makes a floor is invariant B in 6.7, on the QUOTED
 * MONTHLY: the shared base plus every run cost clears the whole mix's Daniel
 * time and absorbed provider cash. Restaurante alone at S is 12,100 against
 * 12,081. Adding a per-line floor here would move published figures (the 2,900
 * in memo 5.2 and in worked example 3 of 8.2), which is a memo change and not
 * a code change (Lucy 2026-09-08, fifth finding; lib/pricing.test.ts pins both
 * the tolerance and the floor that does bind).
 */
export function runCost(moduleId: ModuleId, size: Size): number {
  const total = runCostBreakdown(moduleId, size).reduce(
    (sum, line) => sum + line.monthly,
    0,
  );
  return bumpOffBareMultiple(total, 1000, 100, "up");
}

/** Monthly service hours a module consumes at this size. */
export function runCostHours(moduleId: ModuleId, size: Size): number {
  return hours3(
    modules[moduleId].service.reduce((sum, l) => sum + (l.hours[size] ?? 0), 0),
  );
}

/* =============================== ADD-ONS ================================= */

export type AddOnId = "google-ads-management" | "content" | "on-site-visit";

export type AddOn = {
  id: AddOnId;
  hours: BySize<number | null>;
  /**
   * Decision 8: ads and content attach to Hospitalidad and Restaurante only,
   * never to Produccion. The visit is per client, not per module.
   */
  attachesTo: ModuleId[] | "client";
};

export const addOns: AddOn[] = [
  {
    id: "google-ads-management",
    hours: { S: null, M: 3, L: 3.5 },
    attachesTo: ["hospitalidad", "restaurante"],
  },
  {
    id: "content",
    hours: { S: 1.5, M: 1.8, L: 2 },
    attachesTo: ["hospitalidad", "restaurante"],
  },
  {
    id: "on-site-visit",
    hours: { S: null, M: 0.6, L: 2.2 },
    attachesTo: "client",
  },
];

function addOnOf(id: AddOnId): AddOn {
  const found = addOns.find((a) => a.id === id);
  if (!found) throw new Error(`no add-on ${id}`);
  return found;
}

/** An add-on is a quote line, so it takes the anti-round bump. */
export function addOnMonthly(id: AddOnId, size: Size): number | null {
  const h = addOnOf(id).hours[size];
  if (h === null) return null;
  const monthly = round100(h * serviceRate * scopeFactor[size]);
  return bumpOffBareMultiple(monthly, 1000, 100, "up");
}

/** Whether this mix at this size may be quoted this add-on at all. */
export function addOnAvailable(
  id: AddOnId,
  moduleIdsBought: ModuleId[],
  size: Size,
): boolean {
  const addOn = addOnOf(id);
  if (addOn.hours[size] === null) return false;
  if (addOn.attachesTo === "client") return true;
  return moduleIdsBought.some((m) => addOn.attachesTo.includes(m));
}

/* ================================ QUOTES ================================= */

/**
 * The build-only price: the hours the quote actually buys at the setup rate
 * and the scope factor, never below the cost-recovery amount for those hours.
 * At S the raise binds on all three modules, which is what makes each floor
 * exactly what its build costs to recover.
 */
export function buildOnly(moduleId: ModuleId, size: Size): number {
  const h = bundleHours(moduleId, size);
  const costRecovery = h * setupRate;
  const rounded = round500(h * setupRate * scopeFactor[size]);
  return rounded < costRecovery ? ceilTo(costRecovery, 500) : rounded;
}

/**
 * The four build items that do not repeat in full when a module is added to a
 * client we already serve (memo 6.2), and the share of each that is shared at
 * the second and at the third module. Estimates, open item 6.
 */
export const overlapWeights = {
  second: {
    training: 0.55,
    assistant: 0.4,
    reportGenerator: 0.5,
    recordFeature: 0.15,
  },
  third: {
    training: 0.65,
    assistant: 0.5,
    reportGenerator: 0.6,
    recordFeature: 0.2,
  },
} as const;

/** Hours of this module's bundle that do not get built again at this rank. */
export function sharedBuildHours(
  moduleId: ModuleId,
  size: Size,
  rank: 1 | 2 | 3,
): number {
  if (rank === 1) return 0;
  const w = rank === 2 ? overlapWeights.second : overlapWeights.third;
  const module = modules[moduleId];
  const h = (id: string) => featureOf(module, id).hours[size] ?? 0;
  return hours3(
    h("training-and-handover-pack") * w.training +
      h("the-assistant") * w.assistant +
      h("monthly-report-generator") * w.reportGenerator +
      h(module.recordFeature) * w.recordFeature,
  );
}

export type QuoteLine = {
  module: ModuleId;
  /** This module's own size. Size is set per module (memo section 3). */
  size: Size;
  /** 1 is the most expensive build, which is the one at full price. */
  rank: 1 | 2 | 3;
  bundleHours: number;
  buildOnly: number;
  mixDiscount: number;
  /** The build-only price after the mix discount, before the concession. */
  mixed: number;
  sharedBuildHours: number;
  /** Bundle hours less the hours that do not get built again. */
  hoursBuilt: number;
  /** hoursBuilt x 2,700. No scope factor, no discount of any kind. */
  costRecovery: number;
  packagedSetup: number;
  /**
   * Which rule set the number. "cost-recovery" means the cap bound and the
   * service-funded concession was extinguished, which is always what happens
   * at S. Never the standalone module floor: that is not what binds a line.
   */
  boundBy: "cost-recovery" | "service-funded-concession";
};

export type Quote = {
  /**
   * The size the shared service base is charged at, which is the size of the
   * LARGEST module bought (memo 5.1). In a quote where every module is the
   * same size this is that size, which is every figure this memo publishes.
   */
  size: Size;
  /** Ranked by build-only price, most expensive first. */
  modules: ModuleId[];
  /** The same ranking, each module with its own size. */
  selections: ModuleSelection[];
  lines: QuoteLine[];
  addOns: { id: AddOnId; size: Size; monthly: number }[];
  setup: Record<CurrencyCode, number>;
  monthly: Record<CurrencyCode, number>;
  /** Charged once whatever the mix, at the largest module's size. */
  sharedServiceBase: number;
  runCosts: { module: ModuleId; size: Size; monthly: number }[];
  /** True when a total landed on a bare multiple and took its increment. */
  setupBumped: boolean;
  monthlyBumped: boolean;
  /**
   * What binds every line inside a mix. Never "floor": a module floor is a
   * standalone figure and an added module is legitimately below it, because
   * it is a smaller build (memo 8.3).
   */
  pricedOn: "hours-actually-built";
};

/** One entry per module; a module named twice keeps the size named first. */
function uniqueSelections(list: ModuleSelection[]): ModuleSelection[] {
  const seen = new Map<ModuleId, ModuleSelection>();
  for (const entry of list) {
    if (!seen.has(entry.module)) seen.set(entry.module, entry);
  }
  return Array.from(seen.values());
}

/**
 * Reads either call shape into one selection list. `quote(ids, size)` is the
 * single-size form every published figure uses; `quote(selections)` is the
 * mixed-size form memo section 3 allows, where a client is M on one module and
 * S on another.
 */
function readSelections(
  bought: ModuleId[] | ModuleSelection[],
  sizeOrAddOns: Size | AddOnId[] | undefined,
  trailingAddOns: AddOnId[],
): { selections: ModuleSelection[]; chosenAddOns: AddOnId[] } {
  if (bought.length === 0) throw new Error("a quote needs at least one module");
  if (typeof bought[0] === "string") {
    if (typeof sizeOrAddOns !== "string") {
      throw new Error("a quote of module ids needs a size");
    }
    const size = sizeOrAddOns;
    return {
      selections: uniqueSelections(
        (bought as ModuleId[]).map((module) => ({ module, size })),
      ),
      chosenAddOns: trailingAddOns,
    };
  }
  return {
    selections: uniqueSelections(bought as ModuleSelection[]),
    chosenAddOns: (sizeOrAddOns as AddOnId[] | undefined) ?? [],
  };
}

/**
 * The size an add-on is quoted at once sizes can differ per module. The
 * on-site visit is per client and takes the largest module's size, which is
 * what memo 5.3 says. Ads and content are the work of the module they manage,
 * so they take the largest size among the bought modules they attach to. In a
 * single-size quote the two readings coincide, so no published figure moves.
 */
function addOnSize(
  addOn: AddOn,
  ranked: ModuleSelection[],
  baseSize: Size,
): Size {
  if (addOn.attachesTo === "client") return baseSize;
  const attached = addOn.attachesTo;
  const bought = ranked.filter((r) => attached.includes(r.module));
  return bought.length === 0 ? baseSize : largestSize(bought.map((r) => r.size));
}

/**
 * The mix rule. Rank the modules by their own build-only price, most expensive
 * first; the first is at full price, the second 10 percent off, the third 12.
 * The shared service base is charged once, at the largest module's size.
 *
 * Size is set per module at the Diagnostico (memo section 3), so the second
 * form takes a size per module: `quote([{ module: "produccion", size: "M" },
 * { module: "hospitalidad", size: "S" }])`. Each bundle is then priced and
 * ranked at its own size and the base is charged at the largest of them, which
 * is the configuration /modulos advertises and the old signature could not
 * price at all (Lucy 2026-09-08, third finding).
 */
export function quote(
  moduleIdsBought: ModuleId[],
  size: Size,
  chosenAddOns?: AddOnId[],
): Quote;
export function quote(
  selections: ModuleSelection[],
  chosenAddOns?: AddOnId[],
): Quote;
export function quote(
  bought: ModuleId[] | ModuleSelection[],
  sizeOrAddOns?: Size | AddOnId[],
  trailingAddOns: AddOnId[] = [],
): Quote {
  const { selections, chosenAddOns } = readSelections(
    bought,
    sizeOrAddOns,
    trailingAddOns,
  );
  const baseSize = largestSize(selections.map((s) => s.size));

  const ranked = [...selections].sort(
    (a, b) => buildOnly(b.module, b.size) - buildOnly(a.module, a.size),
  );

  const lines: QuoteLine[] = ranked.map((selection, index) => {
    const { module: moduleId, size } = selection;
    const rank = (index + 1) as 1 | 2 | 3;
    const mixDiscount = mixDiscountByRank[index];
    const build = buildOnly(moduleId, size);
    const mixed = round500(build * (1 - mixDiscount));
    const shared = sharedBuildHours(moduleId, size, rank);
    const hoursBuilt = hours3(bundleHours(moduleId, size) - shared);
    const costRecovery = hoursBuilt * setupRate;
    const concessioned = round500(mixed * (1 - serviceFundedConcession[size]));
    const bound = concessioned < costRecovery;
    return {
      module: moduleId,
      size,
      rank,
      bundleHours: bundleHours(moduleId, size),
      buildOnly: build,
      mixDiscount,
      mixed,
      sharedBuildHours: shared,
      hoursBuilt,
      costRecovery: pesos2(costRecovery),
      packagedSetup: bound ? ceilTo(costRecovery, 500) : concessioned,
      boundBy: bound ? "cost-recovery" : "service-funded-concession",
    };
  });

  const setupRaw = lines.reduce((sum, line) => sum + line.packagedSetup, 0);
  const setupTotal = bumpOffBareMultiple(setupRaw, 10000, 500, "up");

  const boughtIds = ranked.map((r) => r.module);
  const chosen = chosenAddOns.map((id) => {
    const size = addOnSize(addOnOf(id), ranked, baseSize);
    if (!addOnAvailable(id, boughtIds, size)) {
      throw new Error(`add-on ${id} is not available on this mix at ${size}`);
    }
    return { id, size, monthly: addOnMonthly(id, size) as number };
  });

  const base = sharedServiceBase(baseSize);
  const runCosts = ranked.map((r) => ({
    module: r.module,
    size: r.size,
    monthly: runCost(r.module, r.size),
  }));
  const monthlyRaw =
    base +
    runCosts.reduce((sum, r) => sum + r.monthly, 0) +
    chosen.reduce((sum, a) => sum + a.monthly, 0);
  const monthlyTotal = bumpOffBareMultiple(monthlyRaw, 1000, 100, "up");

  return {
    size: baseSize,
    modules: boughtIds,
    selections: ranked,
    lines,
    addOns: chosen,
    setup: priced(setupTotal),
    monthly: priced(monthlyTotal),
    sharedServiceBase: base,
    runCosts,
    setupBumped: setupTotal !== setupRaw,
    monthlyBumped: monthlyTotal !== monthlyRaw,
    pricedOn: "hours-actually-built",
  };
}

/* ============================== THE FLOORS =============================== */

export type ModuleFloor = {
  module: ModuleId;
  /** The standard S bundle that produced the figure. */
  bundle: BundleItem[];
  hours: number;
  costRecovery: number;
  setup: Record<CurrencyCode, number>;
  monthly: Record<CurrencyCode, number>;
  /**
   * A module floor is what a client pays for that module when it is the ONLY
   * one they buy. It is not a minimum on a line inside a mix (memo 8.3).
   */
  basis: "standalone";
};

function floorFor(moduleId: ModuleId): ModuleFloor {
  const q = quote([moduleId], "S");
  const hours = bundleHours(moduleId, "S");
  return {
    module: moduleId,
    bundle: modules[moduleId].bundles.S,
    hours,
    costRecovery: pesos2(hours * setupRate),
    setup: q.setup,
    monthly: q.monthly,
    basis: "standalone",
  };
}

/**
 * The one figure per module a public surface may carry, each next to the
 * feature list that produced it (memo 8.1). The per-size table never goes
 * public, in any locale, on any page.
 */
export const moduleFloors: Record<ModuleId, ModuleFloor> = {
  produccion: floorFor("produccion"),
  hospitalidad: floorFor("hospitalidad"),
  restaurante: floorFor("restaurante"),
};

/* =========================== ANNUAL PREPAYMENT =========================== */

export type AnnualPrepay = {
  size: Size;
  monthly: number;
  twelveMonths: number;
  /**
   * 4 percent of twelve months of the shared base, whatever the mix, except on
   * the two quotes at S where the paid year would otherwise land on a bare
   * multiple of 10,000 and the 100 of increment comes off here (memo 7.1).
   */
  concession: Record<CurrencyCode, number>;
  paid: Record<CurrencyCode, number>;
};

/**
 * Twelve months of the service fee paid in one payment, less 4 percent of
 * twelve months of the shared service base. The concession is on the service
 * fee only: never on setup, never on ad spend. It is funded by the eleven
 * collection cycles a single annual invoice removes (memo 7.2), which is why
 * it is a percentage of the base and not of the whole fee: a client on three
 * modules still generates one invoice.
 */
export function annualPrepay(size: Size, monthly: number): AnnualPrepay {
  const twelveMonths = monthly * 12;
  const raw = round100(sharedServiceBase(size) * 12 * annualPrepayRate);
  // A concession that lands on a bare multiple moves one increment in the
  // direction that favours the floor, which for a discount is down.
  const settled = bumpOffBareMultiple(raw, 1000, 100, "down");
  // The prepaid annual figure is a quote line too, so it never lands on a bare
  // multiple of 10,000 (memo section 1 order of operations, 7.1 and invariant
  // E in 6.7). The increment sits on the concession line rather than floating,
  // so the quote still reads paid = twelve months less the concession. Across
  // the 113 quotable configurations this bites twice, both at S: Produccion
  // plus Restaurante with no add-on (164,400 less 4,400 would be a bare
  // 160,000, so the quote is 160,100) and Hospitalidad plus Restaurante once
  // Content is bought (194,400 less 4,400 would be 190,000, so it is 190,100).
  // The concession reads 4,300 on both (bead hq-ggot1.9, memo commit 8dd9b95).
  const paid = bumpOffBareMultiple(twelveMonths - settled, 10000, 100, "up");
  const concession = twelveMonths - paid;
  return {
    size,
    monthly,
    twelveMonths,
    concession: priced(concession),
    paid: priced(paid),
  };
}

/* ============================ WORKED EXAMPLES ============================ */

/** The seven combinations, in the memo's table order. */
export const combinations: ModuleId[][] = [
  ["produccion"],
  ["hospitalidad"],
  ["restaurante"],
  ["produccion", "hospitalidad"],
  ["produccion", "restaurante"],
  ["hospitalidad", "restaurante"],
  ["produccion", "hospitalidad", "restaurante"],
];

export type WorkedExample = {
  id: string;
  size: Size;
  /** Ranked, most expensive build first, as the quote presents them. */
  modules: ModuleId[];
  quote: Quote;
  setupIfAlone: Record<CurrencyCode, number>;
  monthlyIfAlone: Record<CurrencyCode, number>;
  yearOneTogether: Record<CurrencyCode, number>;
  yearOneAlone: Record<CurrencyCode, number>;
  /**
   * What the mix takes off, in both currencies. Each one is the conversion of
   * the ROUNDED MXN saving, never the difference of two independently rounded
   * USD totals: the memo's rate note says every dollar figure is a conversion
   * of its own peso figure, and subtracting converted values quietly makes the
   * saving a figure no peso amount produced (Lucy 2026-09-08, fourth finding).
   */
  setupSaving: Record<CurrencyCode, number>;
  monthlySaving: Record<CurrencyCode, number>;
  yearOneSaving: Record<CurrencyCode, number>;
  prepay: AnnualPrepay;
  /**
   * What memo 8.1 lets a public surface carry: worked examples, each with the
   * complete feature list that produced its figure. The constraint 8.2 adds is
   * on the SIZE and not on the count, because publishing one module at two
   * sizes lets a reader rebuild a row of the S/M/L table decision 1 keeps off
   * the site. So the seven combinations at the entry size are publishable and
   * nothing above S is (Lucy 2026-09-08, second finding).
   */
  publishable: boolean;
};

/** The seven combinations at the entry size, and nothing at any other size. */
const publishableIds = new Set(
  combinations.map((c) => `s-${c.join("-")}`),
);

function workedExample(moduleIdsBought: ModuleId[], size: Size): WorkedExample {
  const q = quote(moduleIdsBought, size);
  const alone = moduleIdsBought.map((m) => quote([m], size));
  const setupIfAlone = sumPriced(alone.map((a) => a.setup));
  const monthlyIfAlone = sumPriced(alone.map((a) => a.monthly));
  const id = `${size.toLowerCase()}-${moduleIdsBought.join("-")}`;
  return {
    id,
    size,
    modules: q.modules,
    quote: q,
    setupIfAlone,
    monthlyIfAlone,
    yearOneTogether: priced(q.setup.MXN + q.monthly.MXN * 12),
    yearOneAlone: sumPriced([setupIfAlone, ...Array(12).fill(monthlyIfAlone)]),
    setupSaving: priced(setupIfAlone.MXN - q.setup.MXN),
    monthlySaving: priced(monthlyIfAlone.MXN - q.monthly.MXN),
    yearOneSaving: priced(
      setupIfAlone.MXN +
        monthlyIfAlone.MXN * 12 -
        (q.setup.MXN + q.monthly.MXN * 12),
    ),
    prepay: annualPrepay(size, q.monthly.MXN),
    publishable: publishableIds.has(id),
  };
}

/**
 * The seven combinations at S and at M, computed by the functions above rather
 * than transcribed. lib/pricing.test.ts asserts every one of them against the
 * memo's own tables.
 */
export const workedExamples: WorkedExample[] = [
  ...combinations.map((c) => workedExample(c, "S")),
  ...combinations.map((c) => workedExample(c, "M")),
];

/* =========================== THE GROWER VARIANT ==========================
   Decision 3: Produccion is sold to winemakers and to grape growers, and the
   grower version is a different feature set at the same rates, never a cheaper
   base. The module floor is a floor for the module, not for a variant: 47,000
   MXN is the smallest Produccion quote whichever catalogue it is built from
   (memo section 9). Ads, tracking and a site never attach here either. */

export const growerCatalogue: CatalogueFeature[] = [
  { id: "vineyard-block-record", hours: { S: 3.6, M: 5, L: 6 } },
  { id: "maturity-and-phenology-curve", hours: { S: 1.4, M: 1.8, L: 2.4 } },
  { id: "delivery-and-buyer-record", hours: { S: 1.2, M: 2.2, L: 3 } },
  { id: "applications-and-compliance-log", hours: { S: 1.4, M: 2, L: 2.6 } },
  { id: "irrigation-and-water-register", hours: { S: 1, M: 1.4, L: 1.8 } },
  { id: "extra-data-source-connector", hours: { S: 1.1, M: 1.1, L: 1.2 } },
  { id: "historical-season-load", hours: { S: 0.6, M: 0.6, L: 0.45 } },
  { id: "monthly-report-generator", hours: { S: 0.7, M: 1, L: 1.3 } },
  { id: "the-assistant", hours: { S: 2.4, M: 3.75, L: 5 } },
  { id: "training-and-handover-pack", hours: { S: 7.4, M: 7.4, L: 7.4 } },
];

export const growerBundleS: BundleItem[] = [
  one("vineyard-block-record"),
  one("maturity-and-phenology-curve"),
  one("delivery-and-buyer-record"),
  one("applications-and-compliance-log"),
  one("irrigation-and-water-register"),
  one("historical-season-load"),
  one("monthly-report-generator"),
  one("the-assistant"),
  one("training-and-handover-pack"),
];

/** Hours of the standard grower bundle at a size. */
export function growerBundleHours(size: Size): number {
  return hours3(
    growerBundleS.reduce((total, item) => {
      const feature = growerCatalogue.find((f) => f.id === item.feature);
      const h = feature?.hours[size];
      if (h === null || h === undefined) {
        throw new Error(`grower ${size} bundle: ${item.feature} is n/a`);
      }
      return total + h * item.count;
    }, 0),
  );
}

/**
 * The grower build-only price at S, which the cost-recovery cap makes the
 * packaged setup too. It lands above the winemaker bundle because the
 * applications log and the irrigation register have no counterpart in the
 * cellar set. The monthly is any Produccion client's monthly at that size.
 */
export function growerSetupS(): Record<CurrencyCode, number> {
  const h = growerBundleHours("S");
  const costRecovery = h * setupRate;
  const rounded = round500(h * setupRate * scopeFactor.S);
  return priced(rounded < costRecovery ? ceilTo(costRecovery, 500) : rounded);
}

/* ========================= LEGACY WINERY BUNDLES =========================
   Retired by the module model: pricing-modules.md section 11 retires
   Bitacora, Vendimia and Cava on every surface, internal and public, and the
   figures below are the pre-module card. They stay only because
   app/[locale]/page.tsx and components/pages/winery/PricingBundles.tsx still
   import them and this bead owns neither file. hq-wrig5.2 rewrites those
   pages against the module data above and deletes this block with them.

   Nothing here reaches a page while `legacyWineryPricingPlaceholder` is true. */

/** @deprecated Retired by pricing-modules.md section 11. */
export type WineryBundleId = "bitacora" | "vendimia" | "cava";

/** @deprecated Retired by pricing-modules.md section 11. */
export type WineryBundle = {
  id: WineryBundleId;
  setup: Record<CurrencyCode, number>;
  monthly: Record<CurrencyCode, number>;
  buildOnly: Record<CurrencyCode, number>;
};

/** @deprecated Retired by pricing-modules.md section 11. */
export const legacyWineryPricingPlaceholder = true;

/** @deprecated Retired by pricing-modules.md section 11. Most expensive first. */
export const legacyWineryBundles: WineryBundle[] = [
  {
    id: "cava",
    setup: priced(277500),
    monthly: priced(44200),
    buildOnly: priced(337500),
  },
  {
    id: "vendimia",
    setup: priced(113500),
    monthly: priced(25600),
    buildOnly: priced(153500),
  },
  {
    id: "bitacora",
    setup: priced(45500),
    monthly: priced(9500),
    buildOnly: priced(65000),
  },
];

/** @deprecated Retired by pricing-modules.md section 11. */
export function legacyWinerySetupFloor(locale: Locale): number {
  const currency = currencyByLocale[locale];
  return Math.min(...legacyWineryBundles.map((b) => b.setup[currency]));
}

/** @deprecated Compatibility alias for the two pages this bead does not own. */
export const wineryPricingPlaceholder = legacyWineryPricingPlaceholder;
/** @deprecated Compatibility alias for the two pages this bead does not own. */
export const wineryBundles = legacyWineryBundles;
/** @deprecated Compatibility alias for the two pages this bead does not own. */
export const winerySetupFloor = legacyWinerySetupFloor;
