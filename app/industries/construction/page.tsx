import type { Metadata } from "next";
import SitePlanVisual from "@/components/pages/construction/SitePlanVisual";
import SpotlightFrames from "@/components/pages/construction/SpotlightFrames";
import "./construction.css";

export const metadata: Metadata = {
  title: "Construction growth systems",
  description:
    "Work orders, crews, materials, and sites on one scheduled board, built for construction companies, with qualified lead generation priced on performance.",
  alternates: { canonical: "/industries/construction" },
};

export default function ConstructionPage() {
  return (
    <main id="main" className="pg-construction">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">Industries / Construction</p>
            <h1 id="hero-title">
              Every crew, every material, every site.
              <br />
              <span className="accent">One board.</span>
            </h1>
            <p className="hero-sub">
              We built the operations and logistics system for a construction
              company, so we know how a build actually runs: work orders, crews,
              materials, and site progress that live in calls, texts, and paper,
              wired into one scheduled board the office and the field both read
              from. <b>Scattered orders become a sequence you can trust.</b>{" "}
              <span className="dry">
                Yes, a construction company named Logistics. The name set a high
                bar.
              </span>
            </p>
            <div className="hero-actions">
              <a
                className="cta"
                href="mailto:daniel@cardondigital.com?subject=Growth%20Diagnostic"
              >
                Get the free Growth Diagnostic
              </a>
              <a className="btn-ghost" href="#capabilities">
                See what we build
              </a>
            </div>
            <p className="brandline">Built to hold water</p>
          </div>

          <div className="stage-wrap">
            <SitePlanVisual />
            <SpotlightFrames />
          </div>
        </div>
      </section>

      {/* ============================ VALUE STRIP ============================ */}
      <section
        className="value"
        aria-label="What this is worth to a construction company"
      >
        <h2 className="sr-only">What this is worth to you</h2>
        <div className="container value-grid">
          <div className="value-item">
            <span className="value-key">A domain we built for</span>
            <p className="value-lead">
              We built the operations system{" "}
              <span className="cool">a construction company runs on.</span>
            </p>
            <p className="value-body">
              Not a pitch about an industry we might learn. We already know how a
              build coordinates, from the first work order to the final
              inspection.
            </p>
          </div>
          <div className="value-item">
            <span className="value-key">Office and field, one board</span>
            <p className="value-lead">
              The same live schedule{" "}
              <span className="cool">the crew updates and the office reads.</span>
            </p>
            <p className="value-body">
              No relay of phone calls to find out where a site stands. One source
              of truth everyone works from.
            </p>
          </div>
          <div className="value-item">
            <span className="value-key">Yours to own</span>
            <p className="value-lead">
              Trained into your team, <span className="cool">and yours to keep.</span>
            </p>
            <p className="value-body">
              Built around how you already run, handed over to your people, with
              no per-seat subscription to babysit.
            </p>
          </div>
        </div>
      </section>

      {/* ============================ CAPABILITIES ============================ */}
      <section className="section" id="capabilities" aria-labelledby="cap-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">What we build</span>
            <h2 id="cap-title">Built for how a build actually runs.</h2>
            <p className="section-sub">
              Not a generic CRM bent into the shape of a job site. These are the
              operations a construction company lives on, wired into one connected
              system your team owns.
            </p>
          </div>

          <div className="cap-grid">
            <article className="cap-card">
              <div className="cap-top">
                <span className="cap-glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect className="g-stroke" x="4" y="3" width="16" height="18" rx="2" />
                    <path className="g-stroke" d="M8 8h8M8 12h8M8 16h5" />
                    <circle className="g-fill" cx="18.5" cy="16.5" r="1.6" />
                  </svg>
                </span>
                <span className="cap-idx">01 / Job flow</span>
              </div>
              <h3 className="cap-title">Work orders and job flow</h3>
              <p className="cap-body">
                Scattered orders, calls, and messages become one scheduled board.
                Every job carries an owner, a date, and a status the whole company
                can see, so nothing lives only in someone&apos;s head or a lost
                text thread.
              </p>
            </article>

            <article className="cap-card">
              <div className="cap-top">
                <span className="cap-glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect className="g-stroke" x="3" y="5" width="18" height="15" rx="2" />
                    <path className="g-stroke" d="M3 9h18M8 3v4M16 3v4" />
                    <path className="g-gold" d="M9 14l2 2 4-4" />
                  </svg>
                </span>
                <span className="cap-idx">02 / Scheduling</span>
              </div>
              <h3 className="cap-title">Crew and materials scheduling</h3>
              <p className="cap-body">
                Assign crews and materials against real availability. The board
                shows the double-booking or the missing delivery before it costs
                you a day on site, not after the crew is already standing around.
              </p>
            </article>

            <article className="cap-card">
              <div className="cap-top">
                <span className="cap-glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      className="g-stroke"
                      d="M12 21c4-4 6-7 6-10a6 6 0 1 0-12 0c0 3 2 6 6 10z"
                    />
                    <circle className="g-fill" cx="12" cy="11" r="2.2" />
                  </svg>
                </span>
                <span className="cap-idx">03 / Visibility</span>
              </div>
              <h3 className="cap-title">Site and progress tracking</h3>
              <p className="cap-body">
                The office reads where every site stands without calling the field.
                Daily progress, blockers, and photos land in one place, so a status
                update is a glance, not an interruption to someone&apos;s afternoon.
              </p>
            </article>

            <article className="cap-card">
              <div className="cap-top">
                <span className="cap-glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path className="g-stroke" d="M20 12a8 8 0 1 1-2.3-5.6" />
                    <path className="g-gold" d="M20 4v4h-4" />
                    <circle className="g-fill" cx="12" cy="12" r="1.9" />
                  </svg>
                </span>
                <span className="cap-idx">04 / Procurement</span>
              </div>
              <h3 className="cap-title">Procurement and quoting</h3>
              <p className="cap-body">
                The routine parts of buying and quoting run themselves: request to
                purchase order, quote to job, reminders and follow-ups that no
                longer wait on someone remembering. Manual routines turned into work
                that runs itself, with hours back every month.
              </p>
            </article>

            <article className="cap-card">
              <div className="cap-top">
                <span className="cap-glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path className="g-stroke" d="M4 16a8 8 0 0 1 16 0" />
                    <path className="g-stroke" d="M7.5 16a4.5 4.5 0 0 1 9 0" />
                    <circle className="g-fill" cx="12" cy="16" r="2" />
                    <path className="g-gold" d="M12 16l3.5-9" />
                  </svg>
                </span>
                <span className="cap-idx">05 / Demand</span>
              </div>
              <h3 className="cap-title">Demand that measures first</h3>
              <p className="cap-body">
                Qualified leads for the work you actually want more of. We run the
                ads with the rigor of the most sophisticated agencies, and we check
                that the numbers coming in are real before anyone optimizes, so
                every decision after that rests on something true.
              </p>
              <p className="cap-note">
                Pricing:{" "}
                <b>a share of ad spend with a floor, or of the sales the ads bring
                in once measurement you trust is in place.</b> We get paid when it
                works.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============================ DIAGNOSTIC ============================ */}
      <section
        className="section diagnostic"
        id="diagnostic"
        aria-labelledby="diag-title"
      >
        <div className="container">
          <div className="diag-inner">
            <div className="diag-lead">
              <span className="kicker clay">Start here</span>
              <h2 id="diag-title">The Growth Diagnostic</h2>
              <p className="diag-desc">
                Ten business days looking at your operations, your site, and your
                demand as one system. You get a written memo, not a sales deck,
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
                  <b>Day 1.</b> A working session on your operations, your site
                  work, and your demand.
                </span>
              </div>
              <div className="spec">
                <span className="spec-dot" />
                <span>
                  <b>Days 2 to 9.</b> We dig: work orders, scheduling, site
                  reporting, procurement, and the numbers behind your leads.
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
    </main>
  );
}
