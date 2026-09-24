import type { Dict } from "./rich";

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
    eyebrow: "Industries / Winery",
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
      alt: "Work in the cellar, the system within reach",
    },
    tasting: {
      cap: "The guest who signed up here still hears from you after the visit.",
      alt: "A tasting room in use, a pour in progress",
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
    title: "Wineries rarely lose on the wine. They lose in the seams.",
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
        body: "Each reading sits on its block and row, so the team reads the vineyard alike.",
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
        body: "Bilingual ads attach to Hospitalidad and Restaurante, from the middle size up, inside the monthly fee, and the budget goes straight to Google.",
      },
    ],
  },
  assist: {
    kicker: "The assistant",
    title: "Ask your cellar. Get your own record back.",
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
      "All prices plus IVA.",
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
    "Day 10. The memo lands: what is true, what is broken, what to build first. It is yours.",
  ],
};

const es: typeof en = {
  meta: {
    title: "Sistemas para bodegas",
    description:
      "Cosecha, laboratorio, tanques y añadas en una sola vista, con el mapa de sus cuadros y la trazabilidad de la baya a la botella.",
  },
  hero: {
    aria: "Presentación para bodegas",
    eyebrow: "Sectores / Bodegas",
    title: "El vino lo hace usted.",
    titleAccent: "La temporada se lleva sola.",
    sub: "Deje de reconstruir la cosecha de memoria. Lea la temporada de un vistazo, y quédese con el registro.",
  },
  media: {
    vineyard: {
      cap: "Cada lectura queda amarrada a la hilera de donde salió.",
      alt: "Hileras de vid en una ladera al atardecer",
    },
    cellar: {
      cap: "El dato que necesita a las seis de la mañana es el que recibe.",
      alt: "Trabajo en la bodega, con el sistema a la mano",
    },
    tasting: {
      cap: "El huésped que se dio de alta aquí sigue sabiendo de usted después de la visita.",
      alt: "Una sala de degustación en uso, con una copa servida",
    },
  },
  proof: {
    kicker: "Caso de estudio",
    title: "Una hora de trabajo financiero, ahora como dos minutos.",
    desc: "Monte Xanic opera su cosecha y sus finanzas sobre un sistema que construimos y que hoy es suyo. Un flujo financiero que tomaba como una hora a mano ahora toma **como dos minutos**.",
    ctaXanic: "Lea el caso de Monte Xanic",
    ctaEnkanto: "El caso de En'kanto",
    sealSub: "Valle de Guadalupe",
  },
  leak: {
    kicker: "La fuga",
    title: "Una bodega rara vez pierde en el vino. Pierde en las costuras.",
    items: [
      {
        num: "01",
        h: "La temporada vive en tres lugares a la vez.",
        body: "Un sistema viejo, hojas de cálculo y una libreta de bodega, y los tres dicen cosas distintas. Ese es el nudo que desatamos en Monte Xanic.",
      },
      {
        num: "02",
        h: "La visita es lo último que sabe de usted.",
        body: "El club se gana en el mostrador, con la copa en la mano. Después no pasa nada, y para cuando alguien escribe la visita ya se enfrió.",
      },
      {
        num: "03",
        h: "Cuatro suscripciones que nunca se hablan.",
        body: "La herramienta de producción, la plataforma del club, la página de reservas y la tienda cobran cada mes. Usted las concilia a mano.",
      },
    ],
  },
  caps: {
    kicker: "Lo que construimos",
    title: "Con lo que se queda su bodega.",
    cards: [
      {
        num: "01",
        h: "La temporada se lee de un vistazo.",
        body: "Pesos, muestras, movimientos de tanque y notas en una vista que se actualiza sola.",
      },
      {
        num: "02",
        h: "Cada número tiene su lugar en el mapa.",
        body: "Cada lectura queda en su cuadro y su hilera, así todo el equipo lee el viñedo igual.",
      },
      {
        num: "03",
        h: "El corte se planea.",
        body: "El aviso de madurez se construye con la vara de calidad de su enólogo, y llega al equipo con tiempo.",
      },
      {
        num: "04",
        h: "De la baya a la botella, un solo hilo.",
        body: "Qué hileras, qué corte, qué tanque, qué barrica. La pregunta del distribuidor es una consulta.",
      },
      {
        num: "05",
        h: "Llene la sala, el club y la venta directa.",
        body: "Los anuncios en los dos idiomas se agregan a Hospitalidad y a Restaurante, desde el tamaño mediano, dentro de la cuota mensual, y la inversión va directo a Google.",
      },
    ],
  },
  assist: {
    kicker: "El asistente",
    title: "Pregúntele a su bodega. La respuesta es su propio registro.",
    body: [
      "Pregunte qué hizo la acidez total del Cabernet la semana pasada y recibe el registro de laboratorio que leyó, con fecha y lote. Donde no hay registro lo dice, porque un número verosímil es peor que ninguno.",
      "Aquí nada decide sobre su vino. La mezcla, la fecha de corte y el tiempo en pieles siguen siendo suyos.",
    ],
    demo: {
      aria: "Un tablero de bodega y un asistente. Cada respuesta nombra su registro, y la segunda reporta que no hay dato.",
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
            "24.3 Bx, ponderado por tonelaje de 6 muestras.",
            "La misma semana de 2025: 23.8 Bx, unos 5 días atrás.",
          ],
          cite: "Muestreo de bayas, 28 de agosto de 2026, 6 lotes.",
        },
        {
          q: "¿Cuánta uva recibimos ayer?",
          a: [
            "No hay nada capturado para el 1 de septiembre de 2026.",
            "La última es del 30 de agosto: 18.4 t de Chenin Blanc.",
          ],
          cite: "Recepción de tanque, 30 de agosto de 2026.",
        },
      ],
    },
  },
  pricing: {
    kicker: "Lo que cuesta",
    title: "Dos cuotas, sin licencia, y la construcción queda de la bodega.",
    sub: "La implementación paga la construcción. La cuota mensual paga operarla: hospedaje, cuidado, correcciones, el informe, el asistente.",
    modulesLabel: "Los módulos que compra una bodega",
    modules: [
      {
        name: "Producción",
        scale: "El registro propio de la bodega",
        body: "Producción, comparación de añadas, el registro comercial, el informe y el asistente.",
      },
      {
        name: "Hospitalidad",
        scale: "Cuartos, sala de degustación y eventos",
        body: "Cada reserva de cada canal en un calendario, y el huésped conservado entre visitas.",
      },
      {
        name: "Restaurante",
        scale: "El comedor",
        body: "Del teléfono del mesero al corte de caja, con la carta viva desde la cava.",
      },
    ],
    moreLead:
      "Cada módulo tiene su precio de entrada publicado, y las reglas están escritas como la política que son.",
    moreCta: "Ver precios",
    termsLabel: "Condiciones",
    terms: [
      "La cuota va por adelantado, mes con mes, con 30 días de aviso de cualquiera de las dos partes.",
      "Al firmar usted elige cómo se paga la construcción. Páguela completa y deje el servicio cuando quiera, sin deber nada por ella. O tome la implementación más baja, la que financian doce meses de servicio: si deja el servicio antes de esos doce, debe la parte de la construcción que la cuota todavía no había pagado. Esa parte baja cada mes hasta cero, y su cotización la trae mes por mes.",
      "Todos los precios más IVA.",
    ],
  },
  vis: {
    tagBefore: "registros dispersos",
    tagMid: "conectados en",
    tagAfter: "una vista",
    aria: "Libretas, hojas de cálculo y un sistema antiguo se vacían en un canal que llena una botella, y la bitácora queda al día.",
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
    "Diez días hábiles sobre los datos de su cosecha, sus anuncios y sus cuentas, y un informe escrito.",
  diagSpecs: [
    "Día 1. Una sesión de trabajo sobre su viñedo, su bodega, sus anuncios y sus cuentas.",
    "Días 2 a 9. Escarbamos: los datos, la medición, las tareas manuales.",
    "Día 10. Llega el informe: qué es cierto, qué está roto y qué construir primero. Es suyo.",
  ],
};

export type WineryDict = typeof en;
export const winery: Dict<WineryDict> = { en, es };
