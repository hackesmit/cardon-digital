import type { Dict } from "./rich";

/** Construction page copy. */

const en = {
  meta: {
    title: "Construction growth systems",
    description:
      "Work orders, crews, materials, and sites on one scheduled board, built for construction companies, with qualified lead generation priced on performance.",
  },
  hero: {
    eyebrow: "Industries / Construction",
    title: "Every crew, every material, every site.",
    titleAccent: "One board.",
    sub: "We built the operations and logistics system for a construction company, so we know how a build actually runs: work orders, crews, materials, and site progress that live in calls, texts, and paper, wired into one scheduled board the office and the field both read from. **Scattered orders become a sequence you can trust.**",
    dry: "Yes, a construction company named Logistics. The name set a high bar.",
    ctaGhost: "See what we build",
  },
  value: {
    aria: "What this is worth to a construction company",
    srTitle: "What this is worth to you",
    items: [
      {
        key: "A domain we built for",
        lead: "We built the operations system __a construction company runs on.__",
        body: "Not a pitch about an industry we might learn. We already know how a build coordinates, from the first work order to the final inspection.",
      },
      {
        key: "Office and field, one board",
        lead: "The same live schedule __the crew updates and the office reads.__",
        body: "No relay of phone calls to find out where a site stands. One source of truth everyone works from.",
      },
      {
        key: "Yours to own",
        lead: "Trained into your team, __and yours to keep.__",
        body: "Built around how you already run, handed over to your people, with no per-seat subscription to babysit.",
      },
    ],
  },
  fleet: {
    kicker: "Fleet and logistics",
    title: "Every vehicle on one map.",
    lead: "Every vehicle runs on one map, so the office sees where each one is without a single phone call. When a truck reaches a site, its arrival logs itself the moment it crosses the geofence. The board fills on its own, and the day stops running on chase calls.",
    note: "**Arrivals log themselves.** The office stops phoning around.",
  },
  caps: {
    kicker: "What we build",
    title: "Built for how a build actually runs.",
    sub: "Not a generic CRM bent into the shape of a job site. These are the operations a construction company lives on, wired into one connected system your team owns.",
    cards: [
      {
        idx: "01 / Job flow",
        h: "Work orders and job flow",
        body: "Scattered orders, calls, and messages become one scheduled board. Every job carries an owner, a date, and a status the whole company can see, so nothing lives only in someone's head or a lost text thread.",
      },
      {
        idx: "02 / Scheduling",
        h: "Crew and materials scheduling",
        body: "Assign crews and materials against real availability. The board shows the double-booking or the missing delivery before it costs you a day on site, not after the crew is already standing around.",
      },
      {
        idx: "03 / Visibility",
        h: "Site and progress tracking",
        body: "The office reads where every site stands without calling the field. Daily progress, blockers, and photos land in one place, so a status update is a glance, not an interruption to someone's afternoon.",
      },
      {
        idx: "04 / Procurement",
        h: "Procurement and quoting",
        body: "The routine parts of buying and quoting run themselves: request to purchase order, quote to job, reminders and follow-ups that no longer wait on someone remembering. Manual routines turned into work that runs itself, with hours back every month.",
      },
      {
        idx: "05 / Demand",
        h: "Demand that measures first",
        body: "Qualified leads for the work you actually want more of. We run the ads with the rigor of the most sophisticated agencies, and we check that the numbers coming in are real before anyone optimizes, so every decision after that rests on something true.",
      },
    ],
    demandNote:
      "Pricing: **a share of ad spend with a floor, or of the sales the ads bring in once measurement you trust is in place.** We get paid when it works.",
  },
  vis: {
    fleet: {
      depot: "DEPOT",
      siteA: "SITE A",
      siteB: "SITE B",
      arrivals: "ARRIVALS",
      auto: "AUTO",
      logged: "logged",
      at: " at ",
      fleet: "FLEET",
      live: "LIVE",
      ready: "READY",
      status: "{n} vehicles on one map / arrivals log themselves",
      fallback:
        "A live map of your sites and vehicles. Each site is a geofenced ring; when a vehicle crosses into one, its arrival is logged automatically, with no phone call. Every vehicle on one map.",
    },
    plan: {
      tagBefore: "scattered orders",
      tagMid: "placed into",
      tagAfter: "one schedule",
      title: "Work orders placed onto a site plan and its weekly schedule",
      descDesktop:
        "A top-down site plan with five plots sits beside a weekly schedule strip. Scattered work-order chips are placed one at a time into dated lanes; as each lands its plot lights and a dependency line links it to the next in sequence. Focus a placed chip to raise its readout and light its plot.",
      descPortrait:
        "A top-down site plan with five plots sits above a weekly schedule of five dated lanes. Scattered work-order chips are placed one at a time into the lanes; as each lands its plot lights and a dependency line links it to the next in sequence. Focus a placed chip to raise its readout and light its plot.",
      fallback:
        "Scattered work orders, grade site, form footings, rebar delivery, pour slab, and inspection, settle one at a time into dated lanes on a weekly schedule beside a site plan, each lighting its plot and linking to the next in sequence.",
      sitePlan: "SITE PLAN",
      schedule: "SCHEDULE / THIS WEEK",
      placing: "placing",
      oneSchedule: "one schedule",
      days: ["MON", "TUE", "WED", "THU", "FRI"],
      cards: [
        {
          plate: "GRADE SITE",
          chip: "grade site / crew 1",
          meta: "crew 1 / plot A / mon",
          aria: "Work order: grade site, crew 1, plot A, scheduled Monday.",
        },
        {
          plate: "FORM FOOTINGS",
          chip: "form footings / crew 2",
          meta: "crew 2 / plot B / tue",
          aria: "Work order: form footings, crew 2, plot B, scheduled Tuesday.",
        },
        {
          plate: "REBAR DELIVERY",
          chip: "rebar delivery",
          meta: "materials / plot C / wed",
          aria: "Work order: rebar delivery, materials, plot C, scheduled Wednesday.",
        },
        {
          plate: "POUR SLAB",
          chip: "pour slab / crew 2",
          meta: "crew 2 / plot D / thu",
          aria: "Work order: pour slab, crew 2, plot D, scheduled Thursday.",
        },
        {
          plate: "INSPECTION",
          chip: "inspection",
          meta: "city / plot E / fri",
          aria: "Work order: inspection, city, plot E, scheduled Friday.",
        },
      ],
    },
  },
  diagDesc:
    "Ten business days looking at your operations, your site, and your demand as one system. You get a written memo, not a sales deck, telling you what is true, what is broken, and what to build first.",
  diagSpecs: [
    "**Day 1.** A working session on your operations, your site work, and your demand.",
    "**Days 2 to 9.** We dig: work orders, scheduling, site reporting, procurement, and the numbers behind your leads.",
    "**Day 10.** The memo lands: what is true, what is broken, what to build first.",
    "**Free, with no strings.** Act on it with us or without us. If we build, pricing is agreed up front.",
  ],
};

