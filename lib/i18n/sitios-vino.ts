import type { Locale } from "./config";
import type { Dict } from "./rich";
import { currencyByLocale, formatPrice, webCareMonthly, webPackageById, webPackages } from "../pricing";

/**
 * The wine brand's website page (/sitios-web on the vino build, bead hq-60dkt,
 * Daniel 2026-11-18: "email specifically for wineries about website problems
 * or ones that don't have sites to make them"). The winery outreach emails
 * link here, so it says two things: the website problems we fix for a winery,
 * and the site we build for a winery that has none.
 *
 * One short line per block (Daniel's taste, COPY-DOCTRINE.md). A fix is sold
 * as the package it needs, so the page prints no figure of its own: {price},
 * {care}, {min} and {max} are placeholders filled from lib/pricing.ts, and
 * {name} is the brand's name from lib/brand.ts. The package list is the shared
 * WebPackages component, so its names and features match cardondigital.com.
 */

const en = {
  meta: {
    title: "Websites for wineries",
    description:
      "We fix a winery website that does not work and build one for a winery that has none: tastings booked online, wine for sale, Spanish and English. One page from {price}, ready in {min} to {max} business days.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Websites for wineries",
    title: "A winery website that gets found,",
    titleAccent: "booked and bought from.",
    sub: "{name} fixes winery websites that do not work and builds one for the winery that has none: tastings booked online, wine for sale with card payment, Spanish and English, and pages Google and AI answers can read. Each package has its published price, and the domain and accounts stay in the winery's name.",
    cta: "Tell us about your site",
  },
  fixes: {
    kicker: "What we fix",
    title: "What is wrong with your winery's website?",
    items: [
      { problem: "It breaks on a phone.", fix: "We rebuild it for the phone, where visitors open it." },
      { problem: "Nobody can book a tasting.", fix: "Visitors book on the site and get a confirmation and a reminder." },
      { problem: "Nobody can buy the wine.", fix: "A store with card payment, shipping and pickup." },
      { problem: "It is only in Spanish.", fix: "An English version for the visitor from the north." },
      { problem: "Google shows the wrong page, or none.", fix: "One home page, set up for Google, the map and AI answers." },
    ],
    note: "Each fix is priced as the package it needs, below.",
  },
  none: {
    kicker: "No website yet",
  },
  proof: {
    kicker: "A winery we fixed",
    title: "Viñedo En'kanto: five home pages competing, now one bilingual store that takes orders.",
    link: "Read the case",
  },
  how: {
    kicker: "How it works",
    title: "How does it go, from the first message to the site live?",
    steps: [
      { k: "01", body: "Send us your site's address, or tell us about the winery if it has none." },
      { k: "02", body: "We say what to fix and which package covers it, at its published price." },
      { k: "03", body: "We build it, you approve it, and it goes live in the winery's name." },
    ],
  },
  faq: {
    title: "Questions wineries ask about their website",
    items: [
      {
        question: "How much does a winery website cost?",
        answer: "From {price} for one page. Bookings and an online store are their own packages, each with its price on this page. Monthly care is optional: {care}.",
      },
      {
        question: "How long does it take?",
        answer: "Between {allMin} and {allMax} business days, depending on the package.",
      },
      {
        question: "Can you fix the site we already have?",
        answer: "Yes. We say what fails and which package covers the fix. When the old site cannot carry it, we rebuild it on the same domain.",
      },
      {
        question: "Can a visitor from the United States buy wine on the site?",
        answer: "The store ships within Mexico. A visitor from the north takes the wine home within the personal allowance, and the site says so.",
      },
      {
        question: "Whose is the website?",
        answer: "The winery's. The domain, the accounts and the code are in its name from day one.",
      },
    ],
  },
  close: {
    title: "Shall we look at your winery's site?",
    optout: "Got an email from us and not interested? Reply \"no\" and we will not write again.",
  },
};

