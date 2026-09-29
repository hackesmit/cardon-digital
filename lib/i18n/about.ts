import type { Dict } from "./rich";

/**
 * About page copy. Every fact here traces to the About brief in
 * bunkers/cardon-digital/research/2026-09/daniel-answers-2026-09-02.md:
 * the mission (notebooks, data from past vintages that cannot be found,
 * vintages that cannot be compared or replicated, the industry outpaced), the
 * beliefs, how we work, and the credentials line. Nothing is added to it.
 *
 * Voice is "we" on every sentence. The founder is named once, in the mission,
 * and there is no personal history and no photo, per the brief.
 */

const en = {
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
    title: "The wine gets careful attention. The record almost never does.",
    body: [
      "Our founder, Daniel Hack, has worked in wine for years. What he saw repeats in most wineries: paper notebooks, data from past vintages nobody can find, wines that cannot be compared against each other with any precision, and a vintage that came out well and cannot be repeated, because nobody wrote down what was done.",
      "Other food industries moved ahead in the meantime. They measure more, they keep better records, and they learn from what they did last year. Wine depends more than any of them on what happened in the vintage before, and keeps the worst record of it.",
      "Cardon exists to close that distance. We give a winery the tools to track its own processes and make better wine from more exact analysis, and we give any owner-run business the same three things: a site people find, ads that bring the right people, and a system that keeps the record so the team does not have to.",
    ],
  },
  beliefs: {
    kicker: "What we believe",
    title: "A person makes the wine. The system holds the record.",
    body: [
      "Winemaking is human, natural, and different every year. Nobody automates that and we do not try. The goal is the highest quality the fruit allows, and that means every process done well, including the ones nobody sees.",
      "Keeping and tracking the data properly is one of the most important parts of it. Seeing what was done and how it landed in each vintage and each harvest is not administration. It is the only way to repeat what worked.",
    ],
  },
  how: {
    kicker: "How we work",
    title: "We learn your method first. Then we build.",
    body: [
      "Before we propose anything we go through how you work now: where the information is kept, how it is analyzed, whether tests get run and what they are compared against, and how one vintage is set beside the ones before it. What to build, and in what order, comes out of that.",
      "During the build and after it we are on WhatsApp, and there is a call every week. The question goes to whoever built the system, with no help desk and no ticket number in between.",
    ],
    credK: "What we work in",
    cred: "Google Ads, websites, program development, process automation, and AI systems. In wine, WSET Level 2.",
  },
  diagDesc:
    "Ten business days looking at your records, your ads and your operations as one system. You get a written memo: what is true, what is broken, and what to build first.",
};

const es: typeof en = {
  meta: {
    title: "Quiénes somos",
    description:
      "Venimos de años trabajando en el vino. Cardon Digital construye el sistema con el que trabaja una bodega, para que una añada se pueda comparar, repetir y mejorar sobre su propio registro.",
  },
  hero: {
    eyebrow: "Quiénes somos",
    title: "Venimos del vino.",
    titleAccent: "Construimos para quien lleva su negocio a mano.",
    sub: "Cardon Digital hace sitios web, maneja anuncios en Google y construye el software con el que opera un negocio. Venimos de años dentro de una bodega del Valle, viendo cómo se pierde el dato que hacía falta y cómo el cliente que hacía falta nunca encuentra la puerta.",
  },
  media: {
    bandCap: "Años dentro de una cava como esta son donde se aprendió el problema del registro.",
    bandAlt: "Una cava de barricas con luz cálida",
  },
  mission: {
    kicker: "Por qué existimos",
    title: "Al vino se le cuida. Al registro casi nunca.",
    body: [
      "Nuestro fundador, Daniel Hack, lleva años trabajando en el vino. Lo que vio se repite en casi todas las bodegas: libretas de papel, datos de añadas pasadas que ya nadie encuentra, vinos que no se pueden comparar entre sí con precisión, y una añada que salió bien y no se puede repetir, porque nadie dejó por escrito qué se hizo.",
      "Mientras tanto, otras industrias de alimentos se adelantaron. Miden más, guardan mejor y aprenden de lo que hicieron el año pasado. El vino, que depende más que ninguna de lo que pasó en la añada anterior, es el que peor lo guarda.",
      "Cardon existe para cerrar esa distancia. Le damos a la bodega las herramientas para seguir sus propios procesos y hacer mejor vino a partir de un análisis más exacto, y le damos a cualquier negocio las mismas tres cosas: un sitio que la gente encuentra, anuncios que traen a la gente correcta y un sistema que guarda el registro para que su equipo no tenga que hacerlo.",
    ],
  },
  beliefs: {
    kicker: "En qué creemos",
    title: "El vino lo hace una persona. El registro lo sostiene el sistema.",
    body: [
      "Hacer vino es un proceso humano, natural y distinto cada año. Nadie automatiza eso y nosotros no lo intentamos. La meta es la mayor calidad que dé la uva, y para eso cada proceso tiene que hacerse bien, no nada más el que se ve.",
      "Guardar y seguir los datos con orden es una de las partes más importantes de eso. Ver qué se hizo y cómo le pegó a cada añada y a cada cosecha no es administración. Es la única forma de repetir lo que funcionó.",
    ],
  },
  how: {
    kicker: "Cómo trabajamos",
    title: "Primero entendemos su método. Después construimos.",
    body: [
      "Antes de proponer nada revisamos cómo trabaja hoy: dónde guarda la información, cómo la analiza, si hace pruebas y contra qué las compara, y cómo pone una añada junto a las anteriores. De ahí sale qué hay que construir, y en qué orden.",
      "Durante la construcción y después de ella estamos en WhatsApp, y hay una llamada cada semana. La pregunta llega a quien construyó el sistema, sin mesa de ayuda ni número de folio de por medio.",
    ],
    credK: "En qué trabajamos",
    cred: "Google Ads, sitios web, desarrollo de programas, automatización de procesos y sistemas de inteligencia artificial. En vino, WSET Nivel 2.",
  },
  diagDesc:
    "Diez días hábiles revisando sus registros, sus anuncios y su operación como un solo sistema. Usted recibe un informe escrito: qué es cierto, qué está roto y qué conviene construir primero.",
};

export type AboutDict = typeof en;
export const about: Dict<AboutDict> = { en, es };
