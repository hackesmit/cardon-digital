import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import VineField from "@/components/pages/winery/VineField";
import SpotlightFrames from "@/components/pages/winery/SpotlightFrames";
import "./winery.css";

export const metadata: Metadata = {
  title: "Winery growth systems",
  description:
    "Live harvest and production intelligence, vineyard section maps, readiness prediction, and berry-to-bottle traceability for wineries, plus bilingual demand priced on performance.",
  alternates: { canonical: "/industries/winery" },
};

export default function WineryPage() {
  return (
    <main id="main" className="pg-winery">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label="Winery introduction">
        <div className="container">
          <Reveal>
            <div className="hero-copy">
              <p className="eyebrow">Industries / Winery</p>
              <h1>
                Your harvest, live.
                <br />
                <span className="accent">Your wine, traceable.</span>
              </h1>
              <p className="hero-sub">
                Weights, samples, tank moves, ad spend, and the books usually
                live in separate places, half of them in notebooks. We wire them
                into one system your winery reads from and ends up owning, so
                every row reports and one place reads.{" "}
                <b>From the vine to the bottle, one connected view.</b>
              </p>
              <div className="hero-actions">
                <a className="cta" href="#diagnostic">
                  Get the free Growth Diagnostic
                </a>
                <Link className="btn-ghost" href="/work/monte-xanic">
                  Read the case study
                </Link>
              </div>
              <p className="brandline">Built to hold water</p>
            </div>
          </Reveal>

          <div className="stage-wrap">
            <VineField />
          </div>
        </div>
      </section>

      {/* ============================ CAPABILITIES ============================ */}
      <section className="section" id="services" aria-labelledby="cap-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">What we build</span>
              <h2 id="cap-title">What we build for wineries and growers.</h2>
              <p className="section-sub">
                One connected system for the season and the business behind it.
                Each piece stands on its own, and together they become the single
                view your team runs from, in English and Spanish, on both sides of
                the border.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="cap-grid">
              <article className="cap-card spot">
                <div className="cap-top">
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
                    <rect x="5" y="6" width="24" height="18" rx="3" />
                    <line x1="10" y1="19" x2="10" y2="15" />
                    <line x1="15" y1="19" x2="15" y2="12" />
                    <line x1="20" y1="19" x2="20" y2="9" />
                    <line x1="25" y1="19" x2="25" y2="14" />
                    <line x1="12" y1="29" x2="22" y2="29" />
                  </svg>
                  <span className="cap-num">01 / Intelligence</span>
                </div>
                <h3>One live view of harvest and production.</h3>
                <p className="cap-body">
                  Weights, samples, tank moves, and cellar notes stop living in
                  scattered files and notebooks. We wire them into one view that
                  updates itself, so the season reads at a glance instead of being
                  rebuilt from memory after the fact.
                </p>
                <p className="cap-note">
                  <b>One source of truth,</b> live all season.
                </p>
              </article>

              <article className="cap-card spot accent-gold">
                <div className="cap-top">
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
                  <span className="cap-num">02 / Place</span>
                </div>
                <h3>Every number gets a place on the map.</h3>
                <p className="cap-body">
                  Readings tie back to the block and the row they came from, so a
                  figure is never just a figure floating in a spreadsheet. You see
                  where it happened, and the map becomes how the whole team reads
                  the vineyard the same way.
                </p>
                <p className="cap-note">
                  <b>Every reading,</b> tied to its ground.
                </p>
              </article>

              <article className="cap-card spot">
                <div className="cap-top">
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
                  <span className="cap-num">03 / Timing</span>
                </div>
                <h3>Readiness, tuned to your standard.</h3>
                <p className="cap-body">
                  We build the call for when a block is ready around your own
                  quality bar, not a generic curve. The system learns the pattern
                  your winemaker already trusts and puts it in front of the whole
                  team early, so the pick is planned, not chased.
                </p>
                <p className="cap-note">
                  <b>Anticipated,</b> not guessed.
                </p>
              </article>

              <article className="cap-card spot accent-wine">
                <div className="cap-top">
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
                  <span className="cap-num">04 / Traceability</span>
                </div>
                <h3>Berry to bottle, one thread.</h3>
                <p className="cap-body">
                  Every lot carries its history: which rows, which pick, which
                  tank, which barrel. When a question comes back from a distributor
                  or an auditor, the answer is one lookup instead of a week lost in
                  the archive.
                </p>
                <p className="cap-note">
                  <b>One thread</b> from the vine to the label.
                </p>
              </article>

              <article className="cap-card spot">
                <div className="cap-top">
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
                  <span className="cap-num">05 / Operations</span>
                </div>
                <h3>The manual routines run themselves.</h3>
                <p className="cap-body">
                  The weekly jobs your team does by hand, reconciling, reporting,
                  and moving numbers between systems, get built to run on their
                  own. You get hours back every month, and those hours compound
                  into real capacity.
                </p>
                <p className="cap-note">
                  <b>Manual routines,</b> turned into work that runs itself.
                </p>
              </article>

              <article className="cap-card spot accent-gold">
                <div className="cap-top">
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
                  <span className="cap-num">06 / Demand</span>
                </div>
                <h3>Fill the tasting room, the club, and DTC.</h3>
                <p className="cap-body">
                  Bilingual ads for your tasting room, your wine club, and direct
                  to consumer, run with the rigor of the most sophisticated
                  agencies. The Valle's visitor flow dipped in 2025, so the
                  wineries that keep their share are the ones whose follow-up and
                  measurement work. Priced in proportion to performance: a share
                  of spend with a floor, or, once measurement you trust is in
                  place, a share of the sales the ads bring in.
                </p>
                <p className="cap-note">
                  <b>We get paid</b> when it works.
                </p>
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
              <span className="kicker wine">The gap</span>
              <h2 id="leak-title">What is actually leaking.</h2>
              <p className="section-sub">
                Owner-run wineries rarely lose on the wine. They lose in the
                seams between the systems, where revenue goes uncounted and
                unfollowed.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <ol className="leak-grid">
              <li className="leak-item spot">
                <span className="leak-num">01 / Production truth</span>
                <h3>The season lives in three places at once.</h3>
                <p>
                  Weights, samples, and tank moves sit in a legacy system, a
                  stack of spreadsheets, and a cellar notebook, and none of them
                  agree. <b>This is the exact knot we untied at Monte Xanic:</b>{" "}
                  one live view instead of three versions of the same harvest.
                </p>
              </li>

              <li className="leak-item spot">
                <span className="leak-num">02 / Follow-up</span>
                <h3>The visit is the last the guest hears from you.</h3>
                <p>
                  Over 90 percent of club signups happen in person, in the
                  tasting room, and follow-up within about 48 hours converts
                  best. Personal, timely offers lift order sizes by as much as
                  half. <b>Most small wineries follow up late, or never.</b>
                </p>
              </li>

              <li className="leak-item spot">
                <span className="leak-num">03 / Rented fragments</span>
                <h3>Four subscriptions that never talk.</h3>
                <p>
                  Production tools, a club platform, and a commerce plugin each
                  bill every month and still do not speak to each other.{" "}
                  <b>Nobody holds production, DTC, and finance in one view,</b> so
                  the numbers get reconciled by hand, or not at all.
                </p>
              </li>

              <li className="leak-item spot">
                <span className="leak-num">04 / The real bottleneck</span>
                <h3>Demand is not the problem.</h3>
                <p>
                  The smallest wineries are the ones growing direct sales while
                  big-winery DTC shrinks. <b>Demand is not the bottleneck.</b> The
                  gap between the tasting room and a system that follows the guest
                  home is, and it is one you can close.
                </p>
              </li>
            </ol>
            <p className="leak-foot">
              Your own numbers come out of the diagnostic.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================ PROOF / CASE STUDY ============================ */}
      <section className="section proof" id="proof" aria-labelledby="proof-title">
        <div className="container">
          <Reveal>
            <div className="proof-card spot">
              <div className="proof-lead">
                <span className="kicker wine">Case study</span>
                <h2 id="proof-title">Proof, not a promise.</h2>
                <p className="proof-desc">
                  Monte Xanic, a winery in the Valle de Guadalupe, runs its
                  harvest and its finances on a system we built and its own team
                  now owns.{" "}
                  <b>
                    The full story, what we changed and what it does now, lives on
                    the case study page.
                  </b>{" "}
                  This page is the shape of the offer; that page is the receipt.
                </p>
                <div className="proof-actions">
                  <Link className="btn-proof" href="/work/monte-xanic">
                    Read the Monte Xanic case study
                  </Link>
                </div>
                <p className="proof-meta">
                  One winery, one connected view, run by the people who grow the
                  wine.
                </p>
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
                  <span className="seal-sub">Valle de Guadalupe</span>
                </div>
              </div>
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
                <span className="kicker clay">Start here</span>
                <h2 id="diag-title">The Growth Diagnostic</h2>
                <p className="diag-desc">
                  Ten business days looking at your harvest data, your ads, and
                  your operations as one system. You get a written memo, not a
                  sales deck, telling you what is true, what is broken, and what to
                  build first.
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
                    <b>Day 1.</b> A working session on your vineyard, your cellar,
                    your ads, and your books.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Days 2 to 9.</b> We dig: the data, the measurement, the
                    manual routines, the numbers behind the numbers.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Day 10.</b> The memo lands: what is true, what is broken,
                    what to build first.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
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
