import type { Dict } from "./rich";

/**
 * Home page copy.
 *
 * The architecture is docs/copy-doctrine.md section 4: hero, proof bar, the
 * Monte Xanic case, the objections, what you get, how it works, compare,
 * pricing, diagnostic. Monte Xanic leads because it is the strongest asset on
 * the site and it used to sit in section six inside a map.
 *
 * Two rules this file is read against, and both are easy to break by accident:
 * every claim is the result the owner ends up with rather than the software we
 * write, and the only figure published here is Monte Xanic's own (about an
 * hour of finance work, about two minutes now, about 97 percent less), which
 * lib/i18n/monte-xanic.ts already carries with its basis. No other number is
 * ours to print.
 *
 * Spanish is written for a Valle winemaker and is the authoritative version.
 * English is written for a US owner. Neither is a translation of the other.
 *
 * The primary call to action is site.ts `diag.cta`, used verbatim everywhere
 * it appears, so the page repeats one action rather than four phrasings of it.
 */

const en = {
  meta: {
    title: "Cardon Digital | Your harvest and your books, current every morning",
    description:
      "Monte Xanic went from about an hour of finance work by hand to about two minutes. We build the system a Valle winery runs on and owns.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Wineries, Valle de Guadalupe and Ensenada",
    title: "Your harvest and your books,",
    titleAccent: "current every morning.",
    sub: "Monte Xanic spent about an hour assembling one financial view by hand. It takes about two minutes now, refreshed through the day. We build that for your winery, and you keep it.",
    risk: "The diagnostic is free and the memo is yours either way.",
  },
  proof: {
    aria: "Wineries already built for",
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
        result: "Store, restaurant and rooms on one system, built",
      },
    ],
  },
  xanic: {
    kicker: "Case study",
    title: "An hour of finance work, about two minutes now.",
    body: "The harvest lived in a production system, spreadsheets and a field notebook, and someone assembled the picture by hand. Now Monte Xanic opens one live view of the season, tied to its own vineyard sections.",
    stats: [
      { n: "About 1 hour", k: "before, by hand" },
      { n: "About 2 minutes", k: "now, refreshed through the day" },
      { n: "About 97 percent less", k: "time on that one view" },
    ],
    basis: "Timed by hand before the build. No Monte Xanic production, sales or financial figures are published.",
    read: "Read the Monte Xanic case",
    cellarCap: "Taken once at the barrel, and the finance view is already current.",
    cellarAlt: "A winemaker taking a reading on a tablet, at the barrel.",
    tankCap: "Written at the tank in seconds, and never copied out again.",
    tankAlt: "A hand writing a tank record on a tablet.",
    play: "Play the clip",
    pause: "Pause the clip",
  },
  familiar: {
    kicker: "Objections",
    title: "Sound familiar?",
    items: [
      {
        q: "The report I get is already a week old.",
        a: "Yours refreshes through the day, so this morning's number is this morning's.",
      },
      {
        q: "My team will never take up another system.",
        a: "The record is written once, where the work happens.",
      },
      {
        q: "I paid for software once and it left with the agency.",
        a: "The code, the data and the keys are yours, and they stay yours.",
      },
    ],
  },
  gets: {
    kicker: "What you get",
    title: "Three parts of the operation, one record.",
    items: [
      {
        name: "Produccion",
        title: "Know what you grew, made and sold",
        body: "Every lot dated and attributed, from the block to the bottle.",
      },
      {
        name: "Hospitalidad",
        title: "Fill the rooms two calendars left empty",
        body: "Every booking from every channel in one calendar.",
      },
      {
        name: "Restaurante",
        title: "Close the day with the cash already counted",
        body: "The order starts on the waiter's phone and ends in the cash cut.",
      },
    ],
    phoneCap: "The same record, written from the vineyard on the phone your team carries.",
    phoneAlt: "A phone in the vineyard with the day's view on screen.",
    more: "See the modules",
  },
  how: {
    kicker: "How it works",
    title: "From first session to a system your team runs.",
    steps: [
      { k: "01", body: "The diagnostic. Ten business days, one written memo." },
      { k: "02", body: "The build. A scoped fixed fee, agreed before anyone starts." },
      { k: "03", body: "The handover. Your team trained, the keys in your hands." },
    ],
  },
  compare: {
    kicker: "Compare",
    title: "What you own when it is finished.",
    cardon: "Cardon",
    usual: "The usual stack",
    yes: "Yes",
    no: "No",
    rows: [
      { dim: "Ownership", cardon: "Yours, keys and all", usual: "Rented forever" },
      { dim: "Fit", cardon: "Built around how you work", usual: "Your work bent to the tool" },
      { dim: "Data", cardon: "One record, yours", usual: "Ten apps that disagree" },
      { dim: "People", cardon: "The same hands", usual: "A ticket queue" },
      { dim: "Price", cardon: "Setup once, then one monthly fee", usual: "Per seat, every month" },
      { dim: "Answers", cardon: "An assistant that reads your records", usual: "Generic features" },
    ],
  },
  pricing: {
    kicker: "What it costs",
    title: "Two fees, and the system is yours.",
    sub: "The setup fee pays for the build, and you own it. The monthly fee pays for running it: hosting, care and corrections.",
    foot: [
      {
        k: "Ads",
        body: "Ad management attaches to Hospitalidad and Restaurante, inside the monthly fee. Your budget goes from you straight to Google.",
      },
      {
        k: "Terms",
        body: "Quoted in pesos, plus IVA. Setup is half on signature and half on acceptance. The signature half can go in three monthly payments.",
      },
    ],
    moreLead: "Every module has a published entry price.",
    more: "See pricing",
    founding: {
      kicker: "Founding winery",
      lead: "**One founding winery, through 31 December 2026: the Produccion module at the mid-size build, for its entry price.**",
      body: "One slot. In exchange: a named case with the real before and after numbers, and two introductions in the Valle.",
    },
  },
  diagnostic: {
    desc: "Ten business days on your ads, your site and your operation. A written memo: what is true, what is broken, what to build first.",
  },
};

