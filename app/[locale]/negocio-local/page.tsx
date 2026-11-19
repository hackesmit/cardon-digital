import type { Metadata } from "next";
import Link from "@/components/site/Link";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/site/Reveal";
import { whatsappHref } from "@/lib/contact/links";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { LOCAL_PACKAGE as PACKAGE, fillLocal, negocioLocal, negocioLocalMeta } from "@/lib/i18n/negocio-local";
import { sitios } from "@/lib/i18n/sitios";
import { currencyByLocale, formatPrice } from "@/lib/pricing";
import { ldGraph, serviceLd } from "@/lib/seo/jsonld";
import "../services.css";
import "./negocio-local.css";

type Params = { params: Promise<{ locale: string }> };

const PATH = "/negocio-local";

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

const filler = (locale: Locale) => (s: string) => fillLocal(locale, s);

export async function generateMetadata(props: Params): Promise<Metadata> {
  const locale = localeOf(await props.params);
  return pageMetadata(locale, PATH, negocioLocalMeta(locale));
}

/**
 * The page for a local business with no website yet (bead hq-4l9oj). The
 * no-website outreach emails land here, so it answers three things in order:
 * what the owner gets, what it costs, and how to say yes. The offer is the
 * one-page package (presencia in lib/pricing.ts); every figure and every
 * feature name is read from there and from lib/i18n/sitios.ts. The doors are
 * WhatsApp, when this build has a number, and the contact page.
 */
export default async function NegocioLocalPage(props: Params) {
  const locale = localeOf(await props.params);
  const d = negocioLocal[locale];
  const pk = sitios[locale].packages;
  const fill = filler(locale);
  const cur = currencyByLocale[locale];
  const wa = whatsappHref(process.env.NEXT_PUBLIC_WHATSAPP, d.prefill);
  const contact = localePath(locale, "/contacto");

  const doors = (
    <div className="hero-actions">
      {wa ? (
        <a className="cta" href={wa} target="_blank" rel="noopener noreferrer">
          {d.hero.whatsapp}
        </a>
      ) : null}
      <Link className={wa ? "btn-ghost" : "cta"} href={contact}>
        {d.hero.write}
      </Link>
    </div>
  );

  return (
    <main id="main" className="pg-svc pg-local">
      <span id="top" />
      <JsonLd data={ldGraph([serviceLd(d.meta.title, negocioLocalMeta(locale).description, localePath(locale, PATH))])} />

      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <Reveal>
            <div className="hero-copy">
              <p className="eyebrow">{d.hero.eyebrow}</p>
              <h1>
                {d.hero.title}
                <br />
                <span className="accent">{fill(d.hero.titleAccent)}</span>
              </h1>
              <p className="hero-sub">{d.hero.sub}</p>
              {doors}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="recibe" aria-labelledby="gets-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.gets.kicker}</span>
              <h2 id="gets-title">{d.gets.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <ul className="local-feats">
              {PACKAGE.features.map((f) => {
                const label = pk.features[f];
                if (!label) throw new Error(`negocio-local: no ${locale} name for feature ${f}`);
                return <li key={f}>{label}</li>;
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" id="precio" aria-labelledby="price-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.price.kicker}</span>
              <h2 id="price-title" className="local-price">
                <span className="local-from mono">{d.price.from}</span>{" "}
                {formatPrice(locale, PACKAGE.from[cur])}
              </h2>
              <p className="section-sub">{fill(d.price.line)}</p>
            </div>
          </Reveal>
          <Reveal>
            <p className="local-care">
              <span className="mono">{pk.careLabel}</span>{" "}
              <b>{fill("{care}")}</b> <span className="mono">{pk.perMonth}</span>{" "}
              <span className="local-care-body">{pk.careBody}</span>
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

      <section className="section" aria-labelledby="proof-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.proof.kicker}</span>
              <h2 id="proof-title">{d.proof.line}</h2>
            </div>
            <p className="proof-links">
              <a href="https://aperta-media.vercel.app/" target="_blank" rel="noopener noreferrer">
                {d.proof.link}
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section diagnostic" id="contacto" aria-labelledby="close-title">
        <div className="container">
          <Reveal>
            <div className="diag-inner">
              <div className="diag-lead">
                <h2 id="close-title">{d.close.title}</h2>
                {doors}
                <p className="local-optout">{d.close.optout}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
