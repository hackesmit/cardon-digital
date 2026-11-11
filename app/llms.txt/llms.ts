import type { DoorVariant } from "@/lib/contact/doors";
import { GUIDES, guidePath } from "@/lib/guides";
import { localePath, type Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/i18n/metadata";
import { BRAND } from "@/lib/brand";
import { advertisesPath } from "@/lib/routes";
import { about, aboutVino } from "@/lib/i18n/about";
import { anuncios } from "@/lib/i18n/anuncios";
import { contact } from "@/lib/i18n/contact";
import { demosIndex } from "@/lib/i18n/demos-index";
import { enkanto } from "@/lib/i18n/enkanto";
import { estilos } from "@/lib/i18n/estilos";
import { guias } from "@/lib/i18n/guias";
import { home } from "@/lib/i18n/home";
import { homeVino } from "@/lib/i18n/home-vino";
import { monteXanic } from "@/lib/i18n/monte-xanic";
import { precios } from "@/lib/i18n/precios";
import { privacy } from "@/lib/i18n/privacy";
import { sitios } from "@/lib/i18n/sitios";
import { software } from "@/lib/i18n/software";
import { softwareCardon } from "@/lib/i18n/software-cardon";
import { terms } from "@/lib/i18n/terms";
import { visibilidad } from "@/lib/i18n/visibilidad-ia";
import { winery } from "@/lib/i18n/winery";

/**
 * The /llms.txt body, in the llmstxt.org shape: an H1, a blockquote summary,
 * then H2 sections of links. Nothing here is written for this file. Every line
 * is a page's own title and meta description, so the file cannot state a fact
 * the site does not, and it changes when the pages do. Spanish leads, as on
 * the site; the legal pages sit under Optional, the section the format marks
 * as skippable.
 *
 * It describes the build's brand (lib/brand.ts): a page that brand does not
 * serve is left out, as the sitemap leaves it out. The wine brand's home line
 * is its own home page's (lib/i18n/home-vino.ts).
 */

type Meta = { title: string; description: string };
type Page = { path: string; meta: (l: Locale) => Meta };

const page = (path: string, meta: (l: Locale) => Meta): Page => ({ path, meta });

const SERVICES = [
  page("/sitios-web", (l) => sitios[l].meta),
  page("/anuncios", (l) => anuncios[l].meta),
  // /software is custom software on cardon and the modules on the wine brand.
  page("/software", (l) => (BRAND.id === "cardon" ? softwareCardon : software)[l].meta),
  page("/visibilidad-ia", (l) => visibilidad[l].meta),
];
const PRICES = [page("/precios", (l) => (BRAND.id === "cardon" ? precios[l].cardon.meta : precios[l].meta))];
/** The guides index, then every guide in lib/guides, newest first. */
const GUIDE_PAGES = [
  page("/guias", (l) => guias[l].meta),
  ...GUIDES.map((g) => page(guidePath(g.slug), (l) => g.copy[l].meta)),
];
const LEGAL = [page("/privacy", (l) => privacy[l].meta), page("/terms", (l) => terms[l].meta)];

/** The home page's title and description for the build's brand. */
const homeMeta = (l: Locale): Meta => (BRAND.id === "cardon" ? home[l].meta : homeVino[l].meta);

function keyPages(doors: DoorVariant): Page[] {
  return [
    page("/", homeMeta),
    page("/work/monte-xanic", (l) => monteXanic[l].meta),
    page("/work/enkanto", (l) => enkanto[l].meta),
    page("/industries/winery", (l) => winery[l].meta),
    page("/demos", (l) => demosIndex[l].meta),
    page("/estilos", (l) => estilos[l].meta),
    page("/about", (l) => (BRAND.id === "cardon" ? about : aboutVino)[l].meta),
    // The contact description names the doors this build has, as the page does.
    page("/contacto", (l) => ({
      title: contact[l].meta.title,
      description: contact[l].meta.description[doors],
    })),
  ];
}

const HEADINGS: Record<Locale, { services: string; prices: string; guides: string; key: string }> = {
  es: { services: "Servicios", prices: "Precios", guides: "Guías", key: "Casos y páginas clave" },
  en: {
    services: "Services (English)",
    prices: "Pricing (English)",
    guides: "Guides (English)",
    key: "Work and key pages (English)",
  },
};

const SLUGS = GUIDES.map((g) => g.slug);

function list(locale: Locale, pages: Page[]): string[] {
  return pages.filter((p) => advertisesPath(BRAND, SLUGS, p.path)).map((p) => {
    const { title, description } = p.meta(locale);
    return `- [${title}](${SITE_URL + localePath(locale, p.path)}): ${description}`;
  });
}

export function llmsTxt(doors: DoorVariant): string {
  const key = keyPages(doors);
  const lines = ["# " + BRAND.name, "", "> " + homeMeta("es").description, "", homeMeta("en").description];
  // A section the brand has no page for is left out whole, heading and all.
  const section = (heading: string, items: string[]) => {
    if (items.length > 0) lines.push("", "## " + heading, "", ...items);
  };
  for (const l of ["es", "en"] as const) {
    const h = HEADINGS[l];
    section(h.services, list(l, SERVICES));
    section(h.prices, list(l, PRICES));
    section(h.guides, list(l, GUIDE_PAGES));
    section(h.key, list(l, key));
  }
  lines.push("", "## Optional", "", ...list("es", LEGAL), ...list("en", LEGAL));
  return lines.join("\n") + "\n";
}
