import ComboVis from "@/components/pages/precios/ComboVis";
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
  moduleIds,
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
 *
 * Since bead hq-wrig5.13 the seven rows are drawn as well as printed: a bar
 * for the build, and a stacked bar for the monthly that is one shared base
 * plus one block per module bought. The drawing weights are pesos in both
 * locales, so the two currencies get the same picture rather than a picture
 * that changes shape with the exchange rate.
 *
 * The stacked bar carries NO printed split, on purpose. The base and each run
 * cost are rounded to their own step in pesos and converted to dollars
 * separately, so a printed split does not always add up to the printed total in
 * either currency, and on the all-three row the quoted monthly takes a rounding
 * increment the parts do not. Parts that fail a reader's arithmetic are worse
 * than no parts, so the bar shows the shape and the cell beside it shows the
 * figure; the bars are decoration for that reason and are hidden from assistive
 * technology, with the table itself as the data view and the legend as the key.
 * Nothing new is published either way: the shared base and every run cost are
 * figures memo 8.2 already writes out in its worked examples.
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

  /* Everything the drawing needs, resolved on the server so the dictionary and
     the pricing module stay out of the client bundle. The weights are pesos
     whichever currency is printed, so the bars are the same picture in both
     locales; the printed figures are still the reader's own currency. */
  const setupTop = Math.max(...combos.map((c) => c.quote.setup.MXN));
  const monthlyTop = Math.max(
    ...combos.map(
      (c) =>
        c.quote.sharedServiceBase +
        c.quote.runCosts.reduce((sum, run) => sum + run.monthly, 0),
    ),
  );
  /* The bars are drawn from pesos in both locales, so the two currencies get
     the same picture rather than one that changes shape with the rate. */
  const width = (weight: number, top: number) => (weight / top) * 100 + "%";

  const legend = [
    { key: "base", label: d.baseLabel },
    ...moduleIds.map((id) => ({
      key: id as string,
      label: precios[locale].floors.modules[id].name,
    })),
  ];

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

            <ComboVis legend={legend} legendNote={d.legendNote}>
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
                        <span className="combo-bar" aria-hidden="true">
                          <span
                            className="combo-fill"
                            data-part="setup"
                            style={{ width: width(combo.quote.setup.MXN, setupTop) }}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="combo-cell-k">{d.monthlyLabel}</span>
                        {formatPrice(locale, combo.quote.monthly[currency])}
                        <span className="combo-bar" aria-hidden="true">
                          <span
                            className="combo-fill"
                            data-part="base"
                            style={{
                              width: width(combo.quote.sharedServiceBase, monthlyTop),
                            }}
                          />
                          {combo.quote.runCosts.map((run) => (
                            <span
                              className="combo-fill"
                              key={run.module}
                              data-part={run.module}
                              style={{ width: width(run.monthly, monthlyTop) }}
                            />
                          ))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ComboVis>

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
