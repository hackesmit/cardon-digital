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
    sub3: "That assistant answers in plain language and shows its work. Ask it what a lab number did last week and it returns the record it read, with the date and the lot. If the record does not exist, it says so. It never fills a gap with a plausible number, because a plausible number is worse than none.",
    note: "Model: **trained in and owned,** not another subscription.",
    visTag: "parts wired into one board",
    visAria:
      "Separate modular parts are placed and wired into one working board.",
  },
  demand: {
    kicker: "03 / Demand",
    title: "Demand you can trust, before you optimize it.",
    sub: "We run Google Ads with the rigor of the most sophisticated agencies, using what the platforms actually allow, and **paid for inside the monthly service fee**, never as a share of what you spend. Your ad budget goes from you straight to Google. Before anyone tunes a campaign, we check whether the numbers coming in are real, so every decision after that rests on something true. Offline conversions, call and chat tracking, structured testing with kill rules: the same measurement discipline the biggest performance shops run, sized for owner-run businesses.",
    note: "Pricing: **inside the monthly service fee, never a share of your spend.** Your budget goes straight to Google.",
    visTag: "measured before optimized",
    visAria:
      "A single reading is checked against a measured baseline and settles to a verified state.",
    signalIn: "SIGNAL IN",
    measured: "MEASURED",
    checking: "checking the numbers",
    verified: "verified, safe to optimize",
    reading: "reading",
    fee: "inside the monthly fee, not a share of spend",
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
          "A scoped setup fee, then one monthly service fee that includes the ads.",
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
    title: "Three scopes. Two fees, and the system is yours.",
    sub: "The setup fee pays for the build, and you own what we build. The monthly service fee pays for running it: hosting, care, corrections, the report, and the assistant. **No quote before we have seen your numbers.**",
    floorLabel: "Where it starts",
    /** {setup} is the published floor. One figure on a public page, never a table. */
    floor: "From **{setup}** to implement, plus the monthly service fee.",
    /** Printed in place of the floor while the figures are unpublished. */
    floorTbd: "Set in the diagnostic.",
    /** Same three scopes as the winery page, most expensive first. */
    scopes: [
      {
        name: "Cava",
        scale: "Large winery",
        time: "8 to 12 weeks",
        body: "The whole operation, from the cellar floor to the books and the shop.",
        features: [
          "The Vendimia build at large-winery scale",
          "Three more source connectors, four historical vintages",
          "A prediction or classification model",
          "Finance workflow automation",
          "Online shop, age gate, and a monthly visit",
        ],
      },
      {
        name: "Vendimia",
        scale: "Mid-size winery",
        time: "5 to 7 weeks",
        body: "Where most of our work lands: the system, and the demand side wired into it.",
        features: [
          "The Bitácora build at mid-winery scale",
          "Two more source connectors, two historical vintages",
          "Tasting room booking",
          "Direct sales and wine club follow-up",
          "Ad management and content, every month",
        ],
      },
      {
        name: "Bitácora",
        scale: "Small winery",
        time: "3 to 4 weeks",
        body: "One winery, one site: the record, the reports, and the assistant over them.",
        features: [
          "Production record and vintage comparison",
          "Commercial record and report generator",
          "The assistant over your own records",
          "Site, GA4 and conversion tracking",
          "Hosting, care and a weekly call, every month",
        ],
      },
    ],
    more: "See what each scope includes, in full",
    foot: [
      {
        k: "The monthly fee",
        body: "Hosting, monitoring, care, corrections, the monthly report and its readout, and fair use of the assistant. **Pause it and nothing switches off,** because you own the system.",
      },
      {
        k: "Ad management",
        body: "It sits **inside the monthly service fee** from the Vendimia scope up, never a share of what you spend. The ad budget goes from you straight to Google.",
      },
      {
        k: "Payment",
        body: "Setup is 50 percent on signature and 50 percent on acceptance, and the signature half can go in three monthly payments at no extra cost. The service fee runs month to month, 30 days notice either way. **Quoted and billed in pesos, plus IVA.**",
      },
    ],
    founding: {
      kicker: "Founding winery",
      lead: "**One founding winery, through 31 December 2026: the Vendimia scope at Bitácora prices.**",
      body: "One slot, not a running discount, and it does not stack with anything. In exchange we ask for two things, written into the agreement: a named case study with the real before-and-after numbers, and two introductions to other wineries in the Valle. Whoever signs first takes it, and this comes off the site.",
    },
  },
  vis: {
    hero: {
      tagBefore: "notebooks in",
      tagMid: "one view out",
      connecting: "connecting",
      oneSystem: "one system",
      fallback:
        "Scattered documents, spreadsheets, invoices, email, and messages settle into clean rows around one connected panel your team owns.",
      panelTitle: "One system",
      panelSummary: "SUMMARY",
      docs: [
        { name: "sales.xlsx", tag: "XLSX" },
        { name: "leads.csv", tag: "CSV" },
        { name: "expenses.xlsx", tag: "XLSX" },
        { name: "invoice.pdf", tag: "PDF" },
        { name: "receipt", tag: "RECEIPT" },
        { name: "whatsapp", tag: "MSG" },
      ],
      rows: [
        { k: "SALES", v: "live" },
        { k: "LEADS", v: "ready" },
        { k: "EXPENSES", v: "matched" },
        { k: "PAYMENTS", v: "3 today" },
        { k: "MARGIN", v: "34%" },
        { k: "CLOSE", v: "current" },
      ],
    },
    ops: {
      tag: "an hour, compressed to two minutes",
      aria: "A long tangled hour of manual work compresses into one short clean two minute automated pass, a 97 percent reduction.",
      manual: "MANUAL, EVERY WEEK",
      auto: "AUTOMATED, RUNS ITSELF",
      badge: "97% less time",
      foot: "REFRESHED THROUGH THE DAY",
    },
    map: {
      legend: "Survey of terrains: three stations, two survey sites",
      hub: "One system",
      scale: "Baja California and the US border",
      listAria: "Terrains we know",
      stationsHead: "Stations built",
      surveyHead: "Survey sites",
      focus: "Focus terrain",
      caseStudy: "Case study:",
      wineryName: "Winery / Valle de Guadalupe",
      wineryDetail: "harvest and finances, one view",
      wineryAria:
        "Winery, Valle de Guadalupe. Harvest and finances in one view. Open the winery page.",
      constructionName: "Construction / Logistics",
      constructionDetail: "field to office, one system",
      constructionAria:
        "Construction and Logistics. Field to office, one system. Open the logistics page.",
      hiringName: "Hiring / HR",
      hiringDetail: "from first click to hire",
      hiringAria: "Hiring and HR. From first click to hire. Open the hiring page.",
      clinicsName: "Clinics / Healthcare",
      clinicsDetail: "defend and recapture patient flow",
      clinicsAria:
        "Clinics and healthcare. Focus terrain: defend and recapture patient flow. Open the clinics page.",
      restaurantsName: "Restaurants / Hospitality",
      restaurantsDetail: "surveying this terrain",
      restaurantsAria:
        "Restaurants and hospitality. Terrain we are surveying next. Open the restaurants page.",
      xanicAria: "Read the Monte Xanic case study, from berry to bottle.",
      enkantoAria: "Read the Vinedo En'kanto case study, the commerce side.",
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
    sub3: "Ese asistente responde en lenguaje claro y enseña de dónde salió la respuesta. Pregúntele qué hizo un dato de laboratorio la semana pasada y le devuelve el registro que leyó, con fecha y lote. Si el registro no existe, lo dice. Nunca rellena un hueco con un número verosímil, porque un número verosímil es peor que ninguno.",
    note: "El modelo: **enseñado a su equipo y suyo,** no otra suscripción.",
    visTag: "piezas conectadas en un solo tablero",
    visAria:
      "Piezas sueltas se colocan y se conectan en un solo tablero de trabajo.",
  },
  demand: {
    kicker: "03 / Demanda",
    title: "Demanda confiable, antes de ajustarla.",
    sub: "Manejamos Google Ads con el rigor de las agencias más serias, con lo que las plataformas de verdad permiten, y **pagados dentro de la cuota mensual del servicio**, nunca como porcentaje de lo que usted invierte. Su inversión en anuncios la paga usted directo a Google. Antes de que alguien mueva una campaña revisamos si los números que entran son reales, para que toda decisión posterior descanse en algo cierto. Conversiones fuera de línea, seguimiento de llamadas y de chat, pruebas ordenadas con reglas de corte: la misma disciplina de medición de las agencias de resultados más grandes, a la medida de un negocio con dueño.",
    note: "Precio: **dentro de la cuota mensual del servicio, nunca un porcentaje de su inversión.** Su presupuesto va directo a Google.",
    visTag: "medido antes de ajustar",
    visAria:
      "Una lectura se compara contra una línea base medida y se asienta en un estado verificado.",
    signalIn: "SEÑAL",
    measured: "MEDIDO",
    checking: "revisando los números",
    verified: "verificado, ya se puede ajustar",
    reading: "lectura",
    fee: "dentro de la cuota mensual, no un porcentaje",
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
          "Una cuota de implementación con alcance definido, y después una sola cuota mensual que incluye los anuncios.",
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
    title: "Tres alcances. Dos cuotas, y el sistema queda suyo.",
    sub: "La cuota de implementación paga la construcción, y lo construido queda suyo. La cuota mensual paga operarlo: hospedaje, cuidado, correcciones, el reporte y el asistente. **Sin cotización antes de haber visto sus números.**",
    floorLabel: "De dónde parte",
    floor: "Desde **{setup}** de implementación, más la cuota mensual del servicio.",
    floorTbd: "Se fija en el diagnóstico.",
    scopes: [
      {
        name: "Cava",
        scale: "Bodega grande",
        time: "8 a 12 semanas",
        body: "Toda la operación, del piso de la bodega a las cuentas y la tienda.",
        features: [
          "La construcción de Vendimia a escala de bodega grande",
          "Tres conectores de origen más y cuatro añadas históricas",
          "Un modelo de predicción o clasificación",
          "Automatización del flujo financiero",
          "Tienda en línea, control de edad y una visita mensual",
        ],
      },
      {
        name: "Vendimia",
        scale: "Bodega mediana",
        time: "5 a 7 semanas",
        body: "Aquí cae la mayor parte de nuestro trabajo: el sistema, y la demanda conectada a él.",
        features: [
          "La construcción de Bitácora a escala de bodega mediana",
          "Dos conectores de origen más y dos añadas históricas",
          "Reservas para la sala de degustación",
          "Seguimiento de venta directa y club",
          "Manejo de anuncios y contenido, cada mes",
        ],
      },
      {
        name: "Bitácora",
        scale: "Bodega chica",
        time: "3 a 4 semanas",
        body: "Una bodega, un sitio: el registro, los reportes y el asistente sobre ellos.",
        features: [
          "Registro de producción y comparación de añadas",
          "Registro comercial y generador de reportes",
          "El asistente sobre sus propios registros",
          "Sitio, GA4 y medición de conversiones",
          "Hospedaje, cuidado y una llamada semanal, cada mes",
        ],
      },
    ],
    more: "Vea todo lo que incluye cada alcance",
    foot: [
      {
        k: "La cuota mensual",
        body: "Hospedaje, monitoreo, cuidado, correcciones, el reporte mensual y su lectura, y uso razonable del asistente. **Puede pausarla y no se apaga nada,** porque el sistema es suyo.",
      },
      {
        k: "Manejo de anuncios",
        body: "Va **dentro de la cuota mensual del servicio** desde el alcance Vendimia, nunca como porcentaje de lo que usted invierte. La inversión en anuncios la paga usted directo a Google.",
      },
      {
        k: "Pagos",
        body: "La implementación se paga 50 por ciento a la firma y 50 por ciento a la aceptación, y la mitad de la firma se puede pagar en tres mensualidades sin recargo. La cuota mensual va mes con mes, con 30 días de aviso de cualquiera de las dos partes. **Cotizamos y cobramos en pesos, más IVA.**",
      },
    ],
    founding: {
      kicker: "Bodega fundadora",
      lead: "**Una bodega fundadora, hasta el 31 de diciembre de 2026: el alcance Vendimia al precio de Bitácora.**",
      body: "Un solo lugar, no un descuento permanente, y no se acumula con nada. A cambio pedimos dos cosas, escritas en el acuerdo: un caso de estudio con su nombre y las cifras reales de antes y después, y dos presentaciones con otras bodegas del Valle. Quien firme primero se lo lleva, y esto sale del sitio.",
    },
  },
  vis: {
    hero: {
      tagBefore: "entran libretas",
      tagMid: "sale una vista",
      connecting: "conectando",
      oneSystem: "un solo sistema",
      fallback:
        "Documentos sueltos, hojas de cálculo, facturas, correos y mensajes se acomodan en renglones limpios alrededor de un solo panel conectado que su equipo posee.",
      panelTitle: "Un sistema",
      panelSummary: "RESUMEN",
      docs: [
        { name: "ventas.xlsx", tag: "XLSX" },
        { name: "prospectos.csv", tag: "CSV" },
        { name: "gastos.xlsx", tag: "XLSX" },
        { name: "factura.pdf", tag: "PDF" },
        { name: "recibo", tag: "RECIBO" },
        { name: "whatsapp", tag: "MSG" },
      ],
      rows: [
        { k: "VENTAS", v: "al día" },
        { k: "PROSPECTOS", v: "listos" },
        { k: "GASTOS", v: "conciliados" },
        { k: "PAGOS", v: "3 hoy" },
        { k: "MARGEN", v: "34%" },
        { k: "CIERRE", v: "al corriente" },
      ],
    },
    ops: {
      tag: "una hora, comprimida a dos minutos",
      aria: "Una hora larga y enredada de trabajo manual se comprime en un solo paso automático y limpio de dos minutos, una reducción del 97 por ciento.",
      manual: "A MANO, CADA SEMANA",
      auto: "AUTOMATIZADO, CORRE SOLO",
      badge: "97% menos tiempo",
      foot: "SE ACTUALIZA DURANTE EL DÍA",
    },
    map: {
      legend: "Reconocimiento de terrenos: tres estaciones, dos sitios en estudio",
      hub: "Un sistema",
      scale: "Baja California y la frontera con Estados Unidos",
      listAria: "Terrenos que conocemos",
      stationsHead: "Estaciones construidas",
      surveyHead: "Terrenos en estudio",
      focus: "Terreno en foco",
      caseStudy: "Caso de estudio:",
      wineryName: "Bodegas / Valle de Guadalupe",
      wineryDetail: "cosecha y cuentas, una vista",
      wineryAria:
        "Bodegas, Valle de Guadalupe. Cosecha y cuentas en una sola vista. Abrir la página de bodegas.",
      constructionName: "Construcción / Logística",
      constructionDetail: "del campo a la oficina, un sistema",
      constructionAria:
        "Construcción y logística. Del campo a la oficina, un solo sistema. Abrir la página de construcción.",
      hiringName: "Reclutamiento / Recursos humanos",
      hiringDetail: "del primer clic a la contratación",
      hiringAria:
        "Reclutamiento y recursos humanos. Del primer clic a la contratación. Abrir la página de reclutamiento.",
      clinicsName: "Clínicas / Salud",
      clinicsDetail: "defender y recuperar el flujo de pacientes",
      clinicsAria:
        "Clínicas y salud. Terreno en foco: defender y recuperar el flujo de pacientes. Abrir la página de clínicas.",
      restaurantsName: "Restaurantes / Hospitalidad",
      restaurantsDetail: "terreno en estudio",
      restaurantsAria:
        "Restaurantes y hospitalidad. Terreno que estamos estudiando. Abrir la página de restaurantes.",
      xanicAria: "Lea el caso de Monte Xanic, de la baya a la botella.",
      enkantoAria: "Lea el caso de Viñedo En'kanto, el lado comercial.",
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
