import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import FlowCompress from "@/components/pages/services/FlowCompress";
import { demoHref } from "@/lib/demo";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { software } from "@/lib/i18n/software";
import type { ModuleId } from "@/lib/pricing";
import "../services.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/software", software[locale].meta);
}

/**
 * The software and automation service page: the repetitive work runs itself
 * and the system is yours. The operations visual (FlowCompress, Monte Xanic's
 * hour to two minutes) opens it; then what the owner ends up with, the three
 * modules with their demos, the proof, how it works, the objections and the
 * diagnostic close. No figure is typed here: module prices live on /precios.
 */
export default function SoftwarePage({ params }: Params) {
  const locale = localeOf(params);
  const d = software[locale];
  const s = site[locale];
  const href = (path: string) => localePath(locale, path);
  const cta = (
    <div className="cta-row">
      <Link className="cta" href={href("/contacto")}>
        {s.diag.cta}
      </Link>
    </div>
  );

  return (
    <main id="main" className="pg-svc pg-software">
      <span id="top" />

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
                <Link className="btn-ghost" href={href("/precios")}>
                  {d.modules.more}
                </Link>
              </div>
              <p className="hero-proof">{d.hero.proof}</p>
            </div>
          </Reveal>
          <div className="stage-wrap">
            <FlowCompress />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="res-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.gets.kicker}</span>
              <h2 id="res-title">{d.gets.title}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="res-grid">
              {d.gets.items.map((item, i) => (
                <div className="res-item" key={item.h}>
                  <span className="res-num">{"0" + (i + 1)}</span>
                  <h3>{item.h}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          {cta}
        </div>
      </section>

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
              {d.modules.items.map((m) => (
                <article className="mod" key={m.id}>
                  <span className="mod-name">{m.name}</span>
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                  <a
                    className="mod-demo"
                    href={demoHref(locale, [m.id as ModuleId])}
                    target="_blank"
                    rel="noopener"
                  >
                    {d.modules.demo}
                  </a>
                </article>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p className="mod-other">{d.modules.other}</p>
            <p className="more-link">
              <Link href={href("/precios")}>{d.modules.more}</Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="proof-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">{d.proof.kicker}</span>
              <h2 id="proof-title">{d.proof.title}</h2>
              <p className="section-sub">{d.proof.body}</p>
            </div>
            <div className="proof-links">
              <Link href={href("/work/monte-xanic")}>{d.proof.readXanic}</Link>
              <Link href={href("/work/enkanto")}>{d.proof.readEnkanto}</Link>
            </div>
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
          {cta}
        </div>
      </section>

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
