import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { BRAND } from "@/lib/brand";
import { terms } from "@/lib/i18n/terms";
import { termsVino } from "@/lib/i18n/terms-vino";
import { branded } from "@/lib/i18n/variant";
import "../legal.css";

const dict = () => (BRAND.id === "vino" ? branded(termsVino) : terms);

type Params = { params: Promise<{ locale: string }> };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const locale = localeOf(params);
  return pageMetadata(locale, "/terms", dict()[locale].meta);
}

export default async function TermsPage(props: Params) {
  const params = await props.params;
  const d = dict()[localeOf(params)];

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
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
        </p>
      </div>
    </main>
  );
}
