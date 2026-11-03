/**
 * The brand switch's environment rules, in plain JavaScript so next.config.mjs
 * can import them as well as lib/brand.ts (docs/BRANDS.md). Nothing here reads
 * process.env: the callers pass the values in, because Next inlines a
 * NEXT_PUBLIC_* variable only where it is written out literally, and a lookup
 * made here would arrive as undefined in the browser bundle.
 */

/** @typedef {"cardon" | "vino"} Brand */

/** @type {readonly Brand[]} */
export const BRANDS = ["cardon", "vino"];

/**
 * NEXT_PUBLIC_SITE to a brand. Unset or empty is cardon, so a build that
 * forgets the variable still builds cardondigital.com. Any other value throws,
 * which fails the build: a typo must never ship one brand's site in place of
 * the other's.
 *
 * @param {string | undefined} raw
 * @returns {Brand}
 */
export function parseBrand(raw) {
  const value = (raw ?? "").trim();
  if (value === "") return "cardon";
  if (value === "cardon" || value === "vino") return value;
  throw new Error(
    `NEXT_PUBLIC_SITE must be "cardon" or "vino" (unset means cardon), got ${JSON.stringify(raw)}`,
  );
}

/**
 * An absolute https origin with no trailing slash, or "" when the value is
 * unset or is not one. A malformed URL is treated as unset, which on the wine
 * brand means noindex: the safe side.
 *
 * @param {string | undefined} raw
 * @returns {string}
 */
export function parseOrigin(raw) {
  const value = (raw ?? "").trim();
  if (value === "") return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash) return "";
    return url.origin;
  } catch {
    return "";
  }
}

/**
 * Whether search engines may index the brand's site. cardondigital.com always
 * may (the preview and pre-launch gates are separate). The wine brand may only
 * once NEXT_PUBLIC_SITE_URL names its own domain: unset, or still a
 * *.vercel.app address, every page and file says noindex.
 *
 * @param {Brand} brand
 * @param {string} siteOrigin the parsed NEXT_PUBLIC_SITE_URL
 * @returns {boolean}
 */
export function brandIndexable(brand, siteOrigin) {
  if (brand === "cardon") return true;
  if (siteOrigin === "") return false;
  return !new URL(siteOrigin).hostname.endsWith(".vercel.app");
}
