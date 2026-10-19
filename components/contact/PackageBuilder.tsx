"use client";

import Link from "next/link";
import "./builder.css";
import HalftoneSunset, { builderLevel } from "@/components/contact/HalftoneSunset";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { localePath, type Locale } from "@/lib/i18n/config";
import { builder } from "@/lib/i18n/builder";
import { sitios } from "@/lib/i18n/sitios";
import { anuncios } from "@/lib/i18n/anuncios";
import { precios } from "@/lib/i18n/precios";
import {
  EMPTY_SELECTION,
  encodeSelection,
  estimate,
  type BuilderSelection,
  type Priced,
} from "@/lib/builder";
import {
  adsManagement,
  adsScope,
  currencyByLocale,
  formatPercent,
  formatPrice,
  moduleFloors,
  moduleIds,
  webCareMonthly,
  webPackages,
  type ModuleId,
} from "@/lib/pricing";

/**
 * The package builder (Daniel, 2026-10-16). Three groups: one website package
 * (plus optional care), one ads scope, any software modules. Each option shows
 * its entry price and opens to what it includes; the estimate beside it adds
 * up as the client ticks. Every figure comes from lib/builder.ts, which reads
 * lib/pricing.ts at the entry size only.
 *
 * Controlled: the contact form owns the selection and sends it with the
 * message. On /precios it runs standalone and hands the selection to
 * /contacto in a link.
 */
