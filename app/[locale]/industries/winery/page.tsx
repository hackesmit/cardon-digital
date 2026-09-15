import type { Metadata } from "next";
import Link from "next/link";
import Media from "@/components/site/Media";
import Reveal from "@/components/site/Reveal";
import VineField from "@/components/pages/winery/VineField";
import SpotlightFrames from "@/components/pages/winery/SpotlightFrames";
import PricingBundles from "@/components/pages/winery/PricingBundles";
import AssistantDemo from "@/components/pages/winery/AssistantDemo";
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
                        key="cap-glyph-0"
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
                        key="cap-glyph-1"
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
                        key="cap-glyph-2"
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
                        key="cap-glyph-3"
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
                        key="cap-glyph-4"
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

  /* One primary call to action, in the hero and again in the closing block,
     and it is the home page's words (site.diag.cta) rather than a variant
     written for this page. */
  const cta = (
    <a className="cta" href="#diagnostic">
      {s.diag.cta}
    </a>
  );

  /* The accent runs on the second and fourth card, as it did across six. */
  const capAccent = ["", " accent-gold", "", " accent-wine", ""];

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
                {cta}
                <Link className="btn-ghost" href={href("/work/monte-xanic")}>
                  {d.proof.ctaXanic}
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

      {/* ============================ VINEYARD BAND ============================
          The one full colour photograph on the page, at the top, per the
          identity rule in components/site/media.css. The stock frame standing
          in here is recorded in public/media/CREDITS.md; the caption is written
          for the shot the brief asks for and does not describe the stand-in. */}
      <section className="photo-slot">
        <div className="container">
          <Media
            className="media-band"
            slot="winery/vineyard"
            src="/media/valle-vineyard.webp"
            tone="full"
            priority
            caption={d.media.vineyard.cap}
            alt={d.media.vineyard.alt}
          />
        </div>
      </section>

      {/* ============================ PROOF / CASE STUDY ============================
          Monte Xanic leads, because a named winery with a real number outsells
          anything this page can claim about itself (doctrine section 1). */}
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

      {/* ============================ WHAT IS LEAKING ============================ */}
      <section className="section leak" id="leak" aria-labelledby="leak-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">{d.leak.kicker}</span>
              <h2 id="leak-title">{d.leak.title}</h2>
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
          </Reveal>
        </div>
      </section>

      {/* ============================ CAPABILITIES ============================ */}
      <section className="section" id="services" aria-labelledby="cap-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.caps.kicker}</span>
              <h2 id="cap-title">{d.caps.title}</h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="cap-grid">
              {d.caps.cards.map((card, i) => (
                <article className={"cap-card spot" + capAccent[i]} key={card.num}>
                  <div className="cap-top">
                    {capGlyphs[i]}
                    <span className="cap-num">{card.num}</span>
                  </div>
                  <h3>{card.h}</h3>
                  <p className="cap-body">{card.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ THE WORK, PHOTOGRAPHED ============================
          Two slots, tinted, each one evidence for the claim its caption makes:
          the cellar for the assistant block below it, the tasting room for the
          follow-up the leak block named. Both are pending files, so they ship
          as the brief until the shoot lands. */}
      <section className="photo-slot">
        <div className="container">
          <div className="media-pair">
            <Media
              slot="winery/cellar"
              caption={d.media.cellar.cap}
              alt={d.media.cellar.alt}
            />
            <Media
              slot="winery/tasting-room"
              caption={d.media.tasting.cap}
              alt={d.media.tasting.alt}
            />
          </div>
        </div>
      </section>

      {/* ============================ ASSISTANT ============================ */}
      <section className="section assist" id="assistant" aria-labelledby="assist-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">{d.assist.kicker}</span>
              <h2 id="assist-title">{d.assist.title}</h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="assist-grid">
              <div className="assist-copy">
                {d.assist.body.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
              <AssistantDemo />
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
                {d.diagSpecs.map((spec) => (
                  <div className="spec" key={spec.k}>
                    <span className="spec-dot" />
                    <span>
                      <b>{spec.k}.</b> {spec.v}
                    </span>
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
