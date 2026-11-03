import type { Dict } from "./rich";
import { BRAND } from "../brand";
import { branded, vinoOnly, withVariant, type FaqBlock, type Variant } from "./variant";

/**
 * Winery page copy, rewritten under docs/copy-doctrine.md (bead hq-4pu0q.6).
 *
 * This is the practice's primary industry, so the Spanish is written first and
 * is the authoritative version: usted, Valle vocabulary (cuadro, hilera, corte,
 * anada, sala de degustacion). The English is written for a US owner and is not
 * a translation of it.
 *
 * Three rules this file is held to, and the reason each one is visible here:
 *
 *  - Results, never software. Every headline and every card says what the owner
 *    ends up with. The mechanism appears once, downstream, as the answer to
 *    "how".
 *  - One number, and it is ours. Monte Xanic's finance workflow went from about
 *    an hour by hand to about two minutes (lib/i18n/monte-xanic.ts, where the
 *    basis is stated). Nothing else on this page carries a figure we measured.
 *  - Emphasis lives here, never in the page. The page component writes no <b>
 *    of its own: every span a visitor sees comes from a ** marker in this file,
 *    where scripts/copy-check.mjs counts it against the doctrine's cap of three
 *    per page. Round one moved the three day labels into literal <b> in
 *    page.tsx, which left the page shouting five spans while the checker read
 *    one. The cap is met by cutting emphasis, not by moving it out of reach:
 *    the only span this page's own copy keeps is the figure the practice owns,
 *    and the second span a visitor sees is the site-wide "Free." in site.ts.
 *    Two served, three allowed. Held by
 *    app/[locale]/industries/winery/winery-page.test.ts.
 *  - No substitutions. Every value below is a plain string literal, so
 *    scripts/copy-check.mjs reads each sentence whole. A template substitution
 *    splits its string in two and every multi-word shape stops matching across
 *    the break (doctrine, "Known limitation"), which is a way to pass the gate
 *    without passing the rule.
 *
 * Four sentences on this page are still assembled at runtime out of parts the
 * checker only ever sees separately, so they are read here by eye instead:
 *   hero.title + hero.titleAccent            (page.tsx joins them as one <h1>)
 *   vis.tagBefore + tagMid + tagAfter        (VineField's stage tag)
 *   vis.ledgerWas/Now + ledgerWas/NowText    (drawn into the canvas ledger)
 *   pricing.moreLead + pricing.moreCta       (one sentence ending in a link)
 * None of them carries a banned shape across its join.
 */

