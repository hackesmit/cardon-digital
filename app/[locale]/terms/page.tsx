import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { terms } from "@/lib/i18n/terms";
import "../legal.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/terms", terms[locale].meta);
}

export default function TermsPage({ params }: Params) {
  const d = terms[localeOf(params)];

  return (
    <main id="main" className="pg-legal">
      <div className="legal-wrap">
        <p className="eyebrow">{d.eyebrow}</p>
        <h1>{d.title}</h1>
        <p className="legal-meta">{d.effective}</p>

        <p>{d.intro}</p>

        {d.sections.map((section) => (
          <div key={section.h}>
            <h2>{section.h}</h2>
            <p>{section.body}</p>
          </div>
        ))}

        <h2>{d.changesH}</h2>
        <p>
          {d.changesBody}{" "}
          <a href="mailto:daniel@cardondigital.com">daniel@cardondigital.com</a>.
        </p>
      </div>
    </main>
  );
}
