import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/i18n/metadata";
import { monteXanic } from "@/lib/i18n/monte-xanic";
import type { Guide, GuideCopy } from "./types";

/**
 * Third guide (bead hq-i4b5.13): how a winery automates its reports, written
 * from the Monte Xanic work. The original value is first-hand: what the case
 * page already publishes about where the numbers lived and what changed. The
 * one figure is the case's own, and it is not typed here: the result sentence
 * and its basis are read from lib/i18n/monte-xanic.ts, so the guide and the
 * case page can never disagree on it. No other Monte Xanic fact appears that
 * the case page does not already state, and no outside statistic at all.
 *
 * The steps and the advice are stated as chances and conditions. A winery's
 * reports depend on its own sources, and nothing here promises a saving.
 */

const caseResult = (l: Locale) => monteXanic[l].meta.description;
const caseBasis = (l: Locale) => monteXanic[l].facts.basis;
const caseUrl = (l: Locale) => SITE_URL + localePath(l, "/work/monte-xanic");

const es: GuideCopy = {
  meta: {
    title: "Cómo automatizar reportes de una bodega",
    description:
      "Un reporte de bodega se puede armar solo cuando cada dato se registra una vez, en formato digital, y una vista lo junta y se actualiza sin que nadie lo copie a mano.",
  },
  eyebrow: "Guía para bodegas y vinícolas del Valle de Guadalupe",
  title: "¿Cómo automatizo los reportes de mi bodega de vino?",
  lede: "Un reporte de bodega puede armarse solo cuando cada dato se registra una sola vez, en formato digital y en el lugar donde se toma, y una vista conecta esas fuentes y se actualiza durante el día. Lo usual es empezar por el reporte que más horas cuesta armar a mano y medir cuánto tarda antes y después.",
  sections: [
    {
      id: "que-es",
      h: "¿Qué significa automatizar los reportes de una bodega de vino?",
      blocks: [
        {
          kind: "p",
          text: "Automatizar un reporte de bodega quiere decir que el reporte se arma solo con los datos que ya existen, sin que alguien los copie de un lugar a otro. La persona que antes juntaba los números puede dedicar ese tiempo a leerlos y decidir.",
        },
        {
          kind: "p",
          text: "En una bodega los reportes que suelen armarse a mano son los de la vendimia, la madurez por cuadro, el seguimiento de cada lote y los números financieros. Cada uno puede automatizarse por separado, y no hace falta hacerlo todo al mismo tiempo.",
        },
      ],
    },
    {
      id: "por-que-tarda",
      h: "¿Por qué los reportes de una bodega tardan tanto en armarse a mano?",
      blocks: [
        {
          kind: "p",
          text: "Los reportes de una bodega tardan porque los números suelen estar repartidos en varios lugares que no se hablan entre sí. Alguien tiene que ir a cada uno, copiar los datos y cuadrarlos, y para cuando el reporte está listo el panorama ya puede estar atrasado.",
        },
        {
          kind: "list",
          ordered: false,
          title: "Dónde estaban los números de la vendimia en Monte Xanic antes del sistema",
          items: [
            "En un sistema de producción.",
            "En archivos de Excel.",
            "En libretas de campo, entre las hileras.",
          ],
        },
        {
          kind: "p",
          text: "En temporada de vendimia ese atraso pesa más, porque en un corte uno o dos días pueden hacer la diferencia. Un reporte que llega tarde puede llevar a decidir con datos de la semana pasada.",
        },
      ],
    },
    {
      id: "pasos",
      h: "¿Cuáles son los pasos para automatizar un reporte de la bodega?",
      blocks: [
        {
          kind: "p",
          text: "Automatizar un reporte de bodega suele hacerse en pasos cortos: se elige un reporte, se ubica de dónde sale cada número, se cambia la captura para que el dato se registre una vez, y se conecta todo a una vista que se actualiza sola. El orden importa más que la herramienta.",
        },
        {
          kind: "list",
          ordered: true,
          title: "Pasos para automatizar un reporte de bodega",
          items: [
            "Elija un reporte que se arme a mano con frecuencia y tome el tiempo que lleva armarlo, con reloj, antes de cambiar nada.",
            "Anote de dónde sale cada número del reporte: el sistema de producción, una hoja de cálculo, una libreta de campo o el laboratorio.",
            "Cambie la captura para que cada dato se registre una sola vez, en formato digital y donde se toma, ya sea en la mesa del laboratorio o en el viñedo.",
            "Conecte esas fuentes a una sola vista que se actualice durante el día, ligada a lo que la bodega ya reconoce, como sus cuadros y sus lotes.",
            "Durante unas semanas compare el reporte automático con el que se arma a mano, y deje el manual solo cuando los dos coincidan.",
            "Vuelva a tomar el tiempo con el reporte automático, para saber cuánto se ahorró en su caso.",
          ],
        },
      ],
    },
    {
      id: "cuanto-ahorra",
      h: "¿Cuánto tiempo se ahorra al automatizar un reporte de bodega?",
      blocks: [
        {
          kind: "p",
          text: "El tiempo que se ahorra al automatizar un reporte de bodega depende de cuánto trabajo a mano lleva hoy y de cuántas fuentes junta. Por eso conviene medirlo en cada caso, antes y después, con el mismo reporte.",
        },
        {
          kind: "p",
          text: `Un caso medido, en Monte Xanic. ${caseResult("es")} ${caseBasis("es")}`,
        },
        {
          kind: "p",
          text: "Esa cifra es de un solo proceso en una sola bodega. Otro reporte puede ahorrar más o menos tiempo, según sus fuentes y cuánto se arme hoy a mano.",
        },
      ],
    },
    {
      id: "cual-primero",
      h: "¿Qué reportes de una bodega conviene automatizar primero?",
      blocks: [
        {
          kind: "p",
          text: "Conviene empezar por el reporte que se arma más seguido, que junta más fuentes y que pierde valor cuando llega tarde. En muchas bodegas ese reporte es el de la vendimia en temporada o el financiero de cada semana.",
        },
        {
          kind: "list",
          ordered: false,
          title: "Señales de que un reporte de bodega es buen candidato para automatizarse",
          items: [
            "Alguien lo rehace a mano cada semana o cada día.",
            "Sus números salen de dos o más lugares distintos.",
            "Cuando llega tarde, una decisión se toma con datos viejos.",
            "Los datos se anotan primero en papel y después se pasan a la computadora.",
          ],
        },
      ],
    },
    {
      id: "antes-de-contratar",
      h: "¿Qué conviene preguntar antes de contratar un sistema de reportes para la bodega?",
      blocks: [
        {
          kind: "p",
          text: "Antes de contratar un sistema de reportes para la bodega conviene saber de quién son los datos y el código, si el sistema trabaja con las fuentes que ya tiene y cómo se va a medir el resultado. Dos propuestas parecidas pueden dejarle cosas muy distintas.",
        },
        {
          kind: "list",
          ordered: true,
          title: "Preguntas para comparar propuestas de automatización de reportes",
          items: [
            "¿Los datos, el código y las cuentas quedan a nombre de la bodega?",
            "¿Tengo que dejar mi sistema de producción o mis hojas de cálculo, o el sistema se conecta a ellos?",
            "¿Cada cuánto se actualiza el reporte y quién revisa que los números cuadren?",
            "¿Cómo se va a medir el tiempo que se ahorra, antes y después?",
          ],
        },
        {
          kind: "service",
          text: "Cardon Digital desarrolla software a la medida para bodegas y otros negocios, con reportes que se arman solos y los datos a nombre de usted.",
          label: "Ver software a la medida",
          path: "/software",
        },
      ],
    },
  ],
  sources: [
    {
      title: "Caso Monte Xanic",
      publisher: "Cardon Digital",
      url: `${caseUrl("es")}`,
      note: "Dónde estaban los números de la vendimia, lo que cambió y el tiempo medido de un proceso financiero, con su sustento.",
    },
  ],
  faq: {
    title: "Preguntas frecuentes sobre automatizar los reportes de una bodega",
    items: [
      {
        question: "¿Tengo que cambiar mi sistema de producción para automatizar los reportes?",
        answer:
          "No necesariamente. En Monte Xanic el sistema de producción, las hojas de cálculo y las libretas siguen ahí con sus números; lo que cambió es que una vista los junta sola y ya nadie tiene que ir a buscarlos.",
      },
      {
        question: "¿Se puede automatizar un reporte que hoy sale de libretas de papel?",
        answer:
          "Sí, si el dato se empieza a capturar en formato digital donde se toma, por ejemplo en la mesa del laboratorio o en el viñedo. Mientras el dato viva solo en papel, alguien tendrá que pasarlo a mano.",
      },
      {
        question: "¿Cada cuánto se actualiza un reporte automático de bodega?",
        answer:
          "Depende de cómo se diseñe y de cada cuánto llegan los datos. En el caso de Monte Xanic la vista se actualiza durante el día, así que la lectura queda al día desde que se toma.",
      },
      {
        question: "¿Cómo empiezo a automatizar los reportes de mi bodega con Cardon Digital?",
        answer:
          "Con el diagnóstico, que no tiene costo: diez días hábiles para revisar la operación, y al final un informe por escrito que es suyo, con qué funciona, qué falla y por dónde empezar.",
      },
    ],
  },
};

