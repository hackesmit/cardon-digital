import type { Dict } from "./rich";

/**
 * Winery page copy. This is the practice's primary industry, so the Spanish
 * side is the one written first: usted, Valle vocabulary (cuadro, hilera,
 * corte, anada, sala de degustacion), and nothing that reads translated.
 */

const en = {
  meta: {
    title: "Winery growth systems",
    description:
      "Live harvest and production intelligence, vineyard section maps, readiness prediction, and berry-to-bottle traceability for wineries, plus bilingual demand priced on performance.",
  },
  hero: {
    aria: "Winery introduction",
    eyebrow: "Industries / Winery",
    title: "Your harvest, live.",
    titleAccent: "Your wine, traceable.",
    sub: "Weights, samples, tank moves, ad spend, and the books usually live in separate places, half of them in notebooks. We wire them into one system your winery reads from and ends up owning, so every row reports and one place reads. **From the vine to the bottle, one connected view.**",
    ctaCase: "Read the case study",
    photoAlt: "Rows of grapevines on a hillside at golden hour",
  },
  caps: {
    kicker: "What we build",
    title: "What we build for wineries and growers.",
    sub: "One connected system for the season and the business behind it. Each piece stands on its own, and together they become the single view your team runs from, in English and Spanish, on both sides of the border.",
    cards: [
      {
        num: "01 / Intelligence",
        h: "One live view of harvest and production.",
        body: "Weights, samples, tank moves, and cellar notes stop living in scattered files and notebooks. We wire them into one view that updates itself, so the season reads at a glance instead of being rebuilt from memory after the fact.",
        note: "**One source of truth,** live all season.",
      },
      {
        num: "02 / Place",
        h: "Every number gets a place on the map.",
        body: "Readings tie back to the block and the row they came from, so a figure is never just a figure floating in a spreadsheet. You see where it happened, and the map becomes how the whole team reads the vineyard the same way.",
        note: "**Every reading,** tied to its ground.",
      },
      {
        num: "03 / Timing",
        h: "Readiness, tuned to your standard.",
        body: "We build the call for when a block is ready around your own quality bar, not a generic curve. The system learns the pattern your winemaker already trusts and puts it in front of the whole team early, so the pick is planned, not chased.",
        note: "**Anticipated,** not guessed.",
      },
      {
        num: "04 / Traceability",
        h: "Berry to bottle, one thread.",
        body: "Every lot carries its history: which rows, which pick, which tank, which barrel. When a question comes back from a distributor or an auditor, the answer is one lookup instead of a week lost in the archive.",
        note: "**One thread** from the vine to the label.",
      },
      {
        num: "05 / Operations",
        h: "The manual routines run themselves.",
        body: "The weekly jobs your team does by hand, reconciling, reporting, and moving numbers between systems, get built to run on their own. You get hours back every month, and those hours compound into real capacity.",
        note: "**Manual routines,** turned into work that runs itself.",
      },
      {
        num: "06 / Demand",
        h: "Fill the tasting room, the club, and DTC.",
        body: "Bilingual ads for your tasting room, your wine club, and direct to consumer, run with the rigor of the most sophisticated agencies. The Valle's visitor flow dipped in 2025, so the wineries that keep their share are the ones whose follow-up and measurement work. Priced in proportion to performance: a share of spend with a floor, or, once measurement you trust is in place, a share of the sales the ads bring in.",
        note: "**We get paid** when it works.",
      },
    ],
  },
  leak: {
    kicker: "The gap",
    title: "What is actually leaking.",
    sub: "Owner-run wineries rarely lose on the wine. They lose in the seams between the systems, where revenue goes uncounted and unfollowed.",
    items: [
      {
        num: "01 / Production truth",
        h: "The season lives in three places at once.",
        body: "Weights, samples, and tank moves sit in a legacy system, a stack of spreadsheets, and a cellar notebook, and none of them agree. **This is the exact knot we untied at Monte Xanic:** one live view instead of three versions of the same harvest.",
      },
      {
        num: "02 / Follow-up",
        h: "The visit is the last the guest hears from you.",
        body: "Over 90 percent of club signups happen in person, in the tasting room, and follow-up within about 48 hours converts best. Personal, timely offers lift order sizes by as much as half. **Most small wineries follow up late, or never.**",
      },
      {
        num: "03 / Rented fragments",
        h: "Four subscriptions that never talk.",
        body: "Production tools, a club platform, and a commerce plugin each bill every month and still do not speak to each other. **Nobody holds production, DTC, and finance in one view,** so the numbers get reconciled by hand, or not at all.",
      },
      {
        num: "04 / The real bottleneck",
        h: "Demand is not the problem.",
        body: "The smallest wineries are the ones growing direct sales while big-winery DTC shrinks. **Demand is not the bottleneck.** The gap between the tasting room and a system that follows the guest home is, and it is one you can close.",
      },
    ],
    foot: "Your own numbers come out of the diagnostic.",
  },
  proof: {
    kicker: "Case study",
    title: "Proof, not a promise.",
    desc: "Monte Xanic, a winery in the Valle de Guadalupe, runs its harvest and its finances on a system we built and its own team now owns. **The full story, what we changed and what it does now, lives on the case study page.** This page is the shape of the offer; that page is the receipt.",
    ctaXanic: "Read the Monte Xanic case study",
    ctaEnkanto: "And the commerce side: the En'kanto case study",
    meta: "One winery, one connected view, run by the people who grow the wine.",
    sealSub: "Valle de Guadalupe",
  },
  vis: {
    tagBefore: "scattered records",
    tagMid: "wired into",
    tagAfter: "one view",
    aria: "Scattered old records, field notebooks, spreadsheet cards, and a legacy terminal window, stream their contents one by one into a single collection channel that fills a wine bottle. Each emptied source fades away; a ledger flips from the old scattered state to one live view, and a cork slides into the full bottle.",
    fallback:
      "Notebooks, spreadsheets, and a legacy system stream their contents into one collection channel that fills a single cellar view. Scattered records, wired into one view.",
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
    "Ten business days looking at your harvest data, your ads, and your operations as one system. You get a written memo, not a sales deck, telling you what is true, what is broken, and what to build first.",
  diagSpecs: [
    "**Day 1.** A working session on your vineyard, your cellar, your ads, and your books.",
    "**Days 2 to 9.** We dig: the data, the measurement, the manual routines, the numbers behind the numbers.",
    "**Day 10.** The memo lands: what is true, what is broken, what to build first.",
    "**Free, with no strings.** Act on it with us or without us. If we build, pricing is agreed up front.",
  ],
};

const es: typeof en = {
  meta: {
    title: "Sistemas para bodegas",
    description:
      "Cosecha, laboratorio, tanques y añadas en una sola vista, con el mapa de sus cuadros, el aviso de madurez contra su propio estándar y la trazabilidad de la baya a la botella. En español, para el Valle de Guadalupe y Ensenada.",
  },
  hero: {
    aria: "Presentación para bodegas",
    eyebrow: "Sectores / Bodegas",
    title: "El vino lo hace usted.",
    titleAccent: "Los números los guarda el sistema.",
    sub: "Los pesos, las muestras, los movimientos de tanque, la inversión en anuncios y las cuentas viven en lugares distintos, y la mitad en libretas. Nosotros los reunimos en un solo sistema del que su bodega lee todos los días y que termina siendo suyo. **De la vid a la botella, una sola vista.**",
    ctaCase: "Lea el caso de estudio",
    photoAlt: "Hileras de vid en una ladera a la hora dorada",
  },
  caps: {
    kicker: "Lo que construimos",
    title: "Lo que construimos para bodegas y viticultores.",
    sub: "Un solo sistema conectado para la temporada y para el negocio que la sostiene. Cada pieza funciona por su cuenta, y juntas se vuelven la vista desde la que trabaja su equipo, en español y en inglés, de los dos lados de la línea.",
    cards: [
      {
        num: "01 / Información",
        h: "Una sola vista de la cosecha y la producción, al día.",
        body: "Los pesos, las muestras, los movimientos de tanque y las notas de bodega dejan de vivir en archivos sueltos y libretas. Los reunimos en una vista que se actualiza sola, para que la temporada se lea de un vistazo y no se reconstruya de memoria cuando ya pasó.",
        note: "**Un solo registro,** al día toda la temporada.",
      },
      {
        num: "02 / Lugar",
        h: "Cada número tiene su lugar en el mapa.",
        body: "Cada lectura queda amarrada al cuadro y a la hilera de donde salió, así que un dato nunca es un dato suelto en una hoja de cálculo. Usted ve dónde ocurrió, y el mapa se vuelve la forma en que todo el equipo lee el viñedo igual.",
        note: "**Cada lectura,** amarrada a su tierra.",
      },
      {
        num: "03 / Momento",
        h: "La madurez, medida contra su propio estándar.",
        body: "El aviso de cuándo un cuadro está listo lo construimos alrededor de su vara de calidad, no de una curva genérica. El sistema aprende el patrón en el que su enólogo ya confía y lo pone frente a todo el equipo con tiempo, para que el corte se planee y no se persiga.",
        note: "**Anticipado,** no adivinado.",
      },
      {
        num: "04 / Trazabilidad",
        h: "De la baya a la botella, un solo hilo.",
        body: "Cada lote carga su historia: qué hileras, qué corte, qué tanque, qué barrica. Cuando llega una pregunta de un distribuidor o de un auditor, la respuesta es una consulta y no una semana perdida en el archivo.",
        note: "**Un solo hilo** de la vid a la etiqueta.",
      },
      {
        num: "05 / Operación",
        h: "Las tareas manuales se hacen solas.",
        body: "Las tareas semanales que su equipo hace a mano, conciliar, reportar y mover números entre sistemas, quedan construidas para correr solas. Usted recupera horas cada mes, y esas horas se acumulan en capacidad real.",
        note: "**Tareas manuales,** convertidas en trabajo que se hace solo.",
      },
      {
        num: "06 / Demanda",
        h: "Llene la sala de degustación, el club y la venta directa.",
        body: "Anuncios en los dos idiomas para su sala de degustación, su club de vino y la venta directa, manejados con el rigor de las agencias más serias. El flujo de visitantes del Valle bajó en 2025, así que las bodegas que conservan su parte son las que tienen seguimiento y medición que sí funcionan. Con precio proporcional al resultado: un porcentaje de la inversión con un piso, o, cuando ya existe una medición en la que usted confía, un porcentaje de las ventas que traen los anuncios.",
        note: "**Cobramos** cuando funciona.",
      },
    ],
  },
  leak: {
    kicker: "La fuga",
    title: "Por dónde se está yendo el dinero.",
    sub: "Las bodegas con dueño rara vez pierden en el vino. Pierden en las costuras entre los sistemas, donde el ingreso no se cuenta y nadie le da seguimiento.",
    items: [
      {
        num: "01 / La verdad de la producción",
        h: "La temporada vive en tres lugares a la vez.",
        body: "Los pesos, las muestras y los movimientos de tanque están en un sistema viejo, en una pila de hojas de cálculo y en una libreta de bodega, y ninguno coincide con los otros. **Este es exactamente el nudo que desatamos en Monte Xanic:** una sola vista al día en lugar de tres versiones de la misma cosecha.",
      },
      {
        num: "02 / Seguimiento",
        h: "La visita es lo último que el huésped sabe de usted.",
        body: "Más del 90 por ciento de las altas al club pasan en persona, en la sala de degustación, y el seguimiento dentro de unas 48 horas es el que mejor convierte. Una oferta personal y a tiempo llega a subir el tamaño del pedido hasta la mitad. **La mayoría de las bodegas chicas da seguimiento tarde, o nunca.**",
      },
      {
        num: "03 / Pedazos rentados",
        h: "Cuatro suscripciones que nunca se hablan.",
        body: "Las herramientas de producción, la plataforma del club y el complemento de la tienda cobran cada mes y siguen sin hablarse entre ellas. **Nadie tiene la producción, la venta directa y las cuentas en una sola vista,** así que los números se concilian a mano, o no se concilian.",
      },
      {
        num: "04 / El cuello de botella real",
        h: "La demanda no es el problema.",
        body: "Las bodegas más chicas son las que están creciendo en venta directa mientras la de las grandes se encoge. **La demanda no es el cuello de botella.** Lo es el hueco entre la sala de degustación y un sistema que siga al huésped hasta su casa, y ese hueco se puede cerrar.",
      },
    ],
    foot: "Sus propios números salen del diagnóstico.",
  },
  proof: {
    kicker: "Caso de estudio",
    title: "Pruebas, no promesas.",
    desc: "Monte Xanic, una bodega del Valle de Guadalupe, opera su cosecha y sus finanzas sobre un sistema que construimos y que hoy es de su equipo. **La historia completa, qué cambiamos y qué hace ahora, está en la página del caso.** Esta página es la forma de la oferta; esa página es el comprobante.",
    ctaXanic: "Lea el caso de Monte Xanic",
    ctaEnkanto: "Y el lado comercial: el caso de En'kanto",
    meta: "Una bodega, una sola vista, operada por la gente que hace el vino.",
    sealSub: "Valle de Guadalupe",
  },
  vis: {
    tagBefore: "registros dispersos",
    tagMid: "conectados en",
    tagAfter: "una vista",
    aria: "Registros viejos y dispersos, libretas de campo, tarjetas de hoja de cálculo y una ventana de sistema antiguo van vaciando su contenido uno por uno en un solo canal que llena una botella de vino. Cada fuente vaciada se desvanece; una bitácora pasa del estado disperso a una sola vista al día, y un corcho entra en la botella llena.",
    fallback:
      "Libretas, hojas de cálculo y un sistema antiguo vacían su contenido en un solo canal que llena una sola vista de bodega. Registros dispersos, conectados en una vista.",
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
    "Diez días hábiles revisando los datos de su cosecha, sus anuncios y su operación como un solo sistema. Usted recibe un informe escrito, no una presentación de ventas: qué es cierto, qué está roto y qué conviene construir primero.",
  diagSpecs: [
    "**Día 1.** Una sesión de trabajo sobre su viñedo, su bodega, sus anuncios y sus cuentas.",
    "**Días 2 a 9.** Escarbamos: los datos, la medición, las tareas manuales y los números detrás de los números.",
    "**Día 10.** Llega el informe: qué es cierto, qué está roto y qué construir primero.",
    "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda desde el principio.",
  ],
};

export type WineryDict = typeof en;
export const winery: Dict<WineryDict> = { en, es };
