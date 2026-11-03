import type { Dict } from "./rich";
import { branded } from "./variant";

/**
 * The wine brand's home page (bead hq-3f6ut.2). Spanish authoritative, English
 * written for a US owner. "{brand}" is the brand's name, filled in from
 * lib/brand.ts (lib/i18n/variant.ts), because the name is not chosen yet.
 *
 * The first screen answers the trunk test in the hero alone: what it is
 * (software for a winery and the rooms and restaurant around it), who already
 * runs it (Monte Xanic, Vinedo En'kanto) and what to do next (open the demo,
 * ask for the diagnostic). The hero's eyebrow, title and sub stay under sixty
 * words together, so the answer lands in the page's first sixty; a test in
 * app/vino-pages.test.tsx counts them.
 *
 * Facts used, and where each is published already: the one Monte Xanic figure
 * and its basis (lib/i18n/monte-xanic.ts, lib/i18n/home.ts); what was built
 * for En'kanto (lib/i18n/enkanto.ts); the demo opens on an invented winery
 * with nothing to fill in (lib/i18n/demos-index.ts); the modules bought alone
 * or combined, fixed price per module, two fees, code and data in the client's
 * name (lib/i18n/software.ts, lib/i18n/winery.ts). No figure is typed here:
 * the module entry prices are read from lib/pricing.ts by the page.
 */

const en = {
  meta: {
    title: "{brand}: software for wineries, by Cardon",
    description:
      "{brand} is software for a winery and the rooms and restaurant around it: harvest lots, every booking on one calendar, the order through to the cash count. Open the demo or book the free diagnostic.",
  },
  hero: {
    aria: "Introduction",
    title: "Your winery, current every morning.",
    titleAccent: "From the harvest to the last check of the night.",
    sub: "{brand} is software for a winery and the rooms and restaurant around it: harvest lots and barrels, every booking on one calendar, the order from the server's phone to the cash count. Open the demo, or book the free diagnostic.",
    demo: "Open the demo",
    risk: "The diagnostic costs nothing, and the memo is yours whether you build or not.",
    proofLine: "Running today at Monte Xanic and Vinedo En'kanto.",
    photoCap: "The season's curve, read on the barrel the morning after the last sample.",
    photoAlt: "A laptop resting on a barrel in the cellar, the harvest curve on screen",
  },
  proof: {
    aria: "The wineries already running it",
    read: "Read the case",
    items: [
      {
        name: "Monte Xanic",
        place: "Valle de Guadalupe",
        result: "About an hour of finance work every week, now about two minutes.",
        cap: "Monte Xanic opens the season in one live view.",
        alt: "Monte Xanic, the winery and its vineyard in one frame",
      },
      {
        name: "Vinedo En'kanto",
        place: "San Antonio de las Minas",
        result: "Production, the restaurant and the bookings on one system, with a store in front that takes orders.",
        cap: "One record for the wine, the rooms and the dining room.",
        alt: "A cabin at Vinedo En'kanto among the vines",
      },
    ],
    basis: "The Monte Xanic hour was timed by hand before the build; the two minutes are the refresh the view runs on.",
  },
  modules: {
    kicker: "Three modules",
    title: "Start with the part of the winery that costs you most.",
    sub: "Each module is bought on its own or with the others, and each has a published entry price.",
    from: "Setup from",
    monthly: "then {amount} a month",
    demo: "Open its demo",
    items: [
      {
        id: "produccion",
        name: "Produccion",
        title: "Know what you picked, made and sold.",
        body: "Every lot dated and traced from the block to the bottle, and any two vintages side by side.",
      },
      {
        id: "hospitalidad",
        name: "Hospitalidad",
        title: "Fill the rooms two calendars left empty.",
        body: "Every booking from every channel on one calendar, and the guest remembered on the next visit.",
      },
      {
        id: "restaurante",
        name: "Restaurante",
        title: "Close the night with the cash already counted.",
        body: "The order starts on the server's phone, the wine list reads the cellar, and the cash count is done at close.",
      },
    ],
    more: "See the three modules in full",
    prices: "See every price",
  },
  familiar: {
    kicker: "Sound familiar?",
    title: "What owners tell us before the first meeting.",
    items: [
      {
        q: "Nobody has time to type anything in during harvest.",
        a: "Each reading is written once, from the phone, where the work happens. The view builds itself from there.",
      },
      {
        q: "We already have a production system.",
        a: "Monte Xanic had one too, plus spreadsheets and a field notebook. All three now feed the same view.",
      },
      {
        q: "If I stop paying, I lose everything.",
        a: "The code, the data and the accounts are in your name from day one, and the system keeps running.",
      },
    ],
  },
  how: {
    kicker: "How it works",
    title: "From the first call to a system your team runs.",
    steps: [
      { k: "01", body: "The diagnostic, at no cost. Ten business days on your records and a written memo that is yours." },
      { k: "02", body: "The build. A fixed price per module, agreed before anyone starts." },
      { k: "03", body: "The handover. Your team trained, the accounts in your name, and a call every week while the service runs." },
    ],
  },
  faq: {
    title: "Questions a winery asks first",
    items: [
      {
        question: "What is {brand}?",
        answer:
          "Software for a winery and the business around it, in three modules: Produccion for the vineyard and the cellar, Hospitalidad for the rooms and the tasting room, Restaurante for the dining room. It is built and run by Cardon Digital, in Ensenada.",
      },
      {
        question: "Do I have to buy all three modules?",
        answer:
          "No. Each module is bought on its own or combined with the others, and the diagnostic says which one to start with.",
      },
      {
        question: "How much does it cost?",
        answer:
          "Two fees per module: the setup pays for the build and the monthly fee runs it. Every module's entry price is published on the pricing page, and the final quote comes out of the diagnostic.",
      },
      {
        question: "Can I see it before I talk to anyone?",
        answer:
          "Yes. The demo opens with the data of an invented winery, with nothing to fill in and nothing to install.",
      },
      {
        question: "Who owns the system and the data?",
        answer:
          "You do. The code, the data and the accounts are in your name from the first day. If the service stops, the system keeps running.",
      },
    ],
  },
  diagDesc:
    "Ten business days on your harvest records, your bookings and your dining room, and a written memo that is yours: what is true, what is broken, which module to build first.",
};

