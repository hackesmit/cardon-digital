import type { Dict } from "./rich";

/**
 * The one feedback page (bead hq-wrig5.15). While this round runs, the home
 * route with SHOWCASE=1 carries everything a reader would otherwise click
 * around for: the pitch and the demo buttons, the six things that are wrong
 * today, the three modules and the seven combinations, the whole pricing page,
 * and the way to reach us. The official home stays in the repo and comes back
 * when the flag is unset, so this dictionary is written to be deletable in one
 * commit.
 *
 * Only the copy that belongs to THIS page lives here. The module descriptions
 * come from lib/i18n/modulos.ts and the pricing copy from lib/i18n/precios.ts,
 * rendered through the same components those pages use, because a second copy
 * of a module description is a second thing to keep true.
 *
 * No figure lives in this file and none may ever be typed into it. A public
 * entry price never travels away from the feature list that produced it
 * (pricing-features.md 3.7 rule 3, restated in pricing-modules.md 8.1), and
 * the figures this page shows are read out of lib/pricing.ts by the pricing
 * components, never written down here.
 *
 * The competitor sentence in the problem list carries only what was checked on
 * each vendor's own site on 2026-09-09; the source table is on the bead. The
 * language claim of the original brief is not here on purpose, because the
 * category leader ships a Spanish interface, and the region-lock claim is
 * narrowed to the plan restriction Commerce7 actually publishes.
 */

/**
 * One demo button: which module it switches on, the short label the row shows,
 * and the full label a screen reader gets. Nothing describes the module here.
 * The descriptions are on the same page, rendered from lib/i18n/modulos.ts.
 */
export type ShowcaseModule = { id: string; name: string; demo: string };

/** One of the six things that are wrong before we build anything. */
export type ProblemItem = { h: string; body: string };

