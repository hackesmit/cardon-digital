import type { Metadata } from "next";
import Link from "next/link";
import DigitalArc from "@/components/pages/home/DigitalArc";
import HeroAssembly from "@/components/pages/home/HeroAssembly";
import PlayOnceVis from "@/components/pages/home/PlayOnceVis";
import SectorMap from "@/components/pages/home/SectorMap";
import SpotlightFrames from "@/components/pages/home/SpotlightFrames";
import Media, { type MediaPhotoSlot } from "@/components/site/Media";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { home } from "@/lib/i18n/home";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import {
  adsScope,
  formatPrice,
  moduleFloors,
  webPackageFrom,
  currencyByLocale,
} from "@/lib/pricing";
import "./home.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

/**
 * The routes behind the proof-bar cards, in the order the dictionary lists
 * them. A route is not copy, so it stays out of lib/i18n: the copy checker
 * reads that file as prose and a path would be counted as a word. The third
 * card (a website client with no case page yet) carries no route and renders
 * as a plain card.
 */
const CASE_ROUTES = ["/work/monte-xanic", "/work/enkanto"];

/**
 * The photographs at the top of the page, by slot, in the order of the proof
 * cards and then the service cards. A slot with no file yet renders no frame
 * at all here (the card stands as it did), because a hatched placeholder on
 * the first screen reads as unfinished; the shot list in public/media/README.md
 * carries the brief. Add the file and its path here.
 */
const PROOF_PHOTOS: Array<{ slot: MediaPhotoSlot; src: string | null }> = [
  { slot: "home/proof-xanic", src: "/media/home/proof-xanic.webp" },
  { slot: "home/proof-enkanto", src: "/media/enkanto/cabana.webp" },
  { slot: "home/proof-dharma", src: null },
];
const SERVICE_PHOTOS: Array<{ slot: MediaPhotoSlot; src: string | null }> = [
  { slot: "home/service-sitios", src: null },
  { slot: "home/service-anuncios", src: null },
  { slot: "home/service-software", src: "/media/home/service-software.webp" },
];

/** The service page behind each of the three service cards, in dictionary order. */
const SERVICE_ROUTES = ["/sitios-web", "/anuncios", "/software"];

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/", home[locale].meta, true);
}

/**
 * The home page, in the order the arc of 2026-09-28 sets out (bunker
 * research/2026-09/site-arc-digital-onboarding.md section 4): hero, proof
 * bar, the three services, the objections, the Monte Xanic case, one system,
 * how it works, who builds it, compare, pricing summary, diagnostic.
 *
 * Three things about it are deliberate and easy to undo by accident.
 *
 * The hero visual is DigitalArc, the whole argument drawn in three acts.
 * HeroAssembly, the canvas this page opened with before, is not gone: it is
 * the picture of "one system" further down, rewired to the same strings
 * (docs/copy-doctrine.md section 8: a copy bead never deletes a visual).
 *
 * The showcase home that the SHOWCASE flag used to swap in is retired from
 * this route on purpose: the official home is the arc now, and a flag that
 * could silently put a winery-only page back in its place would contradict
 * every other page. The showcase component stays in the tree.
 *
 * There is one call to action, `site.diag.cta`, and every button on the page
 * is that same string. Repeating one action verbatim is the rule.
 */