const es: typeof en = {
  meta: {
    title: "Cardon Digital | Su cosecha y sus cuentas, al corriente cada mañana",
    description:
      "Monte Xanic pasó de como una hora de trabajo financiero a mano a como dos minutos. Construimos el sistema con el que opera una bodega del Valle, y la bodega se queda con él.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Bodegas del Valle de Guadalupe y Ensenada",
    title: "Su cosecha y sus cuentas,",
    titleAccent: "al corriente cada mañana.",
    sub: "A Monte Xanic le tomaba como una hora armar a mano una vista financiera. Hoy le toma como dos minutos y se actualiza durante el día. Eso construimos para su bodega, y se queda con usted.",
    risk: "El diagnóstico va sin costo y el informe es suyo, construyamos o no.",
  },
  proof: {
    aria: "Bodegas para las que ya construimos",
    read: "Ver el caso",
    items: [
      {
        name: "Monte Xanic",
        place: "Valle de Guadalupe",
        result: "Una hora de trabajo financiero, hoy como dos minutos",
      },
      {
        name: "Viñedo En'kanto",
        place: "San Antonio de las Minas",
        result: "Tienda, restaurante y habitaciones en un sistema, ya construido",
      },
    ],
  },
  xanic: {
    kicker: "Caso de estudio",
    title: "Una hora de trabajo financiero, hoy como dos minutos.",
    body: "La cosecha vivía en un sistema de producción, en hojas de cálculo y en una libreta de campo, y alguien armaba la foto a mano. Hoy Monte Xanic abre una sola vista viva de la temporada, amarrada a sus propios cuadros.",
    stats: [
      { n: "Como 1 hora", k: "antes, a mano" },
      { n: "Como 2 minutos", k: "hoy, actualizados durante el día" },
      { n: "Como 97 por ciento menos", k: "tiempo en esa vista" },
    ],
    basis: "Cronometrado a mano antes de la construcción. Aquí no publicamos cifras de producción, de ventas ni financieras de Monte Xanic.",
    read: "Ver el caso de Monte Xanic",
    cellarCap: "Se toma una vez, en la barrica, y la vista financiera ya quedó al corriente.",
    cellarAlt: "Un enólogo toma una lectura en una tableta, en la barrica.",
    tankCap: "Se anota en el tanque en segundos y nadie lo vuelve a capturar.",
    tankAlt: "Una mano anota el registro de un tanque en una tableta.",
    play: "Reproducir el video",
    pause: "Pausar el video",
  },
  familiar: {
    kicker: "Objeciones",
    title: "¿Le suena?",
    items: [
      {
        q: "El reporte que me llega ya trae una semana encima.",
        a: "El suyo se actualiza durante el día, así que el número de la mañana es de esa mañana.",
      },
      {
        q: "Mi gente nunca va a usar otro sistema.",
        a: "El registro se anota una sola vez, donde ya se hace el trabajo.",
      },
      {
        q: "Ya pagué un software y se fue con la agencia.",
        a: "El código, los datos y los accesos son suyos, y suyos se quedan.",
      },
    ],
  },
  gets: {
    kicker: "Lo que se lleva",
    title: "Tres partes de la operación, un solo registro.",
    items: [
      {
        name: "Producción",
        title: "Sepa qué cultivó, qué elaboró y qué vendió",
        body: "Cada lote fechado y atribuido, del cuartel a la botella.",
      },
      {
        name: "Hospitalidad",
        title: "Llene los cuartos que dos calendarios dejaron vacíos",
        body: "Cada reserva de cada canal en un solo calendario.",
      },
      {
        name: "Restaurante",
        title: "Cierre el día con el efectivo ya contado",
        body: "La comanda nace en el teléfono del mesero y termina en el corte.",
      },
    ],
    phoneCap: "El mismo registro, anotado desde el viñedo en el teléfono que su gente trae.",
    phoneAlt: "Un teléfono en el viñedo con la vista del día en pantalla.",
    more: "Ver los módulos",
  },
  how: {
    kicker: "Cómo funciona",
    title: "De la primera sesión al sistema que opera su equipo.",
    steps: [
      { k: "01", body: "El diagnóstico. Diez días hábiles y un informe escrito." },
      { k: "02", body: "La construcción. Cuota fija con alcance acordado antes de empezar." },
      { k: "03", body: "La entrega. Su equipo entrenado y las llaves en su mano." },
    ],
  },
  compare: {
    kicker: "Comparar",
    title: "Con qué se queda cuando terminamos.",
    cardon: "Cardon",
    usual: "Lo de siempre",
    yes: "Sí",
    no: "No",
    rows: [
      { dim: "Propiedad", cardon: "Suyo, con llaves y todo", usual: "Rentado para siempre" },
      { dim: "Ajuste", cardon: "Hecho alrededor de cómo trabaja", usual: "Su trabajo doblado a la herramienta" },
      { dim: "Datos", cardon: "Un solo registro, suyo", usual: "Diez aplicaciones que se contradicen" },
      { dim: "Personas", cardon: "Siempre las mismas manos", usual: "Una fila de tickets" },
      { dim: "Precio", cardon: "Implementación una vez y una cuota mensual", usual: "Una cuota por usuario, cada mes" },
      { dim: "Respuestas", cardon: "Un asistente que lee sus registros", usual: "Funciones genéricas" },
    ],
  },
  pricing: {
    kicker: "Lo que cuesta",
    title: "Dos cuotas, y el sistema es suyo.",
    sub: "La cuota de implementación paga la construcción, y lo construido queda suyo. La mensual paga operarlo: hospedaje, cuidado y correcciones.",
    foot: [
      {
        k: "Anuncios",
        body: "El manejo de anuncios se agrega a Hospitalidad y Restaurante, dentro de la cuota mensual. Su inversión la paga usted directo a Google.",
      },
      {
        k: "Condiciones",
        body: "Cotizado en pesos, más IVA. La implementación se paga mitad a la firma y mitad a la aceptación. La mitad de la firma puede ir en tres mensualidades.",
      },
    ],
    moreLead: "Cada módulo tiene su precio de entrada publicado.",
    more: "Ver precios",
    founding: {
      kicker: "Bodega fundadora",
      lead: "**Una bodega fundadora, hasta el 31 de diciembre de 2026: el módulo de Producción con la construcción mediana, a su precio de entrada.**",
      body: "Un solo lugar. A cambio: un caso con nombre y los números reales de antes y después, y dos presentaciones en el Valle.",
    },
  },
  diagnostic: {
    desc: "Diez días hábiles sobre sus anuncios, su sitio y su operación. Un informe escrito: qué es cierto, qué está roto y qué construir primero.",
  },
};

export type HomeDict = typeof en;
export const home: Dict<HomeDict> = { en, es };