const en = {
  meta: {
    title: "Winery growth systems",
    description:
      "Harvest, lab, tanks and vintages in one view, with your block map and berry to bottle traceability.",
  },
  hero: {
    aria: "Winery introduction",
    eyebrow: "Wineries, our home ground",
    title: "You make the wine.",
    titleAccent: "The season keeps itself.",
    sub: "Stop rebuilding the harvest from memory. Read the season at a glance, and own the record.",
  },
  /** Every photograph on the page. The caption carries the result; the alt
   *  describes the frame for a reader who cannot see it. */
  media: {
    vineyard: {
      cap: "Every reading ties back to the row it came from.",
      alt: "Vineyard rows on a hillside at golden hour",
    },
    cellar: {
      cap: "The number you need at six in the morning is the one you get.",
      alt: "A laptop with the system open among the barrels of the cellar",
    },
    tasting: {
      cap: "The guest who signed up here still hears from you after the visit.",
      alt: "A pour at a tasting table set among the barrels",
    },
  },
  proof: {
    kicker: "Case study",
    title: "An hour of finance work, now about two minutes.",
    desc: "Monte Xanic runs its harvest and its finances on a system we built and the winery now owns. A financial workflow that took about an hour by hand now takes **about two minutes**.",
    ctaXanic: "Read the Monte Xanic case study",
    ctaEnkanto: "The En'kanto case",
    sealSub: "Valle de Guadalupe",
  },
  leak: {
    kicker: "The gap",
    title: "Where a winery loses money is in the seams between the cellar, the sales and the bookings.",
    items: [
      {
        num: "01",
        h: "The season lives in three places at once.",
        body: "A legacy system, spreadsheets and a cellar notebook, and none of the three agree. That is the knot we untied at Monte Xanic.",
      },
      {
        num: "02",
        h: "The visit is the last they hear from you.",
        body: "The club is won at the counter, with a glass in hand. Then nothing happens, and by the time anyone writes the visit has gone cold.",
      },
      {
        num: "03",
        h: "Four subscriptions that never talk.",
        body: "Production tools, a club platform, a reservations page and a commerce plugin each bill every month, and you reconcile them by hand.",
      },
    ],
  },
  caps: {
    kicker: "What we build",
    title: "What your winery ends up with.",
    cards: [
      {
        num: "01",
        h: "The season reads at a glance.",
        body: "Weights, samples, tank moves and cellar notes in one self-updating view.",
      },
      {
        num: "02",
        h: "Every number gets a place on the map.",
        body: "Each reading is tied to its block and row, so the whole team sees the same vineyard.",
      },
      {
        num: "03",
        h: "The pick gets planned.",
        body: "Readiness is built on your winemaker's own quality bar, and the team hears early.",
      },
      {
        num: "04",
        h: "Berry to bottle, one thread.",
        body: "Which rows, which pick, which tank, which barrel. A distributor's question is one lookup.",
      },
      {
        num: "05",
        h: "Fill the tasting room, the club and DTC.",
        body: "A bilingual site and Google Ads on a base plus a fee per contact with a monthly cap, bought on their own or with a module, and the ad budget goes straight to Google.",
      },
    ],
  },
  assist: {
    kicker: "The assistant",
    title: "Ask your cellar and it answers with your own record.",
    body: [
      "Ask what the Cabernet's total acidity did last week and you get the lab record it read, with its date and lot. Where there is no record it says so, because a plausible number is worse than none.",
      "Nothing here decides anything about your wine. The blend, the pick date and the time on skins stay yours.",
    ],
    demo: {
      aria: "A winery dashboard and an assistant. Each answer names its record, and the second reports no data.",
      boardTitle: "Cellar view",
      live: "LIVE",
      chartK: "Brix, Cabernet",
      chartV: "24.3 Bx",
      rows: [
        { k: "Berry sampling", v: "28 Aug 2026" },
        { k: "Tank intake", v: "30 Aug 2026" },
        { k: "Technical measurements", v: "1 Sep 2026" },
        { k: "Sales", v: "to 31 Aug 2026" },
      ],
      citeK: "Record",
      turns: [
        {
          q: "How is the Cabernet tracking on Brix this week?",
          a: [
            "24.3 Bx, tonnage-weighted across 6 samples.",
            "2025 was 23.8 Bx, so ripening runs 5 days ahead.",
          ],
          cite: "Berry sampling, 28 August 2026, 6 lots.",
        },
        {
          q: "How much fruit came in yesterday?",
          a: [
            "No data entered for 1 September 2026.",
            "The last intake is 30 August: 18.4 t of Chenin Blanc.",
          ],
          cite: "Tank intake, 30 August 2026.",
        },
      ],
    },
  },
  /**
   * Pricing, wired to the module model (research/2026-09/pricing-modules.md).
   * No figure lives on this page: an entry price never travels away from the
   * build that produced it (pricing-features.md 3.7 rule 3), and that build is
   * on /precios, which is the only page that prints a figure. The full terms
   * live there too; the three kept here are the ones a winery needs before it
   * decides to click, including the one that costs it money on an early exit.
   */
  pricing: {
    kicker: "What it costs",
    title: "Two fees, no license, and the winery owns the build.",
    sub: "Setup pays for the build. The monthly fee runs it: hosting, care, corrections, the report, the assistant.",
    modulesLabel: "The modules a winery buys",
    modules: [
      {
        name: "Produccion",
        scale: "The winery's own record",
        body: "Production, vintage comparison, the commercial record, the monthly report, the assistant.",
      },
      {
        name: "Hospitalidad",
        scale: "Rooms, tasting room and events",
        body: "Every booking from every channel in one calendar, and the guest kept between visits.",
      },
      {
        name: "Restaurante",
        scale: "The dining room",
        body: "From the waiter's phone to the cash cut, with the wine list live from the cellar.",
      },
    ],
    moreLead:
      "Every module has a published entry price, and the rules are written as the policy they are.",
    moreCta: "See pricing",
    termsLabel: "Terms",
    terms: [
      "The fee is paid in advance, month to month, 30 days notice either way.",
      "At signing you choose how the build is paid. Pay it in full and stop the service whenever you like, owing nothing for it. Or take the lower setup that twelve months of service fund, and leaving inside those twelve months costs the part of the build the fee had not yet paid for. That part falls every month to nothing, and your quote gives it for each month.",
    ],
  },
  vis: {
    tagBefore: "scattered records",
    tagMid: "wired into",
    tagAfter: "one view",
    aria: "Notebooks, spreadsheets and a legacy system empty into one channel that fills a bottle. The ledger turns live.",
    fallback: "Scattered records, wired into one cellar view.",
    header: "One cellar view",
    current: "CURRENT",
    live: "LIVE",
    captionFull: "all in one view",
    captionFullCompact: "one connected view",
    captionPre: "reporting",
    ledgerWas: "was:",
    ledgerNow: "now:",
    ledgerWasText: "notebooks, spreadsheets, a legacy system",
    ledgerNowText: "one view, synced ",
  },
  diagDesc:
    "Ten business days on your harvest data, ads and books, and a memo.",
  diagSpecs: [
    "Day 1. A working session on your vineyard, cellar, ads and books.",
    "Days 2 to 9. We dig: the data, the measurement, the manual routines.",
    "Day 10. You get the memo: what is true, what is broken, what to build first. It is yours.",
  ],
};

