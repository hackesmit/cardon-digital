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
            <h2 id="floors-title">{d.title}</h2>
            <p className="section-sub">{rich(d.sub)}</p>
          </div>
        </Reveal>

        <div className="floor-grid">
          {ranked.map((id: ModuleId, i) => {
            const floor = moduleFloors[id];
            const m = d.modules[id];
            return (
              <Reveal delay={i * 70} key={id}>
                <article className="floor">
                  <header className="floor-head">
                    <h3 className="floor-name">{m.name}</h3>
                    <p className="floor-tag">{m.tag}</p>
                  </header>

                  <p className="floor-who">{scenarios[id]}</p>

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

                  <p className="floor-note">{d.monthlyNote}</p>

                  <p className="floor-bk mono">{d.buildLabel}</p>
                  <ul className="floor-list">
                    {bundleLines(locale, floor.bundle).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="floor-foot">{rich(d.note)}</p>
        </Reveal>
      </div>
    </section>
  );
}
