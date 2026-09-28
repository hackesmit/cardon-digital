import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { anuncios } from "@/lib/i18n/anuncios";
import { adsManagement, currencyByLocale, formatPrice } from "@/lib/pricing";

/**
 * The two ad management scopes: the flat monthly fee, the one-time campaign
 * build, the minimum monthly budget the client pays straight to Google, and
 * the scope each covers. Every figure is read out of lib/pricing.ts
 * (adsManagement), and the policy the rules state (flat, never a share of
 * spend, budget never through us) is the data module's own flags. Rendered on
 * /anuncios and on /precios.
 */
export default function AdsFee({
  locale,
  kicker,
  more,
}: {
  locale: Locale;
  /** On /precios the block wears the service name as its kicker and links to its page. */
  kicker?: string;
  more?: { href: string; label: string };
}) {
  const d = anuncios[locale].pricing;
  const cur = currencyByLocale[locale];
  const price = (n: number) => formatPrice(locale, n);

  return (
    <section className="section ads-fee" id="cuota" aria-labelledby="fee-title">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="kicker">{kicker ?? d.kicker}</span>
            <h2 id="fee-title">{d.title}</h2>
            <p className="section-sub">{d.sub}</p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="fee-grid">
            {adsManagement.map((s, i) => {
              const name = d.names[s.id];
              const scope = d.scopes[s.id];
              if (!name || !scope) throw new Error(`anuncios: no ${locale} name for scope ${s.id}`);
              if (s.percentOfSpend) throw new Error(`anuncios: scope ${s.id} is priced on spend`);
              return (
                <article className={"fee" + (i === 0 ? " fee-lead" : "")} key={s.id}>
                  <h3 className="fee-name">{name}</h3>
                  <p className="fee-scope">{scope}</p>
                  <dl className="fee-facts">
                    <div className="fee-main">
                      <dt>{d.monthlyLabel}</dt>
                      <dd>
                        <b>{price(s.monthly[cur])}</b>
                      </dd>
                    </div>
                    <div>
                      <dt>{d.setupLabel}</dt>
                      <dd>{price(s.setup[cur])}</dd>
                    </div>
                    <div>
                      <dt>{d.minLabel}</dt>
                      <dd>{price(s.minimumBudget[cur])}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={60}>
          <ul className="fee-rules">
            {d.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Reveal>
        {more ? (
          <p className="fee-more">
            <Link href={more.href}>{more.label}</Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