export default function PackageBuilder({
  value,
  onChange,
  mode,
}: {
  value: BuilderSelection;
  onChange: (next: BuilderSelection) => void;
  mode: "form" | "standalone";
}) {
  const locale = useLocale();
  const d = builder[locale];
  const cur = currencyByLocale[locale];
  const price = (p: Priced) => formatPrice(locale, p[cur]);
  const est = estimate(value);

  const web = sitios[locale].packages;
  const ads = anuncios[locale].pricing;
  const pr = precios[locale];

  const setWeb = (id: BuilderSelection["web"]) =>
    onChange({ ...value, web: id, care: id === null ? false : value.care });
  const setAds = (id: BuilderSelection["ads"]) => onChange({ ...value, ads: id });
  const toggleModule = (id: ModuleId) => {
    const on = value.modules.includes(id);
    const next = on ? value.modules.filter((m) => m !== id) : [...value.modules, id];
    onChange({ ...value, modules: moduleIds.filter((m) => next.includes(m)) });
  };

  const name = (n: string | undefined, what: string) => {
    if (!n) throw new Error(`builder: no ${locale} name for ${what}`);
    return n;
  };
  const moduleFeatures = (id: ModuleId) =>
    moduleFloors[id].bundle.map((item) => {
      const label = name(pr.features[item.feature], "feature " + item.feature);
      return item.count > 1 ? label + pr.countSuffix.replace("{n}", String(item.count)) : label;
    });

  const groupName = (g: string) => "pb-" + g + "-" + mode;

  return (
    <div className="pb" data-mode={mode}>
      {/* Decoration: the sunset fills in as boxes are ticked. The level is a
          plain number so hq-lgjo.6 can drive it from per-feature ticks later. */}
      <HalftoneSunset level={builderLevel(value)} />
      <div className="pb-groups">
        {/* ============================ WEBSITE ============================ */}
        <fieldset className="pb-group">
          <legend className="pb-legend">
            <span className="pb-gtitle">{d.groups.web.title}</span>
            <span className="pb-ghint">{d.groups.web.hint}</span>
          </legend>
          <label className={"pb-opt pb-none" + (value.web === null ? " is-on" : "")}>
            <input type="radio" name={groupName("web")} checked={value.web === null} onChange={() => setWeb(null)} />
            <span className="pb-name">{d.none}</span>
          </label>
          {webPackages.map((p) => (
            <div className={"pb-opt" + (value.web === p.id ? " is-on" : "")} key={p.id}>
              <label className="pb-pick">
                <input type="radio" name={groupName("web")} checked={value.web === p.id} onChange={() => setWeb(p.id)} />
                <span className="pb-what">
                  <span className="pb-name">{name(web.names[p.id], "package " + p.id)}</span>
                  <span className="pb-tag">{name(web.tags[p.id], "tag " + p.id)}</span>
                </span>
                <span className="pb-price">
                  <span className="pb-from mono">{d.from}</span> {price(p.from)}
                </span>
              </label>
              <details className="pb-more">
                <summary>{d.includes}</summary>
                <p className="pb-meta mono">{p.pages === 1 ? d.page : d.pages.replace("{n}", String(p.pages))}</p>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>{name(web.features[f], "feature " + f)}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
          {value.web !== null ? (
            <label className={"pb-opt pb-care" + (value.care ? " is-on" : "")}>
              <input type="checkbox" checked={value.care} onChange={(e) => onChange({ ...value, care: e.target.checked })} />
              <span className="pb-what">
                <span className="pb-name">{d.care}</span>
                <span className="pb-tag">{d.careBody}</span>
              </span>
              <span className="pb-price">
                {price(webCareMonthly())} <span className="mono">{d.perMonth}</span>
              </span>
            </label>
          ) : null}
        </fieldset>

        {/* ============================== ADS ============================== */}
        <fieldset className="pb-group">
          <legend className="pb-legend">
            <span className="pb-gtitle">{d.groups.ads.title}</span>
            <span className="pb-ghint">{d.groups.ads.hint}</span>
          </legend>
          <label className={"pb-opt pb-none" + (value.ads === null ? " is-on" : "")}>
            <input type="radio" name={groupName("ads")} checked={value.ads === null} onChange={() => setAds(null)} />
            <span className="pb-name">{d.none}</span>
          </label>
          {adsManagement.map((s) => (
            <div className={"pb-opt" + (value.ads === s.id ? " is-on" : "")} key={s.id}>
              <label className="pb-pick">
                <input type="radio" name={groupName("ads")} checked={value.ads === s.id} onChange={() => setAds(s.id)} />
                <span className="pb-what">
                  <span className="pb-name">{name(ads.names[s.id], "scope " + s.id)}</span>
                  <span className="pb-tag">{name(ads.scopes[s.id], "scope " + s.id)}</span>
                </span>
                <span className="pb-price">
                  {price(s.base)} <span className="mono">{d.perMonth}</span>
                </span>
              </label>
              <details className="pb-more">
                <summary>{d.includes}</summary>
                <ul>
                  <li>
                    {ads.setupLabel}: {price(s.setup)}
                  </li>
                  <li>
                    {d.adsBase}: {price(s.base)}, {d.adsPerContact.replace("{perContact}", price(s.perContact)).replace("{cap}", price(s.cap))}
                  </li>
                  <li>
                    {s.id === "local"
                      ? d.adsBudgetLocal.replace("{minLocal}", price(s.minimumBudget))
                      : d.adsBudgetCrecimiento.replace("{minCrecimiento}", price(s.minimumBudget))}
                  </li>
                </ul>
              </details>
            </div>
          ))}
        </fieldset>

        {/* ============================ SOFTWARE ============================ */}
        <fieldset className="pb-group">
          <legend className="pb-legend">
            <span className="pb-gtitle">{d.groups.software.title}</span>
            <span className="pb-ghint">{d.groups.software.hint}</span>
          </legend>
          {moduleIds.map((id) => {
            const m = pr.floors.modules[id];
            const on = value.modules.includes(id);
            return (
              <div className={"pb-opt" + (on ? " is-on" : "")} key={id}>
                <label className="pb-pick">
                  <input type="checkbox" checked={on} onChange={() => toggleModule(id)} />
                  <span className="pb-what">
                    <span className="pb-name">{name(m?.name, "module " + id)}</span>
                    <span className="pb-tag">{name(m?.tag, "module tag " + id)}</span>
                  </span>
                  <span className="pb-price">
                    <span className="pb-from mono">{d.from}</span> {price(moduleFloors[id].setup)}
                    <span className="pb-sub">
                      + {price(moduleFloors[id].monthly)} <span className="mono">{d.perMonth}</span>
                    </span>
                  </span>
                </label>
                <details className="pb-more">
                  <summary>{d.includes}</summary>
                  <ul>
                    {moduleFeatures(id).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </details>
              </div>
            );
          })}
        </fieldset>
      </div>

      {/* ============================ ESTIMATE ============================ */}
      <aside className="pb-summary" aria-labelledby={"pb-sum-" + mode}>
        <h3 className="pb-stitle" id={"pb-sum-" + mode}>
          {d.summary.title}
        </h3>
        <div aria-live="polite">
          {est === null ? (
            <p className="pb-empty">{d.summary.empty}</p>
          ) : (
            <>
              <ul className="pb-lines">
                {est.lines.map((l) => (
                  <SummaryLine key={l.kind} locale={locale} line={l} price={price} />
                ))}
              </ul>
              <dl className="pb-totals">
                <div>
                  <dt>{d.summary.setup}</dt>
                  <dd>{price(est.setup)}</dd>
                </div>
                <div>
                  <dt>{d.summary.monthly}</dt>
                  <dd>{price(est.monthly)}</dd>
                </div>
                <div className="pb-year">
                  <dt>{d.summary.yearOne}</dt>
                  <dd>{price(est.yearOne)}</dd>
                </div>
              </dl>
              {est.perContactOnTop ? <p className="pb-fine pb-warn">{d.summary.perContact}</p> : null}
              {value.ads ? (
                <p className="pb-fine pb-warn">
                  {value.ads === "local"
                    ? d.adsBudgetLocal.replace("{minLocal}", price(adsScope("local").minimumBudget))
                    : d.adsBudgetCrecimiento.replace("{minCrecimiento}", price(adsScope("crecimiento").minimumBudget))}
                </p>
              ) : null}
            </>
          )}
        </div>
        <p className="pb-fine">{d.summary.note}</p>
        {est !== null ? (
          <div className="pb-actions">
            {mode === "standalone" ? (
              <Link
                className="cta"
                href={localePath(locale, "/contacto") + "?paquete=" + encodeURIComponent(encodeSelection(value)) + "#form-title"}
              >
                {d.send}
              </Link>
            ) : null}
            <button type="button" className="pb-clear" onClick={() => onChange(EMPTY_SELECTION)}>
              {d.clear}
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function SummaryLine({
  locale,
  line,
  price,
}: {
  locale: Locale;
  line: NonNullable<ReturnType<typeof estimate>>["lines"][number];
  price: (p: Priced) => string;
}) {
  const d = builder[locale];
  const per = <span className="mono"> {d.perMonth}</span>;
  if (line.kind === "web") {
    return (
      <li>
        <span>{d.groups.web.title}: {sitios[locale].packages.names[line.id]}</span>
        <b>
          <span className="mono">{d.from} </span>
          {price(line.setup)}
        </b>
      </li>
    );
  }
  if (line.kind === "care") {
    return (
      <li>
        <span>{d.care}</span>
        <b>
          {price(line.monthly)}
          {per}
        </b>
      </li>
    );
  }
  if (line.kind === "ads") {
    return (
      <li>
        <span>{d.groups.ads.title}: {anuncios[locale].pricing.names[line.id]}</span>
        <b>
          {price(line.setup)} + {price(line.base)}
          {per}
        </b>
      </li>
    );
  }
  const names = line.modules.map((m) => precios[locale].floors.modules[m]?.name ?? m);
  const discounted = line.discounts.filter((x) => x.rate > 0);
  return (
    <li>
      <span>
        {d.groups.software.title}: {names.join(" + ")}
        {discounted.map((x) => (
          <small key={x.module} className="pb-disc">
            {precios[locale].floors.modules[x.module]?.name}: {d.mixDiscount.replace("{rate}", formatPercent(locale, x.rate))}
          </small>
        ))}
      </span>
      <b>
        {price(line.setup)} + {price(line.monthly)}
        {per}
      </b>
    </li>
  );
}
