import type { Metadata } from "next";
import Link from "next/link";
import HeroAssembly from "@/components/pages/home/HeroAssembly";
import OpsCompression from "@/components/pages/home/OpsCompression";
import PlayOnceVis from "@/components/pages/home/PlayOnceVis";
import SectorMap from "@/components/pages/home/SectorMap";
import SpotlightFrames from "@/components/pages/home/SpotlightFrames";
import "./home.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="main" className="pg-home">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label="Introduction">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">Not another SaaS</p>
            <h1>
              Your ads, your site, your operations.
              <br />
              <span className="accent">One living system.</span>
            </h1>
            <p className="hero-sub">
              Scattered spreadsheets, PDFs, inboxes, and messages are how most
              businesses actually run. We wire them into one connected system you
              read from and decide with, then hand your team the keys.{" "}
              <b>Make your numbers true, then compound.</b>
            </p>
            <div className="hero-actions">
              <a className="cta" href="#diagnostic">
                Get the free Growth Diagnostic
              </a>
              <a className="btn-ghost" href="#operations">
                See how it works
              </a>
            </div>
            <p className="brandline">Built to hold water</p>
          </div>

          <HeroAssembly />
        </div>
      </section>

      {/* ============================ VALUE STRIP ============================ */}
      <section className="value" aria-label="What that is worth to you">
        <h2 className="sr-only">What it is worth to you</h2>
        <div className="container value-grid">
          <div className="value-item">
            <span className="value-key">Paid on performance</span>
            <p className="value-lead">
              For ad work, our fee is{" "}
              <span className="cool">a share of what the ads produce.</span>
            </p>
            <p className="value-body">
              A percent of spend, with a floor; a share of the sales the ads
              bring in once measurement you trust is in place. When results grow,
              we earn it. When they do not, we feel it too.
            </p>
          </div>
          <div className="value-item">
            <span className="value-key">Work that runs itself</span>
            <p className="value-lead">
              Manual routines,{" "}
              <span className="cool">turned into work that runs itself.</span>
            </p>
            <p className="value-body">
              We find the jobs your team does by hand every week and make them run
              on their own, then compound the hours you get back.
            </p>
          </div>
          <div className="value-item">
            <span className="value-key">Both markets</span>
            <p className="value-lead">
              Two languages, <span className="cool">both written natively.</span>
            </p>
            <p className="value-body">
              The US and Mexico, in English and Spanish, not translated after the
              fact.
            </p>
          </div>
        </div>
      </section>

      {/* ============================ DEMAND ============================ */}
      <section className="section" id="services" aria-labelledby="demand-title">
        <div className="container">
          <div className="split">
            <div className="split-copy">
              <span className="kicker">01 / Demand</span>
              <h2 id="demand-title">
                Demand you can trust, before you optimize it.
              </h2>
              <p className="section-sub">
                We run Google Ads with the rigor of the most sophisticated
                agencies, at the cutting edge of what the platforms can do, and{" "}
                <b>priced in proportion to performance</b>: a percent of ad spend
                with a floor, or, once measurement you trust is in place, a
                percent of the sales the ads bring in. Before anyone tunes a
                campaign, we check whether the numbers coming in are real, so every
                decision after that rests on something true. Offline conversions,
                call and chat tracking, structured testing with kill rules: the
                same measurement discipline the biggest performance shops run,
                sized for owner-run businesses.
              </p>
              <p className="note">
                Pricing: <b>a share of spend, with a floor; results-based once
                measurement is proven.</b> We get paid when it works.
              </p>
            </div>
            <div className="split-vis">
              <PlayOnceVis className="demand-vis" tag="measured before optimized">
                <svg
                  className="demand-svg demand-svg-d"
                  viewBox="0 0 520 300"
                  role="img"
                  aria-label="A single reading is checked against a measured baseline and settles to a verified state."
                >
                  <text
                    className="dm-in-lab mono"
                    x="46"
                    y="120"
                    fontSize="11"
                    letterSpacing="1.5"
                  >
                    SIGNAL IN
                  </text>
                  <line className="dm-track" x1="60" y1="150" x2="440" y2="150" />
                  <line className="dm-tick" x1="60" y1="144" x2="60" y2="156" />
                  <line className="dm-tick" x1="150" y1="145" x2="150" y2="155" />
                  <line className="dm-tick" x1="240" y1="145" x2="240" y2="155" />
                  <line className="dm-tick" x1="330" y1="145" x2="330" y2="155" />
                  <line className="dm-gate" x1="360" y1="118" x2="360" y2="182" />
                  <text
                    className="dm-gate-lab mono"
                    x="360"
                    y="200"
                    textAnchor="middle"
                    fontSize="10"
                    letterSpacing="1.5"
                  >
                    MEASURED
                  </text>
                  <g className="dm-knob">
                    <circle className="dm-knob-halo" cx="60" cy="150" r="14" />
                    <circle className="dm-knob-core" cx="60" cy="150" r="6" />
                  </g>
                  <g className="dm-badge">
                    <circle className="dm-badge-ring" cx="360" cy="96" r="16" />
                    <path className="dm-badge-check" d="M352 96 L358 102 L369 90" />
                  </g>
                  <text
                    className="dm-lab-pre mono"
                    x="60"
                    y="250"
                    fontSize="14"
                    letterSpacing="0.5"
                  >
                    checking the numbers
                  </text>
                  <text
                    className="dm-lab-ok mono"
                    x="60"
                    y="250"
                    fontSize="14"
                    letterSpacing="0.5"
                  >
                    verified, safe to optimize
                  </text>
                  <text
                    className="dm-value mono"
                    x="440"
                    y="120"
                    textAnchor="end"
                    fontSize="13"
                    fontWeight="600"
                  >
                    reading
                  </text>
                  <text
                    className="dm-fee mono"
                    x="60"
                    y="278"
                    fontSize="11"
                    letterSpacing="0.8"
                  >
                    priced on performance, a share of results
                  </text>
                </svg>

                <svg
                  className="demand-svg demand-svg-m"
                  viewBox="0 0 360 340"
                  role="img"
                  aria-label="A single reading is checked against a measured baseline and settles to a verified state."
                >
                  <text
                    className="dm-in-lab mono"
                    x="30"
                    y="120"
                    fontSize="13"
                    letterSpacing="1.5"
                  >
                    SIGNAL IN
                  </text>
                  <line className="dm-track" x1="30" y1="166" x2="330" y2="166" />
                  <line className="dm-tick" x1="30" y1="159" x2="30" y2="173" />
                  <line className="dm-tick" x1="105" y1="160" x2="105" y2="172" />
                  <line className="dm-tick" x1="180" y1="160" x2="180" y2="172" />
                  <line className="dm-tick" x1="255" y1="160" x2="255" y2="172" />
                  <line className="dm-gate" x1="255" y1="128" x2="255" y2="204" />
                  <text
                    className="dm-gate-lab mono"
                    x="255"
                    y="222"
                    textAnchor="middle"
                    fontSize="12"
                    letterSpacing="1.5"
                  >
                    MEASURED
                  </text>
                  <g className="dm-knob">
                    <circle className="dm-knob-halo" cx="30" cy="166" r="15" />
                    <circle className="dm-knob-core" cx="30" cy="166" r="6.5" />
                  </g>
                  <g className="dm-badge">
                    <circle className="dm-badge-ring" cx="255" cy="100" r="17" />
                    <path className="dm-badge-check" d="M246 100 L253 107 L265 93" />
                  </g>
                  <text
                    className="dm-value mono"
                    x="330"
                    y="150"
                    textAnchor="end"
                    fontSize="15"
                    fontWeight="600"
                  >
                    reading
                  </text>
                  <text
                    className="dm-lab-pre mono"
                    x="24"
                    y="268"
                    fontSize="16"
                    letterSpacing="0.4"
                  >
                    checking the numbers
                  </text>
                  <text
                    className="dm-lab-ok mono"
                    x="24"
                    y="268"
                    fontSize="16"
                    letterSpacing="0.4"
                  >
                    verified, safe to optimize
                  </text>
                  <text
                    className="dm-fee mono"
                    x="24"
                    y="304"
                    fontSize="12"
                    letterSpacing="0.2"
                  >
                    priced on performance, a share of results
                  </text>
                </svg>
              </PlayOnceVis>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ OPERATIONS ============================ */}
      <section className="section" id="operations" aria-labelledby="ops-title">
        <div className="container">
          <div className="split reverse">
            <div className="split-copy">
              <span className="kicker gold">02 / Operations</span>
              <h2 id="ops-title">An hour of manual work, made to run itself.</h2>
              <p className="section-sub">
                One financial workflow we built went from an hour of manual work to
                about two minutes, refreshed through the day. That is a{" "}
                <b>97 percent reduction</b>, and it is not a one-off. It is the
                pattern we repeat: find the hour-long manual jobs, make them run
                themselves, then compound the hours you get back every month.
              </p>
              <p className="note">
                Pattern, not a trophy: <b>hours back every month,</b> compounding.
              </p>
            </div>
            <div className="split-vis">
              <OpsCompression />
            </div>
          </div>
        </div>
      </section>

      {/* ============================ TOOLS ============================ */}
      <section className="section" id="tools" aria-labelledby="tools-title">
        <div className="container">
          <div className="split">
            <div className="split-copy">
              <span className="kicker">03 / Tools</span>
              <h2 id="tools-title">Tools your team actually runs, and owns.</h2>
              <p className="section-sub">
                We build custom workflows and internal tools your team uses every
                day, <b>integrated end to end</b>, trained into the business, and
                yours to keep. Underneath them all sits one data warehouse:
                every channel, file, and system combined into clean, organized
                fields that feed everything you see. Where it helps, we add an
                assistant trained on your own data, so you can ask your business a
                question and get an answer from your numbers. Separate parts,
                spreadsheets, dashboards, and forms become one working board with
                no per-seat subscription to babysit.
              </p>
              <p className="section-sub">
                The build is a <b>scoped fixed fee</b>, agreed before work starts.
                After handoff, most owners keep a monthly <b>care retainer</b>:
                corrections, refinements, and the changes that shape the system
                around how your team actually uses it. Pause it whenever you
                want; everything keeps running and stays yours.
              </p>
              <p className="note">
                Model: <b>trained in and owned,</b> not another subscription.
              </p>
            </div>
            <div className="split-vis">
              <PlayOnceVis className="tools-vis" tag="parts wired into one board">
                <svg
                  className="tools-svg"
                  viewBox="0 0 520 250"
                  role="img"
                  aria-label="Separate modular parts are placed and wired into one working board."
                >
                  <rect className="tl-board" x="40" y="30" width="440" height="190" rx="14" />
                  <g className="solder tl-solder" fill="none" strokeWidth="1.3" opacity="0.5">
                    <path d="M238 63 L 252 63" />
                    <path d="M148 90 L 148 78" />
                    <path d="M357 90 L 357 78" />
                    <path d="M148 202 L 148 218 L 357 218 L 357 202" />
                    <path d="M302 154 L 302 142" />
                    <path d="M412 154 L 412 142" />
                  </g>
                  <g className="blk blk-a">
                    <rect className="tl-card" x="58" y="48" width="180" height="30" rx="7" />
                    <circle className="tl-primary" cx="76" cy="63" r="5" />
                    <rect className="tl-muted" x="90" y="59" width="120" height="8" rx="4" opacity="0.55" />
                    <g className="solder tl-secondary">
                      <circle cx="64" cy="74" r="2" />
                      <circle cx="232" cy="74" r="2" />
                    </g>
                  </g>
                  <g className="blk blk-b">
                    <rect className="tl-card" x="252" y="48" width="210" height="30" rx="7" />
                    <rect className="tl-secondary" x="266" y="58" width="60" height="10" rx="5" opacity="0.9" />
                    <rect className="tl-muted" x="336" y="59" width="112" height="8" rx="4" opacity="0.5" />
                    <g className="solder tl-secondary">
                      <circle cx="258" cy="74" r="2" />
                      <circle cx="456" cy="74" r="2" />
                    </g>
                  </g>
                  <g className="blk blk-c">
                    <rect className="tl-card" x="58" y="90" width="180" height="112" rx="9" />
                    <g className="screen-detail">
                      <rect className="tl-primary" x="76" y="170" width="18" height="18" rx="3" opacity="0.85" />
                      <rect className="tl-primary" x="102" y="152" width="18" height="36" rx="3" opacity="0.7" />
                      <rect className="tl-primary" x="128" y="134" width="18" height="54" rx="3" />
                      <rect className="tl-secondary" x="154" y="120" width="18" height="68" rx="3" />
                      <rect className="tl-primary" x="180" y="146" width="18" height="42" rx="3" opacity="0.7" />
                      <line
                        className="tl-stroke-muted"
                        x1="70"
                        y1="112"
                        x2="150"
                        y2="112"
                        strokeWidth="6"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                    </g>
                  </g>
                  <g className="blk blk-d">
                    <rect className="tl-card" x="252" y="90" width="210" height="52" rx="9" />
                    <g
                      className="screen-detail tl-stroke-secondary"
                      fill="none"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M266 126 L 300 110 L 334 118 L 368 98 L 402 104 L 448 88" />
                    </g>
                  </g>
                  <g className="blk blk-e">
                    <rect className="tl-card" x="252" y="154" width="100" height="48" rx="9" />
                    <g className="screen-detail">
                      <rect className="tl-muted" x="266" y="166" width="60" height="9" rx="4" opacity="0.5" />
                      <rect className="tl-primary" x="266" y="182" width="40" height="12" rx="4" />
                    </g>
                  </g>
                  <g className="blk blk-f">
                    <rect className="tl-card" x="362" y="154" width="100" height="48" rx="9" />
                    <g className="screen-detail">
                      <rect className="tl-muted" x="376" y="166" width="60" height="9" rx="4" opacity="0.5" />
                      <rect className="tl-secondary" x="376" y="182" width="52" height="12" rx="4" />
                    </g>
                  </g>
                </svg>
              </PlayOnceVis>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ COMPARE ============================ */}
      <section className="section compare" id="compare" aria-labelledby="compare-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Cardon vs the usual stack</span>
            <h2 id="compare-title">Not another subscription.</h2>
            <p className="section-sub">
              Most software rents you a seat and shapes your operation around
              itself; we build the system around how you already work, prove your
              numbers, and hand your team the keys.
            </p>
          </div>

          <div className="cmp">
            <div className="cmp-head" aria-hidden="true">
              <span />
              <span className="cmp-h cardon">Cardon</span>
              <span className="cmp-h usual">The usual stack</span>
            </div>

            <div className="cmp-row">
              <span className="cmp-dim">Ownership</span>
              <div className="cmp-cell cmp-cardon">
                <span className="cmp-tag">Cardon</span>
                <p>You own the system, keys and all.</p>
              </div>
              <div className="cmp-cell cmp-usual">
                <span className="cmp-tag">The usual stack</span>
                <p>You rent it forever.</p>
              </div>
            </div>

            <div className="cmp-row">
              <span className="cmp-dim">Fit</span>
              <div className="cmp-cell cmp-cardon">
                <span className="cmp-tag">Cardon</span>
                <p>Built around how your operation already works.</p>
              </div>
              <div className="cmp-cell cmp-usual">
                <span className="cmp-tag">The usual stack</span>
                <p>Your operation bent around the tool.</p>
              </div>
            </div>

            <div className="cmp-row">
              <span className="cmp-dim">Data</span>
              <div className="cmp-cell cmp-cardon">
                <span className="cmp-tag">Cardon</span>
                <p>One warehouse of your numbers, and it is yours.</p>
              </div>
              <div className="cmp-cell cmp-usual">
                <span className="cmp-tag">The usual stack</span>
                <p>Scattered across ten apps that do not talk.</p>
              </div>
            </div>

            <div className="cmp-row">
              <span className="cmp-dim">People</span>
              <div className="cmp-cell cmp-cardon">
                <span className="cmp-tag">Cardon</span>
                <p>Senior hands on five accounts, who know yours.</p>
              </div>
              <div className="cmp-cell cmp-usual">
                <span className="cmp-tag">The usual stack</span>
                <p>A ticket queue and a new name each time.</p>
              </div>
            </div>

            <div className="cmp-row">
              <span className="cmp-dim">Price shape</span>
              <div className="cmp-cell cmp-cardon">
                <span className="cmp-tag">Cardon</span>
                <p>A scoped build, a care retainer if you want it, ads paid on performance.</p>
              </div>
              <div className="cmp-cell cmp-usual">
                <span className="cmp-tag">The usual stack</span>
                <p>Per-seat fees, every month, forever.</p>
              </div>
            </div>

            <div className="cmp-row">
              <span className="cmp-dim">Intelligence</span>
              <div className="cmp-cell cmp-cardon">
                <span className="cmp-tag">Cardon</span>
                <p>An assistant trained on your own data.</p>
              </div>
              <div className="cmp-cell cmp-usual">
                <span className="cmp-tag">The usual stack</span>
                <p>Generic features built for everyone.</p>
              </div>
            </div>
          </div>

          <p className="cmp-foot">
            Want to see which side your current stack is on? The{" "}
            <a href="#diagnostic">free Growth Diagnostic</a> shows you.
          </p>
        </div>
      </section>

      {/* ============================ MAP OF SECTORS ============================ */}
      <section className="section sectors" id="sectors" aria-labelledby="sectors-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker gold">Industries</span>
            <h2 id="sectors-title">The terrains we know.</h2>
            <p className="section-sub">
              These are the domains we have built for and understand end to end.
              Every station on the map is part of the same terrain. The winery
              valley and the clinics are the terrain in focus; the other dashed
              site is terrain we are surveying next.
            </p>
          </div>

          <SectorMap />

          <p className="sectors-foot mono">
            Three stations built, two terrains ahead. In focus:{" "}
            <b>the winery valley and the clinics.</b>
          </p>
        </div>
      </section>

      {/* ============================ DIAGNOSTIC ============================ */}
      <section className="section diagnostic" id="diagnostic" aria-labelledby="diag-title">
        <div className="container">
          <div className="diag-inner">
            <div className="diag-lead">
              <span className="kicker clay">Start here</span>
              <h2 id="diag-title">The Growth Diagnostic</h2>
              <p className="diag-desc">
                Ten business days looking at your ads, your site, and your
                operations as one system. You get a written memo, not a sales deck,
                telling you what is true, what is broken, and what to build first.
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
                <span className="spec-dot" />
                <span>
                  <b>Day 1.</b> A working session on your ads, your site, and your
                  operations.
                </span>
              </div>
              <div className="spec">
                <span className="spec-dot" />
                <span>
                  <b>Days 2 to 9.</b> We dig: accounts, measurement, workflows, the
                  numbers behind the numbers.
                </span>
              </div>
              <div className="spec">
                <span className="spec-dot" />
                <span>
                  <b>Day 10.</b> The memo lands: what is true, what is broken, what
                  to build first.
                </span>
              </div>
              <div className="spec">
                <span className="spec-dot" />
                <span>
                  <b>Free, with no strings.</b> Act on it with us or without us. If
                  we build, pricing is agreed up front.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SpotlightFrames />
    </main>
  );
}
