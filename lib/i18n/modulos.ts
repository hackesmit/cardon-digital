import type { Dict } from "./rich";

/**
 * The modules page: Produccion, Hospitalidad and Restaurante, what each one
 * solves, its feature list by size, who it is for, and the seven ways they
 * combine.
 *
 * Every feature line, every size band and every bridge on this page comes from
 * the module catalogue. No figure lives here: prices are on /precios, which is
 * the only page that prints them, and this dictionary carries exactly one line
 * that points at it.
 */

/** One module's copy. Produccion carries the grower set and Restaurante the
    exclusions list, so both are optional and the other two modules omit them. */
export type ModuleCopy = {
  id: string;
  num: string;
  name: string;
  tag: string;
  problem: { h: string; body: string; answer: string };
  who: {
    h: string;
    body: string;
    grower?: { h: string; items: string[]; note: string };
  };
  features: {
    h: string;
    base: { label: string; items: string[] };
    adds: { label: string; items: string[] }[];
    also: { label: string; items: string[] };
  };
  sizes: { h: string; rows: { key: string; body: string }[] };
  policy: string;
  exclusions?: { h: string; body: string };
  demo: string;
};

/** One line of the combinations list. A single module has no bridge. */
export type CombinaItem = {
  key: string;
  kind: "single" | "mix";
  line: string;
};

