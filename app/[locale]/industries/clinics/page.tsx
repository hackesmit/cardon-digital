import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import ClinicSchedule from "@/components/pages/clinics/ClinicSchedule";
import SpotlightFrames from "@/components/pages/clinics/SpotlightFrames";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { clinics } from "@/lib/i18n/clinics";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "./clinics.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/industries/clinics", clinics[locale].meta);
}

export default function ClinicsPage({ params }: Params) {
  const locale = localeOf(params);
  const d = clinics[locale];
  const s = site[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-clinics">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1>
              {d.hero.title}
              <br />
              <span className="accent">{d.hero.titleAccent}</span>
            </h1>

            <p className="hero-sub">{rich(d.hero.sub)}</p>
            <div className="hero-actions">
              <a className="cta" href="#diagnostic">
                {s.diag.cta}
              </a>
              <a className="btn-ghost" href="#problems">
                {d.hero.ctaGhost}
              </a>
            </div>
            <p className="brandline">{s.brandline}</p>
          </div>

          <ClinicSchedule />
          <SpotlightFrames />
        </div>
      </section>

      {/* ============================ THE PROBLEMS ============================ */}
      <section className="section" id="problems" aria-labelledby="problems-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker oasis">{d.problems.kicker}</span>
              <h2 id="problems-title">{d.problems.title}</h2>
              <p className="section-sub">{rich(d.problems.sub)}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="prob-list">
              {d.problems.items.map((item, i) => (
                <article className="prob-item" key={item.h}>
                  <span className="prob-rank">{"0" + (i + 1)}</span>
                  <div className="prob-body">
                    <h3 className="prob-h">{item.h}</h3>
                    <p className="prob-p">{rich(item.body)}</p>
                    {i === 0 ? (
                      <div className="prob-stats">
                        {d.problems.stats.map((stat) => (
                          <span className="prob-stat" key={stat.v}>
                            <b>{stat.v}</b>
                            <span>{stat.k}</span>
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ WHAT WE BUILD ============================ */}
      <section className="section" id="build" aria-labelledby="build-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker oasis">{d.build.kicker}</span>
              <h2 id="build-title">{d.build.title}</h2>
              <p className="section-sub">{rich(d.build.sub)}</p>
            </div>
          </Reveal>

          <Reveal>
            <article className="build-feature">
              <span className="build-tag">
                <span className="dot" aria-hidden="true" />
                {d.build.featureTag}
              </span>
              <h3 className="build-h">{d.build.featureH}</h3>
              <p className="build-p">{d.build.featureBody}</p>
              <p className="build-borrow">{rich(d.build.featureBorrow)}</p>
            </article>
          </Reveal>

          <Reveal>
            <div className="build-grid">
              {d.build.cards.map((card) => (
                <article className="build-card" key={card.num}>
                  <span className="build-num">{card.num}</span>
                  <h3 className="build-h">{card.h}</h3>
                  <p className="build-p">{card.body}</p>
                  <p className="build-borrow">{rich(card.borrow)}</p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="scope-note">
              <span className="scope-label">{d.build.scopeLabel}</span>
              {rich(d.build.scopeBody)}
            </div>
          </Reveal>

          <Reveal>
            <div className="pricing-note">
              <span className="pricing-label">{d.build.pricingLabel}</span>
              <p className="pricing-body">{rich(d.build.pricingBody)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ WHY US ============================ */}
      <section className="why" id="why" aria-labelledby="why-title">
        <div className="container">
          <Reveal>
            <div style={{ marginBottom: "clamp(22px,3vw,34px)" }}>
              <span className="kicker gold">{d.why.kicker}</span>
              <h2 id="why-title">{d.why.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="why-grid">
              {d.why.items.map((item) => (
                <div className="why-item" key={item.key}>
                  <span className="why-key">{item.key}</span>
                  <p className="why-lead">{rich(item.lead, { hl: "cool" })}</p>
                  <p className="why-body">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ DIAGNOSTIC ============================ */}
      <section
        className="section diagnostic"
        id="diagnostic"
        aria-labelledby="diag-title"
      >
        <div className="container">
          <Reveal>
            <div className="diag-inner">
              <div className="diag-lead">
                <span className="kicker clay">{s.diag.kicker}</span>
                <h2 id="diag-title">{s.diag.title}</h2>
                <p className="diag-desc">{d.diagDesc}</p>
                <div className="diag-actions">
                  <a className="cta cta-lg" href={mailto}>
                    {s.diag.cta}
                  </a>
                </div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
              <div className="diag-specs">
                {d.diagSpecs.map((spec, i) => (
                  <div className="spec" key={i}>
                    <span className="spec-dot" />
                    <span>{rich(spec)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
