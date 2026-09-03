import "./globals.css";

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
