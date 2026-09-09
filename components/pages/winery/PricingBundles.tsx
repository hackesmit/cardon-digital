import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { winery } from "@/lib/i18n/winery";

/**
 * The winery pricing section. The fee shape, the modules a winery buys, and
 * the terms. No figure appears here on purpose: pricing-features.md 3.7 rule 3
 * says a price never travels away from the feature list that produced it, and
 * that list lives on /precios, which is the only page that prints a figure.
 *
 * This section used to carry the three retired bundles and a floor slot behind
 * a placeholder flag. pricing-modules.md section 11 retires those names on
 * every surface, so both are gone rather than restyled.
 */
export default function PricingBundles({ locale }: { locale: Locale }) {
  const d = winery[locale].pricing;

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

        <p className="bundle-k">{d.modulesLabel}</p>
        <div className="bundle-grid">
          {d.modules.map((module) => (
            <article className="bundle spot" key={module.name}>
              <header className="bundle-head">
                <h3 className="bundle-name">{module.name}</h3>
                <span className="bundle-scale">{module.scale}</span>
              </header>
              <p className="bundle-body">{module.body}</p>
            </article>
          ))}
        </div>

        <p className="pricing-more">
          {d.moreLead}{" "}
          <Link href={localePath(locale, "/precios")}>{d.moreCta}</Link>
        </p>

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
