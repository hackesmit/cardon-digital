import type { Metadata } from "next";
import Link from "next/link";
import { demoPage } from "@/lib/i18n/demo";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { site } from "@/lib/i18n/site";
import "./demo.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  // A holding page, so it carries noindex on top of the shared page metadata:
  // the demo buttons should reach it, a search result should not.
  return {
    ...pageMetadata(locale, "/demo", demoPage[locale].meta),
    robots: { index: false, follow: false },
  };
}

export default function DemoPage({ params }: Params) {
  const locale = localeOf(params);
  const d = demoPage[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-demo">
      <span id="top" />

      <section className="section demo-hold" aria-labelledby="demo-title">
        <div className="container">
          <div className="demo-inner">
            <span className="kicker">{d.eyebrow}</span>
            <h1 id="demo-title">{d.title}</h1>
            <p className="demo-lead">{d.lead}</p>

            <p className="demo-modules-lead">{d.modulesLead}</p>
            <ul className="demo-modules">
              {d.modules.map((m) => (
                <li key={m.name}>
                  <span className="demo-module-name">{m.name}</span>
                  <span className="demo-module-body">{m.body}</span>
                </li>
              ))}
            </ul>

            <p className="demo-links-lead">{d.linksLead}</p>
            {/* Identity v3: the diagnostic is the site's one clay action, so it
               takes the .cta and the two internal links stay quiet ghosts. */}
            <div className="demo-actions">
              <a className="cta" href={mailto}>
                {s.diag.cta}
              </a>
              <Link className="btn-ghost" href={href("/modulos")}>
                {d.links.modules}
              </Link>
              <Link className="btn-ghost" href={href("/precios")}>
                {d.links.pricing}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
