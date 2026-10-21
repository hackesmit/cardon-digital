import type { DoorVariant } from "@/lib/contact/doors";
import { GUIDES, guidePath } from "@/lib/guides";
import { localePath, type Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/i18n/metadata";
import { about } from "@/lib/i18n/about";
import { anuncios } from "@/lib/i18n/anuncios";
import { contact } from "@/lib/i18n/contact";
import { demosIndex } from "@/lib/i18n/demos-index";
import { enkanto } from "@/lib/i18n/enkanto";
import { estilos } from "@/lib/i18n/estilos";
import { guias } from "@/lib/i18n/guias";
import { home } from "@/lib/i18n/home";
import { monteXanic } from "@/lib/i18n/monte-xanic";
import { precios } from "@/lib/i18n/precios";
import { privacy } from "@/lib/i18n/privacy";
import { sitios } from "@/lib/i18n/sitios";
import { software } from "@/lib/i18n/software";
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
 */

type Meta = { title: string; description: string };
type Page = { path: string; meta: (l: Locale) => Meta };

const page = (path: string, meta: (l: Locale) => Meta): Page => ({ path, meta });

const SERVICES = [
  page("/sitios-web", (l) => sitios[l].meta),
  page("/anuncios", (l) => anuncios[l].meta),
  page("/software", (l) => software[l].meta),
  page("/visibilidad-ia", (l) => visibilidad[l].meta),
];
const PRICES = [page("/precios", (l) => precios[l].meta)];
/** The guides index, then every guide in lib/guides, newest first. */
const GUIDE_PAGES = [
  page("/guias", (l) => guias[l].meta),
  ...GUIDES.map((g) => page(guidePath(g.slug), (l) => g.copy[l].meta)),
];
const LEGAL = [page("/privacy", (l) => privacy[l].meta), page("/terms", (l) => terms[l].meta)];

function keyPages(doors: DoorVariant): Page[] {
  return [
    page("/", (l) => home[l].meta),
    page("/work/monte-xanic", (l) => monteXanic[l].meta),
    page("/work/enkanto", (l) => enkanto[l].meta),
    page("/industries/winery", (l) => winery[l].meta),
    page("/demos", (l) => demosIndex[l].meta),
    page("/estilos", (l) => estilos[l].meta),
    page("/about", (l) => about[l].meta),
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

function list(locale: Locale, pages: Page[]): string[] {
  return pages.map((p) => {
    const { title, description } = p.meta(locale);
    return `- [${title}](${SITE_URL + localePath(locale, p.path)}): ${description}`;
  });
}

export function llmsTxt(doors: DoorVariant): string {
  const key = keyPages(doors);
  const lines = ["# Cardon Digital", "", "> " + home.es.meta.description, "", home.en.meta.description];
  for (const l of ["es", "en"] as const) {
    const h = HEADINGS[l];
    lines.push("", "## " + h.services, "", ...list(l, SERVICES));
    lines.push("", "## " + h.prices, "", ...list(l, PRICES));
    lines.push("", "## " + h.guides, "", ...list(l, GUIDE_PAGES));
    lines.push("", "## " + h.key, "", ...list(l, key));
  }
  lines.push("", "## Optional", "", ...list("es", LEGAL), ...list("en", LEGAL));
  return lines.join("\n") + "\n";
}
