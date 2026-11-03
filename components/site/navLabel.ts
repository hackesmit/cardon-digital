import type { NavLabel } from "@/lib/brand";
import type { Locale } from "@/lib/i18n/config";
import { estilos } from "@/lib/i18n/estilos";
import { guias } from "@/lib/i18n/guias";
import { site } from "@/lib/i18n/site";

/**
 * The label of a nav or footer entry (lib/brand.ts names it by key). Most
 * come from the nav block; the footer keeps its own longer words for the
 * case, about and contact, and the styles and guides pages own the words that
 * name them (lib/i18n/estilos.ts, lib/i18n/guias.ts).
 */
export function navLabel(key: NavLabel, locale: Locale): string {
  const s = site[locale];
  switch (key) {
    case "estilos":
      return estilos[locale].navLabel;
    case "guias":
      return guias[locale].navLabel;
    case "footerWork":
      return s.footer.work;
    case "footerAbout":
      return s.footer.about;
    case "footerContact":
      return s.footer.contact;
    default:
      return s.nav[key];
  }
}
