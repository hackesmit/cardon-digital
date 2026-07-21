import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import FloorPlan from "@/components/pages/restaurants/FloorPlan";
import SpotlightFrames from "@/components/pages/restaurants/SpotlightFrames";
import "./restaurants.css";

export const metadata: Metadata = {
  title: "Restaurant and hospitality growth systems",
  description:
    "A live view of covers, costing tied to what actually sells, staffing matched to demand, and bilingual wine-country and border hospitality marketing priced on performance.",
  alternates: { canonical: "/industries/restaurants" },
};

export default function RestaurantsPage() {
  return (
    <main id="main" className="pg-restaurants">
      <span id="top" />
      <SpotlightFrames />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label="Introduction">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">New terrain / Restaurants and hospitality</p>
            <h1>
              The dinner rush,{" "}
              <span className="accent">readable before it arrives.</span>
            </h1>

            <div className="honest-note">
              <span className="honest-pill mono">Surveying this terrain</span>
              <span className="honest-line">
                We have not run a restaurant yet. This is the system we{" "}
                <b>would</b> build here, drawn from patterns already proven in the
                domains we have built for.
              </span>
            </div>

            <p className="hero-sub">
              A full room is not a surprise. It is a pattern that shows up in the
              reservations, the covers, and the pace of a service well before the
              kitchen feels it. We would wire your floor, your menu, and your team
              into one live view, so the rush is something your staff can see
              coming, not something that lands on them.{" "}
              <b>Read the evening while there is still time to shape it.</b>
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

          <div className="stage-wrap">
            <FloorPlan />
          </div>
        </div>
      </section>

      {/* ============================ WHAT WE WOULD BUILD ============================ */}
      <section className="section" id="build" aria-labelledby="build-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker terra">What we would build</span>
              <h2 id="build-title">
                Five systems, each one already proven somewhere else.
              </h2>
              <p className="section-sub">
                We would not learn hospitality on your floor. Every piece below
                leans on a pattern we already run in a domain we have built for,
                adapted to a dining room. <b>Same rigor, new terrain.</b>
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="build-grid">
              <div className="build-card">
                <span className="build-index mono">01</span>
                <h3>
                  Covers and reservations, live, not reconstructed at midnight.
                </h3>
                <p className="build-body">
                  One view of the night as it happens: who is booked, who is
                  seated, how the room is filling, and where the pace is heading.
                  The floor reads the same numbers the office does, all through
                  service, instead of piecing the evening back together after
                  close.
                </p>
                <p className="build-borrow">
                  Borrowed from <b>live harvest intelligence</b>, the winery view
                  that stays true all season.
                </p>
              </div>

              <div className="build-card">
                <span className="build-index mono">02</span>
                <h3>Menu and plate costing tied to what actually sells.</h3>
                <p className="build-body">
                  Every plate carries its real cost and its real movement, so the
                  menu is priced and shaped around what the room orders, not around
                  a spreadsheet built once and left alone. The dishes that carry
                  the night get seen, and so do the ones quietly costing you.
                </p>
                <p className="build-borrow">
                  Borrowed from <b>berry-to-bottle traceability</b>, cost and yield
                  followed from source to sale.
                </p>
              </div>

              <div className="build-card">
                <span className="build-index mono">03</span>
                <h3>Staffing rhythms matched to demand instead of habit.</h3>
                <p className="build-body">
                  Cover a Tuesday like a Tuesday and a wine-country Saturday like a
                  Saturday. We would build the roster around the shape of demand
                  the reservations and history already show, so the floor is
                  staffed for the night that is actually coming.
                </p>
                <p className="build-borrow">
                  Borrowed from <b>crew scheduling</b>, field teams matched to the
                  work in front of them.
                </p>
              </div>

              <div className="build-card">
                <span className="build-index mono">04</span>
                <h3>Bilingual demand for wine country and the border.</h3>
                <p className="build-body">
                  Guests from both sides of the line, in English and Spanish,
                  written natively rather than translated after the fact. The ads
                  that fill your tables are priced in proportion to performance: a
                  share of spend, or of the sales the ads bring in. We get paid
                  when the room fills.
                </p>
                <p className="build-borrow">
                  Borrowed from <b>bilingual growth systems</b> run for both
                  markets at once.
                </p>
              </div>

              <div className="build-card">
                <span className="build-index mono">05</span>
                <h3>Reviews and reputation, with the measurement checked first.</h3>
                <p className="build-body">
                  Before anyone optimizes a rating or a response, we make sure the
                  signal is real: which reviews map to which nights, which channels
                  drive which guests. Reputation gets managed on numbers you can
                  trust, the way we check demand is true before we tune it.
                </p>
                <p className="build-borrow">
                  Borrowed from <b>measurement before optimization</b>, our first
                  move in every build.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ WHY US FOR THIS TERRAIN ============================ */}
      <section className="section why" id="why" aria-labelledby="why-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">Why us for this terrain</span>
              <h2 id="why-title">
                New to restaurants. Not new to this ground.
              </h2>
              <p className="section-sub">
                Hospitality is a new terrain for us, but the room it lives in is
                one we already work in every day.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="why-grid">
              <div className="why-item">
                <span className="why-key">Owner-run</span>
                <p className="why-lead">
                  We build for the people{" "}
                  <span className="warm">who own the place.</span>
                </p>
                <p className="why-body">
                  Owner-run businesses are the whole of what we do. A dining room
                  run by the family that opened it is exactly the kind of client we
                  build for.
                </p>
              </div>
              <div className="why-item">
                <span className="why-key">Both languages</span>
                <p className="why-lead">
                  English and Spanish,{" "}
                  <span className="warm">both written natively.</span>
                </p>
                <p className="why-body">
                  Not translated after the fact. The way you would talk to a table
                  from San Diego and a table from Tijuana on the same night.
                </p>
              </div>
              <div className="why-item">
                <span className="why-key">Baja based</span>
                <p className="why-lead">
                  Built in Baja California,{" "}
                  <span className="warm">working both sides of the border.</span>
                </p>
                <p className="why-body">
                  We are on the ground here, in the same markets your guests come
                  from, on both sides of the line.
                </p>
              </div>
              <div className="why-item">
                <span className="why-key">Wine-country neighbors</span>
                <p className="why-lead">
                  We already serve the{" "}
                  <span className="warm">Valle de Guadalupe.</span>
                </p>
                <p className="why-body">
                  The wineries next door to your tables are domains we have built
                  for. Their tasting-room traffic and yours are the same season.
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
                  A new terrain starts the same way every engagement does: with a
                  free diagnostic.{" "}
                  <b>
                    Ten business days looking at your ads, your site, and how your
                    floor actually runs, as one system.
                  </b>{" "}
                  You get a written memo, not a sales deck, telling you what is
                  true, what is broken, and what would be worth building first.
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
                    <b>Day 1.</b> A working session on your room, your bookings,
                    your ads, and your numbers.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Days 2 to 9.</b> We dig: reservations, covers, menu costs,
                    staffing, measurement, the numbers behind the numbers.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Day 10.</b> The memo lands: what is true, what is broken,
                    what to build first for this room.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot" />
                  <span>
                    <b>Free, with no strings.</b> Act on it with us or without us.
                    If we build, pricing is agreed up front, and ad work is priced
                    on performance.
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
