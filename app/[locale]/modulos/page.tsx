import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import ModuleBlock from "@/components/pages/modulos/ModuleBlock";
import Combinations from "@/components/pages/modulos/Combinations";
import { demoHref } from "@/lib/demo";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { modulos } from "@/lib/i18n/modulos";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import type { ModuleId } from "@/lib/pricing";
import "./modulos.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/modulos", modulos[locale].meta);
}

export default function ModulosPage({ params }: Params) {
  const locale = localeOf(params);
  const d = modulos[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-modulos">
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
                <a className="cta" href="#combina">
                  {d.hero.ctaCombina}
                </a>
                <Link className="btn-ghost" href={href("/precios")}>
                  {d.priceCta}
                </Link>
              </div>
              <p className="brandline">{s.brandline}</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="mod-price-line">{rich(d.priceLine)}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================ THE THREE MODULES ============================ */}
      {/* One block per module, rendered by the component the showcase home
          renders too (bead hq-wrig5.15), so the description has one home. */}
      {d.modules.map((m, i) => (
        <ModuleBlock
          key={m.id}
          locale={locale}
          module={m}
          alt={i % 2 === 1}
          demoHref={demoHref(locale, [m.id as ModuleId])}
        />
      ))}

      {/* ============================ THE SEVEN COMBINATIONS ============================ */}
      <Combinations locale={locale} />

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
                <p className="diag-desc">{rich(d.diagDesc)}</p>
                <div className="diag-actions">
                  <a className="cta cta-lg" href={mailto}>
                    {s.diag.cta}
                  </a>
                  <Link className="btn-ghost" href={href("/precios")}>
                    {d.priceCta}
                  </Link>
                </div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
              <div className="diag-specs">
                {d.diagSpecs.map((spec, i) => (
                  <div className="spec" key={i}>
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
