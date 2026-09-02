import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { comingSoon } from "@/lib/i18n/coming-soon";
import { site } from "@/lib/i18n/site";
import "./soon.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const d = comingSoon[localeOf(params)];
  return {
    title: { absolute: d.meta.title },
    description: d.meta.description,
    robots: { index: false, follow: false },
  };
}

export default function ComingSoonPage({ params }: Params) {
  const locale = localeOf(params);
  const d = comingSoon[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(d.mailSubject);

  return (
    <main id="main" className="pg-soon">
      <div className="soon-wrap">
        <svg className="soon-mark" viewBox="0 0 26 26" aria-hidden="true" focusable="false">
                  <line x1="13" y1="20" x2="6" y2="8" strokeWidth="1.2" opacity="0.75" />
                  <line x1="13" y1="20" x2="20" y2="8" strokeWidth="1.2" opacity="0.75" />
                  <line x1="6" y1="8" x2="20" y2="8" strokeWidth="1.2" opacity="0.55" />
                  <circle className="ring" cx="6" cy="8" r="3" strokeWidth="1.4" />
                  <circle className="ring" cx="20" cy="8" r="3" strokeWidth="1.4" />
                  <circle className="dot" cx="13" cy="20" r="3.4" />
                </svg>
        <h1>
          Cardon <span>Digital</span>
        </h1>
        <p className="soon-line">{d.line}</p>
        <p className="soon-sub">{d.sub}</p>
        <a className="soon-cta" href={mailto}>
          daniel@cardondigital.com
        </a>
        <p className="soon-brandline">{site[locale].brandline}</p>
      </div>
    </main>
  );
}
