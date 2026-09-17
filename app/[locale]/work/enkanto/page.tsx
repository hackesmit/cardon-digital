import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import Media from "@/components/site/Media";
import SpotlightFrames from "@/components/pages/enkanto/SpotlightFrames";
import CaseFacts from "@/components/pages/case/CaseFacts";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { enkanto, type EnkantoDict } from "@/lib/i18n/enkanto";
import { allModules, demoHref, demoIsLive } from "@/lib/demo";
import { showsPending } from "./pending";
import "./enkanto-case.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

/** Fail-closed gate for the marked results placeholder. See ./pending.ts. */
const showPending = showsPending(process.env);

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/work/enkanto", enkanto[locale].meta);
}

/**
 * En'kanto, as a case history and as the companion to Monte Xanic.
 *
 * The two pages now run the same order, because two cases a visitor can
 * compare in four seconds are worth more than two pages each arguing its own
 * way: hero and the photographs, the case facts with their basis, what it was
 * costing them, what changed, the system, then what that changes for the
 * property reading it, then the one call to action. Monte Xanic's third beat
 * is the number it owns. This page has no number of its own, so its third
 * beat is the system itself, and the results block stays a marked placeholder
 * until En'kanto's own before and after figures land (bead hq-cczm.26).
 *
 * All five drawn visuals stay, rewired rather than deleted (docs/copy-doctrine
 * .md section 8, and Daniel's correction on bead hq-4pu0q.5). The old page hung
 * one diagram off each of five chapter blocks; the rewrite has no chapters, so
 * the before and after card now sits beside the what-changed lead and the other
 * four sit one per change in the list under it, which is where each one was
 * always arguing. Their labels moved with them, into the dictionary's `vis`
 * key, so halving the prose never reaches a diagram's working parts.
 *
 * The cellar band stays too, and it now carries a caption saying what it is.
 * It is licensed stock standing in until En'kanto's own photograph lands
 * (public/media/CREDITS.md), and a real photograph with an honest caption
 * beats a pending placeholder in the same place.
 *
 * The photographs are the addition, never the trade. The two hero slots are
 * the restaurant and the lodging side, which is what this case carries that
 * Monte Xanic does not, and the clip is the room charge, the one place the two
 * touch. Every caption carries the result and none of them is the only carrier
 * of a claim.
 *
 * SpotlightFrames is mounted last: a pointermove listener per frame writing
 * --mx / --my, which is what the shared .vis-frame::after highlight reads.
 * Without it every frame on this page keeps the glow pinned to its centre by
 * the 50% fallback while the sibling case page tracks the cursor, which is one
 * convention pretending to be two.
 *
 * The primary call to action is `site.diag.cta`, the same words as the home
 * page and the Monte Xanic case, repeated verbatim in the hero, under the
 * results and in the closing block. The demo link is the page's own evidence
 * and is deliberately worded as what it is, so it reads as a way to check the
 * claim rather than as a second offer.
 */
