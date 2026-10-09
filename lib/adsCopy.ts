import { adsContactRules, adsScope, currencyByLocale, formatPrice } from "./pricing";
import type { Locale } from "./i18n/config";

/**
 * Fills the ad management figures into a dictionary string. The dictionaries
 * carry placeholders rather than numbers, so a figure that moves in
 * lib/pricing.ts moves on every page that states it:
 *   {base} {baseCrecimiento}         the monthly base of each scope, in advance
 *   {perContact}                     the fee per qualified contact, in arrears
 *   {cap} {capCrecimiento}           the most a month can come to
 *   {minLocal} {minCrecimiento}      the minimum monthly ad budget
 *   {setupLocal} {setupCrecimiento}  the one-time campaign build
 * and the contact rules the fee is settled by:
 *   {callSeconds} {onceInDays} {disputeDays} {pauseUnder} {pauseMonths}
 */
export function adsFill(locale: Locale, text: string): string {
  const cur = currencyByLocale[locale];
  const local = adsScope("local");
  const crec = adsScope("crecimiento");
  const r = adsContactRules;
  const p = (n: number) => formatPrice(locale, n);
  return text
    .replace(/\{base\}/g, p(local.base[cur]))
    .replace(/\{baseCrecimiento\}/g, p(crec.base[cur]))
    .replace(/\{perContact\}/g, p(local.perContact[cur]))
    .replace(/\{cap\}/g, p(local.cap[cur]))
    .replace(/\{capCrecimiento\}/g, p(crec.cap[cur]))
    .replace(/\{minLocal\}/g, p(local.minimumBudget[cur]))
    .replace(/\{minCrecimiento\}/g, p(crec.minimumBudget[cur]))
    .replace(/\{setupLocal\}/g, p(local.setup[cur]))
    .replace(/\{setupCrecimiento\}/g, p(crec.setup[cur]))
    .replace(/\{callSeconds\}/g, String(r.callSeconds))
    .replace(/\{onceInDays\}/g, String(r.onceInDays))
    .replace(/\{disputeDays\}/g, String(r.disputeBusinessDays))
    .replace(/\{pauseUnder\}/g, String(r.pauseUnderContacts))
    .replace(/\{pauseMonths\}/g, String(r.pauseAfterMonths));
}