const es: typeof en = {
  meta: {
    title: "Sistemas para construcción",
    description:
      "Órdenes de trabajo, cuadrillas, materiales y obras en un solo tablero con calendario, hecho para empresas constructoras, con generación de prospectos calificados y precio por resultado.",
  },
  hero: {
    eyebrow: "Sectores / Construcción",
    title: "Cada cuadrilla, cada material, cada obra.",
    titleAccent: "Un solo tablero.",
    sub: "Construimos el sistema de operación y logística de una empresa constructora, así que sabemos cómo corre una obra de verdad: órdenes de trabajo, cuadrillas, materiales y avance de obra que viven en llamadas, mensajes y papel, conectados en un solo tablero con calendario que leen tanto la oficina como el campo. **Las órdenes sueltas se vuelven una secuencia en la que se puede confiar.**",
    dry: "Sí, una constructora que se llama Logística. El nombre puso la vara alta.",
    ctaGhost: "Vea lo que construimos",
  },
  value: {
    aria: "Lo que esto vale para una constructora",
    srTitle: "Lo que esto vale para usted",
    items: [
      {
        key: "Un terreno en el que ya construimos",
        lead: "Construimos el sistema de operación __con el que trabaja una constructora.__",
        body: "No es una promesa sobre una industria que podríamos aprender. Ya sabemos cómo se coordina una obra, desde la primera orden de trabajo hasta la inspección final.",
      },
      {
        key: "Oficina y campo, un solo tablero",
        lead: "El mismo calendario al día __que actualiza la cuadrilla y lee la oficina.__",
        body: "Sin cadena de llamadas para saber cómo va una obra. Un solo registro del que trabajan todos.",
      },
      {
        key: "Suyo",
        lead: "Enseñado a su equipo, __y suyo para quedarse.__",
        body: "Hecho alrededor de cómo ya opera, entregado a su gente, y sin suscripción por usuario que andar cuidando.",
      },
    ],
  },
  fleet: {
    kicker: "Flotilla y logística",
    title: "Cada vehículo en un solo mapa.",
    lead: "Cada vehículo corre en un solo mapa, así que la oficina ve dónde está cada uno sin una sola llamada. Cuando un camión llega a una obra, su llegada se registra sola en cuanto cruza el perímetro. El tablero se llena solo, y el día deja de correr a base de llamadas de rastreo.",
    note: "**Las llegadas se registran solas.** La oficina deja de andar llamando.",
  },
  caps: {
    kicker: "Lo que construimos",
    title: "Hecho para cómo corre una obra de verdad.",
    sub: "No es un CRM genérico doblado a la forma de una obra. Estas son las operaciones de las que vive una constructora, conectadas en un solo sistema que su equipo posee.",
    cards: [
      {
        idx: "01 / Flujo de trabajo",
        h: "Órdenes de trabajo y su flujo",
        body: "Las órdenes, llamadas y mensajes sueltos se vuelven un solo tablero con calendario. Cada trabajo carga un responsable, una fecha y un estado que toda la empresa puede ver, así que nada vive nada más en la cabeza de alguien o en un hilo de mensajes perdido.",
      },
      {
        idx: "02 / Programación",
        h: "Programación de cuadrillas y materiales",
        body: "Asigne cuadrillas y materiales contra la disponibilidad real. El tablero enseña el empalme o la entrega que falta antes de que le cueste un día en obra, no después de que la cuadrilla ya está parada.",
      },
      {
        idx: "03 / Visibilidad",
        h: "Seguimiento de obra y avance",
        body: "La oficina lee cómo va cada obra sin llamarle al campo. El avance diario, los bloqueos y las fotos llegan a un solo lugar, así que pedir un estado es un vistazo y no una interrupción en la tarde de alguien.",
      },
      {
        idx: "04 / Compras",
        h: "Compras y cotización",
        body: "Las partes rutinarias de comprar y cotizar se hacen solas: de la requisición a la orden de compra, de la cotización al trabajo, con recordatorios y seguimientos que ya no dependen de que alguien se acuerde. Tareas manuales convertidas en trabajo que se hace solo, con horas de vuelta cada mes.",
      },
      {
        idx: "05 / Demanda",
        h: "Demanda que primero mide",
        body: "Prospectos calificados para el trabajo del que sí quiere más. Manejamos los anuncios con el rigor de las agencias más serias, y revisamos que los números que entran sean reales antes de que alguien ajuste, para que toda decisión posterior descanse en algo cierto.",
      },
    ],
    demandNote:
      "Precio: **un porcentaje de la inversión en anuncios con un piso, o de las ventas que traen los anuncios cuando ya existe una medición en la que usted confía.** Cobramos cuando funciona.",
  },
  vis: {
    fleet: {
      depot: "PATIO",
      siteA: "OBRA A",
      siteB: "OBRA B",
      arrivals: "LLEGADAS",
      auto: "AUTO",
      logged: "registrada",
      at: " en ",
      fleet: "FLOTILLA",
      live: "AL DÍA",
      ready: "LISTO",
      status: "{n} vehículos en un solo mapa / las llegadas se registran solas",
      fallback:
        "Un mapa al día de sus obras y sus vehículos. Cada obra es un perímetro; cuando un vehículo entra, su llegada se registra sola, sin una llamada. Cada vehículo en un solo mapa.",
    },
    plan: {
      tagBefore: "órdenes sueltas",
      tagMid: "acomodadas en",
      tagAfter: "un solo programa",
      title: "Órdenes de trabajo acomodadas en un plano de obra y su programa semanal",
      descDesktop:
        "Un plano de obra visto desde arriba con cinco lotes está junto a una tira de programa semanal. Las tarjetas sueltas de orden de trabajo se van acomodando una por una en carriles con fecha; conforme cada una aterriza, su lote se enciende y una línea de dependencia la liga con la siguiente en secuencia. Enfoque una tarjeta colocada para levantar su lectura y encender su lote.",
      descPortrait:
        "Un plano de obra visto desde arriba con cinco lotes está sobre un programa semanal de cinco carriles con fecha. Las tarjetas sueltas de orden de trabajo se van acomodando una por una en los carriles; conforme cada una aterriza, su lote se enciende y una línea de dependencia la liga con la siguiente en secuencia. Enfoque una tarjeta colocada para levantar su lectura y encender su lote.",
      fallback:
        "Órdenes de trabajo sueltas, nivelar terreno, cimbra de zapatas, entrega de varilla, colado de losa e inspección, se acomodan una por una en carriles con fecha de un programa semanal junto a un plano de obra, cada una encendiendo su lote y ligándose con la siguiente en secuencia.",
      sitePlan: "PLANO DE OBRA",
      schedule: "PROGRAMA / ESTA SEMANA",
      placing: "acomodando",
      oneSchedule: "un solo programa",
      days: ["LUN", "MAR", "MIÉ", "JUE", "VIE"],
      cards: [
        {
          plate: "NIVELAR",
          chip: "nivelar terreno / cuadrilla 1",
          meta: "cuadrilla 1 / lote A / lun",
          aria: "Orden de trabajo: nivelar terreno, cuadrilla 1, lote A, programada para el lunes.",
        },
        {
          plate: "CIMENTACIÓN",
          chip: "cimbra de zapatas / cuadrilla 2",
          meta: "cuadrilla 2 / lote B / mar",
          aria: "Orden de trabajo: cimbra de zapatas, cuadrilla 2, lote B, programada para el martes.",
        },
        {
          plate: "ENTREGA VARILLA",
          chip: "entrega de varilla",
          meta: "materiales / lote C / mié",
          aria: "Orden de trabajo: entrega de varilla, materiales, lote C, programada para el miércoles.",
        },
        {
          plate: "COLADO",
          chip: "colado de losa / cuadrilla 2",
          meta: "cuadrilla 2 / lote D / jue",
          aria: "Orden de trabajo: colado de losa, cuadrilla 2, lote D, programada para el jueves.",
        },
        {
          plate: "INSPECCIÓN",
          chip: "inspección",
          meta: "municipio / lote E / vie",
          aria: "Orden de trabajo: inspección, municipio, lote E, programada para el viernes.",
        },
      ],
    },
  },
  diagDesc:
    "Diez días hábiles revisando su operación, sus obras y su demanda como un solo sistema. Usted recibe un informe escrito, no una presentación de ventas: qué es cierto, qué está roto y qué conviene construir primero.",
  diagSpecs: [
    "**Día 1.** Una sesión de trabajo sobre su operación, su trabajo en obra y su demanda.",
    "**Días 2 a 9.** Escarbamos: órdenes de trabajo, programación, reportes de obra, compras y los números detrás de sus prospectos.",
    "**Día 10.** Llega el informe: qué es cierto, qué está roto y qué construir primero.",
    "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda desde el principio.",
  ],
};

export type ConstructionDict = typeof en;
export const construction: Dict<ConstructionDict> = { en, es };
