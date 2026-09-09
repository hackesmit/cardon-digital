import type { Locale } from "@/lib/i18n/config";
import {
  bridgesSentence,
  comboName,
  comboPricingClause,
  mixRankingSentence,
  mixRules,
  precios,
} from "@/lib/i18n/precios";
import { rich } from "@/lib/i18n/rich";
import Reveal from "@/components/site/Reveal";
import {
  bridgeFeatures,
  currencyByLocale,
  formatPrice,
  workedExamples,
} from "@/lib/pricing";

/**
 * What buying more than one module changes, stated as the rules and then shown
 * on every configuration a client can actually buy: the seven combinations at
 * the entry size, most expensive first, each with the discount its ranking
 * earns; then the all-three example against what the same three cost bought
 * separately, which is the one that makes the saving checkable.
 *
 * pricing-modules.md 8.1 lets a public surface carry worked examples, each with
 * the complete feature list that produced its figure. What 8.2 constrains is
 * the SIZE and not the count: publishing one module at two sizes would let a
 * reader rebuild a row of the per-size table decision 1 keeps off the site, so
 * examples vary the mix and never the size. The rows are selected by the data
 * module's own `publishable` flag rather than by ids written here, so the page
 * cannot publish something the memo does not allow (Lucy 2026-09-08, second
 * finding).
 *
 * The figures here are never called a floor: inside a mix a line is priced on
 * the hours actually built and sits legitimately below what the same module
 * costs alone (memo 8.3). The two bridge features are in no standard bundle, so
 * none of these figures pays for one and the note under the table says so
 * rather than leaving the reader to assume they are included.
 */
export default function MixExample({ locale }: { locale: Locale }) {
  const d = precios[locale].mix;
  const currency = currencyByLocale[locale];

  // Most expensive first, ranked on the figures rather than on a kept order.
  const combos = workedExamples
    .filter((e) => e.publishable)
    .sort((a, b) => b.quote.setup.MXN - a.quote.setup.MXN);
  if (combos.length === 0) {
    throw new Error("precios: no publishable worked examples");
  }

  const example = combos.find((e) => e.modules.length === 3);
  if (!example) {
    throw new Error("precios: no publishable three-module worked example");
  }

  const bridges = bridgeFeatures(example.modules);

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
            {mixRules(locale).map((rule) => (
              <li key={rule}>{rich(rule)}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={60}>
          <div className="mix-combos">
            <span className="kicker">{d.combosKicker}</span>
            <h3 className="mix-ex-title">{d.combosTitle}</h3>
            <p className="mix-ex-sub">{d.combosLead}</p>

            <table className="mix-table combo-table">
              <caption className="sr-only">{d.combosLabel}</caption>
              <thead>
                <tr>
                  <th scope="col">{d.comboLabel}</th>
                  <th scope="col" className="mono">
                    {d.setupLabel}
                  </th>
                  <th scope="col" className="mono">
                    {d.monthlyLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {combos.map((combo) => (
                  <tr key={combo.id}>
                    <th scope="row">
                      <span className="combo-name">
                        {comboName(locale, combo.modules)}
                      </span>
                      <span className="combo-how">
                        {comboPricingClause(locale, combo.quote.lines)}
                      </span>
                    </th>
                    {/* The label repeats inside the cell for the phone
                        layout, where the table stacks and the column head is
                        no longer beside the figure. */}
                    <td>
                      <span className="combo-cell-k">{d.setupLabel}</span>
                      {formatPrice(locale, combo.quote.setup[currency])}
                    </td>
                    <td>
                      <span className="combo-cell-k">{d.monthlyLabel}</span>
                      {formatPrice(locale, combo.quote.monthly[currency])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mix-note">{bridgesSentence(locale, bridges)}</p>
          </div>
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
                  <td>{formatPrice(locale, example.quote.setup[currency])}</td>
                  <td>{formatPrice(locale, example.quote.monthly[currency])}</td>
                </tr>
                <tr>
                  <th scope="row">{d.aloneLabel}</th>
                  <td>{formatPrice(locale, example.setupIfAlone[currency])}</td>
                  <td>{formatPrice(locale, example.monthlyIfAlone[currency])}</td>
                </tr>
                <tr className="mix-row-saving">
                  <th scope="row">{d.savingLabel}</th>
                  {/* Each saving is the conversion of its own rounded MXN
                      saving, never the difference of two converted totals
                      (Lucy 2026-09-08, fourth finding). */}
                  <td>{formatPrice(locale, example.setupSaving[currency])}</td>
                  <td>{formatPrice(locale, example.monthlySaving[currency])}</td>
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
