import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import Media from "@/components/site/Media";
import VineyardMap from "@/components/pages/case/VineyardMap";
import BerryToBottle from "@/components/pages/case/BerryToBottle";
import PlayOnceVis from "@/components/pages/case/PlayOnceVis";
import CaseFacts from "@/components/pages/case/CaseFacts";
import SpotlightFrames from "@/components/pages/case/SpotlightFrames";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { monteXanic } from "@/lib/i18n/monte-xanic";
import "./case.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/work/monte-xanic", monteXanic[locale].meta);
}

/**
 * Monte Xanic, as a case history rather than a tour of what we built.
 *
 * The order is the argument: who they are and what it was costing them, what
 * changed, the one number we own, then what that changes for the winery
 * reading it. Everything that was a diagram of our mechanism is gone. What
 * survives is what carries a beat of the story: the before and after
 * photographs, the section map (a reading standing on the land it came from),
 * the berry to bottle thread, and the finance compression, which is the
 * strongest single element on the page and has a section to itself.
 *
 * Three things were removed rather than rewritten. The three-sources-into-one
 * dashboard diagram and the row-bound-to-a-polygon diagram both drew our
 * plumbing, and the map does the second one better with real geometry. The
 * readiness curve was a fixed, non-interactive line that restated a claim the
 * copy already makes, and unlike the map it carried no honesty label on the
 * frame, so it was the one illustrative visual a reader could mistake for a
 * measurement.
 *
 * SpotlightFrames was removed with them as decoration, and Daniel reversed
 * that: a copy bead never deletes a visual, and retiring one is his decision
 * alone. It is back, mounted below, with the .vine-stage glow it feeds
 * restored in case.css. The two mechanism diagrams and the readiness curve are
 * still out and are his call, not this bead's, so they are on the bead rather
 * than quietly gone.
 *
 * The map's numbers stay invented and say so on the frame, which is the
 * doctrine's own rule for a demo (section 5) and the disclaimer it cites
 * approvingly. "No invented metric" governs what the page CLAIMS; it is not a
 * ban on a labelled illustrative visual (cross-vendor review, round one).
 *
 * The call to action is `site.diag.cta`, the same words the home page uses,
 * repeated verbatim after the hero, after the number and in the closing block.
 */