const es: typeof en = {
  meta: {
    title: "Sistemas para bodegas",
    description:
      "Vendimia, laboratorio, tanques y añadas en una sola vista, con el mapa de sus cuadros y la trazabilidad de la uva a la botella.",
  },
  hero: {
    aria: "Presentación para bodegas",
    eyebrow: "Bodegas, nuestro terreno",
    title: "El vino lo hace usted.",
    titleAccent: "El registro se lleva solo.",
    sub: "Deje de reconstruir la vendimia de memoria. Vea de un vistazo cómo va la temporada, con un registro que es suyo.",
  },
  media: {
    vineyard: {
      cap: "Cada lectura queda amarrada a la hilera de donde salió.",
      alt: "Hileras de vid en una ladera al atardecer",
    },
    cellar: {
      cap: "A las seis de la mañana tiene en pantalla justo el dato que necesita.",
      alt: "Una laptop con el sistema abierto entre las barricas de la cava",
    },
    tasting: {
      cap: "Quien se registró aquí sigue sabiendo de usted después de la visita.",
      alt: "Una copa que se sirve en una mesa de cata entre las barricas",
    },
  },
  proof: {
    kicker: "Caso de estudio",
    title: "Una hora de trabajo financiero, ahora unos dos minutos.",
    desc: "Monte Xanic lleva su vendimia y sus finanzas en un sistema que construimos y que hoy es de la vinícola. Un proceso financiero que a mano tomaba cerca de una hora ahora toma **unos dos minutos**.",
    ctaXanic: "Ver el caso de Monte Xanic",
    ctaEnkanto: "El caso de En'kanto",
    sealSub: "Valle de Guadalupe",
  },
  leak: {
    kicker: "Dónde se pierde",
    title: "Donde una bodega pierde dinero es en los cabos sueltos entre la cava, la venta y las reservaciones.",
    items: [
      {
        num: "01",
        h: "La temporada está repartida en tres lugares.",
        body: "Un sistema viejo, hojas de cálculo y una libreta de bodega, y los tres dicen cosas distintas. Ese es el nudo que desatamos en Monte Xanic.",
      },
      {
        num: "02",
        h: "Después de la visita, no vuelven a saber de usted.",
        body: "El club se gana en la barra, con la copa en la mano. Después no pasa nada, y cuando por fin alguien escribe, la visita ya se enfrió.",
      },
      {
        num: "03",
        h: "Cuatro suscripciones que no se conectan entre sí.",
        body: "La herramienta de producción, la plataforma del club, la página de reservaciones y la tienda en línea cobran cada mes. Usted las concilia a mano.",
      },
    ],
  },
  caps: {
    kicker: "Lo que construimos",
    title: "Con lo que se queda su bodega.",
    cards: [
      {
        num: "01",
        h: "La temporada se ve de un vistazo.",
        body: "Pesajes, muestreos, movimientos de tanque y notas de bodega en una vista que se actualiza sola.",
      },
      {
        num: "02",
        h: "Cada número tiene su lugar en el mapa.",
        body: "Cada lectura queda en su cuadro y su hilera, y todo el equipo ve el mismo viñedo.",
      },
      {
        num: "03",
        h: "El corte se planea.",
        body: "El aviso de madurez se basa en el criterio de calidad de su enólogo, y le llega al equipo con tiempo.",
      },
      {
        num: "04",
        h: "De la uva a la botella, sin perder el hilo.",
        body: "Qué hileras, qué corte, qué tanque, qué barrica. La pregunta de un distribuidor se responde con una consulta.",
      },
      {
        num: "05",
        h: "Llene la sala, el club y la venta directa.",
        body: "Un sitio bilingüe y anuncios en Google con una base más un pago por contacto y un tope mensual, por separado o junto con un módulo. El presupuesto de anuncios va directo a Google.",
      },
    ],
  },
  assist: {
    kicker: "El asistente",
    title: "Pregúntele a su bodega y le responde con su propio registro.",
    body: [
      "Pregunte cómo se movió la acidez total del Cabernet la semana pasada y le muestra el registro de laboratorio que consultó, con fecha y lote. Si no hay registro, lo dice, porque un número que suena creíble es peor que ninguno.",
      "El sistema no decide nada sobre su vino. La mezcla, la fecha de corte y el tiempo de maceración los sigue decidiendo usted.",
    ],
    demo: {
      aria: "Un tablero de bodega y un asistente. Cada respuesta cita su registro, y la segunda avisa que no hay dato.",
      boardTitle: "Vista de bodega",
      live: "AL DÍA",
      chartK: "Brix, Cabernet",
      chartV: "24.3 Bx",
      rows: [
        { k: "Muestreo de bayas", v: "28 ago 2026" },
        { k: "Recepción de tanque", v: "30 ago 2026" },
        { k: "Mediciones técnicas", v: "1 sep 2026" },
        { k: "Ventas", v: "al 31 ago 2026" },
      ],
      citeK: "Registro",
      turns: [
        {
          q: "¿Cómo va el Cabernet en grados Brix esta semana?",
          a: [
            "24.3 Bx, promedio ponderado por tonelaje de 6 muestras.",
            "La misma semana de 2025: 23.8 Bx. Este año va unos 5 días adelantado.",
          ],
          cite: "Muestreo de bayas, 28 de agosto de 2026, 6 lotes.",
        },
        {
          q: "¿Cuánta uva recibimos ayer?",
          a: [
            "No hay nada capturado para el 1 de septiembre de 2026.",
            "La última recepción es del 30 de agosto: 18.4 t de Chenin Blanc.",
          ],
          cite: "Recepción de tanque, 30 de agosto de 2026.",
        },
      ],
    },
  },
  pricing: {
    kicker: "Lo que cuesta",
    title: "Dos cuotas, sin licencias, y el sistema queda a nombre de la bodega.",
    sub: "La implementación paga el desarrollo. La cuota mensual cubre la operación: hosting, mantenimiento, correcciones, el reporte y el asistente.",
    modulesLabel: "Los módulos que contrata una bodega",
    modules: [
      {
        name: "Producción",
        scale: "El registro propio de la bodega",
        body: "Producción, comparación de añadas, el registro comercial, el reporte y el asistente.",
      },
      {
        name: "Hospitalidad",
        scale: "Cuartos, sala de degustación y eventos",
        body: "Las reservaciones de todos los canales en un solo calendario, y el huésped no se pierde entre visitas.",
      },
      {
        name: "Restaurante",
        scale: "El comedor",
        body: "Del teléfono del mesero al corte de caja, con la carta de vinos al día desde la cava.",
      },
    ],
    moreLead:
      "Cada módulo tiene publicado su precio de entrada, y las reglas están por escrito, como la política que son.",
    moreCta: "Ver precios",
    termsLabel: "Condiciones",
    terms: [
      "La cuota va por adelantado, mes con mes, con 30 días de aviso de cualquiera de las dos partes.",
      "Al firmar, usted elige cómo pagar el desarrollo. Si lo paga completo, puede dejar el servicio cuando quiera, sin deber nada del desarrollo. O puede elegir la implementación más baja, que se financia con doce meses de servicio: si deja el servicio antes de esos doce, debe la parte del desarrollo que la cuota todavía no había cubierto. Esa parte baja cada mes hasta cero, y su cotización la trae mes por mes.",
    ],
  },
  vis: {
    tagBefore: "registros dispersos",
    tagMid: "conectados en",
    tagAfter: "una vista",
    aria: "Libretas, hojas de cálculo y un sistema antiguo desembocan en un solo canal que llena una botella, y la bitácora queda al día.",
    fallback: "Registros dispersos, conectados en una sola vista de bodega.",
    header: "Una vista de bodega",
    current: "AL CORRIENTE",
    live: "AL DÍA",
    captionFull: "todo en una vista",
    captionFullCompact: "una sola vista",
    captionPre: "reportando",
    ledgerWas: "antes:",
    ledgerNow: "ahora:",
    ledgerWasText: "libretas, hojas de cálculo, un sistema antiguo",
    ledgerNowText: "una vista, al día ",
  },
  diagDesc:
    "Diez días hábiles con los datos de su vendimia, los anuncios y las cuentas, y al final un informe escrito.",
  diagSpecs: [
    "Día 1. Una sesión de trabajo para revisar viñedo, bodega, anuncios y cuentas.",
    "Días 2 a 9. Revisamos a fondo los datos, la medición y las tareas manuales.",
    "Día 10. Le entregamos el informe: qué funciona, qué falla y por dónde empezar. Es suyo.",
  ],
};

