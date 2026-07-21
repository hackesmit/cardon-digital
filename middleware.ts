import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* Pre-launch gate: when COMING_SOON=1 (set only on the Vercel production
   environment), every page on the public domain serves the holding page with a
   noindex header. Preview deployments have no such env var and serve the full
   site, gated behind Vercel Authentication. Launch = remove the env var and
   redeploy. */

export const config = {
  matcher: ["/((?!_next/|icon.svg|og.png|favicon.ico|.*\\.txt$).*)"],
};

export function middleware(req: NextRequest) {
  if (process.env.COMING_SOON !== "1") {
    return NextResponse.next();
  }
  const { pathname } = req.nextUrl;
  if (pathname === "/coming-soon") {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }
  const res = NextResponse.rewrite(new URL("/coming-soon", req.url));
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
