import type { Dict } from "./rich";

/**
 * Google Ads service page copy (/anuncios). Spanish authoritative, English
 * written for a US owner.
 *
 * Policy this page states, from BUSINESS-PLAN.md 5.5 and Daniel's direction of
 * 2026-09-28: ad management is a standalone service at a flat monthly fee,
 * never a percentage of spend at any spend; the ad budget is paid by the
 * client direct to Google in the client's own account; a minimum eligible
 * budget applies. Every figure is read out of lib/pricing.ts (adsManagement);
 * where a sentence needs one, it carries a placeholder the page fills:
 * {local}, {crecimiento} (the monthly fees), {minLocal}, {minCrecimiento}
 * (the minimum budgets), {setupLocal}, {setupCrecimiento} (the campaign build).
 * The visual strings live under `vis` (docs/copy-doctrine.md section 8).
 */

const en = {
  meta: {
    title: "Google Ads",
    description:
      "New clients who were already searching for what you sell, measured down to the call or the message. A flat monthly fee, and your budget goes straight to Google.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Google Ads",
    title: "New clients who were already searching for you,",
    titleAccent: "measured down to the message.",
    sub: "Campaigns on Google that put your business in front of the people searching for what you sell, in your area. A flat monthly fee, and your budget is paid straight to Google, in your own account.",
    proof: "Flat fee from {local} a month. Minimum budget {minLocal} a month, paid straight to Google.",
  },
  path: {
    kicker: "How a client arrives",
    title: "From the search to the message, every step counted.",
    steps: [
      "Someone near you searches for what you sell.",
      "Your ad comes up and takes them to a page that says what the ad said.",
      "They call you, or write on WhatsApp.",
      "The call or the message is counted, with the ad that brought it.",
    ],
  },
  month: {
    kicker: "What we do every month",
    title: "What the fee pays for.",
    items: [
      {
        h: "The words they search with, and the ones they do not.",
        body: "Every week we read what the people who clicked actually searched for, and block what could not have been a client.",
      },
      {
        h: "Ads that say what you sell.",
        body: "Written for your business, tested against each other, refreshed when they tire.",
      },
      {
        h: "A page that convinces.",
        body: "The page the click lands on repeats the ad's promise and has one button.",
      },
      {
        h: "A report you can read.",
        body: "One page a month: what was spent, how many calls and messages arrived, and what each one cost. And a twenty-minute call.",
      },
    ],
  },
  pricing: {
    kicker: "What it costs",
    title: "A flat fee. Your budget goes straight to Google.",
    sub: "Two scopes, by how many campaigns you need. The flat fee stays the same whatever you spend.",
    names: { local: "Local", crecimiento: "Growth" } as Record<string, string>,
    scopes: {
      local: "One search campaign, one area, up to three ad groups.",
      crecimiento: "Up to three campaigns and ten ad groups, or a second area.",
    } as Record<string, string>,
    monthlyLabel: "Flat monthly fee",
    setupLabel: "Campaign build, once",
    minLabel: "Minimum monthly budget, straight to Google",
    scopeLabel: "Scope",
    rules: [
      "We never charge a percentage of what you spend. The fee is flat.",
      "The Google Ads account is yours, and the budget is paid by you straight to Google.",
      "Month to month, with 30 days notice. No lock-in.",
      "Quoted and invoiced in Mexican pesos plus IVA; the dollar figures are rounded conversions.",
    ],
  },
  familiar: {
    kicker: "Objections",
    title: "Sound familiar?",
    items: [
      {
        q: "I tried ads once and threw the money away.",
        a: "Nearly always the wrong words and a page that did not convince. So the words get reviewed every week and the page is built for the ad.",
      },
      {
        q: "How much budget do I start with?",
        a: "{minLocal} a month, straight to Google. With less, the flat fee weighs more than the spend and it stops being worth it for you.",
      },
      {
        q: "What about Facebook or Instagram?",
        a: "We start on Google, where people are already searching. Social media on its own is work we do not take.",
      },
    ],
  },
  diagDesc:
    "Ten business days on your ads, your site and your operation, and a written memo that is yours: what is true, what is broken, what to build first.",
  vis: {
    reach: {
      tagBefore: "people searching",
      tagMid: "clients, measured",
      captionRun: "searching",
      captionDone: "measured to the message",
      aria: "A local map with the business at the centre. Searches appear at the edges; the ones that match travel to the business and are counted as calls and messages, the ones that do not are struck out. The budget runs straight to Google.",
      fallback: "The searches that match reach you and get counted. The ones that do not are kept out. Your budget goes straight to Google.",
      center: "Your business",
      queries: [
        { t: "lodging valle de guadalupe", match: true },
        { t: "cabins with a vineyard", match: true },
        { t: "wine tour ensenada", match: true },
        { t: "cheap bulk wine", match: false },
        { t: "vineyard jobs", match: false },
        { t: "book dinner in the valle", match: true },
      ],
      negK: "negative",
      callsK: "CALLS",
      msgsK: "MESSAGES",
      budgetK: "your budget",
      google: "Google",
      measuredK: "MEASURED",
    },
  },
};