export type WineryDict = typeof en;

/*
 * The wine brand's winery page (bead hq-3f6ut.2): the brand named in the
 * eyebrow, and the website and Google Ads card gone, because those stay
 * Cardon's services on cardondigital.com; the diagnostic lines lose the ads
 * with it. Only the strings that differ (lib/i18n/variant.ts); the card list
 * is written out whole because a list in a variant replaces the base.
 */
const enVino: Variant<WineryDict> = {
  hero: {
    eyebrow: "{brand} for wineries",
    sub: "{brand} keeps a winery's season in one record: weights, samples, tank moves and lab results, each tied to its block and row, from the vine to the bottle. Read the harvest at a glance instead of rebuilding it from memory, and own the record. It already runs at Monte Xanic.",
  },
  meta: { title: "Winery software, block to bottle" },
  caps: {
    cards: [
      {
        num: "01",
        h: "The season reads at a glance.",
        body: "Weights, samples, tank moves and cellar notes in one self-updating view.",
      },
      {
        num: "02",
        h: "Every number gets a place on the map.",
        body: "Each reading is tied to its block and row, so the whole team sees the same vineyard.",
      },
      {
        num: "03",
        h: "The pick gets planned.",
        body: "Readiness is built on your winemaker's own quality bar, and the team hears early.",
      },
      {
        num: "04",
        h: "Berry to bottle, one thread.",
        body: "Which rows, which pick, which tank, which barrel. A distributor's question is one lookup.",
      },
    ],
  },
  diagDesc: "Ten business days on your harvest data, your cellar and your books, and a memo.",
  diagSpecs: [
    "Day 1. A working session on your vineyard, cellar and books.",
    "Days 2 to 9. We dig: the data, the measurement, the manual routines.",
    "Day 10. You get the memo: what is true, what is broken, what to build first. It is yours.",
  ],
};

