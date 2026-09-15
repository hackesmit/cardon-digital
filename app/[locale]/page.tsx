import type { Metadata } from "next";
import Link from "next/link";
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
          Copy only, and short on purpose: on a 390px screen the headline, the
          result, the action and the first proof card all have to land without
          a scroll (the four-second test). A visual here would push the proof
          below the fold, so the photography starts at the case study. */}
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
        </div>
      </section>

      {/* ============================ 2. PROOF BAR ============================
          Both wineries named with what we actually have: Monte Xanic's real
          numbers, and for En'kanto what was built, because no En'kanto figure
          has been measured and published yet. */}
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

          <p className="gets-more">
            <Link href={href("/modulos")}>{d.gets.more}</Link>
          </p>

          {callToAction}
        </div>
      </section>

      {/* ============================ 6. HOW IT WORKS ============================ */}
      <section className="section how" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{d.how.kicker}</span>
            <h2 id="how-title">{d.how.title}</h2>
          </div>
          <ol className="steps">
            {d.how.steps.map((step) => (
              <li className="step" key={step.k}>
                <span className="step-n mono">{step.k}</span>
                <p className="step-body">{step.body}</p>
              </li>
            ))}
          </ol>
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
                    <Mark kind="yes" label={d.compare.yes} />
                    {row.cardon}
                  </p>
                </div>
                <div className="cmp-cell cmp-usual">
                  <span className="cmp-tag">{d.compare.usual}</span>
                  <p>
                    <Mark kind="no" label={d.compare.no} />
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
