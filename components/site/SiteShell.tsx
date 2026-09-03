import ContourField from "@/components/site/ContourField";
import ConsentGate from "@/components/consent/ConsentGate";
import MeasurementScripts from "@/components/consent/MeasurementScripts";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { site } from "@/lib/i18n/site";
import { htmlLang, type Locale } from "@/lib/i18n/config";
import { archivo } from "@/lib/fonts";

// Pre-paint script: apply the stored mode before first paint so there is no
// flash, and flag the document as JS-enabled so reveal-on-scroll can hide.
const modeScript =
  '(function(){try{var m=localStorage.getItem("cardon-mode");if(m==="light"||m==="dark"){document.documentElement.setAttribute("data-mode",m);}}catch(e){}document.documentElement.classList.add("js");})();';

/**
 * The whole document: html with the locale lang attribute, the pre-paint mode
 * script, and the site chrome around the page. Two routes mount it, the locale
 * layout for every real page and the root 404 for addresses that never reach
 * the locale tree, so a missing page keeps the nav, the footer and a lang.
 */
export default function SiteShell({
  locale,
  children,
}: Readonly<{ locale: Locale; children: React.ReactNode }>) {
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
        <MeasurementScripts />
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
          <ConsentGate />
        </LocaleProvider>
      </body>
    </html>
  );
}
