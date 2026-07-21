import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import PipelineStage from "@/components/pages/hiring/PipelineStage";
import SpotlightFrames from "@/components/pages/hiring/SpotlightFrames";
import "./hiring.css";

export const metadata: Metadata = {
  title: "Hiring and HR growth systems",
  description:
    "One applicant pipeline instead of inboxes and tabs, qualification stages the team can read, scheduling that runs itself, and bilingual candidate demand priced on performance.",
  alternates: { canonical: "/industries/hiring" },
};

export default function HiringPage() {
  return (
    <main id="main" className="pg-hiring">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label="Introduction">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">Industries / Hiring</p>
            <h1>
              Hiring that moves <span className="accent">like a system</span>, not a
              stack of tabs.
            </h1>
            <p className="hero-sub">
              Every applicant, both languages, in one lane you can read. We wire your
              job boards, careers inbox, and tracking spreadsheets into a single
              hiring pipeline your team runs and owns.{" "}
              <b>Decisions you can see, from first click to signed offer.</b>
            </p>
            <div className="hero-actions">
              <a
                className="cta"
                href="mailto:hello@cardondigital.com?subject=Growth%20Diagnostic"
              >
                Get the free Growth Diagnostic
              </a>
              <a className="btn-ghost" href="#build">
                See what we build
              </a>
            </div>
            <p className="brandline">Built to hold water</p>
          </div>

          <PipelineStage />
        </div>
      </section>

      {/* ============================ VALUE STRIP ============================ */}
      <section className="value" aria-label="What that is worth to a hiring team">
        <h2 className="sr-only">What it is worth to a hiring team</h2>
        <div className="container">
          <Reveal>
            <div className="value-grid">
              <div className="value-item">
                <span className="value-key">One source of truth</span>
                <p className="value-lead">
                  Every applicant in one lane,{" "}
                  <span className="cool">not ten open tabs.</span>
                </p>
                <p className="value-body">
                  The careers inbox, the job boards, and the spreadsheet become one
                  pipeline your team reads from.
                </p>
              </div>
              <div className="value-item">
                <span className="value-key">Legible to everyone</span>
                <p className="value-lead">
                  The stage anyone can read <span className="cool">at a glance.</span>
                </p>
                <p className="value-body">
                  Applied, screened, interviewed, offer. Where each candidate stands
                  is never a mystery or a status meeting.
                </p>
              </div>
              <div className="value-item">
                <span className="value-key">Both markets</span>
                <p className="value-lead">
                  Two languages, <span className="cool">one funnel.</span>
                </p>
                <p className="value-body">
                  English and Spanish, the US and Mexico, written natively and
                  measured before anyone optimizes.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ CAPABILITIES ============================ */}
      <section className="section" id="build" aria-labelledby="build-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">What we build</span>
              <h2 id="build-title">One pipeline for the whole hire.</h2>
              <p className="section-sub">
                Hiring is a domain we have built for. We put in place the pieces below
                for a team tired of tracking people across inboxes, sheets, and
                job-board tabs, then trained the business to run it and kept it
                theirs.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="cap-grid">
              <div className="cap-card">
                <div className="cap-top">
                  <span className="cap-idx">01</span>
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
                </div>
                <h3>One applicant pipeline</h3>
                <p className="cap-body">
                  Job boards, the careers inbox, and the tracking spreadsheet collapse
                  into a single lane every applicant travels, from first touch to
                  signed offer. No more hunting across tabs to answer where someone
                  stands.
                </p>
              </div>

              <div className="cap-card">
                <div className="cap-top">
                  <span className="cap-idx">02</span>
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
                </div>
                <h3>Stages the whole team reads</h3>
                <p className="cap-body">
                  Applied, screened, interviewed, offer. Anyone can open the board and
                  see where each candidate sits and what moves them forward, so hiring
                  stops depending on one person&apos;s memory.
                </p>
              </div>

              <div className="cap-card">
                <div className="cap-top">
                  <span className="cap-idx">03</span>
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
                </div>
                <h3>Interview scheduling that runs itself</h3>
                <p className="cap-body">
                  The back and forth of finding a time turns into a routine that runs
                  on its own. Coordinators stop chasing calendars, candidates stop
                  waiting, and the manual hours come back every month.
                </p>
              </div>

              <div className="cap-card">
                <div className="cap-top">
                  <span className="cap-idx">04</span>
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
                </div>
                <h3>Bilingual candidate demand</h3>
                <p className="cap-body">
                  We source in English and Spanish, across the US and Mexico, written
                  natively rather than translated after the fact. We confirm the
                  measurement is real before anyone optimizes, and the ad work is
                  priced in proportion to performance: a share of spend, or of the
                  results it drives.
                </p>
              </div>

              <div className="cap-card cap-wide">
                <div className="cap-top">
                  <span className="cap-idx">05</span>
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
                </div>
                <h3>Reporting the owner actually reads</h3>
                <p className="cap-body">
                  Not a dashboard nobody opens. The few readings that tell you where
                  the funnel leaks and which source is worth more, measured from your
                  own pipeline:
                </p>
                <div className="cap-chips">
                  <span className="cap-chip">Time to hire</span>
                  <span className="cap-chip">Stage drop-off</span>
                  <span className="cap-chip">Source quality</span>
                </div>
                <p className="cap-foot">
                  Concepts you can act on, drawn from your own pipeline, never numbers
                  we invented.
                </p>
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
                  Ten business days looking at how you hire, from where candidates
                  come from to how offers get made, as one system. You get a written
                  memo, not a sales deck, telling you what is true, what is broken,
                  and what to build first.
                </p>
                <div className="diag-actions">
                  <a
                    className="cta cta-lg"
                    href="mailto:hello@cardondigital.com?subject=Growth%20Diagnostic"
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
                    <b>Day 1.</b> A working session on your roles, your sources, and
                    how applicants move today.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Days 2 to 9.</b> We dig: sources, pipeline, screening,
                    scheduling, the numbers behind the numbers.
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
          </Reveal>
        </div>
      </section>

      <SpotlightFrames />
    </main>
  );
}
