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
      "El trabajo repetitivo se hace solo: un solo registro, reportes que se arman solos y las cuentas al corriente cada mañana. Hecho alrededor de cómo ya trabaja, y es suyo.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Software y automatización",
    title: "El trabajo repetitivo, hecho solo.",
    titleAccent: "Y el sistema es suyo.",
    sub: "Construimos el sistema con el que opera su negocio: el registro se anota una vez, donde ya se hace el trabajo, los reportes se arman solos y las cuentas amanecen al corriente. Probado en bodegas del Valle, hecho alrededor de cómo trabaja su equipo.",
    proof: "Monte Xanic: una hora de trabajo financiero, hoy como dos minutos.",
  },
  gets: {
    kicker: "Lo que se lleva",
    title: "Menos captura, un solo registro, y las llaves en su mano.",
    items: [
      {
        h: "Las horas regresan.",
        body: "Lo que alguien rehacía a mano cada semana corre solo: reportes, conciliaciones, la vista del día.",
      },
      {
        h: "Un solo registro.",
        body: "Cosecha, reservas, comandas, facturas y cuentas dejan de vivir en diez lugares que nunca se ponen de acuerdo.",
      },
      {
        h: "Respuestas de sus propios datos.",
        body: "Un asistente que contesta en lenguaje claro desde su registro y le muestra de dónde salió cada dato. Cuando no hay dato, lo dice.",
      },
      {
        h: "Suyo, con llaves y todo.",
        body: "Código, datos y cuentas a su nombre. Si el servicio se detiene, el sistema sigue corriendo.",
      },
    ],
  },
  modules: {
    kicker: "Los tres módulos",
    title: "Empiece por la parte de la operación que más le duele.",
    sub: "Cada módulo se compra solo o combinado, y cada uno tiene su precio de entrada publicado.",
    items: [
      {
        id: "produccion",
        name: "Producción",
        title: "Sepa qué cosechó, qué hizo y qué vendió.",
        body: "Cada lote fechado y atribuido, del cuadro a la botella, con las añadas comparables entre sí.",
      },
      {
        id: "hospitalidad",
        name: "Hospitalidad",
        title: "Llene los cuartos que dos calendarios dejaron vacíos.",
        body: "Cada reserva de cada canal en un solo calendario, y el huésped recordado entre visitas.",
      },
      {
        id: "restaurante",
        name: "Restaurante",
        title: "Cierre el día con el efectivo ya contado.",
        body: "La comanda nace en el teléfono del mesero y termina en el corte.",
      },
    ],
    demo: "Abrir el demo",
    more: "Ver los precios de los módulos",
    other: "¿Otro giro? El diagnóstico dice qué parte de su operación puede correr sola, y cuánto cuesta.",
  },
  proof: {
    kicker: "Caso de estudio",
    title: "Una hora de trabajo financiero, hoy como dos minutos.",
    body: "La cosecha vivía en un sistema de producción, en hojas de cálculo y en una libreta de campo, y alguien armaba la foto a mano. Hoy Monte Xanic abre una sola vista viva de la temporada. En Viñedo En'kanto, la producción, el restaurante y las reservas corren en un sistema, con una tienda enfrente.",
    readXanic: "Ver el caso de Monte Xanic",
    readEnkanto: "Ver el caso de En'kanto",
  },
  how: {
    kicker: "Cómo funciona",
    title: "De la primera sesión al sistema que opera su equipo.",
    steps: [
      { k: "01", body: "El diagnóstico, sin costo. Diez días hábiles y un informe escrito que es suyo." },
      { k: "02", body: "La construcción. Precio fijo por módulo, acordado antes de empezar." },
      { k: "03", body: "La entrega. Su equipo entrenado, las cuentas a su nombre, y una llamada cada semana mientras dura el servicio." },
    ],
  },
  familiar: {
    kicker: "Objeciones",
    title: "¿Le suena?",
    items: [
      {
        q: "Mi gente nunca va a usar otro sistema.",
        a: "El registro se anota una sola vez, donde ya se hace el trabajo, desde el teléfono que traen.",
      },
      {
        q: "Ya pagué un software y se fue con la agencia.",
        a: "El código, los datos y los accesos son suyos desde el primer día, y suyos se quedan.",
      },
      {
        q: "¿Qué pasa si dejo el servicio?",
        a: "El sistema sigue corriendo en sus cuentas, con sus datos. Se lo entregamos documentado y con su equipo entrenado.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles sobre su operación, su sitio y sus anuncios, y un informe escrito que es suyo: qué es cierto, qué está roto y qué construir primero.",
  vis: {
    ops: {
      tag: "Monte Xanic: como una hora de trabajo financiero, hoy como dos minutos",
      aria: "En Monte Xanic, como una hora de trabajo financiero se comprime en un solo paso automático y limpio de como dos minutos, como 97 por ciento menos tiempo, y se actualiza durante el día.",
      manual: "A MANO, CADA SEMANA",
      auto: "AUTOMATIZADO, CORRE SOLO",
      badge: "como 97% menos tiempo",
      long: "como 1 hora",
      short: "como 2 min",
      unit: "min",
      foot: "SE ACTUALIZA DURANTE EL DÍA",
    },
  },
};

export type SoftwareDict = typeof en;
export const software: Dict<SoftwareDict> = { en, es };
