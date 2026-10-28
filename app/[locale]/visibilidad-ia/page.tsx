import type { Metadata } from "next";
import Link from "next/link";
import CredentialList, { formatDate } from "@/components/site/CredentialList";
import Faq from "@/components/site/Faq";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/site/Reveal";
import { CREDENTIALS } from "@/lib/credentials";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { BASELINE, visibilidad } from "@/lib/i18n/visibilidad-ia";
import { breadcrumbLd, ldGraph, serviceLd } from "@/lib/seo/jsonld";
import "../services.css";
import "./visibilidad.css";

type Params = { params: Promise<{ locale: string }> };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const locale = localeOf(params);
  return pageMetadata(locale, "/visibilidad-ia", visibilidad[locale].meta);
}

/** Fills {key} placeholders from the baseline, the date written as the locale writes one. */
function fillBaseline(template: string, locale: Locale): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => {
    if (key === "date") return formatDate(BASELINE.date, locale);
    const v = (BASELINE as Record<string, string | number>)[key];
    return v === undefined ? m : String(v);
  });
}

/**
 * AI visibility, the standalone half of the AEO offer (bead hq-i4b5.9), for a
 * business that already has a site. Answer first: the hero's sub is a 40 to
 * 60 word answer that names the business, and the Service markup describes
 * the page in those same words. Then what AEO is (the one section that names
 * it, with the comparison table), how answer engines choose, what the check in
 * the diagnostic does with our own baseline as the measured example, what we
 * fix (sold as a website package at the published prices), the certificate,
 * the FAQ with its FAQPage markup, and the diagnostic close. One action,
 * site.diag.cta, repeated verbatim. Not in the nav: the home and /sitios-web
 * link here.
 */
export default async function VisibilidadPage(props: Params) {
  const params = await props.params;
  const locale = localeOf(params);
  const d = visibilidad[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const cta = (
    <div className="cta-row">
      <Link className="cta" href={href("/contacto")}>
        {s.diag.cta}
      </Link>
    </div>
  );

  return (
    <main id="main" className="pg-svc pg-visibilidad">
      <span id="top" />
      <JsonLd
        data={ldGraph([
          serviceLd(d.hero.eyebrow, d.hero.sub, href("/visibilidad-ia")),
          breadcrumbLd([
            { name: d.crumbs.home, url: href("/") },
            { name: d.crumbs.here, url: href("/visibilidad-ia") },
          ]),
        ])}
      />

      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <nav className="crumbs" aria-label={d.crumbs.aria}>
            <ol>
              <li>
                <Link href={href("/")}>{d.crumbs.home}</Link>
              </li>
              <li aria-current="page">{d.crumbs.here}</li>
            </ol>
          </nav>
          <Reveal>
            <div className="hero-copy">
              <p className="eyebrow">{d.hero.eyebrow}</p>
              <h1>
                {d.hero.title}
                <br />
                <span className="accent">{d.hero.titleAccent}</span>
              </h1>
              <p className="hero-sub">{d.hero.sub}</p>
              <div className="hero-actions">
                <Link className="cta" href={href("/contacto")}>
                  {s.diag.cta}
                </Link>
                <a className="btn-ghost" href="#revision">
                  {d.hero.jump}
                </a>
              </div>
              <p className="hero-proof">{fillBaseline(d.hero.proof, locale)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="que-es-aeo" aria-labelledby="aeo-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.aeo.kicker}</span>
              <h2 id="aeo-title">{d.aeo.title}</h2>
              <p className="section-sub">{d.aeo.definition}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="vis-table-wrap">
              <table className="vis-table">
                <caption>{d.aeo.table.caption}</caption>
                <thead>
                  <tr>
                    <td />
                    {d.aeo.table.cols.map((c) => (
                      <th scope="col" key={c}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.aeo.table.rows.map((r) => (
                    <tr key={r.k}>
                      <th scope="row">{r.k}</th>
                      <td data-label={d.aeo.table.cols[0]}>{r.seo}</td>
                      <td data-label={d.aeo.table.cols[1]}>{r.aeo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="vis-note">{d.aeo.shared}</p>
          </Reveal>
        </div>
      </section>

      <section className="section" id="como-eligen" aria-labelledby="engines-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.engines.kicker}</span>
              <h2 id="engines-title">{d.engines.title}</h2>
              <p className="section-sub">{d.engines.lead}</p>
            </div>
          </Reveal>
          <Reveal>
            <ul className="vis-grid">
              {d.engines.items.map((item) => (
                <li className="vis-item" key={item.h}>
                  <h3>{item.h}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" id="revision" aria-labelledby="check-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.check.kicker}</span>
              <h2 id="check-title">{d.check.title}</h2>
              <p className="section-sub">{d.check.lead}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="vis-check">
              <div>
                <h3 className="vis-list-title">{d.check.stepsTitle}</h3>
                <ol className="steps">
                  {d.check.steps.map((step, i) => (
                    <li className="step" key={step}>
                      <span className="step-n mono">{String(i + 1).padStart(2, "0")}</span>
                      <p className="step-body">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="vis-list-title">{d.check.recordTitle}</h3>
                <ul className="vis-record">
                  {d.check.record.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="vis-own">
              <h3>{d.check.ownTitle}</h3>
              <p>{fillBaseline(d.check.own, locale)}</p>
            </div>
          </Reveal>
          {cta}
        </div>
      </section>

      <section className="section" id="arreglos" aria-labelledby="fix-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.fix.kicker}</span>
              <h2 id="fix-title">{d.fix.title}</h2>
              <p className="section-sub">{d.fix.lead}</p>
            </div>
          </Reveal>
          <Reveal>
            <ol className="vis-fixes">
              {d.fix.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className="proof-links">
              <Link href={href("/sitios-web")}>{d.fix.service}</Link>
              <Link href={href("/precios")}>{d.fix.prices}</Link>
            </p>
            <p className="vis-note">{d.fix.honest}</p>
          </Reveal>
        </div>
      </section>

      <section className="section" id="certificacion" aria-labelledby="creds-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.creds.kicker}</span>
              <h2 id="creds-title">{d.creds.title}</h2>
              <p className="section-sub">{d.creds.lead}</p>
            </div>
          </Reveal>
          <Reveal>
            <CredentialList credentials={CREDENTIALS} locale={locale} copy={d.creds} />
          </Reveal>
        </div>
      </section>

      <div className="section vis-faq">
        <Faq title={d.faq.title} items={d.faq.items} />
      </div>

      <section className="section diagnostic" id="diagnostic" aria-labelledby="diag-title">
        <div className="container">
          <Reveal>
            <div className="diag-inner">
              <div className="diag-lead">
                <span className="kicker clay">{s.diag.kicker}</span>
                <h2 id="diag-title">{s.diag.title}</h2>
                <p className="diag-desc">{d.diagDesc}</p>
                <div className="diag-actions">
                  <Link className="cta cta-lg" href={href("/contacto")}>
                    {s.diag.cta}
                  </Link>
                </div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
