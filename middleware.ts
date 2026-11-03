import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  isLocale,
  localeFromCountry,
  localeFromPath,
  localePath,
  stripLocale,
} from "@/lib/i18n/config";
import { BRAND, cleanPath, servesPath } from "@/lib/brand";
import { movedRoute, retiredRoute } from "@/lib/routes";
import { buildCsp, cspHeaderName, inlineHashes, newNonce } from "@/lib/security/csp";

/* Four jobs in one pass.
   1. Locale routing. Every page lives under /es or /en. A cardon-locale cookie
      wins because it is a choice the visitor made; otherwise the Vercel geo
      header decides, with Mexico and any unresolved country reading Spanish.
   2. Pre-launch gate. When COMING_SOON=1 (set only on the Vercel production
      environment) every page serves the holding page with a noindex header, on
      both locales. Preview deployments have no such env var and serve the full
      site, gated behind Vercel Authentication. Launch = remove the env var and
      redeploy.
   3. Content-Security-Policy. Every page response (never a redirect) carries
      a policy with a fresh nonce, and the same policy goes onto the request so
      Next can read the nonce and stamp it on its own inline scripts
      (lib/security/csp.ts has the policy and why it is shaped this way). The
      static security headers live in next.config.mjs.
   4. The brand switch (lib/brand.ts, docs/BRANDS.md). A route the build's
      brand does not serve answers 404, and on cardondigital.com a wine route
      301s to the wine domain once NEXT_PUBLIC_VINO_URL is set.

   The matcher keeps /api, Next internals, Vercel's own /_vercel endpoints (the
   visit count posts to /_vercel/insights/view, which has no extension and would
   otherwise be sent to a locale) and anything with a file extension
   (og.png, icon.svg, sitemap.xml, robots.txt, /media/*) out of the locale
   tree. */

export const config = {
  matcher: ["/((?!api/|_next/|_vercel/|.*\\..*).*)"],
};

const NOINDEX = "noindex, nofollow";

/** Where a route the brand does not serve is rewritten to. A segment starting
    with an underscore is private in the app router, so no page can ever match
    it, and Next answers with the site 404 (app/not-found.tsx) and a 404 status. */
export const BRAND_NOT_FOUND = "/_brand-not-found";

/** NextResponse.next or .rewrite, with the CSP on the request and response. */
async function page(req: NextRequest, rewrite?: URL) {
  const nonce = newNonce();
  const name = cspHeaderName();
  const csp = buildCsp({
    nonce,
    hashes: await inlineHashes(),
    dev: process.env.NODE_ENV === "development",
    preview: process.env.VERCEL_ENV === "preview",
    enforce: name === "Content-Security-Policy",
  });
  const headers = new Headers(req.headers);
  headers.set(name, csp);
  const init = { request: { headers } };
  const res = rewrite ? NextResponse.rewrite(rewrite, init) : NextResponse.next(init);
  res.headers.set(name, csp);
  return res;
}

/** The visitor's locale when the path carries none: a cardon-locale cookie is
    a choice and wins, otherwise the Vercel geo header decides. */
function chosenLocale(req: NextRequest) {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  return isLocale(cookie) ? cookie : localeFromCountry(req.headers.get("x-vercel-ip-country"));
}

export async function middleware(req: NextRequest) {
  const gated = process.env.COMING_SOON === "1";
  const { pathname } = req.nextUrl;
  const pathLocale = localeFromPath(pathname);
  const bare = stripLocale(pathname);

  /* A page the site no longer has (lib/routes.ts holds the table and the reason
     for each entry). The redirect is answered here, ahead of the locale rule
     and ahead of the pre-launch gate, so a retired address lands on its live
     page in one hop rather than bouncing through a locale prefix first. The
     status is written out per entry because Next's own redirects() emits 308
     for everything and the industry routes shipped with a 301. */
  const retired = retiredRoute(bare);
  if (retired) {
    const locale = pathLocale ?? chosenLocale(req);
    /* A plain URL rather than nextUrl.clone(): a NextURL keeps the trailing
       slash the request arrived with and would send /es/modulos/ on to
       /es/precios/, a second hop for Next's own normaliser to undo. The query
       string is carried across, so a campaign parameter survives the move. */
    const url = new URL(req.url);
    url.pathname = localePath(locale, retired.to);
    return NextResponse.redirect(url, retired.status);
  }

  /* A wine route on cardondigital.com once the wine domain exists: the same
     path there, in one hop and in the visitor's language, query carried. */
  const moved = movedRoute(BRAND, bare);
  if (moved) {
    const locale = pathLocale ?? chosenLocale(req);
    const url = new URL(localePath(locale, cleanPath(bare)), moved);
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  if (!pathLocale) {
    const locale = chosenLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = localePath(locale, pathname);
    const res = NextResponse.redirect(url);
    if (gated) res.headers.set("X-Robots-Tag", NOINDEX);
    return res;
  }

  if (!gated) {
    /* A route this brand does not serve is a 404 here, whether or not its
       page exists in the tree for the other brand. The pre-launch gate below
       answers every path with the holding page instead, as it always has. */
    if (!servesPath(BRAND, bare)) {
      const url = req.nextUrl.clone();
      url.pathname = "/" + pathLocale + BRAND_NOT_FOUND;
      return page(req, url);
    }
    return page(req);
  }

  const soon = "/" + pathLocale + "/coming-soon";
  if (pathname === soon) {
    const res = await page(req);
    res.headers.set("X-Robots-Tag", NOINDEX);
    return res;
  }
  const url = req.nextUrl.clone();
  url.pathname = soon;
  const res = await page(req, url);
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}