const es: typeof en = {
  meta: {
    title: "{brand}: software para bodegas, por Cardon",
    description:
      "{brand} es el software de la bodega, su hospedaje y su restaurante: los lotes de la vendimia, las reservas en un calendario y la comanda hasta el corte de caja. Abra la demo o pida el diagnóstico sin costo.",
  },
  hero: {
    aria: "Introducción",
    title: "Su bodega, al día cada mañana.",
    titleAccent: "De la vendimia al último corte de la noche.",
    sub: "{brand} es el software de la bodega, su hospedaje y su restaurante: los lotes de la vendimia, las reservas de todos los canales en un calendario y la comanda hasta el corte de caja. Abra la demo o pida el diagnóstico sin costo.",
    demo: "Abrir la demo",
    risk: "El diagnóstico no cuesta y el informe es suyo, construyamos o no.",
    proofLine: "Ya opera en Monte Xanic y en Viñedo En'kanto.",
    photoCap: "La curva de la temporada, leída en la barrica a la mañana siguiente del último muestreo.",
    photoAlt: "Una laptop sobre una barrica en la cava, con la curva de la vendimia en pantalla",
  },
  proof: {
    aria: "Las bodegas que ya lo usan",
    read: "Leer el caso",
    items: [
      {
        name: "Monte Xanic",
        place: "Valle de Guadalupe",
        result: "Cerca de una hora de trabajo de finanzas cada semana, ahora unos dos minutos.",
        cap: "Monte Xanic ve la temporada al día en una sola pantalla.",
        alt: "Monte Xanic, la bodega y su viñedo en una toma",
      },
      {
        name: "Viñedo En'kanto",
        place: "San Antonio de las Minas",
        result: "La producción, el restaurante y las reservas en un solo sistema, con una tienda en línea que ya recibe pedidos.",
        cap: "Un solo registro para el vino, las cabañas y el comedor.",
        alt: "Una cabaña de Viñedo En'kanto entre los viñedos",
      },
    ],
    basis: "La hora de Monte Xanic se midió a mano antes de construir; los dos minutos son lo que tarda la vista en actualizarse.",
  },
  modules: {
    kicker: "Tres módulos",
    title: "Empiece por la parte de la bodega que más le cuesta.",
    sub: "Cada módulo se compra solo o junto con los otros, y cada uno tiene su precio de entrada publicado.",
    from: "Instalación desde",
    monthly: "y luego {amount} al mes",
    demo: "Abrir su demo",
    items: [
      {
        id: "produccion",
        name: "Producción",
        title: "Sepa qué cosechó, qué vinificó y qué vendió.",
        body: "Cada lote con fecha y origen, del cuartel a la botella, y dos añadas lado a lado cuando las quiera comparar.",
      },
      {
        id: "hospitalidad",
        name: "Hospitalidad",
        title: "Llene las cabañas que dos calendarios dejaban vacías.",
        body: "Las reservas de todos los canales en un solo calendario, y el huésped recordado en su siguiente visita.",
      },
      {
        id: "restaurante",
        name: "Restaurante",
        title: "Cierre la noche con la caja ya contada.",
        body: "La comanda empieza en el celular del mesero, la carta de vinos lee la cava y el corte de caja queda hecho al cerrar.",
      },
    ],
    more: "Ver los tres módulos completos",
    prices: "Ver todos los precios",
  },
  familiar: {
    kicker: "¿Le suena?",
    title: "Lo que nos dicen los dueños antes de la primera reunión.",
    items: [
      {
        q: "En vendimia nadie tiene tiempo de capturar nada.",
        a: "Cada dato se anota una sola vez, desde el celular, ahí donde se hace el trabajo. La vista se arma sola a partir de ahí.",
      },
      {
        q: "Ya tenemos un sistema de producción.",
        a: "Monte Xanic también tenía uno, además de hojas de cálculo y una libreta de campo. Hoy los tres alimentan la misma vista.",
      },
      {
        q: "Si dejo de pagar, me quedo sin nada.",
        a: "El código, los datos y las cuentas están a su nombre desde el primer día, y el sistema sigue funcionando.",
      },
    ],
  },
  how: {
    kicker: "Cómo funciona",
    title: "De la primera llamada a un sistema que opera su equipo.",
    steps: [
      { k: "01", body: "El diagnóstico, sin costo. Diez días hábiles con sus registros y un informe por escrito que es suyo." },
      { k: "02", body: "La construcción. Un precio fijo por módulo, acordado antes de empezar." },
      { k: "03", body: "La entrega. Su equipo capacitado, las cuentas a su nombre y una llamada cada semana mientras corre el servicio." },
    ],
  },
  faq: {
    title: "Lo primero que pregunta una bodega",
    items: [
      {
        question: "¿Qué es {brand}?",
        answer:
          "El software de una bodega y del negocio que tiene alrededor, en tres módulos: Producción para el viñedo y la cava, Hospitalidad para las cabañas y la sala de degustación, Restaurante para el comedor. Lo construye y lo opera Cardon Digital, en Ensenada.",
      },
      {
        question: "¿Tengo que comprar los tres módulos?",
        answer:
          "No. Cada módulo se compra solo o junto con los otros, y el diagnóstico le dice por cuál empezar.",
      },
      {
        question: "¿Cuánto cuesta?",
        answer:
          "Dos cuotas por módulo: la instalación paga la construcción y la mensualidad lo mantiene funcionando. El precio de entrada de cada módulo está publicado en la página de precios, y la cotización final sale del diagnóstico.",
      },
      {
        question: "¿Puedo verlo antes de hablar con alguien?",
        answer:
          "Sí. La demo abre con los datos de una finca inventada, sin nada que llenar y sin nada que instalar.",
      },
      {
        question: "¿De quién son el sistema y los datos?",
        answer:
          "Suyos. El código, los datos y las cuentas están a su nombre desde el primer día. Si el servicio termina, el sistema sigue funcionando.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles con los registros de su vendimia, sus reservas y su comedor, y un informe por escrito que es suyo: qué funciona, qué falla y qué módulo construir primero.",
};

export type HomeVinoDict = typeof en;
export const homeVino: Dict<HomeVinoDict> = branded({ en, es });
