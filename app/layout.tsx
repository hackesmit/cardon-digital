import type { Metadata } from "next";
import { Bricolage_Grotesque, Archivo, Fragment_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const body = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cardondigital.com"),
  title: {
    default: "Cardon Digital - Growth systems built to hold water",
    template: "%s - Cardon Digital",
  },
  description:
    "Your ads, your site, your automations. One senior operator, no agency layers. Google Ads, web builds, and automation for US and Mexican businesses, in English and Spanish.",
  alternates: {
    canonical: "/",
    languages: { "en-US": "/", "es-MX": "/es" },
  },
  openGraph: {
    title: "Cardon Digital",
    description:
      "One senior operator. The whole growth system: ads, site, automation.",
    type: "website",
    locale: "en_US",
    alternateLocale: "es_MX",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Cardon Digital",
  description:
    "Growth systems for small business: Google Ads, web development, and automation. One senior operator serving the US and Mexico in English and Spanish.",
  url: "https://cardondigital.com",
  areaServed: ["United States", "Mexico"],
  knowsLanguage: ["en", "es"],
  founder: { "@type": "Person", name: "Daniel" },
  address: {
    "@type": "PostalAddress",
    addressRegion: "Baja California",
    addressCountry: "MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="grain font-body">
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
