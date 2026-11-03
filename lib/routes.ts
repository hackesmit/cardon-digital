/**
 * The paths this site used to answer on, where each one lands now, and the
 * status it moves with. Locale free: localePath() puts the /es or /en in front.
 *
 * The table lives here rather than inside middleware.ts so that the middleware
 * and the route audit read the same list. app/routes.test.ts checks every entry
 * against the route files on disk: a retired path may not still have a page,
 * its target must have one, and nothing under app or components may link to a
 * path in this table.
 *
 * The statuses differ because the two removals were specified apart. The
 * industry routes shipped with a literal 301 (bead hq-wrig5.11) and keep it;
 * the modules page moves with the 308 bead hq-4pu0q.8 asks for. Both are
 * written out here because Next's own redirects() emits 308 for everything.
 */

import { MOVED_ROUTES, cleanPath, matchesRoute, servesPath, type BrandConfig } from "./brand";

export type RetiredRoute = {
  /** A live, locale-free path. Never another entry in this table. */
  to: string;
  status: 301 | 308;
};

/**
 * Retired industry pages (bead hq-wrig5.11): the site sells three areas only,
 * so clinics, construction, hiring and restaurants are gone. They pointed at
 * the modules page, which has since been retired under them, so they now land
 * where it lands rather than chaining through a second redirect.
 *
 * Retired modules page (bead hq-4pu0q.8): its result framing moved to the home
 * page, the buying detail a reader needs moved onto the pricing floor cards,
 * and the demonstration moved to the demos. /precios is where the buying
 * question it used to answer is answered now.
 */
export const RETIRED_ROUTES: Readonly<Record<string, RetiredRoute>> = {
  "/industries/clinics": { to: "/precios", status: 301 },
  "/industries/construction": { to: "/precios", status: 301 },
  "/industries/hiring": { to: "/precios", status: 301 },
  "/industries/restaurants": { to: "/precios", status: 301 },
  "/modulos": { to: "/precios", status: 308 },
};

/** Every retired path, for a caller that wants to walk them. */
export const retiredPaths: readonly string[] = Object.keys(RETIRED_ROUTES);

/**
 * The lookup the middleware does, with the trailing slash taken off first.
 * A visitor arriving on /es/modulos/ is on the retired path as surely as one
 * on /es/modulos, and a raw property read would miss it. The own-property test
 * is what keeps /constructor and /toString out of the table.
 */
export function retiredRoute(path: string): RetiredRoute | undefined {
  const clean = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return Object.prototype.hasOwnProperty.call(RETIRED_ROUTES, clean)
    ? RETIRED_ROUTES[clean]
    : undefined;
}

/**
 * Where cardondigital.com sends a wine route that moved to the wine brand
 * (bead hq-3f6ut.1): the same path on the wine domain, with a 301. Only once
 * NEXT_PUBLIC_VINO_URL is set (the config's crossLink), and only for a path
 * on MOVED_ROUTES; unset, cardon keeps serving the page and this answers
 * null. The wine brand never redirects anything this way.
 */
export function movedRoute(config: BrandConfig, path: string): string | null {
  if (config.id !== "cardon" || config.crossLink === null) return null;
  const p = cleanPath(path);
  return MOVED_ROUTES.some((r) => matchesRoute(r, p)) ? config.crossLink : null;
}

/**
 * Whether the sitemap and llms.txt list a path for a brand: one the brand
 * serves, a guide only when it is one of the brand's own guides, and the
 * guides index only when there is at least one. The slugs come in as an
 * argument so this module, which the middleware imports, carries no guide
 * text into the edge bundle.
 */
export function advertisesPath(
  config: BrandConfig,
  guideSlugs: readonly string[],
  path: string,
): boolean {
  if (!servesPath(config, path)) return false;
  if (path === "/guias") return guideSlugs.length > 0;
  const guide = /^\/guias\/([^/]+)$/.exec(path);
  return guide ? guideSlugs.includes(guide[1]) : true;
}
