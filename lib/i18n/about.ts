import type { Dict } from "./rich";

/**
 * About page copy. Every fact here traces to the About brief in
 * bunkers/cardon-digital/research/2026-09/daniel-answers-2026-09-02.md:
 * the mission (notebooks, data from past vintages that cannot be found,
 * vintages that cannot be compared or replicated, the industry outpaced), the
 * beliefs, how we work, and the credentials line. Nothing is added to it.
 *
 * Voice is "we" on every sentence. The founder is named once in the copy, in
 * the mission, and there is no personal history and no photo, per the brief.
 * The credentials block right after the mission names him once more as the
 * holder of each certificate; that name, like every fact in the block, is read
 * from lib/credentials.ts (bead hq-i4b5.8), so this file carries only its labels.
 *
 * Two versions since bead hq-3f6ut.3: `aboutVino` is the brief as written, a
 * winery mission, and serves the wine brand; `about`, at the bottom, serves
 * cardondigital.com. app/[locale]/about/page.tsx picks one by brand.
 */

const vinoEn = {
  meta: {
    title: "About Cardon Digital",
    description:
      "We come out of years spent working in wine. Cardon Digital builds the system a winery runs on, so a vintage can be compared, repeated and improved on its own record.",
  },
  hero: {
    eyebrow: "About",
    title: "We come from wine.",
    titleAccent: "We build for anyone who runs a business by hand.",
    sub: "Cardon Digital builds websites, runs Google Ads and builds the software an owner-run business operates on. We come out of years inside a Valle winery, watching the number somebody needed go missing and the client somebody needed never find the door.",
  },
  media: {
    bandCap: "Years inside a cellar like this one are where the record problem was learned.",
    bandAlt: "A barrel room under warm light",
  },
  mission: {
    kicker: "Why we exist",
    title: "All the care goes into the wine, and the record stays in a notebook.",
    body: [
      "Our founder, Daniel Hack, has worked in wine for years. What he saw repeats in most wineries: paper notebooks, data from past vintages nobody can find, wines that cannot be compared against each other with any precision, and a vintage that came out well and cannot be repeated, because nobody wrote down what was done.",
      "Other food industries moved ahead in the meantime. They measure more, they keep better records, and they learn from what they did last year. Wine depends more than any of them on what happened in the vintage before, and keeps the worst record of it.",
      "Cardon exists to close that distance. We give a winery the tools to track its own processes and make better wine from more exact analysis, and we give any owner-run business the same three things: a site people find, ads that bring the right people, and a system that keeps the record so the team does not have to.",
    ],
  },
  beliefs: {
    kicker: "What we believe",
    title: "A person makes the wine, and we do not change that.",
    body: [
      "Winemaking is human, natural, and different every year. Nobody automates that and we do not try. The goal is the highest quality the fruit allows, and that means every process done well, including the ones nobody sees.",
      "Keeping the data in order is one of the most important parts of that, because seeing what was done and how it turned out in each vintage is the only way to repeat what worked.",
    ],
  },
  how: {
    kicker: "How we work",
    title: "Before we build anything, we learn how you work today.",
    body: [
      "Before we propose anything we go through how you work now: where the information is kept, how it is analyzed, whether tests get run and what they are compared against, and how one vintage is set beside the ones before it. What to build, and in what order, comes out of that.",
      "During the build and after it we are on WhatsApp, and there is a call every week. The question goes to whoever built the system, with no help desk and no ticket number in between.",
    ],
    credK: "What we work in",
    cred: "Google Ads, websites, program development, process automation, and AI systems. In wine, WSET Level 2.",
  },
  credentials: {
    kicker: "Certificates",
    title: "Every certificate can be checked on the issuer's own page.",
    holder: "Holder",
    issuer: "Issued by",
    valid: "Valid",
    validRange: "{from} to {until}",
    code: "Code",
    newTab: "(opens in a new tab)",
  },
  diagDesc:
    "Ten business days looking at your records, your ads and your operations as one system. You get a written memo: what is true, what is broken, and what to build first.",
};

