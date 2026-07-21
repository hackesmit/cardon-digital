import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import VineyardMap from "@/components/pages/case/VineyardMap";
import BerryToBottle from "@/components/pages/case/BerryToBottle";
import PlayOnceVis from "@/components/pages/case/PlayOnceVis";
import SpotlightFrames from "@/components/pages/case/SpotlightFrames";
import "./case.css";

export const metadata: Metadata = {
  title: "Monte Xanic case study",
  description:
    "How Monte Xanic went from production data split across systems, spreadsheets, and notebooks to one live view of the harvest, from berry to bottle.",
  alternates: { canonical: "/work/monte-xanic" },
};

export default function MonteXanicCaseStudy() {
  return (
    <main id="main" className="pg-case">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label="Introduction">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">Case study / Winery</p>
            <h1>
              Monte Xanic sees its entire harvest{" "}
              <span className="accent">live</span>, from berry to{" "}
              <span className="wine">bottle</span>.
            </h1>
            <p className="hero-sub">
              The state of the harvest used to live in three places at once and
              agree in none. We pulled it into one living view, bound it to their
              real vineyard sections, and taught it to read ripeness against Monte
              Xanic&apos;s own standard.{" "}
              <b>One winery, one true picture, all season.</b>
            </p>
            <p className="brandline">Built to hold water</p>
          </div>

          <VineyardMap />
        </div>
      </section>

      {/* ============================ CLIENT INTRO ============================ */}
      <section className="section rule-top" aria-labelledby="client-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker wine">The client</span>
              <h2 id="client-title">Monte Xanic, Valle de Guadalupe.</h2>
            </div>
            <div className="prose">
              <p>
                Monte Xanic is one of Mexico&apos;s most respected and awarded
                wineries, working in the Valle de Guadalupe in Baja California. It
                has spent decades building a reputation on the quality of what goes
                in the bottle.
              </p>
              <p>
                A winery that careful about the wine deserves to be that clear
                about the harvest behind it. That is the part we were asked to help
                with.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ CHALLENGE ============================ */}
      <section className="section" aria-labelledby="challenge-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">The challenge</span>
              <h2 id="challenge-title">The harvest lived in three places at once.</h2>
            </div>
            <div className="prose">
              <p>
                The numbers that describe a harvest were split across sources and
                across mediums. A production system held one part. A handful of
                Excel files held another. And out in the vineyard, some of it still
                lived in physical field notebooks.
              </p>
              <p>
                To see the current state of the harvest, someone had to gather all
                of it by hand, from a screen, from spreadsheets, and from paper,
                and reconcile it into a single picture.{" "}
                <b>By the time that picture was assembled, it was already old.</b>{" "}
                Decisions that turn on a day or two of ripeness were being made
                against a view that had gone stale in the making.
              </p>
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
                <span className="kicker">01 / One live dashboard</span>
                <h2 id="ch-a-title">Everything in one view, and the view is live.</h2>
                <p className="section-sub">
                  We consolidated the three sources into a single dashboard that
                  updates itself. Instead of gathering the harvest by hand, the
                  team opens <b>one completely live view</b> of the current state
                  of the harvest and the berries, refreshed on its own rather than
                  reassembled.
                </p>
                <p className="note">
                  From gathered by hand to <b>live on its own.</b>
                </p>
              </div>
              <div className="split-vis">
                <div className="vis-frame" id="dashVis">
                  <span className="vis-tag">three sources, one live view</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 300"
                    role="img"
                    aria-label="A production system, spreadsheets, and field notebooks feed into one live consolidated dashboard."
                  >
                    <g>
                      <rect className="d-card" x="20" y="70" width="118" height="30" rx="7" />
                      <text className="d-lab mono" x="34" y="89" fontSize="11" letterSpacing="0.5">
                        system
                      </text>
                      <rect className="d-card" x="20" y="135" width="118" height="30" rx="7" />
                      <text className="d-lab mono" x="34" y="154" fontSize="11" letterSpacing="0.5">
                        spreadsheets
                      </text>
                      <rect className="d-card" x="20" y="200" width="118" height="30" rx="7" />
                      <text className="d-lab mono" x="34" y="219" fontSize="11" letterSpacing="0.5">
                        field notebooks
                      </text>
                    </g>
                    <g className="d-conn">
                      <path d="M138 85 C 180 85, 190 130, 232 132" />
                      <path d="M138 150 L 232 150" />
                      <path d="M138 215 C 180 215, 190 172, 232 170" />
                    </g>
                    <circle className="d-primary" cx="232" cy="132" r="2.6" />
                    <circle className="d-primary" cx="232" cy="150" r="2.6" />
                    <circle className="d-primary" cx="232" cy="170" r="2.6" />
                    <g>
                      <rect className="d-panel" x="240" y="46" width="258" height="208" rx="12" />
                      <text className="d-ink mono" x="256" y="72" fontSize="13" fontWeight="600">
                        One view
                      </text>
                      <rect className="live-pill" x="416" y="58" width="66" height="20" rx="10" />
                      <circle className="live-dot" cx="428" cy="68" r="3.2" />
                      <text className="d-primary mono" x="438" y="72" fontSize="10" letterSpacing="1">
                        LIVE
                      </text>
                      <line className="d-line" x1="256" y1="84" x2="482" y2="84" strokeWidth="1" />
                      <g fontSize="11">
                        <text className="d-lab mono" x="256" y="112">
                          HARVEST
                        </text>
                        <text className="d-val mono" x="482" y="112" textAnchor="end">
                          in season
                        </text>
                        <text className="d-lab mono" x="256" y="146">
                          RIPENESS
                        </text>
                        <text className="d-val mono" x="482" y="146" textAnchor="end">
                          reading
                        </text>
                        <text className="d-lab mono" x="256" y="180">
                          SECTIONS
                        </text>
                        <text className="d-val mono" x="482" y="180" textAnchor="end">
                          all mapped
                        </text>
                        <text className="d-lab mono" x="256" y="214">
                          TANKS
                        </text>
                        <text className="d-val mono" x="482" y="214" textAnchor="end">
                          tracked
                        </text>
                      </g>
                      <rect className="d-track" x="256" y="122" width="150" height="5" rx="2.5" />
                      <rect className="d-primary" x="256" y="122" width="104" height="5" rx="2.5" />
                      <rect className="d-track" x="256" y="156" width="150" height="5" rx="2.5" />
                      <rect className="d-secondary" x="256" y="156" width="72" height="5" rx="2.5" />
                      <rect className="d-track" x="256" y="190" width="150" height="5" rx="2.5" />
                      <rect className="d-primary" x="256" y="190" width="132" height="5" rx="2.5" />
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
                <span className="kicker gold">02 / Custom maps</span>
                <h2 id="ch-b-title">Every number has a place, not just a row.</h2>
                <p className="section-sub">
                  We bound the data to the specific sections of Monte Xanic&apos;s
                  real vineyards. A reading is no longer a line in a table you have
                  to picture in your head. It sits on the section it came from, so
                  the whole harvest can be <b>read as a map</b> the way it is
                  actually walked.
                </p>
                <p className="note">
                  From a row in a sheet to <b className="w">a place on the land.</b>
                </p>
              </div>
              <div className="split-vis">
                <div className="vis-frame" id="mapsVis">
                  <span className="vis-tag">the row, bound to the land</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 300"
                    role="img"
                    aria-label="A table row for section B3 is bound to its polygon on a small vineyard map."
                  >
                    <g>
                      <rect className="d-card" x="26" y="96" width="188" height="108" rx="9" />
                      <text className="d-lab mono" x="42" y="120" fontSize="10" letterSpacing="1">
                        SECTION
                      </text>
                      <text
                        className="d-lab mono"
                        x="200"
                        y="120"
                        fontSize="10"
                        letterSpacing="1"
                        textAnchor="end"
                      >
                        STATE
                      </text>
                      <line className="d-line" x1="42" y1="128" x2="198" y2="128" strokeWidth="1" />
                      <text className="d-dim mono" x="42" y="150" fontSize="12">
                        A1
                      </text>
                      <text className="d-dim mono" x="198" y="150" fontSize="12" textAnchor="end">
                        hold
                      </text>
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
                      >
                        approaching
                      </text>
                      <text className="d-dim mono" x="42" y="196" fontSize="12">
                        C1
                      </text>
                      <text className="d-dim mono" x="198" y="196" fontSize="12" textAnchor="end">
                        at target
                      </text>
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
                <span className="kicker">03 / Prediction</span>
                <h2 id="ch-c-title">Harvest timing anticipated, not guessed.</h2>
                <p className="section-sub">
                  We built a model that anticipates when each section will be ready
                  to pick, measured against Monte Xanic&apos;s own quality
                  standards, not a generic rule. The team can see readiness coming
                  before it arrives, so the pick is{" "}
                  <b>planned against a projection</b> rather than caught by
                  surprise.
                </p>
                <p className="note">
                  From read after the fact to <b>seen coming.</b>
                </p>
              </div>
              <div className="split-vis">
                <PlayOnceVis
                  id="predVis"
                  variant="pred-vis"
                  tag="readiness, seen before it lands"
                >
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 300"
                    role="img"
                    aria-label="A readiness curve rises to meet the Monte Xanic standard line, with a projected point marking anticipated readiness."
                  >
                    <line className="d-line" x1="60" y1="250" x2="486" y2="250" strokeWidth="1.4" />
                    <line className="d-line" x1="60" y1="60" x2="60" y2="250" strokeWidth="1.4" />
                    <text className="pred-lab mono" x="60" y="46" fontSize="10" letterSpacing="1.5">
                      READINESS
                    </text>
                    <line className="pred-target" x1="60" y1="104" x2="486" y2="104" />
                    <text
                      className="pred-lab mono"
                      x="486"
                      y="96"
                      fontSize="10"
                      letterSpacing="1"
                      textAnchor="end"
                    >
                      MONTE XANIC STANDARD
                    </text>
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
                    >
                      anticipated
                    </text>
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
              <span className="kicker wine">04 / Berry to bottle</span>
              <h2 id="ch-d-title">One thread, from the field to the bottle.</h2>
              <p className="section-sub">
                We tracked the wine along its whole path, from berry on the vine,
                through tank and barrel, to the finished bottle. When every stage
                is on the same thread, an adjustment is something you make{" "}
                <b>in season, while it still matters</b>, not something you piece
                together afterward like archaeology.
              </p>
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
                <span className="kicker gold">05 / The finance side</span>
                <h2 id="ch-e-title">An hour of finance work, now about two minutes.</h2>
                <p className="section-sub">
                  One financial workflow at the winery took about an hour of manual
                  assembly. We rebuilt it to run on its own: the same work now takes{" "}
                  <b>about two minutes, and refreshes through the day</b>. The
                  finance view stops being a weekly chore and becomes something
                  that is simply always current.
                </p>
                <p className="note">
                  From an hour by hand to <b>about two minutes, on its own.</b>
                </p>
              </div>
              <div className="split-vis">
                <PlayOnceVis
                  id="finVis"
                  variant="fin-vis"
                  tag="an hour, compressed to two minutes"
                >
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 210"
                    role="img"
                    aria-label="A one hour manual workflow compresses to about two minutes and runs itself, refreshed through the day."
                  >
                    <text className="fin-lab-manual mono" x="34" y="58" fontSize="12" letterSpacing="1.5">
                      MANUAL, ONCE A WEEK
                    </text>
                    <text className="fin-lab-auto mono" x="34" y="58" fontSize="12" letterSpacing="1.5">
                      RUNS ITSELF, ALL DAY
                    </text>
                    <rect className="fin-track" x="34" y="74" width="452" height="18" rx="9" />
                    <rect className="fin-bar" x="34" y="74" width="452" height="18" rx="9" />
                    <line className="fin-tick" x1="34" y1="104" x2="34" y2="114" />
                    <line className="fin-tick" x1="486" y1="104" x2="486" y2="114" />
                    <text
                      className="fin-time-long mono"
                      x="486"
                      y="58"
                      textAnchor="end"
                      fontSize="16"
                      fontWeight="600"
                    >
                      about 1 hr
                    </text>
                    <text
                      className="fin-time-short mono"
                      x="486"
                      y="58"
                      textAnchor="end"
                      fontSize="16"
                      fontWeight="600"
                    >
                      about 2 min
                    </text>
                    <g className="fin-badge">
                      <rect className="fin-badge-box" x="34" y="130" width="178" height="34" rx="8" />
                      <text className="fin-badge-text" x="50" y="152" fontSize="14" fontWeight="600">
                        about 97 percent less
                      </text>
                    </g>
                    <text
                      className="fin-foot"
                      x="486"
                      y="152"
                      textAnchor="end"
                      fontSize="11"
                      letterSpacing="1"
                    >
                      REFRESHED THROUGH THE DAY
                    </text>
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
              <span className="kicker wine">The result</span>
              <h2 id="results-title">What Monte Xanic can do now.</h2>
            </div>
            <div className="callouts">
              <div className="callout">
                <span className="callout-idx mono">01</span>
                <p className="callout-lead">One source of truth, live all season.</p>
                <p className="callout-body">
                  No more assembling the harvest by hand from a system,
                  spreadsheets, and paper. One view, current on its own.
                </p>
              </div>
              <div className="callout">
                <span className="callout-idx mono">02</span>
                <p className="callout-lead">Every vineyard section, mapped and readable.</p>
                <p className="callout-body">
                  The numbers sit on the real sections they came from, so the
                  harvest reads like the land it is walked on.
                </p>
              </div>
              <div className="callout">
                <span className="callout-idx mono">03</span>
                <p className="callout-lead">Harvest timing anticipated, not guessed.</p>
                <p className="callout-body">
                  Readiness is projected against Monte Xanic&apos;s own standard,
                  so the pick is planned before it is due.
                </p>
              </div>
              <div className="callout">
                <span className="callout-idx mono">04</span>
                <p className="callout-lead">From berry to bottle, one thread.</p>
                <p className="callout-body">
                  The wine is tracked the whole way, so adjustments are made in
                  season, while they still change the outcome.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ OUTCOME ============================ */}
      <section className="outcome" aria-labelledby="outcome-title">
        <div className="container">
          <Reveal>
            <div className="outcome-inner">
              <span className="kicker">The outcome</span>
              <h2 id="outcome-title">A harvest the winery can actually see.</h2>
              <div className="prose">
                <p>
                  The work that used to go into assembling the picture now goes into
                  acting on it. Monte Xanic reads one live view, mapped to its own
                  vineyards, that anticipates readiness against its own standard and
                  follows the wine from berry to bottle, while the finance behind it
                  stays current on its own.
                </p>
                <p>
                  <b>The point was never a dashboard.</b> It was giving a winery
                  that is meticulous about the bottle a picture of the harvest that
                  is finally as clear, and as current, as the wine deserves.
                </p>
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
                <span className="kicker clay">Start here</span>
                <h2 id="diag-title">The Growth Diagnostic</h2>
                <p className="diag-desc">
                  Ten business days looking at your ads, your site, and your
                  operations as one system. You get a written memo, not a sales
                  deck, telling you what is true, what is broken, and what to build
                  first.
                </p>
                <div className="diag-actions">
                  <a
                    className="cta cta-lg"
                    href="mailto:daniel@cardondigital.com?subject=Growth%20Diagnostic"
                  >
                    Get the free Growth Diagnostic
                  </a>
                </div>
                <p className="diag-price">
                  <b>Free.</b> No retainer, no obligation. If the memo shows work
                  worth doing, we propose the build and you decide.
                </p>
              </div>
              <div className="diag-specs">
                <div className="spec">
                  <span className="spec-dot"></span>
                  <span>
                    <b>Day 1.</b> A working session on your ads, your site, and your
                    operations.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot"></span>
                  <span>
                    <b>Days 2 to 9.</b> We dig: accounts, measurement, workflows,
                    the numbers behind the numbers.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot"></span>
                  <span>
                    <b>Day 10.</b> The memo lands: what is true, what is broken,
                    what to build first.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot"></span>
                  <span>
                    <b>Free, with no strings.</b> Act on it with us or without us.
                    If we build, pricing is agreed up front.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SpotlightFrames />
    </main>
  );
}
