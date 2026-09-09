import type { Metadata } from "next";
import Link from "next/link";
import ModuleFloors from "@/components/pages/precios/ModuleFloors";
import MixExample from "@/components/pages/precios/MixExample";
import PricingDetails from "@/components/pages/precios/PricingDetails";
import Reveal from "@/components/site/Reveal";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { precios } from "@/lib/i18n/precios";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
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
 * The pricing page. It is the only page on the site that prints a figure, and
 * every figure it prints is read out of lib/pricing.ts through its functions.
 *
 * What may appear here is pricing-modules.md 8.1: one entry price per module
 * next to the build that produced it, worked examples at the entry size, the
 * combination and annual rules as policy, the terms, and the line that says
 * the Diagnostico sets the quote. Never the per-size table, the hours, the
 * rates, the scope factor, the concession percentages, the build-only prices,
 * the early-exit numbers, or the name of any payment provider.
 */
export default function PreciosPage({ params }: Params) {
  const locale = localeOf(params);
  const d = precios[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-precios">
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
                <a className="cta" href="#floors">
                  {d.hero.ctaFloors}
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

      {/* ==================== THE THREE ENTRY PRICES ==================== */}
      <ModuleFloors locale={locale} />

      {/* ==================== MORE THAN ONE MODULE ===================== */}
      <MixExample locale={locale} />

      {/* ===== THE MONTHLY FEE, THE ANNUAL RULE, ADS, AND THE TERMS ===== */}
      {/* The tail of this page, rendered by the component the showcase home
          renders too (bead hq-wrig5.15), so the terms have one home. */}
      <PricingDetails locale={locale} />

      {/* ============================ DIAGNOSTIC ======================= */}
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
                <p className="diag-desc">{d.close.desc}</p>
                <div className="diag-actions">
                  <a className="cta cta-lg" href={mailto}>
                    {s.diag.cta}
                  </a>
                  <Link className="btn-ghost" href={href("/modulos")}>
                    {d.close.ctaModules}
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
