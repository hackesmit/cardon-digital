import FloorChart from "@/components/pages/precios/FloorChart";
import { demoHref } from "@/lib/demo";
import type { Locale } from "@/lib/i18n/config";
import { precios } from "@/lib/i18n/precios";
import { rich } from "@/lib/i18n/rich";
import Reveal from "@/components/site/Reveal";
import {
  currencyByLocale,
  formatPrice,
  moduleFloors,
  moduleIds,
  type BundleItem,
  type ModuleId,
} from "@/lib/pricing";

/**
 * The three entry prices, most expensive first (DOCTRINE section 2), each one
 * beside the complete standard bundle that produced it. These are worked
 * examples 1 to 3 of pricing-modules.md 8.2, which is why each card carries
 * who the configuration is for as well as what is in it.
 *
 * The order, the figures and the feature lists all come out of lib/pricing.ts.
 * Nothing here is typed in, so a bundle that gains a feature or a rate that
 * moves changes this section without anybody editing copy.
 *
 * Since bead hq-wrig5.13 the section opens with the three figures compared
 * (./FloorChart) instead of leaving a reader to hold three cards in their head,
 * and the sentence about what the monthly is made of is read once beneath that
 * comparison rather than repeated on all three cards.
 *
 * Bead hq-4pu0q.7 moved the module detail a buyer needs in order to choose off
 * /modulos, which is retired (bead hq-4pu0q.8), and onto these cards: the configuration the
 * published price buys, the direction the size moves and where it stops, the
 * one caveat that changes what the entry build actually gives, and a link to
 * that module's demo. Nothing new is published; it is the same catalogue detail
 * read where the price is.
 */

/** Localized bundle lines, with the multiplicity where a feature repeats. */
function bundleLines(locale: Locale, bundle: BundleItem[]): string[] {
  const d = precios[locale];
  return bundle.map((item) => {
    const name = d.features[item.feature];
    if (!name) {
      // A slug on a public page would be a silent failure, so fail the build.
      throw new Error(`precios: no ${locale} name for feature ${item.feature}`);
    }
    return item.count > 1
      ? name + d.countSuffix.replace("{n}", String(item.count))
      : name;
  });
}

export default function ModuleFloors({ locale }: { locale: Locale }) {
  const d = precios[locale].floors;
  const scenarios = precios[locale].examples;
  const currency = currencyByLocale[locale];
  // Most expensive first, ranked on the data rather than on a hand-kept list.
  const ranked = [...moduleIds].sort(
    (a, b) => moduleFloors[b].setup.MXN - moduleFloors[a].setup.MXN,
  );

  return (
    <section className="section floors" id="floors" aria-labelledby="floors-title">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="kicker">{d.kicker}</span>
            {/* No standfirst here on purpose: it restated the card's own
                "bought on its own" and "the complete build" labels, which is
                the paragraph doctrine section 3 says to delete. */}
            <h2 id="floors-title">{d.title}</h2>
          </div>
        </Reveal>

        {/* the three figures next to each other, before the three cards */}
        <Reveal delay={60}>
          <div className="floor-vis">
            <FloorChart locale={locale} />
            <p className="floor-note">{d.monthlyNote}</p>
          </div>
        </Reveal>

        <div className="floor-grid">
          {ranked.map((id: ModuleId, i) => {
            const floor = moduleFloors[id];
            const m = d.modules[id];
            const who = scenarios[id];
            if (!who) {
              // Same rule as a feature name: an empty slot on a public page is
              // a silent failure, so a missing scenario fails the build.
              throw new Error(`precios: no ${locale} scenario for ${id}`);
            }
            return (
              <Reveal delay={i * 70} key={id}>
                <article className="floor">
                  <header className="floor-head">
                    <h3 className="floor-name">{m.name}</h3>
                    <p className="floor-tag">{m.tag}</p>
                  </header>

                  <p className="floor-who">{who}</p>

                  <div className="floor-figs">
                    <p className="floor-fig">
                      <span className="floor-k mono">{d.setupLabel}</span>
                      <span className="floor-v">
                        {formatPrice(locale, floor.setup[currency])}
                      </span>
                    </p>
                    <p className="floor-fig">
                      <span className="floor-k mono">{d.monthlyLabel}</span>
                      <span className="floor-v">
                        {formatPrice(locale, floor.monthly[currency])}
                      </span>
                    </p>
                    <p className="floor-alone mono">{d.aloneLabel}</p>
                  </div>

                  <p className="floor-bk mono">{d.buildLabel}</p>
                  <ul className="floor-list">
                    {bundleLines(locale, floor.bundle).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>

                  <dl className="floor-detail">
                    <dt className="floor-dk mono">{d.upLabel}</dt>
                    <dd className="floor-dv">{m.up}</dd>
                    <dt className="floor-dk mono">{d.limitLabel}</dt>
                    <dd className="floor-dv">{m.limit}</dd>
                  </dl>

                  {/* The demo host is a different origin, so it opens in its
                      own tab and the label names its module: three buttons on
                      one page are three destinations to a screen reader. */}
                  <a
                    className="floor-demo"
                    href={demoHref(locale, [id])}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {m.demo}
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="floor-demo-note">{d.demoNote}</p>
          <p className="floor-foot">{rich(d.note)}</p>
        </Reveal>
      </div>
    </section>
  );
}
