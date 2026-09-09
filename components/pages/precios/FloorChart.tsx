import type { Locale } from "@/lib/i18n/config";
import { precios } from "@/lib/i18n/precios";
import {
  currencyByLocale,
  formatPrice,
  moduleFloors,
  moduleIds,
  type ModuleId,
} from "@/lib/pricing";

/**
 * The three entry prices, compared (bead hq-wrig5.13). The cards under it say
 * what each figure buys; this says how far apart they are, which is the one
 * thing three cards side by side do not show.
 *
 * Two charts and not one. Setup and monthly are amounts of different size, so
 * they get a scale each and are drawn as two groups sharing the module order.
 * Putting them on one pair of axes would be the dual-axis mistake: the bars
 * would be comparable by accident and misleading by construction.
 *
 * Colour is the module, never its rank, so the order of the bars can change
 * without the colours moving: Produccion --primary, Hospitalidad --secondary,
 * Restaurante --energy-bright, the same three the module boards and the
 * stacked monthly bars use. --energy-bright rather than --energy because the
 * raw gold and clay tokens sit a deuteranope delta E of 5.7 apart, under the
 * floor; the derived pair passes on both modes (see the note in precios.css).
 * Every bar is direct-labelled with its own figure as well, so no reading here
 * depends on telling two colours apart.
 *
 * Every figure comes out of lib/pricing.ts. Nothing is typed, here or in the
 * dictionary, which is the same rule the rest of this page follows.
 */
export default function FloorChart({ locale }: { locale: Locale }) {
  const d = precios[locale].floors;
  const currency = currencyByLocale[locale];
  // Most expensive first, ranked on the data, exactly as the cards below are.
  const ranked = [...moduleIds].sort(
    (a, b) => moduleFloors[b].setup.MXN - moduleFloors[a].setup.MXN,
  );

  const groups = [
    {
      key: "setup" as const,
      label: d.setupLabel,
      value: (id: ModuleId) => moduleFloors[id].setup[currency],
    },
    {
      key: "monthly" as const,
      label: d.monthlyLabel,
      value: (id: ModuleId) => moduleFloors[id].monthly[currency],
    },
  ];

  return (
    <div className="fc">
      {groups.map((group) => {
        const top = Math.max(...ranked.map((id) => group.value(id)));
        return (
          <figure className="fc-group" key={group.key}>
            <figcaption className="fc-cap mono">{group.label}</figcaption>
            <ul className="fc-bars">
              {ranked.map((id) => (
                <li className="fc-row" key={id}>
                  <span className="fc-name">{d.modules[id].name}</span>
                  <span className="fc-track">
                    <span
                      className="fc-bar"
                      data-module={id}
                      style={{ width: (group.value(id) / top) * 100 + "%" }}
                    />
                  </span>
                  <span className="fc-val mono">
                    {formatPrice(locale, group.value(id))}
                  </span>
                </li>
              ))}
            </ul>
          </figure>
        );
      })}
    </div>
  );
}
