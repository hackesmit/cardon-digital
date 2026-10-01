import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { sitios } from "@/lib/i18n/sitios";
import {
  currencyByLocale,
  formatPrice,
  webCareMonthly,
  webPackages,
  type WebPackage,
} from "@/lib/pricing";

/**
 * The website packages as a price list: one row per package, the price large
 * on the right, and each row listing only what it ADDS over the package it
 * builds on. Four cards that each repeated the whole list read as generated
 * and buried the difference between them (Daniel, 2026-10-01); a reader
 * choosing a package needs the difference, and the first row carries the
 * base.
 *
 * Every figure and every feature comes out of lib/pricing.ts (webPackages,
 * webCareMonthly); the base of a row is derived, never typed: the largest
 * earlier package whose features this one contains. Rendered on /sitios-web
 * and on /precios, so the packages have one home.
 */

/** The largest earlier package whose whole feature list this one contains. */
function baseOf(p: WebPackage, earlier: readonly WebPackage[]): WebPackage | null {
  let best: WebPackage | null = null;
  for (const q of earlier) {
    if (q.features.every((f) => p.features.includes(f))) {
      if (!best || q.features.length > best.features.length) best = q;
    }
  }
  return best;
}

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
  const days = (min: number, max: number) =>
    (min === max ? String(min) : min + d.rangeJoin + max) + " " + d.daysUnit;

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
          <div className="pk-list">
            {webPackages.map((p, i) => {
              const name = d.names[p.id];
              const tag = d.tags[p.id];
              if (!name || !tag) throw new Error(`sitios: no ${locale} name for package ${p.id}`);
              const base = baseOf(p, webPackages.slice(0, i));
              const added = base ? p.features.filter((f) => !base.features.includes(f)) : p.features;
              return (
                <article className="pk-row" key={p.id}>
                  <div className="pk-what">
                    <h3 className="pk-name">{name}</h3>
                    <p className="pk-tag">{tag}</p>
                    <p className="pk-meta mono">
                      {days(p.deliveryDays.min, p.deliveryDays.max)}
                      <span aria-hidden="true"> / </span>
                      {p.pages} {p.pages === 1 ? d.pageUnit : d.pagesUnit}
                    </p>
                  </div>
                  <div className="pk-adds">
                    {base ? (
                      <p className="pk-plus mono">{d.plusLabel.replace("{name}", d.names[base.id])}</p>
                    ) : null}
                    <ul className="pk-feats">
                      {added.map((f) => {
                        const label = d.features[f];
                        if (!label) throw new Error(`sitios: no ${locale} name for feature ${f}`);
                        return <li key={f}>{label}</li>;
                      })}
                    </ul>
                  </div>
                  <p className="pk-price">
                    <span className="pk-from mono">{d.fromLabel}</span>
                    <b>{formatPrice(locale, p.from[cur])}</b>
                  </p>
                </article>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={60}>
          <p className="pk-care">
            <span className="pk-care-k mono">{d.careLabel}</span>
            <b>{care}</b> <span className="mono">{d.perMonth}</span>
            <span className="pk-care-body">{d.careBody}</span>
          </p>
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