const en = {
  meta: {
    title:
      "Cardon Digital | The three modules: Produccion, Hospitalidad and Restaurante",
    description:
      "A growth-systems practice for wineries in Valle de Guadalupe and Ensenada. The system a winery runs on, in three modules with a demo each, the published entry price of every module, and the Growth Diagnostic that sets the quote.",
  },

  /* The pitch, as given. Sentence one is the headline, the rest is the lead. */
  hero: {
    aria: "Introduction",
    eyebrow: "Cardon Digital",
    t1: "A growth-systems practice ",
    accent: "for wineries in Valle de Guadalupe and Ensenada.",
    sub: "We build the system a winery runs on (harvest, lots, tanks, lab results, vintage comparison, weather data, sales and bookings) and keep it running, with an assistant that answers questions from the winery's own records. Around that system we run the marketing that fills the tasting room, the club and direct sales. **One senior team, flat fees, and the client owns what we build.**",
  },

  demos: {
    label: "Open a demo",
    all: "All of it together",
    allAria: "Open the demo with all three modules switched on",
    soon: "coming",
    note: "Each demo runs on a made-up brand, with no signup and no password. **Each button opens the live demo in a new tab, with that module switched on.**",
    modules: [
      {
        id: "produccion",
        name: "Produccion",
        demo: "Open the Produccion demo",
      },
      {
        id: "hospitalidad",
        name: "Hospitalidad",
        demo: "Open the Hospitalidad demo",
      },
      {
        id: "restaurante",
        name: "Restaurante",
        demo: "Open the Restaurante demo",
      },
    ] as ShowcaseModule[],
  },

  /* The six points, as given. Point six carries only the competitor claims
     that were checked on the vendor's own site; see the file header. */
  problem: {
    kicker: "Where it stands today",
    title: "Six things that are true in almost every winery we walk into.",
    sub: "None of them is about working harder. They are all about a record that was never kept in one place.",
    items: [
      {
        h: "The record is spread across four places.",
        body: "Field notebooks, tank cards, lab sheets and a spreadsheet somebody keeps. Gathering them takes longer than the decision they were meant to inform.",
      },
      {
        h: "Past vintages are out of reach.",
        body: "Three harvests ago is a box of paper. The Cabernet's total acidity in the two weeks before pick, 2023 against this year, takes an afternoon or never gets answered.",
      },
      {
        h: "What worked cannot be repeated.",
        body: "Without a comparable record there is no way to rebuild what was actually done, so each vintage starts again from memory.",
      },
      {
        h: "Sales and hospitality run on tools that never talk.",
        body: "Bookings, the club, the shop and distributors: four subscriptions, no single view, and follow-up that arrives late or not at all.",
      },
      {
        h: "The reporting lands too late to act on.",
        body: "Hours of manual work over the numbers, and by the time the report exists the month it describes is already closed.",
      },
      {
        h: "The software market is not built for you.",
        body: "The specialist winery systems all come from somewhere else. vintrace and InnoVint publish no price at all: you ask a salesperson for it. Commerce7 publishes its own in seven currencies and none of them is the peso, and its entry plan is capped to direct sales in the United States and Canada. None of them issues a CFDI, and an expense without a CFDI is not deductible. On the Mexican side, CONTPAQi and Aspel invoice correctly and their catalogues carry no winery product at all: they do not know what a lot, a tank or a vintage is.",
      },
    ] as ProblemItem[],
  },

  modules: {
    kicker: "What we build",
    title: "Three modules. You buy the ones you run on.",
  },

  /**
   * The labels on the vintage-comparison chart (bead hq-wrig5.13). The pitch
   * names the comparison and the problem list says it takes an afternoon or
   * never gets answered, so the section carries the picture of the answer.
   * The seasons are years and need no translation, so only the axes, the
   * title and the honest admission live here.
   */
  chart: {
    title: "One measure, three seasons.",
    aria: "Total acidity by days from veraison, this season beside the two before it",
    y: "Total acidity g/L",
    x: "Days from veraison",
    honest: "illustrative view",
  },

  pricing: {
    kicker: "What it costs",
    title: "Every module has a published entry price.",
  },

  close: {
    kicker: "Talk to us",
    desc: "Which modules, at which size, and what gets built first is what the Diagnostic answers before anybody quotes anything. **Ten working days going through your data, your bookings, your floor and your numbers as one system.**",
    specs: [
      "**Day 1.** A working session over the operation you actually run, module by module.",
      "**Days 2 to 9.** We dig: the sources, the channels, the floor, the measurement and the numbers behind the numbers.",
      "**Day 10.** The memo lands: what is true, what is broken, and which module earns its place first.",
      "**Free and unattached.** Use it with us or without us. If we build, the price is agreed at the start and you own the result.",
    ],
    ctaContact: "Other ways to reach us",
  },
};

