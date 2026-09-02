import type { Metadata } from "next";
import Link from "next/link";
import HeroAssembly from "@/components/pages/home/HeroAssembly";
import OpsCompression from "@/components/pages/home/OpsCompression";
import PlayOnceVis from "@/components/pages/home/PlayOnceVis";
import SectorMap from "@/components/pages/home/SectorMap";
import SpotlightFrames from "@/components/pages/home/SpotlightFrames";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { home } from "@/lib/i18n/home";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { formatAmount, formatMoney, pricingFor, tierOrder } from "@/lib/pricing";
import "./home.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/", home[locale].meta, true);
}

export default function Home({ params }: Params) {
  const locale = localeOf(params);
  const d = home[locale];
  const s = site[locale];
  const price = pricingFor(locale);
  const href = (path: string) => localePath(locale, path);
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);
  const monthly = (amount: number) =>
    price.placeholder
      ? d.pricing.tbdMonthly
      : d.pricing.perMonth.replace("{amount}", formatMoney(locale, amount));
  const adsPrice = price.placeholder
    ? d.pricing.tbdFloor
    : d.pricing.perMonth.replace("{amount}", formatMoney(locale, price.ads.from));
  const footPrices = [monthly(price.care.from), adsPrice, ""];

  return (
    <main id="main" className="pg-home">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1>
              {d.hero.title}
              <br />
              <span className="accent">{d.hero.titleAccent}</span>
            </h1>
            <p className="hero-sub">{rich(d.hero.sub)}</p>
            <div className="hero-actions">
              <a className="cta" href="#diagnostic">
                {d.hero.cta}
              </a>
              <a className="btn-ghost" href="#operations">
                {d.hero.ctaGhost}
              </a>
            </div>
            <p className="brandline">{s.brandline}</p>
          </div>

          <HeroAssembly />
        </div>
      </section>

      {/* ============================ VALUE STRIP ============================ */}
      <section className="value" aria-label={d.value.aria}>
        <h2 className="sr-only">{d.value.srTitle}</h2>
        <div className="container value-grid">
          {d.value.items.map((item) => (
            <div className="value-item" key={item.key}>
              <span className="value-key">{item.key}</span>
              <p className="value-lead">{rich(item.lead, { hl: "cool" })}</p>
              <p className="value-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ OPERATIONS ============================ */}
      <section className="section" id="operations" aria-labelledby="ops-title">
        <div className="container">
          <div className="split reverse">
            <div className="split-copy">
              <span className="kicker gold">{d.operations.kicker}</span>
              <h2 id="ops-title">{d.operations.title}</h2>
              <p className="section-sub">{rich(d.operations.sub)}</p>
              <p className="note">{rich(d.operations.note)}</p>
            </div>
            <div className="split-vis">
              <OpsCompression />
            </div>
          </div>
        </div>
      </section>

      {/* ============================ TOOLS ============================ */}
      <section className="section" id="tools" aria-labelledby="tools-title">
        <div className="container">
          <div className="split">
            <div className="split-copy">
              <span className="kicker">{d.tools.kicker}</span>
              <h2 id="tools-title">{d.tools.title}</h2>
              <p className="section-sub">{rich(d.tools.sub1)}</p>
              <p className="section-sub">{rich(d.tools.sub2)}</p>
              <p className="note">{rich(d.tools.note)}</p>
            </div>
            <div className="split-vis">
              <PlayOnceVis className="tools-vis" tag={d.tools.visTag}>
                <svg
                  className="tools-svg"
                  viewBox="0 0 520 250"
                  role="img"
                  aria-label={d.tools.visAria}
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
            </div>
          </div>
        </div>
      </section>

      {/* ============================ DEMAND ============================ */}
      <section className="section" id="services" aria-labelledby="demand-title">
        <div className="container">
          <div className="split">
            <div className="split-copy">
              <span className="kicker">{d.demand.kicker}</span>
              <h2 id="demand-title">{d.demand.title}</h2>
              <p className="section-sub">{rich(d.demand.sub)}</p>
              <p className="note">{rich(d.demand.note)}</p>
            </div>
            <div className="split-vis">
              <PlayOnceVis className="demand-vis" tag={d.demand.visTag}>
                <svg
                  className="demand-svg demand-svg-d"
                  viewBox="0 0 520 300"
                  role="img"
                  aria-label={d.demand.visAria}
                >
                  <text
                    className="dm-in-lab mono"
                    x="46"
                    y="120"
                    fontSize="11"
                    letterSpacing="1.5"
                  >{d.demand.signalIn}</text>
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
                  >{d.demand.measured}</text>
                  <g className="dm-knob">
                    <circle className="dm-knob-halo" cx="60" cy="150" r="14" />
                    <circle className="dm-knob-core" cx="60" cy="150" r="6" />
                  </g>
                  <g className="dm-badge">
                    <circle className="dm-badge-ring" cx="360" cy="96" r="16" />
                    <path className="dm-badge-check" d="M352 96 L358 102 L369 90" />
                  </g>
                  <text
                    className="dm-lab-pre mono"
                    x="60"
                    y="250"
                    fontSize="14"
                    letterSpacing="0.5"
                  >{d.demand.checking}</text>
                  <text
                    className="dm-lab-ok mono"
                    x="60"
                    y="250"
                    fontSize="14"
                    letterSpacing="0.5"
                  >{d.demand.verified}</text>
                  <text
                    className="dm-value mono"
                    x="440"
                    y="120"
                    textAnchor="end"
                    fontSize="13"
                    fontWeight="600"
                  >{d.demand.reading}</text>
                  <text
                    className="dm-fee mono"
                    x="60"
                    y="278"
                    fontSize="11"
                    letterSpacing="0.8"
                  >{d.demand.fee}</text>
                </svg>

                <svg
                  className="demand-svg demand-svg-m"
                  viewBox="0 0 360 340"
                  role="img"
                  aria-label={d.demand.visAria}
                >
                  <text
                    className="dm-in-lab mono"
                    x="30"
                    y="120"
                    fontSize="13"
                    letterSpacing="1.5"
                  >{d.demand.signalIn}</text>
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
                  >{d.demand.measured}</text>
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
                  >{d.demand.reading}</text>
                  <text
                    className="dm-lab-pre mono"
                    x="24"
                    y="268"
                    fontSize="16"
                    letterSpacing="0.4"
                  >{d.demand.checking}</text>
                  <text
                    className="dm-lab-ok mono"
                    x="24"
                    y="268"
                    fontSize="16"
                    letterSpacing="0.4"
                  >{d.demand.verified}</text>
                  <text
                    className="dm-fee mono"
                    x="24"
                    y="304"
                    fontSize="12"
                    letterSpacing="0.2"
                  >{d.demand.fee}</text>
                </svg>
              </PlayOnceVis>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ COMPARE ============================ */}
      <section className="section compare" id="compare" aria-labelledby="compare-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.compare.kicker}</span>
            <h2 id="compare-title">{d.compare.title}</h2>
            <p className="section-sub">{d.compare.sub}</p>
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
                  <p>{row.cardon}</p>
                </div>
                <div className="cmp-cell cmp-usual">
                  <span className="cmp-tag">{d.compare.usual}</span>
                  <p>{row.usual}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="cmp-foot">
            {d.compare.footBefore}
            <a href="#diagnostic">{d.compare.footLink}</a>
            {d.compare.footAfter}
          </p>
        </div>
      </section>

      {/* ============================ MAP OF SECTORS ============================ */}
      <section className="section sectors" id="sectors" aria-labelledby="sectors-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker gold">{d.sectors.kicker}</span>
            <h2 id="sectors-title">{d.sectors.title}</h2>
            <p className="section-sub">{d.sectors.sub}</p>
          </div>

          {/* Winery-led (2026-09-02): the winery is the practice, so it leads
              this section as its own card and the other industries sit below
              the map as a secondary list. */}
          <Link className="sector-lead" href={href("/industries/winery")}>
            <span className="sector-lead-kicker">{d.sectors.leadKicker}</span>
            <h3 className="sector-lead-title">{d.sectors.leadTitle}</h3>
            <p className="sector-lead-body">{d.sectors.leadBody}</p>
            <span className="sector-lead-cta">{d.sectors.leadCta}</span>
          </Link>

          <SectorMap />

          <div className="sector-secondary">
            <span className="sector-secondary-label">
              {d.sectors.secondaryLabel}
            </span>
            <nav className="sector-secondary-list" aria-label={d.sectors.secondaryLabel}>
              <Link href={href("/industries/construction")}>
                {s.nav.construction}
              </Link>
              <Link href={href("/industries/hiring")}>{s.nav.hiring}</Link>
              <Link href={href("/industries/restaurants")}>
                {s.nav.restaurants}
              </Link>
              <Link href={href("/industries/clinics")}>{s.nav.clinics}</Link>
            </nav>
            <p className="sector-secondary-note">{d.sectors.secondaryNote}</p>
          </div>

          <p className="sectors-foot mono">{rich(d.sectors.foot)}</p>
        </div>
      </section>

      {/* ============================ PRICING ============================ */}
      <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.pricing.kicker}</span>
            <h2 id="pricing-title">{d.pricing.title}</h2>
            <p className="section-sub">{rich(d.pricing.sub)}</p>
          </div>

          <div className="tiers">
            {d.pricing.tiers.map((tier, i) => (
              <div
                className={"tier" + (i === 1 ? " tier-lead" : "")}
                key={tier.name}
              >
                <span className="tier-n">{tier.n}</span>
                <h3 className="tier-name">{tier.name}</h3>
                <p className="tier-price">
                  {price.placeholder ? (
                    <span className="tier-tbd">{d.pricing.tbd}</span>
                  ) : (
                    <>
                      {d.pricing.from}{" "}
                      <b>
                        {"$" +
                          formatAmount(price.tiers[tierOrder[i]].from, locale)}
                      </b>{" "}
                      <span className="tier-cur">{price.currency}</span>
                    </>
                  )}
                </p>
                <p className="tier-time">{tier.time}</p>
                <p className="tier-body">{tier.body}</p>
              </div>
            ))}
          </div>

          <div className="pricing-foot">
            {d.pricing.foot.map((item, i) => (
              <div className="pf-item" key={item.k}>
                <span className="pf-k">{item.k}</span>
                <p>{rich(item.body.replace("{price}", footPrices[i]))}</p>
              </div>
            ))}
          </div>

          <div className="founding">
            <span className="kicker clay">{d.pricing.founding.kicker}</span>
            <p className="founding-lead">{rich(d.pricing.founding.lead)}</p>
            <p className="founding-body">{d.pricing.founding.body}</p>
          </div>
        </div>
      </section>

      {/* ============================ DIAGNOSTIC ============================ */}
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
            <div className="diag-specs">
              {d.diagnostic.specs.map((spec, i) => (
                <div className="spec" key={i}>
                  <span className="spec-dot" />
                  <span>{rich(spec)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SpotlightFrames />
    </main>
  );
}
