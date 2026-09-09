import { bridgeMask } from "@/components/pages/modulos/BridgeMap";
import CombinationPicker from "@/components/pages/modulos/CombinationPicker";
import Reveal from "@/components/site/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { modulos } from "@/lib/i18n/modulos";
import { rich } from "@/lib/i18n/rich";

/**
 * The seven combinations, with the bridge map beside them: one, two or three
 * modules, what each mix adds, and the line that says the service base is
 * charged once whatever the mix. No figure appears here; the priced version of
 * the same seven rows lives on /precios and is rendered by MixExample.
 *
 * It was the tail of /modulos and it is a component because the showcase home
 * carries the same section (bead hq-wrig5.15), so the seven rows are written
 * once, in lib/i18n/modulos.ts, and rendered the same way on both surfaces.
 *
 * The map beside the list is a picker since bead hq-wrig5.13: the three nodes
 * are toggles and the row that matches what is switched on is marked. The rows
 * below are still rendered here, on the server, and handed to the picker as
 * children; each one carries its own module mask so the marking is a CSS match
 * against the mask the picker puts on the wrapper, rather than seven
 * paragraphs of copy shipped to the browser to draw one border.
 */
export default function Combinations({
  locale,
  sectionId = "combina",
}: {
  locale: Locale;
  sectionId?: string;
}) {
  const d = modulos[locale].combina;

  return (
    <section
      className="section combina"
      id={sectionId}
      aria-labelledby={sectionId + "-title"}
    >
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="kicker gold">{d.kicker}</span>
            <h2 id={sectionId + "-title"}>{d.title}</h2>
            <p className="section-sub">{rich(d.sub)}</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <CombinationPicker locale={locale}>
            <ol className="combina-list">
              {d.items.map((item) => (
                <li
                  className={"combina-item is-" + item.kind}
                  data-combo={bridgeMask(item.modules)}
                  key={item.key}
                >
                  <span className="combina-kind mono">
                    {item.kind === "single"
                      ? d.single
                      : item.variant === "shared"
                        ? d.shared
                        : d.bridge}
                  </span>
                  <h3>{item.key}</h3>
                  <p>{item.line}</p>
                </li>
              ))}
            </ol>
          </CombinationPicker>
        </Reveal>

        <Reveal delay={80}>
          <p className="combina-foot">{d.foot}</p>
        </Reveal>
      </div>
    </section>
  );
}
