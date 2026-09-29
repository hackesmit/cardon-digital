import type { Metadata } from "next";
import Link from "next/link";
import AdsFee from "@/components/pages/precios/AdsFee";
import ModuleFloors from "@/components/pages/precios/ModuleFloors";
import MixExample from "@/components/pages/precios/MixExample";
import PricingDetails from "@/components/pages/precios/PricingDetails";
import WebPackages from "@/components/pages/precios/WebPackages";
import Media from "@/components/site/Media";
import Reveal from "@/components/site/Reveal";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { precios } from "@/lib/i18n/precios";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "../services.css";
import "./precios.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/precios", precios[locale].meta);
}

/**
 * The pricing page, the one page that prints figures, and every figure it
 * prints is read out of lib/pricing.ts. Since the arc of 2026-09-28 it
 * carries the three services in the order the site sells them: the website
 * packages by feature (WebPackages, shared with /sitios-web), ad management
 * at a flat fee (AdsFee, shared with /anuncios), and the software modules
 * (the floors, the combinations, the monthly, the terms, unchanged). Between
 * the terms and the close, four things that are never on the invoice.
 *
 * What may appear for the modules is still pricing-modules.md 8.1: one entry
 * price per module next to the build that produced it, worked examples at the
 * entry size, the combination and annual rules as policy, the terms, and the
 * line that says the Diagnostico sets the quote. Never the per-size table.
 */
export default function PreciosPage({ params }: Params) {
  const locale = localeOf(params);
  const d = precios[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);

  return (
    <main id="main" className="pg-svc pg-precios">
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
                <Link className="cta" href={href("/contacto")}>
                  {s.diag.cta}
                </Link>
                <a className="btn-ghost" href="#paquetes">
                  {d.hero.ctaFloors}
                </a>
              </div>
              <p className="hero-proof">{d.hero.proof}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ WEBSITES ============================ */}
      <WebPackages
        locale={locale}
        kicker={d.hero.web.kicker}
        more={{ href: href("/sitios-web"), label: d.hero.web.more }}
      />

      {/* ============================ ADS ============================ */}
      <AdsFee
        locale={locale}
        kicker={d.hero.adsHead.kicker}
        more={{ href: href("/anuncios"), label: d.hero.adsHead.more }}
      />

      {/* ============================ SOFTWARE ============================ */}
      <section className="section pr-software-head" id="software" aria-labelledby="sw-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.hero.softwareHead.kicker}</span>
              <h2 id="sw-title">{d.hero.softwareHead.title}</h2>
              <p className="section-sub">{d.hero.softwareHead.sub}</p>
            </div>
            <p className="more-link">
              <Link href={href("/software")}>{d.hero.softwareHead.more}</Link>
            </p>
          </Reveal>
          <Reveal>
            {/* The day the ownership promise is kept, under the sentence that makes it. */}
            <Media
              className="pr-photo"
              slot="precios/handover"
              src="/media/precios/handover.webp"
              tone="full"
              priority
              caption={d.media.handoverCap}
              alt={d.media.handoverAlt}
            />
          </Reveal>
        </div>
      </section>

      <ModuleFloors locale={locale} />
      <MixExample locale={locale} />
      <PricingDetails locale={locale} />

      {/* The founding-client slot (BUSINESS-PLAN.md 5.4), one winery, through 31 December 2026. */}
      <section className="section pr-founding" aria-label={d.hero.softwareHead.founding.kicker}>
        <div className="container">
          <Reveal>
            <div className="founding">
              <span className="kicker clay">{d.hero.softwareHead.founding.kicker}</span>
              <p className="founding-lead">{rich(d.hero.softwareHead.founding.lead)}</p>
              <p className="founding-body">{d.hero.softwareHead.founding.body}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ WHAT WE DO NOT DO ============================ */}
      <section className="section pr-notdo" aria-labelledby="notdo-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">{d.hero.notDo.kicker}</span>
              <h2 id="notdo-title">{d.hero.notDo.title}</h2>
            </div>
            <ul className="notdo-list">
              {d.hero.notDo.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============================ DIAGNOSTIC ============================ */}
      <section className="section diagnostic" id="diagnostic" aria-labelledby="diag-title">
        <div className="container">
          <Reveal>
            <div className="diag-inner diag-inner-photo">
              <div className="diag-lead">
                <span className="kicker clay">{s.diag.kicker}</span>
                <h2 id="diag-title">{s.diag.title}</h2>
                <p className="diag-desc">{d.close.desc}</p>
                <div className="diag-actions">
                  <Link className="cta cta-lg" href={href("/contacto")}>
                    {s.diag.cta}
                  </Link>
                </div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
              <Media
                className="diag-photo"
                slot="precios/diagnostic-session"
                src="/media/precios/diagnostic-session.webp"
                caption={d.media.diagCap}
                alt={d.media.diagAlt}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
