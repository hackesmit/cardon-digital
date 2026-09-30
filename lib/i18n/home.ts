import type { Dict } from "./rich";

/** A photograph's caption (the result) and its alt text (the frame). */
type HomePhoto = { cap: string; alt: string };

/**
 * Home page copy.
 *
 * The architecture is the arc of 2026-09-28 (bunker research/2026-09/
 * site-arc-digital-onboarding.md section 4): hero, proof bar, the three
 * services, the objections, the Monte Xanic case, one system, how it works,
 * who builds it, compare, pricing summary, diagnostic. Three results in one
 * order: they find you, they write to you, the work runs itself.
 *
 * Two rules this file is read against: every claim is the result the owner
 * ends up with rather than the deliverable, and the only figure published in
 * prose is Monte Xanic's own (about an hour of finance work, about two minutes
 * now), which lib/i18n/monte-xanic.ts carries with its basis. Every price on
 * the page is read out of lib/pricing.ts by the page, never typed here.
 *
 * Spanish is written for a Mexican owner and is the authoritative version.
 * English is written for a US owner. Neither is a translation of the other.
 *
 * The primary call to action is site.ts `diag.cta`, used verbatim everywhere
 * it appears, so the page repeats one action rather than four phrasings of it.
 */

const en = {
  meta: {
    title: "Cardon Digital | Get found, get chosen, and let the work run itself",
    description:
      "Websites, Google Ads and custom software for owner-run businesses in Baja California. Prices published, a free diagnostic, and everything we build stays in your name.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Websites, ads and software. Ensenada, Baja California",
    title: "Get found. Get chosen.",
    titleAccent: "And let the work run itself.",
    sub: "A site people write to, ads that bring in new clients, and a system that does the repetitive work for your team. Each one bought on its own, and everything we build stays in your name.",
    risk: "Start with a free diagnostic. The memo is yours whether we build or not.",
    proofLine: "Built for Monte Xanic, Vinedo En'kanto and Dharma Ochoa.",
  },
  proof: {
    aria: "Businesses already built for",
    read: "Read the case",
    items: [
      {
        name: "Monte Xanic",
        place: "Valle de Guadalupe",
        result: "An hour of finance work, now about two minutes",
      },
      {
        name: "Vinedo En'kanto",
        place: "San Antonio de las Minas",
        result: "Production, restaurant and bookings on one system, and a store in front of it",
      },
      {
        name: "Dharma Ochoa",
        place: "Artist",
        result: "Portfolio and online store, designed and delivered in her name",
      },
    ],
  },
  services: {
    kicker: "What we do",
    title: "Three ways to grow. Start with the one that is urgent.",
    fromLabel: "from",
    perMonth: "a month, flat fee",
    items: [
      {
        id: "sitios",
        name: "Website",
        title: "Get found, and get believed.",
        body: "A site that loads fast, reads on a phone and takes the visitor to write to you. Designed for your business, copy included.",
        cta: "See websites",
      },
      {
        id: "anuncios",
        name: "Google Ads",
        title: "New clients who were already searching, measured.",
        body: "Campaigns for the people already searching for what you sell. A flat monthly fee, and your budget goes straight to Google.",
        cta: "See ads",
      },
      {
        id: "software",
        name: "Software",
        title: "The repetitive work runs itself.",
        body: "A system built around how you already work: the record is written once, the reports build themselves, and the books are current every morning.",
        cta: "See software",
      },
    ],
    arcLine: "Each one works on its own. Together, your business is in the digital era end to end: they find you, they write to you, and the work runs itself.",
  },
  /** The six photographs at the top of the page: one per proof card, one per service card. */
  photos: {
    "home/proof-xanic": { cap: "Monte Xanic opens the season in one live view.", alt: "Monte Xanic, the winery in one frame" },
    "home/proof-enkanto": { cap: "En'kanto's cabin: every booking from every channel in one calendar.", alt: "En'kanto's cabin among succulents and vines" },
    "home/proof-dharma": { cap: "Dharma Ochoa's portfolio and store, ready to sell from a phone.", alt: "Dharma Ochoa's site open on a phone" },
    "home/service-sitios": { cap: "A site that reads on a phone and leads to a message.", alt: "A phone in hand with a website open" },
    "home/service-anuncios": { cap: "The client who was searching arrives on WhatsApp, and gets counted.", alt: "A message being answered at a counter" },
    "home/service-software": { cap: "The record is written once, where the work happens.", alt: "A tablet with the day's board, at work" },
  } as Record<string, HomePhoto>,
  familiar: {
    kicker: "Objections",
    title: "Sound familiar?",
    items: [
      {
        q: "I have a website, but nobody writes to me through it.",
        a: "A site is built to be written to. Yours gets designed and measured for that.",
      },
      {
        q: "I paid for ads once and never knew what they brought.",
        a: "Every peso is measured down to the call or the message it produced, and the report is yours.",
      },
      {
        q: "My team will never take up another system.",
        a: "The record is written once, where the work already happens, from the phone.",
      },
      {
        q: "I am afraid of depending on an agency.",
        a: "Domain, accounts, code and data are in your name from the first day.",
      },
    ],
  },
  xanic: {
    kicker: "Case study",
    title: "Two jobs at Monte Xanic: the books and the harvest.",
    body: "One system solved two different problems. One of time: a finance view somebody assembled by hand every week. One of memory: whole vintages of data piled in notebooks and spreadsheets nobody could consult.",
    finance: {
      kicker: "Finance",
      title: "The finance view assembles itself.",
      body: "Every week somebody spent about an hour putting it together by hand. Now it refreshes through the day and nobody touches it.",
    },
    stats: [
      { n: "1 hour", k: "every week, by hand" },
      { n: "2 minutes", k: "now, refreshed through the day" },
      { n: "97 percent less", k: "time on that one view" },
    ],
    basis: "Timed by hand before the build, and the two minutes are the refresh the dashboard generates. No Monte Xanic production, sales or financial figures are published.",
    production: {
      kicker: "Production",
      title: "Years of harvests, finally at hand.",
      body: "Weights, samples, tanks and lab results piled up vintage after vintage in notebooks and spreadsheets. Now every reading sits in one record, comparable across vintages and ready for a decision the moment it is asked for.",
      cap: "The vintages side by side, on the screen where the decision gets made.",
      alt: "A laptop in the barrel cellar with the season's charts on screen",
    },
    read: "Read the Monte Xanic case",
    tankCap: "The record, read at the barrel from the phone, with nothing to copy out again.",
    tankAlt: "A hand scrolling the season's record on a phone, at the barrel.",
    play: "Play the clip",
    pause: "Pause the clip",
  },
  system: {
    kicker: "One system",
    title: "Stop arguing about which spreadsheet is right.",
    body: "Invoices, messages, bookings, harvest and the books go in once and come out as one board that keeps itself current. It is what we built for Monte Xanic and for En'kanto, and what the software service builds for you.",
    more: "See the software",
  },
  how: {
    kicker: "How it works",
    title: "From the first message to a system your team runs.",
    steps: [
      { k: "01", body: "The diagnostic, at no cost. Ten business days and a written memo that is yours." },
      { k: "02", body: "The build. A fixed price, agreed before anyone starts." },
      { k: "03", body: "The handover. Your team trained, the accounts and the keys in your name." },
    ],
    anywhere: "You can start with any of the three: a site, a campaign or a system. The diagnostic says which one first.",
  },
  who: {
    kicker: "Who builds it",
    title: "The person who answers is the person who builds.",
    body: "Cardon Digital is a small studio in Ensenada, run by Daniel Hack. Four clients at a time, so each one has the same person from the first day to the handover. We work in Spanish and English, on both sides of the border.",
  },
  compare: {
    kicker: "Compare",
    title: "What you own when it is finished.",
    cardon: "Cardon",
    usual: "The usual stack",
    yesSr: "Cardon: yes",
    noSr: "The usual stack: no",
    rows: [
      { dim: "Ownership", cardon: "Yours, keys and all", usual: "Rented forever" },
      { dim: "Fee", cardon: "Flat, agreed up front", usual: "A percentage, or per seat" },
      { dim: "Measurement", cardon: "Down to the call or the message", usual: "Clicks and likes" },
      { dim: "Who answers", cardon: "The same person who built it", usual: "A ticket queue" },
      { dim: "Fit", cardon: "Built around how you work", usual: "Your work bent to the tool" },
      { dim: "Answers", cardon: "An assistant that reads your records", usual: "Generic features" },
    ],
  },
  pricing: {
    kicker: "What it costs",
    title: "Prices published.",
    sub: "Every service has its entry price in the open. Quoted and invoiced in Mexican pesos plus IVA; the dollar figures are rounded conversions. The diagnostic sets the final quote.",
    siteK: "Website",
    adsK: "Google Ads",
    softK: "Software",
    fromLabel: "from",
    perMonth: "a month, flat fee",
    more: "See every price",
    foot: [
      {
        k: "Ads",
        body: "Your ad budget is paid by you straight to Google, never through us.",
      },
      {
        k: "Terms",
        body: "Quoted and invoiced in pesos, plus IVA. The build is paid half to start and half on delivery.",
      },
    ],
  },
  vis: {
    arc: {
      tagBefore: "a business run by hand",
      tagMid: "goes digital",
      captionRun: "connecting",
      captionDone: "in the digital era",
      aria: "A business goes digital in three acts: its website assembles on a phone and comes up first in a search, the people searching for it arrive as messages, and each message lands as a row in one system that keeps itself current.",
      fallback: "Your site comes up first, the people searching write to you, and every message lands in one system that runs itself.",
      stages: [
        { k: "01", label: "They find you" },
        { k: "02", label: "They write to you" },
        { k: "03", label: "The work runs itself" },
      ],
      query: "wine in ensenada",
      siteName: "Your business",
      siteLine: "What you sell, for whom",
      siteCta: "Write to us",
      resultTag: "1st result",
      messagesK: "MESSAGES",
      ledgerTitle: "One system",
      rows: [
        { k: "QUOTE", v: "sent" },
        { k: "BOOKING", v: "confirmed" },
        { k: "INVOICE", v: "issued" },
        { k: "REPORT", v: "current" },
      ],
    },
    hero: {
      tagBefore: "notebooks in",
      tagMid: "one view out",
      connecting: "connecting",
      oneSystem: "one system",
      fallback:
        "Notebooks, spreadsheets, invoices and messages settle into clean rows around one panel the winery owns.",
      panelTitle: "One system",
      panelSummary: "SUMMARY",
      docs: [
        { name: "harvest.xlsx", tag: "XLSX" },
        { name: "lab.csv", tag: "CSV" },
        { name: "tanks.xlsx", tag: "XLSX" },
        { name: "invoice.pdf", tag: "PDF" },
        { name: "field book", tag: "NOTES" },
        { name: "whatsapp", tag: "MSG" },
      ],
      rows: [
        { k: "HARVEST", v: "live" },
        { k: "LOTS", v: "dated" },
        { k: "TANKS", v: "current" },
        { k: "BOOKINGS", v: "synced" },
        { k: "SERVICE", v: "counted" },
        { k: "FINANCE", v: "current" },
      ],
    },
    map: {
      legend: "The valley we work in, and the wineries in it",
      hub: "One system",
      scale: "Valle de Guadalupe and Ensenada",
      listAria: "The valley we work in",
      stationsHead: "Built here",
      focus: "Focus",
      caseStudy: "Case:",
      wineryName: "Wineries / Valle de Guadalupe",
      wineryDetail: "harvest, rooms and service in one record",
      wineryAria:
        "Wineries, Valle de Guadalupe. Harvest, rooms and service in one record. Open the winery page.",
      xanicAria: "Read the Monte Xanic case.",
      enkantoAria: "Read the Vinedo En'kanto case.",
    },
    board: {
      tag: "three parts, one board",
      aria: "Separate parts are placed and wired into one working board.",
    },
    memo: {
      tag: "read before it is trusted",
      aria:
        "A reading is checked against a measured baseline and settles to a written result.",
      signalIn: "YOUR NUMBERS",
      measured: "MEASURED",
      checking: "ten business days",
      verified: "the memo, in writing",
      reading: "reading",
      foot: "what is true, and what to build first",
    },
  },
  diagnostic: {
    desc: "Ten business days on your site, your ads and your operation. A written memo: what is true, what is broken, what to build first.",
    doors: "Write on WhatsApp, book a call or send the form. All three reach the person who does the work.",
  },
};

