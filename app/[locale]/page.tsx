import type { Metadata } from "next";
import Link from "next/link";
import HeroAssembly from "@/components/pages/home/HeroAssembly";
import PlayOnceVis from "@/components/pages/home/PlayOnceVis";
import SectorMap from "@/components/pages/home/SectorMap";
import SpotlightFrames from "@/components/pages/home/SpotlightFrames";
import Showcase from "@/components/pages/showcase/Showcase";
import { showcaseEnabled } from "@/components/pages/showcase/flag";
import Media from "@/components/site/Media";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { home } from "@/lib/i18n/home";
import { showcase } from "@/lib/i18n/showcase";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "./home.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

/**
 * The routes behind the two proof-bar cards, in the order the dictionary lists
 * them. A route is not copy, so it stays out of lib/i18n: the copy checker
 * reads that file as prose and a path would be counted as a word.
 */
const CASE_ROUTES = ["/work/monte-xanic", "/work/enkanto"];

/* The temporary home swap (bead hq-wrig5.3). With SHOWCASE=1 this route
   renders the showcase: the three modules, a demo per module, how pricing
   works and the diagnostic. With the variable unset it renders OfficialHome
   below, so bringing the official home back is one environment change and a
   redeploy. */

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  const meta = showcaseEnabled()
    ? showcase[locale].meta
    : home[locale].meta;
  return pageMetadata(locale, "/", meta, true);
}

export default function Home({ params }: Params) {
  const locale = localeOf(params);
  if (showcaseEnabled()) return <Showcase locale={locale} />;
  return <OfficialHome params={params} />;
}

/**
 * The home page, in the order docs/copy-doctrine.md section 4 sets out: hero,
 * proof bar, the Monte Xanic case, the objections, what you get, how it works,
 * compare, pricing, diagnostic.
 *
 * Two things about it are deliberate and easy to undo by accident.
 *
 * Monte Xanic is the third block and the first real content, because it is the
 * strongest asset on the site and it used to be section six, inside a map. The
 * proof bar above it names both cases before a visitor has scrolled at all.
 *
 * There is one call to action, `site.diag.cta`, and every button on the page
 * is that same string pointing at #diagnostic. Repeating one action verbatim is
 * the rule; four phrasings of it is the thing the rule exists to stop.
 */