const es: typeof en = {
  meta: {
    title: "Anuncios en Google",
    description:
      "Clientes nuevos que ya estaban buscando lo que usted vende, con cada llamada y cada mensaje contados. Cuota fija al mes, y su presupuesto va directo a Google.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Anuncios en Google",
    title: "Clientes nuevos que ya lo estaban buscando,",
    titleAccent: "y cada mensaje se cuenta.",
    sub: "Campañas en Google que muestran su negocio a la gente de su zona que busca lo que usted vende. Cuota fija al mes, y el presupuesto lo paga usted directo a Google, desde su propia cuenta.",
    proof: "Cuota fija desde {local} al mes. Presupuesto mínimo de {minLocal} al mes, directo a Google.",
  },
  path: {
    kicker: "Cómo llega un cliente",
    title: "De la búsqueda al mensaje, contando cada paso.",
    steps: [
      "Alguien cerca de su negocio busca lo que usted vende.",
      "Su anuncio aparece y lo lleva a una página que dice lo mismo que el anuncio.",
      "Le llama o le escribe por WhatsApp.",
      "La llamada o el mensaje queda registrado, junto con el anuncio que lo trajo.",
    ],
  },
  month: {
    kicker: "Lo que hacemos cada mes",
    title: "Lo que incluye la cuota.",
    items: [
      {
        h: "Las palabras con las que lo buscan, y las que no.",
        body: "Cada semana revisamos qué buscó en realidad la gente que hizo clic, y bloqueamos las búsquedas que nunca iban a traer un cliente.",
      },
      {
        h: "Anuncios que dicen lo que usted vende.",
        body: "Escritos para su negocio, probados unos contra otros y renovados cuando dejan de rendir.",
      },
      {
        h: "Una página que convence.",
        body: "La página a la que llega quien hace clic repite lo que prometió el anuncio y tiene un solo botón.",
      },
      {
        h: "Un reporte que se entiende.",
        body: "Una página al mes: cuánto se invirtió, cuántas llamadas y mensajes llegaron y cuánto costó cada uno. Además, una llamada de veinte minutos.",
      },
    ],
  },
  pricing: {
    kicker: "Lo que cuesta",
    title: "Cuota fija. Su presupuesto va directo a Google.",
    sub: "Dos planes, según cuántas campañas necesite. La cuota fija es la misma, invierta lo que invierta.",
    names: { local: "Local", crecimiento: "Crecimiento" } as Record<string, string>,
    scopes: {
      local: "Una campaña de búsqueda, una zona, hasta tres grupos de anuncios.",
      crecimiento: "Hasta tres campañas y diez grupos de anuncios, o una segunda zona.",
    } as Record<string, string>,
    monthlyLabel: "Cuota mensual fija",
    setupLabel: "Construcción de la campaña, pago único",
    minLabel: "Presupuesto mínimo al mes, directo a Google",
    scopeLabel: "Alcance",
    rules: [
      "Nunca cobramos un porcentaje de lo que invierte. La cuota es fija.",
      "La cuenta de Google Ads es suya, y el presupuesto lo paga usted directo a Google.",
      "Mes con mes, con 30 días de aviso para cancelar. Sin plazo forzoso.",
      "Precios más IVA, con factura.",
    ],
  },
  familiar: {
    kicker: "Objeciones",
    title: "¿Le suena?",
    items: [
      {
        q: "Ya probé anuncios y tiré el dinero.",
        a: "Casi siempre fueron palabras mal elegidas y una página que no convencía. Por eso revisamos las palabras cada semana y hacemos la página a la medida del anuncio.",
      },
      {
        q: "¿Con cuánto presupuesto empiezo?",
        a: "Con {minLocal} al mes, directo a Google. Con menos, la cuota fija pesa más que la inversión y deja de convenirle.",
      },
      {
        q: "¿Y Facebook o Instagram?",
        a: "Empezamos por Google, donde la gente ya está buscando. Las redes sociales por sí solas son un trabajo que no tomamos.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles para revisar los anuncios, el sitio y la operación de su negocio, y un informe por escrito que es suyo: qué funciona, qué falla y por dónde empezar.",
  vis: {
    reach: {
      tagBefore: "gente buscando",
      tagMid: "clientes medidos",
      captionRun: "buscando",
      captionDone: "cada mensaje, contado",
      aria: "Un mapa de la zona con el negocio al centro. Las búsquedas aparecen en las orillas; las que coinciden llegan hasta el negocio y se cuentan como llamadas y mensajes, y las que no coinciden se tachan. El presupuesto va directo a Google.",
      fallback: "Las búsquedas que coinciden llegan a usted y se cuentan. Las que no, se quedan fuera. Su presupuesto va directo a Google.",
      center: "Su negocio",
      queries: [
        { t: "hospedaje valle de guadalupe", match: true },
        { t: "cabañas con viñedo", match: true },
        { t: "tour de vino ensenada", match: true },
        { t: "vino barato mayoreo", match: false },
        { t: "trabajo en viñedo", match: false },
        { t: "reservar cena en el valle", match: true },
      ],
      negK: "negativa",
      callsK: "LLAMADAS",
      msgsK: "MENSAJES",
      budgetK: "su presupuesto",
      google: "Google",
      measuredK: "MEDIDO",
    },
  },
};

export type AnunciosDict = typeof en;
export const anuncios: Dict<AnunciosDict> = { en, es };
