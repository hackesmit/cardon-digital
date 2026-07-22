import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import StorefrontEngine from "@/components/pages/enkanto/StorefrontEngine";
import SpotlightFrames from "@/components/pages/enkanto/SpotlightFrames";
import "./enkanto-case.css";

export const metadata: Metadata = {
  title: "Vinedo En'kanto case study",
  description:
    "How a boutique Valle de Guadalupe winery, hotel, and restaurant got a working commerce foundation: store rebuilt, structure repaired, payments and shipping made real, bilingual by design.",
  alternates: { canonical: "/work/enkanto" },
};

export default function EnkantoCaseStudy() {
  return (
    <main id="main" className="pg-enkanto">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label="Introduction">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">Case study / Winery</p>
            <h1>
              Vinedo En&apos;kanto has a shop that finally{" "}
              <span className="accent">sells</span>, built to{" "}
              <span className="enk">grow</span>.
            </h1>
            <p className="hero-sub">
              The online store existed in name only: products with no prices,
              no way to ship, demo data in the reports, and five homepages
              competing for the same visitor. We rebuilt it into a working
              commerce foundation, in Spanish and English, that carries a real
              order from add to cart through to fulfillment.{" "}
              <b>One store, one true checkout, built to grow.</b>
            </p>
            <p className="brandline">Built to hold water</p>
          </div>

          <StorefrontEngine />
        </div>
      </section>

      {/* ============================ CLIENT INTRO ============================ */}
      <section className="section rule-top" aria-labelledby="client-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker enk">The client</span>
              <h2 id="client-title">
                Vinedo En&apos;kanto, San Antonio de las Minas.
              </h2>
            </div>
            <div className="prose">
              <p>
                Vinedo En&apos;kanto is a boutique winery, hotel, restaurant,
                and spa in San Antonio de las Minas, in the Valle de Guadalupe.
                Guests come for the wine and the place built around it.
              </p>
              <p>
                The online store is how that experience reaches people who
                cannot visit in person, and how a bottle follows a guest home.
                That is the part we were asked to build.
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
              <h2 id="challenge-title">
                An online shop that was only scaffolding.
              </h2>
            </div>
            <div className="prose">
              <p>
                The store looked like a store and worked like a placeholder.
                Products existed in name only, with no prices and nothing a
                visitor could actually buy. There was no shipping set up, so
                even a finished order had nowhere to go, and the reports were
                still full of demo data, so the numbers described a store that
                did not exist.
              </p>
              <p>
                Five homepages competed for the same visitor, and the site was
                split between two half-finished languages, each missing what the
                other had.{" "}
                <b>
                  A guest ready to buy would run out of road before they reached
                  a checkout.
                </b>{" "}
                The work was to turn the scaffolding into something that holds.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 1 ============================ */}
      <section className="section rule-top" id="solution" aria-labelledby="ch-1-title">
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split-copy">
                <span className="kicker">01 / The store, made real</span>
                <h2 id="ch-1-title">
                  Products you can actually buy, and a checkout that completes.
                </h2>
                <p className="section-sub">
                  We built the catalog out into real products, each with a
                  price, a weight, and an image, and wired a checkout that
                  carries an order all the way through instead of stopping at a
                  full cart. The store stops being a demonstration and{" "}
                  <b>starts being a place that takes an order</b>.
                </p>
                <p className="note">
                  From products in name only to a cart that{" "}
                  <b className="w">completes.</b>
                </p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">empty in name, then built out</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 300"
                    role="img"
                    aria-label="An empty placeholder product card becomes a real product card with an image, name, price, and weight."
                  >
                    <text className="e-lab mono" x="40" y="52" fontSize="11" letterSpacing="1.5">
                      IN NAME ONLY
                    </text>
                    <rect className="e-card" x="40" y="66" width="176" height="176" rx="12" />
                    <rect className="e-dash" x="58" y="84" width="46" height="46" rx="8" />
                    <line className="e-dash" x1="118" y1="94" x2="196" y2="94" />
                    <line className="e-dash" x1="118" y1="112" x2="176" y2="112" />
                    <line className="e-dash" x1="58" y1="158" x2="150" y2="158" />
                    <line className="e-dash" x1="58" y1="182" x2="130" y2="182" />

                    <path className="e-conn-enk" d="M226 154 C 252 154, 258 154, 288 154" />
                    <circle className="e-enk" cx="288" cy="154" r="3" />

                    <text className="e-lab mono" x="304" y="52" fontSize="11" letterSpacing="1.5">
                      BUILT OUT
                    </text>
                    <rect className="e-card e-card-live" x="304" y="66" width="176" height="176" rx="12" />
                    <rect className="e-img" x="322" y="84" width="52" height="52" rx="9" />
                    <path
                      className="e-img-glyph"
                      d="M348 92 L348 100 L342 108 L342 128 L354 128 L354 108 L348 100"
                    />
                    <text className="e-ink mono" x="386" y="104" fontSize="15" fontWeight="600">
                      Tinto
                    </text>
                    <text className="e-gold mono" x="386" y="126" fontSize="13" fontWeight="600">
                      $ 520
                    </text>
                    <line className="e-line-soft" x1="322" y1="158" x2="462" y2="158" />
                    <text className="e-muted mono" x="322" y="184" fontSize="12">
                      750 ml
                    </text>
                    <rect className="e-add" x="408" y="170" width="54" height="22" rx="11" />
                    <text className="e-primary mono" x="435" y="185" fontSize="11" fontWeight="600" textAnchor="middle">
                      add
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 2 ============================ */}
      <section className="section" aria-labelledby="ch-2-title">
        <div className="container">
          <Reveal>
            <div className="split reverse">
              <div className="split-copy">
                <span className="kicker gold">02 / Structure, repaired page by page</span>
                <h2 id="ch-2-title">One clear site, not five homepages.</h2>
                <p className="section-sub">
                  We unpublished the duplicate homepages so one canonical page
                  stands for the store, wrote the descriptions that were
                  missing, and cleaned the sitemap and robots so search engines
                  read the site the way a visitor does. The structure{" "}
                  <b>stops fighting itself</b>.
                </p>
                <p className="note">
                  From five competing pages to{" "}
                  <b className="w">one clear structure.</b>
                </p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">five front doors, then one</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 300"
                    role="img"
                    aria-label="Five competing homepages resolve to one canonical page, with the sitemap and robots cleaned."
                  >
                    <text className="e-lab mono" x="34" y="44" fontSize="11" letterSpacing="1.2">
                      HOMEPAGES
                    </text>
                    <g>
                      <rect className="e-page-off" x="34" y="58" width="190" height="26" rx="7" />
                      <text className="e-muted mono" x="46" y="75" fontSize="11">
                        unpublished
                      </text>
                      <rect className="e-page-off" x="34" y="92" width="190" height="26" rx="7" />
                      <text className="e-muted mono" x="46" y="109" fontSize="11">
                        unpublished
                      </text>
                      <rect className="e-page-live" x="34" y="126" width="190" height="26" rx="7" />
                      <text className="e-ink mono" x="46" y="143" fontSize="11" fontWeight="600">
                        canonical store
                      </text>
                      <rect className="e-page-off" x="34" y="160" width="190" height="26" rx="7" />
                      <text className="e-muted mono" x="46" y="177" fontSize="11">
                        unpublished
                      </text>
                      <rect className="e-page-off" x="34" y="194" width="190" height="26" rx="7" />
                      <text className="e-muted mono" x="46" y="211" fontSize="11">
                        unpublished
                      </text>
                    </g>

                    <path className="e-conn-enk" d="M224 139 C 258 139, 262 139, 296 139" />
                    <circle className="e-enk" cx="296" cy="139" r="3" />

                    <rect className="e-panel" x="304" y="96" width="182" height="108" rx="11" />
                    <text className="e-lab mono" x="322" y="122" fontSize="11" letterSpacing="1">
                      sitemap.xml
                    </text>
                    <text className="e-primary mono" x="468" y="122" fontSize="11" textAnchor="end">
                      clean
                    </text>
                    <line className="e-line-soft" x1="322" y1="138" x2="468" y2="138" />
                    <text className="e-lab mono" x="322" y="164" fontSize="11" letterSpacing="1">
                      robots.txt
                    </text>
                    <text className="e-primary mono" x="468" y="164" fontSize="11" textAnchor="end">
                      clean
                    </text>
                    <line className="e-line-soft" x1="322" y1="180" x2="468" y2="180" />
                    <text className="e-muted mono" x="322" y="196" fontSize="10.5">
                      descriptions written
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 3 ============================ */}
      <section className="section" aria-labelledby="ch-3-title">
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split-copy">
                <span className="kicker">03 / Payments for how Mexico pays</span>
                <h2 id="ch-3-title">
                  Set up for the ways people here actually pay.
                </h2>
                <p className="section-sub">
                  We set up payments around how Mexico pays, cards and cash, so
                  a guest can check out the way that suits them and the order
                  clears. Paying stops being{" "}
                  <b>the place an order quietly dies</b>.
                </p>
                <p className="note">
                  From no way to pay to{" "}
                  <b className="w">a checkout that clears.</b>
                </p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">cards and cash, one checkout</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 300"
                    role="img"
                    aria-label="Card, cash, and transfer methods feed one checkout that reaches an order placed state."
                  >
                    <g>
                      <rect className="e-chip" x="34" y="70" width="128" height="34" rx="9" />
                      <text className="e-val mono" x="54" y="92" fontSize="13">
                        Card
                      </text>
                      <rect className="e-chip" x="34" y="122" width="128" height="34" rx="9" />
                      <text className="e-val mono" x="54" y="144" fontSize="13">
                        Cash
                      </text>
                      <rect className="e-chip" x="34" y="174" width="128" height="34" rx="9" />
                      <text className="e-val mono" x="54" y="196" fontSize="13">
                        Transfer
                      </text>
                    </g>
                    <g className="e-conn">
                      <path d="M162 87 C 210 87, 220 138, 268 138" />
                      <path d="M162 139 L 268 139" />
                      <path d="M162 191 C 210 191, 220 140, 268 140" />
                    </g>
                    <circle className="e-enk" cx="268" cy="139" r="3" />

                    <rect className="e-panel" x="300" y="82" width="186" height="132" rx="12" />
                    <text className="e-lab mono" x="318" y="110" fontSize="11" letterSpacing="1">
                      TOTAL
                    </text>
                    <text className="e-ink mono" x="468" y="110" fontSize="14" fontWeight="600" textAnchor="end">
                      $ 520
                    </text>
                    <rect className="e-track" x="318" y="126" width="150" height="6" rx="3" />
                    <rect className="e-fill" x="318" y="126" width="150" height="6" rx="3" />
                    <text className="e-clay mono" x="318" y="170" fontSize="14" fontWeight="600">
                      Order placed
                    </text>
                    <circle className="e-clay-ring" cx="452" cy="165" r="10" />
                    <circle className="e-clay" cx="452" cy="165" r="3.4" />
                    <text className="e-muted mono" x="318" y="196" fontSize="10.5">
                      the order clears
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 4 ============================ */}
      <section className="section" aria-labelledby="ch-4-title">
        <div className="container">
          <Reveal>
            <div className="split reverse">
              <div className="split-copy">
                <span className="kicker gold">04 / Shipping, made real</span>
                <h2 id="ch-4-title">A real way to get the wine to the buyer.</h2>
                <p className="section-sub">
                  We set up a domestic carrier path with packaging that meets
                  the rules, so a bottle bought online reaches a door inside
                  Mexico. Selling across the border as a Mexican winery is not
                  something the law allows, so we designed the store around what
                  is real: it sells pickup and domestic delivery, and guests
                  visiting from the United States{" "}
                  <b>carry wine home themselves under the personal allowance</b>.
                  The store only promises what it can keep.
                </p>
                <p className="note">
                  From no shipping to{" "}
                  <b className="w">a bottle that reaches the door.</b>
                </p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">pickup, domestic, and an honest carry-home</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 300"
                    role="img"
                    aria-label="An order splits to pickup at the winery and a domestic carrier; a separate dashed lane shows US guests carrying wine home in person under the personal allowance."
                  >
                    <circle className="e-node-live" cx="96" cy="150" r="9" />
                    <text className="e-ink mono" x="96" y="184" fontSize="12" textAnchor="middle">
                      Order
                    </text>
                    <path className="e-conn-enk" d="M105 145 C 150 128, 190 100, 236 92" />
                    <path className="e-conn-enk" d="M105 155 C 150 172, 190 200, 236 208" />

                    <circle className="e-node-live" cx="244" cy="90" r="7" />
                    <text className="e-ink mono" x="262" y="86" fontSize="12">
                      Pickup
                    </text>
                    <text className="e-muted mono" x="262" y="104" fontSize="10.5">
                      at the winery
                    </text>

                    <circle className="e-node-live" cx="244" cy="210" r="7" />
                    <text className="e-ink mono" x="262" y="206" fontSize="12">
                      Domestic carrier
                    </text>
                    <text className="e-muted mono" x="262" y="224" fontSize="10.5">
                      compliant packaging
                    </text>

                    <line className="e-divider" x1="392" y1="54" x2="392" y2="246" />
                    <text className="e-lab mono" x="410" y="82" fontSize="10.5" letterSpacing="1">
                      ACROSS THE BORDER
                    </text>
                    <circle className="e-guest" cx="424" cy="150" r="6" />
                    <path className="e-carry" d="M432 150 L 476 150" />
                    <path
                      className="e-home"
                      d="M480 150 L 492 140 L 504 150 M484 148 L484 162 L500 162 L500 148"
                    />
                    <text className="e-muted mono" x="410" y="192" fontSize="10.5">
                      carried in person,
                    </text>
                    <text className="e-muted mono" x="410" y="208" fontSize="10.5">
                      personal allowance
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 5 ============================ */}
      <section className="section" aria-labelledby="ch-5-title">
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split-copy">
                <span className="kicker">05 / Bilingual by design</span>
                <h2 id="ch-5-title">
                  One store in two languages, not one bolted onto the other.
                </h2>
                <p className="section-sub">
                  We built English and Spanish as one foundation, so the same
                  store reads whole in either language instead of one being a
                  thinner copy of the other. A guest from the Valle and a guest
                  from across the border{" "}
                  <b>meet the same store, each in their own words</b>.
                </p>
                <p className="note">
                  From two half-languages to{" "}
                  <b className="w">one store, read whole in both.</b>
                </p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">EN and ES, one foundation</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 300"
                    role="img"
                    aria-label="English and Spanish rails converge into a single store foundation."
                  >
                    <rect className="e-chip e-chip-live" x="40" y="88" width="70" height="40" rx="10" />
                    <text className="e-ink mono" x="75" y="113" fontSize="15" fontWeight="600" textAnchor="middle">
                      EN
                    </text>
                    <rect className="e-chip e-chip-live" x="40" y="172" width="70" height="40" rx="10" />
                    <text className="e-ink mono" x="75" y="197" fontSize="15" fontWeight="600" textAnchor="middle">
                      ES
                    </text>

                    <path className="e-conn-enk" d="M110 108 C 180 108, 200 150, 268 150" />
                    <path className="e-conn-enk" d="M110 192 C 180 192, 200 150, 268 150" />
                    <circle className="e-enk" cx="268" cy="150" r="3" />

                    <rect className="e-panel" x="300" y="98" width="186" height="104" rx="12" />
                    <text className="e-ink mono" x="318" y="128" fontSize="14" fontWeight="600">
                      One store
                    </text>
                    <text className="e-muted mono" x="318" y="152" fontSize="11">
                      read whole in both
                    </text>
                    <text className="e-primary mono" x="318" y="182" fontSize="11">
                      one foundation, not a bolt-on
                    </text>
                  </svg>
                </div>
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
              <span className="kicker enk">The result</span>
              <h2 id="results-title">What En&apos;kanto can do now.</h2>
            </div>
            <div className="callouts">
              <div className="callout">
                <span className="callout-idx mono">01</span>
                <p className="callout-lead">A store that takes a real order.</p>
                <p className="callout-body">
                  Real products, real prices, and a checkout that completes, so
                  a guest ready to buy can finish.
                </p>
              </div>
              <div className="callout">
                <span className="callout-idx mono">02</span>
                <p className="callout-lead">
                  One clear site instead of five front doors.
                </p>
                <p className="callout-body">
                  A single canonical store, described and indexed cleanly, so
                  visitors and search engines find one place, not five.
                </p>
              </div>
              <div className="callout">
                <span className="callout-idx mono">03</span>
                <p className="callout-lead">Paid the way people here pay.</p>
                <p className="callout-body">
                  Cards and cash both clear, so paying is no longer where an
                  order stalls.
                </p>
              </div>
              <div className="callout">
                <span className="callout-idx mono">04</span>
                <p className="callout-lead">A bottle that can actually get home.</p>
                <p className="callout-body">
                  Domestic delivery that meets the rules, and an honest
                  pickup-and-carry path for guests from across the border.
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
              <h2 id="outcome-title">A commerce foundation that can grow.</h2>
              <div className="prose">
                <p>
                  The store now has real products, a checkout that completes,
                  payments for how people pay, shipping that reaches the door,
                  and one bilingual foundation underneath it all. What was
                  scaffolding is now something a boutique winery can actually
                  sell from, and build on.
                </p>
                <p>
                  Through a season when the Valle&apos;s overall flow dipped,
                  En&apos;kanto kept growing and kept selling.{" "}
                  <b>
                    We built the foundation. What grows on it belongs to the
                    winery.
                  </b>
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
                  Ten business days looking at your store, your site, and your
                  operations as one system. You get a written memo, not a sales
                  deck, telling you what is true, what is broken, and what to
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
                  <span className="spec-dot"></span>
                  <span>
                    <b>Day 1.</b> A working session on your store, your site, and
                    your operations.
                  </span>
                </div>
                <div className="spec">
                  <span className="spec-dot"></span>
                  <span>
                    <b>Days 2 to 9.</b> We dig: the catalog, payments, shipping,
                    measurement, the numbers behind the numbers.
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
                    <b>Free, with no strings.</b> Act on it with us or without
                    us. If we build, pricing is agreed up front.
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