const vinoEs: typeof vinoEn = {
  meta: {
    title: "Quiénes somos",
    description:
      "Venimos de años de trabajo en el vino. Cardon Digital construye el sistema con el que trabaja una bodega, para que una añada se pueda comparar, repetir y mejorar con base en su propio registro.",
  },
  hero: {
    eyebrow: "Quiénes somos",
    title: "Venimos del vino.",
    titleAccent: "Construimos para quien lleva su negocio a mano.",
    sub: "Cardon Digital hace sitios web, maneja anuncios en Google y construye el software con el que opera un negocio. Venimos de pasar años dentro de una bodega del Valle, viendo cómo se perdía el dato que alguien necesitaba y cómo el cliente que hacía falta nunca daba con la puerta.",
  },
  media: {
    bandCap: "El problema del registro lo aprendimos en años de trabajo dentro de una cava como esta.",
    bandAlt: "Una cava de barricas con luz cálida",
  },
  mission: {
    kicker: "Por qué existimos",
    title: "Toda la atención va al vino, y el registro se queda en una libreta.",
    body: [
      "Nuestro fundador, Daniel Hack, lleva años trabajando en el vino. Lo que vio se repite en casi todas las bodegas: libretas de papel, datos de añadas pasadas que ya nadie encuentra, vinos que no se pueden comparar entre sí con precisión, y una añada que salió bien y no se puede repetir, porque nadie dejó por escrito qué se hizo.",
      "Mientras tanto, otras industrias de alimentos se adelantaron. Miden más, llevan mejores registros y aprenden de lo que hicieron el año pasado. El vino, que depende más que ninguna de ellas de lo que pasó en la añada anterior, es el que peor lo registra.",
      "Cardon existe para cerrar esa brecha. A la bodega le damos las herramientas para dar seguimiento a sus propios procesos y hacer mejor vino con un análisis más exacto, y a cualquier negocio le damos las mismas tres cosas: un sitio que la gente encuentra, anuncios que traen a la gente indicada y un sistema que guarda el registro para que su equipo no tenga que hacerlo.",
    ],
  },
  beliefs: {
    kicker: "En qué creemos",
    title: "El vino lo hace una persona, y eso no lo cambiamos.",
    body: [
      "Hacer vino es un proceso humano, natural y distinto cada año. Eso nadie lo automatiza, y nosotros no lo intentamos. La meta es la mayor calidad que dé la uva, y para eso cada proceso tiene que hacerse bien, incluso los que nadie ve.",
      "Llevar los datos en orden es una de las partes más importantes de ese trabajo, porque ver qué se hizo y qué resultado dio en cada añada es la única forma de repetir lo que funcionó.",
    ],
  },
  how: {
    kicker: "Cómo trabajamos",
    title: "Antes de construir nada, entendemos cómo trabaja usted hoy.",
    body: [
      "Antes de proponer cualquier cosa revisamos cómo trabaja hoy: dónde guarda la información, cómo la analiza, si hace pruebas y contra qué las compara, y cómo contrasta una añada con las anteriores. De ahí sale qué hay que construir y en qué orden.",
      "Mientras construimos, y también después, nos encuentra en WhatsApp y hay una llamada cada semana. Su pregunta le llega a quien construyó el sistema, sin mesa de ayuda ni número de folio de por medio.",
    ],
    credK: "En qué trabajamos",
    cred: "Google Ads, sitios web, desarrollo de software, automatización de procesos y sistemas de inteligencia artificial. En vino, WSET Nivel 2.",
  },
  credentials: {
    kicker: "Certificaciones",
    title: "Cada certificación se puede comprobar en la página de quien la emite.",
    holder: "Titular",
    issuer: "Emitida por",
    valid: "Vigencia",
    validRange: "del {from} al {until}",
    code: "Código",
    newTab: "(se abre en una pestaña nueva)",
  },
  diagDesc:
    "Diez días hábiles en los que revisamos sus registros, sus anuncios y su operación como un solo sistema. Usted recibe un informe escrito: qué funciona, qué falla y qué conviene construir primero.",
};

export type AboutDict = typeof vinoEn;

/**
 * cardondigital.com's about page since bead hq-3f6ut.3 (Daniel, 2026-11-03):
 * the wine software has its own brand, so Cardon's story is the one it tells
 * every owner-run business. Same facts as the brief, read wider: the founder's
 * years in wine are where the problem was learned, stated once, and the
 * mission is the four services. The beliefs keep the brief's point (a person
 * does the work that takes judgment, the record is kept in order) without the
 * winemaking. How we work and the credentials are the brief's, unchanged.
 */
const en: AboutDict = {
  meta: {
    title: "About Cardon Digital",
    description:
      "Cardon Digital builds websites, Google Ads paid per contact and custom software for owner-run businesses in Baja California, and checks what AI answers say about them. On WhatsApp, with a call every week, and everything stays in your name.",
  },
  hero: {
    eyebrow: "About",
    title: "We build for anyone who runs a business by hand.",
    titleAccent: "More clients, less repetitive work.",
    sub: "Cardon Digital builds websites, Google Ads paid per contact and custom software for owner-run businesses, and checks what AI answers say about yours. We come from years of watching the number somebody needed go missing and the client somebody needed never find the door.",
  },
  media: {
    bandCap: "Years inside a cellar taught us the problem every business has: the record goes missing.",
    bandAlt: "A barrel room under warm light",
  },
  mission: {
    kicker: "Why we exist",
    title: "Most businesses run on notebooks, spreadsheets and memory.",
    body: [
      "Our founder, Daniel Hack, worked in wine for years, and what he saw there repeats in most owner-run businesses: records in paper notebooks, last year's data that nobody can find, a report somebody rebuilds by hand every week, and a website nobody writes to.",
      "Cardon exists to close that distance. We give an owner-run business a site people find, ads that bring the right people, a check of what AI answers say about it, and a system that keeps the record so the team does not have to.",
    ],
  },
  beliefs: {
    kicker: "What we believe",
    title: "The judgment stays with you. The repetitive work does not.",
    body: [
      "Running a business takes judgment, and nobody automates that; we do not try. What can run by itself is the work around it: copying data from one place to another, building the same report, chasing the same quote.",
      "Keeping the record in order is one of the most important parts of that, because seeing what was done and how it turned out is the only way to repeat what worked.",
    ],
  },
  how: {
    kicker: "How we work",
    title: "Before we build anything, we learn how you work today.",
    body: [
      "Before we propose anything we go through how you work now: where the information is kept, how it is analyzed, what gets measured and what it is compared against. What to build, and in what order, comes out of that.",
      "During the build and after it we are on WhatsApp, and there is a call every week. The question goes to whoever built the system, with no help desk and no ticket number in between.",
    ],
    credK: "What we work in",
    cred: "Google Ads, websites, program development, process automation, and AI systems. In wine, WSET Level 2.",
  },
  credentials: {
    kicker: "Certificates",
    title: "Every certificate can be checked on the issuer's own page.",
    holder: "Holder",
    issuer: "Issued by",
    valid: "Valid",
    validRange: "{from} to {until}",
    code: "Code",
    newTab: "(opens in a new tab)",
  },
  diagDesc:
    "Ten business days looking at your records, your ads and your operations as one system. You get a written memo: what is true, what is broken, and what to build first.",
};

