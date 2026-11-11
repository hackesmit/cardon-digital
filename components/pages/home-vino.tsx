import type { Metadata } from "next";
import Link from "@/components/site/Link";
import Media from "@/components/site/Media";
import Faq from "@/components/site/Faq";
import Reveal from "@/components/site/Reveal";
import { allModules, demoHref } from "@/lib/demo";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { homeVino } from "@/lib/i18n/home-vino";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { BRAND } from "@/lib/brand";
import { currencyByLocale, formatPrice, moduleFloors, type ModuleId } from "@/lib/pricing";
import "@/app/[locale]/services.css";
import "@/app/[locale]/home-vino.css";

type Params = { params: Promise<{ locale: string }> };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

/** The case page behind each proof card, in dictionary order. Routes are not
    copy, so they stay out of lib/i18n. */
const CASE_ROUTES = ["/work/monte-xanic", "/work/enkanto"];

/** The photograph on each proof card, in the same order. */
const PROOF_PHOTOS = [
  { slot: "home/proof-xanic", src: "/media/home/proof-xanic.webp" },
  { slot: "home/proof-enkanto", src: "/media/enkanto/cabana.webp" },
] as const;

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const locale = localeOf(params);
  return pageMetadata(locale, "/", homeVino[locale].meta, true);
}

/**
 * The wine brand's home page (bead hq-3f6ut.2), on the doctrine's order
 * (docs/copy-doctrine.md section 4) cut to what this brand sells: the hero
 * with the answer and both next steps, the two wineries already running it,
 * the three modules with their entry prices, the objections, how it works,
 * the questions (FAQ, with its FAQPage markup) and the diagnostic.
 *
 * It renders inside the service-page styles (services.css, class pg-svc), the
 * same vocabulary /software uses, plus home-vino.css for the hero photograph
 * and the proof cards. It does not load home.css, which is cardondigital.com's
 * home and changes with it.
 *
 * One call to action, `site.diag.cta`, verbatim wherever it appears. The demo
 * is the one other button, quiet, and it opens the demo host in a new tab.
 * Every amount is read from lib/pricing.ts.
 */
export default async function HomeVino(props: Params) {
  const params = await props.params;
  const locale = localeOf(params);
  const d = homeVino[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const cur = currencyByLocale[locale];
  const price = (amount: number) => formatPrice(locale, amount);
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;
  const callToAction = (
    <div className="cta-row">
      <Link className="cta" href={href("/contacto")}>
        {s.diag.cta}
      </Link>
    </div>
  );

  return (
    <main id="main" className="pg-svc pg-vino">
      <span id="top" />

      {/* ============================ HERO ============================
          The eyebrow is the brand and its endorsement, the sub is the
          answer (what, for whom, what next), then the two actions, the risk
          line and who already runs it: all four trunk-test answers before the
          photograph, which a phone shows under them. */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container vino-hero">
          <div className="hero-copy">
            <p className="eyebrow">
              {BRAND.name} {BRAND.endorsement?.[locale]}
            </p>
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
              <a className="btn-ghost" href={demoHref(locale, allModules)} {...external}>
                {d.hero.demo}
              </a>
            </div>
            <p className="hero-risk">{d.hero.risk}</p>
            <p className="hero-proof">{d.hero.proofLine}</p>
          </div>
          <Media
            className="vino-hero-photo"
            slot="software/cellar-laptop"
            src="/media/software/cellar-laptop.webp"
            caption={d.hero.photoCap}
            alt={d.hero.photoAlt}
          />
        </div>
      </section>

      {/* ============================ PROOF ============================ */}
      <section className="section vino-proof" aria-label={d.proof.aria}>
        <div className="container">
          <div className="vino-proof-grid">
            {d.proof.items.map((item, i) => (
              <Link className="vino-proof-item" key={item.name} href={href(CASE_ROUTES[i])}>
                <Media
                  className="vino-proof-photo"
                  slot={PROOF_PHOTOS[i].slot}
                  src={PROOF_PHOTOS[i].src}
                  caption={item.cap}
                  alt={item.alt}
                />
                <span className="vino-proof-name">{item.name}</span>
                <span className="vino-proof-place mono">{item.place}</span>
                <p className="vino-proof-result">{item.result}</p>
                <span className="vino-proof-read">{d.proof.read}</span>
              </Link>
            ))}
          </div>
          <p className="vino-basis">{d.proof.basis}</p>
        </div>
      </section>

      {/* ============================ THE MODULES ============================
          Each card: the outcome, one sentence, the entry price read from
          lib/pricing.ts (setup and monthly of the module bought alone), and
          its own demo. */}
      <section className="section" id="modulos" aria-labelledby="mod-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.modules.kicker}</span>
              <h2 id="mod-title">{d.modules.title}</h2>
              <p className="section-sub">{d.modules.sub}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mod-grid">
              {d.modules.items.map((m) => {
                const floor = moduleFloors[m.id as ModuleId];
                return (
                  <article className="mod" key={m.id}>
                    <span className="mod-name">{m.name}</span>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                    <p className="vino-mod-price mono">
                      {d.modules.from} {price(floor.setup[cur])},{" "}
                      {d.modules.monthly.replace("{amount}", price(floor.monthly[cur]))}
                    </p>
                    <a className="mod-demo" href={demoHref(locale, [m.id as ModuleId])} {...external}>
                      {d.modules.demo}
                    </a>
                  </article>
                );
              })}
            </div>
          </Reveal>
          <Reveal>
            <p className="more-link vino-more">
              <Link href={href("/software")}>{d.modules.more}</Link>
              <Link href={href("/precios")}>{d.modules.prices}</Link>
            </p>
          </Reveal>
          {callToAction}
        </div>
      </section>

      {/* ============================ SOUND FAMILIAR ============================ */}
      <section className="section" aria-labelledby="fam-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">{d.familiar.kicker}</span>
              <h2 id="fam-title">{d.familiar.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="fam-grid">
              {d.familiar.items.map((item) => (
                <div className="fam-item" key={item.q}>
                  {/* Quoted, because it is the owner speaking. */}
                  <blockquote className="fam-q">
                    <p>{item.q}</p>
                  </blockquote>
                  <p className="fam-a">{item.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.how.kicker}</span>
              <h2 id="how-title">{d.how.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <ol className="steps">
              {d.how.steps.map((step) => (
                <li className="step" key={step.k}>
                  <span className="step-n mono">{step.k}</span>
                  <p className="step-body">{step.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <div className="section">
        <Faq title={d.faq.title} items={d.faq.items} />
      </div>

      {/* ============================ DIAGNOSTIC ============================ */}
      <section className="section diagnostic" id="diagnostic" aria-labelledby="diag-title">
        <div className="container">
          <Reveal>
            <div className="diag-inner">
              <div className="diag-lead">
                <span className="kicker clay">{s.diag.kicker}</span>
                <h2 id="diag-title">{s.diag.title}</h2>
                <p className="diag-desc">{d.diagDesc}</p>
                <div className="diag-actions">
                  <Link className="cta cta-lg" href={href("/contacto")}>
                    {s.diag.cta}
                  </Link>
                </div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
