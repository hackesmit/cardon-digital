import type { Metadata } from "next";
import SitePlanVisual from "@/components/pages/construction/SitePlanVisual";
import FleetMap from "@/components/pages/construction/FleetMap";
import SpotlightFrames from "@/components/pages/construction/SpotlightFrames";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { construction } from "@/lib/i18n/construction";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "./construction.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(
    locale,
    "/industries/construction",
    construction[locale].meta,
  );
}

/* Card glyphs are decoration, so only the words beside them are translated. */
const capGlyphs = [
  (
    <span className="cap-glyph" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <rect className="g-stroke" x="4" y="3" width="16" height="18" rx="2" />
                        <path className="g-stroke" d="M8 8h8M8 12h8M8 16h5" />
                        <circle className="g-fill" cx="18.5" cy="16.5" r="1.6" />
                      </svg>
                    </span>
  ),
  (
    <span className="cap-glyph" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <rect className="g-stroke" x="3" y="5" width="18" height="15" rx="2" />
                        <path className="g-stroke" d="M3 9h18M8 3v4M16 3v4" />
                        <path className="g-gold" d="M9 14l2 2 4-4" />
                      </svg>
                    </span>
  ),
  (
    <span className="cap-glyph" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path
                          className="g-stroke"
                          d="M12 21c4-4 6-7 6-10a6 6 0 1 0-12 0c0 3 2 6 6 10z"
                        />
                        <circle className="g-fill" cx="12" cy="11" r="2.2" />
                      </svg>
                    </span>
  ),
  (
    <span className="cap-glyph" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path className="g-stroke" d="M20 12a8 8 0 1 1-2.3-5.6" />
                        <path className="g-gold" d="M20 4v4h-4" />
                        <circle className="g-fill" cx="12" cy="12" r="1.9" />
                      </svg>
                    </span>
  ),
  (
    <span className="cap-glyph" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path className="g-stroke" d="M4 16a8 8 0 0 1 16 0" />
                        <path className="g-stroke" d="M7.5 16a4.5 4.5 0 0 1 9 0" />
                        <circle className="g-fill" cx="12" cy="16" r="2" />
                        <path className="g-gold" d="M12 16l3.5-9" />
                      </svg>
                    </span>
  ),
];

export default function ConstructionPage({ params }: Params) {
  const locale = localeOf(params);
  const d = construction[locale];
  const s = site[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-construction">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1 id="hero-title">
              {d.hero.title}
              <br />
              <span className="accent">{d.hero.titleAccent}</span>
            </h1>
            <p className="hero-sub">
              {rich(d.hero.sub)} <span className="dry">{d.hero.dry}</span>
            </p>
            <div className="hero-actions">
              <a className="cta" href={mailto}>
                {s.diag.cta}
              </a>
              <a className="btn-ghost" href="#capabilities">
                {d.hero.ctaGhost}
              </a>
            </div>
            <p className="brandline">{s.brandline}</p>
          </div>

          <div className="stage-wrap">
            <SitePlanVisual />
            <SpotlightFrames />
          </div>
        </div>
      </section>

      {/* ============================ VALUE STRIP ============================ */}
      <section className="value" aria-label={d.value.aria}>
        <h2 className="sr-only">{d.value.srTitle}</h2>
        <div className="container value-grid">
          {d.value.items.map((item) => (
            <div className="value-item" key={item.key}>
              <span className="value-key">{item.key}</span>
              <p className="value-lead">{rich(item.lead, { hl: "cool" })}</p>
              <p className="value-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ FLEET TRACKING ============================ */}
      <section className="section fleet" id="fleet" aria-labelledby="fleet-title">
        <div className="container">
          <div className="split fleet-split">
            <div className="split-copy">
              <span className="kicker">{d.fleet.kicker}</span>
              <h2 id="fleet-title">{d.fleet.title}</h2>
              <p className="fleet-lead">{d.fleet.lead}</p>
              <p className="note">{rich(d.fleet.note)}</p>
            </div>
            <div className="split-vis">
              <FleetMap />
            </div>
          </div>
        </div>
      </section>

      {/* ============================ CAPABILITIES ============================ */}
      <section className="section" id="capabilities" aria-labelledby="cap-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.caps.kicker}</span>
            <h2 id="cap-title">{d.caps.title}</h2>
            <p className="section-sub">{d.caps.sub}</p>
          </div>

          <div className="cap-grid">
            {d.caps.cards.map((card, i) => (
              <article className="cap-card" key={card.idx}>
                <div className="cap-top">
                  {capGlyphs[i]}
                  <span className="cap-idx">{card.idx}</span>
                </div>
                <h3 className="cap-title">{card.h}</h3>
                <p className="cap-body">{card.body}</p>
                {i === d.caps.cards.length - 1 ? (
                  <p className="cap-note">{rich(d.caps.demandNote)}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ DIAGNOSTIC ============================ */}
      <section
        className="section diagnostic"
        id="diagnostic"
        aria-labelledby="diag-title"
      >
        <div className="container">
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
        </div>
      </section>
    </main>
  );
}
