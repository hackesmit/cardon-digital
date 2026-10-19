import type { Dict } from "./rich";

/**
 * Words for the package builder (components/contact/PackageBuilder.tsx). The
 * package, scope, module and feature NAMES are not here: they come from the
 * sitios, anuncios and precios dictionaries, so a name has one home. Every
 * figure comes from lib/pricing.ts through lib/builder.ts.
 *
 * Placeholders: {rate}, {perContact}, {cap}, {minLocal}, {minCrecimiento}, {n}.
 */

const en = {
  kicker: "Build your package",
  title: "Pick what you need and see what it costs.",
  sub: "Optional. Tick what interests you and the estimate adds up as you go; it travels with your message.",
  open: "Build your package",
  groups: {
    web: { title: "Website", hint: "Pick one package, or none." },
    ads: { title: "Google Ads", hint: "Pick one scope, or none." },
    software: { title: "Software", hint: "Pick any modules. Two or more cost less together." },
  },
  none: "None",
  from: "from",
  once: "once",
  perMonth: "a month",
  includes: "What it includes",
  pages: "{n} pages",
  page: "1 page",
  care: "Monthly website care",
  careBody: "Hosting, domain, updates and two changes a month. Optional, cancel anytime.",
  adsBase: "Monthly base",
  adsPerContact: "plus {perContact} per qualified contact, never more than {cap} a month",
  adsBudgetLocal: "Your ad budget, at least {minLocal} a month, is paid straight to Google, not to us.",
  adsBudgetCrecimiento: "On Growth, your ad budget, at least {minCrecimiento} a month, is paid straight to Google, not to us.",
  mixDiscount: "{rate}% off for combining",
  summary: {
    title: "Your estimate",
    empty: "Nothing picked yet.",
    setup: "Paid once",
    monthly: "Each month",
    yearOne: "First year",
    perContact: "These totals leave out the ads fee per contact, charged the month after, and your ad budget, which you pay straight to Google.",
    note: "Entry prices. The final price is set in the written proposal after the free diagnostic.",
  },
  send: "Send this package",
  sendHint: "Opens the contact form with your package attached.",
  attached: "Package attached to your message",
  clear: "Clear",
  remove: "Remove",
};

const es: typeof en = {
  kicker: "Arme su paquete",
  title: "Elija lo que necesita y vea cuánto cuesta.",
  sub: "Opcional. Marque lo que le interesa y el estimado se suma al momento; se envía junto con su mensaje.",
  open: "Arme su paquete",
  groups: {
    web: { title: "Sitio web", hint: "Elija un paquete, o ninguno." },
    ads: { title: "Anuncios en Google", hint: "Elija un alcance, o ninguno." },
    software: { title: "Software", hint: "Elija los módulos que quiera. Dos o más juntos cuestan menos." },
  },
  none: "Ninguno",
  from: "desde",
  once: "una vez",
  perMonth: "al mes",
  includes: "Qué incluye",
  pages: "{n} páginas",
  page: "1 página",
  care: "Mantenimiento mensual del sitio",
  careBody: "Hosting, dominio, actualizaciones y dos cambios al mes. Opcional, lo cancela cuando quiera.",
  adsBase: "Base mensual",
  adsPerContact: "más {perContact} por contacto calificado, nunca más de {cap} al mes",
  adsBudgetLocal: "Su presupuesto de anuncios, mínimo {minLocal} al mes, se paga directo a Google, no a nosotros.",
  adsBudgetCrecimiento: "En Crecimiento, su presupuesto de anuncios, mínimo {minCrecimiento} al mes, se paga directo a Google, no a nosotros.",
  mixDiscount: "{rate}% menos por combinar",
  summary: {
    title: "Su estimado",
    empty: "Todavía no ha elegido nada.",
    setup: "Pago único",
    monthly: "Cada mes",
    yearOne: "Primer año",
    perContact: "Estos totales no incluyen el pago por contacto de los anuncios, que se cobra al mes siguiente, ni su presupuesto de anuncios, que usted paga directo a Google.",
    note: "Precios de entrada. El precio final queda en la propuesta escrita después del diagnóstico gratuito.",
  },
  send: "Enviar este paquete",
  sendHint: "Abre el formulario de contacto con su paquete adjunto.",
  attached: "Paquete adjunto a su mensaje",
  clear: "Borrar",
  remove: "Quitar",
};

export type BuilderDict = typeof en;
export const builder: Dict<BuilderDict> = { en, es };
