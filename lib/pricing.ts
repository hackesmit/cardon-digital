import type { Locale } from "./i18n/config";

/**
 * Pricing data module. Data only: no formatting decisions about how a page
 * lays a scope out, no copy. Every string a reader sees lives in lib/i18n.
 *
 * The pre-winery card (Quick Win / Operations System / Full Operational Build,
 * three published USD figures plus a care and an ad floor) is gone: no current
 * document carries those numbers, and no page reads them. The site sells the
 * three winery scopes below, on both the winery page and the home page.
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

/* ============================ WINERY BUNDLES ============================
   Three scoped bundles, each a setup fee plus a monthly service fee, priced in
   research/2026-09/pricing-features.md section 2.3. Section 3.7 of that memo
   governs how the figures may be written in public:

     - one floor figure on a public surface, never the table (rule 4);
     - a figure never appears away from the feature list that produced it
       (rule 3), which is why the floor line and the three bundles live in one
       section;
     - options run most expensive first (rule 5), so `wineryBundles` is stored
       in the order the page renders;
     - USD is a conversion of the rounded MXN figure at 17.0, rounded to the
       nearest 10 USD at or above 100, never bumped off a round ending (rule 6).

   Nothing here is published while `wineryPricingPlaceholder` is true. */

export type WineryBundleId = "bitacora" | "vendimia" | "cava";

export type WineryBundle = {
  id: WineryBundleId;
  /** Packaged setup fee, the build, per currency. */
  setup: Record<CurrencyCode, number>;
  /** Monthly service fee, per currency. */
  monthly: Record<CurrencyCode, number>;
  /** Build-only price when no service fee is taken. Not published. */
  buildOnly: Record<CurrencyCode, number>;
};

/**
 * The one boolean. While it is true no winery figure reaches a page: the
 * section prints the diagnostic line where the floor figure would go, and the
 * feature lists carry the section on their own. Flip it to false and the floor
 * publishes. Nothing else changes, in either locale.
 */
export const wineryPricingPlaceholder = true;

/** Most expensive first (memo 3.7 rule 5). Render order, not price order. */
export const wineryBundles: WineryBundle[] = [
  {
    id: "cava",
    setup: { MXN: 277500, USD: 16320 },
    monthly: { MXN: 44200, USD: 2600 },
    buildOnly: { MXN: 337500, USD: 19850 },
  },
  {
    id: "vendimia",
    setup: { MXN: 113500, USD: 6680 },
    monthly: { MXN: 25600, USD: 1510 },
    buildOnly: { MXN: 153500, USD: 9030 },
  },
  {
    id: "bitacora",
    setup: { MXN: 45500, USD: 2680 },
    monthly: { MXN: 9500, USD: 560 },
    buildOnly: { MXN: 65000, USD: 3820 },
  },
];

/** The single figure a public surface is allowed to carry (memo 3.7 rule 4). */
export function winerySetupFloor(locale: Locale): number {
  const currency = currencyByLocale[locale];
  return Math.min(...wineryBundles.map((b) => b.setup[currency]));
}

/** Amount with its currency mark and code, as a public floor figure reads. */
export function formatPrice(locale: Locale, amount: number): string {
  return "$" + formatAmount(amount, locale) + " " + currencyByLocale[locale];
}