const es: typeof en = {
  meta: {
    title:
      "Cardon Digital | Los tres módulos: Producción, Hospitalidad y Restaurante",
    description:
      "Una práctica de sistemas de crecimiento para bodegas del Valle de Guadalupe y Ensenada. El sistema con el que trabaja una bodega, en tres módulos con un demo cada uno, el precio de entrada publicado de cada módulo, y el Diagnóstico que fija la cotización.",
  },

  hero: {
    aria: "Presentación",
    eyebrow: "Cardon Digital",
    t1: "Una práctica de sistemas de crecimiento ",
    accent: "para bodegas del Valle de Guadalupe y Ensenada.",
    sub: "Construimos el sistema con el que trabaja una bodega (cosecha, lotes, tanques, resultados de laboratorio, comparación de añadas, datos de clima, ventas y reservas) y lo mantenemos funcionando, con un asistente que responde preguntas desde el registro de la propia bodega. Alrededor de ese sistema operamos el marketing que llena la sala de degustación, el club y la venta directa. **Un solo equipo senior, cuotas fijas, y el cliente se queda con lo que construimos.**",
  },

  demos: {
    label: "Abrir un demo",
    all: "Todo junto",
    allAria: "Abrir el demo con los tres módulos encendidos",
    soon: "pronto",
    note: "Cada demo corre sobre una marca ficticia, sin registro y sin contraseña. **Cada botón abre el demo en vivo en una pestaña nueva, con ese módulo encendido.**",
    modules: [
      {
        id: "produccion",
        name: "Producción",
        demo: "Abrir el demo de Producción",
      },
      {
        id: "hospitalidad",
        name: "Hospitalidad",
        demo: "Abrir el demo de Hospitalidad",
      },
      {
        id: "restaurante",
        name: "Restaurante",
        demo: "Abrir el demo de Restaurante",
      },
    ] as ShowcaseModule[],
  },

  problem: {
    kicker: "Dónde está hoy",
    title: "Seis cosas que son ciertas en casi toda bodega a la que entramos.",
    sub: "Ninguna se arregla trabajando más. Todas vienen del mismo lugar: un registro que nunca se guardó junto.",
    items: [
      {
        h: "El registro está repartido en cuatro lugares.",
        body: "Libretas de campo, tarjetas de tanque, hojas de laboratorio y una hoja de cálculo que alguien mantiene. Juntarlos toma más tiempo que la decisión que iban a sostener.",
      },
      {
        h: "Las añadas pasadas no se alcanzan.",
        body: "Hace tres cosechas es una caja de papel. La acidez total del Cabernet en las dos semanas antes de la pizca, 2023 contra este año, toma una tarde o nunca se responde.",
      },
      {
        h: "Lo que salió bien no se puede repetir.",
        body: "Sin un registro comparable no hay forma de reconstruir qué se hizo de verdad, así que cada añada vuelve a empezar desde la memoria.",
      },
      {
        h: "La venta y la hospitalidad corren en herramientas que no se hablan.",
        body: "Reservas, club, tienda y distribuidores: cuatro suscripciones, ninguna vista única, y un seguimiento que llega tarde o no llega.",
      },
      {
        h: "El informe llega tarde para poder actuar.",
        body: "Horas de trabajo manual sobre los números, y para cuando el informe existe el mes que describe ya cerró.",
      },
      {
        h: "El software del sector no está hecho para usted.",
        body: "Los sistemas especializados de bodega vienen todos de fuera. vintrace e InnoVint no publican precio: hay que pedirlo a un vendedor. Commerce7 publica el suyo en siete monedas y ninguna es el peso, y su plan de entrada está limitado a la venta directa en Estados Unidos y Canadá. Ninguno emite un CFDI, y un gasto sin CFDI no es deducible. Del lado mexicano, CONTPAQi y Aspel facturan bien y en su catálogo no hay un solo producto para bodega: no saben qué es un lote, un tanque ni una añada.",
      },
    ] as ProblemItem[],
  },

  modules: {
    kicker: "Qué construimos",
    title: "Tres módulos. Se compran los que se operan.",
  },

  chart: {
    title: "Una medida, tres temporadas.",
    aria: "Acidez total por días desde envero, esta temporada junto a las dos anteriores",
    y: "Acidez total g/L",
    x: "Días desde envero",
    honest: "vista ilustrativa",
  },

  pricing: {
    kicker: "Lo que cuesta",
    title: "Cada módulo tiene su precio de entrada publicado.",
  },

  close: {
    kicker: "Hablemos",
    desc: "Qué módulos, de qué tamaño y qué se construye primero es lo que responde el Diagnóstico antes de que nadie cotice nada. **Diez días hábiles revisando sus datos, sus reservas, su piso y sus números como un solo sistema.**",
    specs: [
      "**Día 1.** Una sesión de trabajo sobre la operación que de verdad corre, módulo por módulo.",
      "**Días 2 a 9.** Nos metemos: las fuentes, los canales, el piso, la medición y los números detrás de los números.",
      "**Día 10.** Llega el informe: qué es cierto, qué está roto y qué módulo se gana el primer lugar.",
      "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda al inicio y el resultado queda suyo.",
    ],
    ctaContact: "Otras formas de escribirnos",
  },
};

export type ShowcaseDict = typeof en;
export const showcase: Dict<ShowcaseDict> = { en, es };
