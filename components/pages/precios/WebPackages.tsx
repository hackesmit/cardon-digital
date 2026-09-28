import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { sitios } from "@/lib/i18n/sitios";
import { currencyByLocale, formatPrice, webCareMonthly, webPackages } from "@/lib/pricing";

/**
 * The four website packages, smallest first, each beside the feature list
 * that produced its entry price. Every figure comes out of lib/pricing.ts
 * (webPackages, webCareMonthly); this component owns nothing typed. It is
 * rendered on /sitios-web and again on /precios, so the packages have one
 * home and the two pages cannot drift apart.
 */
export default function WebPackages({
  locale,
  kicker,
  more,
}: {
  locale: Locale;
  /** On /precios the block wears the service name as its kicker and links to its page. */
  kicker?: string;
  more?: { href: string; label: string };
}) {
  const d = sitios[locale].packages;
  const cur = currencyByLocale[locale];
  const care = formatPrice(locale, webCareMonthly()[cur]);
  const delivery = (min: number, max: number) =>
    (min === max ? String(min) : min + " a " + max).replace(" a ", locale === "en" ? " to " : " a ") +
    " " +
    d.daysUnit;

  return (
    <section className="section web-packages" id="paquetes" aria-labelledby="pk-title">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="kicker">{kicker ?? d.kicker}</span>
            <h2 id="pk-title">{d.title}</h2>
            <p className="section-sub">{d.sub}</p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="pk-grid">
            {webPackages.map((p, i) => {
              const name = d.names[p.id];
              const tag = d.tags[p.id];
              if (!name || !tag) throw new Error(`sitios: no ${locale} name for package ${p.id}`);
              return (
                <article className={"pk" + (i === 1 ? " pk-lead" : "")} key={p.id}>
                  <header className="pk-head">
                    <span className="pk-n mono">{"0" + (i + 1)}</span>
                    <h3 className="pk-name">{name}</h3>
                    <p className="pk-tag">{tag}</p>
                  </header>
                  <p className="pk-price">
                    <span className="pk-from mono">{d.fromLabel}</span>{" "}
                    <b>{formatPrice(locale, p.from[cur])}</b>
                  </p>
                  <dl className="pk-facts">
                    <div>
                      <dt>{d.deliveryLabel}</dt>
                      <dd>{delivery(p.deliveryDays.min, p.deliveryDays.max)}</dd>
                    </div>
                    <div>
                      <dt>{d.pagesLabel}</dt>
                      <dd>{p.pages}</dd>
                    </div>
                  </dl>
                  <p className="pk-k mono">{d.includesLabel}</p>
                  <ul className="pk-list">
                    {p.features.map((f) => {
                      const label = d.features[f];
                      if (!label) throw new Error(`sitios: no ${locale} name for feature ${f}`);
                      return <li key={f}>{label}</li>;
                    })}
                  </ul>
                </article>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="pk-care">
            <span className="pk-care-k mono">{d.careLabel}</span>
            <p className="pk-care-v">
              <b>{care}</b> <span className="mono">{d.perMonth}</span>
            </p>
            <p className="pk-care-body">{d.careBody}</p>
          </div>
        </Reveal>
        {more ? (
          <p className="pk-more">
            <Link href={more.href}>{more.label}</Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
