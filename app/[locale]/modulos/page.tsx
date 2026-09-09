import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import BridgeMap from "@/components/pages/modulos/BridgeMap";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { modulos } from "@/lib/i18n/modulos";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "./modulos.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/modulos", modulos[locale].meta);
}

/* The demo host is not live yet (epic hq-ko3a0). Until it is, every demo
   button points at the placeholder path and says so, one module per link, so
   the hrefs only need their host swapped when the demo ships. */
const DEMO_PATH = "/demo";

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
      {d.modules.map((m, i) => (
        <section
          className={"section mod" + (i % 2 === 1 ? " mod-alt" : "")}
          id={m.id}
          key={m.id}
          aria-labelledby={m.id + "-title"}
        >
          <div className="container">
            <Reveal>
              <div className="mod-head">
                <span className="mod-num mono">{m.num}</span>
                <div>
                  <h2 id={m.id + "-title"}>{m.name}</h2>
                  <p className="mod-tag">{m.tag}</p>
                </div>
              </div>
            </Reveal>

            {/* the problem it solves, and the answer */}
            <Reveal delay={60}>
              <div className="mod-problem">
                <div className="mod-problem-copy">
                  <h3>{m.problem.h}</h3>
                  <p className="mod-body">{m.problem.body}</p>
                </div>
                <p className="mod-answer">{rich(m.problem.answer)}</p>
              </div>
            </Reveal>

            {/* the feature list, by size */}
            <Reveal delay={60}>
              <div className="mod-build">
                <h3 className="mod-h3">{m.features.h}</h3>
                <div className="mod-build-grid">
                  <div className="mod-pack mod-pack-base">
                    <span className="mod-pack-label mono">
                      {m.features.base.label}
                    </span>
                    <ul className="mod-list">
                      {m.features.base.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mod-pack-col">
                    {m.features.adds.map((add) => (
                      <div className="mod-pack" key={add.label}>
                        <span className="mod-pack-label mono">{add.label}</span>
                        <ul className="mod-list">
                          {add.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="mod-pack mod-pack-also">
                      <span className="mod-pack-label mono">
                        {m.features.also.label}
                      </span>
                      <ul className="mod-list">
                        {m.features.also.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* the size bands */}
            <Reveal delay={60}>
              <div className="mod-sizes">
                <h3 className="mod-h3">{m.sizes.h}</h3>
                <p className="mod-sizes-lead">{d.sizesLead}</p>
                <dl className="size-list">
                  {m.sizes.rows.map((row) => (
                    <div className="size-row" key={row.key}>
                      <dt className="size-key mono">{row.key}</dt>
                      <dd className="size-body">{row.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* who it is for, with the grower set where there is one */}
            <Reveal delay={60}>
              <div className="mod-who">
                <h3 className="mod-h3">{m.who.h}</h3>
                <p className="mod-body">{m.who.body}</p>
                {m.who.grower ? (
                  <div className="grower">
                    <span className="mod-pack-label mono">
                      {m.who.grower.h}
                    </span>
                    <ul className="mod-list">
                      {m.who.grower.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="mod-note">{rich(m.who.grower.note)}</p>
                  </div>
                ) : null}
              </div>
            </Reveal>

            {/* the policy line, and the exclusions where there are any */}
            <Reveal delay={60}>
              <div className="mod-policy">
                <p className="mod-note">{rich(m.policy)}</p>
                {m.exclusions ? (
                  <div className="mod-excl">
                    <h3 className="mod-h4">{m.exclusions.h}</h3>
                    <p className="mod-body">{m.exclusions.body}</p>
                  </div>
                ) : null}
              </div>
            </Reveal>

            {/* the demo for this module alone */}
            <Reveal delay={60}>
              <div className="mod-demo">
                <Link className="demo-btn" href={href(DEMO_PATH)}>
                  <span>{m.demo}</span>
                  <span className="demo-soon mono">{d.demoSoon}</span>
                </Link>
                <p className="mod-note">{rich(d.demoNote)}</p>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* ============================ THE SEVEN COMBINATIONS ============================ */}
      <section className="section combina" id="combina" aria-labelledby="combina-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker gold">{d.combina.kicker}</span>
              <h2 id="combina-title">{d.combina.title}</h2>
              <p className="section-sub">{rich(d.combina.sub)}</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="combina-grid">
              <div className="bridge-col">
                <BridgeMap locale={locale} />
              </div>
              <ol className="combina-list">
                {d.combina.items.map((item) => (
                  <li
                    className={"combina-item is-" + item.kind}
                    key={item.key}
                  >
                    <span className="combina-kind mono">
                      {item.kind === "single"
                        ? d.combina.single
                        : item.variant === "shared"
                          ? d.combina.shared
                          : d.combina.bridge}
                    </span>
                    <h3>{item.key}</h3>
                    <p>{item.line}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="combina-foot">{d.combina.foot}</p>
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
