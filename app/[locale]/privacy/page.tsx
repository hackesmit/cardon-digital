import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { privacy } from "@/lib/i18n/privacy";
import "../legal.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/privacy", privacy[locale].meta);
}

export default function PrivacyPage({ params }: Params) {
  const d = privacy[localeOf(params)];

  return (
    <main id="main" className="pg-legal">
      <div className="legal-wrap">
        <p className="eyebrow">{d.eyebrow}</p>
        <h1>{d.title}</h1>
        <p className="legal-meta">{d.effective}</p>

        <p>{d.intro}</p>

        <h2>{d.notH}</h2>
        <ul>
          {d.notList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{d.measureH}</h2>
        <p>{d.measureBody}</p>
        <ul>
          {d.measureList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{d.measureWithdraw}</p>

        <h2>{d.deviceH}</h2>
        <p>{d.deviceBody}</p>

        <h2>{d.contactH}</h2>
        <p>{d.contactBody}</p>

        <h2>{d.hostingH}</h2>
        <p>{d.hostingBody}</p>

        <h2>{d.clientH}</h2>
        <p>{d.clientBody}</p>

        <h2>{d.rightsH}</h2>
        <p>{d.rightsBody}</p>

        <h2>{d.contactHeading}</h2>
        <p>
          <a href="mailto:daniel@cardondigital.com">daniel@cardondigital.com</a>
        </p>

        <div className="legal-note">
          <p>{d.note}</p>
        </div>
      </div>
    </main>
  );
}