function OfficialHome({ params }: Params) {
  const locale = localeOf(params);
  const d = home[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);
  const callToAction = (
    <div className="cta-row">
      <a className="cta" href="#diagnostic">
        {s.diag.cta}
      </a>
    </div>
  );
  return (
    <main id="main" className="pg-home">
      <span id="top" />

      {/* ============================ 1. HERO ============================
          The copy is short on purpose, so the headline, the result and the one
          action land on a 390px screen without a scroll.

          Under it runs HeroAssembly, the canvas this page has always opened
          with: scattered notebooks, spreadsheets, invoices and messages glide
          into clean rows around one "One system" panel. It is the argument the
          headline makes, drawn, and it is not a Media slot's job. The rule is
          in docs/copy-doctrine.md section 8: a copy bead rewires a visual to
          its new keys and never deletes it, and retiring an animation is
          Daniel's decision alone. Its strings live under `home.vis.hero`.

          What that costs, measured rather than assumed: at 390x844 the canvas
          pushes the proof cards below the fold, so the fourth of the four
          questions ("who already uses it") is answered on the first scroll
          rather than at rest. Three of the four are still answered at rest,
          and the canvas answers "what is this" in pictures while it does. */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1>
              {d.hero.title}
              <br />
              <span className="accent">{d.hero.titleAccent}</span>
            </h1>
            <p className="hero-sub">{d.hero.sub}</p>
            <div className="hero-actions">
              <a className="cta" href="#diagnostic">
                {s.diag.cta}
              </a>
            </div>
            <p className="hero-risk">{d.hero.risk}</p>
          </div>

          <HeroAssembly />
        </div>
      </section>

      {/* ============================ 2. PROOF BAR ============================
          Both wineries named with what we actually have: Monte Xanic's real
          numbers, and for En'kanto what was built, because no En'kanto figure
          has been measured and published yet.

          SectorMap, the valley map that used to carry the buried section six,
          belongs here rather than nowhere: it draws the terrain the two named
          cards sit in, with the focus marker on the Valle and a lit route to
          the hub. Above 900px it is the geographic canvas; below, the same
          stations render as the portrait list (the component ships both and
          the CSS shows exactly one, so the accessibility tree has no
          duplicates and the hidden canvas never starts its loop). */}
      <section className="proof" aria-label={d.proof.aria}>
        <div className="container proof-grid">
          {d.proof.items.map((item, i) => (
            <Link className="proof-item" key={item.name} href={href(CASE_ROUTES[i])}>
              <span className="proof-name">{item.name}</span>
              <span className="proof-place mono">{item.place}</span>
              <p className="proof-result">{item.result}</p>
              <span className="proof-read">{d.proof.read}</span>
            </Link>
          ))}
        </div>

        <div className="container proof-map">
          <SectorMap />
        </div>
      </section>

      {/* ============================ 3. MONTE XANIC ============================ */}
      <section className="section case" id="case" aria-labelledby="case-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.xanic.kicker}</span>
            <h2 id="case-title">{d.xanic.title}</h2>
            <p className="section-sub">{d.xanic.body}</p>
          </div>

          <div className="case-grid">
            <Media
              slot="home/xanic-cellar"
              tone="full"
              priority
              caption={d.xanic.cellarCap}
              alt={d.xanic.cellarAlt}
            />
            <div className="case-figures">
              <dl className="case-stats">
                {d.xanic.stats.map((stat) => (
                  <div className="case-stat" key={stat.k}>
                    <dt className="case-n">{stat.n}</dt>
                    <dd className="case-k mono">{stat.k}</dd>
                  </div>
                ))}
              </dl>
              <p className="case-basis">{d.xanic.basis}</p>
              <Link className="case-read" href={href(CASE_ROUTES[0])}>
                {d.xanic.read}
              </Link>
            </div>
          </div>

          <Media
            className="case-clip"
            slot="home/xanic-tank-log"
            caption={d.xanic.tankCap}
            alt={d.xanic.tankAlt}
            labels={{ play: d.xanic.play, pause: d.xanic.pause }}
          />

          {callToAction}
        </div>
      </section>

      {/* ============================ 4. SOUND FAMILIAR ============================ */}
      <section className="section familiar" aria-labelledby="fam-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker gold">{d.familiar.kicker}</span>
            <h2 id="fam-title">{d.familiar.title}</h2>
          </div>
          <div className="fam-grid">
            {d.familiar.items.map((item) => (
              <div className="fam-item" key={item.q}>
                {/* The objection is quoted because it is the owner speaking:
                    the site itself never uses the first person singular. */}
                <blockquote className="fam-q">
                  <p>{item.q}</p>
                </blockquote>
                <p className="fam-a">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 5. WHAT YOU GET ============================ */}
      <section className="section gets" id="modules" aria-labelledby="gets-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.gets.kicker}</span>
            <h2 id="gets-title">{d.gets.title}</h2>
          </div>

          <div className="gets-grid">
            <div className="gets-items">
              {d.gets.items.map((item) => (
                <div className="gets-item" key={item.name}>
                  <span className="gets-name mono">{item.name}</span>
                  <h3 className="gets-title">{item.title}</h3>
                  <p className="gets-body">{item.body}</p>
                </div>
              ))}
            </div>
            <Media
              className="gets-photo"
              slot="home/phone-in-hand"
              caption={d.gets.phoneCap}
              alt={d.gets.phoneAlt}
            />
          </div>

          {/* The board: six separate parts are placed and soldered into one
              working board, played once when it scrolls into view and reset
              when it leaves. It is this section's own sentence drawn ("three
              parts of the operation, one record"), which is why it lives here
              now that the tools section it was built for is gone. Its strings
              are `home.vis.board`. */}
          <PlayOnceVis className="tools-vis" tag={d.vis.board.tag}>
            <svg
              className="tools-svg"
              viewBox="0 0 520 250"
              role="img"
              aria-label={d.vis.board.aria}
            >
              <rect className="tl-board" x="40" y="30" width="440" height="190" rx="2" />
              <g className="solder tl-solder" fill="none" strokeWidth="1.3" opacity="0.5">
                <path d="M238 63 L 252 63" />
                <path d="M148 90 L 148 78" />
                <path d="M357 90 L 357 78" />
                <path d="M148 202 L 148 218 L 357 218 L 357 202" />
                <path d="M302 154 L 302 142" />
                <path d="M412 154 L 412 142" />
              </g>
              <g className="blk blk-a">
                <rect className="tl-card" x="58" y="48" width="180" height="30" rx="2" />
                <circle className="tl-primary" cx="76" cy="63" r="5" />
                <rect className="tl-muted" x="90" y="59" width="120" height="8" rx="2" opacity="0.55" />
                <g className="solder tl-secondary">
                  <circle cx="64" cy="74" r="2" />
                  <circle cx="232" cy="74" r="2" />
                </g>
              </g>
              <g className="blk blk-b">
                <rect className="tl-card" x="252" y="48" width="210" height="30" rx="2" />
                <rect className="tl-secondary" x="266" y="58" width="60" height="10" rx="2" opacity="0.9" />
                <rect className="tl-muted" x="336" y="59" width="112" height="8" rx="2" opacity="0.5" />
                <g className="solder tl-secondary">
                  <circle cx="258" cy="74" r="2" />
                  <circle cx="456" cy="74" r="2" />
                </g>
              </g>
              <g className="blk blk-c">
                <rect className="tl-card" x="58" y="90" width="180" height="112" rx="2" />
                <g className="screen-detail">
                  <rect className="tl-primary" x="76" y="170" width="18" height="18" rx="2" opacity="0.85" />
                  <rect className="tl-primary" x="102" y="152" width="18" height="36" rx="2" opacity="0.7" />
                  <rect className="tl-primary" x="128" y="134" width="18" height="54" rx="2" />
                  <rect className="tl-secondary" x="154" y="120" width="18" height="68" rx="2" />
                  <rect className="tl-primary" x="180" y="146" width="18" height="42" rx="2" opacity="0.7" />
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
                <rect className="tl-card" x="252" y="90" width="210" height="52" rx="2" />
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
                <rect className="tl-card" x="252" y="154" width="100" height="48" rx="2" />
                <g className="screen-detail">
                  <rect className="tl-muted" x="266" y="166" width="60" height="9" rx="2" opacity="0.5" />
                  <rect className="tl-primary" x="266" y="182" width="40" height="12" rx="2" />
                </g>
              </g>
              <g className="blk blk-f">
                <rect className="tl-card" x="362" y="154" width="100" height="48" rx="2" />
                <g className="screen-detail">
                  <rect className="tl-muted" x="376" y="166" width="60" height="9" rx="2" opacity="0.5" />
                  <rect className="tl-secondary" x="376" y="182" width="52" height="12" rx="2" />
                </g>
              </g>
            </svg>
          </PlayOnceVis>

          <p className="gets-more">
            <Link href={href("/modulos")}>{d.gets.more}</Link>
          </p>

          {callToAction}
        </div>
      </section>

      {/* ============================ 6. HOW IT WORKS ============================
          The measurement panel beside the three steps: a reading travels a
          track, passes a gate marked MEASURED, and the caption settles from
          "ten business days" to "the memo, in writing". It was built for the
          demand section, whose argument moved off this page, so it is rewired
          rather than dropped: what it draws is what the diagnostic does, and
          its foot line is `diagnostic.desc`'s own three clauses. Strings are
          `home.vis.memo`. The `demand-*` and `dm-*` class names are the CSS
          contract in app/globals.css and app/[locale]/home.css, so they stay
          as they are. A portrait twin swaps in under 600px, where the
          landscape viewBox renders its labels too small to read. */}
      <section className="section how" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.how.kicker}</span>
            <h2 id="how-title">{d.how.title}</h2>
          </div>
          <div className="split how-split">
            <div className="split-copy">
              <ol className="steps">
                {d.how.steps.map((step) => (
                  <li className="step" key={step.k}>
                    <span className="step-n mono">{step.k}</span>
                    <p className="step-body">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="split-vis">
              <PlayOnceVis className="demand-vis" tag={d.vis.memo.tag}>
                <svg
                  className="demand-svg demand-svg-d"
                  viewBox="0 0 520 300"
                  role="img"
                  aria-label={d.vis.memo.aria}
                >
                  <text className="dm-in-lab mono" x="46" y="120" fontSize="11" letterSpacing="1.5">
                    {d.vis.memo.signalIn}
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
                    {d.vis.memo.measured}
                  </text>
                  <g className="dm-knob">
                    <circle className="dm-knob-halo" cx="60" cy="150" r="14" />
                    <circle className="dm-knob-core" cx="60" cy="150" r="6" />
                  </g>
                  <g className="dm-badge">
                    <circle className="dm-badge-ring" cx="360" cy="96" r="16" />
                    <path className="dm-badge-check" d="M352 96 L358 102 L369 90" />
                  </g>
                  <text className="dm-lab-pre mono" x="60" y="250" fontSize="14" letterSpacing="0.5">
                    {d.vis.memo.checking}
                  </text>
                  <text className="dm-lab-ok mono" x="60" y="250" fontSize="14" letterSpacing="0.5">
                    {d.vis.memo.verified}
                  </text>
                  <text
                    className="dm-value mono"
                    x="440"
                    y="120"
                    textAnchor="end"
                    fontSize="13"
                    fontWeight="600"
                  >
                    {d.vis.memo.reading}
                  </text>
                  <text className="dm-fee mono" x="60" y="278" fontSize="11" letterSpacing="0.8">
                    {d.vis.memo.foot}
                  </text>
                </svg>

                <svg
                  className="demand-svg demand-svg-m"
                  viewBox="0 0 360 340"
                  role="img"
                  aria-label={d.vis.memo.aria}
                >
                  <text className="dm-in-lab mono" x="30" y="120" fontSize="13" letterSpacing="1.5">
                    {d.vis.memo.signalIn}
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
                    {d.vis.memo.measured}
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
                    {d.vis.memo.reading}
                  </text>
                  <text className="dm-lab-pre mono" x="24" y="268" fontSize="16" letterSpacing="0.4">
                    {d.vis.memo.checking}
                  </text>
                  <text className="dm-lab-ok mono" x="24" y="268" fontSize="16" letterSpacing="0.4">
                    {d.vis.memo.verified}
                  </text>
                  <text className="dm-fee mono" x="24" y="304" fontSize="12" letterSpacing="0.2">
                    {d.vis.memo.foot}
                  </text>
                </svg>
              </PlayOnceVis>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ 7. COMPARE ============================
          The cells are marks now rather than sentences: a reader scanning the
          column reads the answer off the glyph and the three or four words
          beside it. The glyph is drawn, and the yes or no is spelled out for a
          screen reader, because a tick carries no name of its own. */}
      <section className="section compare" id="compare" aria-labelledby="compare-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.compare.kicker}</span>
            <h2 id="compare-title">{d.compare.title}</h2>
          </div>

          <div className="cmp">
            <div className="cmp-head" aria-hidden="true">
              <span />
              <span className="cmp-h cardon">{d.compare.cardon}</span>
              <span className="cmp-h usual">{d.compare.usual}</span>
            </div>

            {d.compare.rows.map((row) => (
              <div className="cmp-row" key={row.dim}>
                <span className="cmp-dim">{row.dim}</span>
                <div className="cmp-cell cmp-cardon">
                  <span className="cmp-tag">{d.compare.cardon}</span>
                  <p>
                    <Mark kind="yes" label={d.compare.yesSr} />
                    {row.cardon}
                  </p>
                </div>
                <div className="cmp-cell cmp-usual">
                  <span className="cmp-tag">{d.compare.usual}</span>
                  <p>
                    <Mark kind="no" label={d.compare.noSr} />
                    {row.usual}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 8. PRICING ============================ */}
      <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.pricing.kicker}</span>
            <h2 id="pricing-title">{d.pricing.title}</h2>
            <p className="section-sub">{d.pricing.sub}</p>
          </div>

          {/* The figures live on /precios: an entry price never travels away
              from the build that produced it (pricing memo 3.7 rule 3). */}
          <p className="pricing-more">
            {d.pricing.moreLead}{" "}
            <Link href={href("/precios")}>{d.pricing.more}</Link>
          </p>

          <div className="pricing-foot">
            {d.pricing.foot.map((item) => (
              <div className="pf-item" key={item.k}>
                <span className="pf-k">{item.k}</span>
                <p>{item.body}</p>
              </div>
            ))}
          </div>

          <div className="founding">
            <span className="kicker clay">{d.pricing.founding.kicker}</span>
            <p className="founding-lead">{rich(d.pricing.founding.lead)}</p>
            <p className="founding-body">{d.pricing.founding.body}</p>
          </div>

          {callToAction}
        </div>
      </section>

      {/* ============================ 9. DIAGNOSTIC ============================ */}
      <section className="section diagnostic" id="diagnostic" aria-labelledby="diag-title">
        <div className="container">
          <div className="diag-inner">
            <div className="diag-lead">
              <span className="kicker clay">{s.diag.kicker}</span>
              <h2 id="diag-title">{s.diag.title}</h2>
              <p className="diag-desc">{d.diagnostic.desc}</p>
              <div className="diag-actions">
                <a className="cta cta-lg" href={mailto}>
                  {s.diag.cta}
                </a>
              </div>
              <p className="diag-price">{rich(s.diag.price)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Behaviour only, renders nothing: writes --mx / --my on every
          .vis-frame so the CSS highlight follows the cursor. It is the last
          child because it queries the frames above it on mount. */}
      <SpotlightFrames />
    </main>
  );
}

/**
 * The tick and the cross in the comparison, drawn rather than typed. A glyph
 * has no accessible name, so the word travels with it in a visually hidden
 * span and the drawing itself is hidden from the reader that would announce it.
 */
function Mark({ kind, label }: { kind: "yes" | "no"; label: string }) {
  return (
    <span className={"cmp-mark cmp-mark-" + kind}>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        {kind === "yes" ? (
          <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" />
        ) : (
          <path d="M4.5 4.5 L11.5 11.5 M11.5 4.5 L4.5 11.5" />
        )}
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
