import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import ClinicSchedule from "@/components/pages/clinics/ClinicSchedule";
import SpotlightFrames from "@/components/pages/clinics/SpotlightFrames";
import "./clinics.css";

export const metadata: Metadata = {
  title: "Clinic growth systems",
  description:
    "Bilingual patient acquisition with measurement checked first, one inquiry pipeline instead of scattered channels, and scheduling that quietly reduces no-shows for border clinics.",
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
            <p className="eyebrow">New terrain / Clinics</p>
            <h1>
              Patients from both sides of the border,
              <br />
              <span className="accent">one calm schedule.</span>
            </h1>

            <div className="survey-marker">
              <span className="survey-badge">
                <span className="dot" aria-hidden="true" />
                Surveying this terrain
              </span>
              <span className="survey-note">
                These are systems we <b>would</b> build for clinics, leaning on
                patterns proven in the domains we have already built for. Nothing
                here is a claim of clinics we have run.
              </span>
            </div>

            <p className="hero-sub">
              Dental, medical, and specialty clinics in Baja California take
              patients from two worlds at once: US patients crossing the border
              for care, and local patients from down the street. We would wire
              the ads, the inquiries, and the calendar into one system your front
              desk reads and runs in both languages.{" "}
              <b>Make the schedule true, then keep it full.</b>
            </p>
            <div className="hero-actions">
              <a className="cta" href="#diagnostic">
                Get the free Growth Diagnostic
              </a>
              <a className="btn-ghost" href="#build">
                See what we would build
              </a>
            </div>
            <p className="brandline">Built to hold water</p>
          </div>

          <ClinicSchedule />
          <SpotlightFrames />
        </div>
      </section>

      {/* ============================ WHAT WE WOULD BUILD ============================ */}
      <section className="section" id="build" aria-labelledby="build-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker oasis">What we would build here</span>
              <h2 id="build-title">
                Four systems, each borrowed from terrain we know.
              </h2>
              <p className="section-sub">
                We have not run a clinic. We have built the parts a clinic needs,
                in domains next door, and this is how they would come together
                here. <b>Proven patterns, pointed at a new terrain.</b>
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="build-grid">
              <article className="build-card">
                <span className="build-num">01 / Demand</span>
                <h3 className="build-h">
                  Bilingual patient acquisition, measured before it is optimized.
                </h3>
                <p className="build-p">
                  Google Ads run in English and Spanish for patients on both sides
                  of the border, with the measurement checked first so every later
                  decision rests on something true. Priced in proportion to
                  performance: a percent of ad spend, or a percent of the
                  treatment revenue the ads bring in.
                </p>
                <p className="build-borrow">
                  Borrowed from <b>our demand work</b>.
                </p>
              </article>

              <article className="build-card">
                <span className="build-num">02 / Intake</span>
                <h3 className="build-h">One inquiry pipeline, not four inboxes.</h3>
                <p className="build-p">
                  WhatsApp, phone calls, web forms, and DMs stop being four places
                  to miss a message and become one intake line the front desk
                  reads and answers from, in the patient&apos;s language, with
                  nothing slipping between channels.
                </p>
                <p className="build-borrow">
                  Borrowed from <b>the hiring pipeline</b>.
                </p>
              </article>

              <article className="build-card">
                <span className="build-num">03 / Scheduling</span>
                <h3 className="build-h">
                  Scheduling and reminders that run themselves.
                </h3>
                <p className="build-p">
                  Booking, confirmations, and reminder messages become workflows
                  that run on their own and quietly reduce no-shows, so the week
                  the front desk trusts stays full without anyone chasing it by
                  hand.
                </p>
                <p className="build-borrow">
                  A pattern we <b>generalize from operations work</b>.
                </p>
              </article>

              <article className="build-card">
                <span className="build-num">04 / Journey</span>
                <h3 className="build-h">
                  One patient journey, first inquiry to follow-up.
                </h3>
                <p className="build-p">
                  A single view that follows a patient from first inquiry to
                  treatment plan to follow-up, so nothing is lost between the
                  front desk, the operatory, and the callback, and the whole path
                  stays visible in one place.
                </p>
                <p className="build-borrow">
                  Borrowed from <b>berry-to-bottle traceability</b>.
                </p>
              </article>
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
              <span className="kicker gold">Why us for this terrain</span>
              <h2 id="why-title">
                The border and both languages are the job, not an add-on.
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
                  Clinics are terrain we are surveying next, and a free diagnostic
                  is exactly how a new engagement here starts. Ten business days
                  looking at how patients find you, how they reach you, and how
                  they land on your calendar, as one system. You get a written
                  memo, not a sales deck: what is true, what is leaking, and what
                  to build first.
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
                    book, and show up.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Days 2 to 9.</b> We map your channels, your measurement,
                    and your no-show pattern.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Day 10.</b> The memo lands: what is true, what is leaking,
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
    </main>
  );
}
