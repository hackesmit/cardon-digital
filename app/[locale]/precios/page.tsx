import type { Metadata } from "next";
import ModuleFloors from "@/components/pages/precios/ModuleFloors";
import MixExample from "@/components/pages/precios/MixExample";
import PricingDetails from "@/components/pages/precios/PricingDetails";
import Media from "@/components/site/Media";
import Reveal from "@/components/site/Reveal";
import { isLocale, type Locale } from "@/lib/i18n/config";
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
 *
 * Bead hq-4pu0q.7 rewrote the copy against docs/copy-doctrine.md and changed
 * three things about the page itself. One action is repeated verbatim, the
 * Growth Diagnostic in site.ts, in the hero and again at the close, so a reader
 * is asked for one thing rather than four phrasings of it. The two links to
 * /modulos are gone, because the module detail a buyer needs now sits on the
 * floor cards and that page is being retired. And the four-bullet breakdown of
 * the Diagnostic under the closing call to action is a photograph instead: it
 * is the same argument, and a caption is read by about twice as many people as
 * the copy around it.
 */
export default function PreciosPage({ params }: Params) {
  const locale = localeOf(params);
  const d = precios[locale];
  const s = site[locale];
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
                <a className="cta" href={mailto}>
                  {s.diag.cta}
                </a>
                <a className="btn-ghost" href="#floors">
                  {d.hero.ctaFloors}
                </a>
              </div>
              {/* The trunk test's fourth question, "who already uses it",
                  answered above the fold on a phone. Both wineries are named
                  on the site already and each has its own case page. */}
              <p className="hero-proof">{d.hero.proof}</p>
              <p className="brandline">{s.brandline}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHAT OWNERSHIP LOOKS LIKE ================ */}
      {/* The hero promises the winery ends up owning the thing. This is the
          day that promise is kept, so it sits directly under the sentence. */}
      <div className="section pr-shot">
        <div className="container">
          <Reveal>
            <Media
              className="pr-photo"
              slot="precios/handover"
              tone="full"
              priority
              caption={d.media.handoverCap}
              alt={d.media.handoverAlt}
            />
          </Reveal>
        </div>
      </div>

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
                </div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
              <Media
                className="diag-photo"
                slot="precios/diagnostic-session"
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
