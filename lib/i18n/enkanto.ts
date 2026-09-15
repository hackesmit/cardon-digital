import type { Dict } from "./rich";

/** Vinedo En'kanto case history, the companion to lib/i18n/monte-xanic.ts.
 *
 *  The two case pages are written to one shape (case-naming.md 6.1): the same
 *  header fields in the same order, a basis paragraph that accounts for every
 *  number above it, and the same closing offer. Monte Xanic carries the one
 *  measured figure this company owns. This page carries none, and that is the
 *  whole editorial problem it solves: it sells the result without borrowing a
 *  number, because the system is built and is not yet in service at En'kanto.
 *
 *  Four things here are deliberate and load bearing:
 *
 *  1. Zero emphasis markers, which is docs/copy-doctrine.md's bold rule. The
 *     two real labels on the page (the case fact keys and the diagnostic day
 *     markers) are labels in the markup with their own class.
 *  2. No figure of En'kanto's, and no claim about what the system changed
 *     there. The results block stays a marked placeholder until Daniel's own
 *     before and after numbers land (bead hq-cczm.26).
 *  3. The honest edges keep their exact scope. Every limit that was gated
 *     before this rewrite is still gated, in the same words where the words
 *     were the policy: mirrors the channels, reads OpenTable, reads a room
 *     charge and never writes one, built and not yet in service.
 *  4. Spanish is written for a Valle winemaker and English for a US owner.
 *     Neither is a translation of the other.
 */

