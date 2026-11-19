import type { Locale } from "./config";
import type { Dict } from "./rich";
import { currencyByLocale, formatPrice, webCareMonthly, webPackageById } from "../pricing";

/**
 * The page for a local business with no website yet (/negocio-local, bead
 * hq-4l9oj, Daniel 2026-11-18). It is the landing page the no-website outreach
 * emails link to, so it says one thing: the one-page site (the Presencia
 * package), what it carries, when it is ready, what it costs, and how to say
 * yes.
 *
 * One short line per block (Daniel's taste). Every figure is read out of
 * lib/pricing.ts by the page: {price}, {care}, {min} and {max} here are
 * placeholders, never typed amounts. The package's feature names come from
 * lib/i18n/sitios.ts, so this page and /sitios-web name them the same way.
 */

const en = {
  meta: {
    title: "A website for your business",
    description:
      "A one-page website for a business that has none yet: your services, photos, hours, map and a button to message you. Ready in {min} to {max} business days, from {price}.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "For businesses with no website",
    title: "Your business, on its own page,",
    titleAccent: "in {min} to {max} business days.",
    sub: "Your services, photos, hours, map and a button to message you, on a page that stays in your name.",
    whatsapp: "Message us on WhatsApp",
    write: "Send a message",
  },
  gets: {
    kicker: "What you get",
    title: "One complete page, ready to share.",
  },
  price: {
    kicker: "What it costs",
    from: "from",
    line: "One page, {min} to {max} business days.",
  },
  how: {
    kicker: "How it works",
    title: "Three steps.",
    steps: [
      { k: "01", body: "A 15 minute call about your business." },
      { k: "02", body: "You send photos and hours; we write the text with you." },
      { k: "03", body: "You approve the page and it goes live." },
    ],
  },
  proof: {
    kicker: "A recent site",
    line: "Aperta Media Co., a photo and video studio.",
    link: "See the live site",
  },
  close: {
    title: "Want one for your business?",
    optout: "Got an email from us and not interested? Reply \"no\" and we will not write again.",
  },
  /** The text a WhatsApp message starts with. */
  prefill: "Hi, I would like a website for my business.",
};

const es: typeof en = {
  meta: {
    title: "Página web para su negocio",
    description:
      "Una página web para el negocio que todavía no tiene: sus servicios, fotos, horario, mapa y un botón para que le escriban. Lista en {min} a {max} días hábiles, desde {price}.",
  },
  hero: {
    aria: "Introducción",
    eyebrow: "Para negocios sin página web",
    title: "Su negocio, con su propia página,",
    titleAccent: "en {min} a {max} días hábiles.",
    sub: "Sus servicios, fotos, horario, mapa y un botón para que le escriban, en una página que queda a su nombre.",
    whatsapp: "Escribir por WhatsApp",
    write: "Mandar un mensaje",
  },
  gets: {
    kicker: "Lo que recibe",
    title: "Una página completa, lista para compartir.",
  },
  price: {
    kicker: "Lo que cuesta",
    from: "desde",
    line: "Una página, {min} a {max} días hábiles.",
  },
  how: {
    kicker: "Cómo funciona",
    title: "Tres pasos.",
    steps: [
      { k: "01", body: "Una llamada de 15 minutos sobre su negocio." },
      { k: "02", body: "Usted manda fotos y horario; los textos los escribimos con usted." },
      { k: "03", body: "Usted aprueba la página y se publica." },
    ],
  },
  proof: {
    kicker: "Un sitio reciente",
    line: "Aperta Media Co., estudio de foto y video.",
    link: "Ver el sitio",
  },
  close: {
    title: "¿La quiere para su negocio?",
    optout: "¿Le llegó un correo nuestro y no le interesa? Conteste \"no\" y no le volvemos a escribir.",
  },
  prefill: "Hola, quiero una página web para mi negocio.",
};

export type NegocioLocalDict = typeof en;
export const negocioLocal: Dict<NegocioLocalDict> = { en, es };

/** The one package this page sells: the one-page site. */
export const LOCAL_PACKAGE = webPackageById("presencia");

/** Fills {min}, {max}, {price} and {care} from lib/pricing.ts. */
export function fillLocal(locale: Locale, s: string): string {
  const cur = currencyByLocale[locale];
  const values: Record<string, string> = {
    min: String(LOCAL_PACKAGE.deliveryDays.min),
    max: String(LOCAL_PACKAGE.deliveryDays.max),
    price: formatPrice(locale, LOCAL_PACKAGE.from[cur]),
    care: formatPrice(locale, webCareMonthly()[cur]),
  };
  return s.replace(/\{(min|max|price|care)\}/g, (_, k: string) => values[k]);
}

/** The page's title and description with every figure filled in. */
export function negocioLocalMeta(locale: Locale): { title: string; description: string } {
  const m = negocioLocal[locale].meta;
  return { title: m.title, description: fillLocal(locale, m.description) };
}
