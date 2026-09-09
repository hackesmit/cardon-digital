import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import { localePath, type Locale } from "@/lib/i18n/config";
import { rich } from "@/lib/i18n/rich";
import { showcase } from "@/lib/i18n/showcase";
import { site } from "@/lib/i18n/site";

/**
 * The temporary showcase home (bead hq-wrig5.3). Four sections: the three
 * modules named, a demo button per module, how pricing works, and the
 * diagnostic. It renders only when SHOWCASE=1; see components/pages/showcase/
 * flag.ts and app/[locale]/page.tsx.
 *
 * No figure appears here. An entry price never travels away from the feature
 * list that produced it (pricing-features.md 3.7 rule 3, pricing-modules.md
 * 8.1), and that list is printed on /precios, so this page carries the fee
 * shape and the combination and annual rules as policy and links to the
 * figures. This is the same rule the official home already follows.
 */

/* The demo host is not live yet (epic hq-ko3a0). Until it is, every demo
   button points at the placeholder path and says so, one module per link, so
   the hrefs only need their host swapped when the demo ships. Same constant
   and same label as /modulos, on purpose. */
const DEMO_PATH = "/demo";

export default function Showcase({ locale }: { locale: Locale }) {
  const d = showcase[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-showcase">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <Reveal>
            <div className="hero-copy">
              <p className="eyebrow">{d.hero.eyebrow}</p>
              <h1>
                {d.hero.t1}
                <br />
                <span className="accent">{d.hero.accent}</span>
              </h1>
              <p className="hero-sub">{rich(d.hero.sub)}</p>
              <div className="hero-actions">
                <a className="cta" href="#demos">
                  {d.hero.ctaDemos}
                </a>
                <Link className="btn-ghost" href={href("/modulos")}>
                  {d.hero.ctaModules}
                </Link>
              </div>
              <p className="brandline">{s.brandline}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== THE MODULES, AND THEIR DEMOS ==================== */}
      <section className="section sc-demos" id="demos" aria-labelledby="demos-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.demos.kicker}</span>
              <h2 id="demos-title">{d.demos.title}</h2>
              <p className="section-sub">{rich(d.demos.sub)}</p>
            </div>
          </Reveal>

          <div className="sc-grid">
            {d.demos.modules.map((m, i) => (
              <Reveal delay={i * 70} key={m.id}>
                <article className="sc-card">
                  <span className="sc-num mono">{m.num}</span>
                  <h3 className="sc-name">{m.name}</h3>
                  <p className="sc-tag">{m.tag}</p>
                  <p className="sc-line">{m.line}</p>
                  <Link className="sc-demo-btn" href={href(DEMO_PATH)}>
                    <span>{m.demo}</span>
                    <span className="sc-soon mono">{d.demos.soon}</span>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="sc-note">{rich(d.demos.note)}</p>
          </Reveal>

          <Reveal>
            <p className="sc-more">
              {d.demos.modulesLead}{" "}
              <Link href={href("/modulos")}>{d.demos.modulesCta}</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ==================== HOW PRICING WORKS ==================== */}
      <section className="section sc-pricing" id="precios" aria-labelledby="sc-pricing-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">{d.pricing.kicker}</span>
              <h2 id="sc-pricing-title">{d.pricing.title}</h2>
              <p className="section-sub">{rich(d.pricing.sub)}</p>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <ol className="sc-rules">
              {d.pricing.rules.map((rule) => (
                <li key={rule}>{rich(rule)}</li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={60}>
            <div className="sc-pricing-foot">
              <p className="sc-note">{rich(d.pricing.note)}</p>
              <Link className="cta" href={href("/precios")}>
                {d.pricing.cta}
              </Link>
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
                <span className="kicker clay">{s.diag.kicker}</span>
                <h2 id="diag-title">{s.diag.title}</h2>
                <p className="diag-desc">{rich(d.close.desc)}</p>
                <div className="diag-actions">
                  <a className="cta cta-lg" href={mailto}>
                    {s.diag.cta}
                  </a>
                  <Link className="btn-ghost" href={href("/contacto")}>
                    {d.close.ctaContact}
                  </Link>
                </div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
              <div className="diag-specs">
                {d.close.specs.map((spec) => (
                  <div className="spec" key={spec}>
                    <span className="spec-dot" />
                    <span>{rich(spec)}</span>
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
