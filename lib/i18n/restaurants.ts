import type { Dict } from "./rich";

/** Restaurants and hospitality page copy. */

const en = {
  meta: {
    title: "Restaurant and hospitality growth systems",
    description:
      "A live view of covers, costing tied to what actually sells, staffing matched to demand, and bilingual wine-country and border hospitality marketing priced on performance.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "New terrain / Restaurants and hospitality",
    t1: "The dinner rush, ",
    accent: "readable before it arrives.",
    sub: "A full room is not a surprise. It is a pattern that shows up in the reservations, the covers, and the pace of a service well before the kitchen feels it. We wire your floor, your menu, and your team into one live view, so the rush is something your staff can see coming, not something that lands on them. **Read the evening while there is still time to shape it.**",
    ctaGhost: "See what we build",
  },
  build: {
    kicker: "What we build",
    title: "Five systems, each one already proven somewhere else.",
    sub: "We do not learn on your floor. Every piece below leans on a pattern we already run in a domain we have built for, adapted to a dining room. **Same rigor, same system.**",
    cards: [
      {
        h: "Covers and reservations, live, not reconstructed at midnight.",
        body: "One view of the night as it happens: who is booked, who is seated, how the room is filling, and where the pace is heading. The floor reads the same numbers the office does, all through service, instead of piecing the evening back together after close.",
        borrow:
          "Borrowed from **live harvest intelligence**, the winery view that stays true all season.",
      },
      {
        h: "Menu and plate costing tied to what actually sells.",
        body: "Every plate carries its real cost and its real movement, so the menu is priced and shaped around what the room orders, not around a spreadsheet built once and left alone. The dishes that carry the night get seen, and so do the ones quietly costing you.",
        borrow:
          "Borrowed from **berry-to-bottle traceability**, cost and yield followed from source to sale.",
      },
      {
        h: "Staffing rhythms matched to demand instead of habit.",
        body: "Cover a Tuesday like a Tuesday and a wine-country Saturday like a Saturday. We build the roster around the shape of demand the reservations and history already show, so the floor is staffed for the night that is actually coming.",
        borrow:
          "Borrowed from **crew scheduling**, field teams matched to the work in front of them.",
      },
      {
        h: "Bilingual demand for wine country and the border.",
        body: "Guests from both sides of the line, in English and Spanish, written natively rather than translated after the fact. The ads that fill your tables are priced in proportion to performance: a share of spend with a floor, or, once measurement you trust is in place, a share of the sales the ads bring in. We get paid when the room fills.",
        borrow:
          "Borrowed from **bilingual growth systems** run for both markets at once.",
      },
      {
        h: "Reviews and reputation, with the measurement checked first.",
        body: "Before anyone optimizes a rating or a response, we make sure the signal is real: which reviews map to which nights, which channels drive which guests. Reputation gets managed on numbers you can trust, the way we check demand is true before we tune it.",
        borrow:
          "Borrowed from **measurement before optimization**, our first move in every build.",
      },
    ],
  },
  why: {
    kicker: "Why us",
    title: "We already work this ground every day.",
    sub: "The wine country, the border, and the owners who run rooms on both: this is the terrain we operate in daily.",
    items: [
      {
        key: "Owner-run",
        lead: "We build for the people __who own the place.__",
        body: "Owner-run businesses are the whole of what we do. A dining room run by the family that opened it is exactly the kind of client we build for.",
      },
      {
        key: "Both languages",
        lead: "English and Spanish, __both written natively.__",
        body: "Not translated after the fact. The way you would talk to a table from San Diego and a table from Tijuana on the same night.",
      },
      {
        key: "Baja based",
        lead: "Built in Baja California, __working both sides of the border.__",
        body: "We are on the ground here, in the same markets your guests come from, on both sides of the line.",
      },
      {
        key: "Wine-country neighbors",
        lead: "We already serve the __Valle de Guadalupe.__",
        body: "The wineries next door to your tables are domains we have built for. Their tasting-room traffic and yours are the same season.",
      },
    ],
  },
  diagDesc:
    "A new terrain starts the same way every engagement does: with a free diagnostic. **Ten business days looking at your ads, your site, and how your floor actually runs, as one system.** You get a written memo, not a sales deck, telling you what is true, what is broken, and what to build first.",
  diagSpecs: [
    "**Day 1.** A working session on your room, your bookings, your ads, and your numbers.",
    "**Days 2 to 9.** We dig: reservations, covers, menu costs, staffing, measurement, the numbers behind the numbers.",
    "**Day 10.** The memo lands: what is true, what is broken, what to build first for this room.",
    "**Free, with no strings.** Act on it with us or without us. If we build, pricing is agreed up front, and ad work is priced on performance.",
  ],
};

