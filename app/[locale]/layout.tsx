import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/site/JsonLd";
import SiteShell from "@/components/site/SiteShell";
import { alternatesFor, ROBOTS, SITE_URL } from "@/lib/i18n/metadata";
import { BRAND } from "@/lib/brand";
import { site } from "@/lib/i18n/site";
import { isLocale, locales, ogLocale, type Locale } from "@/lib/i18n/config";
import { siteGraph } from "@/lib/seo/jsonld";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* Only es and en are real first segments. Without this Next treats the segment
   as open, so /nothing.txt and /anything.php match [locale] and reach the
   layout, where a request-time notFound() renders an empty shell instead of the
   404 page. Closing the segment sends every other first segment straight to the
   prerendered root not-found, which carries the chrome and the lang attribute. */
export const dynamicParams = false;

/* viewport-fit=cover lets the page reach the screen edges so the consent bar
   can pad itself clear of the home indicator with env(safe-area-inset-bottom).
   The site follows its own mode toggle, not the system scheme, and opens in
   light, so the meta tags state light: color-scheme matches the
   :root[data-mode] rule in app/globals.css, and theme-color is the light
   ground (--ground), the brand theme's (lib/brand.ts). Nav.tsx keeps theme-color on the current ground in every
   mode and across soft navigations, so the browser bar follows the toggle. */
export const viewport: Viewport = {
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: BRAND.theme.ground,
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const locale: Locale = isLocale(params.locale) ? params.locale : "es";
  const s = site[locale].meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.title, template: s.titleTemplate },
    description: s.description,
    openGraph: {
      type: "website",
      url: SITE_URL + "/" + locale,
      siteName: BRAND.name,
      title: s.title,
      description: s.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: s.ogAlt }],
      locale: ogLocale[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: s.title,
      description: s.description,
      images: ["/og.png"],
    },
    robots: ROBOTS,
    alternates: alternatesFor(locale, "/"),
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  };
}

export default async function LocaleLayout({
  children,
  params: paramsPromise,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const params = await paramsPromise;
  if (!isLocale(params.locale)) notFound();

  // The organization, site and founder graph, once per page (lib/seo/jsonld.ts).
  // A script in the body renders nothing visible.
  return (
    <SiteShell locale={params.locale}>
      <JsonLd data={siteGraph(params.locale)} />
      {children}
    </SiteShell>
  );
}
