import type { Dict } from "./rich";

/** Monte Xanic case history. The SVG and canvas labels live here too, so the
 *  visuals in a Spanish page are Spanish all the way through.
 *
 *  Written against docs/copy-doctrine.md. Three things about this file are
 *  deliberate and load bearing:
 *
 *  1. Zero emphasis markers. The doctrine bans bold as emphasis in body copy
 *     and keeps it only for a real label, and the two real labels on this page
 *     (the case fact keys and the diagnostic day markers) are labels in the
 *     markup with their own class, so they need no marker here.
 *  2. One number, and it is accounted for. About an hour down to about two
 *     minutes, about 97 percent less, and `facts.basis` says where each of the
 *     three came from. The percentage is hedged everywhere including in the
 *     basis, because (60 - 2) / 60 is 96.67 and the paragraph that certifies a
 *     number is the last place to round it up. The one other measured-sounding
 *     claim on the page is the refresh cadence, and the basis now carries it
 *     in the page's own words ("the view is refreshed through the day") rather
 *     than leaving four surfaces stating a cadence nothing accounts for.
 *  3. Spanish is written for a Valle winemaker and English for a US owner.
 *     Neither is a translation of the other, so the two differ in rhythm and
 *     in idiom on purpose.
 */

const en = {
  meta: {
    title: "Monte Xanic case history",
    description:
      "One finance workflow at Monte Xanic now takes about 97 percent less time: about an hour down to about two minutes.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Case history",
    t1: "One finance workflow at Monte Xanic now takes ",
    accent: "97% less",
    t2: " time.",
    sub: "About an hour of assembly by hand, now about two minutes, refreshed through the day. The harvest behind it reads in one live view.",
  },
  /** The before and after pair, and the one moving picture. Captions are read
   *  by about twice as many people as this body copy, so each one carries the
   *  result the photograph is evidence for. */
  media: {
    beforeCap:
      "The old way: the reading goes on paper, and the picture gets assembled later.",
    beforeAlt: "A paper record sheet at the work station.",
    afterCap:
      "The lab bench today. The reading is taken once and the view is current from that moment.",
    afterAlt: "The lab bench, with the record open on a laptop.",
    videoCap:
      "Berry to bottle, the whole thread on the phone, read among the barrels it describes.",
    videoAlt: "A hand scrolling the harvest record on a phone, barrels racked behind.",
    play: "Play",
    pause: "Pause",
  },
  facts: {
    aria: "Case facts and their basis",
    rows: [
      { k: "Client", v: "Monte Xanic" },
      { k: "Sector", v: "Winery" },
      { k: "Place", v: "Valle de Guadalupe, Baja California" },
      { k: "Engagement", v: "Build and ongoing work" },
      {
        k: "What we built",
        v: "Live harvest view, section maps, ripeness prediction, berry to bottle tracking, automated finance reporting",
      },
      {
        k: "Outcome",
        v: "About an hour of finance work, now about two minutes, refreshed through the day",
      },
    ],
    basisK: "Basis",
    basis:
      "The hour was timed by hand before the build; the two minutes are the dashboard's refresh, and the view is refreshed through the day; about 97 percent is the distance between them. No Monte Xanic production, sales or financial figure appears here.",
  },
  before: {
    kicker: "Before",
    title: "The harvest lived in three places and agreed in none.",
    p1: "Monte Xanic makes wine in the Valle de Guadalupe, and is meticulous about what goes in the bottle. The harvest behind it deserves the same clarity.",
    p2: "The numbers sat in a production system, in Excel files, and in paper notebooks out in the rows. Seeing the whole harvest meant gathering all three by hand, and by then the picture was old. A picking decision turns on a day or two.",
  },
  changed: {
    kicker: "What changed",
    title: "One live view, and every number stands on its own section.",
    sub: "The three sources feed a view that updates itself, bound to the real sections of the vineyard. Ripeness is scored against the winery's own standard, so a section is seen coming due.",
  },
  thread: {
    kicker: "Berry to bottle",
    title: "One thread from vine to finished bottle.",
    sub: "Every stage sits on the same thread, so an adjustment lands in season, while it still changes the wine.",
  },
  number: {
    kicker: "The number",
    title: "About an hour of finance work, now about two minutes.",
    sub: "The same workflow, rebuilt to refresh itself through the day.",
    manual: "BY HAND",
    auto: "RUNS ITSELF",
    long: "about 1 hr",
    short: "about 2 min",
    less: "97% less",
    refreshed: "REFRESHED THROUGH THE DAY",
    tag: "about an hour to about two minutes",
    aria: "A manual workflow of about an hour compresses to about two minutes.",
  },
  result: {
    kicker: "For your winery",
    title: "What this changes if your harvest lives in three places.",
    items: [
      {
        lead: "You stop assembling the picture.",
        body: "One view, current on its own, all season.",
      },
      {
        lead: "Every number sits on its section.",
        body: "It reads like the land it is walked on.",
      },
      {
        lead: "You see readiness coming.",
        body: "Scored against your winery's own standard, before the pick.",
      },
      {
        lead: "One lot, followed the whole way.",
        body: "Berry, tank, barrel and bottle on a single thread.",
      },
    ],
  },
  vis: {
    /** The honesty label the three restored frames carry, which is doctrine
     *  section 5's rule for a demo: the readings on them are invented. The
     *  section map holds its own copy under `map` because VineyardMap reads
     *  that object and this bead does not own that component. */
    honest: "Illustrative view, invented data.",
    /** One live view. The three places the BEFORE section names are still on
     *  the left of this picture, because they are the winery's own and they
     *  did not go away; what changed is that nobody walks to them. */
    view: {
      tag: "nobody assembles it any more",
      caption:
        "Morning starts with the harvest already assembled. The three places still hold their numbers, and going to get them is no longer anyone's job.",
      aria:
        "A production system, spreadsheets and field notebooks arriving in one view of the harvest, current through the day.",
      system: "system",
      spreadsheets: "spreadsheets",
      notebooks: "field notebooks",
      panel: "The harvest, today",
      live: "LIVE",
      harvest: "HARVEST",
      inSeason: "in season",
      ripeness: "RIPENESS",
      reading: "current reading",
      sections: "SECTIONS",
      allMapped: "all on the map",
      tanks: "TANKS",
      tracked: "tracked",
    },
    /** A reading with an address. The result is the one in `result.items`:
     *  every number sits on its section, so nobody carries the vineyard in
     *  their head to act on a line. */
    place: {
      tag: "the section, already on screen",
      caption:
        "The line says B3 is approaching, and the section it means is right there. Nobody has to picture the vineyard to act on a reading.",
      aria:
        "The row for section B3, bound to its block on a map of the vineyard.",
      section: "SECTION",
      state: "STATE",
      hold: "hold",
      approaching: "approaching",
      atTarget: "at target",
    },
    /** The pick, seen coming. Illustrative like the map, and labelled as such
     *  on the frame: the curve is a shape, and no date on it is measured. */
    ahead: {
      tag: "the pick, on the calendar first",
      caption:
        "Readiness reaches the calendar before it reaches the rows, so the pick is planned with time in hand.",
      aria:
        "A readiness curve climbing to the Monte Xanic standard line, with a projected point on the date the section comes due.",
      readiness: "READINESS",
      standard: "MONTE XANIC STANDARD",
      anticipated: "anticipated",
    },
    map: {
      legendMain: "Vineyard sections",
      legendSub: "quality scored against Monte Xanic's standard",
      honest: "Illustrative view, invented data.",
      plotsAria:
        "Nine vineyard sections through the season",
      sectionWord: "Section",
      plateAspects: "heat / water / sample",
      plateStatus: "quality vs standard",
      plateAction: "hold",
      heat: "heat",
      water: "water",
      sample: "sample",
      quality: "quality",
      vsStandard: "vs standard",
      meets: "meets standard, harvest",
      below: "below standard, hold",
      fallback:
        "Nine vineyard sections scoring against Monte Xanic's own standard as the season's heat accumulates.",
      seasonLab: "Season, accumulated heat",
      early: "early",
      harvest: "harvest",
      rangeAria:
        "Season heat. Drag to score each section against the standard.",
    },
    b2b: {
      berry: "Berry",
      tank: "Tank",
      barrel: "Barrel",
      bottle: "Bottle",
      note: "vine to bottle, one thread",
      ariaH: "One thread through four stations: berry, tank, barrel, bottle.",
      ariaV: "One thread down through four stations: berry, tank, barrel, bottle.",
      fallback:
        "Berry, tank, barrel, bottle: one thread from vine to finished bottle.",
    },
  },
  diagDesc:
    "Ten business days on your ads, your site and your operation, and a written memo at the end.",
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
    title: "Caso Monte Xanic",
    description:
      "Un proceso financiero de Monte Xanic toma cerca de 97 por ciento menos tiempo: de una hora larga a unos dos minutos.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Caso",
    t1: "Un proceso financiero de Monte Xanic ahora toma ",
    accent: "97% menos",
    t2: " tiempo.",
    sub: "Cerca de una hora armándolo a mano, ahora unos dos minutos, con actualización durante el día. La vendimia que hay detrás se ve en una sola vista.",
  },
  media: {
    beforeCap:
      "Así era antes: la lectura se anotaba en papel y el panorama se armaba después.",
    beforeAlt: "Una hoja de registro en papel en la estación de trabajo.",
    afterCap:
      "La mesa del laboratorio hoy. La lectura se toma una sola vez y la vista queda al día desde ese momento.",
    afterAlt: "La mesa del laboratorio, con el registro abierto en la laptop.",
    videoCap:
      "De la uva a la botella, el hilo completo en el teléfono, consultado entre las mismas barricas que describe.",
    videoAlt: "Una mano recorre el registro de la vendimia en un teléfono, con barricas al fondo.",
    play: "Reproducir",
    pause: "Pausar",
  },
  facts: {
    aria: "Datos del caso y su sustento",
    rows: [
      { k: "Cliente", v: "Monte Xanic" },
      { k: "Sector", v: "Vinícola" },
      { k: "Lugar", v: "Valle de Guadalupe, Baja California" },
      { k: "Relación", v: "Construcción y trabajo continuo" },
      {
        k: "Lo que construimos",
        v: "Vista de vendimia al día, mapas por cuadro, predicción de madurez, seguimiento de la uva a la botella, reportes financieros automáticos",
      },
      {
        k: "Resultado",
        v: "De una hora de trabajo financiero a unos dos minutos, con actualización durante el día",
      },
    ],
    basisK: "Sustento",
    basis:
      "La hora se cronometró a mano antes de la construcción; los dos minutos son la actualización del tablero, y la vista se actualiza durante el día; la distancia entre las dos cifras ronda el 97 por ciento. Aquí no aparece ninguna cifra de producción, de ventas ni financiera de Monte Xanic.",
  },
  before: {
    kicker: "Antes",
    title: "La vendimia estaba repartida en tres lugares que no coincidían entre sí.",
    p1: "Monte Xanic hace vino en el Valle de Guadalupe y es meticulosa con lo que llega a la botella. La vendimia que hay detrás merece la misma claridad.",
    p2: "Los números estaban en un sistema de producción, en archivos de Excel y en libretas de campo, allá entre las hileras. Para ver la vendimia completa había que juntarlos a mano, y para entonces el panorama ya estaba atrasado. En un corte, uno o dos días hacen la diferencia.",
  },
  changed: {
    kicker: "Lo que cambió",
    title: "Una sola vista al día, y cada número en su cuadro.",
    sub: "Las tres fuentes alimentan una vista que se actualiza sola, ligada a los cuadros reales del viñedo. La madurez se califica con el estándar de la propia vinícola, así que se ve venir cuándo le toca a cada cuadro.",
  },
  thread: {
    kicker: "De la uva a la botella",
    title: "Un solo hilo, de la vid a la botella.",
    sub: "Todas las etapas quedan en el mismo hilo, así que un ajuste llega en plena temporada, cuando todavía puede cambiar el vino.",
  },
  number: {
    kicker: "El número",
    title: "Una hora de trabajo financiero, ahora unos dos minutos.",
    sub: "El mismo proceso, rehecho para que se actualice solo durante el día.",
    manual: "A MANO",
    auto: "SE HACE SOLO",
    long: "1 hora",
    short: "2 min",
    less: "97% menos",
    refreshed: "SE ACTUALIZA DURANTE EL DÍA",
    tag: "de una hora a unos dos minutos",
    aria: "Un proceso manual de cerca de una hora se reduce a unos dos minutos.",
  },
  result: {
    kicker: "Para su bodega",
    title: "Lo que cambia si su vendimia está repartida en tres lugares.",
    items: [
      {
        lead: "Ya nadie arma el panorama a mano.",
        body: "Una sola vista que se mantiene al corriente sola, toda la temporada.",
      },
      {
        lead: "Cada número queda en su cuadro.",
        body: "Se lee igual que se recorre el viñedo.",
      },
      {
        lead: "La madurez se ve venir.",
        body: "Calificada con el estándar de su propia bodega, antes del corte.",
      },
      {
        lead: "Un lote se sigue de principio a fin.",
        body: "Uva, tanque, barrica y botella en un solo hilo.",
      },
    ],
  },
  vis: {
    honest: "Vista ilustrativa, datos inventados.",
    view: {
      tag: "ya nadie la arma a mano",
      caption:
        "La mañana empieza con la vendimia ya armada. Los tres lugares siguen ahí con sus números, y ya nadie tiene que ir a juntarlos.",
      aria:
        "Un sistema de producción, hojas de cálculo y libretas de campo llegan a una sola vista de la vendimia, al día.",
      system: "sistema",
      spreadsheets: "hojas de cálculo",
      notebooks: "libretas de campo",
      panel: "La vendimia, hoy",
      live: "AL DÍA",
      harvest: "VENDIMIA",
      inSeason: "en temporada",
      ripeness: "MADUREZ",
      reading: "lectura al día",
      sections: "CUADROS",
      allMapped: "todos en el mapa",
      tanks: "TANQUES",
      tracked: "con seguimiento",
    },
    place: {
      tag: "el cuadro, ya en pantalla",
      caption:
        "El renglón dice que B3 se acerca, y el cuadro del que habla está ahí mismo. Ya nadie necesita imaginarse el viñedo para saber qué hacer con una lectura.",
      aria:
        "El renglón del cuadro B3, ligado a su polígono en un mapa del viñedo.",
      section: "CUADRO",
      state: "ESTADO",
      hold: "esperar",
      approaching: "acercándose",
      atTarget: "en su punto",
    },
    ahead: {
      tag: "el corte, primero en el calendario",
      caption:
        "La madurez llega al calendario antes que a las hileras, así que el corte se planea con tiempo.",
      aria:
        "Una curva de madurez que sube hasta la línea del estándar de Monte Xanic, con un punto proyectado en la fecha en que el cuadro llega a su punto.",
      readiness: "MADUREZ",
      standard: "ESTÁNDAR MONTE XANIC",
      anticipated: "prevista",
    },
    map: {
      legendMain: "Cuadros del viñedo",
      legendSub: "calidad contra el estándar de Monte Xanic",
      honest: "Vista ilustrativa, datos inventados.",
      plotsAria:
        "Nueve cuadros del viñedo a lo largo de la temporada",
      sectionWord: "Cuadro",
      plateAspects: "calor / agua / muestra",
      plateStatus: "calidad contra estándar",
      plateAction: "esperar",
      heat: "calor",
      water: "agua",
      sample: "muestra",
      quality: "calidad",
      vsStandard: "contra estándar",
      meets: "cumple el estándar, cosechar",
      below: "por debajo del estándar, esperar",
      fallback:
        "Nueve cuadros del viñedo se califican contra el estándar de Monte Xanic conforme se acumula el calor de la temporada.",
      seasonLab: "Temporada, calor acumulado",
      early: "temprano",
      harvest: "vendimia",
      rangeAria:
        "Calor de la temporada. Arrastre para calificar cada cuadro contra el estándar.",
    },
    b2b: {
      berry: "Uva",
      tank: "Tanque",
      barrel: "Barrica",
      bottle: "Botella",
      note: "de la vid a la botella, un hilo",
      ariaH: "Un hilo que pasa por cuatro estaciones: uva, tanque, barrica, botella.",
      ariaV: "Un hilo que baja por cuatro estaciones: uva, tanque, barrica, botella.",
      fallback:
        "Uva, tanque, barrica, botella: un solo hilo de la vid a la botella.",
    },
  },
  diagDesc:
    "Diez días hábiles dedicados a sus anuncios, el sitio y la operación, y al final un informe escrito.",
  diagSpecs: [
    { d: "Día 1", t: "Una sesión de trabajo para revisar los tres." },
    { d: "Días 2 a 9", t: "Revisamos a fondo lo que hay detrás de los números." },
    {
      d: "Día 10",
      t: "Le entregamos el informe: qué funciona, qué falla y por dónde empezar.",
    },
    { d: "Después", t: "Le proponemos la construcción, o usted se lleva el informe y ahí termina." },
  ],
};

export type MonteXanicDict = typeof en;
export const monteXanic: Dict<MonteXanicDict> = { en, es };
