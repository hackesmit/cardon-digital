import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import { about } from "@/lib/i18n/about";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import "./about.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/about", about[locale].meta);
}

export default function AboutPage({ params }: Params) {
  const locale = localeOf(params);
  const d = about[locale];
  const s = site[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  // Only the last chapter carries the credentials line, so the empty strings
  // give every chapter one shape and the render stays a plain truthiness test.
  const chapters = [
    { ...d.mission, credK: "", cred: "" },
    { ...d.beliefs, credK: "", cred: "" },
    d.how,
  ];

  return (
    <main id="main" className="pg-about">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-labelledby="about-title">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1 id="about-title">
              {d.hero.title}
              <br />
              <span className="accent">{d.hero.titleAccent}</span>
            </h1>
            <p className="hero-sub">{d.hero.sub}</p>
            <p className="brandline">{s.brandline}</p>
          </div>
        </div>
      </section>

      {/* ============================ CHAPTERS ============================ */}
      {chapters.map((chapter, i) => (
        <section
          className={"section about-chapter" + (i === 0 ? " rule-top" : "")}
          key={chapter.kicker}
          aria-labelledby={"about-ch-" + i}
        >
          <div className="container">
            <Reveal>
              <div className="about-split">
                <div className="about-head">
                  <span className="kicker">{chapter.kicker}</span>
                  <h2 id={"about-ch-" + i}>{chapter.title}</h2>
                </div>
                <div className="about-prose">
                  {chapter.body.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                  {chapter.cred ? (
                    <p className="about-cred">
                      <span className="about-cred-k mono">{chapter.credK}</span>
                      <span className="about-cred-v">{chapter.cred}</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* ============================ DIAGNOSTIC ============================ */}
      <section
        className="section diagnostic rule-top"
        id="diagnostic"
        aria-labelledby="diag-title"
      >
        <div className="container">
          <Reveal>
            <div className="diag-inner">
              <div className="diag-lead">
                <span className="kicker clay">{s.diag.kicker}</span>
                <h2 id="diag-title">{s.diag.title}</h2>
                <p className="diag-desc">{d.diagDesc}</p>
                <div className="diag-actions">
                  <a className="cta cta-lg" href={mailto}>
                    {s.diag.cta}
                  </a>
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
