import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Archivo } from "next/font/google";
import ContourField from "@/components/site/ContourField";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { alternatesFor, SITE_URL } from "@/lib/i18n/metadata";
import { site } from "@/lib/i18n/site";
import {
  htmlLang,
  isLocale,
  locales,
  ogLocale,
  type Locale,
} from "@/lib/i18n/config";
import "./globals.css";

// Identity: Archivo carries display and body (Cardon system v3, 2026-08-27).
// Self-hosted by next/font, so no CDN request and no layout shift.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-archivo",
});

// Pre-paint script: apply the stored mode before first paint so there is no
// flash, and flag the document as JS-enabled so reveal-on-scroll can hide.
const modeScript =
  '(function(){try{var m=localStorage.getItem("cardon-mode");if(m==="light"||m==="dark"){document.documentElement.setAttribute("data-mode",m);}}catch(e){}document.documentElement.classList.add("js");})();';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
  const locale: Locale = params.locale;
  const s = site[locale];

  return (
    <html
      lang={htmlLang[locale]}
      data-mode="light"
      className={archivo.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <a className="sr-only" href="#main">
            {s.skipToContent}
          </a>
          <ContourField />
          <Nav />
          {children}
          <Footer locale={locale} />
        </LocaleProvider>
      </body>
    </html>
  );
}