const es: typeof en = {
  meta: {
    title: "Cardon Digital | Que lo encuentren, que le compren, y que el trabajo se haga solo",
    description:
      "Sitios web, anuncios en Google y software a la medida para negocios en Baja California. Precios publicados en pesos, diagnóstico sin costo, y todo lo que construimos queda a su nombre.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Sitios web, anuncios y software. Ensenada, Baja California",
    title: "Que lo encuentren, que le compren,",
    titleAccent: "y que el trabajo se haga solo.",
    sub: "Un sitio por el que le escriben, anuncios que traen clientes nuevos y un sistema que hace lo repetitivo por su equipo. Cada uno se contrata por su cuenta, y todo lo que construimos queda a su nombre.",
    risk: "Empiece con un diagnóstico sin costo. El informe es suyo, construyamos o no.",
    proofLine: "Construido para Monte Xanic, Viñedo En'kanto y Dharma Ochoa.",
  },
  proof: {
    aria: "Negocios para los que ya construimos",
    read: "Ver el caso",
    items: [
      {
        name: "Monte Xanic",
        place: "Valle de Guadalupe",
        result: "Una hora de trabajo financiero, hoy unos dos minutos",
      },
      {
        name: "Viñedo En'kanto",
        place: "San Antonio de las Minas",
        result: "Producción, restaurante y reservas en un sistema, y una tienda enfrente",
      },
      {
        name: "Dharma Ochoa",
        place: "Artista",
        result: "Portafolio y tienda en línea, diseñados y entregados a su nombre",
      },
    ],
  },
  services: {
    kicker: "Lo que hacemos",
    title: "Tres formas de crecer. Empiece por la que le urge.",
    fromLabel: "desde",
    perMonth: "al mes, cuota fija",
    items: [
      {
        id: "sitios",
        name: "Sitio web",
        title: "Que lo encuentren, y le crean.",
        body: "Un sitio que carga rápido, se lee en el teléfono y lleva al visitante a escribirle. Diseñado para su negocio, con textos incluidos.",
        cta: "Ver sitios web",
      },
      {
        id: "anuncios",
        name: "Anuncios en Google",
        title: "Clientes nuevos que ya lo buscaban, medidos.",
        body: "Campañas para la gente que ya está buscando lo que usted vende. Cuota fija al mes, y su presupuesto va directo a Google.",
        cta: "Ver anuncios",
      },
      {
        id: "software",
        name: "Software",
        title: "El trabajo repetitivo se hace solo.",
        body: "Un sistema hecho alrededor de cómo ya trabaja: el registro se anota una vez, los reportes se arman solos y las cuentas amanecen al corriente.",
        cta: "Ver software",
      },
    ],
    arcLine: "Cada uno funciona por su cuenta. Juntos, su negocio queda en la era digital de punta a punta: lo encuentran, le escriben y el trabajo se hace solo.",
  },
  photos: {
    "home/proof-xanic": { cap: "Monte Xanic abre la temporada en una sola vista viva.", alt: "Monte Xanic, la bodega en una toma" },
    "home/proof-enkanto": { cap: "La cabaña de En'kanto: cada reserva, de cualquier canal, en un solo calendario.", alt: "La cabaña de En'kanto entre suculentas y viñas" },
    "home/proof-dharma": { cap: "El portafolio y la tienda de Dharma Ochoa, listos para vender desde el teléfono.", alt: "El sitio de Dharma Ochoa abierto en un teléfono" },
    "home/service-sitios": { cap: "Un sitio que se lee en el teléfono y lleva a escribirle.", alt: "Un teléfono en la mano con un sitio abierto" },
    "home/service-anuncios": { cap: "El cliente que buscaba llega por WhatsApp, y queda contado.", alt: "Un mensaje que se contesta en el mostrador" },
    "home/service-software": { cap: "El registro se anota una vez, donde se hace el trabajo.", alt: "Una tableta con el tablero del día, en el trabajo" },
  } as Record<string, HomePhoto>,
  familiar: {
    kicker: "Objeciones",
    title: "¿Le suena?",
    items: [
      {
        q: "Tengo página, pero nadie me escribe por ahí.",
        a: "Un sitio se hace para que le escriban. El suyo se diseña y se mide para eso.",
      },
      {
        q: "Ya pagué anuncios y nunca supe qué me trajeron.",
        a: "Cada peso queda medido hasta la llamada o el mensaje que produjo, y el reporte es suyo.",
      },
      {
        q: "Mi gente nunca va a usar otro sistema.",
        a: "El registro se anota una sola vez, donde ya se hace el trabajo, desde el teléfono.",
      },
      {
        q: "Me da miedo depender de una agencia.",
        a: "Dominio, cuentas, código y datos quedan a su nombre desde el primer día.",
      },
    ],
  },
  xanic: {
    kicker: "Caso de estudio",
    title: "Dos trabajos en Monte Xanic: las cuentas y la cosecha.",
    body: "Un mismo sistema resolvió dos problemas distintos. Uno de tiempo: una vista financiera que alguien armaba a mano cada semana. Otro de memoria: añadas enteras de datos apiladas en libretas y hojas de cálculo que nadie podía consultar.",
    finance: {
      kicker: "Finanzas",
      title: "La vista financiera se arma sola.",
      body: "Cada semana alguien pasaba cerca de una hora armándola a mano. Hoy se actualiza durante el día y nadie la toca.",
    },
    stats: [
      { n: "1 hora", k: "cada semana, a mano" },
      { n: "2 minutos", k: "hoy, actualizados durante el día" },
      { n: "97 por ciento menos", k: "tiempo en esa vista" },
    ],
    basis: "Cronometrado a mano antes de la construcción, y los dos minutos son la actualización que genera el tablero. Aquí no publicamos cifras de producción, de ventas ni financieras de Monte Xanic.",
    production: {
      kicker: "Producción",
      title: "Años de cosechas, por fin a la mano.",
      body: "Pesos, muestras, tanques y laboratorio se acumulaban añada tras añada en libretas y hojas de cálculo. Hoy cada dato está en un solo registro, comparable entre añadas y listo para decidir en el momento en que se pregunta.",
      cap: "Las añadas lado a lado, en la pantalla donde se toma la decisión.",
      alt: "Una laptop en la cava de barricas con las gráficas de la temporada en pantalla",
    },
    read: "Ver el caso de Monte Xanic",
    tankCap: "El registro, leído en la barrica desde el teléfono, sin volver a capturar nada.",
    tankAlt: "Una mano recorre el registro de la temporada en un teléfono, junto a la barrica.",
    play: "Reproducir el video",
    pause: "Pausar el video",
  },
  system: {
    kicker: "Un solo sistema",
    title: "Deje de discutir cuál hoja de cálculo es la buena.",
    body: "Facturas, mensajes, reservas, cosecha y cuentas entran una vez y salen como un tablero que se mantiene al corriente solo. Es lo que construimos para Monte Xanic y para En'kanto, y lo que el servicio de software construye para usted.",
    more: "Ver el software",
  },
  how: {
    kicker: "Cómo funciona",
    title: "Del primer mensaje al sistema que opera su equipo.",
    steps: [
      { k: "01", body: "El diagnóstico, sin costo. Diez días hábiles y un informe escrito que es suyo." },
      { k: "02", body: "La construcción. Precio fijo, acordado antes de empezar." },
      { k: "03", body: "La entrega. Su equipo entrenado, las cuentas y las llaves a su nombre." },
    ],
    anywhere: "Puede empezar por cualquiera de los tres: un sitio, una campaña o un sistema. El diagnóstico dice cuál le conviene primero.",
  },
  who: {
    kicker: "Quién lo hace",
    title: "Le contesta la misma persona que construye.",
    body: "Cardon Digital es un taller chico en Ensenada, dirigido por Daniel Hack. Cuatro clientes a la vez, para que cada uno tenga a la misma persona del primer día a la entrega. Trabajamos en español e inglés, en los dos lados de la frontera.",
  },
  compare: {
    kicker: "Comparar",
    title: "Con qué se queda cuando terminamos.",
    cardon: "Cardon",
    usual: "Lo de siempre",
    yesSr: "Cardon: sí",
    noSr: "Lo de siempre: no",
    rows: [
      { dim: "Propiedad", cardon: "Suyo, con llaves y todo", usual: "Rentado para siempre" },
      { dim: "Cuota", cardon: "Fija, acordada antes", usual: "Un porcentaje, o por usuario" },
      { dim: "Medición", cardon: "Hasta la llamada o el mensaje", usual: "Clics y likes" },
      { dim: "Quién contesta", cardon: "La misma persona que lo construyó", usual: "Una fila de tickets" },
      { dim: "Ajuste", cardon: "Hecho alrededor de cómo trabaja", usual: "Su trabajo doblado a la herramienta" },
      { dim: "Respuestas", cardon: "Un asistente que lee sus registros", usual: "Funciones genéricas" },
    ],
  },
  pricing: {
    kicker: "Lo que cuesta",
    title: "Precios publicados, en pesos.",
    sub: "Cada servicio tiene su precio de entrada a la vista, más IVA, con factura. El diagnóstico fija la cotización final.",
    siteK: "Sitio web",
    adsK: "Anuncios en Google",
    softK: "Software",
    fromLabel: "desde",
    perMonth: "al mes, cuota fija",
    more: "Ver todos los precios",
    foot: [
      {
        k: "Anuncios",
        body: "Su presupuesto de anuncios lo paga usted directo a Google, nunca a través de nosotros.",
      },
      {
        k: "Condiciones",
        body: "Cotizado en pesos, más IVA, con factura. La construcción se paga mitad al empezar y mitad a la entrega.",
      },
    ],
  },
  vis: {
    arc: {
      tagBefore: "un negocio a mano",
      tagMid: "entra a lo digital",
      captionRun: "conectando",
      captionDone: "en la era digital",
      aria: "Un negocio entra a lo digital en tres actos: su sitio se arma en un teléfono y sale primero en una búsqueda, la gente que lo buscaba llega como mensajes, y cada mensaje cae como un renglón en un solo sistema que se mantiene al corriente solo.",
      fallback: "Su sitio sale primero, la gente que busca le escribe, y cada mensaje cae en un solo sistema que corre solo.",
      stages: [
        { k: "01", label: "Lo encuentran" },
        { k: "02", label: "Le escriben" },
        { k: "03", label: "El trabajo se hace solo" },
      ],
      query: "vino en ensenada",
      siteName: "Su negocio",
      siteLine: "Lo que vende, para quién",
      siteCta: "Escríbanos",
      resultTag: "1er resultado",
      messagesK: "MENSAJES",
      ledgerTitle: "Un solo sistema",
      rows: [
        { k: "COTIZACIÓN", v: "enviada" },
        { k: "RESERVA", v: "confirmada" },
        { k: "FACTURA", v: "emitida" },
        { k: "REPORTE", v: "al corriente" },
      ],
    },
    hero: {
      tagBefore: "entran libretas",
      tagMid: "sale una vista",
      connecting: "conectando",
      oneSystem: "un solo sistema",
      fallback:
        "Libretas, hojas de cálculo, facturas y mensajes se acomodan en renglones limpios alrededor de un panel que es de la bodega.",
      panelTitle: "Un solo sistema",
      panelSummary: "RESUMEN",
      docs: [
        { name: "cosecha.xlsx", tag: "XLSX" },
        { name: "lab.csv", tag: "CSV" },
        { name: "tanques.xlsx", tag: "XLSX" },
        { name: "factura.pdf", tag: "PDF" },
        { name: "libreta", tag: "NOTAS" },
        { name: "whatsapp", tag: "MSG" },
      ],
      rows: [
        { k: "COSECHA", v: "al día" },
        { k: "LOTES", v: "fechados" },
        { k: "TANQUES", v: "al corriente" },
        { k: "RESERVAS", v: "reunidas" },
        { k: "SERVICIO", v: "contado" },
        { k: "FINANZAS", v: "al corriente" },
      ],
    },
    map: {
      legend: "El valle en el que trabajamos, y las bodegas que hay en él",
      hub: "Un solo sistema",
      scale: "Valle de Guadalupe y Ensenada",
      listAria: "El valle en el que trabajamos",
      stationsHead: "Aquí construimos",
      focus: "Enfoque",
      caseStudy: "Caso:",
      wineryName: "Bodegas / Valle de Guadalupe",
      wineryDetail: "cosecha, cuartos y servicio en un registro",
      wineryAria:
        "Bodegas, Valle de Guadalupe. Cosecha, cuartos y servicio en un solo registro. Abrir la página de bodegas.",
      xanicAria: "Ver el caso de Monte Xanic.",
      enkantoAria: "Ver el caso de Viñedo En'kanto.",
    },
    board: {
      tag: "tres partes, un solo tablero",
      aria: "Piezas sueltas se colocan y se conectan en un solo tablero de trabajo.",
    },
    memo: {
      tag: "se lee antes de confiar en ello",
      aria:
        "Una lectura se compara contra una línea base medida y se asienta en un resultado escrito.",
      signalIn: "SUS NÚMEROS",
      measured: "MEDIDO",
      checking: "diez días hábiles",
      verified: "el informe, por escrito",
      reading: "lectura",
      foot: "qué es cierto y qué construir primero",
    },
  },
  diagnostic: {
    desc: "Diez días hábiles sobre su sitio, sus anuncios y su operación. Un informe escrito: qué es cierto, qué está roto y qué construir primero.",
    doors: "Escríbanos por WhatsApp, agende una llamada o mande el formulario. Los tres llegan a la persona que hace el trabajo.",
  },
};

export type HomeDict = typeof en;
export const home: Dict<HomeDict> = { en, es };
