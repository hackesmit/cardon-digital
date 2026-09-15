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
 *     three came from. Nothing else on the page is a measured result.
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
    accent: "about 97 percent less",
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
      "The same station today. The reading is taken once and the view is current from that moment.",
    afterAlt: "The same station, with a tablet on it.",
    videoCap:
      "Harvest intake at the scale. What is recorded here lands in the view the cellar is reading.",
    videoAlt: "A load on the intake scale at harvest.",
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
        v: "An hour of finance work, now about two minutes, refreshed through the day",
      },
    ],
    basisK: "Basis",
    basis:
      "The hour was timed by hand before the build; the two minutes are the refresh the dashboard generates; 97 percent is the distance between them. No Monte Xanic production, sales or financial figure appears here.",
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
    title: "An hour of finance work, now about two minutes.",
    sub: "The same workflow, rebuilt to run itself, and it refreshes through the day.",
    manual: "BY HAND",
    auto: "RUNS ITSELF",
    long: "about 1 hr",
    short: "about 2 min",
    less: "about 97 percent less",
    refreshed: "REFRESHED THROUGH THE DAY",
    tag: "an hour, compressed to two minutes",
    aria: "A one hour manual workflow compresses to about two minutes.",
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
      "Un flujo financiero de Monte Xanic toma como 97 por ciento menos tiempo: de una hora a unos dos minutos.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Caso",
    t1: "Un flujo financiero de Monte Xanic ahora toma ",
    accent: "como 97 por ciento menos",
    t2: " tiempo.",
    sub: "Como una hora de armado a mano, ahora unos dos minutos, con actualización durante el día. La cosecha detrás se lee en una sola vista.",
  },
  media: {
    beforeCap:
      "Como era antes: la lectura se anota en papel y la imagen se arma después.",
    beforeAlt: "Una hoja de registro en papel en la estación.",
    afterCap:
      "La misma estación hoy. La lectura se toma una vez y la vista queda al día.",
    afterAlt: "La misma estación, ahora con una tableta.",
    videoCap:
      "Recepción de uva en la báscula. Lo que se registra aquí cae en la vista que la bodega lee.",
    videoAlt: "Una carga en la báscula de recepción.",
    play: "Reproducir",
    pause: "Pausar",
  },
  facts: {
    aria: "Datos del caso y su base",
    rows: [
      { k: "Cliente", v: "Monte Xanic" },
      { k: "Sector", v: "Bodega" },
      { k: "Lugar", v: "Valle de Guadalupe, Baja California" },
      { k: "Relación", v: "Construcción y trabajo continuo" },
      {
        k: "Lo que construimos",
        v: "Vista de cosecha al día, mapas de cuadros, predicción de madurez, seguimiento de la baya a la botella, reportes financieros automáticos",
      },
      {
        k: "Resultado",
        v: "De una hora de trabajo financiero a unos dos minutos, con actualización durante el día",
      },
    ],
    basisK: "Base",
    basis:
      "La hora se cronometró a mano antes de la construcción; los dos minutos son la actualización que genera el tablero; el 97 por ciento es la distancia entre las dos. Aquí no aparece ninguna cifra de producción, de ventas ni financiera de Monte Xanic.",
  },
  before: {
    kicker: "Antes",
    title: "La cosecha vivía en tres lugares y no coincidía en ninguno.",
    p1: "Monte Xanic hace vino en el Valle de Guadalupe y es meticulosa con lo que va en la botella. La cosecha detrás merece la misma claridad.",
    p2: "Los números estaban en un sistema de producción, en archivos de Excel y en libretas de campo allá en los surcos. Ver la cosecha completa obligaba a juntarlos a mano, y para entonces la imagen ya estaba vieja. Un corte se define por uno o dos días.",
  },
  changed: {
    kicker: "Lo que cambió",
    title: "Una sola vista al día, y cada número parado en su cuadro.",
    sub: "Las tres fuentes alimentan una vista que se actualiza sola, amarrada a los cuadros reales del viñedo. La madurez se califica contra el estándar de la bodega, así que el cuadro se ve venir.",
  },
  thread: {
    kicker: "De la baya a la botella",
    title: "Un solo hilo, de la vid a la botella.",
    sub: "Cada etapa vive en el mismo hilo, así que un ajuste cae en temporada, cuando todavía cambia el vino.",
  },
  number: {
    kicker: "El número",
    title: "Una hora de trabajo financiero, ahora unos dos minutos.",
    sub: "El mismo flujo, reconstruido para correr solo, y se actualiza durante el día.",
    manual: "A MANO",
    auto: "SE HACE SOLO",
    long: "como 1 hora",
    short: "como 2 min",
    less: "como 97 por ciento menos",
    refreshed: "SE ACTUALIZA DURANTE EL DÍA",
    tag: "una hora, comprimida a dos minutos",
    aria: "Un flujo manual de una hora se comprime a unos dos minutos.",
  },
  result: {
    kicker: "Para su bodega",
    title: "Lo que cambia si su cosecha vive en tres lugares.",
    items: [
      {
        lead: "Ya nadie arma la imagen a mano.",
        body: "Una sola vista, al corriente sola, toda la temporada.",
      },
      {
        lead: "Cada número se para en su cuadro.",
        body: "Se lee como la tierra que se camina.",
      },
      {
        lead: "La madurez se ve venir.",
        body: "Contra el estándar de su propia bodega, antes del corte.",
      },
      {
        lead: "Un lote se sigue de principio a fin.",
        body: "Baya, tanque, barrica y botella en un solo hilo.",
      },
    ],
  },
  vis: {
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
        "Nueve cuadros del viñedo calificando contra el estándar de Monte Xanic conforme se acumula el calor de la temporada.",
      seasonLab: "Temporada, calor acumulado",
      early: "temprano",
      harvest: "cosecha",
      rangeAria:
        "Calor de la temporada. Arrastre para calificar cada cuadro contra el estándar.",
    },
    b2b: {
      berry: "Baya",
      tank: "Tanque",
      barrel: "Barrica",
      bottle: "Botella",
      note: "de la vid a la botella, un hilo",
      ariaH: "Un hilo por cuatro estaciones: baya, tanque, barrica, botella.",
      ariaV: "Un hilo de arriba abajo por cuatro estaciones: baya, tanque, barrica, botella.",
      fallback:
        "Baya, tanque, barrica, botella: un solo hilo de la vid a la botella.",
    },
  },
  diagDesc:
    "Diez días hábiles sobre sus anuncios, su sitio y su operación, y al final un informe escrito.",
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

export type MonteXanicDict = typeof en;
export const monteXanic: Dict<MonteXanicDict> = { en, es };
