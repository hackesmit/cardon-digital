import type { Dict } from "./rich";

/**
 * Software and automation service page copy (/software). Spanish authoritative.
 *
 * The only figure on this page is Monte Xanic's own (about an hour of finance
 * work, about two minutes now), hedged the way lib/i18n/monte-xanic.ts hedges
 * it. Module prices live on /precios and are never typed here. `vis.ops` feeds
 * FlowCompress, the operations visual recovered from git
 * (1fcb7e7^:components/pages/home/OpsCompression.tsx); its keys keep the shape
 * that visual was written against.
 */

const en = {
  meta: {
    title: "Software and automation",
    description:
      "The repetitive work runs itself: one record, reports that build themselves, the books current every morning. Built around how you already work, and you own it.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Software and automation",
    title: "The repetitive work, done by itself.",
    titleAccent: "And the system is yours.",
    sub: "We build the system your business runs on: the record is written once, where the work happens, the reports build themselves and the books are current every morning. Proven in Valle wineries, built around how your team works.",
    proof: "Monte Xanic: about an hour of finance work, now about two minutes.",
  },
  gets: {
    kicker: "What you end up with",
    title: "Less typing, one record, and the keys in your hand.",
    items: [
      {
        h: "The hours come back.",
        body: "What somebody rebuilt by hand every week runs on its own: reports, reconciliations, the view of the day.",
      },
      {
        h: "One record.",
        body: "Harvest, bookings, orders, invoices and the books stop living in ten places that never agree.",
      },
      {
        h: "Answers from your own data.",
        body: "An assistant that answers in plain words from your record and shows where each figure came from. When there is no record, it says so.",
      },
      {
        h: "Yours, keys and all.",
        body: "Code, data and accounts in your name. If the service stops, the system keeps running.",
      },
    ],
  },
  /** The three frames between the results and the modules, each captioned with its result. */
  media: {
    chartsCap: "The season's numbers, read in the cellar where they were written.",
    chartsAlt: "A laptop in the barrel cellar with the season's bar charts on screen",
    laptopCap: "The harvest curve, current the morning after the last reading.",
    laptopAlt: "A laptop on a barrel with the harvest curve on screen",
    phoneCap: "The same record on the phone your team already carries.",
    phoneAlt: "A phone held at the barrel with the curve on screen",
  },
  modules: {
    kicker: "The three modules",
    title: "Start with the part of the operation that hurts most.",
    sub: "Each module is bought on its own or combined, and each has a published entry price.",
    items: [
      {
        id: "produccion",
        name: "Produccion",
        title: "Know what you grew, made and sold.",
        body: "Every lot dated and attributed, from the block to the bottle, with vintages you can set side by side.",
      },
      {
        id: "hospitalidad",
        name: "Hospitalidad",
        title: "Fill the rooms two calendars left empty.",
        body: "Every booking from every channel in one calendar, and the guest remembered between stays.",
      },
      {
        id: "restaurante",
        name: "Restaurante",
        title: "Close the day with the cash already counted.",
        body: "The order starts on the waiter's phone and ends in the cash cut.",
      },
    ],
    demo: "Open the demo",
    more: "See module pricing",
    other: "Another line of business? The diagnostic says which part of your operation can run itself, and what it costs.",
  },
  proof: {
    kicker: "Case study",
    title: "An hour of finance work, about two minutes now.",
    body: "The harvest lived in a production system, spreadsheets and a field notebook, and someone assembled the picture by hand. Now Monte Xanic opens one live view of the season. At Vinedo En'kanto, production, the restaurant and the bookings run on one system, with a store in front of it.",
    readXanic: "Read the Monte Xanic case",
    readEnkanto: "Read the En'kanto case",
  },
  how: {
    kicker: "How it works",
    title: "From the first session to a system your team runs.",
    steps: [
      { k: "01", body: "The diagnostic, at no cost. Ten business days and a written memo that is yours." },
      { k: "02", body: "The build. A fixed price per module, agreed before anyone starts." },
      { k: "03", body: "The handover. Your team trained, the accounts in your name, and a call every week while the service runs." },
    ],
  },
  familiar: {
    kicker: "Objections",
    title: "Sound familiar?",
    items: [
      {
        q: "My team will never take up another system.",
        a: "The record is written once, where the work already happens, from the phone they carry.",
      },
      {
        q: "I paid for software once and it left with the agency.",
        a: "The code, the data and the keys are yours from the first day, and they stay yours.",
      },
      {
        q: "What happens if I stop the service?",
        a: "The system keeps running in your accounts, with your data. We hand it over documented, with your team trained.",
      },
    ],
  },
  diagDesc:
    "Ten business days on your operation, your site and your ads, and a written memo that is yours: what is true, what is broken, what to build first.",
  vis: {
    ops: {
      tag: "Monte Xanic: about an hour of finance work, now about two minutes",
      aria: "At Monte Xanic, about an hour of finance work compresses into one short clean automated pass of about two minutes, about 97 percent less time, refreshed through the day.",
      manual: "BY HAND, EVERY WEEK",
      auto: "AUTOMATED, RUNS ITSELF",
      badge: "about 97% less time",
      long: "about 1 hr",
      short: "about 2 min",
      unit: "min",
      foot: "REFRESHED THROUGH THE DAY",
    },
  },
};

