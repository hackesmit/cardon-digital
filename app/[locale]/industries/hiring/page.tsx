import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import PipelineStage from "@/components/pages/hiring/PipelineStage";
import SpotlightFrames from "@/components/pages/hiring/SpotlightFrames";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { hiring } from "@/lib/i18n/hiring";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "./hiring.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/industries/hiring", hiring[locale].meta);
}

/* Card glyphs are decoration, so only the words beside them are translated. */
const capGlyphs = [
  (
    <span className="cap-glyph" aria-hidden="true">
                        <svg
                          viewBox="0 0 26 26"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 7h6M4 13h6M4 19h6" />
                          <path d="M13 13l4-6M13 13l4 6" />
                          <path d="M17 7h5M17 19h5" />
                        </svg>
                      </span>
  ),
  (
    <span className="cap-glyph" aria-hidden="true">
                        <svg
                          viewBox="0 0 26 26"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="4" y="6" width="4" height="14" rx="1" />
                          <rect x="11" y="6" width="4" height="14" rx="1" />
                          <rect x="18" y="6" width="4" height="14" rx="1" />
                          <path d="M6 11h0M13 15h0M20 9h0" />
                        </svg>
                      </span>
  ),
  (
    <span className="cap-glyph" aria-hidden="true">
                        <svg
                          viewBox="0 0 26 26"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="4" y="5" width="18" height="17" rx="2" />
                          <path d="M4 10h18M9 3v4M17 3v4" />
                          <path d="M9 16l2.4 2.4L17 13" />
                        </svg>
                      </span>
  ),
  (
    <span className="cap-glyph" aria-hidden="true">
                        <svg
                          viewBox="0 0 26 26"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="13" cy="13" r="9" />
                          <path d="M4 13h18M13 4c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z" />
                        </svg>
                      </span>
  ),
  (
    <span className="cap-glyph" aria-hidden="true">
                        <svg
                          viewBox="0 0 26 26"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4v18h18" />
                          <path d="M8 17l4-5 3 3 5-7" />
                        </svg>
                      </span>
  ),
];

export default function HiringPage({ params }: Params) {
  const locale = localeOf(params);
  const d = hiring[locale];
  const s = site[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-hiring">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1>
              {d.hero.t1}
              <span className="accent">{d.hero.accent}</span>
              {d.hero.t2}
            </h1>
            <p className="hero-sub">{rich(d.hero.sub)}</p>
            <div className="hero-actions">
              <a className="cta" href={mailto}>
                {s.diag.cta}
              </a>
              <a className="btn-ghost" href="#build">
                {d.hero.ctaGhost}
              </a>
            </div>
            <p className="brandline">{s.brandline}</p>
          </div>

          <PipelineStage />
        </div>
      </section>

      {/* ============================ VALUE STRIP ============================ */}
      <section className="value" aria-label={d.value.aria}>
        <h2 className="sr-only">{d.value.srTitle}</h2>
        <div className="container">
          <Reveal>
            <div className="value-grid">
              {d.value.items.map((item) => (
                <div className="value-item" key={item.key}>
                  <span className="value-key">{item.key}</span>
                  <p className="value-lead">{rich(item.lead, { hl: "cool" })}</p>
                  <p className="value-body">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ CAPABILITIES ============================ */}
      <section className="section" id="build" aria-labelledby="build-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.caps.kicker}</span>
              <h2 id="build-title">{d.caps.title}</h2>
              <p className="section-sub">{d.caps.sub}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="cap-grid">
              {d.caps.cards.map((card, i) => (
                <div
                  className={"cap-card" + (i === 4 ? " cap-wide" : "")}
                  key={card.h}
                >
                  <div className="cap-top">
                    <span className="cap-idx">{"0" + (i + 1)}</span>
                    {capGlyphs[i]}
                  </div>
                  <h3>{card.h}</h3>
                  <p className="cap-body">{card.body}</p>
                  {i === 4 ? (
                    <>
                      <div className="cap-chips">
                        {d.caps.chips.map((chip) => (
                          <span className="cap-chip" key={chip}>
                            {chip}
                          </span>
                        ))}
                      </div>
                      <p className="cap-foot">{d.caps.chipFoot}</p>
                    </>
                  ) : null}
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

      <SpotlightFrames />
    </main>
  );
}