export default function MonteXanicCaseStudy({ params }: Params) {
  const locale = localeOf(params);
  const d = monteXanic[locale];
  const s = site[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  const cta = (
    <a className="cta cta-lg" href={mailto}>
      {s.diag.cta}
    </a>
  );

  return (
    <main id="main" className="pg-case">
      <span id="top" />

      {/* ============================ HERO ============================
          The headline is the whole case in one line: a named winery, the work,
          and the number. Under it, the pair Ogilvy rates above every other
          format. The old way is pulled toward the palette and the way it works
          now is the one full colour photograph on the page, which is the
          identity rule and also the argument. */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1>
              {d.hero.t1}
              <span className="accent">{d.hero.accent}</span>
              {d.hero.t2}
            </h1>
            <p className="hero-sub">{d.hero.sub}</p>
            <div className="hero-actions">{cta}</div>
            <p className="brandline">{s.brandline}</p>
          </div>

          <div className="case-pair">
            <Media
              slot="xanic/before-clipboard"
              caption={d.media.beforeCap}
              alt={d.media.beforeAlt}
              tone="tint"
            />
            <Media
              slot="xanic/after-tablet"
              caption={d.media.afterCap}
              alt={d.media.afterAlt}
              tone="full"
              priority
            />
          </div>
        </div>
      </section>

      <CaseFacts
        aria={d.facts.aria}
        rows={d.facts.rows}
        basisK={d.facts.basisK}
        basis={d.facts.basis}
      />

      {/* ============================ BEFORE ============================
          Who they are, in two lines, then what it was costing them. */}
      <section className="section rule-top" aria-labelledby="before-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">{d.before.kicker}</span>
              <h2 id="before-title">{d.before.title}</h2>
            </div>
            <div className="prose">
              <p>{d.before.p1}</p>
              <p>{d.before.p2}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ WHAT CHANGED ============================
          The section map is the signature visual and it makes the claim the
          copy makes: a reading stands on the section it came from. */}
      <section className="section" id="what-changed" aria-labelledby="changed-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.changed.kicker}</span>
              <h2 id="changed-title">{d.changed.title}</h2>
              <p className="section-sub">{d.changed.sub}</p>
            </div>

            <div className="vine-showcase">
              <VineyardMap />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ BERRY TO BOTTLE ============================
          Intake is the first link of the thread, so the footage of it sits
          above the thread itself. */}
      <section className="section" id="berry-to-bottle" aria-labelledby="thread-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">{d.thread.kicker}</span>
              <h2 id="thread-title">{d.thread.title}</h2>
              <p className="section-sub">{d.thread.sub}</p>
            </div>

            <Media
              className="case-media-wide"
              slot="xanic/harvest-intake"
              caption={d.media.videoCap}
              alt={d.media.videoAlt}
              labels={{ play: d.media.play, pause: d.media.pause }}
            />

            <BerryToBottle />
          </Reveal>
        </div>
      </section>

      {/* ============================ THE NUMBER ============================
          The one measured result on the page, and the reason it has a section
          of its own rather than a line in a list. */}
      <section className="section rule-top" id="finance" aria-labelledby="number-title">
        <div className="container">
          <Reveal>
            <div className="split reverse">
              <div className="split-copy">
                <span className="kicker gold">{d.number.kicker}</span>
                <h2 id="number-title">{d.number.title}</h2>
                <p className="section-sub">{d.number.sub}</p>
                <div className="hero-actions">{cta}</div>
              </div>
              <div className="split-vis">
                <PlayOnceVis id="finVis" variant="fin-vis" tag={d.number.tag}>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 182"
                    role="img"
                    aria-label={d.number.aria}
                  >
                    <text className="fin-lab-manual mono" x="34" y="58" fontSize="12" letterSpacing="1.5">{d.number.manual}</text>
                    <text className="fin-lab-auto mono" x="34" y="58" fontSize="12" letterSpacing="1.5">{d.number.auto}</text>
                    <rect className="fin-track" x="34" y="74" width="452" height="18" rx="2" />
                    <rect className="fin-bar" x="34" y="74" width="452" height="18" rx="2" />
                    <line className="fin-tick" x1="34" y1="104" x2="34" y2="114" />
                    <line className="fin-tick" x1="486" y1="104" x2="486" y2="114" />
                    <text
                      className="fin-time-long mono"
                      x="486"
                      y="58"
                      textAnchor="end"
                      fontSize="16"
                      fontWeight="600"
                    >{d.number.long}</text>
                    <text
                      className="fin-time-short mono"
                      x="486"
                      y="58"
                      textAnchor="end"
                      fontSize="16"
                      fontWeight="600"
                    >{d.number.short}</text>
                    <g className="fin-badge">
                      <rect className="fin-badge-box" x="34" y="130" width="204" height="34" rx="2" />
                      <text className="fin-badge-text" x="50" y="152" fontSize="13" fontWeight="600">{d.number.less}</text>
                    </g>
                    <text
                      className="fin-foot"
                      x="486"
                      y="152"
                      textAnchor="end"
                      fontSize="11"
                      letterSpacing="1"
                    >{d.number.refreshed}</text>
                  </svg>
                </PlayOnceVis>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ FOR YOUR WINERY ============================ */}
      <section className="section results rule-top" aria-labelledby="result-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">{d.result.kicker}</span>
              <h2 id="result-title">{d.result.title}</h2>
            </div>
            <div className="callouts">
              {d.result.items.map((item, i) => (
                <div className="callout" key={item.lead}>
                  <span className="callout-idx mono">{"0" + (i + 1)}</span>
                  <p className="callout-lead">{item.lead}</p>
                  <p className="callout-body">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ DIAGNOSTIC ============================ */}
      <section className="section diagnostic" id="diagnostic" aria-labelledby="diag-title">
        <div className="container">
          <Reveal>
            <div className="diag-inner">
              <div className="diag-lead">
                <span className="kicker clay">{s.diag.kicker}</span>
                <h2 id="diag-title">{s.diag.title}</h2>
                <p className="diag-desc">{d.diagDesc}</p>
                <div className="diag-actions">{cta}</div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
              <div className="diag-specs">
                {d.diagSpecs.map((spec) => (
                  <div className="spec" key={spec.d}>
                    <span className="spec-dot" />
                    <span>
                      <span className="spec-d mono">{spec.d}</span>
                      {spec.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cursor-follow glow on every framed visual. Effect only, renders
          nothing, and reads no dictionary key. */}
      <SpotlightFrames />
    </main>
  );
}