const en = {
  meta: {
    title: "En'kanto case history",
    description:
      "A bottle can now leave En'kanto's own store paid and shipped, in both languages. Behind the three lines, one system is built and open to walk through.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Case history",
    t1: "A bottle can now leave En'kanto's own store, ",
    accent: "paid and shipped",
    t2: ".",
    sub: "The catalog had no prices and no way to ship. The checkout completes now, and the wine reaches a door inside Mexico. Behind the winery, the rooms and the dining room, one system is built and open to walk through.",
  },
  /** Captions are read by about twice as many people as this body copy, so each
   *  one carries the result its picture is evidence for. The video caption says
   *  in words what the footage shows, so the clip never carries a claim alone. */
  media: {
    deskCap:
      "The front desk at En'kanto. It gets one calendar with every channel on it, and the day already counted.",
    deskAlt: "Check in at the front desk, guest side of the counter.",
    passCap:
      "The pass at service. The order reaches it as the waiter wrote it, once, with its own clock.",
    passAlt: "A ticket going out at the pass, the screen in its working position.",
    videoCap:
      "A restaurant charge lands on the room. The desk reads the total and never writes one.",
    videoAlt: "A tablet at the table, then the guest folio at the desk.",
    play: "Play",
    pause: "Pause",
  },
  facts: {
    aria: "Case facts and their basis",
    rows: [
      { k: "Client", v: "Vinedo En'kanto" },
      { k: "Sector", v: "Winery, hotel and restaurant" },
      { k: "Place", v: "San Antonio de las Minas, Valle de Guadalupe" },
      { k: "Engagement", v: "Build and ongoing work" },
      {
        k: "What we built",
        v: "Online store, structure and search, payments and shipping for how Mexico pays and ships, a bilingual build, then one system for the three lines",
      },
      {
        k: "Outcome",
        v: "The store takes a real order in both languages; the system for the three lines is built and open to walk through",
      },
    ],
    basisK: "Basis",
    basis:
      "No En'kanto revenue figure is published here, and no result from the system's use, because it is not in service there yet. The other numbers are counts of the build on 9 September 2026: three modules, the nineteen screens named here in lists of five, five and nine, ten staff positions, and the five homepages we unpublished.",
  },
  before: {
    kicker: "Before",
    title: "Three businesses on one property, and nothing holding them together.",
    p1: "Vinedo En'kanto sits in San Antonio de las Minas: a boutique winery, rooms for people who want to wake up in the Valle, and a restaurant. Three lines, one place.",
    p2: "Online, the store existed in name only: products with no price, no way to ship, five homepages competing for the same visitor. The order went on a pad and the bookings arrived in as many places as there were channels.",
  },
  changed: {
    kicker: "What changed",
    title: "The store takes the order, and the wine gets to the door.",
    sub: "Real products with a price, a weight and an image, and a checkout that completes.",
    tag: "empty in name, then built out",
    aria: "An empty product card becomes a real one with an image, name, price and weight.",
    honest: "Illustrative card, invented product.",
    inNameOnly: "IN NAME ONLY",
    builtOut: "BUILT OUT",
    add: "add",
    items: [
      {
        lead: "One address for the whole business.",
        body: "The duplicates came down, one page stands for the wine, the stays and the restaurant, and search reads the site the way a visitor does.",
      },
      {
        lead: "Paid the way people here pay.",
        body: "Card and cash both reach a placed order, so the checkout stops being where a sale quietly dies.",
      },
      {
        lead: "A bottle reaches a door inside Mexico.",
        body: "A domestic carrier and packaging that meets the rules. Selling across the border as a Mexican winery is outside what the law allows, so guests from the north carry wine home under the personal allowance, and the store says so.",
      },
      {
        lead: "One store, read whole in two languages.",
        body: "English and Spanish on one foundation, so a guest from the Valle and one from the north meet the same business.",
      },
    ],
  },
  system: {
    kicker: "The system",
    title: "One record for the winery, the dining room and the rooms.",
    p1: "Three operations shared a property and no shared record. We built the one they share: nineteen screens, a set per area, so each part of the business works from its own.",
    screensK: "Screens",
    modules: [
      {
        num: "01",
        name: "Produccion",
        title: "The vintage on the record, block to barrel.",
        body: "The vineyard and its blocks, the season and the harvest window, pick dates and lab analysis by lot, fermentation by tank, and the barrel room card by card.",
        screens: ["Viñedo", "Añadas", "Cosecha", "Fermentación", "Crianza y Barricas"],
      },
      {
        num: "02",
        name: "Restaurante",
        title: "One order, from the waiter's phone to the cash cut.",
        body: "Written once at the table, timed on the kitchen screen, seated from a table map, and closed on a summary and a cash cut with the difference.",
        screens: ["Mesero", "Cocina", "Anfitrión", "Resumen del día", "Corte del día"],
      },
      {
        num: "03",
        name: "Hospedaje",
        title: "Every booking in one calendar, and the day already counted.",
        body: "Every channel in one calendar, the day's arrivals and departures, occupancy and revenue by channel, a guest record that outlives the booking, and housekeeping from a phone.",
        screens: ["Calendario", "Día", "Ocupación", "Ingresos", "Huéspedes", "Cargos", "Mesas", "Tablero", "Limpieza"],
      },
    ],
    limitsKicker: "What it will not promise",
    limitsTitle: "The edges, written into the screens.",
    limits: [
      {
        lead: "It mirrors the channels. It does not write to them.",
        body: "Airbnb publishes no open interface for a host, so the calendar reads the iCal feeds, which refresh in hours. A date blocked here stays open there, and the screen says so.",
      },
      {
        lead: "It reads OpenTable. It does not scrape it.",
        body: "Table bookings live in OpenTable, open to approved partners and to nobody else. Until that account is connected, the booking is taken by hand and reconciled against the export on guest and time, so one stays one.",
      },
      {
        lead: "A room bill adds up the restaurant's charges. It never writes one.",
        body: "The front desk only reads them: creating or changing a charge belongs to the restaurant. A charge with no amount shows as pending and stays out of the total, and an example is labelled as one.",
      },
      {
        lead: "It is built. It is not yet in service at En'kanto.",
        body: "Everything here is merged and running. Putting it into the property's daily work is the next phase, and until then we claim nothing about what it changed.",
      },
    ],
    demo: {
      kicker: "See it",
      title: "The system is open. Walk it yourself.",
      body: "It runs as a public demonstration under a fictional name, assembled from a whitelist that leaves En'kanto's own data files out of the deployment. Open a module, pick any of the ten positions, walk its screens.",
      cta: "Open the demo",
      note: "Illustrative data under a fictional name. Nothing there belongs to a client.",
    },
  },
  pending: {
    marker: "PLACEHOLDER. Not for publication.",
    title: "What the system changed for En'kanto goes here.",
    body: "Empty until En'kanto's own figures are in hand: what a task took before, what it takes now, over a stated window. Fill it or delete it before this page ships.",
  },
  result: {
    kicker: "For your property",
    title: "What this changes if you run more than one line.",
    items: [
      {
        lead: "The sale completes.",
        body: "A price, a weight, a way to ship, and a checkout that ends in a placed order.",
      },
      {
        lead: "The order is written once.",
        body: "From the phone at the table to the cash cut, with nobody copying it out again.",
      },
      {
        lead: "The system is yours.",
        body: "The code, the data and the keys stay with the property.",
      },
    ],
  },
  diagDesc:
    "Ten business days on your store, your site and your operation, and a written memo at the end.",
  /** `d` is a real label and is styled as one, so it needs no emphasis marker. */
  diagSpecs: [
    { d: "Day 1", t: "A working session on all three." },
    { d: "Days 2 to 9", t: "We dig into the numbers behind the numbers." },
    {
      d: "Day 10",
      t: "The memo lands: what is true, what is broken, what to build first.",
    },
    { d: "After", t: "We propose the build, or you take the memo and go." },
  ],
};

