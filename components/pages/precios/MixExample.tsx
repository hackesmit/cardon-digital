import type { Locale } from "@/lib/i18n/config";
import { mixRankingSentence, precios } from "@/lib/i18n/precios";
import { rich } from "@/lib/i18n/rich";
import Reveal from "@/components/site/Reveal";
import { currencyByLocale, formatPrice, workedExamples } from "@/lib/pricing";

/**
 * What buying more than one module changes, stated as the rules and then shown
 * once on the configuration that makes the rules checkable: all three modules
 * at their entry size, against what the same three cost bought separately.
 *
 * pricing-modules.md 8.2 allows four worked examples on a public surface, all
 * at the entry size, and this is the fourth: the three single-module ones are
 * the entry-price cards above. Examples vary the mix and never the size, so no
 * reader can reconstruct a cell of the per-size table. The example is selected
 * by the data module's own `publishable` flag rather than by an id written
 * here, so the page cannot publish something the memo does not allow.
 *
 * The figures on this section are never called a floor: inside a mix a line is
 * priced on the hours actually built and sits legitimately below what the same
 * module costs alone (memo 8.3).
 */
export default function MixExample({ locale }: { locale: Locale }) {
  const d = precios[locale].mix;
  const currency = currencyByLocale[locale];

  const example = workedExamples.find(
    (e) => e.publishable && e.modules.length === 3,
  );
  if (!example) {
    throw new Error("precios: no publishable three-module worked example");
  }

  const setup = example.quote.setup[currency];
  const monthly = example.quote.monthly[currency];
  const setupAlone = example.setupIfAlone[currency];
  const monthlyAlone = example.monthlyIfAlone[currency];

  return (
    <section className="section mix" id="combinaciones" aria-labelledby="mix-title">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="kicker gold">{d.kicker}</span>
            <h2 id="mix-title">{d.title}</h2>
            <p className="section-sub">{rich(d.sub)}</p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <ul className="mix-rules">
            {d.rules.map((rule) => (
              <li key={rule}>{rich(rule)}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={60}>
          <article className="mix-example">
            <span className="kicker">{d.exampleKicker}</span>
            <h3 className="mix-ex-title">{d.exampleTitle}</h3>
            <p className="mix-ex-sub">
              {mixRankingSentence(locale, example.modules)}
            </p>

            <table className="mix-table">
              <caption className="sr-only">{d.figuresLabel}</caption>
              <thead>
                <tr>
                  <th scope="col" />
                  <th scope="col" className="mono">
                    {d.setupLabel}
                  </th>
                  <th scope="col" className="mono">
                    {d.monthlyLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="mix-row-together">
                  <th scope="row">{d.togetherLabel}</th>
                  <td>{formatPrice(locale, setup)}</td>
                  <td>{formatPrice(locale, monthly)}</td>
                </tr>
                <tr>
                  <th scope="row">{d.aloneLabel}</th>
                  <td>{formatPrice(locale, setupAlone)}</td>
                  <td>{formatPrice(locale, monthlyAlone)}</td>
                </tr>
                <tr className="mix-row-saving">
                  <th scope="row">{d.savingLabel}</th>
                  <td>{formatPrice(locale, setupAlone - setup)}</td>
                  <td>{formatPrice(locale, monthlyAlone - monthly)}</td>
                </tr>
              </tbody>
            </table>

            <p className="mix-note">{d.note}</p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
