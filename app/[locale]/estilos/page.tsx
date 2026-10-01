import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import Field, { type FieldPalette } from "@/components/site/field/Field";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { estilos } from "@/lib/i18n/estilos";
import "./estilos.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/estilos", estilos[locale].meta);
}

const KEYS = ["vinedo", "tech", "spa", "hotel"] as const;

/** The site header and the caption that sticks under it cover this much of
 *  the window's top; a canvas showing only there is hidden, so it stops. */
const CHROME = 110;
type Key = (typeof KEYS)[number];

/**
 * Each sample's canvas colours. They are fixed: a sample is somebody else's
 * site, so it does not follow this site's light and dark modes. The grounds
 * are repeated in estilos.css, where each scene paints its own background.
 */
const PALETTE: Record<Key, FieldPalette> = {
  vinedo: { line: "#F3DFC0", accent: "#F4B44E", ground: "#6F2A1B", dark: true },
  tech: { line: "#A9B6CC", accent: "#C8FF3A", ground: "#0A0C10", dark: true },
  spa: { line: "#473C96", accent: "#D96F3F", ground: "#EFEDF6", dark: false },
  hotel: { line: "#1D6472", accent: "#D9603A", ground: "#E9D6B4", dark: false },
};

/**
 * The style samples page: a short hero, four scenes to scroll through and the
 * diagnostic close. Each scene is the top of a home page for an invented
 * business, in a look of its own (palette, typefaces, drawing), and says on
 * its face that it is a sample. The caption above each scene is this site's
 * own voice: it names the style and the businesses it suits, and it stays
 * under the header while its scene passes, which is the gallery's index. That
 * is plain CSS, so it works without JavaScript.
 *
 * Everything inside a scene is inert. The one action on the page is
 * site.diag.cta, in the hero and in the close. A scene's copy arrives with
 * the same reveal the rest of the site uses, which shows it at once without
 * JavaScript or under reduced motion.
 */