const es: typeof en = {
  meta: {
    title: "Sistemas para restaurantes y hospitalidad",
    description:
      "Una vista al día de los comensales, costeo amarrado a lo que de verdad se vende, personal ajustado a la demanda y demanda en los dos idiomas para el valle vinícola y la frontera, con precio por resultado.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Terreno nuevo / Restaurantes y hospitalidad",
    t1: "La hora pico, ",
    accent: "legible antes de que llegue.",
    sub: "Un comedor lleno no es una sorpresa. Es un patrón que aparece en las reservaciones, en los comensales y en el ritmo de un servicio mucho antes de que la cocina lo sienta. Conectamos su piso, su menú y su equipo en una sola vista al día, para que su personal vea venir la hora pico en lugar de que les caiga encima. **Lea la noche mientras todavía se puede acomodar.**",
    ctaGhost: "Vea lo que construimos",
  },
  build: {
    kicker: "Lo que construimos",
    title: "Cinco sistemas, cada uno ya probado en otro lado.",
    sub: "No aprendemos en su piso. Cada pieza de abajo se apoya en un patrón que ya operamos en un terreno en el que construimos, adaptado a un comedor. **El mismo rigor, el mismo sistema.**",
    cards: [
      {
        h: "Comensales y reservaciones al día, no reconstruidos a medianoche.",
        body: "Una sola vista de la noche conforme pasa: quién está reservado, quién ya está sentado, cómo se va llenando el comedor y hacia dónde va el ritmo. El piso lee los mismos números que la oficina, durante todo el servicio, en lugar de rearmar la noche después del cierre.",
        borrow:
          "Tomado de **la vista de cosecha al día**, la vista de bodega que sigue siendo cierta toda la temporada.",
      },
      {
        h: "Costeo de menú y de platillo amarrado a lo que de verdad se vende.",
        body: "Cada platillo carga su costo real y su movimiento real, así que el menú se precia y se acomoda alrededor de lo que pide el comedor, y no alrededor de una hoja de cálculo hecha una vez y olvidada. Se ven los platillos que sostienen la noche, y también los que le están costando en silencio.",
        borrow:
          "Tomado de **la trazabilidad de la baya a la botella**, costo y rendimiento seguidos del origen a la venta.",
      },
      {
        h: "Personal acomodado a la demanda y no a la costumbre.",
        body: "Cubra un martes como martes y un sábado de valle vinícola como sábado. Armamos el rol alrededor de la forma de la demanda que ya muestran las reservaciones y el historial, para que el piso esté cubierto para la noche que de verdad viene.",
        borrow:
          "Tomado de **la programación de cuadrillas**, equipos de campo acomodados al trabajo que tienen enfrente.",
      },
      {
        h: "Demanda en los dos idiomas para el valle vinícola y la frontera.",
        body: "Huéspedes de los dos lados de la línea, en español y en inglés, escritos por separado y no traducidos después. Los anuncios que llenan sus mesas llevan precio proporcional al resultado: un porcentaje de la inversión con un piso, o, cuando ya existe una medición en la que usted confía, un porcentaje de las ventas que traen los anuncios. Cobramos cuando el comedor se llena.",
        borrow:
          "Tomado de **los sistemas en los dos idiomas**, operados para los dos mercados a la vez.",
      },
      {
        h: "Reseñas y reputación, con la medición revisada primero.",
        body: "Antes de que alguien ajuste una calificación o una respuesta, nos aseguramos de que la señal sea real: qué reseñas corresponden a qué noches, qué canales traen a qué huéspedes. La reputación se maneja con números confiables, igual que revisamos que la demanda sea cierta antes de moverla.",
        borrow:
          "Tomado de **medir antes de ajustar**, nuestro primer movimiento en cada construcción.",
      },
    ],
  },
  why: {
    kicker: "Por qué nosotros",
    title: "Ya trabajamos esta tierra todos los días.",
    sub: "El valle vinícola, la frontera y los dueños que operan comedores en los dos: este es el terreno en el que andamos a diario.",
    items: [
      {
        key: "Con dueño al frente",
        lead: "Construimos para la gente __que es dueña del lugar.__",
        body: "Los negocios con dueño al frente son todo lo que hacemos. Un comedor operado por la familia que lo abrió es justo el cliente para el que construimos.",
      },
      {
        key: "Los dos idiomas",
        lead: "Español e inglés, __cada uno escrito por separado.__",
        body: "Ninguno es la traducción del otro. Como le hablaría a una mesa de San Diego y a una mesa de Tijuana la misma noche.",
      },
      {
        key: "Con base en Baja",
        lead: "Hechos en Baja California, __trabajando los dos lados de la frontera.__",
        body: "Estamos aquí en el terreno, en los mismos mercados de los que vienen sus huéspedes, de los dos lados de la línea.",
      },
      {
        key: "Vecinos del valle vinícola",
        lead: "Ya atendemos el __Valle de Guadalupe.__",
        body: "Las bodegas de junto a sus mesas son terrenos en los que ya construimos. El tráfico de sus salas de degustación y el suyo son la misma temporada.",
      },
    ],
  },
  diagDesc:
    "Un terreno nuevo empieza igual que cualquier trabajo: con un diagnóstico sin costo. **Diez días hábiles revisando sus anuncios, su sitio y cómo corre su piso de verdad, como un solo sistema.** Usted recibe un informe escrito, no una presentación de ventas: qué es cierto, qué está roto y qué conviene construir primero.",
  diagSpecs: [
    "**Día 1.** Una sesión de trabajo sobre su comedor, sus reservaciones, sus anuncios y sus números.",
    "**Días 2 a 9.** Escarbamos: reservaciones, comensales, costos de menú, personal, medición y los números detrás de los números.",
    "**Día 10.** Llega el informe: qué es cierto, qué está roto y qué construir primero para este comedor.",
    "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda desde el principio y el trabajo de anuncios lleva precio por resultado.",
  ],
};

export type RestaurantsDict = typeof en;
export const restaurants: Dict<RestaurantsDict> = { en, es };
