import type { Dict } from "./rich";

/** Hiring and HR page copy. */

const en = {
  meta: {
    title: "Hiring and HR growth systems",
    description:
      "One applicant pipeline instead of inboxes and tabs, qualification stages the team can read, scheduling that runs itself, and bilingual candidate demand priced on performance.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Industries / Hiring",
    t1: "Hiring that moves ",
    accent: "like a system",
    t2: ", not a stack of tabs.",
    sub: "Every applicant, both languages, in one lane you can read. We wire your job boards, careers inbox, and tracking spreadsheets into a single hiring pipeline your team runs and owns. **Decisions you can see, from first click to signed offer.**",
    ctaGhost: "See what we build",
  },
  value: {
    aria: "What that is worth to a hiring team",
    srTitle: "What it is worth to a hiring team",
    items: [
      {
        key: "One source of truth",
        lead: "Every applicant in one lane, __not ten open tabs.__",
        body: "The careers inbox, the job boards, and the spreadsheet become one pipeline your team reads from.",
      },
      {
        key: "Legible to everyone",
        lead: "The stage anyone can read __at a glance.__",
        body: "Applied, screened, interviewed, offer. Where each candidate stands is never a mystery or a status meeting.",
      },
      {
        key: "Both markets",
        lead: "Two languages, __one funnel.__",
        body: "English and Spanish, the US and Mexico, written natively and measured before anyone optimizes.",
      },
    ],
  },
  caps: {
    kicker: "What we build",
    title: "One pipeline for the whole hire.",
    sub: "Hiring is a domain we have built for. We put in place the pieces below for a team tired of tracking people across inboxes, sheets, and job-board tabs, then trained the business to run it and kept it theirs.",
    cards: [
      {
        h: "One applicant pipeline",
        body: "Job boards, the careers inbox, and the tracking spreadsheet collapse into a single lane every applicant travels, from first touch to signed offer. No more hunting across tabs to answer where someone stands.",
      },
      {
        h: "Stages the whole team reads",
        body: "Applied, screened, interviewed, offer. Anyone can open the board and see where each candidate sits and what moves them forward, so hiring stops depending on one person's memory.",
      },
      {
        h: "Interview scheduling that runs itself",
        body: "The back and forth of finding a time turns into a routine that runs on its own. Coordinators stop chasing calendars, candidates stop waiting, and the manual hours come back every month.",
      },
      {
        h: "Bilingual candidate demand",
        body: "We source in English and Spanish, across the US and Mexico, written natively rather than translated after the fact. We confirm the measurement is real before anyone optimizes, and the ad work is priced in proportion to performance: a share of spend with a floor, or, once measurement you trust is in place, a share of the results it drives.",
      },
      {
        h: "Reporting the owner actually reads",
        body: "Not a dashboard nobody opens. The few readings that tell you where the funnel leaks and which source is worth more, measured from your own pipeline:",
      },
    ],
    chips: ["Time to hire", "Stage drop-off", "Source quality"],
    chipFoot:
      "Concepts you can act on, drawn from your own pipeline, never numbers we invented.",
  },
  diagDesc:
    "Ten business days looking at how you hire, from where candidates come from to how offers get made, as one system. You get a written memo, not a sales deck, telling you what is true, what is broken, and what to build first.",
  diagSpecs: [
    "**Day 1.** A working session on your roles, your sources, and how applicants move today.",
    "**Days 2 to 9.** We dig: sources, pipeline, screening, scheduling, the numbers behind the numbers.",
    "**Day 10.** The memo lands: what is true, what is broken, what to build first.",
    "**Free, with no strings.** Act on it with us or without us. If we build, pricing is agreed up front.",
  ],
};

