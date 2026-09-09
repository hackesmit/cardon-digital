import Link from "next/link";
import ModuleBlock from "@/components/pages/modulos/ModuleBlock";
import Combinations from "@/components/pages/modulos/Combinations";
import ModuleFloors from "@/components/pages/precios/ModuleFloors";
import MixExample from "@/components/pages/precios/MixExample";
import PricingDetails from "@/components/pages/precios/PricingDetails";
import VintageCompare from "@/components/pages/showcase/VintageCompare";
import Reveal from "@/components/site/Reveal";
import { allModules, demoHref, demoIsLive } from "@/lib/demo";
import { localePath, type Locale } from "@/lib/i18n/config";
import { modulos } from "@/lib/i18n/modulos";
import { precios } from "@/lib/i18n/precios";
import { rich } from "@/lib/i18n/rich";
import { showcase } from "@/lib/i18n/showcase";
import { site } from "@/lib/i18n/site";
import type { ModuleId } from "@/lib/pricing";

/* The two page stylesheets this page renders inside. They are loaded here
   rather than copied into home.css because the sections below are the /modulos
   and /precios sections themselves: same components, same class names, so the
   same rules have to reach them. Each wrapper div carries that page's own class
   so the scoped rules of precios.css apply exactly as they do on /precios. */
import "@/app/[locale]/modulos/modulos.css";
import "@/app/[locale]/precios/precios.css";

/**
 * The one feedback page (bead hq-wrig5.15). With SHOWCASE=1 the home route is
 * the whole pitch on one page, in this order: the pitch and a demo button per
 * module, the six things that are wrong today, the three modules and the seven
 * combinations, the pricing page in full, and the way to reach us. Recipients
 * of the feedback round read it top to bottom without clicking anything.
 *
 * Nothing below is a second copy of an existing page. The module descriptions
 * are ModuleBlock and Combinations, the same components /modulos renders; the
 * pricing is ModuleFloors, MixExample and PricingDetails, the same components
 * /precios renders. Both pages keep existing. Only the copy that belongs to
 * this page alone, the pitch, the problem list and the section heads, lives in
 * lib/i18n/showcase.ts.
 *
 * No figure is typed anywhere in this path. Every amount on the page comes out
 * of lib/pricing.ts through the pricing components, which is the same rule
 * /precios follows and the reason those components are reused rather than
 * summarised.
 */
export default function Showcase({ locale }: { locale: Locale }) {
  const d = showcase[locale];
  const s = site[locale];
  const mod = modulos[locale];
  const pr = precios[locale];
  const href = (path: string) => localePath(locale, path);
  const mailto =
    "mailto:daniel@cardondigital.com?subject=" +
    encodeURIComponent(s.diag.mailSubject);

  /* One button per module and one for all three, in the order the pricing data
     keeps them. Until the demo host is up every href is the placeholder and
     every button says so; see ./demo.ts. */
  const demoButtons = [
    ...d.demos.modules.map((m) => ({
      key: m.id,
      label: m.name,
      aria: m.demo,
      href: demoHref(locale, [m.id as ModuleId]),
    })),
    {
      key: "todo",
      label: d.demos.all,
      aria: d.demos.allAria,
      href: demoHref(locale, allModules),
    },
  ];

  return (
    <main id="main" className="pg-showcase">
      <span id="top" />

      {/* ==================== THE PITCH, AND THE DEMOS ==================== */}
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
              <p className="brandline">{s.brandline}</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="sc-demos" id="demos">
              <span className="sc-demos-label mono">{d.demos.label}</span>
              <div className="sc-demo-row">
                {demoButtons.map((b) => (
                  <Link
                    className="sc-demo-btn"
                    key={b.key}
                    href={b.href}
                    aria-label={b.aria}
                  >
                    <span>{b.label}</span>
                    {demoIsLive ? null : (
                      <span className="sc-soon mono">{d.demos.soon}</span>
                    )}
                  </Link>
                ))}
              </div>
              <p className="sc-note">{rich(d.demos.note)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== WHAT IS WRONG TODAY ==================== */}
      <section
        className="section sc-problem"
        id="problema"
        aria-labelledby="problem-title"
      >
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.problem.kicker}</span>
              <h2 id="problem-title">{d.problem.title}</h2>
              <p className="section-sub">{d.problem.sub}</p>
            </div>
          </Reveal>

          {/* The comparison the pitch names, drawn: the section that says the
              question takes an afternoon shows what the answer looks like. */}
          <Reveal delay={60}>
            {/* The running season, read at build time and passed down rather
                than read inside the client component, where the server and the
                browser could disagree across a new year. */}
            <VintageCompare locale={locale} year={new Date().getFullYear()} />
          </Reveal>

          <ol className="sc-problem-list">
            {d.problem.items.map((item, i) => (
              <Reveal delay={i * 50} key={item.h}>
                <li className="sc-problem-item">
                  <span className="sc-problem-n mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{item.h}</h3>
                  <p>{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ==================== THE THREE MODULES ==================== */}
      <div className="pg-modulos">
        <section
          className="section"
          id="modulos"
          aria-labelledby="sc-modules-title"
        >
          <div className="container">
            <Reveal>
              <div className="section-head">
                <span className="kicker">{d.modules.kicker}</span>
                <h2 id="sc-modules-title">{d.modules.title}</h2>
                <p className="section-sub">{rich(mod.hero.sub)}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {mod.modules.map((m, i) => (
          <ModuleBlock
            key={m.id}
            locale={locale}
            module={m}
            alt={i % 2 === 1}
            demoHref={demoHref(locale, [m.id as ModuleId])}
            /* The size lead is one sentence for all three modules, so it is
               read once. The demo note is off entirely here: the demo row at
               the top of this page already says the same thing, and saying it
               again under each button is the third and fourth telling. */
            showSizesLead={i === 0}
            showDemoNote={false}
          />
        ))}

        <Combinations locale={locale} />
      </div>

      {/* ==================== WHAT IT COSTS ==================== */}
      <div className="pg-precios">
        <section
          className="section"
          id="precios"
          aria-labelledby="sc-pricing-title"
        >
          <div className="container">
            <Reveal>
              <div className="section-head">
                <span className="kicker gold">{d.pricing.kicker}</span>
                <h2 id="sc-pricing-title">{d.pricing.title}</h2>
                <p className="section-sub">{rich(pr.hero.sub)}</p>
              </div>
            </Reveal>
          </div>
        </section>

        <ModuleFloors locale={locale} />
        <MixExample locale={locale} />
        <PricingDetails locale={locale} />
      </div>

      {/* ============================ CONTACT ============================ */}
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
                <p className="diag-desc">{rich(d.close.desc)}</p>
                <div className="diag-actions">
                  <a className="cta cta-lg" href={mailto}>
                    {s.diag.cta}
                  </a>
                  <Link className="btn-ghost" href={href("/contacto")}>
                    {d.close.ctaContact}
                  </Link>
                </div>
                <p className="diag-price">{rich(s.diag.price)}</p>
              </div>
              <div className="diag-specs">
                {d.close.specs.map((spec) => (
                  <div className="spec" key={spec}>
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
