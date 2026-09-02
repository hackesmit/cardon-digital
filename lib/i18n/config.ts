/**
 * Locale configuration for the bilingual site.
 *
 * Spanish is the default: the practice sells to wineries in the Valle de
 * Guadalupe and Ensenada first, so an unknown visitor is assumed to be a
 * Spanish reader until the geo header or the cookie says otherwise.
 */

export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/** Cookie set by the language switch. A chosen language always wins. */
export const LOCALE_COOKIE = "cardon-locale";

/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "es" || value === "en";
}

/** The other locale, which is what the language switch points at. */
export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

/**
 * Country code (Vercel's x-vercel-ip-country) to locale. Mexico reads Spanish,
 * a missing or unknown country reads Spanish, everywhere else reads English.
 */
export function localeFromCountry(country: string | null | undefined): Locale {
  if (!country) return "es";
  const code = country.trim().toUpperCase();
  // Vercel sends XX (and some edges T1/ZZ) when the country cannot be resolved.
  if (code === "" || code === "XX" || code === "ZZ" || code === "T1") return "es";
  if (code === "MX") return "es";
  return "en";
}

/** html lang / og:locale values. */
export const htmlLang: Record<Locale, string> = { es: "es-MX", en: "en-US" };
export const ogLocale: Record<Locale, string> = { es: "es_MX", en: "en_US" };

/** Reads the locale out of a path such as /es/industries/winery. */
export function localeFromPath(pathname: string): Locale | null {
  const seg = pathname.split("/")[1];
  return isLocale(seg) ? seg : null;
}

/** Strips the locale prefix, returning a path that always starts with "/". */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (!isLocale(seg)) return pathname === "" ? "/" : pathname;
  const rest = pathname.slice(seg.length + 1);
  return rest === "" ? "/" : rest;
}

/** Builds a locale-prefixed href from a locale-free path. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : "/" + path;
  return "/" + locale + clean;
}
