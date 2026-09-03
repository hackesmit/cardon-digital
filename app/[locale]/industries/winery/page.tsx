import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import VineField from "@/components/pages/winery/VineField";
import SpotlightFrames from "@/components/pages/winery/SpotlightFrames";
import PricingBundles from "@/components/pages/winery/PricingBundles";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { winery } from "@/lib/i18n/winery";
import "./winery.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/industries/winery", winery[locale].meta);
}

/* The card glyphs are decoration, not copy, so they stay in the page and the
   dictionary carries only the words beside them. */
const capGlyphs = [
  (
    <svg
                        className="cap-glyph"
                        viewBox="0 0 34 34"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="5" y="6" width="24" height="18" rx="2" />
                        <line x1="10" y1="19" x2="10" y2="15" />
                        <line x1="15" y1="19" x2="15" y2="12" />
                        <line x1="20" y1="19" x2="20" y2="9" />
                        <line x1="25" y1="19" x2="25" y2="14" />
                        <line x1="12" y1="29" x2="22" y2="29" />
                      </svg>
  ),
  (
    <svg
                        className="cap-glyph"
                        viewBox="0 0 34 34"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 22 C 11 16, 23 16, 30 22" />
                        <path d="M6 27 C 13 22, 21 22, 28 27" opacity="0.5" />
                        <path d="M17 6 C 21 10, 21 14, 17 18 C 13 14, 13 10, 17 6 Z" />
                        <circle cx="17" cy="12" r="1.5" fill="currentColor" stroke="none" />
                      </svg>
  ),
  (
    <svg
                        className="cap-glyph"
                        viewBox="0 0 34 34"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 24 C 12 22, 16 10, 26 8" />
                        <line
                          x1="24"
                          y1="6"
                          x2="24"
                          y2="26"
                          strokeDasharray="3 3"
                          opacity="0.6"
                        />
                        <circle cx="24" cy="9" r="2.4" fill="currentColor" stroke="none" />
                        <line x1="4" y1="28" x2="30" y2="28" opacity="0.5" />
                      </svg>
  ),
  (
    <svg
                        className="cap-glyph"
                        viewBox="0 0 34 34"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="7" cy="9" r="3" />
                        <path d="M10 11 C 16 15, 16 15, 20 12" />
                        <path
                          d="M22 6 h5 v3 l-1 4 v10 a2 2 0 0 1 -2 2 h-1 a2 2 0 0 1 -2 -2 v-10 l-1 -4 v-3 h4"
                          transform="translate(-1 0)"
                        />
                        <line x1="21.5" y1="18" x2="26.5" y2="18" />
                      </svg>
  ),
  (
    <svg
                        className="cap-glyph"
                        viewBox="0 0 34 34"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9 h14" opacity="0.5" />
                        <path d="M6 14 h10" opacity="0.5" />
                        <path d="M6 19 h13" opacity="0.5" />
                        <path d="M6 24 h8" opacity="0.5" />
                        <path d="M22 8 C 30 12, 30 22, 22 26" />
                        <circle cx="26" cy="17" r="2.4" fill="currentColor" stroke="none" />
                      </svg>
  ),
  (
    <svg
                        className="cap-glyph"
                        viewBox="0 0 34 34"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="17" r="2.6" fill="currentColor" stroke="none" />
                        <path d="M16 11 C 19 13, 19 21, 16 23" />
                        <path d="M20 7 C 26 11, 26 23, 20 27" opacity="0.7" />
                        <path d="M24 4 C 32 9, 32 25, 24 30" opacity="0.4" />
                      </svg>
  ),
];