const es: AboutDict = {
  meta: {
    title: "Quiénes somos",
    description:
      "Cardon Digital hace sitios web, anuncios en Google con pago por contacto y software a la medida para negocios de Baja California, y revisa qué dicen de ellos las respuestas de IA. Por WhatsApp, con una llamada cada semana, y todo queda a su nombre.",
  },
  hero: {
    eyebrow: "Quiénes somos",
    title: "Construimos para quien lleva su negocio a mano.",
    titleAccent: "Más clientes y menos trabajo repetitivo.",
    sub: "Cardon Digital hace sitios web, anuncios en Google con pago por contacto y el software con el que opera un negocio, y revisa qué dicen de su negocio las respuestas de IA. Venimos de años de ver cómo se perdía el dato que alguien necesitaba y cómo el cliente que hacía falta nunca daba con la puerta.",
  },
  media: {
    bandCap: "Años dentro de una cava nos enseñaron el problema que tiene todo negocio: el registro se pierde.",
    bandAlt: "Una cava de barricas con luz cálida",
  },
  mission: {
    kicker: "Por qué existimos",
    title: "Casi todos los negocios funcionan con libretas, hojas de cálculo y memoria.",
    body: [
      "Nuestro fundador, Daniel Hack, trabajó años en el vino, y lo que vio ahí se repite en casi cualquier negocio con el dueño al frente: registros en libretas de papel, datos del año pasado que ya nadie encuentra, un reporte que alguien rehace a mano cada semana y un sitio web que no le trae ni un mensaje.",
      "Cardon existe para cerrar esa brecha. A un negocio le damos un sitio que la gente encuentra, anuncios que traen a la gente indicada, una revisión de qué dicen de él las respuestas de IA y un sistema que guarda el registro para que su equipo no tenga que hacerlo.",
    ],
  },
  beliefs: {
    kicker: "En qué creemos",
    title: "El criterio se queda con usted. El trabajo repetitivo, no.",
    body: [
      "Llevar un negocio requiere criterio, y eso nadie lo automatiza; nosotros no lo intentamos. Lo que sí puede hacerse solo es el trabajo de alrededor: pasar datos de un lugar a otro, armar el mismo reporte, darle seguimiento a la misma cotización.",
      "Llevar el registro en orden es una de las partes más importantes de ese trabajo, porque ver qué se hizo y qué resultado dio es la única forma de repetir lo que funcionó.",
    ],
  },
  how: {
    kicker: "Cómo trabajamos",
    title: "Antes de construir nada, entendemos cómo trabaja usted hoy.",
    body: [
      "Antes de proponer cualquier cosa revisamos cómo trabaja hoy: dónde guarda la información, cómo la analiza, qué mide y contra qué lo compara. De ahí sale qué hay que construir y en qué orden.",
      "Mientras construimos, y también después, nos encuentra en WhatsApp y hay una llamada cada semana. Su pregunta le llega a quien construyó el sistema, sin mesa de ayuda ni número de folio de por medio.",
    ],
    credK: "En qué trabajamos",
    cred: "Google Ads, sitios web, desarrollo de software, automatización de procesos y sistemas de inteligencia artificial. En vino, WSET Nivel 2.",
  },
  credentials: {
    kicker: "Certificaciones",
    title: "Cada certificación se puede comprobar en la página de quien la emite.",
    holder: "Titular",
    issuer: "Emitida por",
    valid: "Vigencia",
    validRange: "del {from} al {until}",
    code: "Código",
    newTab: "(se abre en una pestaña nueva)",
  },
  diagDesc:
    "Diez días hábiles en los que revisamos sus registros, sus anuncios y su operación como un solo sistema. Usted recibe un informe escrito: qué funciona, qué falla y qué conviene construir primero.",
};

/** cardondigital.com's about page. */
export const about: Dict<AboutDict> = { en, es };

/** The wine brand's about page: the brief's winery mission, unchanged. */
export const aboutVino: Dict<AboutDict> = { en: vinoEn, es: vinoEs };
