import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import ClinicSchedule from "@/components/pages/clinics/ClinicSchedule";
import SpotlightFrames from "@/components/pages/clinics/SpotlightFrames";
import "./clinics.css";

export const metadata: Metadata = {
  title: "Clinic growth systems",
  description:
    "A growth system for clinics: one bilingual intake pipeline, reminders that cut no-shows, and click-to-procedure measurement built first, so you defend your share of patient flow and recapture the rest.",
  alternates: { canonical: "/industries/clinics" },
};

export default function ClinicsPage() {
  return (
    <main id="main" className="pg-clinics">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label="Introduction">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">Industries / Clinics</p>
            <h1>
              Patient flow is down.
              <br />
              <span className="accent">Defend your share, and recapture it.</span>
            </h1>

            <p className="hero-sub">
              Dental, medical, and specialty clinics take patients from two
              worlds at once: patients traveling for care, and locals from down
              the street. We wire the ads, the inquiries, and the calendar into
              one system your front desk reads and runs in both languages, so you
              keep the patients you already earn and take back the ones you are
              paying to lose. <b>Measure the leak, then close it.</b>
            </p>
            <div className="hero-actions">
              <a className="cta" href="#diagnostic">
                Get the free Growth Diagnostic
              </a>
              <a className="btn-ghost" href="#problems">
                See the problems we solve
              </a>
            </div>
            <p className="brandline">Built to hold water</p>
          </div>

          <ClinicSchedule />
          <SpotlightFrames />
        </div>
      </section>

      {/* ============================ THE PROBLEMS ============================ */}
      <section className="section" id="problems" aria-labelledby="problems-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker oasis">The problems</span>
              <h2 id="problems-title">The problems we solve.</h2>
              <p className="section-sub">
                In plain language. <b>The problems you already live with are the
                ones we are built to solve.</b>
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="prob-list">
              <article className="prob-item">
                <span className="prob-rank">01</span>
                <div className="prob-body">
                  <h3 className="prob-h">Inquiries scattered, replies too slow.</h3>
                  <p className="prob-p">
                    Patients reach out on WhatsApp, web forms, and phone calls,
                    and the messages land in three different places with no single
                    line to work from. Speed is the whole game. An inquiry
                    answered within a minute converts around{" "}
                    <b>seven times better</b> than one answered an hour later, and
                    the gap between a typical inquiry-to-booking rate and an
                    optimized one is patients you already paid to reach, lost to a
                    slow reply.
                  </p>
                  <div className="prob-stats">
                    <span className="prob-stat">
                      <b>~7x</b>
                      <span>reply in a minute vs an hour</span>
                    </span>
                    <span className="prob-stat">
                      <b>~3% to 5-15%</b>
                      <span>inquiry to booking, typical vs optimized</span>
                    </span>
                  </div>
                </div>
              </article>

              <article className="prob-item">
                <span className="prob-rank">02</span>
                <div className="prob-body">
                  <h3 className="prob-h">No-shows, amplified by distance.</h3>
                  <p className="prob-p">
                    A booked appointment is not a kept one. Travel time and
                    border waits can turn a short visit into most of a day, and
                    a thin reminder cadence lets confirmed patients quietly fall
                    off the calendar. Every no-show is a slot that earns nothing
                    and a patient who may not rebook.
                  </p>
                </div>
              </article>

              <article className="prob-item">
                <span className="prob-rank">03</span>
                <div className="prob-body">
                  <h3 className="prob-h">Trust, at a distance.</h3>
                  <p className="prob-p">
                    A patient is committing thousands of dollars and a long trip
                    to a clinic they found online, sight unseen. That leap is the
                    hardest part of the sale, and it is why so many patients hand
                    it to a middleman who vouches for the clinic on their behalf.
                  </p>
                </div>
              </article>

              <article className="prob-item">
                <span className="prob-rank">04</span>
                <div className="prob-body">
                  <h3 className="prob-h">The middleman toll.</h3>
                  <p className="prob-p">
                    If patients reach you through platforms and facilitators, a
                    cut of every case leaves with them, paid for demand you could
                    be reaching directly. What the middleman is really selling is
                    trust and reach. <b>Both can be built, and owned by you.</b>
                  </p>
                </div>
              </article>

              <article className="prob-item">
                <span className="prob-rank">05</span>
                <div className="prob-body">
                  <h3 className="prob-h">Advertising you are allowed to run.</h3>
                  <p className="prob-p">
                    Medical advertising is genuinely constrained. COFEPRIS
                    regulates every medical ad in Mexico, down to organic social
                    posts, and Google gates healthcare advertising on its own
                    terms. Campaigns that ignore either regime get pulled or
                    fined, campaigns built for both keep running. Here, compliance
                    is not fine print, it is whether the ads run at all.
                  </p>
                </div>
              </article>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ============================ WHAT WE BUILD ============================ */}
      <section className="section" id="build" aria-labelledby="build-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker oasis">What we build</span>
              <h2 id="build-title">One system, mapped to each problem.</h2>
              <p className="section-sub">
                Five systems, one job: a week your front desk trusts. Each one is
                aimed at a problem above, and together they read as{" "}
                <b>one system your team ends up owning.</b>
              </p>
            </div>
          </Reveal>

          <Reveal>
            <article className="build-feature">
              <span className="build-tag">
                <span className="dot" aria-hidden="true" />
                Build first / Flagship
              </span>
              <h3 className="build-h">
                The measurement spine: know which inquiry became which patient.
              </h3>
              <p className="build-p">
                Click-to-WhatsApp source tracking, a lightweight CRM, and a
                booking log that ties an inquiry all the way to a completed
                procedure. It is the first thing we build, because it is what
                makes every later decision measurable: which channel earns
                patients, what a real conversion rate is, and how much of the
                middleman toll you took back. Nothing else is priced on
                performance until this exists and both sides trust the numbers it
                produces.
              </p>
              <p className="build-borrow">
                Answers problem 04, and the blind spot under every other{" "}
                <b>number on this page</b>.
              </p>
            </article>
          </Reveal>

          <Reveal>
            <div className="build-grid">
              <article className="build-card">
                <span className="build-num">01 / Intake</span>
                <h3 className="build-h">One intake pipeline, one bilingual concierge.</h3>
                <p className="build-p">
                  Every channel, WhatsApp, form, call, and DM, lands in one place,
                  worked by a named bilingual concierge flow that replies in
                  minutes, in the patient&apos;s own language. No inquiry sits
                  unread, no message falls between inboxes.
                </p>
                <p className="build-borrow">
                  Answers <b>problem 01 / scattered inquiries, slow replies</b>.
                </p>
              </article>

              <article className="build-card">
                <span className="build-num">02 / Calendar</span>
                <h3 className="build-h">
                  Reminders and confirmations that hold the week.
                </h3>
                <p className="build-p">
                  Booking, confirmation, and reminder messages become workflows
                  that run on their own and quietly cut no-shows, so the week your
                  front desk trusts stays full without anyone chasing it by hand.
                </p>
                <p className="build-borrow">
                  Answers <b>problem 02 / no-shows</b>.
                </p>
              </article>

              <article className="build-card">
                <span className="build-num">03 / Trust</span>
                <h3 className="build-h">Trust infrastructure, owned by you.</h3>
                <p className="build-p">
                  Verified reviews, transparent pricing pages, clear written
                  patient policies, and real social proof, the credibility a
                  patient at a distance needs before they commit. This is buying back what the
                  middleman was really selling, and keeping it.
                </p>
                <p className="build-borrow">
                  Answers <b>problem 03 / trust at a distance</b>.
                </p>
              </article>

              <article className="build-card">
                <span className="build-num">04 / Compliance</span>
                <h3 className="build-h">Compliant campaigns that keep running.</h3>
                <p className="build-p">
                  Google and Meta campaigns designed against COFEPRIS rules and
                  the platforms&apos; healthcare policies from the first draft, at
                  the cutting edge of what the platforms allow. Campaigns designed
                  to keep running.
                </p>
                <p className="build-borrow">
                  Answers <b>problem 05 / compliant advertising</b>.
                </p>
              </article>
            </div>
          </Reveal>

          <Reveal>
            <div className="scope-note">
              <span className="scope-label">One line on scope</span>
              This offer is the marketing and funnel surface: ads, inquiries,
              tracking, reminders, and trust. Clinical records stay{" "}
              <b>out of scope by design</b>, and any access to inquiry or booking
              information is minimized and governed by a written data agreement
              before work begins.
            </div>
          </Reveal>

          <Reveal>
            <div className="pricing-note">
              <span className="pricing-label">How we price</span>
              <p className="pricing-body">
                Advertising is priced as a <b>percent of ad spend, with a
                floor</b>, never as a percent of your patient revenue. Builds are
                scoped and priced after the diagnostic, agreed up front. Most
                clinics then keep a care retainer for corrections and refinements
                as the team settles in; pause it anytime, the system keeps
                working. Clean numbers, no stake in your procedures.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ WHY US ============================ */}
      <section className="why" id="why" aria-labelledby="why-title">
        <div className="container">
          <Reveal>
            <div
              className="section-head"
              style={{ marginBottom: "clamp(22px,3vw,34px)" }}
            >
              <span className="kicker gold">Why us</span>
              <h2 id="why-title">
                Two markets and two languages are the job, not an add-on.
              </h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="why-grid">
              <div className="why-item">
                <span className="why-key">Bilingual by default</span>
                <p className="why-lead">
                  Two languages, <span className="cool">both written natively.</span>
                </p>
                <p className="why-body">
                  English and Spanish from the first ad to the last reminder, not
                  translated after the fact. The patient reads their own language
                  the whole way.
                </p>
              </div>
              <div className="why-item">
                <span className="why-key">Both sides of the border</span>
                <p className="why-lead">
                  Built in Baja California,{" "}
                  <span className="cool">fluent in both markets.</span>
                </p>
                <p className="why-body">
                  US patients crossing for care and local patients booking down
                  the street are one schedule, handled by people who work both
                  sides of the line every day.
                </p>
              </div>
              <div className="why-item">
                <span className="why-key">Owned by your team</span>
                <p className="why-lead">
                  Systems your own{" "}
                  <span className="cool">front desk ends up owning.</span>
                </p>
                <p className="why-body">
                  We build it, train it into the clinic, and hand over the keys.
                  No per-seat software to babysit, no dependence on us to keep the
                  week running.
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
                  Ten business days instrumenting your actual inquiry pipeline:
                  response times, where inquiries leak between channels, real
                  conversion, and your no-show rate. You get a written memo with
                  hard numbers, not a sales deck: what is true, what is leaking,
                  and what to build first. Measure the leak, then decide.
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
                    <b>Day 1.</b> A working session on how patients find you,
                    reach you, and land on your calendar.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Days 2 to 9.</b> We instrument the pipeline: response
                    times, channel leakage, conversion, and no-shows, measured on
                    de-identified numbers from your real flow.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Day 10.</b> The memo lands: hard numbers on what is true,
                    what is leaking, and what to build first.
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
    </main>
  );
}