export default function WineryPage({ params }: Params) {
  const locale = localeOf(params);
  const d = winery[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-winery">
      <span id="top" />

      {/* ============================ HERO ============================ */}
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
              <p className="hero-sub">{rich(d.hero.sub)}</p>
              <div className="hero-actions">
                <a className="cta" href="#diagnostic">
                  {s.diag.cta}
                </a>
                <Link className="btn-ghost" href={href("/work/monte-xanic")}>
                  {d.hero.ctaCase}
                </Link>
              </div>
              <p className="brandline">{s.brandline}</p>
            </div>
          </Reveal>

          <div className="stage-wrap">
            <VineField />
          </div>
        </div>
      </section>

      {/* ============================ PHOTO BAND ============================ */}
      <section className="photo-slot">
        <div className="container">
          <figure className="photoband">
            <img
              className="photoband-img"
              src="/media/valle-vineyard.webp"
              alt={d.hero.photoAlt}
            />
          </figure>
        </div>
      </section>

      {/* ============================ CAPABILITIES ============================ */}
      <section className="section" id="services" aria-labelledby="cap-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.caps.kicker}</span>
              <h2 id="cap-title">{d.caps.title}</h2>
              <p className="section-sub">{d.caps.sub}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="cap-grid">
              <article className="cap-card spot">
                <div className="cap-top">
                  {capGlyphs[0]}
                  <span className="cap-num">{d.caps.cards[0].num}</span>
                </div>
                <h3>{d.caps.cards[0].h}</h3>
                <p className="cap-body">{d.caps.cards[0].body}</p>
                <p className="cap-note">{rich(d.caps.cards[0].note)}</p>
              </article>

              <article className="cap-card spot accent-gold">
                <div className="cap-top">
                  {capGlyphs[1]}
                  <span className="cap-num">{d.caps.cards[1].num}</span>
                </div>
                <h3>{d.caps.cards[1].h}</h3>
                <p className="cap-body">{d.caps.cards[1].body}</p>
                <p className="cap-note">{rich(d.caps.cards[1].note)}</p>
              </article>

              <article className="cap-card spot">
                <div className="cap-top">
                  {capGlyphs[2]}
                  <span className="cap-num">{d.caps.cards[2].num}</span>
                </div>
                <h3>{d.caps.cards[2].h}</h3>
                <p className="cap-body">{d.caps.cards[2].body}</p>
                <p className="cap-note">{rich(d.caps.cards[2].note)}</p>
              </article>

              <article className="cap-card spot accent-wine">
                <div className="cap-top">
                  {capGlyphs[3]}
                  <span className="cap-num">{d.caps.cards[3].num}</span>
                </div>
                <h3>{d.caps.cards[3].h}</h3>
                <p className="cap-body">{d.caps.cards[3].body}</p>
                <p className="cap-note">{rich(d.caps.cards[3].note)}</p>
              </article>

              <article className="cap-card spot">
                <div className="cap-top">
                  {capGlyphs[4]}
                  <span className="cap-num">{d.caps.cards[4].num}</span>
                </div>
                <h3>{d.caps.cards[4].h}</h3>
                <p className="cap-body">{d.caps.cards[4].body}</p>
                <p className="cap-note">{rich(d.caps.cards[4].note)}</p>
              </article>

              <article className="cap-card spot accent-gold">
                <div className="cap-top">
                  {capGlyphs[5]}
                  <span className="cap-num">{d.caps.cards[5].num}</span>
                </div>
                <h3>{d.caps.cards[5].h}</h3>
                <p className="cap-body">{d.caps.cards[5].body}</p>
                <p className="cap-note">{rich(d.caps.cards[5].note)}</p>
              </article>

            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ WHAT IS LEAKING ============================ */}
      <section className="section leak" id="leak" aria-labelledby="leak-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">{d.leak.kicker}</span>
              <h2 id="leak-title">{d.leak.title}</h2>
              <p className="section-sub">{d.leak.sub}</p>
            </div>
          </Reveal>

          <Reveal>
            <ol className="leak-grid">
              {d.leak.items.map((item) => (
                <li className="leak-item spot" key={item.num}>
                  <span className="leak-num">{item.num}</span>
                  <h3>{item.h}</h3>
                  <p>{rich(item.body)}</p>
                </li>
              ))}
            </ol>
            <p className="leak-foot">{d.leak.foot}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================ PROOF / CASE STUDY ============================ */}
      <section className="section proof" id="proof" aria-labelledby="proof-title">
        <div className="container">
          <Reveal>
            <div className="proof-card spot">
              <div className="proof-lead">
                <span className="kicker wine">{d.proof.kicker}</span>
                <h2 id="proof-title">{d.proof.title}</h2>
                <p className="proof-desc">{rich(d.proof.desc)}</p>
                <div className="proof-actions">
                  <Link className="btn-proof" href={href("/work/monte-xanic")}>
                    {d.proof.ctaXanic}
                  </Link>
                  <Link className="btn-proof" href={href("/work/enkanto")}>
                    {d.proof.ctaEnkanto}
                  </Link>
                </div>
                <p className="proof-meta">{d.proof.meta}</p>
              </div>
              <div className="proof-art" aria-hidden="true">
                <div className="seal">
                  <span className="seal-ring" />
                  <svg className="seal-mark" viewBox="0 0 26 26" focusable="false">
                                      <line
                                        className="bm-line"
                                        x1="13"
                                        y1="20"
                                        x2="6"
                                        y2="8"
                                        strokeWidth="1.2"
                                        opacity="0.8"
                                      />
                                      <line
                                        className="bm-line"
                                        x1="13"
                                        y1="20"
                                        x2="20"
                                        y2="8"
                                        strokeWidth="1.2"
                                        opacity="0.8"
                                      />
                                      <line
                                        className="bm-line"
                                        x1="6"
                                        y1="8"
                                        x2="20"
                                        y2="8"
                                        strokeWidth="1.2"
                                        opacity="0.55"
                                      />
                                      <circle className="bm-ring" cx="6" cy="8" r="3" strokeWidth="1.4" />
                                      <circle className="bm-ring" cx="20" cy="8" r="3" strokeWidth="1.4" />
                                      <circle className="bm-dot" cx="13" cy="20" r="3.4" />
                                    </svg>
                  <span className="seal-label">Monte Xanic</span>
                  <span className="seal-sub">{d.proof.sealSub}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ PRICING ============================ */}
      <Reveal>
        <PricingBundles locale={locale} />
      </Reveal>

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
