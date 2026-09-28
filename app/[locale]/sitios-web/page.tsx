import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import SiteRise from "@/components/pages/services/SiteRise";
import WebPackages from "@/components/pages/precios/WebPackages";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { sitios } from "@/lib/i18n/sitios";
import "../services.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/sitios-web", sitios[locale].meta);
}

/**
 * The websites service page: the result (found on Google, written to the same
 * day), the four things a site has to do, the packages by feature with every
 * figure read out of lib/pricing.ts, how it works, the objections, and the
 * diagnostic close. One action, site.diag.cta, repeated verbatim.
 */
export default function SitiosPage({ params }: Params) {
  const locale = localeOf(params);
  const d = sitios[locale];
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
    <main id="main" className="pg-svc pg-sitios">
      <span id="top" />

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
                <a className="btn-ghost" href="#paquetes">
                  {d.packages.kicker}
                </a>
              </div>
              <p className="hero-proof">{d.hero.proof}</p>
            </div>
          </Reveal>
          <SiteRise />
        </div>
      </section>

      <section className="section" id="resultado" aria-labelledby="res-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.gets.kicker}</span>
              <h2 id="res-title">{d.gets.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="res-grid">
              {d.gets.items.map((item) => (
                <div className="res-item" key={item.num}>
                  <span className="res-num">{item.num}</span>
                  <h3>{item.h}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          {cta}
        </div>
      </section>

      <WebPackages locale={locale} />

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
          {/* No closing action here: the diagnostic block below carries the
              same button, and a viewport never holds two clay elements. */}
        </div>
      </section>

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
