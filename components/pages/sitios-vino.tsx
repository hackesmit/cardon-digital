import type { Metadata } from "next";
import Link from "@/components/site/Link";
import Faq from "@/components/site/Faq";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/site/Reveal";
import WebPackages from "@/components/pages/precios/WebPackages";
import { BRAND } from "@/lib/brand";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { fillSitiosVino, sitiosVino, sitiosVinoMeta } from "@/lib/i18n/sitios-vino";
import { ldGraph, serviceLd } from "@/lib/seo/jsonld";
import "@/app/[locale]/services.css";
import "@/app/[locale]/sitios-vino.css";

type Params = { params: Promise<{ locale: string }> };

const PATH = "/sitios-web";

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const locale = localeOf(await props.params);
  return pageMetadata(locale, PATH, sitiosVinoMeta(locale, BRAND.name));
}

/**
 * The wine brand's website page (bead hq-60dkt), the page the winery outreach
 * emails link to. Answer first: what we fix on a winery's site, then the
 * packages for the winery that has none (the shared WebPackages list, every
 * figure from lib/pricing.ts), the winery we fixed (the En'kanto case, already
 * on this site), how it works, the questions with their FAQPage markup, and
 * one way to answer. One action, hero.cta, to the contact page.
 */
export default async function SitiosVino(props: Params) {
  const locale = localeOf(await props.params);
  const d = sitiosVino[locale];
  const fill = (s: string) => fillSitiosVino(locale, s, BRAND.name);
  const href = (path: string) => localePath(locale, path);
  const sub = fill(d.hero.sub);
  const faqItems = d.faq.items.map((it) => ({ question: it.question, answer: fill(it.answer) }));
  const cta = (
    <Link className="cta" href={href("/contacto")}>
      {d.hero.cta}
    </Link>
  );

  return (
    <main id="main" className="pg-svc pg-sitios-vino">
      <span id="top" />
      <JsonLd data={ldGraph([serviceLd(d.hero.eyebrow, sub, href("/sitios-web"))])} />

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
              <p className="hero-sub">{sub}</p>
              <div className="hero-actions">{cta}</div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="arreglos" aria-labelledby="fix-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.fixes.kicker}</span>
              <h2 id="fix-title">{d.fixes.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <ul className="wf-list">
              {d.fixes.items.map((it) => (
                <li className="wf-item" key={it.problem}>
                  <p className="wf-problem">{it.problem}</p>
                  <p className="wf-fix">{it.fix}</p>
                </li>
              ))}
            </ul>
            <p className="wf-note">{d.fixes.note}</p>
          </Reveal>
        </div>
      </section>

      <WebPackages locale={locale} kicker={d.none.kicker} />

      <section className="section" aria-labelledby="proof-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.proof.kicker}</span>
              <h2 id="proof-title" className="wf-proof">{d.proof.title}</h2>
            </div>
            <p className="more-link">
              <Link href={href("/work/enkanto")}>{d.proof.link}</Link>
            </p>
          </Reveal>
        </div>
      </section>

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
        <Faq title={d.faq.title} items={faqItems} />
      </div>

      <section className="section diagnostic" id="contacto" aria-labelledby="close-title">
        <div className="container">
          <Reveal>
            <div className="diag-inner">
              <div className="diag-lead">
                <h2 id="close-title">{d.close.title}</h2>
                <div className="diag-actions">{cta}</div>
                <p className="wf-optout">{d.close.optout}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

