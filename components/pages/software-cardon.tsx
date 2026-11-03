import type { Metadata } from "next";
import Link from "@/components/site/Link";
import Reveal from "@/components/site/Reveal";
import FlowCompress from "@/components/pages/services/FlowCompress";
import Faq from "@/components/site/Faq";
import JsonLd from "@/components/site/JsonLd";
import { serviceLd } from "@/lib/seo/jsonld";
import { BRAND, VINO_NAME, wineLink } from "@/lib/brand";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { softwareCardon } from "@/lib/i18n/software-cardon";
import "@/app/[locale]/services.css";

type Params = { params: Promise<{ locale: string }> };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const locale = localeOf(params);
  return pageMetadata(locale, "/software", softwareCardon[locale].meta);
}

/**
 * Custom software for any business, cardondigital.com's /software since bead
 * hq-3f6ut.3 (the wine modules page moved to the wine brand, software-vino.tsx).
 * The operations visual (FlowCompress, Monte Xanic's hour to two minutes)
 * opens it; then what the owner ends up with, examples of the work that can
 * run by itself, the one case figure, how it works, the objections, the FAQ
 * with its FAQPage markup, the one plain link to the wine brand and the
 * diagnostic close. No price is typed or read here: custom software is quoted
 * after the diagnostic, and /precios says so. The opening paragraph is the
 * page's self-contained answer, and the Service markup carries it word for word.
 */
export default async function SoftwareCardonPage(props: Params) {
  const params = await props.params;
  const locale = localeOf(params);
  const d = softwareCardon[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const wine = wineLink(BRAND, locale);
  const cta = (
    <div className="cta-row">
      <Link className="cta" href={href("/contacto")}>
        {s.diag.cta}
      </Link>
    </div>
  );

  return (
    <main id="main" className="pg-svc pg-software">
      <span id="top" />
      <JsonLd data={serviceLd(d.hero.eyebrow, d.hero.sub, localePath(locale, "/software"))} />

      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
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
                <Link className="btn-ghost" href={href("/precios")}>
                  {d.hero.more}
                </Link>
              </div>
              <p className="hero-proof">{d.hero.proof}</p>
            </div>
          </Reveal>
          <div className="stage-wrap">
            <FlowCompress />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="res-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.gets.kicker}</span>
              <h2 id="res-title">{d.gets.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="res-grid">
              {d.gets.items.map((item, i) => (
                <div className="res-item" key={item.h}>
                  <span className="res-num">{"0" + (i + 1)}</span>
                  <h3>{item.h}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          {cta}
        </div>
      </section>

      <section className="section" id="ejemplos" aria-labelledby="ex-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.examples.kicker}</span>
              <h2 id="ex-title">{d.examples.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mod-grid">
              {d.examples.items.map((item) => (
                <article className="mod" key={item.h}>
                  <h3>{item.h}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p className="mod-other">{d.examples.note}</p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="proof-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">{d.proof.kicker}</span>
              <h2 id="proof-title">{d.proof.title}</h2>
              <p className="section-sub">{d.proof.body}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.how.kicker}</span>
              <h2 id="how-title">{d.how.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <ol className="steps">
              {d.how.steps.map((step) => (
                <li className="step" key={step.k}>
                  <span className="step-n mono">{step.k}</span>
                  <p className="step-body">{step.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="fam-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">{d.familiar.kicker}</span>
              <h2 id="fam-title">{d.familiar.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="fam-grid">
              {d.familiar.items.map((item) => (
                <div className="fam-item" key={item.q}>
                  <blockquote className="fam-q">
                    <p>{item.q}</p>
                  </blockquote>
                  <p className="fam-a">{item.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section">
        <Faq title={d.faq.title} items={d.faq.items} />
        {/* The one link to the wine brand (bead hq-3f6ut.3), under the
            questions where a winery reader asks whether this is for them. */}
        {wine && (
          <div className="container">
            <p className="more-link">
              {d.wine.lead}{" "}
              {wine.startsWith("http") ? <a href={wine}>{VINO_NAME}</a> : <Link href={wine}>{VINO_NAME}</Link>}
            </p>
          </div>
        )}
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
