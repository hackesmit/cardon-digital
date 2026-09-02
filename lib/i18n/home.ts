import type { Dict } from "./rich";

/** Home page copy. Spanish is written for a Valle winemaker, not translated. */

const en = {
  meta: {
    title: "Cardon Digital | Growth systems built to hold water",
    description:
      "Ads, website, and operations wired into one connected system your team ends up owning. Bilingual growth systems for owner-run businesses in the US and Mexico.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Automation studio, Baja California",
    title: "Your harvest, your cellar, your books.",
    titleAccent: "One living system.",
    sub: "Weights, lab samples, tank moves, and the books usually live in notebooks and spreadsheets that never agree. We wire them into one connected system your winery reads from and ends up owning. **Make your numbers true, then compound.**",
    cta: "Get the free Growth Diagnostic",
    ctaGhost: "Built for wineries",
  },
  value: {
    aria: "What that is worth to you",
    srTitle: "What it is worth to you",
    items: [
      {
        key: "Work that runs itself",
        lead: "Manual routines, __turned into work that runs itself.__",
        body: "We find the jobs your team does by hand every week, measure what they cost you in hours, and make them run on their own. Then we compound the hours you get back.",
      },
      {
        key: "Yours to keep",
        lead: "The system stays yours, __keys and all.__",
        body: "Source, data, domains, credentials, and a team trained to run it. Pause the care retainer and nothing switches off, because you own it.",
      },
      {
        key: "Both markets",
        lead: "Two languages, __both written natively.__",
        body: "The US and Mexico, in English and Spanish, not translated after the fact.",
      },
    ],
  },
  operations: {
    kicker: "01 / Operations",
    title: "The hours come back, and they compound.",
    sub: "Every operation has jobs that run every week and eat an afternoon: rekeying the same numbers between systems, chasing status, rebuilding a report someone already built. We find them, measure what they actually cost you in hours, and make them run on their own. Then we do it again with the next one. **Hours back every month, compounding.**",
    note: "Measured before and after, so the saving is **provable, not claimed.**",
  },
  tools: {
    kicker: "02 / Tools",
    title: "Tools your team actually runs, and owns.",
    sub1: "We build custom workflows and internal tools your team uses every day, **integrated end to end**, trained into the business, and yours to keep. Underneath them all sits one data warehouse: every channel, file, and system combined into clean, organized fields that feed everything you see. Where it helps, we add an assistant trained on your own data, so you can ask your business a question and get an answer from your numbers. Separate parts, spreadsheets, dashboards, and forms become one working board with no per-seat subscription to babysit.",
    sub2: "The build is a **scoped fixed fee**, agreed before work starts. After handoff, most owners keep a monthly **care retainer**: corrections, refinements, and the changes that shape the system around how your team actually uses it. Pause it whenever you want; everything keeps running and stays yours.",
    note: "Model: **trained in and owned,** not another subscription.",
    visTag: "parts wired into one board",
    visAria:
      "Separate modular parts are placed and wired into one working board.",
  },
  demand: {
    kicker: "03 / Demand",
    title: "Demand you can trust, before you optimize it.",
    sub: "We run Google Ads with the rigor of the most sophisticated agencies, using what the platforms actually allow, and **priced in proportion to performance**: a percent of ad spend with a floor, or, once measurement you trust is in place, a percent of the sales the ads bring in. Before anyone tunes a campaign, we check whether the numbers coming in are real, so every decision after that rests on something true. Offline conversions, call and chat tracking, structured testing with kill rules: the same measurement discipline the biggest performance shops run, sized for owner-run businesses.",
    note: "Pricing: **a share of spend, with a floor; results-based once measurement is proven.** We get paid when it works.",
    visTag: "measured before optimized",
    visAria:
      "A single reading is checked against a measured baseline and settles to a verified state.",
    signalIn: "SIGNAL IN",
    measured: "MEASURED",
    checking: "checking the numbers",
    verified: "verified, safe to optimize",
    reading: "reading",
    fee: "priced on performance, a share of results",
  },
  compare: {
    kicker: "Cardon vs the usual stack",
    title: "Not another subscription.",
    sub: "Most software rents you a seat and shapes your operation around itself; we build the system around how you already work, prove your numbers, and hand your team the keys.",
    cardon: "Cardon",
    usual: "The usual stack",
    rows: [
      {
        dim: "Ownership",
        cardon: "You own the system, keys and all.",
        usual: "You rent it forever.",
      },
      {
        dim: "Fit",
        cardon: "Built around how your operation already works.",
        usual: "Your operation bent around the tool.",
      },
      {
        dim: "Data",
        cardon: "One warehouse of your numbers, and it is yours.",
        usual: "Scattered across ten apps that do not talk.",
      },
      {
        dim: "People",
        cardon: "Senior hands on five accounts, who know yours.",
        usual: "A ticket queue and a new name each time.",
      },
      {
        dim: "Price shape",
        cardon:
          "A scoped build, a care retainer if you want it, ads paid on performance.",
        usual: "Per-seat fees, every month, forever.",
      },
      {
        dim: "Intelligence",
        cardon: "An assistant trained on your own data.",
        usual: "Generic features built for everyone.",
      },
    ],
    footBefore: "Want to see which side your current stack is on? The ",
    footLink: "free Growth Diagnostic",
    footAfter: " shows you.",
  },
  sectors: {
    kicker: "Industries",
    title: "The terrains we know.",
    sub: "These are the domains we have built for and understand end to end. Every station on the map is part of the same terrain. The winery valley is the ground we work every week; the other stations stay open and reachable.",
    leadKicker: "Primary industry",
    leadTitle: "Wineries, Valle de Guadalupe and Ensenada.",
    leadBody:
      "This is the practice. We build the system a winery runs on, from harvest weights and lab results to the tasting room and the books, and we are down the road when it needs a hand.",
    leadCta: "Open the winery page",
    secondaryLabel: "Also reachable",
    secondaryNote: "Built for and kept open, not sold actively.",
    foot: "Three stations built, two terrains ahead. In focus: **the winery valley.**",
  },
  pricing: {
    kicker: "What it costs",
    title:
      "Published floors. The real number comes after the diagnostic.",
    sub: "A scoped build at a fixed fee, then a care retainer only if you want one. No per-seat fees, no lock-in, and **no quote before we have seen your numbers.**",
    from: "from",
    /** Shown in place of a figure while a locale's numbers are unset. */
    tbd: "Set in the diagnostic",
    perMonth: "from **{amount}** a month",
    tbdMonthly: "with the monthly fee set in the diagnostic",
    tiers: [
      {
        n: "Tier 1",
        name: "Quick Win",
        time: "2 to 3 weeks",
        body: "One process automated end to end. Small enough to start with, real enough to change a week.",
      },
      {
        n: "Tier 2",
        name: "Operations System",
        time: "5 to 8 weeks",
        body: "Three to five connected processes plus the data layer that makes them one system. Where most of our work lands.",
      },
      {
        n: "Tier 3",
        name: "Full Operational Build",
        time: "8 to 16 weeks",
        body: "The system your company runs on: production or service intelligence, finance, and the customer-facing surface, connected.",
      },
    ],
    foot: [
      {
        k: "Care retainer",
        body: "Optional, {price}. Monitoring, corrections, and changes as your team actually uses it. Pause it and nothing switches off, because you own the system.",
      },
      {
        k: "Ad management",
        body: "A share of spend with a floor, {price}. We run ads only inside a system we built or rebuilt, never on their own.",
      },
      {
        k: "Mexico",
        body: "Quoted and billed locally in pesos, indexed to the Mexican market rather than converted from this card. Ask us and we will send it.",
      },
    ],
    founding: {
      kicker: "Case study partners",
      lead: "**30 percent off the build fee for wineries that agree to a named case study, through 31 December 2026.**",
      body: "In exchange we ask for three things, written into the agreement: a named case study with the real before-and-after numbers, one reference call for someone in your industry, and one introduction to a peer. Would rather not be named? Then you pay the full fee and we still take the work.",
    },
  },
  diagnostic: {
    desc: "Ten business days looking at your ads, your site, and your operations as one system. You get a written memo, not a sales deck, telling you what is true, what is broken, and what to build first.",
    specs: [
      "**Day 1.** A working session on your ads, your site, and your operations.",
      "**Days 2 to 9.** We dig: accounts, measurement, workflows, the numbers behind the numbers.",
      "**Day 10.** The memo lands: what is true, what is broken, what to build first.",
      "**Free, with no strings.** Act on it with us or without us. If we build, pricing is agreed up front.",
    ],
  },
};

