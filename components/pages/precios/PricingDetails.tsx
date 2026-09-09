import Reveal from "@/components/site/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { precios } from "@/lib/i18n/precios";
import { rich } from "@/lib/i18n/rich";
import { sharedServiceBaseLines } from "@/lib/pricing";

/**
 * The rest of the pricing page after the figures: what the monthly service fee
 * pays for, the annual rule, where ads and content attach, and the terms in
 * full. None of it prints a figure. The annual rule stays policy on purpose
 * (memo 8.1 publishes the rule and bars the percentage and the arithmetic), and
 * the early-exit term states the mechanism without a number, because the number
 * depends on the configuration and belongs on the quote.
 *
 * It was the tail of /precios and it is a component because the showcase home
 * carries the whole pricing page inline (bead hq-wrig5.15).
 */
export default function PricingDetails({ locale }: { locale: Locale }) {
  const d = precios[locale];

  return (
    <>
      {/* ==================== THE MONTHLY SERVICE FEE =================== */}
      <section
        className="section pr-monthly"
        id="mensualidad"
        aria-labelledby="monthly-title"
      >
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.monthly.kicker}</span>
              <h2 id="monthly-title">{d.monthly.title}</h2>
              <p className="section-sub">{d.monthly.sub}</p>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <ul className="pr-list">
              {sharedServiceBaseLines.map((line) => {
                const name = d.monthly.lines[line.id];
                if (!name) {
                  // A slug on a public page is a silent failure, so fail here.
                  throw new Error(
                    `precios: no ${locale} name for service line ${line.id}`,
                  );
                }
                return <li key={line.id}>{name}</li>;
              })}
            </ul>
          </Reveal>

          <Reveal delay={60}>
            <p className="pr-note">{rich(d.monthly.foot)}</p>
          </Reveal>
        </div>
      </section>

      {/* ======================= PAYING A YEAR UP FRONT ================= */}
      <section
        className="section pr-annual"
        id="anual"
        aria-labelledby="annual-title"
      >
        <div className="container">
          <Reveal>
            <div className="pr-block">
              <span className="kicker gold">{d.annual.kicker}</span>
              <h2 id="annual-title">{d.annual.title}</h2>
              <p className="pr-body">{rich(d.annual.body)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ ADS AND CONTENT ================== */}
      <section
        className="section pr-ads"
        id="anuncios"
        aria-labelledby="ads-title"
      >
        <div className="container">
          <Reveal>
            <div className="pr-block">
              <span className="kicker">{d.ads.kicker}</span>
              <h2 id="ads-title">{d.ads.title}</h2>
              <p className="pr-body">{rich(d.ads.body)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ TERMS ============================ */}
      <section
        className="section pr-terms"
        id="condiciones"
        aria-labelledby="terms-title"
      >
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="kicker">{d.terms.kicker}</span>
              <h2 id="terms-title">{d.terms.title}</h2>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <ol className="pr-terms-list">
              {d.terms.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
    </>
  );
}
