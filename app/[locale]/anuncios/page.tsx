import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import ReachMap from "@/components/pages/services/ReachMap";
import AdsFee from "@/components/pages/precios/AdsFee";
import { adsFill } from "@/lib/adsCopy";
import { anuncios } from "@/lib/i18n/anuncios";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "../services.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/anuncios", anuncios[locale].meta);
}

/**
 * The Google Ads service page: new clients who were already searching,
 * measured to the message; the path from a search to a counted call; what
 * the monthly fee pays for; the two scopes at a flat fee with every figure
 * read out of lib/pricing.ts; the objections; the diagnostic close. The
 * figures inside prose arrive through adsFill, never typed.
 */
export default function AnunciosPage({ params }: Params) {
  const locale = localeOf(params);
  const d = anuncios[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const fill = (text: string) => adsFill(locale, text);
  const cta = (
    <div className="cta-row">
      <Link className="cta" href={href("/contacto")}>
        {s.diag.cta}
      </Link>
    </div>
  );

  return (
    <main id="main" className="pg-svc pg-anuncios">
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
                <a className="btn-ghost" href="#cuota">
                  {d.pricing.kicker}
                </a>
              </div>
              <p className="hero-proof">{fill(d.hero.proof)}</p>
            </div>
          </Reveal>
          <ReachMap />
        </div>
      </section>

      <section className="section" aria-labelledby="path-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.path.kicker}</span>
              <h2 id="path-title">{d.path.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <ol className="path">
              {d.path.steps.map((step, i) => (
                <li key={step}>
                  <span className="step-n">{"0" + (i + 1)}</span>
                  {step}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="month-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.month.kicker}</span>
              <h2 id="month-title">{d.month.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="res-grid">
              {d.month.items.map((item, i) => (
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

      <AdsFee locale={locale} />

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
                  <p className="fam-a">{fill(item.a)}</p>
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
