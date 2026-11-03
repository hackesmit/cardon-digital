import type { Dict } from "./rich";

/** A photograph's caption (the result) and its alt text (the frame). */
type HomePhoto = { cap: string; alt: string };

/**
 * Home page copy.
 *
 * The architecture is the arc of 2026-09-28 (bunker research/2026-09/
 * site-arc-digital-onboarding.md section 4), refocused by bead hq-3f6ut.3
 * (Daniel, 2026-11-03) when the wine software left for its own brand: hero,
 * proof bar, the services (websites, Google Ads, AI answers, custom software),
 * the objections, one system, how it works, compare, pricing summary,
 * diagnostic. Three results in one order: you get found, you connect with
 * your clients, the work runs itself. No module or winery copy lives here;
 * the one line that sends a winery to the wine brand is `wine.lead`, and the
 * brand's name beside it is read from lib/brand.ts.
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
    title: "Websites, ads and software in Ensenada | Cardon Digital",
    description:
      "Cardon Digital builds websites, runs Google Ads and builds custom software for owner-run businesses in Ensenada and Baja California, with sites ready for ChatGPT and Google to cite. Prices published, a free diagnostic, and everything we build stays in your name.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Ensenada, Baja California",
    title: "Websites, ads and software",
    titleAccent: "for businesses that want more clients and less work.",
    sub: "Cardon Digital builds sites people find on Google and ChatGPT can cite, Google Ads that bring new clients, and custom software that does your team's repetitive work. For owner-run businesses in Baja California, and everything we build stays in your name.",
    risk: "Start with a free diagnostic. The memo is yours whether we build or not.",
    proofLine: "Latest builds: Monte Xanic, Viñedo En'kanto and Aperta Media Co.",
  },
  clientsAria: "Businesses we have worked with",
  proof: {
    aria: "Some of the businesses we have built for",
    items: [
      {
        name: "Monte Xanic",
        place: "Finance, automated",
        result: "An hour of finance work, now about two minutes",
      },
      {
        name: "Aperta Media Co.",
        place: "Photo and video studio",
        result: "A website with their packages, a quote calculator and an editor they update themselves",
      },
    ],
  },
  services: {
    kicker: "What we do",
    title: "Four ways to grow, starting with the one that is urgent.",
    fromLabel: "from",
    adsLine: "a month plus {perContact} per contact, never more than {cap}",
    softLine: "a fixed price, agreed after the diagnostic",
    aiLine: "the check is part of the free diagnostic",
    items: [
      {
        id: "sitios",
        name: "Website",
        title: "People find you on Google and believe you.",
        body: "A site that loads fast, works on phone and desktop, and connects you with the people looking for you. Built so Google and ChatGPT can read it and cite it in their answers. Designed for your business, copy included.",
        cta: "See websites",
      },
      {
        id: "anuncios",
        name: "Google Ads",
        title: "New clients who were already searching, measured.",
        body: "Campaigns for the people already searching for what you sell. A small base plus a capped fee per contact, so most of what we earn depends on the contacts that come, and your budget goes straight to Google.",
        cta: "See ads",
      },
      {
        id: "software",
        name: "Custom software",
        title: "The repetitive work runs itself.",
        body: "A system built around how your team already works, whatever you sell: the record is written once, the reports build themselves, and the books are current every morning.",
        cta: "See custom software",
      },
      {
        id: "ia",
        name: "AI answers",
        title: "Know what ChatGPT and Google say about your business.",
        body: "We check whether your business comes up when customers ask ChatGPT, Perplexity, Gemini and Google, and how each answer describes it. Where something is missing, we fix your site so these engines can read it and cite it.",
        cta: "See how the check works",
      },
    ],
    arcLine: "Each one works on its own. Together, your business is in the digital era end to end: you get found, you connect with your clients, and the work runs itself.",
  },
  /** The one line that sends a winery to the wine brand; the brand name is read from lib/brand.ts. */
  wine: {
    lead: "Software for wineries:",
  },
  /** The photographs on the service cards that carry one. */
  photos: {
    "home/service-sitios": { cap: "A site that works on any screen and leads to a message.", alt: "A phone in hand outdoors, open on a site we built" },
    "home/service-anuncios": { cap: "The client who was searching calls or writes on WhatsApp, and gets counted.", alt: "A shop owner takes a call while she boxes an order at the counter" },
    "home/service-software": { cap: "The record is written once, where the work happens.", alt: "A tablet with the day's board, at work" },
  } as Record<string, HomePhoto>,
  familiar: {
    kicker: "Objections",
    title: "Sound familiar?",
    items: [
      {
        q: "I have a website, but nobody contacts me through it.",
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
  system: {
    kicker: "One system",
    title: "Stop arguing about which spreadsheet is right.",
    body: "Sales, orders, appointments, invoices and messages go in once and come out as one board that keeps itself current. That is what custom software builds for your business.",
    more: "See custom software",
  },
  how: {
    kicker: "How it works",
    title: "From the first message to a system your team runs.",
    steps: [
      { k: "01", body: "The diagnostic, at no cost. Ten business days and a written memo that is yours." },
      { k: "02", body: "The build. A fixed price, agreed before anyone starts." },
      { k: "03", body: "The handover. Your team trained, the accounts and the keys in your name." },
    ],
    anywhere: "You can start with any one: a site, a campaign or a system. The diagnostic says which one first.",
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
      { dim: "Fee", cardon: "Agreed up front, and ads paid per contact", usual: "A percentage, or per seat" },
      { dim: "Measurement", cardon: "From the click to the call or the message", usual: "Likes and reach" },
      { dim: "Who answers", cardon: "The team that built it", usual: "A ticket queue" },
      { dim: "Fit", cardon: "Built around how you work", usual: "Your work bent to the tool" },
      { dim: "Answers", cardon: "An assistant that reads your records", usual: "Generic features" },
    ],
  },
  pricing: {
    kicker: "What it costs",
    title: "A site, a campaign or custom software, and what each costs to start.",
    sub: "The final quote comes out of the diagnostic.",
    siteK: "Website",
    adsK: "Google Ads",
    softK: "Custom software",
    fromLabel: "from",
    adsLine: "a month plus {perContact} per contact, never more than {cap}",
    softLine: "a fixed price, agreed after the diagnostic",
    more: "See every price",
    foot: [
      {
        k: "Ads",
        body: "Your ad budget is paid by you straight to Google, never through us.",
      },
      {
        k: "Terms",
        body: "The build is paid half to start and half on delivery.",
      },
    ],
  },
  vis: {
    arc: {
      tagBefore: "a business run by hand",
      tagMid: "goes digital",
      captionRun: "connecting",
      captionDone: "in the digital era",
      aria: "A business goes digital in three acts: its website assembles on a phone and comes up first in a search, the people searching for it arrive as messages, and each message becomes a row in one system that keeps itself current.",
      fallback: "Your site comes up first, the people searching connect with you, and every message arrives in one system that runs itself.",
      stages: [
        { k: "01", label: "Get found" },
        { k: "02", label: "Connect with your clients" },
        { k: "03", label: "The work runs itself" },
      ],
      query: "plumber in ensenada",
      siteName: "Your business",
      siteLine: "What you sell, for whom",
      siteCta: "Message us",
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
        "Notebooks, spreadsheets, invoices and messages settle into clean rows around one panel the business owns.",
      panelTitle: "One system",
      panelSummary: "SUMMARY",
      docs: [
        { name: "sales.xlsx", tag: "XLSX" },
        { name: "stock.csv", tag: "CSV" },
        { name: "orders.xlsx", tag: "XLSX" },
        { name: "invoice.pdf", tag: "PDF" },
        { name: "notebook", tag: "NOTES" },
        { name: "whatsapp", tag: "MSG" },
      ],
      rows: [
        { k: "SALES", v: "live" },
        { k: "ORDERS", v: "dated" },
        { k: "STOCK", v: "current" },
        { k: "CALENDAR", v: "synced" },
        { k: "SERVICE", v: "counted" },
        { k: "FINANCE", v: "current" },
      ],
    },
    logos: {
      aria: "Some of the businesses we have built for",
      legend: "Our clients",
      clients: {
        xanic: { name: "Monte Xanic", kind: "Winery" },
        enkanto: { name: "Viñedo En'kanto", kind: "Winery and cabins" },
        aperta: { name: "Aperta Media Co.", kind: "Photo and video studio" },
        dharma: { name: "Dharma Ochoa", kind: "Artist" },
        brighter: { name: "BrighterHire", kind: "Recruiting" },
        rlog: { name: "RLogistics", kind: "Logistics" },
      },
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
    doors: "Write on WhatsApp, book a call or send the form.",
  },
};

const es: typeof en = {
  meta: {
    title: "Sitios web, anuncios y software en Ensenada | Cardon",
    description:
      "Cardon Digital hace sitios web, anuncios en Google y software a la medida para negocios en Ensenada y Baja California, con sitios listos para que ChatGPT y Google los citen. Precios publicados en pesos, un diagnóstico sin costo, y todo lo que construimos queda a su nombre.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Ensenada, Baja California",
    title: "Sitios web, anuncios y software",
    titleAccent: "para negocios que quieren más clientes y menos trabajo.",
    sub: "Cardon Digital hace sitios web que la gente encuentra en Google y que ChatGPT puede citar, anuncios en Google que le traen clientes nuevos y software a la medida que le quita a su equipo el trabajo repetitivo. Para negocios de Baja California con el dueño al frente, y todo queda a su nombre.",
    risk: "Empiece con un diagnóstico sin costo. El informe es suyo, nos contrate o no.",
    proofLine: "Proyectos recientes: Monte Xanic, Viñedo En'kanto y Aperta Media Co.",
  },
  clientsAria: "Empresas con las que hemos trabajado",
  proof: {
    aria: "Algunos de los negocios para los que trabajamos",
    items: [
      {
        name: "Monte Xanic",
        place: "Finanzas automatizadas",
        result: "Una hora de trabajo en finanzas que hoy toma unos dos minutos",
      },
      {
        name: "Aperta Media Co.",
        place: "Estudio de foto y video",
        result: "Sitio con sus paquetes, un cotizador y un editor para que ellos mismos lo actualicen",
      },
    ],
  },
  services: {
    kicker: "Lo que hacemos",
    title: "Cuatro formas de crecer, empezando por la que más le urge.",
    fromLabel: "desde",
    adsLine: "al mes más {perContact} por contacto, nunca más de {cap}",
    softLine: "precio fijo, acordado después del diagnóstico",
    aiLine: "la revisión va incluida en el diagnóstico sin costo",
    items: [
      {
        id: "sitios",
        name: "Sitio web",
        title: "La gente lo encuentra en Google y le cree.",
        body: "Un sitio que carga rápido, se ve bien en teléfono y en computadora, y lo conecta con la gente que lo está buscando. Hecho para que Google y ChatGPT lo puedan leer y citar en sus respuestas. Diseñado para su negocio, con los textos incluidos.",
        cta: "Ver sitios web",
      },
      {
        id: "anuncios",
        name: "Anuncios en Google",
        title: "Clientes nuevos que ya lo buscaban, medidos.",
        body: "Campañas para la gente que ya está buscando lo que usted vende. Una base pequeña más un pago por contacto con tope, así que la mayor parte de lo que cobramos depende de los contactos que lleguen, y su presupuesto va directo a Google.",
        cta: "Ver anuncios",
      },
      {
        id: "software",
        name: "Software a la medida",
        title: "El trabajo repetitivo se hace solo.",
        body: "Un sistema hecho a la medida de cómo trabaja su equipo, sea cual sea su giro: todo se registra una sola vez, los reportes se arman solos y las cuentas amanecen al corriente.",
        cta: "Ver software a la medida",
      },
      {
        id: "ia",
        name: "Respuestas de IA",
        title: "Sepa qué dicen ChatGPT y Google de su negocio.",
        body: "Revisamos si su negocio sale cuando sus clientes le preguntan a ChatGPT, Perplexity, Gemini y Google, y cómo lo describe cada respuesta. Si falta algo, arreglamos su sitio para que estos motores lo puedan leer y citar.",
        cta: "Ver cómo se revisa",
      },
    ],
    arcLine: "Cada uno funciona por sí solo. Juntos, su negocio entra a la era digital de principio a fin: lo encuentran, le escriben y el trabajo se hace solo.",
  },
  wine: {
    lead: "Software para vinícolas:",
  },
  photos: {
    "home/service-sitios": { cap: "Un sitio que se ve bien en cualquier pantalla y termina en un mensaje.", alt: "Un teléfono en la mano, al aire libre, con un sitio que construimos" },
    "home/service-anuncios": { cap: "El cliente que lo buscaba llama o escribe por WhatsApp y queda registrado.", alt: "Una dueña contesta una llamada mientras empaca un pedido en el mostrador" },
    "home/service-software": { cap: "Cada dato se registra una sola vez, ahí donde se hace el trabajo.", alt: "Una tableta en uso, con el tablero del día" },
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
        a: "Cada peso se mide hasta la llamada o el mensaje que generó, y el reporte es suyo.",
      },
      {
        q: "Mi gente nunca va a usar otro sistema.",
        a: "Cada dato se anota una sola vez, desde el teléfono, ahí donde ya se hace el trabajo.",
      },
      {
        q: "Me da miedo depender de una agencia.",
        a: "Dominio, cuentas, código y datos quedan a su nombre desde el primer día.",
      },
    ],
  },
  system: {
    kicker: "Un solo sistema",
    title: "Deje de discutir cuál hoja de cálculo es la buena.",
    body: "Ventas, pedidos, citas, facturas y mensajes se registran una sola vez y quedan en un tablero que se mantiene al corriente solo. Eso es lo que el software a la medida hace por su negocio.",
    more: "Ver software a la medida",
  },
  how: {
    kicker: "Cómo funciona",
    title: "Del primer mensaje al sistema con el que trabaja su equipo.",
    steps: [
      { k: "01", body: "El diagnóstico, sin costo. Diez días hábiles y un informe por escrito que se queda con usted." },
      { k: "02", body: "El desarrollo. Precio fijo, acordado antes de empezar." },
      { k: "03", body: "La entrega. Su equipo capacitado, y las cuentas y los accesos a su nombre." },
    ],
    anywhere: "Puede empezar por el que usted quiera: un sitio, una campaña o un sistema. El diagnóstico dice cuál le conviene primero.",
  },
  compare: {
    kicker: "Comparación",
    title: "Con qué se queda cuando terminamos.",
    cardon: "Cardon",
    usual: "Lo de siempre",
    yesSr: "Cardon: sí",
    noSr: "Lo de siempre: no",
    rows: [
      { dim: "Propiedad", cardon: "Suyo, con todos los accesos", usual: "Rentado para siempre" },
      { dim: "Cuota", cardon: "Acordada de antemano, y los anuncios por contacto", usual: "Un porcentaje, o por usuario" },
      { dim: "Medición", cardon: "Del clic a la llamada o al mensaje", usual: "Likes y alcance" },
      { dim: "Quién contesta", cardon: "El equipo que lo hizo", usual: "Un ticket de soporte" },
      { dim: "Adaptación", cardon: "Se adapta a su forma de trabajar", usual: "Usted se adapta al programa" },
      { dim: "Respuestas", cardon: "Un asistente que lee sus registros", usual: "Funciones genéricas" },
    ],
  },
  pricing: {
    kicker: "Lo que cuesta",
    title: "Un sitio, una campaña o software a la medida, y lo que cuesta cada uno para empezar.",
    sub: "La cotización final sale del diagnóstico.",
    siteK: "Sitio web",
    adsK: "Anuncios en Google",
    softK: "Software a la medida",
    fromLabel: "desde",
    adsLine: "al mes más {perContact} por contacto, nunca más de {cap}",
    softLine: "precio fijo, acordado después del diagnóstico",
    more: "Ver todos los precios",
    foot: [
      {
        k: "Anuncios",
        body: "Su presupuesto de anuncios lo paga usted directo a Google, nunca a través de nosotros.",
      },
      {
        k: "Condiciones",
        body: "El desarrollo se paga la mitad al empezar y la mitad contra entrega.",
      },
    ],
  },
  vis: {
    arc: {
      tagBefore: "un negocio a mano",
      tagMid: "se pasa a lo digital",
      captionRun: "conectando",
      captionDone: "en la era digital",
      aria: "Un negocio se pasa a lo digital en tres actos: su sitio se arma en un teléfono y sale primero en una búsqueda, la gente que lo buscaba le escribe, y cada mensaje queda como un renglón en un solo sistema que se mantiene al corriente solo.",
      fallback: "Su sitio sale primero, la gente que lo busca le escribe, y cada mensaje queda en un mismo sistema que trabaja solo.",
      stages: [
        { k: "01", label: "Lo encuentran" },
        { k: "02", label: "Le escriben" },
        { k: "03", label: "El trabajo se hace solo" },
      ],
      query: "plomero en ensenada",
      siteName: "Su negocio",
      siteLine: "Qué vende y para quién",
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
      tagMid: "sale un tablero",
      connecting: "conectando",
      oneSystem: "un solo sistema",
      fallback:
        "Libretas, hojas de cálculo, facturas y mensajes se ordenan en renglones limpios alrededor de un tablero que le pertenece al negocio.",
      panelTitle: "Un solo sistema",
      panelSummary: "RESUMEN",
      docs: [
        { name: "ventas.xlsx", tag: "XLSX" },
        { name: "inventario.csv", tag: "CSV" },
        { name: "pedidos.xlsx", tag: "XLSX" },
        { name: "factura.pdf", tag: "PDF" },
        { name: "libreta", tag: "NOTAS" },
        { name: "whatsapp", tag: "MSG" },
      ],
      rows: [
        { k: "VENTAS", v: "al día" },
        { k: "PEDIDOS", v: "fechados" },
        { k: "ALMACÉN", v: "al corriente" },
        { k: "CITAS", v: "juntas" },
        { k: "SERVICIO", v: "medido" },
        { k: "FINANZAS", v: "al corriente" },
      ],
    },
    logos: {
      aria: "Algunos de los negocios para los que trabajamos",
      legend: "Nuestros clientes",
      clients: {
        xanic: { name: "Monte Xanic", kind: "Bodega" },
        enkanto: { name: "Viñedo En'kanto", kind: "Bodega y cabañas" },
        aperta: { name: "Aperta Media Co.", kind: "Estudio de foto y video" },
        dharma: { name: "Dharma Ochoa", kind: "Artista" },
        brighter: { name: "BrighterHire", kind: "Reclutamiento" },
        rlog: { name: "RLogistics", kind: "Logística" },
      },
    },
    board: {
      tag: "tres partes, un solo tablero",
      aria: "Piezas sueltas se acomodan y se conectan en un solo tablero que funciona.",
    },
    memo: {
      tag: "primero se revisa, luego se confía",
      aria:
        "Una lectura se compara con una línea base ya medida y queda en un resultado por escrito.",
      signalIn: "SUS NÚMEROS",
      measured: "MEDIDO",
      checking: "diez días hábiles",
      verified: "el informe, por escrito",
      reading: "lectura",
      foot: "qué funciona y por dónde empezar",
    },
  },
  diagnostic: {
    desc: "Diez días hábiles para revisar su sitio, sus anuncios y la operación del negocio. Al final, un informe por escrito: qué funciona, qué falla y por dónde empezar.",
    doors: "Escríbanos por WhatsApp, agende una llamada o mande el formulario.",
  },
};

export type HomeDict = typeof en;
export const home: Dict<HomeDict> = { en, es };
