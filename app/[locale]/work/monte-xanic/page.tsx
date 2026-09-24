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
 * reading it. Every drawing on it carries a beat of that story rather than a
 * page of our wiring: the before and after photographs, the three restored
 * diagrams described below, the section map (a reading standing on the land it
 * came from), the berry to bottle thread, and the finance compression, which
 * is the strongest single element on the page and has a section to itself.
 *
 * Three diagrams were removed with that rewrite and Daniel brought all three
 * back (hq-4pu0q.13, hq-4pu0q.32), on one condition: each has to sell what the
 * winery ends up with rather than explain what we wired. So each one returned
 * reframed rather than restored. They sit together in "What changed", whose
 * three clauses they now illustrate one for one, and each is captioned with a
 * result:
 *
 *   the three sources into one view  -> the harvest is assembled before anyone
 *                                       opens it, so nobody gathers it
 *   the row bound to its polygon     -> a reading arrives with an address, so
 *                                       nobody pictures the vineyard to act
 *   the readiness curve              -> the pick reaches the calendar before it
 *                                       reaches the rows
 *
 * All three draw invented readings, so all three carry the same honesty label
 * the section map carries. That is doctrine section 5's rule for a demo, and
 * "no invented metric" governs what the page CLAIMS rather than banning a
 * labelled illustrative drawing (cross-vendor review, round one).
 *
 * SpotlightFrames was removed with them as decoration, and Daniel reversed
 * that too: a copy bead never deletes a visual, and retiring one is his
 * decision alone. It is mounted below, and it selects .vis-frame, so the three
 * frames above pick the glow up with no change to it.
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
  /** The visuals' working parts. They live apart from the prose because they
   *  are the drawings' labels, legends and accessible names, which doctrine
   *  section 8 rule 5 counts apart from copy rather than trims to a budget. */
  const v = d.vis;
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
          The section's sub names three changes, and each one now has the
          picture it earned back. They run as a build, and each frame is
          captioned with what the winery ends up with rather than with what we
          wired: the harvest arrives assembled, a reading arrives with an
          address, and the pick arrives on the calendar first. The section map
          closes the section by playing all three out across a season on the
          real land. Every frame on this page carries the cursor spotlight,
          because SpotlightFrames selects .vis-frame. */}
      <section className="section" id="what-changed" aria-labelledby="changed-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.changed.kicker}</span>
              <h2 id="changed-title">{d.changed.title}</h2>
              <p className="section-sub">{d.changed.sub}</p>
            </div>

            {/* One live view. The three places are still drawn, because they
                are the winery's own and they did not go anywhere; what the
                picture sells is that nobody walks to them in the morning. */}
            <figure className="case-vis case-vis-wide">
              <div className="vis-frame" id="viewVis">
                <span className="vis-tag">{v.view.tag}</span>
                <svg
                  className="mini-svg"
                  viewBox="0 0 520 270"
                  role="img"
                  aria-label={v.view.aria}
                >
                  <g>
                    <rect className="d-card" x="20" y="70" width="134" height="30" rx="2" />
                    <text className="d-lab mono" x="34" y="89" fontSize="11" letterSpacing="0.5">{v.view.system}</text>
                    <rect className="d-card" x="20" y="135" width="134" height="30" rx="2" />
                    <text className="d-lab mono" x="34" y="154" fontSize="11" letterSpacing="0.5">{v.view.spreadsheets}</text>
                    <rect className="d-card" x="20" y="200" width="134" height="30" rx="2" />
                    <text className="d-lab mono" x="34" y="219" fontSize="11" letterSpacing="0.5">{v.view.notebooks}</text>
                  </g>
                  <g className="d-conn">
                    <path d="M154 85 C 186 85, 196 130, 232 132" />
                    <path d="M154 150 L 232 150" />
                    <path d="M154 215 C 186 215, 196 172, 232 170" />
                  </g>
                  <circle className="d-primary" cx="232" cy="132" r="2.6" />
                  <circle className="d-primary" cx="232" cy="150" r="2.6" />
                  <circle className="d-primary" cx="232" cy="170" r="2.6" />
                  <g>
                    <rect className="d-panel" x="240" y="46" width="258" height="208" rx="2" />
                    <text className="d-ink mono" x="256" y="72" fontSize="13" fontWeight="600">{v.view.panel}</text>
                    <rect className="live-pill" x="416" y="58" width="66" height="20" rx="2" />
                    <circle className="live-dot" cx="428" cy="68" r="3.2" />
                    <text className="d-primary mono" x="438" y="72" fontSize="10" letterSpacing="1">{v.view.live}</text>
                    <line className="d-line" x1="256" y1="84" x2="482" y2="84" strokeWidth="1" />
                    <g fontSize="11">
                      <text className="d-lab mono" x="256" y="112">{v.view.harvest}</text>
                      <text className="d-val mono" x="482" y="112" textAnchor="end">{v.view.inSeason}</text>
                      <text className="d-lab mono" x="256" y="146">{v.view.ripeness}</text>
                      <text className="d-val mono" x="482" y="146" textAnchor="end">{v.view.reading}</text>
                      <text className="d-lab mono" x="256" y="180">{v.view.sections}</text>
                      <text className="d-val mono" x="482" y="180" textAnchor="end">{v.view.allMapped}</text>
                      <text className="d-lab mono" x="256" y="214">{v.view.tanks}</text>
                      <text className="d-val mono" x="482" y="214" textAnchor="end">{v.view.tracked}</text>
                    </g>
                    <rect className="d-track" x="256" y="122" width="150" height="5" rx="2" />
                    <rect className="d-primary" x="256" y="122" width="104" height="5" rx="2" />
                    <rect className="d-track" x="256" y="156" width="150" height="5" rx="2" />
                    <rect className="d-secondary" x="256" y="156" width="72" height="5" rx="2" />
                    <rect className="d-track" x="256" y="190" width="150" height="5" rx="2" />
                    <rect className="d-primary" x="256" y="190" width="132" height="5" rx="2" />
                  </g>
                </svg>
                <span className="vis-honest mono">{v.honest}</span>
              </div>
              <figcaption className="vis-result">{v.view.caption}</figcaption>
            </figure>

            <div className="case-vis-pair">
              {/* A reading with an address. */}
              <figure className="case-vis">
                <div className="vis-frame" id="placeVis">
                  <span className="vis-tag">{v.place.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 274"
                    role="img"
                    aria-label={v.place.aria}
                  >
                    <g>
                      <rect className="d-card" x="26" y="96" width="188" height="108" rx="2" />
                      <text className="d-lab mono" x="42" y="120" fontSize="10" letterSpacing="1">{v.place.section}</text>
                      <text
                        className="d-lab mono"
                        x="200"
                        y="120"
                        fontSize="10"
                        letterSpacing="1"
                        textAnchor="end"
                      >{v.place.state}</text>
                      <line className="d-line" x1="42" y1="128" x2="198" y2="128" strokeWidth="1" />
                      <text className="d-dim mono" x="42" y="150" fontSize="12">
                        A1
                      </text>
                      <text className="d-dim mono" x="198" y="150" fontSize="12" textAnchor="end">{v.place.hold}</text>
                      <text className="d-ink mono" x="42" y="174" fontSize="12" fontWeight="600">
                        B3
                      </text>
                      <text
                        className="d-wine mono"
                        x="198"
                        y="174"
                        fontSize="12"
                        textAnchor="end"
                        fontWeight="600"
                      >{v.place.approaching}</text>
                      <text className="d-dim mono" x="42" y="196" fontSize="12">
                        C1
                      </text>
                      <text className="d-dim mono" x="198" y="196" fontSize="12" textAnchor="end">{v.place.atTarget}</text>
                      <rect className="d-wine" x="34" y="162" width="3" height="16" rx="1.5" />
                    </g>
                    <path className="d-conn-wine" d="M214 168 C 252 168, 258 128, 300 128" />
                    <circle className="d-wine" cx="300" cy="128" r="3" />
                    <g>
                      <path className="d-plot" d="M300 70 L392 62 L404 128 L302 138 Z" />
                      <path className="d-plot-wine" d="M404 128 L492 120 L486 190 L398 196 Z" />
                      <path className="d-plot" d="M302 138 L404 128 L398 196 L300 206 Z" />
                      <path className="d-plot-dim" d="M300 206 L398 196 L392 250 L306 258 Z" />
                      <text
                        className="d-wine mono"
                        x="442"
                        y="160"
                        fontSize="12"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        B3
                      </text>
                    </g>
                  </svg>
                  <span className="vis-honest mono">{v.honest}</span>
                </div>
                <figcaption className="vis-result">{v.place.caption}</figcaption>
              </figure>

              {/* The pick, seen coming. Illustrative, and the frame says so:
                  the curve is a shape and no date on it is measured. It draws
                  on once when it scrolls into view, and PlayOnceVis leaves it
                  in its resolved state under prefers-reduced-motion. */}
              <figure className="case-vis">
                <PlayOnceVis id="aheadVis" variant="pred-vis" tag={v.ahead.tag}>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 286"
                    role="img"
                    aria-label={v.ahead.aria}
                  >
                    <line className="d-line" x1="60" y1="250" x2="486" y2="250" strokeWidth="1.4" />
                    <line className="d-line" x1="60" y1="60" x2="60" y2="250" strokeWidth="1.4" />
                    <text className="pred-lab mono" x="60" y="46" fontSize="10" letterSpacing="1.5">{v.ahead.readiness}</text>
                    <line className="pred-target" x1="60" y1="104" x2="486" y2="104" />
                    <text
                      className="pred-lab mono"
                      x="486"
                      y="96"
                      fontSize="10"
                      letterSpacing="1"
                      textAnchor="end"
                    >{v.ahead.standard}</text>
                    <path
                      className="pred-curve"
                      d="M60 236 C 150 226, 210 200, 280 168 C 330 144, 360 122, 392 104"
                    />
                    <path className="pred-proj" d="M392 104 L392 250" />
                    <g className="pred-mark">
                      <circle className="pred-mark-ring" cx="392" cy="104" r="9" />
                      <circle className="pred-mark-core" cx="392" cy="104" r="3" />
                    </g>
                    <text
                      className="pred-lab-w mono"
                      x="392"
                      y="272"
                      fontSize="11"
                      textAnchor="middle"
                      letterSpacing="0.5"
                    >{v.ahead.anticipated}</text>
                  </svg>
                  <span className="vis-honest mono">{v.honest}</span>
                </PlayOnceVis>
                <figcaption className="vis-result">{v.ahead.caption}</figcaption>
              </figure>
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