const en = {
  meta: {
    title: "The three modules",
    description:
      "Produccion, Hospitalidad and Restaurante: the winery record, the lodging calendar and the point of sale. Buy one, two or three, at the size your operation is, and the bridges between them come with the mix.",
  },

  hero: {
    aria: "Introduction",
    eyebrow: "The system, by module",
    t1: "Three modules. ",
    accent: "You buy the ones you run on.",
    sub: "Produccion is the record of what you grew, made and sold. Hospitalidad is every booking from every channel in one calendar. Restaurante is the point of sale, from the waiter's phone to the cash cut. **Each one is a whole system on its own, and each one is sized to the operation in front of it.**",
    ctaDemo: "See the demos",
    ctaCombina: "How they combine",
  },

  /** The one line on this page that touches price, and it only points away. */
  priceLine:
    "Every module has a published entry price, setup and monthly, and the combination and annual rules are written out in full. **They all live on the pricing page.**",
  priceCta: "See pricing",

  demoNote:
    "The demos run on a made-up brand with illustrative data, and each one opens with a single module switched on. **They open shortly; the buttons are here so you know where they will be.**",
  demoSoon: "coming",

  sizesLead: "Size is set per module, so an operation can be M on one and S on another.",

  modules: [
    {
      id: "produccion",
      num: "01",
      name: "Produccion",
      tag: "The record of the harvest, the cellar and the sale",
      problem: {
        h: "The vintage is real and the record of it is not.",
        body: "Weights arrive on a phone, lab results live in a notebook, tank movements are remembered rather than written, and the commercial side sits in a different file again. By the time anyone asks how this year compares with the last three, the answer has to be rebuilt from memory and from four exports that disagree.",
        answer:
          "Produccion is the winery's own record of what it grew, made and sold, dated and attributed, with the comparison, the report and the assistant built on top of it. **One record, and every question answered from it.**",
      },
      who: {
        h: "Who it is for",
        body: "Winemakers and grape growers. A grower gets a different feature set at the same rates, built around blocks, applications, irrigation and deliveries to buyers instead of tanks, barrels and a bottling line. It is another set of features, not a cut-down one.",
        grower: {
          h: "The grower set",
          items: [
            "Vineyard block record: blocks, varietals, rootstock, planting dates and area, with every field event dated and attributed",
            "Maturity and phenology curve: sampling results plotted against days from budbreak, this season beside prior seasons",
            "Delivery and buyer record: loads by block and buyer, weights, sugar and pH at reception, price terms and payment status",
            "Applications and compliance log: sprays and doses, pre-harvest intervals, who applied, the evidence a certification audit asks for",
            "Irrigation and water register: irrigation events and water use, captured by hand when no controller exposes data",
            "The report generator, the assistant, and the training and handover pack, the same as the cellar set",
          ],
          note: "**A weather station or an irrigation controller is read as a data source when it already exposes its data.** When it does not, the register is kept by hand. We do not buy, install, own or warrant hardware, and no quote carries a device that was not checked at the Diagnostico.",
        },
      },
      features: {
        h: "What is built, by size",
        base: {
          label: "At S, the entry build",
          items: [
            "Production record: schema, ingestion for the first two sources, and the core views, weights, lots, tanks, lab, barrel and bottling, dated and attributed",
            "Vintage comparison: any measure plotted against days post-veraison, this year beside prior years",
            "Commercial record: tasting room visits, club members, direct sales and distributor orders, next to production",
            "Historical vintage load: one prior vintage brought in from digital sources the winery already holds",
            "Monthly report generator: the plain-Spanish monthly report built from live data, with a delta section",
            "The assistant: grounded question answering over your own records, with an audit log and a refusal when the record does not hold the answer",
            "Training and handover pack: role-scoped Spanish documentation, recorded walkthroughs, credential handover and a competence check",
          ],
        },
        adds: [
          {
            label: "M adds",
            items: [
              "Two more data source connectors, each mapped and validated",
              "A second historical vintage",
            ],
          },
          {
            label: "L adds",
            items: [
              "A third extra data source connector, for five or more sources in total",
              "Prior vintages up to four seasons back",
              "A prediction or classification model tuned to house standards, harvest readiness or quality",
              "Finance workflow automation on your reporting",
            ],
          },
        ],
        also: {
          label: "Also available",
          items: [
            "An existing ERP integrated into the data-system features",
            "More than one production site",
          ],
        },
      },
      sizes: {
        h: "The sizes",
        rows: [
          {
            key: "S",
            body: "One production site, one brand, one or two data sources, no more than about 20 lots. For a grower: one ranch, one or two sources, up to about 30 blocks.",
          },
          {
            key: "M",
            body: "Several lots and varietals, the tasting room and direct sales in the record, three or four data sources, an existing site that needs real changes. For a grower: two or three ranches, three or four sources, deliveries to more than one buyer.",
          },
          {
            key: "L",
            body: "Multi-origin, five or more data sources, a model and finance workflow automation.",
          },
        ],
      },
      policy:
        "**On Produccion we organise data, control and automation. We do not build a winery's sales.** There is no version of this module that carries a site, conversion tracking or an ads build; those attach to Hospitalidad and to Restaurante, which are the modules that sell a thing a guest books.",
      demo: "Open the Produccion demo",
    },

    {
      id: "hospitalidad",
      num: "02",
      name: "Hospitalidad",
      tag: "Every booking in one calendar, and the day the property works from",
      problem: {
        h: "Four channels, four calendars, and one room.",
        body: "The bookings land in as many places as there are channels, the arrivals for tomorrow are counted by hand, housekeeping is told by phone, the guest who came last season is a name somebody half remembers, and the revenue by channel is a spreadsheet rebuilt at the end of every month.",
        answer:
          "Hospitalidad puts every booking from every channel into one calendar, with the day view the property actually works from, the state of each unit, the guest kept between stays, and occupancy and revenue that reconcile. **One calendar, and a day that is already counted when it starts.**",
      },
      who: {
        h: "Who it is for",
        body: "Properties with rooms, cabins or casitas, from a six-unit house up to forty units across more than one property. A winery with rooms, a tasting room and events belongs here too: this is the module that owns bookings and guests.",
      },
      features: {
        h: "What is built, by size",
        base: {
          label: "At S, the entry build",
          items: [
            "Unit and stay record: units, stays and guests, the schema every other feature reads, dated and attributed",
            "Two channel feed connectors: each booking channel read into normalised stays, deduplicated, with a freshness stamp",
            "Master calendar: units by days, each stay coloured by channel, month navigation, usable on a phone",
            "Day view: arrivals, departures, units occupied tonight and cleanings pending, on one screen",
            "Unit status board and housekeeping phone view: unit states, cleaning tasks generated from departures, marked done from a phone",
            "Guest record: notes and stay history attached to the guest, kept between stays",
            "Occupancy and revenue by channel: nights sold over nights available, revenue by channel and month, with the count of stays still missing an amount shown",
            "Monthly report generator, the assistant, and the training and handover pack for host, housekeeping and admin",
          ],
        },
        adds: [
          {
            label: "M adds",
            items: [
              "A third channel feed connector",
              "Direct booking capture: an enquiry or booking path captured straight into the stay record and tracked",
              "Channel manager connector: replaces the read-only feeds, bringing guest names, amounts and webhooks with it",
              "A prior season loaded from channel exports the property already holds",
            ],
          },
          {
            label: "L adds",
            items: [
              "A fourth channel feed connector",
              "A second prior season loaded",
            ],
          },
        ],
        also: {
          label: "Also available",
          items: [
            "Tasting room and event booking capture: visits, tastings and events booked into the same record and tracked, from M",
            "Automated follow-up on direct bookings, repeat guests and the wine club, from M",
            "A brochure or booking site wired to the stay record and to tracking, in Spanish and English",
            "Conversion tracking and GA4, owned by you",
            "A Google Ads build and its monthly management, from M",
          ],
        },
      },
      sizes: {
        h: "The sizes",
        rows: [
          {
            key: "S",
            body: "Up to 6 units, up to 2 channels, one property, no channel manager.",
          },
          {
            key: "M",
            body: "7 to 20 units, up to 3 channels, one or two properties, a channel manager or a direct booking path.",
          },
          {
            key: "L",
            body: "21 to 40 units across more than one property, 4 or more channels, a channel manager, direct booking and ads.",
          },
          {
            key: "Above 40",
            body: "Not a client we take. A property that size has a property management system, a revenue manager and a procurement process, and it is better served by them. We say so in the Diagnostico rather than quoting work we would not do well.",
          },
        ],
      },
      policy:
        "**How the channel read works, said plainly.** At the entry build we read each channel's calendar, so guest names and amounts are captured by hand until a channel manager is contracted, and the count of stays still missing an amount is shown on the occupancy view rather than hidden. The system never writes back to a channel. The cleaning task is generated from the departure date, and who cleans is the property's own arrangement.",
      demo: "Open the Hospitalidad demo",
    },

    {
      id: "restaurante",
      num: "03",
      name: "Restaurante",
      tag: "From the waiter's phone to the cash cut",
      problem: {
        h: "The order is written twice and the night is counted at midnight.",
        body: "The order goes on a pad, then onto a ticket, then into a till. The kitchen works from paper and shouting. A table waits for a bill that has to be added up by hand, and a split one waits longer. At close, the cash is counted against a number nobody can rebuild, and the comps and cancellations are whatever people remember.",
        answer:
          "Restaurante is the point of sale: the order is born on the waiter's phone, travels to the kitchen screen, is paid at the table with the bill split and the tip kept apart from the sale, and the day closes with a cut that reconciles. **Written once, at the table, and counted as it happens.**",
      },
      who: {
        h: "Who it is for",
        body: "Owner-run dining rooms, from a twelve-table room up to sixty tables and three or more stations. One branch: a group running several is not what this module is built for, at any size.",
      },
      features: {
        h: "What is built, by size",
        base: {
          label: "At S, the entry build",
          items: [
            "Menu, categories and modifiers: the menu tree, modifier groups and prices, with 86 marked from any phone and gone from every phone at once",
            "Order taking on the waiter's phone: by table and by seat, grouped by course, line notes, live subtotal",
            "Send to kitchen and course firing: a line or a whole course sent, sent lines locked, the waiter fires the next course",
            "Kitchen screen: queue oldest first, capture time, elapsed minutes, table and waiter, colour and text thresholds, bump and recall, and a warning when it loses sync",
            "Table map and host screen: zones and real table shapes, covers, arrival time, occupancy minutes, state and turn time",
            "Checkout with split and tip: whole bill, by seat, evenly between several or by amount, with the tip stored apart from the sale",
            "Cash and card recorded by hand: works on day one with no third party, cash received and change, card written down as taken",
            "Invoice request capture: RFC, razon social, regimen fiscal, uso de CFDI and email captured on the ticket",
            "Cancellations and comps log: every one with its reason and who authorised it, listed one by one",
            "Daily summary and cash cut: sale by category, hour and waiter, covers, average ticket, tips, the ten best sellers, opening float, declared cash and the difference",
            "Monthly report generator, the assistant, and the training and handover pack for waiter, kitchen, host and admin",
          ],
        },
        adds: [
          {
            label: "M adds",
            items: [
              "Station split: bar, hot and cold queues, with an expediter view over all three",
              "Payment link and QR connector, on the restaurant's own provider account",
              "Table reservation seating: the day's reservations by hour, with a seat button that opens the table session",
              "The menu and prior sales loaded from an export the restaurant already holds",
            ],
          },
          {
            label: "L adds",
            items: [
              "Card payment reconciliation: the day's card sales matched to the provider's transaction report by our own reference, gross reported against the deposit net of commission and tax",
            ],
          },
        ],
        also: {
          label: "Also available",
          items: [
            "A brochure or booking site wired to the record and to tracking, in Spanish and English",
            "Conversion tracking and GA4, owned by you",
            "A Google Ads build and its monthly management, from M",
          ],
        },
      },
      sizes: {
        h: "The sizes",
        rows: [
          {
            key: "S",
            body: "Up to 12 tables, up to about 80 covers a day, one station, up to 4 phones and one kitchen screen.",
          },
          {
            key: "M",
            body: "13 to 30 tables, up to about 200 covers a day, two or three stations, up to 10 phones and two screens.",
          },
          {
            key: "L",
            body: "31 to 60 tables, above 200 covers a day, three or more stations plus an expediter, more than 10 phones and three or more screens.",
          },
          {
            key: "The tie-breaker",
            body: "Covers a day decides when the tables and the devices point at different sizes, because what the month costs to run tracks service volume rather than furniture.",
          },
        ],
      },
      policy:
        "**Payments and invoicing, stated exactly.** Cash and a card recorded by hand work from day one, with no third party involved, because a restaurant that cannot write down that a table paid by card has not bought a point of sale. Where the restaurant has its own payment provider account and can issue its own credentials, a payment link and its QR at the table is a connector quoted on top, one per provider, and the bill turns paid only when an authenticated status query returns the completed state. The invoice request is captured on the ticket; the stamping is done by your own invoicing provider and we never imply otherwise.",
      exclusions: {
        h: "What this module does not do",
        body: "Named here rather than discovered later: guest self-service ordering by QR, ingredient inventory and recipe costing, our own CFDI stamping, physical card terminals, thermal ticket printing, happy-hour price rules, payroll and tip distribution, and more than one branch.",
      },
      demo: "Open the Restaurante demo",
    },
  ] as ModuleCopy[],

  combina: {
    kicker: "The seven combinations",
    title: "One, two or three, and the bridges come with the mix.",
    sub: "Buy the modules you run on. **A bridge is only built when both of the modules it joins are bought**, and what each one adds is one sentence long.",
    single: "On its own",
    bridge: "The bridge",
    items: [
      {
        key: "Produccion",
        kind: "single",
        line: "The record of what you grew, made and sold, the vintage comparison, the monthly report and the assistant over your own cellar.",
      },
      {
        key: "Hospitalidad",
        kind: "single",
        line: "Every channel in one calendar, the day view the property works from, the unit board, the guest kept between stays and revenue by channel.",
      },
      {
        key: "Restaurante",
        kind: "single",
        line: "The order on the phone, the kitchen screen, the table map, the table paid with the bill split, and a day that closes with a cut.",
      },
      {
        key: "Produccion and Hospitalidad",
        kind: "mix",
        line: "The tasting room, the events and the club are booked in Hospitalidad, and those visits and direct sales sit next to production in the commercial record, so the season and what it sold are one record.",
      },
      {
        key: "Produccion and Restaurante",
        kind: "mix",
        line: "The house wine list reads live from the cellar by vintage and varietal, so what the dining room offers is what the cellar actually holds. It reads only: the cellar record stays the cellar's.",
      },
      {
        key: "Hospitalidad and Restaurante",
        kind: "mix",
        line: "Charges from the restaurant post to the room, and a guest's table booking shows on their stay, so the host sees the guest and the stay sees the table.",
      },
      {
        key: "All three",
        kind: "mix",
        line: "All three bridges at once: the guest arrives, books a table, charges dinner to the room and drinks a wine the cellar knows by vintage, and the tasting room visit lands next to the season that produced it.",
      },
    ] as CombinaItem[],
    foot: "The service base is charged once whatever the mix, and a module added to a client we already serve is a smaller build than the same module bought alone, because the training, the assistant frame, the report and the environment are already standing.",
  },

  diagDesc:
    "Which modules, at which size, is a question the Diagnostico answers before anyone quotes anything. **Ten working days going through your data, your bookings, your floor and your numbers as one system.** You get a written memo: what is true, what is broken and what is worth building first.",
  diagSpecs: [
    "**Day 1.** A working session over the operation you actually run, module by module.",
    "**Days 2 to 9.** We dig: the sources, the channels, the floor, the measurement and the numbers behind the numbers.",
    "**Day 10.** The memo lands: what is true, what is broken, and which module earns its place first.",
    "**Free and unattached.** Use it with us or without us. If we build, the price is agreed at the start and you own the result.",
  ],
};

