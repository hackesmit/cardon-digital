import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import ThreeLines from "@/components/pages/enkanto/ThreeLines";
import SpotlightFrames from "@/components/pages/enkanto/SpotlightFrames";
import CaseFacts from "@/components/pages/case/CaseFacts";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { site } from "@/lib/i18n/site";
import { enkanto } from "@/lib/i18n/enkanto";
import "./enkanto-case.css";

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  return pageMetadata(locale, "/work/enkanto", enkanto[locale].meta);
}

export default function EnkantoCaseStudy({ params }: Params) {
  const locale = localeOf(params);
  const d = enkanto[locale];
  const s = site[locale];
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  return (
    <main id="main" className="pg-enkanto">
      <span id="top" />

      {/* ============================ HERO ============================ */}
      <section className="hero" aria-label={d.hero.aria}>
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1>
              {d.hero.t1}
              <span className="enk">{d.hero.enk}</span>
              {d.hero.t2}
            </h1>
            <p className="hero-sub">{rich(d.hero.sub)}</p>
            <p className="brandline">{s.brandline}</p>
          </div>

          <ThreeLines />
        </div>
      </section>

      <CaseFacts
        aria={d.facts.aria}
        rows={d.facts.rows}
        basisK={d.facts.basisK}
        basis={d.facts.basis}
      />

      {/* ============================ CLIENT INTRO ============================ */}
      <section className="section rule-top" aria-labelledby="client-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker enk">{d.client.kicker}</span>
              <h2 id="client-title">{d.client.title}</h2>
            </div>
            <div className="prose">
              <p>{d.client.p1}</p>
              <p>{d.client.p2}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ PHOTO BAND ============================ */}
      <section className="photo-slot">
        <div className="container">
          <figure className="photoband">
            <img
              className="photoband-img"
              src="/media/enkanto-valle.webp"
              alt={d.client.photoAlt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      {/* ============================ THE WORK (group intro) ============================ */}
      <section className="section" aria-labelledby="work-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.work.kicker}</span>
              <h2 id="work-title">{d.work.title}</h2>
            </div>
            <div className="prose">
              <p>{d.work.p1}</p>
              <p>{rich(d.work.p2)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 1 ============================ */}
      <section className="section rule-top" id="solution" aria-labelledby="ch-1-title">
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split-copy">
                <span className="kicker">{d.ch1.kicker}</span>
                <h2 id="ch-1-title">{d.ch1.title}</h2>
                <p className="section-sub">{rich(d.ch1.sub)}</p>
                <p className="note">{rich(d.servesWine, { b: "w" })}</p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">{d.ch1.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 258"
                    role="img"
                    aria-label={d.ch1.aria}
                  >
                    <text className="e-lab mono" x="40" y="52" fontSize="11" letterSpacing="1.5">{d.ch1.inNameOnly}</text>
                    <rect className="e-card" x="40" y="66" width="176" height="176" rx="2" />
                    <rect className="e-dash" x="58" y="84" width="46" height="46" rx="2" />
                    <line className="e-dash" x1="118" y1="94" x2="196" y2="94" />
                    <line className="e-dash" x1="118" y1="112" x2="176" y2="112" />
                    <line className="e-dash" x1="58" y1="158" x2="150" y2="158" />
                    <line className="e-dash" x1="58" y1="182" x2="130" y2="182" />

                    <path className="e-conn-enk" d="M226 154 C 252 154, 258 154, 288 154" />
                    <circle className="e-enk" cx="288" cy="154" r="3" />

                    <text className="e-lab mono" x="304" y="52" fontSize="11" letterSpacing="1.5">{d.ch1.builtOut}</text>
                    <rect className="e-card e-card-live" x="304" y="66" width="176" height="176" rx="2" />
                    <rect className="e-img" x="322" y="84" width="52" height="52" rx="2" />
                    <path
                      className="e-img-glyph"
                      d="M348 92 L348 100 L342 108 L342 128 L354 128 L354 108 L348 100"
                    />
                    <text className="e-ink mono" x="386" y="104" fontSize="15" fontWeight="600">
                      Tinto
                    </text>
                    <text className="e-gold mono" x="386" y="126" fontSize="13" fontWeight="600">
                      $ 520
                    </text>
                    <line className="e-line-soft" x1="322" y1="158" x2="462" y2="158" />
                    <text className="e-muted mono" x="322" y="184" fontSize="12">
                      750 ml
                    </text>
                    <rect className="e-add" x="408" y="170" width="54" height="22" rx="2" />
                    <text className="e-primary mono" x="435" y="185" fontSize="11" fontWeight="600" textAnchor="middle">{d.ch1.add}</text>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 2 ============================ */}
      <section className="section" aria-labelledby="ch-2-title">
        <div className="container">
          <Reveal>
            <div className="split reverse">
              <div className="split-copy">
                <span className="kicker gold">{d.ch2.kicker}</span>
                <h2 id="ch-2-title">{d.ch2.title}</h2>
                <p className="section-sub">{rich(d.ch2.sub)}</p>
                <p className="note">{rich(d.servesAll, { b: "w" })}</p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">{d.ch2.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 238"
                    role="img"
                    aria-label={d.ch2.aria}
                  >
                    <text className="e-lab mono" x="34" y="44" fontSize="11" letterSpacing="1.2">{d.ch2.homepages}</text>
                    <g>
                      <rect className="e-page-off" x="34" y="58" width="190" height="26" rx="2" />
                      <text className="e-muted mono" x="46" y="75" fontSize="11">{d.ch2.unpublished}</text>
                      <rect className="e-page-off" x="34" y="92" width="190" height="26" rx="2" />
                      <text className="e-muted mono" x="46" y="109" fontSize="11">{d.ch2.unpublished}</text>
                      <rect className="e-page-live" x="34" y="126" width="190" height="26" rx="2" />
                      <text className="e-ink mono" x="46" y="143" fontSize="11" fontWeight="600">{d.ch2.canonical}</text>
                      <rect className="e-page-off" x="34" y="160" width="190" height="26" rx="2" />
                      <text className="e-muted mono" x="46" y="177" fontSize="11">{d.ch2.unpublished}</text>
                      <rect className="e-page-off" x="34" y="194" width="190" height="26" rx="2" />
                      <text className="e-muted mono" x="46" y="211" fontSize="11">{d.ch2.unpublished}</text>
                    </g>

                    <path className="e-conn-enk" d="M224 139 C 258 139, 262 139, 296 139" />
                    <circle className="e-enk" cx="296" cy="139" r="3" />

                    <rect className="e-panel" x="304" y="96" width="182" height="108" rx="2" />
                    <text className="e-lab mono" x="322" y="122" fontSize="11" letterSpacing="1">
                      sitemap.xml
                    </text>
                    <text className="e-primary mono" x="468" y="122" fontSize="11" textAnchor="end">{d.ch2.clean}</text>
                    <line className="e-line-soft" x1="322" y1="138" x2="468" y2="138" />
                    <text className="e-lab mono" x="322" y="164" fontSize="11" letterSpacing="1">
                      robots.txt
                    </text>
                    <text className="e-primary mono" x="468" y="164" fontSize="11" textAnchor="end">{d.ch2.clean}</text>
                    <line className="e-line-soft" x1="322" y1="180" x2="468" y2="180" />
                    <text className="e-muted mono" x="322" y="196" fontSize="10.5">{d.ch2.descriptions}</text>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 3 ============================ */}
      <section className="section" aria-labelledby="ch-3-title">
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split-copy">
                <span className="kicker">{d.ch3.kicker}</span>
                <h2 id="ch-3-title">{d.ch3.title}</h2>
                <p className="section-sub">{rich(d.ch3.sub)}</p>
                <p className="note">{rich(d.servesWine, { b: "w" })}</p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">{d.ch3.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 230"
                    role="img"
                    aria-label={d.ch3.aria}
                  >
                    <g>
                      <rect className="e-chip" x="34" y="70" width="128" height="34" rx="2" />
                      <text className="e-val mono" x="54" y="92" fontSize="13">{d.ch3.card}</text>
                      <rect className="e-chip" x="34" y="122" width="128" height="34" rx="2" />
                      <text className="e-val mono" x="54" y="144" fontSize="13">{d.ch3.cash}</text>
                      <rect className="e-chip" x="34" y="174" width="128" height="34" rx="2" />
                      <text className="e-val mono" x="54" y="196" fontSize="13">{d.ch3.transfer}</text>
                    </g>
                    <g className="e-conn">
                      <path d="M162 87 C 210 87, 220 138, 268 138" />
                      <path d="M162 139 L 268 139" />
                      <path d="M162 191 C 210 191, 220 140, 268 140" />
                    </g>
                    <circle className="e-enk" cx="268" cy="139" r="3" />

                    <rect className="e-panel" x="300" y="82" width="186" height="132" rx="2" />
                    <text className="e-lab mono" x="318" y="110" fontSize="11" letterSpacing="1">
                      TOTAL
                    </text>
                    <text className="e-ink mono" x="468" y="110" fontSize="14" fontWeight="600" textAnchor="end">
                      $ 520
                    </text>
                    <rect className="e-track" x="318" y="126" width="150" height="6" rx="2" />
                    <rect className="e-fill" x="318" y="126" width="150" height="6" rx="2" />
                    <text className="e-clay mono" x="318" y="170" fontSize="14" fontWeight="600">{d.ch3.placed}</text>
                    <circle className="e-clay-ring" cx="452" cy="165" r="10" />
                    <circle className="e-clay" cx="452" cy="165" r="3.4" />
                    <text className="e-muted mono" x="318" y="196" fontSize="10.5">{d.ch3.clears}</text>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 4 ============================ */}
      <section className="section" aria-labelledby="ch-4-title">
        <div className="container">
          <Reveal>
            <div className="split reverse">
              <div className="split-copy">
                <span className="kicker gold">{d.ch4.kicker}</span>
                <h2 id="ch-4-title">{d.ch4.title}</h2>
                <p className="section-sub">{rich(d.ch4.sub)}</p>
                <p className="note">{rich(d.servesWine, { b: "w" })}</p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">{d.ch4.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 240"
                    role="img"
                    aria-label={d.ch4.aria}
                  >
                    <circle className="e-node-live" cx="96" cy="150" r="9" />
                    <text className="e-ink mono" x="96" y="184" fontSize="12" textAnchor="middle">{d.ch4.order}</text>
                    <path className="e-conn-enk" d="M105 145 C 150 128, 190 100, 236 92" />
                    <path className="e-conn-enk" d="M105 155 C 150 172, 190 200, 236 208" />

                    <circle className="e-node-live" cx="244" cy="90" r="7" />
                    <text className="e-ink mono" x="262" y="86" fontSize="12">{d.ch4.pickup}</text>
                    <text className="e-muted mono" x="262" y="104" fontSize="10.5">{d.ch4.atWinery}</text>

                    <circle className="e-node-live" cx="244" cy="210" r="7" />
                    <text className="e-ink mono" x="262" y="206" fontSize="12">{d.ch4.carrier}</text>
                    <text className="e-muted mono" x="262" y="224" fontSize="10.5">{d.ch4.packaging}</text>

                    <line className="e-divider" x1="392" y1="54" x2="392" y2="246" />
                    <text className="e-lab mono" x="404" y="82" fontSize="9.5" letterSpacing="0.3">{d.ch4.acrossBorder}</text>
                    <circle className="e-guest" cx="418" cy="150" r="6" />
                    <path className="e-carry" d="M426 150 L 466 150" />
                    <path
                      className="e-home"
                      d="M470 150 L 482 140 L 494 150 M474 148 L474 162 L490 162 L490 148"
                    />
                    <text className="e-muted mono" x="404" y="192" fontSize="9.5">{d.ch4.carried}</text>
                    <text className="e-muted mono" x="404" y="208" fontSize="9.5">{d.ch4.allowance}</text>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ SOLUTION: CHAPTER 5 ============================ */}
      <section className="section" aria-labelledby="ch-5-title">
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split-copy">
                <span className="kicker">{d.ch5.kicker}</span>
                <h2 id="ch-5-title">{d.ch5.title}</h2>
                <p className="section-sub">{rich(d.ch5.sub)}</p>
                <p className="note">{rich(d.servesAll, { b: "w" })}</p>
              </div>
              <div className="split-vis">
                <div className="vis-frame">
                  <span className="vis-tag">{d.ch5.tag}</span>
                  <svg
                    className="mini-svg"
                    viewBox="0 0 520 186"
                    role="img"
                    aria-label={d.ch5.aria}
                  >
                    <rect className="e-chip e-chip-live" x="40" y="46" width="70" height="40" rx="2" />
                    <text className="e-ink mono" x="75" y="71" fontSize="15" fontWeight="600" textAnchor="middle">
                      EN
                    </text>
                    <rect className="e-chip e-chip-live" x="40" y="130" width="70" height="40" rx="2" />
                    <text className="e-ink mono" x="75" y="155" fontSize="15" fontWeight="600" textAnchor="middle">
                      ES
                    </text>

                    <path className="e-conn-enk" d="M110 66 C 180 66, 200 108, 268 108" />
                    <path className="e-conn-enk" d="M110 150 C 180 150, 200 108, 268 108" />
                    <circle className="e-enk" cx="268" cy="108" r="3" />

                    <rect className="e-panel" x="300" y="56" width="198" height="104" rx="2" />
                    <text className="e-ink mono" x="318" y="86" fontSize="14" fontWeight="600">{d.ch5.oneStore}</text>
                    <text className="e-muted mono" x="318" y="110" fontSize="11">{d.ch5.readWhole}</text>
                    <text className="e-primary mono" x="318" y="140" fontSize="10.5">{d.ch5.foundation}</text>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ RESULT CALLOUTS ============================ */}
      <section className="section results rule-top" aria-labelledby="results-title">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker enk">{d.results.kicker}</span>
              <h2 id="results-title">{d.results.title}</h2>
            </div>
            <div className="callouts">
              {d.results.items.map((item, i) => (
                <div className="callout" key={item.lead}>
                  <span className="callout-idx mono">{"0" + (i + 1)}</span>
                  <p className="callout-lead">{item.lead}</p>
                  <p className="callout-body">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ OUTCOME ============================ */}
      <section className="outcome" aria-labelledby="outcome-title">
        <div className="container">
          <Reveal>
            <div className="outcome-inner">
              <span className="kicker">{d.outcome.kicker}</span>
              <h2 id="outcome-title">{d.outcome.title}</h2>
              <div className="prose">
                <p>{d.outcome.p1}</p>
                <p>{rich(d.outcome.p2)}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ DIAGNOSTIC ============================ */}
      <section className="section diagnostic" id="diagnostic" aria-labelledby="diag-title">
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

      <SpotlightFrames />
    </main>
  );
}