const es: typeof en = {
  meta: {
    title: "Caso Viñedo En'kanto",
    description:
      "Hoy una botella puede salir de la tienda de En'kanto pagada y enviada, en los dos idiomas. Detrás de las tres líneas hay un sistema construido y abierto para recorrerlo.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Caso",
    t1: "Hoy una botella puede salir de la tienda de la bodega, ",
    accent: "pagada y enviada",
    t2: ".",
    sub: "El catálogo no tenía precios ni manera de enviar. Hoy el pago se completa y el vino llega a una puerta dentro de México. Detrás de la bodega, los cuartos y el comedor hay un sistema construido y abierto para recorrerlo.",
  },
  media: {
    deskCap:
      "La recepción de En'kanto. Recibe un solo calendario con todos los canales, y el día ya contado.",
    deskAlt: "Registro de llegada en la recepción, del lado del huésped.",
    passCap:
      "El pase en servicio. La comanda le llega como la escribió el mesero, una sola vez, con su propio reloj.",
    passAlt: "Una comanda saliendo en el pase, con la pantalla en su lugar de trabajo.",
    videoCap:
      "Un cargo del restaurante cae en la habitación. La recepción lee el total y nunca escribe uno.",
    videoAlt: "Una tableta en la mesa y luego la cuenta del huésped en recepción.",
    play: "Reproducir",
    pause: "Pausar",
  },
  facts: {
    aria: "Datos del caso y su base",
    rows: [
      { k: "Cliente", v: "Viñedo En'kanto" },
      { k: "Sector", v: "Bodega, hotel y restaurante" },
      { k: "Lugar", v: "San Antonio de las Minas, Valle de Guadalupe" },
      { k: "Relación", v: "Construcción y trabajo continuo" },
      {
        k: "Lo que construimos",
        v: "Tienda en línea, estructura y búsqueda, pagos y envíos como se paga y se envía en México, construcción bilingüe, y un solo sistema para las tres líneas",
      },
      {
        k: "Resultado",
        v: "La tienda toma un pedido de verdad en los dos idiomas; el sistema de las tres líneas está construido y abierto para recorrerlo",
      },
    ],
    basisK: "Base",
    basis:
      "Aquí no publicamos ninguna cifra de ingresos de En'kanto ni ningún resultado del uso del sistema, porque todavía no está en servicio ahí. Los demás números son de la construcción al 9 de septiembre de 2026: tres módulos, las diecinueve pantallas nombradas aquí en listas de cinco, cinco y nueve, diez puestos de personal, y las cinco páginas de inicio que despublicamos.",
  },
  before: {
    kicker: "Antes",
    title: "Tres negocios en una propiedad, y nada que los sostuviera juntos.",
    p1: "Viñedo En'kanto está en San Antonio de las Minas: una bodega boutique, cuartos para quien quiere amanecer en el Valle y un restaurante. Tres líneas, un mismo lugar.",
    p2: "En línea, la tienda existía solo de nombre: productos sin precio, sin manera de enviar, cinco páginas de inicio peleándose al mismo visitante. La comanda se escribía en papel y las reservas llegaban a tantos lugares como canales había.",
  },
  changed: {
    kicker: "Lo que cambió",
    title: "La tienda toma el pedido y el vino llega a la puerta.",
    sub: "Productos de verdad con precio, peso e imagen, y un pago que se completa.",
    tag: "vacía de nombre, después construida",
    aria: "Una tarjeta de producto vacía se vuelve una real con imagen, nombre, precio y peso.",
    honest: "Tarjeta ilustrativa, producto inventado.",
    inNameOnly: "SOLO DE NOMBRE",
    builtOut: "CONSTRUIDA",
    add: "agregar",
    items: [
      {
        lead: "Una sola dirección para todo el negocio.",
        body: "Las duplicadas se bajaron, una sola página representa al vino, el hospedaje y el restaurante, y la búsqueda lee el sitio como lo lee un visitante.",
      },
      {
        lead: "Se paga como aquí se paga.",
        body: "Tarjeta y efectivo llegan los dos a un pedido realizado, y el carrito deja de ser donde una venta se muere sola.",
      },
      {
        lead: "Una botella llega a una puerta dentro de México.",
        body: "Paquetería nacional y empaque que cumple. Vender del otro lado de la frontera siendo una bodega mexicana no es algo que la ley permita, así que los huéspedes del norte se llevan su vino bajo la franquicia personal, y la tienda lo dice.",
      },
      {
        lead: "Una tienda completa en dos idiomas.",
        body: "Español e inglés sobre un mismo cimiento, para que un huésped del Valle y uno del norte encuentren el mismo negocio.",
      },
    ],
  },
  system: {
    kicker: "El sistema",
    title: "Un solo registro para la bodega, el comedor y los cuartos.",
    p1: "Tres operaciones compartían la propiedad y ningún registro. Construimos el que sí comparten: diecinueve pantallas, con un juego por área, para que cada parte del negocio trabaje desde la suya.",
    screensK: "Pantallas",
    modules: [
      {
        num: "01",
        name: "Producción",
        title: "El registro de la añada, del cuartel a la barrica.",
        body: "El viñedo y sus cuarteles, la temporada y la ventana de cosecha, fechas de pizca y análisis por lote, fermentación por tanque, y la sala de barricas ficha por ficha.",
        screens: ["Viñedo", "Añadas", "Cosecha", "Fermentación", "Crianza y Barricas"],
      },
      {
        num: "02",
        name: "Restaurante",
        title: "Una comanda, del teléfono del mesero al corte de caja.",
        body: "Se escribe una sola vez en la mesa, se cronometra en cocina, se sienta desde el mapa de mesas, y el día cierra con resumen y corte.",
        screens: ["Mesero", "Cocina", "Anfitrión", "Resumen del día", "Corte del día"],
      },
      {
        num: "03",
        name: "Hospedaje",
        title: "Todas las reservas en un calendario, y el día ya contado.",
        body: "Cada canal en un solo calendario, las llegadas y salidas del día, ocupación e ingreso por canal, una ficha de huésped que dura más que la reserva, y limpieza desde el teléfono.",
        screens: ["Calendario", "Día", "Ocupación", "Ingresos", "Huéspedes", "Cargos", "Mesas", "Tablero", "Limpieza"],
      },
    ],
    limitsKicker: "Lo que no promete",
    limitsTitle: "Los bordes, escritos en las pantallas.",
    limits: [
      {
        lead: "Es un espejo de los canales. No les escribe.",
        body: "Airbnb no publica una interfaz abierta para un anfitrión, así que el calendario lee los feeds iCal, que se refrescan en horas. Una fecha bloqueada aquí sigue abierta allá, y la pantalla lo dice.",
      },
      {
        lead: "Lee OpenTable. No lo raspa.",
        body: "Las reservas de mesa viven en OpenTable, abierto a socios aprobados y a nadie más. Mientras esa cuenta no esté conectada, la reserva se captura a mano y se concilia contra la exportación por huésped y hora, para que una siga siendo una.",
      },
      {
        lead: "La cuenta de la habitación suma los cargos del restaurante. Nunca escribe uno.",
        body: "La recepción solo los lee: crear o cambiar un cargo le toca al restaurante. Un cargo sin importe se muestra como pendiente y queda fuera del total, y un ejemplo se marca como ejemplo.",
      },
      {
        lead: "Está construido. Todavía no está en servicio en En'kanto.",
        body: "Todo lo de esta página ya está integrado y corre. Meterlo al trabajo diario de la propiedad es la siguiente etapa, y mientras eso no pase no reclamamos nada sobre lo que cambió.",
      },
    ],
    demo: {
      kicker: "Véalo",
      title: "El sistema está abierto. Recórralo usted mismo.",
      body: "Corre como demostración pública bajo un nombre ficticio, armada con una lista blanca que deja fuera del despliegue los archivos de datos de En'kanto. Abra un módulo, elija uno de los diez puestos, recorra sus pantallas.",
      cta: "Abrir el demo",
      note: "Datos ilustrativos bajo un nombre ficticio. Nada de ahí es de un cliente.",
    },
  },
  pending: {
    marker: "MARCADOR. No publicable.",
    title: "Aquí va lo que el sistema le cambió a En'kanto.",
    body: "Vacío hasta tener las cifras de la propia En'kanto: cuánto tomaba una tarea antes, cuánto toma ahora, sobre una ventana declarada. Llénelo o bórrelo antes de que esta página salga en vivo.",
  },
  result: {
    kicker: "Para su propiedad",
    title: "Lo que cambia si usted vive de más de una línea.",
    items: [
      {
        lead: "La venta se completa.",
        body: "Precio, peso, manera de enviar, y un pago que termina en pedido realizado.",
      },
      {
        lead: "La comanda se escribe una sola vez.",
        body: "Del teléfono en la mesa al corte de caja, sin que nadie la vuelva a capturar.",
      },
      {
        lead: "El sistema es suyo.",
        body: "El código, los datos y los accesos se quedan en la propiedad.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles sobre su tienda, su sitio y su operación, y al final un informe escrito.",
  diagSpecs: [
    { d: "Día 1", t: "Una sesión de trabajo sobre los tres." },
    { d: "Días 2 a 9", t: "Escarbamos en los números detrás de los números." },
    {
      d: "Día 10",
      t: "Llega el informe: qué es cierto, qué está roto y qué construir primero.",
    },
    { d: "Después", t: "Proponemos la construcción, o usted se lleva el informe." },
  ],
};

export type EnkantoDict = typeof en;
export const enkanto: Dict<EnkantoDict> = { en, es };