export default function EstilosPage({ params }: Params) {
  const locale = localeOf(params);
  const d = estilos[locale];
  const s = site[locale];
  const g = d.gallery;
  const href = (path: string) => localePath(locale, path);

  const plate = (key: Key, scene: ReactNode) => {
    const n = KEYS.indexOf(key) + 1;
    return (
      <section className={"est-plate est-plate-" + key} id={"estilo-" + key} aria-labelledby={"est-h-" + key} key={key}>
        <div className="est-cap">
          <div className="container est-cap-row">
            <span className="est-cap-n mono">
              {"0" + n} / {"0" + KEYS.length}
            </span>
            <h2 className="est-cap-style" id={"est-h-" + key}>
              {d[key].style}
            </h2>
            <p className="est-cap-suits">{d[key].suits}</p>
            <nav className="est-cap-ticks" aria-label={g.jump}>
              {KEYS.map((k, i) => (
                <a
                  key={k}
                  href={"#estilo-" + k}
                  className={k === key ? "is-here" : undefined}
                  aria-current={k === key ? "true" : undefined}
                  aria-label={"0" + (i + 1) + " " + g.count + " 0" + KEYS.length + ": " + d[k].style}
                />
              ))}
            </nav>
          </div>
        </div>
        {scene}
      </section>
    );
  };

  return (
    <main id="main" className="pg-estilos">
      <span id="top" />

      <section className="hero est-hero" aria-label={d.hero.aria}>
        <div className="container">
          <Reveal>
            <div className="hero-copy est-hero-copy">
              <div>
                <p className="eyebrow">{d.hero.eyebrow}</p>
                <h1>
                  {d.hero.title}
                  <br />
                  <span className="accent">{d.hero.titleAccent}</span>
                </h1>
              </div>
              <div className="est-hero-side">
                <p className="hero-sub">{d.hero.sub}</p>
                <div className="hero-actions">
                  <Link className="cta" href={href("/contacto")}>
                    {s.diag.cta}
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="est-gallery" role="group" aria-label={g.aria}>
        {plate(
          "vinedo",
          <div className="est-scene sc-vin">
            <p className="sc-flag">{g.sample}</p>
            <div className="sc-nav">
              <span className="sc-links" aria-hidden="true">
                <span>{d.vinedo.nav[0]}</span>
                <span>{d.vinedo.nav[1]}</span>
              </span>
              <span className="sc-brand">
                <small>{d.vinedo.kind}</small>
                {d.vinedo.brand}
              </span>
              <span className="sc-links sc-links-end" aria-hidden="true">
                <span>{d.vinedo.nav[2]}</span>
                <span>{d.vinedo.nav[3]}</span>
              </span>
              <span className="sc-menu" aria-hidden="true">
                {g.menu}
              </span>
            </div>
            <div className="sc-stage">
              <Reveal className="sc-copy">
                <p className="sc-title">
                  {d.vinedo.title} <em>{d.vinedo.titleAccent}</em>
                </p>
                <p className="sc-sub">{d.vinedo.sub}</p>
                <div className="sc-actions">
                  <span className="sc-btn">{d.vinedo.primary}</span>
                  <span className="sc-link">{d.vinedo.secondary}</span>
                </div>
              </Reveal>
              <div className="sc-art">
                <Field kind="vinedo" layout="fill" colors={PALETTE.vinedo} topInset={CHROME} />
              </div>
            </div>
          </div>,
        )}

        {plate(
          "tech",
          <div className="est-scene sc-tech">
            <p className="sc-flag">{g.sample}</p>
            <div className="sc-nav">
              <span className="sc-brand">{d.tech.brand}</span>
              <span className="sc-links" aria-hidden="true">
                {d.tech.nav.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>
              <span className="sc-nav-action" aria-hidden="true">
                {d.tech.action}
              </span>
              <span className="sc-menu" aria-hidden="true">
                {g.menu}
              </span>
            </div>
            <div className="sc-stage">
              <Reveal className="sc-copy">
                <p className="sc-kicker">{d.tech.kind}</p>
                <p className="sc-title">
                  {d.tech.title} <em>{d.tech.titleAccent}</em>
                </p>
                <p className="sc-sub">{d.tech.sub}</p>
                <div className="sc-actions">
                  <span className="sc-btn">{d.tech.primary}</span>
                  <span className="sc-link">{d.tech.secondary}</span>
                </div>
              </Reveal>
              <div className="sc-art">
                <Field kind="constelacion" layout="fill" colors={PALETTE.tech} topInset={CHROME} />
              </div>
            </div>
            <p className="sc-tags" aria-hidden="true">
              {d.tech.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </p>
          </div>,
        )}

        {plate(
          "spa",
          <div className="est-scene sc-spa">
            <p className="sc-flag">{g.sample}</p>
            <div className="sc-nav">
              <span className="sc-brand">{d.spa.brand}</span>
              <span className="sc-links" aria-hidden="true">
                {d.spa.nav.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>
              <span className="sc-nav-action" aria-hidden="true">
                {d.spa.action}
              </span>
              <span className="sc-menu" aria-hidden="true">
                {g.menu}
              </span>
            </div>
            <div className="sc-stage">
              <Reveal className="sc-copy">
                <p className="sc-kicker">{d.spa.kind}</p>
                <p className="sc-title">
                  {d.spa.title} <em>{d.spa.titleAccent}</em>
                </p>
                <p className="sc-sub">{d.spa.sub}</p>
                <div className="sc-actions">
                  <span className="sc-btn">{d.spa.primary}</span>
                  <span className="sc-link">{d.spa.secondary}</span>
                </div>
              </Reveal>
              <div className="sc-art">
                <Field kind="corrientes" layout="fill" colors={PALETTE.spa} density={1.9} topInset={CHROME} />
              </div>
            </div>
          </div>,
        )}

        {plate(
          "hotel",
          <div className="est-scene sc-hotel">
            <p className="sc-flag">{g.sample}</p>
            <div className="sc-nav">
              <span className="sc-brand">{d.hotel.brand}</span>
              <span className="sc-links" aria-hidden="true">
                {d.hotel.nav.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>
              <span className="sc-nav-action" aria-hidden="true">
                {d.hotel.action}
              </span>
              <span className="sc-menu" aria-hidden="true">
                {g.menu}
              </span>
            </div>
            <div className="sc-stage">
              <Reveal className="sc-copy">
                <p className="sc-title">
                  {d.hotel.title} <em>{d.hotel.titleAccent}</em>
                </p>
                <div className="sc-side">
                  <p className="sc-sub">{d.hotel.sub}</p>
                  <div className="sc-actions">
                    <span className="sc-btn">{d.hotel.primary}</span>
                    <span className="sc-link">{d.hotel.secondary}</span>
                  </div>
                </div>
              </Reveal>
              <div className="sc-art">
                <Field kind="medanos" layout="fill" colors={PALETTE.hotel} focus={0.66} topInset={CHROME} />
              </div>
            </div>
          </div>,
        )}
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