const en: GuideCopy = {
  meta: {
    title: "How to automate a winery's reports",
    description:
      "A winery report can build itself once each number is recorded once, in digital form, and one view pulls the sources together and refreshes without anyone copying by hand.",
  },
  eyebrow: "A guide for wineries in the Valle de Guadalupe and beyond",
  title: "How do I automate my winery's reports?",
  lede: "A winery report can build itself once each number is entered a single time, in digital form, where it is taken, and one view connects those sources and refreshes through the day. Most wineries start with the report that costs the most hours by hand, and time it before and after the change.",
  sections: [
    {
      id: "que-es",
      h: "What does automating a winery's reports mean?",
      blocks: [
        {
          kind: "p",
          text: "Automating a winery report means the report assembles itself from data that already exists, with nobody copying numbers from one place to another. Whoever used to gather the numbers can spend that time reading them and deciding.",
        },
        {
          kind: "p",
          text: "The reports a winery tends to build by hand are the harvest, ripeness by vineyard section, lot tracking and the finance numbers. Each one can be automated on its own, so there is no need to do them all at once.",
        },
      ],
    },
    {
      id: "por-que-tarda",
      h: "Why do winery reports take so long to build by hand?",
      blocks: [
        {
          kind: "p",
          text: "Winery reports take long because the numbers usually sit in several places that do not talk to each other. Someone has to visit each one, copy the data and reconcile it, and by the time the report is done the picture may already be old.",
        },
        {
          kind: "list",
          ordered: false,
          title: "Where Monte Xanic's harvest numbers lived before the system",
          items: [
            "In a production system.",
            "In Excel files.",
            "In paper notebooks out in the rows.",
          ],
        },
        {
          kind: "p",
          text: "During harvest that delay costs more, because a picking decision can turn on a day or two. A report that arrives late can mean deciding on last week's data.",
        },
      ],
    },
    {
      id: "pasos",
      h: "What are the steps to automate a winery report?",
      blocks: [
        {
          kind: "p",
          text: "Automating a winery report usually goes in short steps: pick one report, find where each number comes from, change data entry so each number is recorded once, and connect it all to a view that refreshes itself. The order matters more than the tool.",
        },
        {
          kind: "list",
          ordered: true,
          title: "Steps to automate a winery report",
          items: [
            "Pick a report your team builds by hand often, and time how long it takes, with a clock, before you change anything.",
            "Write down where each number in it comes from: the production system, a spreadsheet, a field notebook or the lab.",
            "Change data entry so each number is recorded once, in digital form, where it is taken, whether at the lab bench or in the vineyard.",
            "Connect those sources to one view that refreshes through the day, tied to what the winery already knows, like its vineyard sections and its lots.",
            "For a few weeks, check the automated report against the hand-built one, and retire the manual version once the two agree.",
            "Time the automated report again, so you know what you saved in your own case.",
          ],
        },
      ],
    },
    {
      id: "cuanto-ahorra",
      h: "How much time does automating a winery report save?",
      blocks: [
        {
          kind: "p",
          text: "The time saved by automating a winery report depends on how much hand work it takes today and how many sources it pulls together. That is why it pays to measure each case, before and after, on the same report.",
        },
        {
          kind: "p",
          text: `One measured case, at Monte Xanic. ${caseResult("en")} ${caseBasis("en")}`,
        },
        {
          kind: "p",
          text: "That figure comes from one workflow at one winery. Another report may save more or less time, depending on its sources and how much of it is built by hand today.",
        },
      ],
    },
    {
      id: "cual-primero",
      h: "Which winery reports are worth automating first?",
      blocks: [
        {
          kind: "p",
          text: "The best first candidate is usually the report built most often, from the most sources, that loses value when it arrives late. At many wineries that is the harvest report in season or the weekly finance report.",
        },
        {
          kind: "list",
          ordered: false,
          title: "Signs a winery report is a good candidate for automation",
          items: [
            "Someone rebuilds it by hand every week or every day.",
            "Its numbers come from two or more different places.",
            "When it is late, a decision gets made on stale data.",
            "The data is written on paper first and typed into a computer later.",
          ],
        },
      ],
    },
    {
      id: "antes-de-contratar",
      h: "What should you ask before hiring someone to automate your winery's reports?",
      blocks: [
        {
          kind: "p",
          text: "Before you hire anyone to automate your winery's reports, find out who owns the data and the code, whether the system works with the sources you already have, and how the result will be measured. Two similar proposals can leave you with very different things.",
        },
        {
          kind: "list",
          ordered: true,
          title: "Questions for comparing report automation proposals",
          items: [
            "Are the data, the code and the accounts in the winery's name?",
            "Do I have to leave my production system or my spreadsheets, or does the new system connect to them?",
            "How often does the report refresh, and who checks that the numbers reconcile?",
            "How will the time saved be measured, before and after?",
          ],
        },
        {
          kind: "service",
          text: "Cardon Digital builds custom software for wineries and other businesses, with reports that build themselves and the data in your name.",
          label: "See custom software",
          path: "/software",
        },
      ],
    },
  ],
  sources: [
    {
      title: "Monte Xanic case history",
      publisher: "Cardon Digital",
      url: `${caseUrl("en")}`,
      note: "Where the harvest numbers lived, what changed, and the measured time of one finance workflow, with its basis.",
    },
  ],
  faq: {
    title: "Common questions about automating winery reports",
    items: [
      {
        question: "Do I have to replace my production system to automate my reports?",
        answer:
          "Not necessarily. At Monte Xanic the production system, the spreadsheets and the notebooks still hold their numbers; what changed is that one view pulls them together on its own, and going to get them is no longer anyone's job.",
      },
      {
        question: "Can a report that comes from paper notebooks be automated?",
        answer:
          "Yes, once the number starts being captured in digital form where it is taken, for example at the lab bench or in the vineyard. While the number lives only on paper, someone still has to type it in.",
      },
      {
        question: "How often does an automated winery report refresh?",
        answer:
          "It depends on how it is designed and how often the data arrives. In the Monte Xanic case the view refreshes through the day, so a reading is current from the moment it is taken.",
      },
      {
        question: "How do I start automating my winery's reports with Cardon Digital?",
        answer:
          "With the diagnostic, which is free: ten business days looking at your operation, and a written memo at the end that is yours, covering what is true, what is broken and what to build first.",
      },
    ],
  },
};

export const automatizarReportesBodega: Guide = {
  slug: "automatizar-reportes-bodega",
  datePublished: "2026-10-22",
  dateModified: "2026-10-22",
  reviewBy: "2027-01-22",
  copy: { es, en },
};
