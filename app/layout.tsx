import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import ContourField from "@/components/site/ContourField";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://cardondigital.com"),
  title: {
    default: "Cardon Digital | Growth systems built to hold water",
    template: "%s | Cardon Digital",
  },
  description:
    "Ads, website, and operations wired into one connected system your team ends up owning. Bilingual growth systems for owner-run businesses in the US and Mexico.",
  openGraph: {
    type: "website",
    url: "https://cardondigital.com",
    siteName: "Cardon Digital",
    title: "Cardon Digital | Growth systems built to hold water",
    description:
      "Ads, website, and operations wired into one connected system your team ends up owning. Bilingual growth systems for owner-run businesses in the US and Mexico.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Cardon Digital, one living system",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardon Digital | Growth systems built to hold water",
    description:
      "Ads, website, and operations wired into one connected system your team ends up owning. Bilingual growth systems for owner-run businesses in the US and Mexico.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-mode="light" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        <a className="sr-only" href="#main">
          Skip to content
        </a>
        <ContourField />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
