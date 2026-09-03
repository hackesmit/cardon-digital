import type { Locale } from "./i18n/config";

/**
 * Pricing data module. Data only: no formatting decisions about how a page
 * lays a tier out, no copy. Every string a reader sees lives in lib/i18n.
 *
 * TODO(pricing bead): the amounts below are the pre-winery card, in USD.
 * Daniel's 2026-09-02 direction is that these are too high for the Valle
 * market and get replaced by the winery tiers (Bitacora, Vendimia, Casa) in
 * MXN. Until that bead lands, `es` carries the same structure with
 * `placeholder: true` so the Spanish site never prints a peso figure we have
 * not agreed. Replace the numbers, flip the flag, and nothing else changes.
 */

export type CurrencyCode = "MXN" | "USD";

export const currencyByLocale: Record<Locale, CurrencyCode> = {
  es: "MXN",
  en: "USD",
};

export type TierId = "quickWin" | "operations" | "full";

export type TierAmounts = {
  /** Published floor, in the locale's currency. */
  from: number;
};

export type PricingTable = {
  currency: CurrencyCode;
  /** False once the pricing bead has set real figures for this locale. */
  placeholder: boolean;
  tiers: Record<TierId, TierAmounts>;
  /** Optional monthly care retainer floor. */
  care: TierAmounts;
  /** Ad management floor, a share of spend above it. */
  ads: TierAmounts;
};

export const pricing: Record<Locale, PricingTable> = {
  en: {
    currency: "USD",
    placeholder: false,
    // TODO(pricing bead): current published card, kept as is by this bead.
    tiers: {
      quickWin: { from: 3500 },
      operations: { from: 12000 },
      full: { from: 35000 },
    },
    care: { from: 400 },
    ads: { from: 1200 },
  },
  es: {
    currency: "MXN",
    // TODO(pricing bead): peso figures are not set. While this is true the
    // Spanish pricing section prints the diagnostic line instead of a number.
    placeholder: true,
    tiers: {
      quickWin: { from: 0 },
      operations: { from: 0 },
      full: { from: 0 },
    },
    care: { from: 0 },
    ads: { from: 0 },
  },
};

export const tierOrder: TierId[] = ["quickWin", "operations", "full"];

const groupLocale: Record<Locale, string> = { es: "es-MX", en: "en-US" };

/** Formats an amount for display, grouped for the locale. No currency word. */
export function formatAmount(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(groupLocale[locale], {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Amount with its currency mark, as a reader sees it in a sentence. */
export function formatMoney(locale: Locale, amount: number): string {
  const n = formatAmount(amount, locale);
  return locale === "en" ? "$" + n : "$" + n + " MXN";
}

export function pricingFor(locale: Locale): PricingTable {
  return pricing[locale];
}
