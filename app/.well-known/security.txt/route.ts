import { securityTxt } from "./security";

/* RFC 9116 security.txt. Static, and outside the locale tree: the middleware
   matcher skips any path with a dot. Unlike llms.txt it is served during the
   pre-launch gate too, because a vulnerability report does not wait for launch.
   /security.txt redirects here (next.config.mjs). */
export const dynamic = "force-static";

export function GET() {
  return new Response(securityTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
