import "./globals.css";

/* Every page renders per request so Next can stamp the CSP nonce the middleware
   sends (lib/security/csp.ts) on its inline scripts; a prerendered page would
   carry none. Production already rendered per request once the Google tag was
   configured (MeasurementScripts reads the consent cookie), and the root
   not-found renders here too, so no page is left without the nonce. */
export const dynamic = "force-dynamic";

/**
 * Pass-through root layout. The document itself (html, head, body and the site
 * chrome) is mounted one level down by SiteShell, so the lang attribute can
 * follow the locale segment. Next still needs a layout at the app root for the
 * root not-found route to exist, and this is where the global stylesheet is
 * attached so a 404 outside the locale tree is styled too.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children as React.ReactElement;
}
