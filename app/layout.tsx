import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { brandArt } from "@/lib/brand-art";
import "./globals.css";

/* The tab and home-screen icons of the build's brand (lib/brand-art.ts, bead
   hq-3f6ut.8). They are declared here, not as app/icon.svg, app/favicon.ico
   and app/apple-icon.png, because Next links those file conventions on every
   build, which put Cardon's saguaro on the wine brand's pages. Declared at the
   root, they reach the 404 outside the locale tree too. */
const art = brandArt(BRAND.id);
export const metadata: Metadata = {
  icons: {
    icon: art.icons.map((i) => ({ url: i.url, sizes: i.sizes, type: i.type })),
    apple: [{ url: art.apple, sizes: "180x180", type: "image/png" }],
  },
};

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