const es: typeof en = {
  meta: {
    title: "Sitios web para bodegas",
    description:
      "Arreglamos el sitio de la bodega que no funciona y hacemos el de la bodega que no tiene: catas con reservación en línea, vino a la venta, español e inglés. Una página desde {price}, lista en {min} a {max} días hábiles.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Sitios web para bodegas",
    title: "Un sitio de bodega que se encuentra,",
    titleAccent: "se reserva y vende.",
    sub: "{name} arregla el sitio de la bodega que no funciona y hace el de la que no tiene: catas con reservación en línea, venta de vino con pago con tarjeta, español e inglés, y páginas que Google y la IA leen bien. Cada paquete tiene precio publicado, y el dominio y las cuentas son de la bodega.",
    cta: "Cuéntenos de su sitio",
  },
  fixes: {
    kicker: "Lo que arreglamos",
    title: "¿Qué le falla al sitio de su bodega?",
    items: [
      { problem: "En el celular se ve mal.", fix: "Lo rehacemos para el teléfono, que es donde lo abren." },
      { problem: "La cata no se puede reservar.", fix: "La visita se reserva en el sitio, con confirmación y recordatorio." },
      { problem: "El vino no se puede comprar.", fix: "Una tienda con pago con tarjeta, envío y recolección." },
      { problem: "Solo está en español.", fix: "Una versión en inglés para el visitante del norte." },
      { problem: "Google muestra otra página, o ninguna.", fix: "Una sola página principal, lista para Google, el mapa y las respuestas de IA." },
    ],
    note: "Cada arreglo se cobra como el paquete que necesita, abajo.",
  },
  none: {
    kicker: "Si todavía no tiene sitio",
  },
  proof: {
    kicker: "Una bodega que arreglamos",
    title: "Viñedo En'kanto: cinco páginas de inicio peleándose, hoy una sola tienda bilingüe que toma pedidos.",
    link: "Leer el caso",
  },
  how: {
    kicker: "Cómo funciona",
    title: "¿Cómo se hace, del primer mensaje al sitio publicado?",
    steps: [
      { k: "01", body: "Nos manda la dirección de su sitio, o nos cuenta de la bodega si no tiene." },
      { k: "02", body: "Le decimos qué arreglar y qué paquete lo cubre, a su precio publicado." },
      { k: "03", body: "Lo construimos, usted lo aprueba y se publica a nombre de la bodega." },
    ],
  },
  faq: {
    title: "Lo que preguntan las bodegas sobre su sitio",
    items: [
      {
        question: "¿Cuánto cuesta el sitio web de una bodega?",
        answer: "Desde {price} por una página. Las reservaciones y la tienda en línea son paquetes aparte, cada uno con su precio en esta página. El mantenimiento mensual es opcional: {care}.",
      },
      {
        question: "¿Cuánto tarda?",
        answer: "Entre {allMin} y {allMax} días hábiles, según el paquete.",
      },
      {
        question: "¿Pueden arreglar el sitio que ya tenemos?",
        answer: "Sí. Le decimos qué falla y qué paquete cubre el arreglo. Si el sitio viejo no da para más, lo rehacemos en el mismo dominio.",
      },
      {
        question: "¿Un visitante de Estados Unidos puede comprar vino en el sitio?",
        answer: "La tienda envía dentro de México. El visitante del norte se lleva su vino dentro de su franquicia personal, y el sitio lo dice.",
      },
      {
        question: "¿De quién es el sitio?",
        answer: "De la bodega. El dominio, las cuentas y el código están a su nombre desde el primer día.",
      },
    ],
  },
  close: {
    title: "¿Revisamos el sitio de su bodega?",
    optout: "¿Le llegó un correo nuestro y no le interesa? Conteste \"no\" y no le volvemos a escribir.",
  },
};

export type SitiosVinoDict = typeof en;
export const sitiosVino: Dict<SitiosVinoDict> = { en, es };

/** The package a one-page winery site is: the entry figure the page quotes. */
const ENTRY = webPackageById("presencia");

/** Fills the placeholders: {name} from the brand, every figure from
    lib/pricing.ts. {price}, {min} and {max} are the one-page package's;
    {allMin} and {allMax} span every package; {care} is the monthly care. */
export function fillSitiosVino(locale: Locale, s: string, name: string): string {
  const cur = currencyByLocale[locale];
  const values: Record<string, string> = {
    name,
    price: formatPrice(locale, ENTRY.from[cur]),
    care: formatPrice(locale, webCareMonthly()[cur]),
    min: String(ENTRY.deliveryDays.min),
    max: String(ENTRY.deliveryDays.max),
    allMin: String(Math.min(...webPackages.map((p) => p.deliveryDays.min))),
    allMax: String(Math.max(...webPackages.map((p) => p.deliveryDays.max))),
  };
  return s.replace(/\{(name|price|care|min|max|allMin|allMax)\}/g, (_, k: string) => values[k]);
}

/** The page's title and description with every figure filled in. */
export function sitiosVinoMeta(locale: Locale, name: string): { title: string; description: string } {
  const m = sitiosVino[locale].meta;
  return { title: m.title, description: fillSitiosVino(locale, m.description, name) };
}