const es: typeof en = {
  meta: {
    title: "Cardon Digital | El sistema con el que trabaja su bodega",
    description:
      "Cosecha, laboratorio, tanques y cuentas en un solo sistema que su bodega lee todos los días y termina siendo suyo. Hecho en Baja California, en español, para el Valle de Guadalupe y Ensenada.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Estudio de automatización, Baja California",
    title: "Su cosecha, su bodega, sus cuentas.",
    titleAccent: "Un solo sistema.",
    sub: "Los pesos, las muestras de laboratorio, los movimientos de tanque y las cuentas viven en libretas y hojas de cálculo que nunca coinciden. Nosotros los reunimos en un solo sistema del que su bodega lee todos los días y que termina siendo suyo. **Primero los números ciertos. Lo demás se acumula.**",
    cta: "Pida el Diagnóstico, sin costo",
    ctaGhost: "Hecho para bodegas",
  },
  value: {
    aria: "Lo que esto vale para usted",
    srTitle: "Lo que esto vale para usted",
    items: [
      {
        key: "Trabajo que se hace solo",
        lead: "Las tareas manuales, __convertidas en trabajo que se hace solo.__",
        body: "Buscamos las tareas que su equipo hace a mano cada semana, medimos cuántas horas le cuestan y las dejamos corriendo solas. Después seguimos con la siguiente, y las horas que recupera se van acumulando.",
      },
      {
        key: "Suyo, y se queda",
        lead: "El sistema es suyo, __con llaves y todo.__",
        body: "El código, los datos, los dominios, los accesos y su equipo entrenado para operarlo. Si pausa el mantenimiento no se apaga nada, porque el sistema es de usted.",
      },
      {
        key: "Los dos mercados",
        lead: "Dos idiomas, __cada uno escrito por separado.__",
        body: "México y Estados Unidos, en español y en inglés. Ninguno es la traducción del otro.",
      },
    ],
  },
  operations: {
    kicker: "01 / Operación",
    title: "Las horas regresan, y se acumulan.",
    sub: "Toda operación tiene tareas que vuelven cada semana y se comen una tarde: capturar otra vez los mismos números entre sistemas, perseguir en qué va algo, rehacer un reporte que alguien ya había hecho. Las encontramos, medimos lo que de verdad le cuestan en horas y las dejamos corriendo solas. Luego seguimos con la siguiente. **Horas de vuelta cada mes, una encima de la otra.**",
    note: "Medimos antes y después, para que el ahorro sea **comprobable y no una promesa.**",
  },
  tools: {
    kicker: "02 / Herramientas",
    title: "Herramientas que su equipo usa, y que son suyas.",
    sub1: "Construimos los flujos de trabajo y las herramientas internas que su equipo abre todos los días, **integradas de principio a fin**, enseñadas al negocio y suyas para quedarse. Debajo de todas hay un solo almacén de datos: cada canal, archivo y sistema reunidos en campos limpios y ordenados que alimentan todo lo que usted ve. Donde ayuda, agregamos un asistente que responde sobre sus propios registros, para que pueda preguntarle a su negocio y la respuesta salga de sus números. Las piezas sueltas, las hojas de cálculo, los tableros y los formatos se vuelven un solo tablero de trabajo, sin suscripción por usuario que andar cuidando.",
    sub2: "La construcción es una **cuota fija con alcance definido**, acordada antes de empezar. Después de la entrega, la mayoría de los dueños conserva un **mantenimiento mensual**: correcciones, ajustes y los cambios que le van dando forma al sistema según cómo lo usa su equipo. Puede pausarlo cuando quiera; todo sigue funcionando y sigue siendo suyo.",
    note: "El modelo: **enseñado a su equipo y suyo,** no otra suscripción.",
    visTag: "piezas conectadas en un solo tablero",
    visAria:
      "Piezas sueltas se colocan y se conectan en un solo tablero de trabajo.",
  },
  demand: {
    kicker: "03 / Demanda",
    title: "Demanda confiable, antes de ajustarla.",
    sub: "Manejamos Google Ads con el rigor de las agencias más serias, con lo que las plataformas de verdad permiten, y **con un precio proporcional al resultado**: un porcentaje de la inversión con un piso, o, cuando ya existe una medición en la que usted confía, un porcentaje de las ventas que traen los anuncios. Antes de que alguien mueva una campaña revisamos si los números que entran son reales, para que toda decisión posterior descanse en algo cierto. Conversiones fuera de línea, seguimiento de llamadas y de chat, pruebas ordenadas con reglas de corte: la misma disciplina de medición de las agencias de resultados más grandes, a la medida de un negocio con dueño.",
    note: "Precio: **un porcentaje de la inversión con un piso; por resultados cuando la medición ya está comprobada.** Cobramos cuando funciona.",
    visTag: "medido antes de ajustar",
    visAria:
      "Una lectura se compara contra una línea base medida y se asienta en un estado verificado.",
    signalIn: "SEÑAL",
    measured: "MEDIDO",
    checking: "revisando los números",
    verified: "verificado, ya se puede ajustar",
    reading: "lectura",
    fee: "precio por resultado, un porcentaje",
  },
  compare: {
    kicker: "Cardon frente a lo de siempre",
    title: "No es otra suscripción.",
    sub: "Casi todo el software le renta un lugar y le acomoda la operación a su manera. Nosotros construimos el sistema alrededor de cómo usted ya trabaja, comprobamos sus números y le entregamos las llaves a su equipo.",
    cardon: "Cardon",
    usual: "Lo de siempre",
    rows: [
      {
        dim: "Propiedad",
        cardon: "El sistema es suyo, con llaves y todo.",
        usual: "Lo renta para siempre.",
      },
      {
        dim: "Ajuste",
        cardon: "Hecho alrededor de cómo ya trabaja su operación.",
        usual: "Su operación doblada al molde de la herramienta.",
      },
      {
        dim: "Datos",
        cardon: "Un solo almacén con sus números, y es suyo.",
        usual: "Repartidos en diez aplicaciones que no se hablan.",
      },
      {
        dim: "Personas",
        cardon: "Manos con experiencia en cinco cuentas, y conocen la suya.",
        usual: "Una fila de reportes y un nombre distinto cada vez.",
      },
      {
        dim: "Forma del precio",
        cardon:
          "Una construcción con alcance definido, un mantenimiento si lo quiere, y anuncios pagados por resultado.",
        usual: "Una cuota por usuario, cada mes, para siempre.",
      },
      {
        dim: "Inteligencia",
        cardon: "Un asistente que responde sobre sus propios registros.",
        usual: "Funciones genéricas hechas para cualquiera.",
      },
    ],
    footBefore: "¿Quiere saber de qué lado está lo que usa hoy? El ",
    footLink: "Diagnóstico, sin costo",
    footAfter: " se lo enseña.",
  },
  sectors: {
    kicker: "Sectores",
    title: "Los terrenos que conocemos.",
    sub: "Estos son los terrenos en los que hemos construido y que entendemos de principio a fin. Cada estación del mapa es parte del mismo territorio. El valle de las bodegas es el terreno que trabajamos cada semana; las demás estaciones siguen abiertas.",
    leadKicker: "Sector principal",
    leadTitle: "Bodegas del Valle de Guadalupe y Ensenada.",
    leadBody:
      "Aquí está el trabajo. Construimos el sistema con el que opera una bodega, desde los pesos de cosecha y los resultados de laboratorio hasta la sala de degustación y las cuentas, y estamos a unos minutos cuando hace falta una mano.",
    leadCta: "Ver la página de bodegas",
    secondaryLabel: "También abiertos",
    secondaryNote: "Terrenos en los que ya construimos; no los vendemos de forma activa.",
    foot: "Tres estaciones construidas, dos terrenos por delante. En foco: **el valle de las bodegas.**",
  },
  pricing: {
    kicker: "Lo que cuesta",
    title: "El precio se fija después del diagnóstico.",
    sub: "Una construcción con alcance definido y cuota fija, y después un mantenimiento solo si lo quiere. Sin cuota por usuario, sin amarres y **sin cotización antes de haber visto sus números.**",
    from: "desde",
    tbd: "Se fija en el diagnóstico",
    perMonth: "desde **{amount}** al mes",
    tbdMonthly: "con la mensualidad fijada en el diagnóstico",
    tiers: [
      {
        n: "Nivel 1",
        name: "Primer avance",
        time: "2 a 3 semanas",
        body: "Un proceso automatizado de principio a fin. Chico para empezar, suficiente para cambiar una semana de trabajo.",
      },
      {
        n: "Nivel 2",
        name: "Sistema de operación",
        time: "5 a 8 semanas",
        body: "De tres a cinco procesos conectados, más la capa de datos que los vuelve un solo sistema. Aquí cae la mayor parte de nuestro trabajo.",
      },
      {
        n: "Nivel 3",
        name: "Construcción completa",
        time: "8 a 16 semanas",
        body: "El sistema con el que opera su empresa: la información de producción o de servicio, las cuentas y la cara que ve el cliente, conectadas.",
      },
    ],
    foot: [
      {
        k: "Mantenimiento",
        body: "Opcional, {price}. Monitoreo, correcciones y los cambios que su equipo va pidiendo conforme lo usa. Puede pausarlo y no se apaga nada, porque el sistema es suyo.",
      },
      {
        k: "Manejo de anuncios",
        body: "Un porcentaje de la inversión con un piso, {price}. Solo manejamos anuncios dentro de un sistema que construimos o reconstruimos, nunca por su cuenta.",
      },
      {
        k: "Facturación",
        body: "Cotizamos y cobramos en pesos, con factura. El precio está indexado al mercado mexicano, no convertido de una lista en dólares.",
      },
    ],
    founding: {
      kicker: "Bodega fundadora",
      lead: "**30 por ciento de descuento en la construcción para la bodega que acepte un caso de estudio con su nombre, hasta el 31 de diciembre de 2026.**",
      body: "A cambio pedimos tres cosas, escritas en el acuerdo: un caso de estudio con su nombre y las cifras reales de antes y después, una llamada de referencia con alguien de su industria y una presentación con un colega. ¿Prefiere no aparecer con nombre? Entonces paga la cuota completa y el trabajo se hace igual.",
    },
  },
  diagnostic: {
    desc: "Diez días hábiles revisando sus anuncios, su sitio y su operación como un solo sistema. Usted recibe un informe escrito, no una presentación de ventas: qué es cierto, qué está roto y qué conviene construir primero.",
    specs: [
      "**Día 1.** Una sesión de trabajo sobre sus anuncios, su sitio y su operación.",
      "**Días 2 a 9.** Escarbamos: cuentas, medición, flujos de trabajo y los números detrás de los números.",
      "**Día 10.** Llega el informe: qué es cierto, qué está roto y qué construir primero.",
      "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda desde el principio.",
    ],
  },
};

export type HomeDict = typeof en;
export const home: Dict<HomeDict> = { en, es };
