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
        body: "Bilingual ads for your tasting room, your wine club, and direct to consumer, run with the rigor of the most sophisticated agencies. The Valle's visitor flow dipped in 2025, so the wineries that keep their share are the ones whose follow-up and measurement work. Ad management sits inside the monthly service fee at the Vendimia and Cava scopes, and the ad budget goes from you straight to Google.",
        note: "**One fee,** never a cut of your budget.",
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
  assist: {
    kicker: "The assistant",
    title: "Ask your own cellar a question. Get your own record back.",
    body: [
      "A harvest leaves a trail. Lab sheets, tank cards, field notebooks, a spreadsheet somebody keeps on a laptop. None of it is wrong. It is scattered, and by the time anyone gathers it the decision has already been made. We put the trail in one place and keep it current, so the number you need at six in the morning in the cellar is the number you get.",
      "Nothing here decides anything about your wine. The blend, the pick date, the time on skins stay where they belong. The system remembers, calculates, and compares. It holds every vintage you have made, sets this one beside the last four, and shows the difference without anyone re-typing a page.",
      "The assistant on top of it answers in plain language and shows its work. Ask what the Cabernet's total acidity did last week and it returns the lab record it read, with the date and the lot. If the record does not exist, it says so. It never fills a gap with a plausible number, because in a cellar a plausible number is worse than none.",
    ],
    note: "**Every answer** carries the record it came from.",
    demo: {
      label: "Illustrative data",
      aria: "A winery dashboard beside an assistant. Two questions are asked and answered. Each answer names the record it read and marks the matching row on the dashboard. The second answer says there is no data rather than estimating.",
      boardTitle: "Cellar view",
      live: "LIVE",
      chartK: "Brix, Cabernet Sauvignon",
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
          q: "How is the Cabernet Sauvignon tracking on Brix this week?",
          a: [
            "24.3 Bx, tonnage-weighted across 6 samples.",
            "Same week in 2025: 23.8 Bx.",
            "Ripening is running about 5 days ahead.",
          ],
          cite: "Berry sampling, 28 August 2026, lots 26-CS-01 to 26-CS-06.",
        },
        {
          q: "How much fruit came in yesterday?",
          a: [
            "No data. There are no intake records entered for 1 September 2026.",
            "The last one is 30 August: 18.4 t of Chenin Blanc.",
          ],
          cite: "Tank intake, 30 August 2026.",
        },
      ],
    },
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
  pricing: {
    kicker: "What it costs",
    title: "Three scopes for a winery. Two fees, no license.",
    sub: "The setup fee pays for the build, and the winery owns what we build. The monthly service fee pays for running it: hosting, care, corrections, the report, and the assistant. Pause the service and nothing switches off.",
    floorLabel: "Where it starts",
    /** {setup} is the published floor. One figure on a public page, never a table. */
    floor: "From **{setup}** to implement, plus the monthly service fee.",
    /** Printed in place of the floor while the figures are unpublished. */
    floorTbd: "Set in the diagnostic.",
    buildLabel: "The build",
    serviceLabel: "Every month",
    bundles: [
      {
        name: "Cava",
        scale: "Large winery",
        build: [
          "The Vendimia build at large-winery scale",
          "Three more source connectors",
          "Four historical vintages loaded",
          "A prediction or classification model",
          "Finance workflow automation",
          "Online shop and age gate",
        ],
        service: [
          "Everything in Vendimia",
          "A monthly visit",
          "A larger ad spend ceiling",
        ],
      },
      {
        name: "Vendimia",
        scale: "Mid-size winery",
        build: [
          "The Bitácora build at mid-winery scale",
          "Two more source connectors",
          "Two historical vintages loaded",
          "Tasting room booking",
          "Direct sales and wine club follow-up",
        ],
        service: [
          "Everything in Bitácora",
          "Ad management",
          "Content",
          "A quarterly visit",
        ],
      },
      {
        name: "Bitácora",
        scale: "Small winery",
        build: [
          "Production record and vintage comparison",
          "Commercial record",
          "One historical vintage loaded",
          "Report generator",
          "The assistant over your own records",
          "Site, GA4 and conversion tracking",
          "Google Ads build",
          "Training and handover",
        ],
        service: [
          "Hosting and monitoring",
          "Care and corrections",
          "A weekly call and WhatsApp",
          "The monthly report and its readout",
          "Fair use of the assistant",
          "Your own admin account",
        ],
      },
    ],
    termsLabel: "Terms",
    terms: [
      "Setup is 50 percent on signature, 50 percent on acceptance.",
      "The signature half can be paid in three monthly payments at no extra cost.",
      "The service fee is paid in advance, month to month, 30 days notice either way.",
      "Leave the service before twelve payments and we invoice the difference against the build-only price, less one twelfth for every month already paid.",
      "All prices plus IVA. The ad budget goes from you straight to Google.",
    ],
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
        body: "Anuncios en los dos idiomas para su sala de degustación, su club de vino y la venta directa, manejados con el rigor de las agencias más serias. El flujo de visitantes del Valle bajó en 2025, así que las bodegas que conservan su parte son las que tienen seguimiento y medición que sí funcionan. El manejo de anuncios va dentro de la cuota mensual en los alcances Vendimia y Cava, y la inversión publicitaria la paga usted directo a Google.",
        note: "**Una sola cuota,** nunca un porcentaje de su inversión.",
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
  assist: {
    kicker: "El asistente",
    title: "Pregúntele a su bodega. La respuesta es su propio registro.",
    body: [
      "Una cosecha deja rastro. Hojas de laboratorio, tarjetas de tanque, libretas de campo, una hoja de cálculo que alguien guarda en su computadora. Nada de eso está mal. Está disperso, y para cuando se junta, la decisión ya se tomó. Nosotros lo reunimos en un solo lugar y lo mantenemos al día, para que el dato que usted necesita a las seis de la mañana en la bodega sea el dato que reciba.",
      "Aquí nada decide sobre su vino. La mezcla, la fecha de corte y el tiempo en pieles se quedan donde deben estar. El sistema recuerda, calcula y compara. Guarda cada añada que usted ha hecho, pone esta junto a las cuatro anteriores y muestra la diferencia sin que nadie vuelva a capturar una hoja.",
      "El asistente que va encima responde en lenguaje claro y enseña de dónde salió la respuesta. Pregúntele qué hizo la acidez total del Cabernet la semana pasada y le devuelve el registro de laboratorio que leyó, con fecha y lote. Si el registro no existe, lo dice. Nunca rellena un hueco con un número verosímil, porque en una bodega un número verosímil es peor que ninguno.",
    ],
    note: "**Cada respuesta** trae el registro del que salió.",
    demo: {
      label: "Datos de ejemplo",
      aria: "Un tablero de bodega junto a un asistente. Se hacen dos preguntas y se responden. Cada respuesta nombra el registro que leyó y marca la fila que le corresponde en el tablero. La segunda respuesta dice que no hay dato en lugar de estimarlo.",
      boardTitle: "Vista de bodega",
      live: "AL DÍA",
      chartK: "Brix, Cabernet Sauvignon",
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
          q: "¿Cómo va el Cabernet Sauvignon en grados Brix esta semana?",
          a: [
            "24.3 Bx, promedio ponderado por tonelaje de 6 muestras.",
            "En la misma semana de 2025: 23.8 Bx.",
            "Maduración adelantada unos 5 días.",
          ],
          cite: "Muestreo de bayas, 28 de agosto de 2026, lotes 26-CS-01 a 26-CS-06.",
        },
        {
          q: "¿Cuánta uva recibimos ayer?",
          a: [
            "No hay dato. No existen recepciones capturadas para el 1 de septiembre de 2026.",
            "El último registro es del 30 de agosto: 18.4 t de Chenin Blanc.",
          ],
          cite: "Recepción de tanque, 30 de agosto de 2026.",
        },
      ],
    },
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
  pricing: {
    kicker: "Lo que cuesta",
    title: "Tres alcances para una bodega. Dos cuotas, sin licencia.",
    sub: "La cuota de implementación paga la construcción, y el sistema queda suyo. La cuota mensual paga operarlo: hospedaje, cuidado, correcciones, el reporte y el asistente. Si la pausa, no se apaga nada.",
    floorLabel: "De dónde parte",
    floor: "Desde **{setup}** de implementación, más la cuota mensual del servicio.",
    floorTbd: "Se fija en el diagnóstico.",
    buildLabel: "La construcción",
    serviceLabel: "Cada mes",
    bundles: [
      {
        name: "Cava",
        scale: "Bodega grande",
        build: [
          "La construcción de Vendimia a escala de bodega grande",
          "Tres conectores de origen adicionales",
          "Cuatro añadas históricas cargadas",
          "Un modelo de predicción o clasificación",
          "Automatización del flujo financiero",
          "Tienda en línea y control de edad",
        ],
        service: [
          "Todo lo de Vendimia",
          "Una visita mensual",
          "Un techo de inversión publicitaria mayor",
        ],
      },
      {
        name: "Vendimia",
        scale: "Bodega mediana",
        build: [
          "La construcción de Bitácora a escala de bodega mediana",
          "Dos conectores de origen adicionales",
          "Dos añadas históricas cargadas",
          "Reservas para la sala de degustación",
          "Seguimiento de venta directa y club",
        ],
        service: [
          "Todo lo de Bitácora",
          "Manejo de anuncios",
          "Contenido",
          "Una visita trimestral",
        ],
      },
      {
        name: "Bitácora",
        scale: "Bodega chica",
        build: [
          "Registro de producción y comparación de añadas",
          "Registro comercial",
          "Una añada histórica cargada",
          "Generador de reportes",
          "El asistente sobre sus propios registros",
          "Sitio, GA4 y medición de conversiones",
          "Armado de Google Ads",
          "Capacitación y entrega",
        ],
        service: [
          "Hospedaje y monitoreo",
          "Cuidado y correcciones",
          "Una llamada semanal y WhatsApp",
          "El reporte mensual y su lectura",
          "Uso razonable del asistente",
          "Su propia cuenta de administrador",
        ],
      },
    ],
    termsLabel: "Condiciones",
    terms: [
      "La implementación se paga 50 por ciento a la firma y 50 por ciento a la aceptación.",
      "La mitad de la firma se puede pagar en tres mensualidades, sin recargo.",
      "La cuota mensual va por adelantado, mes con mes, con 30 días de aviso de cualquiera de las dos partes.",
      "Si deja el servicio antes de doce pagos, facturamos la diferencia contra el precio de la construcción sola, menos un doceavo por cada mensualidad ya pagada.",
      "Todos los precios más IVA. La inversión en anuncios la paga usted directo a Google.",
    ],
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
