import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import { demoHref, demoIsLive } from "@/lib/demo";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { demoCardKeys, demosIndex } from "@/lib/i18n/demos-index";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "./demos.css";

type Params = { params: Promise<{ locale: string }> };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const locale = localeOf(params);
  return pageMetadata(locale, "/demos", demosIndex[locale].meta);
}

/** The frame every preview was captured at (scripts/demos/capture.mjs SHOT). */
const SHOT = { width: 1280, height: 800 };

/**
 * The Demos page: four cards over the live demo at demo.cardondigital.com.
 *
 * It exists because the demo used to hang off a small link on three other
 * pages and was missed (Daniel, 2026-10-16). Each card carries the screen a
 * module actually shows, captured from the running demo by
 * scripts/demos/capture.mjs, the work as it is done today, the same work on
 * that screen, and a button that opens the demo with the module switched on.
 *
 * The preview is the argument, so it is the biggest thing on the card and the
 * whole card is its click target: the button carries the link and a stretched
 * pseudo-element over the card, which keeps one link, one focus ring and one
 * name for a screen reader while a pointer can press anywhere.
 *
 * The four Open buttons are quiet by design. Identity v3 gives a viewport one
 * clay action, and on this page that is the diagnostic at the close, so the
 * buttons are ghosts and the cards do the selling.
 *
 * The depth is CSS only: a card is a panel, a tinted plate sits behind the
 * shot, and on hover the shot rises a little while the plate slides the other
 * way. All of it is in demos.css behind prefers-reduced-motion, so a visitor
 * who asks for stillness gets the same page without the travel.
 */
export default async function DemosPage(props: Params) {
  const params = await props.params;
  const locale = localeOf(params);
  const d = demosIndex[locale];
  const s = site[locale];
  const g = d.grid;
  const href = (path: string) => localePath(locale, path);

  // The demo host is a different origin and opens in its own tab. While the
  // host is cleared (lib/demo.ts) every href is this site's own holding page,
  // which must stay in the same tab like any other internal link.
  const offSite = demoIsLive
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <main id="main" className="pg-demos">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-labelledby="demos-title">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1 id="demos-title">
              {d.hero.title}
              <br />
              <span className="accent">{d.hero.titleAccent}</span>
            </h1>
            <p className="hero-sub">{d.hero.sub}</p>
          </div>
        </div>
      </section>

      {/* ============================ THE FOUR DEMOS ============================ */}
      <section className="section dm-sec" aria-label={g.label}>
        <div className="container">
          <div className="dm-grid">
            {demoCardKeys.map((key, i) => {
              const c = d.cards[key];
              return (
                /* No stagger: the cards are a column of full-width rows, so
                   each one reveals on its own as it arrives and a delay would
                   only hold a card that is already on screen. */
                <Reveal className="dm-cell" key={key}>
                  <article className="dm-card">
                    <div className="dm-shot">
                      <span className="dm-plate" aria-hidden="true" />
                      <img
                        className="dm-img"
                        src={"/media/demos/" + c.image + ".webp"}
                        alt={c.alt}
                        width={SHOT.width}
                        height={SHOT.height}
                        loading={i === 0 ? undefined : "lazy"}
                        decoding="async"
                      />
                    </div>

                    <div className="dm-body">
                      <span className="kicker">{c.name}</span>
                      <h2 className="dm-title">{c.title}</h2>

                      <dl className="dm-story">
                        <dt className="dm-k mono">{g.beforeLabel}</dt>
                        <dd className="dm-v dm-before">{c.before}</dd>
                        <dt className="dm-k mono">{g.afterLabel}</dt>
                        <dd className="dm-v">{c.after}</dd>
                      </dl>

                      <a
                        className="btn-ghost dm-open"
                        href={demoHref(locale, c.modules)}
                        {...offSite}
                      >
                        {c.open}
                      </a>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <p className="dm-honest">{g.honest}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================ AFTER THE DEMO ============================ */}
      <section className="section dm-after" aria-labelledby="dm-after-title">
        <div className="container">
          <Reveal>
            <div className="dm-after-inner">
              <span className="kicker">{d.close.kicker}</span>
              <h2 id="dm-after-title">{d.close.title}</h2>
              <p className="section-sub">{d.close.body}</p>
            </div>
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
                <p className="diag-desc">{d.close.diagDesc}</p>
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
