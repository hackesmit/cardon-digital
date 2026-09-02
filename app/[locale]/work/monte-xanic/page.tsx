import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import VineyardMap from "@/components/pages/case/VineyardMap";
import BerryToBottle from "@/components/pages/case/BerryToBottle";
import PlayOnceVis from "@/components/pages/case/PlayOnceVis";
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

export default function MonteXanicCaseStudy({ params }: Params) {
  const locale = localeOf(params);
  const d = monteXanic[locale];
  const s = site[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-case">
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
              <span className="wine">{d.hero.wine}</span>
              {d.hero.t3}
            </h1>
            <p className="hero-sub">{rich(d.hero.sub)}</p>
            <p className="brandline">{s.brandline}</p>
          </div>

          <VineyardMap />
        </div>
      </section>

      {/* ============================ CLIENT INTRO ============================ */}
      <section className="section rule-top" aria-labelledby="client-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">{d.client.kicker}</span>
              <h2 id="client-title">{d.client.title}</h2>
            </div>
            <div className="prose">
              <p>{d.client.p1}</p>
              <p>{d.client.p2}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ CHALLENGE ============================ */}
      <section className="section" aria-labelledby="challenge-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.challenge.kicker}</span>
              <h2 id="challenge-title">{d.challenge.title}</h2>
            </div>
            <div className="prose">
              <p>{d.challenge.p1}</p>
              <p>{rich(d.challenge.p2)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER A ============================ */}
      <section className="section rule-top" id="solution" aria-labelledby="ch-a-title">
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split-copy">
                <span className="kicker">{d.chA.kicker}</span>
                <h2 id="ch-a-title">{d.chA.title}</h2>
                <p className="section-sub">{rich(d.chA.sub)}</p>
                <p className="note">{rich(d.chA.note)}</p>
              </div>
              <div className="split-vis">
                <div className="vis-frame" id="dashVis">
                  <span className="vis-tag">{d.chA.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 270"
                    role="img"
                    aria-label={d.chA.aria}
                  >
                    <g>
                      <rect className="d-card" x="20" y="70" width="134" height="30" rx="2" />
                      <text className="d-lab mono" x="34" y="89" fontSize="11" letterSpacing="0.5">{d.chA.system}</text>
                      <rect className="d-card" x="20" y="135" width="134" height="30" rx="2" />
                      <text className="d-lab mono" x="34" y="154" fontSize="11" letterSpacing="0.5">{d.chA.spreadsheets}</text>
                      <rect className="d-card" x="20" y="200" width="134" height="30" rx="2" />
                      <text className="d-lab mono" x="34" y="219" fontSize="11" letterSpacing="0.5">{d.chA.notebooks}</text>
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
                      <text className="d-ink mono" x="256" y="72" fontSize="13" fontWeight="600">{d.chA.oneView}</text>
                      <rect className="live-pill" x="416" y="58" width="66" height="20" rx="2" />
                      <circle className="live-dot" cx="428" cy="68" r="3.2" />
                      <text className="d-primary mono" x="438" y="72" fontSize="10" letterSpacing="1">{d.chA.live}</text>
                      <line className="d-line" x1="256" y1="84" x2="482" y2="84" strokeWidth="1" />
                      <g fontSize="11">
                        <text className="d-lab mono" x="256" y="112">{d.chA.harvest}</text>
                        <text className="d-val mono" x="482" y="112" textAnchor="end">{d.chA.inSeason}</text>
                        <text className="d-lab mono" x="256" y="146">{d.chA.ripeness}</text>
                        <text className="d-val mono" x="482" y="146" textAnchor="end">{d.chA.reading}</text>
                        <text className="d-lab mono" x="256" y="180">{d.chA.sections}</text>
                        <text className="d-val mono" x="482" y="180" textAnchor="end">{d.chA.allMapped}</text>
                        <text className="d-lab mono" x="256" y="214">{d.chA.tanks}</text>
                        <text className="d-val mono" x="482" y="214" textAnchor="end">{d.chA.tracked}</text>
                      </g>
                      <rect className="d-track" x="256" y="122" width="150" height="5" rx="2" />
                      <rect className="d-primary" x="256" y="122" width="104" height="5" rx="2" />
                      <rect className="d-track" x="256" y="156" width="150" height="5" rx="2" />
                      <rect className="d-secondary" x="256" y="156" width="72" height="5" rx="2" />
                      <rect className="d-track" x="256" y="190" width="150" height="5" rx="2" />
                      <rect className="d-primary" x="256" y="190" width="132" height="5" rx="2" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER B ============================ */}
      <section className="section" aria-labelledby="ch-b-title">
        <div className="container">
          <Reveal>
            <div className="split reverse">
              <div className="split-copy">
                <span className="kicker gold">{d.chB.kicker}</span>
                <h2 id="ch-b-title">{d.chB.title}</h2>
                <p className="section-sub">{rich(d.chB.sub)}</p>
                <p className="note">{rich(d.chB.note, { b: "w" })}</p>
              </div>
              <div className="split-vis">
                <div className="vis-frame" id="mapsVis">
                  <span className="vis-tag">{d.chB.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 274"
                    role="img"
                    aria-label={d.chB.aria}
                  >
                    <g>
                      <rect className="d-card" x="26" y="96" width="188" height="108" rx="2" />
                      <text className="d-lab mono" x="42" y="120" fontSize="10" letterSpacing="1">{d.chB.section}</text>
                      <text
                        className="d-lab mono"
                        x="200"
                        y="120"
                        fontSize="10"
                        letterSpacing="1"
                        textAnchor="end"
                      >{d.chB.state}</text>
                      <line className="d-line" x1="42" y1="128" x2="198" y2="128" strokeWidth="1" />
                      <text className="d-dim mono" x="42" y="150" fontSize="12">
                        A1
                      </text>
                      <text className="d-dim mono" x="198" y="150" fontSize="12" textAnchor="end">{d.chB.hold}</text>
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
                      >{d.chB.approaching}</text>
                      <text className="d-dim mono" x="42" y="196" fontSize="12">
                        C1
                      </text>
                      <text className="d-dim mono" x="198" y="196" fontSize="12" textAnchor="end">{d.chB.atTarget}</text>
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
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER C ============================ */}
      <section className="section" aria-labelledby="ch-c-title">
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split-copy">
                <span className="kicker">{d.chC.kicker}</span>
                <h2 id="ch-c-title">{d.chC.title}</h2>
                <p className="section-sub">{rich(d.chC.sub)}</p>
                <p className="note">{rich(d.chC.note)}</p>
              </div>
              <div className="split-vis">
                <PlayOnceVis
                  id="predVis"
                  variant="pred-vis"
                  tag="readiness, seen before it lands"
                >
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 286"
                    role="img"
                    aria-label={d.chC.aria}
                  >
                    <line className="d-line" x1="60" y1="250" x2="486" y2="250" strokeWidth="1.4" />
                    <line className="d-line" x1="60" y1="60" x2="60" y2="250" strokeWidth="1.4" />
                    <text className="pred-lab mono" x="60" y="46" fontSize="10" letterSpacing="1.5">{d.chC.readiness}</text>
                    <line className="pred-target" x1="60" y1="104" x2="486" y2="104" />
                    <text
                      className="pred-lab mono"
                      x="486"
                      y="96"
                      fontSize="10"
                      letterSpacing="1"
                      textAnchor="end"
                    >{d.chC.standard}</text>
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
                    >{d.chC.anticipated}</text>
                  </svg>
                </PlayOnceVis>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER D (BERRY TO BOTTLE) ============================ */}
      <section className="section" id="berry-to-bottle" aria-labelledby="ch-d-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">{d.chD.kicker}</span>
              <h2 id="ch-d-title">{d.chD.title}</h2>
              <p className="section-sub">{rich(d.chD.sub)}</p>
            </div>

            <BerryToBottle />
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER E (FINANCE) ============================ */}
      <section className="section" id="finance" aria-labelledby="ch-e-title">
        <div className="container">
          <Reveal>
            <div className="split reverse">
              <div className="split-copy">
                <span className="kicker gold">{d.chE.kicker}</span>
                <h2 id="ch-e-title">{d.chE.title}</h2>
                <p className="section-sub">{rich(d.chE.sub)}</p>
                <p className="note">{rich(d.chE.note)}</p>
              </div>
              <div className="split-vis">
                <PlayOnceVis
                  id="finVis"
                  variant="fin-vis"
                  tag="an hour, compressed to two minutes"
                >
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 182"
                    role="img"
                    aria-label={d.chE.aria}
                  >
                    <text className="fin-lab-manual mono" x="34" y="58" fontSize="12" letterSpacing="1.5">{d.chE.manual}</text>
                    <text className="fin-lab-auto mono" x="34" y="58" fontSize="12" letterSpacing="1.5">{d.chE.auto}</text>
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
                    >{d.chE.long}</text>
                    <text
                      className="fin-time-short mono"
                      x="486"
                      y="58"
                      textAnchor="end"
                      fontSize="16"
                      fontWeight="600"
                    >{d.chE.short}</text>
                    <g className="fin-badge">
                      <rect className="fin-badge-box" x="34" y="130" width="204" height="34" rx="2" />
                      <text className="fin-badge-text" x="50" y="152" fontSize="13" fontWeight="600">{d.chE.less}</text>
                    </g>
                    <text
                      className="fin-foot"
                      x="486"
                      y="152"
                      textAnchor="end"
                      fontSize="11"
                      letterSpacing="1"
                    >{d.chE.refreshed}</text>
                  </svg>
                </PlayOnceVis>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ RESULT CALLOUTS ============================ */}
      <section className="section results rule-top" aria-labelledby="results-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">{d.results.kicker}</span>
              <h2 id="results-title">{d.results.title}</h2>
            </div>
            <div className="callouts">
              {d.results.items.map((item, i) => (
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

      {/* ============================ OUTCOME ============================ */}
      <section className="outcome" aria-labelledby="outcome-title">
        <div className="container">
          <Reveal>
            <div className="outcome-inner">
              <span className="kicker">{d.outcome.kicker}</span>
              <h2 id="outcome-title">{d.outcome.title}</h2>
              <div className="prose">
                <p>{d.outcome.p1}</p>
                <p>{rich(d.outcome.p2)}</p>
              </div>
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