const esVino: Variant<WineryDict> = {
  hero: {
    eyebrow: "{brand} para bodegas",
    sub: "{brand} lleva la temporada de una bodega en un solo registro: pesos, muestreos, movimientos de tanque y resultados de laboratorio, cada uno ligado a su cuadro y su hilera, de la uva a la botella. Vea la vendimia de un vistazo en vez de reconstruirla de memoria, con un registro que es suyo. Ya funciona en Monte Xanic.",
  },
  meta: { title: "Software para bodegas, de la uva a la botella" },
  caps: {
    cards: [
      {
        num: "01",
        h: "La temporada se ve de un vistazo.",
        body: "Pesajes, muestreos, movimientos de tanque y notas de bodega en una vista que se actualiza sola.",
      },
      {
        num: "02",
        h: "Cada número tiene su lugar en el mapa.",
        body: "Cada lectura queda en su cuadro y su hilera, y todo el equipo ve el mismo viñedo.",
      },
      {
        num: "03",
        h: "El corte se planea.",
        body: "El aviso de madurez se basa en el criterio de calidad de su enólogo, y le llega al equipo con tiempo.",
      },
      {
        num: "04",
        h: "De la uva a la botella, sin perder el hilo.",
        body: "Qué hileras, qué corte, qué tanque, qué barrica. La pregunta de un distribuidor se responde con una consulta.",
      },
    ],
  },
  diagDesc: "Diez días hábiles con los datos de su vendimia, su bodega y sus cuentas, y al final un informe escrito.",
  diagSpecs: [
    "Día 1. Una sesión de trabajo para revisar viñedo, bodega y cuentas.",
    "Días 2 a 9. Revisamos a fondo los datos, la medición y las tareas manuales.",
    "Día 10. Le entregamos el informe: qué funciona, qué falla y por dónde empezar. Es suyo.",
  ],
};

