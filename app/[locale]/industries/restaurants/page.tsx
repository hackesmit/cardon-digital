import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import FloorPlan from "@/components/pages/restaurants/FloorPlan";
import SpotlightFrames from "@/components/pages/restaurants/SpotlightFrames";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { restaurants } from "@/lib/i18n/restaurants";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "./restaurants.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(
    locale,
    "/industries/restaurants",
    restaurants[locale].meta,
  );
}

export default function RestaurantsPage({ params }: Params) {
  const locale = localeOf(params);
  const d = restaurants[locale];
  const s = site[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-restaurants">
      <span id="top" />
      <SpotlightFrames />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1>
              {d.hero.t1}
              <span className="accent">{d.hero.accent}</span>
            </h1>

            <p className="hero-sub">{rich(d.hero.sub)}</p>

            <div className="hero-actions">
              <a className="cta" href="#diagnostic">
                {s.diag.cta}
              </a>
              <a className="btn-ghost" href="#build">
                {d.hero.ctaGhost}
              </a>
            </div>
            <p className="brandline">{s.brandline}</p>
          </div>

          <div className="stage-wrap">
            <FloorPlan />
          </div>
        </div>
      </section>

      {/* ============================ WHAT WE WOULD BUILD ============================ */}
      <section className="section" id="build" aria-labelledby="build-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker terra">{d.build.kicker}</span>
              <h2 id="build-title">{d.build.title}</h2>
              <p className="section-sub">{rich(d.build.sub)}</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="build-grid">
              {d.build.cards.map((card, i) => (
                <div className="build-card" key={card.h}>
                  <span className="build-index mono">{"0" + (i + 1)}</span>
                  <h3>{card.h}</h3>
                  <p className="build-body">{card.body}</p>
                  <p className="build-borrow">{rich(card.borrow)}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ WHY US FOR THIS TERRAIN ============================ */}
      <section className="section why" id="why" aria-labelledby="why-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">{d.why.kicker}</span>
              <h2 id="why-title">{d.why.title}</h2>
              <p className="section-sub">{d.why.sub}</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="why-grid">
              {d.why.items.map((item) => (
                <div className="why-item" key={item.key}>
                  <span className="why-key">{item.key}</span>
                  <p className="why-lead">{rich(item.lead, { hl: "warm" })}</p>
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
                <p className="diag-desc">{rich(d.diagDesc)}</p>
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