export default function Home({ params }: Params) {
  const locale = localeOf(params);
  const d = home[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const cur = currencyByLocale[locale];
  const price = (amount: number) => formatPrice(locale, amount);
  const siteFrom = price(webPackageFrom("presencia")[cur]);
  const adsMonthly = price(adsScope("local").monthly[cur]);
  const softFrom = price(
    Math.min(...Object.values(moduleFloors).map((f) => f.setup[cur])),
  );
  const serviceLine: Record<string, string> = {
    sitios: d.services.fromLabel + " " + siteFrom,
    anuncios: adsMonthly + " " + d.services.perMonth,
    software: d.services.fromLabel + " " + softFrom,
  };
  const photo = (entry: { slot: MediaPhotoSlot; src: string | null }, className: string) =>
    entry.src ? (
      <Media
        className={className}
        slot={entry.slot}
        src={entry.src}
        caption={d.photos[entry.slot].cap}
        alt={d.photos[entry.slot].alt}
      />
    ) : null;
  // The three service cards carry their photographs together or not at all:
  // one card with a picture and two without reads as an unfinished row.
  const servicePhotosReady = SERVICE_PHOTOS.every((entry) => entry.src);
  const callToAction = (
    <div className="cta-row">
      <Link className="cta" href={href("/contacto")}>
        {s.diag.cta}
      </Link>
    </div>
  );

  return (
    <main id="main" className="pg-home">
      <span id="top" />

      {/* ============================ 1. HERO ============================
          Short on purpose: the eyebrow, the three-clause headline, the result
          sentence, the one action and the risk line land on a 390px screen
          before the visual. Under it, DigitalArc draws the same three clauses. */}
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
              <Link className="cta" href={href("/contacto")}>
                {s.diag.cta}
              </Link>
            </div>
            <p className="hero-risk">{d.hero.risk}</p>
            {/* The trunk test's fourth question, who already uses it, answered
                above the canvas so a 390px phone has all four before a scroll. */}
            <p className="hero-proof">{d.hero.proofLine}</p>
          </div>

          <DigitalArc />
        </div>
      </section>

      {/* ============================ 2. PROOF BAR ============================
          Three named clients with what we actually have: Monte Xanic's real
          number, what was built for En'kanto, and what was built for Dharma
          Ochoa. SectorMap, the valley canvas, draws the home ground under them
          above 900px and lists the same stations as a portrait list below. */}
      <section className="proof" aria-label={d.proof.aria}>
        <div className="container proof-grid proof-grid-3">
          {d.proof.items.map((item, i) =>
            CASE_ROUTES[i] ? (
              <Link className="proof-item" key={item.name} href={href(CASE_ROUTES[i])}>
                {photo(PROOF_PHOTOS[i], "proof-photo")}
                <span className="proof-name">{item.name}</span>
                <span className="proof-place mono">{item.place}</span>
                <p className="proof-result">{item.result}</p>
                <span className="proof-read">{d.proof.read}</span>
              </Link>
            ) : (
              <div className="proof-item proof-item-still" key={item.name}>
                {photo(PROOF_PHOTOS[i], "proof-photo")}
                <span className="proof-name">{item.name}</span>
                <span className="proof-place mono">{item.place}</span>
                <p className="proof-result">{item.result}</p>
              </div>
            ),
          )}
        </div>

        <div className="container proof-map">
          <SectorMap />
        </div>
      </section>

      {/* ============================ 3. THE THREE SERVICES ============================
          Each card is a result headline, one sentence, the entry price read
          out of lib/pricing.ts, and the link to its page. The board under the
          cards (PlayOnceVis) draws the line beneath them: three parts, one
          board. Its strings are `home.vis.board`. */}
      <section className="section services" id="servicios" aria-labelledby="svc-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.services.kicker}</span>
            <h2 id="svc-title">{d.services.title}</h2>
          </div>

          <div className="svc-grid">
            {d.services.items.map((item, i) => (
              <Link className="svc-card" key={item.id} href={href(SERVICE_ROUTES[i])}>
                {servicePhotosReady ? photo(SERVICE_PHOTOS[i], "svc-photo") : null}
                <span className="svc-n mono">{"0" + (i + 1)}</span>
                <span className="svc-name mono">{item.name}</span>
                <h3 className="svc-title">{item.title}</h3>
                <p className="svc-body">{item.body}</p>
                <span className="svc-price mono">{serviceLine[item.id]}</span>
                <span className="svc-cta">{item.cta}</span>
              </Link>
            ))}
          </div>

          <p className="svc-arc">{d.services.arcLine}</p>

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
          <div className="fam-grid fam-grid-4">
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

      {/* ============================ 5. THE CASE ============================
          Two jobs at one winery, side by side, because they are two different
          results (Daniel, 2026-09-30): the finance view that assembles itself,
          with the one measured figure, and the production record that years of
          notebooks became. The clip runs alone under them. */}
      <section className="section case" id="case" aria-labelledby="case-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.xanic.kicker}</span>
            <h2 id="case-title">{d.xanic.title}</h2>
            <p className="section-sub">{d.xanic.body}</p>
          </div>

          <div className="case-two">
            <div className="case-job case-finance">
              <span className="kicker gold">{d.xanic.finance.kicker}</span>
              <h3 className="case-job-title">{d.xanic.finance.title}</h3>
              <p className="case-job-body">{d.xanic.finance.body}</p>
              <dl className="case-stats">
                {d.xanic.stats.map((stat) => (
                  <div className="case-stat" key={stat.k}>
                    <dt className="case-n">{stat.n}</dt>
                    <dd className="case-k mono">{stat.k}</dd>
                  </div>
                ))}
              </dl>
              <p className="case-basis">{d.xanic.basis}</p>
            </div>
            <div className="case-job case-production">
              <span className="kicker gold">{d.xanic.production.kicker}</span>
              <h3 className="case-job-title">{d.xanic.production.title}</h3>
              <p className="case-job-body">{d.xanic.production.body}</p>
              <Media
                slot="home/xanic-cellar"
                src="/media/home/service-software.webp"
                tone="full"
                caption={d.xanic.production.cap}
                alt={d.xanic.production.alt}
              />
            </div>
          </div>

          <Link className="case-read" href={href(CASE_ROUTES[0])}>
            {d.xanic.read}
          </Link>

          <Media
            className="case-clip"
            slot="home/xanic-tank-log"
            src="/media/home/xanic-tank-log.mp4"
            poster="/media/home/xanic-tank-log-poster.webp"
            caption={d.xanic.tankCap}
            alt={d.xanic.tankAlt}
            labels={{ play: d.xanic.play, pause: d.xanic.pause }}
          />
        </div>
      </section>

      {/* ============================ 6. ONE SYSTEM ============================
          HeroAssembly: scattered notebooks, spreadsheets, invoices and
          messages glide into clean rows around one panel. It opened this page
          for a year and it is the argument of this block, drawn. Its strings
          live under `home.vis.hero`. */}
      <section className="section system" id="sistema" aria-labelledby="sys-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.system.kicker}</span>
            <h2 id="sys-title">{d.system.title}</h2>
            <p className="section-sub">{d.system.body}</p>
          </div>
          <HeroAssembly />
          <p className="gets-more">
            <Link href={href("/software")}>{d.system.more}</Link>
          </p>
        </div>
      </section>

      {/* ============================ 7. HOW IT WORKS ============================
          The measurement panel beside the three steps: a reading travels a
          track, passes a gate marked MEASURED, and the caption settles from
          "ten business days" to "the memo, in writing". What it draws is what
          the diagnostic does. Strings are `home.vis.memo`. The `demand-*` and
          `dm-*` class names are the CSS contract in app/globals.css and
          home.css. A portrait twin swaps in under 600px. */}
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
              <p className="how-anywhere">{d.how.anywhere}</p>
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

      {/* ============================ 8. WHO BUILDS IT ============================
          A name, a place and a size. Trust in an owner-run market is personal
          (the books memo, part 4): the person who answers is the person who
          builds, and the site says so once, here. */}
      <section className="section who" aria-labelledby="who-title">
        <div className="container">
          <div className="who-inner">
            <span className="kicker gold">{d.who.kicker}</span>
            <h2 id="who-title">{d.who.title}</h2>
            <p className="who-body">{d.who.body}</p>
          </div>
        </div>
      </section>

      {/* ============================ 9. COMPARE ============================ */}
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

      {/* ============================ 10. PRICING ============================
          Three entry prices, read out of lib/pricing.ts: the smallest website
          package, the local ads scope's flat monthly fee, and the Produccion
          floor. The full card, with the feature lists that produced each
          figure, is /precios. */}
      <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.pricing.kicker}</span>
            <h2 id="pricing-title">{d.pricing.title}</h2>
            <p className="section-sub">{d.pricing.sub}</p>
          </div>

          <dl className="price-lines">
            <div className="price-line">
              <dt>{d.pricing.siteK}</dt>
              <dd>
                <span className="price-from mono">{d.pricing.fromLabel}</span> <b>{siteFrom}</b>
              </dd>
            </div>
            <div className="price-line">
              <dt>{d.pricing.adsK}</dt>
              <dd>
                <b>{adsMonthly}</b> <span className="price-from mono">{d.pricing.perMonth}</span>
              </dd>
            </div>
            <div className="price-line">
              <dt>{d.pricing.softK}</dt>
              <dd>
                <span className="price-from mono">{d.pricing.fromLabel}</span> <b>{softFrom}</b>
              </dd>
            </div>
          </dl>

          <p className="pricing-more">
            <Link href={href("/precios")}>{d.pricing.more}</Link>
          </p>

          <div className="pricing-foot pricing-foot-2">
            {d.pricing.foot.map((item) => (
              <div className="pf-item" key={item.k}>
                <span className="pf-k">{item.k}</span>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          {/* No closing action here: the diagnostic block below carries the
              same button, and a viewport never holds two clay elements. */}
        </div>
      </section>

      {/* ============================ 11. DIAGNOSTIC ============================ */}
      <section className="section diagnostic" id="diagnostic" aria-labelledby="diag-title">
        <div className="container">
          <div className="diag-inner">
            <div className="diag-lead">
              <span className="kicker clay">{s.diag.kicker}</span>
              <h2 id="diag-title">{s.diag.title}</h2>
              <p className="diag-desc">{d.diagnostic.desc}</p>
              <div className="diag-actions">
                <Link className="cta cta-lg" href={href("/contacto")}>
                  {s.diag.cta}
                </Link>
              </div>
              <p className="diag-price">{rich(s.diag.price)}</p>
              <p className="diag-doors">{d.diagnostic.doors}</p>
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
