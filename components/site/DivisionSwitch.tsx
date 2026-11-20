"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { site } from "@/lib/i18n/site";
import { stripLocale } from "@/lib/i18n/config";
import { BRAND, DIVISIONS, DIVISION_NAME, divisionHref } from "@/lib/brand";

/**
 * The division switch (bead hq-yj0hq): a slim row above the bar, on every
 * page, phone and desktop, outside the collapsing menu so it never hides.
 * Two links, Cardon Digital and the wine division, each with what it is for.
 * The one you are in is marked (aria-current and the division's accent); the
 * other goes to its matching page (lib/brand.ts, divisionHref).
 *
 * Plain anchors: the other division is another origin, a full page load.
 */
export default function DivisionSwitch() {
  const locale = useLocale();
  const path = stripLocale(usePathname() || "/");
  const t = site[locale].division;

  return (
    <nav className="division-bar" aria-label={t.label}>
      <ul className="container division-list">
        {DIVISIONS.map((d) => {
          const current = d === BRAND.id;
          return (
            <li key={d}>
              <a
                className={"division-link division-" + d}
                href={divisionHref(BRAND, d, locale, path)}
                aria-current={current ? "true" : undefined}
                hrefLang={locale}
              >
                <span className="division-name">{DIVISION_NAME[d]}</span>
                <span className="division-line">{t[d]}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