const es: typeof en = {
  meta: {
    title: "Los tres modulos",
    description:
      "Produccion, Hospitalidad y Restaurante: el registro de la bodega, el calendario del hospedaje y el punto de venta. Se compra uno, dos o tres, del tamano de la operacion, y los puentes entre ellos vienen con la combinacion.",
  },

  hero: {
    aria: "Introducción",
    eyebrow: "El sistema, por módulo",
    t1: "Tres módulos. ",
    accent: "Usted compra los que opera.",
    sub: "Producción es el registro de lo que cultivó, elaboró y vendió. Hospitalidad es cada reserva de cada canal en un solo calendario. Restaurante es el punto de venta, del teléfono del mesero hasta el corte de caja. **Cada uno es un sistema completo por su cuenta, y cada uno se dimensiona a la operación que tiene enfrente.**",
    ctaDemo: "Ver los demos",
    ctaCombina: "Cómo se combinan",
  },

  priceLine:
    "Cada módulo tiene un precio de entrada publicado, implementación y mensualidad, y las reglas de combinación y de pago anual están escritas completas. **Todo eso vive en la página de precios.**",
  priceCta: "Ver precios",

  demoNote:
    "Los demos corren sobre una marca ficticia con datos ilustrativos, y cada uno abre con un solo módulo encendido. **Abren en breve; los botones están aquí para que sepa dónde van a estar.**",
  demoSoon: "pronto",

  sizesLead:
    "El tamaño se fija por módulo, así que una operación puede ser M en uno y S en otro.",

  modules: [
    {
      id: "produccion",
      num: "01",
      name: "Producción",
      tag: "El registro de la cosecha, la cava y la venta",
      problem: {
        h: "La añada es real y el registro de la añada no lo es.",
        body: "Los pesos llegan por teléfono, los resultados de laboratorio viven en una libreta, los movimientos de tanque se recuerdan en vez de escribirse, y la parte comercial está en otro archivo más. Para cuando alguien pregunta cómo va este año contra los tres anteriores, la respuesta se reconstruye de memoria y de cuatro exportaciones que no coinciden.",
        answer:
          "Producción es el registro propio de la bodega sobre lo que cultivó, elaboró y vendió, fechado y atribuido, con la comparación, el informe y el asistente construidos encima. **Un solo registro, y cada pregunta contestada desde ahí.**",
      },
      who: {
        h: "Para quién es",
        body: "Bodegas y productores de uva. El productor recibe otro conjunto de funciones a las mismas tarifas, armado alrededor de parcelas, aplicaciones, riego y entregas a compradores en vez de tanques, barricas y línea de embotellado. Es otro conjunto, no uno recortado.",
        grower: {
          h: "El conjunto para el productor",
          items: [
            "Registro de parcelas: parcelas, variedades, portainjerto, fechas de plantación y superficie, con cada evento de campo fechado y atribuido",
            "Curva de madurez y fenología: los muestreos graficados contra días desde brotación, esta temporada junto a las anteriores",
            "Registro de entregas y compradores: cargas por parcela y por comprador, pesos, azúcar y pH en recepción, condiciones de precio y estado de pago",
            "Registro de aplicaciones y cumplimiento: aspersiones y dosis, intervalos de precosecha, quién aplicó, y la evidencia que pide una auditoría de certificación",
            "Registro de riego y agua: eventos de riego y consumo, capturados a mano cuando ningún controlador expone datos",
            "El generador del informe, el asistente y el paquete de capacitación y entrega, igual que en el conjunto de la bodega",
          ],
          note: "**Una estación meteorológica o un controlador de riego se leen como una fuente de datos cuando ya exponen su información.** Cuando no la exponen, el registro se lleva a mano. No compramos, instalamos, poseemos ni garantizamos equipo, y ninguna cotización trae un aparato que no se haya revisado en el Diagnóstico.",
        },
      },
      features: {
        h: "Qué se construye, por tamaño",
        base: {
          label: "En S, la construcción de entrada",
          items: [
            "Registro de producción: esquema, ingesta de las dos primeras fuentes y las vistas centrales, pesos, lotes, tanques, laboratorio, barrica y embotellado, fechado y atribuido",
            "Comparación de añadas: cualquier medida graficada contra días post envero, este año junto a los años anteriores",
            "Registro comercial: visitas a sala de degustación, socios del club, venta directa y pedidos de distribuidores, al lado de la producción",
            "Carga de añada histórica: una añada anterior traída de fuentes digitales que la bodega ya tiene",
            "Generador del informe mensual: el informe en español claro construido con datos vivos, con su sección de cambios",
            "El asistente: respuestas fundamentadas en el registro propio, con cada consulta y su respuesta guardadas para auditoría, y una negativa cuando el registro no tiene la respuesta",
            "Paquete de capacitación y entrega: documentación en español por rol, recorridos grabados, entrega de credenciales y una prueba de competencia",
          ],
        },
        adds: [
          {
            label: "M agrega",
            items: [
              "Dos conectores más de fuentes de datos, cada uno mapeado y validado",
              "Una segunda añada histórica",
            ],
          },
          {
            label: "L agrega",
            items: [
              "Un tercer conector adicional de fuente de datos, para cinco o más fuentes en total",
              "Añadas anteriores hasta cuatro temporadas atrás",
              "Un modelo de predicción o clasificación ajustado al estándar de la casa, madurez de cosecha o calidad",
              "Automatización del flujo financiero sobre su reporteo",
            ],
          },
        ],
        also: {
          label: "También disponible",
          items: [
            "Un ERP existente integrado a las funciones de datos",
            "Más de un sitio de producción",
          ],
        },
      },
      sizes: {
        h: "Los tamaños",
        rows: [
          {
            key: "S",
            body: "Un sitio de producción, una marca, una o dos fuentes de datos, no más de unos 20 lotes. Para un productor: un rancho, una o dos fuentes, hasta unas 30 parcelas.",
          },
          {
            key: "M",
            body: "Varios lotes y variedades, la sala de degustación y la venta directa dentro del registro, tres o cuatro fuentes de datos, un sitio existente que necesita cambios de fondo. Para un productor: dos o tres ranchos, tres o cuatro fuentes, entregas a más de un comprador.",
          },
          {
            key: "L",
            body: "Multi origen, cinco o más fuentes de datos, un modelo y automatización del flujo financiero.",
          },
        ],
      },
      policy:
        "**En Producción ordenamos datos, control y automatización. No construimos la venta de la bodega.** No existe una versión de este módulo que traiga sitio, medición de conversiones ni construcción de anuncios: eso se acopla a Hospitalidad y a Restaurante, que son los módulos que venden algo que un huésped reserva.",
      demo: "Abrir el demo de Producción",
    },

    {
      id: "hospitalidad",
      num: "02",
      name: "Hospitalidad",
      tag: "Cada reserva en un calendario, y el día desde el que trabaja la propiedad",
      problem: {
        h: "Cuatro canales, cuatro calendarios y un cuarto.",
        body: "Las reservas caen en tantos lugares como canales hay, las llegadas de mañana se cuentan a mano, a limpieza se le avisa por teléfono, el huésped que vino la temporada pasada es un nombre que alguien medio recuerda, y el ingreso por canal es una hoja de cálculo que se rehace a fin de mes.",
        answer:
          "Hospitalidad pone cada reserva de cada canal en un solo calendario, con la vista del día desde la que la propiedad realmente trabaja, el estado de cada unidad, el huésped conservado entre estancias, y ocupación e ingreso que cuadran. **Un calendario, y un día que ya está contado cuando empieza.**",
      },
      who: {
        h: "Para quién es",
        body: "Propiedades con cuartos, cabañas o casitas, desde una casa de seis unidades hasta cuarenta unidades en más de una propiedad. Una bodega con cuartos, sala de degustación y eventos también entra aquí: este es el módulo dueño de las reservas y de los huéspedes.",
      },
      features: {
        h: "Qué se construye, por tamaño",
        base: {
          label: "En S, la construcción de entrada",
          items: [
            "Registro de unidades y estancias: unidades, estancias y huéspedes, el esquema que leen todas las demás funciones, fechado y atribuido",
            "Dos conectores de canal: cada canal de reservas leído a estancias normalizadas, sin duplicados y con sello de frescura",
            "Calendario maestro: unidades por días, cada estancia con el color de su canal, navegación por mes, usable en teléfono",
            "Vista del día: llegadas, salidas, unidades ocupadas esta noche y limpiezas pendientes, en una sola pantalla",
            "Tablero de unidades y vista de limpieza en teléfono: el estado de cada unidad, tareas de limpieza generadas desde las salidas, marcadas como hechas desde el teléfono",
            "Registro del huésped: notas e historial de estancias pegados al huésped, conservados entre estancias",
            "Ocupación e ingreso por canal: noches vendidas sobre noches disponibles, ingreso por canal y mes, con el conteo de estancias que aún no traen importe a la vista",
            "Generador del informe mensual, el asistente y el paquete de capacitación y entrega para recepción, limpieza y administración",
          ],
        },
        adds: [
          {
            label: "M agrega",
            items: [
              "Un tercer conector de canal",
              "Captura de reserva directa: una ruta de contacto o de reserva capturada directo al registro de estancias y medida",
              "Conector de channel manager: reemplaza las lecturas de solo lectura y trae con él nombres de huésped, importes y webhooks",
              "Una temporada anterior cargada desde exportaciones de canal que la propiedad ya tiene",
            ],
          },
          {
            label: "L agrega",
            items: [
              "Un cuarto conector de canal",
              "Una segunda temporada anterior cargada",
            ],
          },
        ],
        also: {
          label: "También disponible",
          items: [
            "Captura de reservas de sala de degustación y eventos: visitas, catas y eventos reservados en el mismo registro y medidos, desde M",
            "Seguimiento automatizado a reservas directas, huéspedes que regresan y el club de vino, desde M",
            "Un sitio de presentación o de reservas conectado al registro de estancias y a la medición, en español e inglés",
            "Medición de conversiones y GA4, propiedad de usted",
            "Construcción de Google Ads y su manejo mensual, desde M",
          ],
        },
      },
      sizes: {
        h: "Los tamaños",
        rows: [
          {
            key: "S",
            body: "Hasta 6 unidades, hasta 2 canales, una propiedad, sin channel manager.",
          },
          {
            key: "M",
            body: "De 7 a 20 unidades, hasta 3 canales, una o dos propiedades, un channel manager o una ruta de reserva directa.",
          },
          {
            key: "L",
            body: "De 21 a 40 unidades en más de una propiedad, 4 canales o más, channel manager, reserva directa y anuncios.",
          },
          {
            key: "Arriba de 40",
            body: "No es un cliente que tomemos. Una propiedad de ese tamaño ya tiene un sistema de gestión hotelera, un revenue manager y un proceso de compras, y queda mejor servida por ellos. Lo decimos en el Diagnóstico en vez de cotizar trabajo que no haríamos bien.",
          },
        ],
      },
      policy:
        "**Cómo se lee el canal, dicho claro.** En la construcción de entrada leemos el calendario de cada canal, así que los nombres de huésped y los importes se capturan a mano hasta que se contrata un channel manager, y el conteo de estancias que aún no traen importe se muestra en la vista de ocupación en vez de esconderse. El sistema nunca escribe de vuelta al canal. La tarea de limpieza se genera desde la fecha de salida, y quién limpia es el arreglo propio de la propiedad.",
      demo: "Abrir el demo de Hospitalidad",
    },

    {
      id: "restaurante",
      num: "03",
      name: "Restaurante",
      tag: "Del teléfono del mesero al corte de caja",
      problem: {
        h: "La comanda se escribe dos veces y la noche se cuenta a medianoche.",
        body: "La orden va a una libreta, luego a una comanda, luego a una caja. La cocina trabaja con papel y con gritos. Una mesa espera una cuenta que hay que sumar a mano, y una cuenta dividida espera más. Al cierre, el efectivo se cuenta contra un número que nadie puede reconstruir, y las cancelaciones y cortesías son lo que la gente recuerde.",
        answer:
          "Restaurante es el punto de venta: la orden nace en el teléfono del mesero, viaja a la pantalla de cocina, se paga en la mesa con la cuenta dividida y la propina guardada aparte de la venta, y el día cierra con un corte que cuadra. **Escrito una vez, en la mesa, y contado conforme pasa.**",
      },
      who: {
        h: "Para quién es",
        body: "Comedores de dueño, desde un salón de doce mesas hasta sesenta mesas y tres estaciones o más. Una sola sucursal: un grupo que opera varias no es para lo que está hecho este módulo, en ningún tamaño.",
      },
      features: {
        h: "Qué se construye, por tamaño",
        base: {
          label: "En S, la construcción de entrada",
          items: [
            "Menú, categorías y modificadores: el árbol del menú, los grupos de modificadores y los precios, con el 86 marcado desde cualquier teléfono y desaparecido de todos a la vez",
            "Toma de orden en el teléfono del mesero: por mesa y por asiento, agrupada por tiempo, notas de línea y subtotal vivo",
            "Envío a cocina y disparo de tiempos: una línea o un tiempo completo enviado, las líneas enviadas bloqueadas, y el mesero dispara el siguiente tiempo",
            "Pantalla de cocina: fila de lo más viejo primero, hora de captura, minutos transcurridos, mesa y mesero, umbrales por color y texto, entregar y recuperar, y un aviso cuando pierde sincronía",
            "Mapa de mesas y pantalla de recepción: zonas y formas reales de mesa, comensales, hora de llegada, minutos de ocupación, estado y tiempo de rotación",
            "Cobro con división y propina: cuenta entera, por asiento, en partes iguales entre varios o por monto, con la propina guardada aparte de la venta",
            "Efectivo y tarjeta registrada a mano: funciona el día uno sin terceros, efectivo recibido y cambio, tarjeta anotada como cobrada",
            "Captura de solicitud de factura: RFC, razón social, régimen fiscal, uso de CFDI y correo capturados en el ticket",
            "Registro de cancelaciones y cortesías: cada una con su motivo y quién la autorizó, listadas una por una",
            "Resumen diario y corte de caja: venta por categoría, por hora y por mesero, comensales, ticket promedio, propinas, los diez más vendidos, fondo de apertura, efectivo declarado y la diferencia",
            "Generador del informe mensual, el asistente y el paquete de capacitación y entrega para mesero, cocina, recepción y administración",
          ],
        },
        adds: [
          {
            label: "M agrega",
            items: [
              "División por estación: barra, caliente y fría, con una vista de expedidor sobre las tres",
              "Conector de liga de pago y QR, sobre la cuenta propia del restaurante con su proveedor",
              "Acomodo de reservaciones: las reservaciones del día por hora, con un botón para sentar que abre la sesión de la mesa",
              "El menú y las ventas anteriores cargadas desde una exportación que el restaurante ya tiene",
            ],
          },
          {
            label: "L agrega",
            items: [
              "Conciliación de pagos con tarjeta: la venta con tarjeta del día casada contra el reporte de transacciones del proveedor por nuestra propia referencia, con el bruto reportado contra el depósito neto de comisión e impuesto",
            ],
          },
        ],
        also: {
          label: "También disponible",
          items: [
            "Un sitio de presentación o de reservas conectado al registro y a la medición, en español e inglés",
            "Medición de conversiones y GA4, propiedad de usted",
            "Construcción de Google Ads y su manejo mensual, desde M",
          ],
        },
      },
      sizes: {
        h: "Los tamaños",
        rows: [
          {
            key: "S",
            body: "Hasta 12 mesas, hasta unos 80 comensales al día, una estación, hasta 4 teléfonos y una pantalla de cocina.",
          },
          {
            key: "M",
            body: "De 13 a 30 mesas, hasta unos 200 comensales al día, dos o tres estaciones, hasta 10 teléfonos y dos pantallas.",
          },
          {
            key: "L",
            body: "De 31 a 60 mesas, arriba de 200 comensales al día, tres estaciones o más con expedidor, más de 10 teléfonos y tres pantallas o más.",
          },
          {
            key: "El desempate",
            body: "Los comensales al día deciden cuando las mesas y los equipos apuntan a tamaños distintos, porque lo que cuesta sostener el mes sigue al volumen de servicio y no a los muebles.",
          },
        ],
      },
      policy:
        "**Pagos y facturación, dicho exacto.** El efectivo y la tarjeta anotada a mano funcionan desde el día uno, sin terceros de por medio, porque un restaurante que no puede anotar que una mesa pagó con tarjeta no compró un punto de venta. Donde el restaurante tiene su propia cuenta con un proveedor de pagos y puede emitir sus credenciales, la liga de pago con su QR en la mesa es un conector que se cotiza aparte, uno por proveedor, y la cuenta se marca pagada solo cuando una consulta de estado autenticada regresa el estado completado. La solicitud de factura se captura en el ticket; el timbrado lo hace su propio proveedor de facturación y nunca damos a entender otra cosa.",
      exclusions: {
        h: "Lo que este módulo no hace",
        body: "Dicho aquí en vez de descubrirse después: autoservicio del comensal por QR, inventario de insumos y costeo de recetas, timbrado de CFDI propio, terminales físicas de tarjeta, impresión de tickets térmicos, reglas de precio de happy hour, nómina y reparto de propinas, y más de una sucursal.",
      },
      demo: "Abrir el demo de Restaurante",
    },
  ] as ModuleCopy[],

  combina: {
    kicker: "Las siete combinaciones",
    title: "Uno, dos o tres, y los puentes vienen con la combinación.",
    sub: "Se compran los módulos que se operan. **Un puente solo se construye cuando se compran los dos módulos que une**, y lo que agrega cada uno cabe en una frase.",
    single: "Por su cuenta",
    bridge: "El puente",
    items: [
      {
        key: "Producción",
        kind: "single",
        line: "El registro de lo que cultivó, elaboró y vendió, la comparación de añadas, el informe mensual y el asistente sobre su propia cava.",
      },
      {
        key: "Hospitalidad",
        kind: "single",
        line: "Cada canal en un calendario, la vista del día desde la que trabaja la propiedad, el tablero de unidades, el huésped conservado entre estancias e ingreso por canal.",
      },
      {
        key: "Restaurante",
        kind: "single",
        line: "La orden en el teléfono, la pantalla de cocina, el mapa de mesas, la mesa cobrada con la cuenta dividida, y un día que cierra con un corte.",
      },
      {
        key: "Producción y Hospitalidad",
        kind: "mix",
        line: "La sala de degustación, los eventos y el club se reservan en Hospitalidad, y esas visitas y ventas directas quedan al lado de la producción en el registro comercial, así la temporada y lo que vendió son un mismo registro.",
      },
      {
        key: "Producción y Restaurante",
        kind: "mix",
        line: "La carta de vinos de la casa se lee viva desde la cava por añada y varietal, así lo que ofrece el comedor es lo que la cava realmente tiene. Es de solo lectura: el registro de la cava sigue siendo de la cava.",
      },
      {
        key: "Hospitalidad y Restaurante",
        kind: "mix",
        line: "Los consumos del restaurante se cargan al cuarto, y la reservación de mesa de un huésped aparece en su estancia, así recepción ve al huésped y la estancia ve la mesa.",
      },
      {
        key: "Los tres",
        kind: "mix",
        line: "Los tres puentes a la vez: el huésped llega, reserva mesa, carga la cena al cuarto y toma un vino que la cava conoce por añada, y la visita a la sala de degustación queda junto a la temporada que la produjo.",
      },
    ] as CombinaItem[],
    foot: "La base del servicio se cobra una sola vez sea cual sea la combinación, y un módulo agregado a un cliente que ya atendemos es una construcción más chica que ese mismo módulo comprado solo, porque la capacitación, el marco del asistente, el informe y el ambiente ya están de pie.",
  },

  diagDesc:
    "Cuáles módulos, en qué tamaño, es una pregunta que el Diagnóstico contesta antes de que nadie cotice nada. **Diez días hábiles recorriendo sus datos, sus reservas, su piso y sus números como un solo sistema.** Usted recibe un informe escrito: qué es cierto, qué está roto y qué conviene construir primero.",
  diagSpecs: [
    "**Día 1.** Una sesión de trabajo sobre la operación que de verdad corre, módulo por módulo.",
    "**Días 2 a 9.** Escarbamos: las fuentes, los canales, el piso, la medición y los números detrás de los números.",
    "**Día 10.** Llega el informe: qué es cierto, qué está roto y qué módulo se gana el primer lugar.",
    "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda desde el principio y usted se queda con el resultado.",
  ],
};

export type ModulosDict = typeof en;
export const modulos: Dict<ModulosDict> = { en, es };
