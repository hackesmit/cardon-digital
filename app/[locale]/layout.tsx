import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/site/SiteShell";
import { alternatesFor, SITE_URL } from "@/lib/i18n/metadata";
import { site } from "@/lib/i18n/site";
import { isLocale, locales, ogLocale, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* Only es and en are real first segments. Without this Next treats the segment
   as open, so /nothing.txt and /anything.php match [locale] and reach the
   layout, where a request-time notFound() renders an empty shell instead of the
   404 page. Closing the segment sends every other first segment straight to the
   prerendered root not-found, which carries the chrome and the lang attribute. */
export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale: Locale = isLocale(params.locale) ? params.locale : "es";
  const s = site[locale].meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.title, template: s.titleTemplate },
    description: s.description,
    openGraph: {
      type: "website",
      url: SITE_URL + "/" + locale,
      siteName: "Cardon Digital",
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
    robots: { index: true, follow: true },
    alternates: alternatesFor(locale, "/"),
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  };
}

export default function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  if (!isLocale(params.locale)) notFound();

  return <SiteShell locale={params.locale}>{children}</SiteShell>;
}
