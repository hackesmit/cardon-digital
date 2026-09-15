import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import Media from "@/components/site/Media";
import CaseFacts from "@/components/pages/case/CaseFacts";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { enkanto } from "@/lib/i18n/enkanto";
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
 * Four of the five chapter diagrams are gone rather than rewritten. They drew
 * our mechanism (five homepages resolving to one, three payment methods
 * feeding a checkout, a shipping fan-out, two language rails converging), and
 * the sentence beside each one already said it in fewer words than the diagram
 * took to draw. The one that survives is the one that is evidence rather than
 * illustration: an empty product card becoming a real one, which is the
 * before and after Ogilvy rates above every other format, and it carries the
 * honesty label a made-up card needs.
 *
 * The photographs are the new argument. The two hero slots are the restaurant
 * and the lodging side, which is what this case carries that Monte Xanic does
 * not, and the clip is the room charge, the one place the two touch. Every
 * caption carries the result and none of them is the only carrier of a claim.
 *
 * SpotlightFrames went with them: a pointermove listener per frame writing a
 * cursor-following glow, which is decoration and which nothing else on the
 * page needed.
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
                  <span className="vis-tag">{d.changed.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 258"
                    role="img"
                    aria-label={d.changed.aria}
                  >
                    <text className="e-lab mono" x="40" y="52" fontSize="11" letterSpacing="1.5">{d.changed.inNameOnly}</text>
                    <rect className="e-card" x="40" y="66" width="176" height="176" rx="2" />
                    <rect className="e-dash" x="58" y="84" width="46" height="46" rx="2" />
                    <line className="e-dash" x1="118" y1="94" x2="196" y2="94" />
                    <line className="e-dash" x1="118" y1="112" x2="176" y2="112" />
                    <line className="e-dash" x1="58" y1="158" x2="150" y2="158" />
                    <line className="e-dash" x1="58" y1="182" x2="130" y2="182" />

                    <path className="e-conn-enk" d="M226 154 C 252 154, 258 154, 288 154" />
                    <circle className="e-enk" cx="288" cy="154" r="3" />

                    <text className="e-lab mono" x="304" y="52" fontSize="11" letterSpacing="1.5">{d.changed.builtOut}</text>
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
                    <text className="e-primary mono" x="435" y="185" fontSize="11" fontWeight="600" textAnchor="middle">{d.changed.add}</text>
                  </svg>
                </div>
                <p className="vis-honest mono">{d.changed.honest}</p>
              </div>
            </div>

            <div className="changes">
              {d.changed.items.map((item) => (
                <div className="change" key={item.lead}>
                  <p className="change-lead">{item.lead}</p>
                  <p className="change-body">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
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
    </main>
  );
}
