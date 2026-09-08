import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { comingSoon } from "@/lib/i18n/coming-soon";
import { site } from "@/lib/i18n/site";
import Mark from "@/components/site/Mark";
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
        <Mark className="soon-mark" variant="mono-bloom" />
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
