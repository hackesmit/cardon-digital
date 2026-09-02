import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  isLocale,
  localeFromCountry,
  localeFromPath,
  localePath,
} from "@/lib/i18n/config";

/* Two jobs in one pass.
   1. Locale routing. Every page lives under /es or /en. A cardon-locale cookie
      wins because it is a choice the visitor made; otherwise the Vercel geo
      header decides, with Mexico and any unresolved country reading Spanish.
   2. Pre-launch gate. When COMING_SOON=1 (set only on the Vercel production
      environment) every page serves the holding page with a noindex header, on
      both locales. Preview deployments have no such env var and serve the full
      site, gated behind Vercel Authentication. Launch = remove the env var and
      redeploy.

   The matcher keeps /api, Next internals and anything with a file extension
   (og.png, icon.svg, sitemap.xml, robots.txt, /media/*) out of the locale
   tree. */

export const config = {
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};

const NOINDEX = "noindex, nofollow";

export function middleware(req: NextRequest) {
  const gated = process.env.COMING_SOON === "1";
  const { pathname } = req.nextUrl;
  const pathLocale = localeFromPath(pathname);

  if (!pathLocale) {
    const chosen = req.cookies.get(LOCALE_COOKIE)?.value;
    const locale = isLocale(chosen)
      ? chosen
      : localeFromCountry(req.headers.get("x-vercel-ip-country"));
    const url = req.nextUrl.clone();
    url.pathname = localePath(locale, pathname);
    const res = NextResponse.redirect(url);
    if (gated) res.headers.set("X-Robots-Tag", NOINDEX);
    return res;
  }

  if (!gated) return NextResponse.next();

  const soon = "/" + pathLocale + "/coming-soon";
  if (pathname === soon) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", NOINDEX);
    return res;
  }
  const url = req.nextUrl.clone();
  url.pathname = soon;
  const res = NextResponse.rewrite(url);
  res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}
