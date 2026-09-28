import { currencyByLocale, formatPrice, adsScope } from "./pricing";
import type { Locale } from "./i18n/config";

/**
 * Fills the ad management figures into a dictionary string. The dictionaries
 * carry placeholders rather than numbers, so a fee that moves in
 * lib/pricing.ts moves on every page that states it:
 *   {local} {crecimiento}            the flat monthly fee of each scope
 *   {minLocal} {minCrecimiento}      the minimum monthly ad budget
 *   {setupLocal} {setupCrecimiento}  the one-time campaign build
 */
export function adsFill(locale: Locale, text: string): string {
  const cur = currencyByLocale[locale];
  const local = adsScope("local");
  const crec = adsScope("crecimiento");
  const p = (n: number) => formatPrice(locale, n);
  return text
    .replace(/\{local\}/g, p(local.monthly[cur]))
    .replace(/\{crecimiento\}/g, p(crec.monthly[cur]))
    .replace(/\{minLocal\}/g, p(local.minimumBudget[cur]))
    .replace(/\{minCrecimiento\}/g, p(crec.minimumBudget[cur]))
    .replace(/\{setupLocal\}/g, p(local.setup[cur]))
    .replace(/\{setupCrecimiento\}/g, p(crec.setup[cur]));
}