const es: typeof en = {
  meta: {
    title: "Software y automatización",
    description:
      "El trabajo repetitivo se hace solo: un registro único, reportes automáticos y las cuentas al corriente cada mañana. A la medida de cómo trabaja su equipo, y el sistema es suyo.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Software y automatización",
    title: "El trabajo repetitivo se hace solo.",
    titleAccent: "Y el sistema es suyo.",
    sub: "Desarrollamos el sistema con el que opera su negocio: todo se registra una sola vez, ahí donde se hace el trabajo, los reportes se arman solos y las cuentas amanecen al corriente. Probado en bodegas del Valle y hecho a la medida de cómo trabaja su equipo.",
    proof: "Monte Xanic: una hora de trabajo financiero, hoy unos dos minutos.",
  },
  gets: {
    kicker: "Lo que obtiene",
    title: "Menos captura, un solo registro y los accesos en sus manos.",
    items: [
      {
        h: "Su equipo recupera horas.",
        body: "Lo que alguien rehacía a mano cada semana ahora se hace solo: reportes, conciliaciones, el resumen del día.",
      },
      {
        h: "Un solo registro.",
        body: "Cosecha, reservaciones, comandas, facturas y cuentas dejan de estar repartidas en diez lugares que nunca cuadran entre sí.",
      },
      {
        h: "Respuestas con sus propios datos.",
        body: "Un asistente que contesta en palabras sencillas a partir de su registro y le muestra de dónde salió cada cifra. Cuando no hay dato, lo dice.",
      },
      {
        h: "Suyo, con todo y accesos.",
        body: "Código, datos y cuentas a su nombre. Si el servicio termina, el sistema sigue funcionando.",
      },
    ],
  },
  media: {
    chartsCap: "Los números de la temporada, consultados en la cava donde se anotaron.",
    chartsAlt: "Una laptop en la cava de barricas con las gráficas de la temporada en pantalla",
    laptopCap: "La curva de la cosecha, al día la mañana siguiente a la última lectura.",
    laptopAlt: "Una laptop sobre una barrica con la curva de la cosecha en pantalla",
    phoneCap: "El mismo registro en el teléfono que su gente ya trae.",
    phoneAlt: "Un teléfono en la mano, junto a la barrica, con la curva en pantalla",
  },
  modules: {
    kicker: "Los tres módulos",
    title: "Empiece por la parte de la operación que más le duele.",
    sub: "Cada módulo se contrata solo o combinado, y cada uno tiene publicado su precio de entrada.",
    items: [
      {
        id: "produccion",
        name: "Producción",
        title: "Sepa qué cosechó, qué elaboró y qué vendió.",
        body: "Cada lote con fecha y responsable, del cuadro a la botella, y añadas comparables entre sí.",
      },
      {
        id: "hospitalidad",
        name: "Hospitalidad",
        title: "Llene las habitaciones que dos calendarios dejaban vacías.",
        body: "Las reservaciones de todos los canales en un solo calendario, y cada huésped reconocido cuando regresa.",
      },
      {
        id: "restaurante",
        name: "Restaurante",
        title: "Cierre el día con el efectivo ya contado.",
        body: "La comanda nace en el teléfono del mesero y termina en el corte de caja.",
      },
    ],
    demo: "Abrir el demo",
    more: "Ver los precios de los módulos",
    other: "¿Otro giro? El diagnóstico le dice qué parte de su operación se puede automatizar y cuánto cuesta.",
  },
  proof: {
    kicker: "Caso de estudio",
    title: "Una hora de trabajo financiero, hoy unos dos minutos.",
    body: "La cosecha estaba repartida entre un sistema de producción, hojas de cálculo y una libreta de campo, y alguien armaba el panorama a mano. Hoy Monte Xanic ve la temporada al día en una sola pantalla. En Viñedo En'kanto, la producción, el restaurante y las reservaciones se llevan en un solo sistema, con su tienda en línea.",
    readXanic: "Ver el caso de Monte Xanic",
    readEnkanto: "Ver el caso de En'kanto",
  },
  how: {
    kicker: "Cómo funciona",
    title: "De la primera sesión al sistema que maneja su equipo.",
    steps: [
      { k: "01", body: "El diagnóstico, sin costo. Diez días hábiles y un informe por escrito que es suyo." },
      { k: "02", body: "El desarrollo. Precio fijo por módulo, acordado antes de empezar." },
      { k: "03", body: "La entrega. Su equipo capacitado, las cuentas a su nombre y una llamada cada semana mientras dure el servicio." },
    ],
  },
  familiar: {
    kicker: "Objeciones",
    title: "¿Le suena?",
    items: [
      {
        q: "Mi gente nunca va a usar otro sistema.",
        a: "Todo se registra una sola vez, ahí donde se hace el trabajo, desde el teléfono que ya traen.",
      },
      {
        q: "Ya pagué un software y la agencia se quedó con él.",
        a: "El código, los datos y los accesos son suyos desde el primer día, y suyos se quedan.",
      },
      {
        q: "¿Qué pasa si dejo el servicio?",
        a: "El sistema sigue funcionando en sus cuentas, con sus datos. Se lo entregamos documentado y con su equipo capacitado.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles para revisar la operación, el sitio y los anuncios de su negocio, y un informe por escrito que es suyo: qué funciona, qué falla y por dónde empezar.",
  vis: {
    ops: {
      tag: "Monte Xanic: de una hora de trabajo financiero a unos dos minutos",
      aria: "En Monte Xanic, cerca de una hora de trabajo financiero se comprime en un solo paso automático y limpio de unos dos minutos, casi 97 por ciento menos tiempo, y se actualiza durante el día.",
      manual: "A MANO, CADA SEMANA",
      auto: "AUTOMATIZADO, SE HACE SOLO",
      badge: "97% menos tiempo",
      long: "1 hora",
      short: "2 min",
      unit: "min",
      foot: "SE ACTUALIZA DURANTE EL DÍA",
    },
  },
};

export type SoftwareDict = typeof en;
export const software: Dict<SoftwareDict> = { en, es };
