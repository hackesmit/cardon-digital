import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/site/Faq";
import Media from "@/components/site/Media";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/site/Reveal";
import SiteRise from "@/components/pages/services/SiteRise";
import WebPackages from "@/components/pages/precios/WebPackages";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { sitios } from "@/lib/i18n/sitios";
import { webPackages } from "@/lib/pricing";
import { ldGraph, serviceLd } from "@/lib/seo/jsonld";
import "../services.css";
import "./sitios.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/sitios-web", sitios[locale].meta);
}

/**
 * The websites service page, answer first (AEO spec, bead hq-i4b5.6): the
 * hero's sub is a 40 to 60 word answer that names the business, and the
 * Service markup describes the page in those same words. Then the four things
 * a site has to do, showing up in AI answers (the one place AEO is named), the
 * packages by feature with every figure read out of lib/pricing.ts, how it
 * works, the objections, the FAQ with its FAQPage markup, and the diagnostic
 * close. One action, site.diag.cta, repeated verbatim.
 */
export default function SitiosPage({ params }: Params) {
  const locale = localeOf(params);
  const d = sitios[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  // The delivery answer reads its range out of the packages, like the table.
  const days = {
    min: String(Math.min(...webPackages.map((p) => p.deliveryDays.min))),
    max: String(Math.max(...webPackages.map((p) => p.deliveryDays.max))),
  };
  const faqItems = d.faq.items.map((it) => ({
    question: it.question,
    answer: it.answer.replace("{min}", days.min).replace("{max}", days.max),
  }));
  const cta = (
    <div className="cta-row">
      <Link className="cta" href={href("/contacto")}>
        {s.diag.cta}
      </Link>
    </div>
  );

  return (
    <main id="main" className="pg-svc pg-sitios">
      <span id="top" />
      <JsonLd data={ldGraph([serviceLd(d.hero.eyebrow, d.hero.sub, href("/sitios-web"))])} />

      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <Reveal>
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
                <a className="btn-ghost" href="#paquetes">
                  {d.packages.kicker}
                </a>
              </div>
              <p className="hero-proof">{d.hero.proof}</p>
            </div>
          </Reveal>
          <SiteRise />
        </div>
      </section>

      {/* The one link to the style samples: four invented businesses, four looks. */}
      <div className="styles-band">
        <div className="container">
          <Link className="styles-link" href={href("/estilos")}>
            <span className="styles-line">{d.styles.line}</span>
            <span className="styles-go">{d.styles.cta}</span>
          </Link>
        </div>
      </div>

      {/* A recent client site, as screenshots of the live page: what a site
          from this service looks like, before the packages. */}
      <section className="section" id="ejemplo" aria-labelledby="ex-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.example.kicker}</span>
              <h2 id="ex-title">{d.example.title}</h2>
              <p className="section-sub">{d.example.body}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="ex-grid">
              <Media
                className="ex-desktop"
                slot="sitios/aperta-desktop"
                tone="full"
                src="/media/sitios/aperta-desktop.webp"
                caption={d.example.desktopCap}
                alt={d.example.desktopAlt}
              />
              <Media
                className="ex-phone"
                slot="sitios/aperta-phone"
                tone="full"
                src="/media/sitios/aperta-phone.webp"
                caption={d.example.phoneCap}
                alt={d.example.phoneAlt}
              />
            </div>
            <a className="ex-link" href="https://aperta-media.vercel.app/" target="_blank" rel="noopener noreferrer">
              {d.example.link}
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section" id="resultado" aria-labelledby="res-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.gets.kicker}</span>
              <h2 id="res-title">{d.gets.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="res-grid">
              {d.gets.items.map((item) => (
                <div className="res-item" key={item.num}>
                  <span className="res-num">{item.num}</span>
                  <h3>{item.h}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          {cta}
        </div>
      </section>

      <section className="section ai-answers" id="respuestas-ia" aria-labelledby="ai-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.ai.kicker}</span>
              <h2 id="ai-title">{d.ai.title}</h2>
              <p className="section-sub">{d.ai.lead}</p>
            </div>
          </Reveal>
          <Reveal>
            <h3 className="ai-list-title">{d.ai.listTitle}</h3>
            <ul className="ai-list">
              {d.ai.items.map((item) => (
                <li className="ai-item" key={item.h}>
                  <h4>{item.h}</h4>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
            <p className="ai-honest">{d.ai.honest}</p>
          </Reveal>
        </div>
      </section>

      <WebPackages locale={locale} />

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
                  <blockquote className="fam-q">
                    <p>{item.q}</p>
                  </blockquote>
                  <p className="fam-a">{item.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
          {/* No closing action here: the diagnostic block below carries the
              same button, and a viewport never holds two clay elements. */}
        </div>
      </section>

      <div className="section sitios-faq">
        <Faq title={d.faq.title} items={faqItems} />
        <p className="faq-more">
          <Link href={href("/precios")}>{d.faq.more}</Link>
        </p>
      </div>

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