export const winery: Dict<WineryDict> =
  BRAND.id === "vino"
    ? branded({ en: withVariant(en, enVino), es: withVariant(es, esVino) })
    : { en, es };

/* The page's questions, on the wine brand only (bead hq-3f6ut.2): the AEO
   checklist asks every moved page for an FAQ, and cardondigital.com keeps the
   page as it was. Every answer restates a fact this page already carries. */
const enFaq: FaqBlock = {
  title: "Questions a winery asks about {brand}",
  items: [
    {
      question: "What does {brand} do for a winery?",
      answer:
        "It keeps the season in one record: weights, samples, tank moves, lab results and cellar notes, each tied to its block and row, with one thread from the berry to the bottle and an assistant that answers from that record.",
    },
    {
      question: "How does it help plan the pick?",
      answer:
        "Readiness is scored against your winemaker's own quality bar, so the team sees a block coming due and hears early.",
    },
    {
      question: "What does it cost?",
      answer:
        "Two fees and no license. The setup pays for the build, and the monthly fee runs it: hosting, care, corrections, the report and the assistant. Every module's entry price is on the pricing page.",
    },
    {
      question: "Can I stop the service?",
      answer:
        "The fee is paid in advance, month to month, with 30 days notice either way. If you paid the build in full, you stop whenever you like and owe nothing for it.",
    },
    {
      question: "Who owns the record?",
      answer: "The winery does. The build is yours, and the code, the data and the accounts are in your name.",
    },
  ],
};

const esFaq: FaqBlock = {
  title: "Lo que una bodega pregunta sobre {brand}",
  items: [
    {
      question: "¿Qué hace {brand} por una bodega?",
      answer:
        "Lleva la temporada en un solo registro: pesos, muestreos, movimientos de tanque, resultados de laboratorio y notas de bodega, cada uno ligado a su cuadro y su hilera, con un solo hilo de la uva a la botella y un asistente que contesta a partir de ese registro.",
    },
    {
      question: "¿Cómo ayuda a planear el corte?",
      answer:
        "La madurez se califica con el criterio de calidad de su propio enólogo, así que el equipo ve venir un cuadro y se entera a tiempo.",
    },
    {
      question: "¿Cuánto cuesta?",
      answer:
        "Dos cuotas y ninguna licencia. La instalación paga la construcción y la mensualidad la mantiene: hospedaje, cuidado, correcciones, el reporte y el asistente. El precio de entrada de cada módulo está en la página de precios.",
    },
    {
      question: "¿Puedo dejar el servicio?",
      answer:
        "La mensualidad se paga por adelantado, mes a mes, con 30 días de aviso de cualquiera de las dos partes. Si pagó la construcción completa, deja el servicio cuando quiera sin deber nada por ella.",
    },
    {
      question: "¿De quién es el registro?",
      answer: "De la bodega. La construcción es suya, y el código, los datos y las cuentas están a su nombre.",
    },
  ],
};

export const wineryFaq = vinoOnly({ en: enFaq, es: esFaq });