export default function EnkantoCaseStudy({ params }: Params) {
  const locale = localeOf(params);
  const d = enkanto[locale];
  const v = d.vis;
  const s = site[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  const cta = (
    <a className="cta cta-lg" href={mailto}>
      {s.diag.cta}
    </a>
  );

  return (
    <main id="main" className="pg-enkanto">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1>
              {d.hero.t1}
              <span className="enk">{d.hero.accent}</span>
              {d.hero.t2}
            </h1>
            <p className="hero-sub">{d.hero.sub}</p>
            <div className="hero-actions">{cta}</div>
            <p className="brandline">{s.brandline}</p>
          </div>

          <div className="case-pair">
            <Media
              slot="enkanto/front-desk"
              caption={d.media.deskCap}
              alt={d.media.deskAlt}
              tone="tint"
            />
            <Media
              slot="enkanto/restaurant-pass"
              caption={d.media.passCap}
              alt={d.media.passAlt}
              tone="full"
              priority
            />
          </div>
          {/* The captions describe what the built system gives the place in the
              photographs, and the place is a working property that is not
              running it yet. The basis paragraph says so too, but a caption is
              read by about twice as many people as body copy, so the state is
              stated where the captions are (cross-vendor review, round one). */}
          <p className="pair-honest mono">{d.media.honest}</p>
        </div>
      </section>

      <CaseFacts
        aria={d.facts.aria}
        rows={d.facts.rows}
        basisK={d.facts.basisK}
        basis={d.facts.basis}
      />

      {/* ============================ BEFORE ============================ */}
      <section className="section rule-top" aria-labelledby="before-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker enk">{d.before.kicker}</span>
              <h2 id="before-title">{d.before.title}</h2>
            </div>
            <div className="prose">
              <p>{d.before.p1}</p>
              <p>{d.before.p2}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ THE CELLAR BAND ============================
          Licensed stock standing in until En'kanto's own cellar photograph
          lands (public/media/CREDITS.md). It is captioned rather than silent,
          because an uncaptioned photograph is inventory carrying no argument
          and because a stand-in has to say that it is one. */}
      <section className="photo-slot">
        <div className="container">
          <figure className="photoband">
            <img
              className="photoband-img"
              src="/media/enkanto-valle.webp"
              alt={v.band.alt}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="photoband-cap mono">{v.band.caption}</figcaption>
          </figure>
        </div>
      </section>

      {/* ============================ WHAT CHANGED ============================
          The store work, with the one surviving diagram: the placeholder card
          that became a product with a price, a weight and a way to leave the
          building. The card is invented and says so on the frame. */}
      <section className="section" id="solution" aria-labelledby="changed-title">
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split-copy">
                <span className="kicker">{d.changed.kicker}</span>
                <h2 id="changed-title">{d.changed.title}</h2>
                <p className="section-sub">{d.changed.sub}</p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">{v.card.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 258"
                    role="img"
                    aria-label={v.card.aria}
                  >
                    <text className="e-lab mono" x="40" y="52" fontSize="11" letterSpacing="1.5">{v.card.inNameOnly}</text>
                    <rect className="e-card" x="40" y="66" width="176" height="176" rx="2" />
                    <rect className="e-dash" x="58" y="84" width="46" height="46" rx="2" />
                    <line className="e-dash" x1="118" y1="94" x2="196" y2="94" />
                    <line className="e-dash" x1="118" y1="112" x2="176" y2="112" />
                    <line className="e-dash" x1="58" y1="158" x2="150" y2="158" />
                    <line className="e-dash" x1="58" y1="182" x2="130" y2="182" />

                    <path className="e-conn-enk" d="M226 154 C 252 154, 258 154, 288 154" />
                    <circle className="e-enk" cx="288" cy="154" r="3" />

                    <text className="e-lab mono" x="304" y="52" fontSize="11" letterSpacing="1.5">{v.card.builtOut}</text>
                    <rect className="e-card e-card-live" x="304" y="66" width="176" height="176" rx="2" />
                    <rect className="e-img" x="322" y="84" width="52" height="52" rx="2" />
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
                    <rect className="e-add" x="408" y="170" width="54" height="22" rx="2" />
                    <text className="e-primary mono" x="435" y="185" fontSize="11" fontWeight="600" textAnchor="middle">{v.card.add}</text>
                  </svg>
                </div>
                <p className="vis-honest mono">{v.card.honest}</p>
              </div>
            </div>

          </Reveal>

          {/* One diagram per change, in the order CHANGE_VISUALS declares and
              the dictionary lists. A change with no diagram beside it is a
              visual that went missing, so the suite counts frames on the
              rendered page rather than letting `map` swallow it.

              Each change reveals on its own with the same 60ms stagger the
              module cards use. The old page gave each of these five diagrams a
              section and a reveal of its own; folding them into one block was
              the rewrite quietly spending four of them, which is motion coming
              down with the words (doctrine section 8 rule 5). */}
          <div className="changes">
            {d.changed.items.map((item, i) => {
              const vis = CHANGE_VISUALS[i];
              return (
                <Reveal key={item.lead} delay={i * 60}>
                  <div className="change">
                    <p className="change-lead">{item.lead}</p>
                    <p className="change-body">{item.body}</p>
                    {vis ? vis(v) : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ THE SYSTEM ============================ */}
      <section className="section rule-top" id="system" aria-labelledby="system-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker enk">{d.system.kicker}</span>
              <h2 id="system-title">{d.system.title}</h2>
            </div>
            <div className="prose">
              <p>{d.system.p1}</p>
            </div>
          </Reveal>

          <div className="sys-grid">
            {d.system.modules.map((m, i) => (
              <Reveal key={m.num} delay={i * 60}>
                <article className="sys-card">
                  <p className="sys-card-head">
                    <span className="sys-card-num mono">{m.num}</span>
                    <span className="sys-card-name mono">{m.name}</span>
                  </p>
                  <h3 className="sys-card-title">{m.title}</h3>
                  <p className="sys-card-body">{m.body}</p>
                  <p className="sys-screens-k mono">{d.system.screensK}</p>
                  <ul className="sys-screens">
                    {m.screens.map((screen) => (
                      <li className="sys-screen mono" key={screen}>
                        {screen}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          {/* The one place the restaurant and the rooms touch, which is also the
              edge the third limit below is about. */}
          <Media
            className="case-media-wide"
            slot="enkanto/room-charge"
            caption={d.media.videoCap}
            alt={d.media.videoAlt}
            labels={{ play: d.media.play, pause: d.media.pause }}
          />
        </div>
      </section>

      {/* ============================ HONEST EDGES ============================ */}
      <section className="section" aria-labelledby="limits-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">{d.system.limitsKicker}</span>
              <h2 id="limits-title">{d.system.limitsTitle}</h2>
            </div>
          </Reveal>
          <div className="sys-limits">
            {d.system.limits.map((limit, i) => (
              <Reveal key={limit.lead} delay={i * 60}>
                <div className="sys-limit">
                  <p className="sys-limit-lead">{limit.lead}</p>
                  <p className="sys-limit-body">{limit.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ THE DEMO ============================ */}
      <section className="section" aria-labelledby="demo-title">
        <div className="container">
          <Reveal>
            <div className="sys-demo">
              <span className="kicker enk">{d.system.demo.kicker}</span>
              <h2 id="demo-title">{d.system.demo.title}</h2>
              <p className="sys-demo-body">{d.system.demo.body}</p>
              <Link
                className="cta cta-lg"
                href={demoHref(locale, allModules)}
                {...(demoIsLive
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {d.system.demo.cta}
              </Link>
              <p className="sys-demo-note mono">{d.system.demo.note}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/*
        PLACEHOLDER, NOT PUBLISHABLE COPY.

        Bead hq-cczm.25, and hq-cczm.26 owns filling it. Daniel's standing rule
        for this page is that any statement about En'kanto's results needs his
        own figures, collected before the copy is written. The request for them
        is console request r-65e508c5, filed 2026-09-09 and unanswered when
        this branch was written. Everything else on this page is stated from
        the merged build or from figures already cleared for publication; this
        block is the one gap, and it is marked on the page rather than filled
        with an estimate.

        To close it: replace d.pending with a result section written to the
        outcome framing rule (case-naming.md 6.2), or delete this section and
        its dictionary block. It must not reach production as it stands.
      */}
      {showPending ? (
        <section className="section pending-sec" aria-labelledby="pending-title">
          <div className="container">
            <div className="pending-block">
              <p className="pending-marker mono">{d.pending.marker}</p>
              <h2 id="pending-title" className="pending-title">
                {d.pending.title}
              </h2>
              <p className="pending-body">{d.pending.body}</p>
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================ FOR YOUR PROPERTY ============================ */}
      <section className="section results rule-top" aria-labelledby="result-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker enk">{d.result.kicker}</span>
              <h2 id="result-title">{d.result.title}</h2>
            </div>
            <div className="callouts">
              {d.result.items.map((item, i) => (
                <div className="callout" key={item.lead}>
                  <span className="callout-idx mono">{"0" + (i + 1)}</span>
                  <p className="callout-lead">{item.lead}</p>
                  <p className="callout-body">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="hero-actions">{cta}</div>
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
                <div className="diag-actions">{cta}</div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
              <div className="diag-specs">
                {d.diagSpecs.map((spec) => (
                  <div className="spec" key={spec.d}>
                    <span className="spec-dot" />
                    <span>
                      <span className="spec-d mono">{spec.d}</span>{" "}
                      {spec.t}
                    </span>
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

/**
 * THE FOUR CHANGE DIAGRAMS, one per entry in `changed.items`.
 *
 * They are the drawings the old page hung off chapters two to five, rewired to
 * the `vis` keys the rewrite gave them and moved beside the sentence each one
 * was always arguing. Every label comes from the dictionary, so both locales
 * draw in their own words, and each frame carries an accessible name because a
 * diagram a screen reader cannot read is decoration.
 *
 * `.vis-frame` is the shared frame in globals.css, which means each of these
 * inherits the cursor spotlight the moment <SpotlightFrames /> is mounted.
 */
type VisDict = EnkantoDict["vis"];

/** Five front doors resolving to one, with the sitemap and robots clean. */
function structureVis(v: VisDict) {
  return (
    <div className="vis-frame change-vis">
      <span className="vis-tag">{v.structure.tag}</span>
      <svg className="mini-svg" viewBox="0 0 520 238" role="img" aria-label={v.structure.aria}>
        <text className="e-lab mono" x="34" y="44" fontSize="11" letterSpacing="1.2">{v.structure.homepages}</text>
        {/* The five front doors, and ONLY the five. The basis paragraph counts the
            rows in here, so a legend or an annotation added to this diagram must
            go outside this group or it becomes another homepage (review s-641a). */}
        <g className="e-front-doors">
          <rect className="e-page-off" x="34" y="58" width="190" height="26" rx="2" />
          <text className="e-muted mono" x="46" y="75" fontSize="11">{v.structure.unpublished}</text>
          <rect className="e-page-off" x="34" y="92" width="190" height="26" rx="2" />
          <text className="e-muted mono" x="46" y="109" fontSize="11">{v.structure.unpublished}</text>
          <rect className="e-page-live" x="34" y="126" width="190" height="26" rx="2" />
          <text className="e-ink mono" x="46" y="143" fontSize="11" fontWeight="600">{v.structure.canonical}</text>
          <rect className="e-page-off" x="34" y="160" width="190" height="26" rx="2" />
          <text className="e-muted mono" x="46" y="177" fontSize="11">{v.structure.unpublished}</text>
          <rect className="e-page-off" x="34" y="194" width="190" height="26" rx="2" />
          <text className="e-muted mono" x="46" y="211" fontSize="11">{v.structure.unpublished}</text>
        </g>

        <path className="e-conn-enk" d="M224 139 C 258 139, 262 139, 296 139" />
        <circle className="e-enk" cx="296" cy="139" r="3" />

        <rect className="e-panel" x="304" y="96" width="182" height="108" rx="2" />
        <text className="e-lab mono" x="322" y="122" fontSize="11" letterSpacing="1">
          sitemap.xml
        </text>
        <text className="e-primary mono" x="468" y="122" fontSize="11" textAnchor="end">{v.structure.clean}</text>
        <line className="e-line-soft" x1="322" y1="138" x2="468" y2="138" />
        <text className="e-lab mono" x="322" y="164" fontSize="11" letterSpacing="1">
          robots.txt
        </text>
        <text className="e-primary mono" x="468" y="164" fontSize="11" textAnchor="end">{v.structure.clean}</text>
        <line className="e-line-soft" x1="322" y1="180" x2="468" y2="180" />
        <text className="e-muted mono" x="322" y="196" fontSize="10.5">{v.structure.descriptions}</text>
      </svg>
    </div>
  );
}

/** Card, cash and transfer feeding one checkout that reaches a placed order. */
function paymentsVis(v: VisDict) {
  return (
    <div className="vis-frame change-vis">
      <span className="vis-tag">{v.payments.tag}</span>
      <svg className="mini-svg" viewBox="0 0 520 230" role="img" aria-label={v.payments.aria}>
        <g>
          <rect className="e-chip" x="34" y="70" width="128" height="34" rx="2" />
          <text className="e-val mono" x="54" y="92" fontSize="13">{v.payments.card}</text>
          <rect className="e-chip" x="34" y="122" width="128" height="34" rx="2" />
          <text className="e-val mono" x="54" y="144" fontSize="13">{v.payments.cash}</text>
          <rect className="e-chip" x="34" y="174" width="128" height="34" rx="2" />
          <text className="e-val mono" x="54" y="196" fontSize="13">{v.payments.transfer}</text>
        </g>
        <g className="e-conn">
          <path d="M162 87 C 210 87, 220 138, 268 138" />
          <path d="M162 139 L 268 139" />
          <path d="M162 191 C 210 191, 220 140, 268 140" />
        </g>
        <circle className="e-enk" cx="268" cy="139" r="3" />

        <rect className="e-panel" x="300" y="82" width="186" height="132" rx="2" />
        <text className="e-lab mono" x="318" y="110" fontSize="11" letterSpacing="1">
          TOTAL
        </text>
        <text className="e-ink mono" x="468" y="110" fontSize="14" fontWeight="600" textAnchor="end">
          $ 520
        </text>
        <rect className="e-track" x="318" y="126" width="150" height="6" rx="2" />
        <rect className="e-fill" x="318" y="126" width="150" height="6" rx="2" />
        <text className="e-clay mono" x="318" y="170" fontSize="14" fontWeight="600">{v.payments.placed}</text>
        <circle className="e-clay-ring" cx="452" cy="165" r="10" />
        <circle className="e-clay" cx="452" cy="165" r="3.4" />
        <text className="e-muted mono" x="318" y="196" fontSize="10.5">{v.payments.clears}</text>
      </svg>
    </div>
  );
}

/** Pickup and a domestic carrier, with the carry-home lane drawn apart. */
function shippingVis(v: VisDict) {
  return (
    <div className="vis-frame change-vis">
      <span className="vis-tag">{v.shipping.tag}</span>
      <svg className="mini-svg" viewBox="0 0 520 240" role="img" aria-label={v.shipping.aria}>
        <circle className="e-node-live" cx="96" cy="150" r="9" />
        <text className="e-ink mono" x="96" y="184" fontSize="12" textAnchor="middle">{v.shipping.order}</text>
        <path className="e-conn-enk" d="M105 145 C 150 128, 190 100, 236 92" />
        <path className="e-conn-enk" d="M105 155 C 150 172, 190 200, 236 208" />

        <circle className="e-node-live" cx="244" cy="90" r="7" />
        <text className="e-ink mono" x="262" y="86" fontSize="12">{v.shipping.pickup}</text>
        <text className="e-muted mono" x="262" y="104" fontSize="10.5">{v.shipping.atWinery}</text>

        <circle className="e-node-live" cx="244" cy="210" r="7" />
        <text className="e-ink mono" x="262" y="206" fontSize="12">{v.shipping.carrier}</text>
        <text className="e-muted mono" x="262" y="224" fontSize="10.5">{v.shipping.packaging}</text>

        {/* The carry-home lane sits 12 units further left than the drawing it
            came from, and its heading spends less letter spacing. Measured, not
            eyeballed: state/review/s-6fb6/shots.mjs walks every <text> in every
            frame and compares its rect with the frame's, and CRUZANDO LA
            FRONTERA ran 3px past the right edge at both 1440 and 390 while the
            shorter English heading fit. An SVG label is neither wrapped nor
            clipped by its box, so that overflow draws over the frame border. */}
        <line className="e-divider" x1="380" y1="54" x2="380" y2="246" />
        <text className="e-lab mono" x="392" y="82" fontSize="9.5" letterSpacing="0.2">{v.shipping.acrossBorder}</text>
        <circle className="e-guest" cx="406" cy="150" r="6" />
        <path className="e-carry" d="M414 150 L 454 150" />
        <path
          className="e-home"
          d="M458 150 L 470 140 L 482 150 M462 148 L462 162 L478 162 L478 148"
        />
        <text className="e-muted mono" x="392" y="192" fontSize="9.5">{v.shipping.carried}</text>
        <text className="e-muted mono" x="392" y="208" fontSize="9.5">{v.shipping.allowance}</text>
      </svg>
    </div>
  );
}

/** Two language rails converging on one store foundation. */
function bilingualVis(v: VisDict) {
  return (
    <div className="vis-frame change-vis">
      <span className="vis-tag">{v.bilingual.tag}</span>
      <svg className="mini-svg" viewBox="0 0 520 186" role="img" aria-label={v.bilingual.aria}>
        <rect className="e-chip e-chip-live" x="40" y="46" width="70" height="40" rx="2" />
        <text className="e-ink mono" x="75" y="71" fontSize="15" fontWeight="600" textAnchor="middle">
          EN
        </text>
        <rect className="e-chip e-chip-live" x="40" y="130" width="70" height="40" rx="2" />
        <text className="e-ink mono" x="75" y="155" fontSize="15" fontWeight="600" textAnchor="middle">
          ES
        </text>

        <path className="e-conn-enk" d="M110 66 C 180 66, 200 108, 268 108" />
        <path className="e-conn-enk" d="M110 150 C 180 150, 200 108, 268 108" />
        <circle className="e-enk" cx="268" cy="108" r="3" />

        <rect className="e-panel" x="300" y="56" width="198" height="104" rx="2" />
        <text className="e-ink mono" x="318" y="86" fontSize="14" fontWeight="600">{v.bilingual.oneStore}</text>
        <text className="e-muted mono" x="318" y="110" fontSize="11">{v.bilingual.readWhole}</text>
        <text className="e-primary mono" x="318" y="140" fontSize="10.5">{v.bilingual.foundation}</text>
      </svg>
    </div>
  );
}

/**
 * In the order `changed.items` lists them: one address for the business,
 * paid the way people here pay, a bottle reaching a door, one store in two
 * languages. A Next.js page file may export nothing but its own route hooks,
 * so the guard that keeps the two lists in step reads the rendered page: every
 * `.change` has to carry exactly one framed diagram.
 */
const CHANGE_VISUALS: Array<(v: VisDict) => JSX.Element> = [
  structureVis,
  paymentsVis,
  shippingVis,
  bilingualVis,
];