const es: typeof en = {
  meta: {
    title: "Sistemas para reclutamiento",
    description:
      "Un solo canal de candidatos en lugar de bandejas y pestañas, etapas que todo el equipo entiende, agenda de entrevistas que se hace sola y demanda de candidatos en los dos idiomas con precio por resultado.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Sectores / Reclutamiento",
    t1: "Contratar se mueve ",
    accent: "como un sistema",
    t2: ", no como un montón de pestañas.",
    sub: "Cada candidato, en los dos idiomas, en un solo carril que usted puede leer. Conectamos sus bolsas de trabajo, el correo de vacantes y las hojas de seguimiento en un solo canal de contratación que su equipo opera y que es suyo. **Decisiones que se ven, del primer clic a la oferta firmada.**",
    ctaGhost: "Vea lo que construimos",
  },
  value: {
    aria: "Lo que esto vale para un equipo de reclutamiento",
    srTitle: "Lo que esto vale para un equipo de reclutamiento",
    items: [
      {
        key: "Un solo registro",
        lead: "Cada candidato en un solo carril, __no en diez pestañas abiertas.__",
        body: "El correo de vacantes, las bolsas de trabajo y la hoja de cálculo se vuelven un solo canal del que lee su equipo.",
      },
      {
        key: "Legible para todos",
        lead: "La etapa que cualquiera lee __de un vistazo.__",
        body: "Postulado, filtrado, entrevistado, oferta. Dónde está cada candidato nunca es un misterio ni una junta de estatus.",
      },
      {
        key: "Los dos mercados",
        lead: "Dos idiomas, __un solo embudo.__",
        body: "Español e inglés, México y Estados Unidos, escritos por separado y medidos antes de que alguien ajuste.",
      },
    ],
  },
  caps: {
    kicker: "Lo que construimos",
    title: "Un solo canal para toda la contratación.",
    sub: "El reclutamiento es un terreno en el que ya construimos. Pusimos las piezas de abajo para un equipo cansado de seguir personas entre bandejas, hojas y pestañas de bolsas de trabajo, y luego le enseñamos al negocio a operarlo y se lo dejamos.",
    cards: [
      {
        h: "Un solo canal de candidatos",
        body: "Las bolsas de trabajo, el correo de vacantes y la hoja de seguimiento se juntan en un solo carril por el que pasa cada candidato, del primer contacto a la oferta firmada. Ya no hay que buscar entre pestañas para responder dónde va alguien.",
      },
      {
        h: "Etapas que todo el equipo lee",
        body: "Postulado, filtrado, entrevistado, oferta. Cualquiera abre el tablero y ve dónde está cada candidato y qué lo mueve hacia adelante, así que contratar deja de depender de la memoria de una persona.",
      },
      {
        h: "Agenda de entrevistas que se hace sola",
        body: "El ir y venir para encontrar horario se vuelve una rutina que corre sola. Quien coordina deja de perseguir calendarios, los candidatos dejan de esperar, y las horas manuales regresan cada mes.",
      },
      {
        h: "Demanda de candidatos en los dos idiomas",
        body: "Buscamos en español y en inglés, en México y en Estados Unidos, escrito por separado y no traducido después. Confirmamos que la medición sea real antes de que alguien ajuste, y el trabajo de anuncios lleva precio proporcional al resultado: un porcentaje de la inversión con un piso, o, cuando ya existe una medición en la que usted confía, un porcentaje de los resultados que trae.",
      },
      {
        h: "Reportes que el dueño sí lee",
        body: "No un tablero que nadie abre. Las pocas lecturas que le dicen dónde se fuga el embudo y qué fuente vale más, medidas desde su propio canal:",
      },
    ],
    chips: ["Tiempo para contratar", "Caída por etapa", "Calidad de la fuente"],
    chipFoot:
      "Conceptos sobre los que se puede actuar, sacados de su propio canal, nunca números que nos inventamos.",
  },
  diagDesc:
    "Diez días hábiles revisando cómo contrata, desde de dónde vienen los candidatos hasta cómo se hacen las ofertas, como un solo sistema. Usted recibe un informe escrito, no una presentación de ventas: qué es cierto, qué está roto y qué conviene construir primero.",
  diagSpecs: [
    "**Día 1.** Una sesión de trabajo sobre sus vacantes, sus fuentes y cómo se mueven hoy los candidatos.",
    "**Días 2 a 9.** Escarbamos: fuentes, canal, filtrado, agenda y los números detrás de los números.",
    "**Día 10.** Llega el informe: qué es cierto, qué está roto y qué construir primero.",
    "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda desde el principio.",
  ],
};

export type HiringDict = typeof en;
export const hiring: Dict<HiringDict> = { en, es };
