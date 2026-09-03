import { rich } from "@/lib/i18n/rich";
import type { Locale } from "@/lib/i18n/config";
import { winery } from "@/lib/i18n/winery";
import {
  formatPrice,
  wineryBundles,
  wineryPricingPlaceholder,
  winerySetupFloor,
} from "@/lib/pricing";

/**
 * The winery pricing section. Three scoped bundles as feature lists, most
 * expensive first, and exactly one figure above them.
 *
 * The figure and the lists are deliberately in the same section: memo
 * research/2026-09/pricing-features.md section 3.7 rule 3 says a price never
 * travels away from the features that produced it, and rule 4 says a public
 * surface carries one floor figure rather than a table. While
 * `wineryPricingPlaceholder` is true the floor line prints the diagnostic
 * sentence instead of a number, in both locales, and the lists carry the
 * section on their own.
 *
 * The bundle order comes from the data module, not from this file, so the
 * copy and the numbers cannot drift out of order.
 */
export default function PricingBundles({ locale }: { locale: Locale }) {
  const d = winery[locale].pricing;
  const floor = wineryPricingPlaceholder
    ? d.floorTbd
    : d.floor.replace("{setup}", formatPrice(locale, winerySetupFloor(locale)));

  return (
    <section
      className="section pricing"
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="container">
        <div className="section-head">
          <span className="kicker wine">{d.kicker}</span>
          <h2 id="pricing-title">{d.title}</h2>
          <p className="section-sub">{d.sub}</p>
        </div>

        <p className="price-floor">
          <span className="price-floor-k">{d.floorLabel}</span>
          <span className="price-floor-v">{rich(floor)}</span>
        </p>

        <div className="bundle-grid">
          {wineryBundles.map(({ id }, i) => {
            const bundle = d.bundles[i];
            return (
            <article
              className={"bundle spot" + (i === 1 ? " bundle-lead" : "")}
              key={id}
            >
              <header className="bundle-head">
                <h3 className="bundle-name">{bundle.name}</h3>
                <span className="bundle-scale">{bundle.scale}</span>
              </header>

              <p className="bundle-k">{d.buildLabel}</p>
              <ul className="bundle-list">
                {bundle.build.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="bundle-k">{d.serviceLabel}</p>
              <ul className="bundle-list bundle-list-service">
                {bundle.service.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            );
          })}
        </div>

        <div className="price-terms">
          <span className="price-terms-k">{d.termsLabel}</span>
          <ul className="price-terms-list">
            {d.terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
