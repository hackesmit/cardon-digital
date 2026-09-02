import type { Dict } from "./rich";

/** Clinics page copy. */

const en = {
  meta: {
    title: "Clinic growth systems",
    description:
      "A growth system for clinics: one bilingual intake pipeline, reminders that cut no-shows, and click-to-procedure measurement built first, so you defend your share of patient flow and recapture the rest.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Industries / Clinics",
    title: "Patient flow is down.",
    titleAccent: "Defend your share, and recapture it.",
    sub: "Dental, medical, and specialty clinics take patients from two worlds at once: patients traveling for care, and locals from down the street. We wire the ads, the inquiries, and the calendar into one system your front desk reads and runs in both languages, so you keep the patients you already earn and take back the ones you are paying to lose. **Measure the leak, then close it.**",
    ctaGhost: "See the problems we solve",
  },
  problems: {
    kicker: "The problems",
    title: "The problems we solve.",
    sub: "In plain language. **The problems you already live with are the ones we are built to solve.**",
    items: [
      {
        h: "Inquiries scattered, replies too slow.",
        body: "Patients reach out on WhatsApp, web forms, and phone calls, and the messages land in three different places with no single line to work from. Speed is the whole game. An inquiry answered within a minute converts around **seven times better** than one answered an hour later, and the gap between a typical inquiry-to-booking rate and an optimized one is patients you already paid to reach, lost to a slow reply.",
      },
      {
        h: "No-shows, amplified by distance.",
        body: "A booked appointment is not a kept one. Travel time and border waits can turn a short visit into most of a day, and a thin reminder cadence lets confirmed patients quietly fall off the calendar. Every no-show is a slot that earns nothing and a patient who may not rebook.",
      },
      {
        h: "Trust, at a distance.",
        body: "A patient is committing thousands of dollars and a long trip to a clinic they found online, sight unseen. That leap is the hardest part of the sale, and it is why so many patients hand it to a middleman who vouches for the clinic on their behalf.",
      },
      {
        h: "The middleman toll.",
        body: "If patients reach you through platforms and facilitators, a cut of every case leaves with them, paid for demand you could be reaching directly. What the middleman is really selling is trust and reach. **Both can be built, and owned by you.**",
      },
      {
        h: "Advertising you are allowed to run.",
        body: "Medical advertising is genuinely constrained. COFEPRIS regulates every medical ad in Mexico, down to organic social posts, and Google gates healthcare advertising on its own terms. Campaigns that ignore either regime get pulled or fined, campaigns built for both keep running. Here, compliance is not fine print, it is whether the ads run at all.",
      },
    ],
    stats: [
      { v: "~7x", k: "reply in a minute vs an hour" },
      { v: "~3% to 5-15%", k: "inquiry to booking, typical vs optimized" },
    ],
  },
  build: {
    kicker: "What we build",
    title: "One system, mapped to each problem.",
    sub: "Five systems, one job: a week your front desk trusts. Each one is aimed at a problem above, and together they read as **one system your team ends up owning.**",
    featureTag: "Build first / Flagship",
    featureH:
      "The measurement spine: know which inquiry became which patient.",
    featureBody:
      "Click-to-WhatsApp source tracking, a lightweight CRM, and a booking log that ties an inquiry all the way to a completed procedure. It is the first thing we build, because it is what makes every later decision measurable: which channel earns patients, what a real conversion rate is, and how much of the middleman toll you took back. Nothing else is priced on performance until this exists and both sides trust the numbers it produces.",
    featureBorrow:
      "Answers problem 04, and the blind spot under every other **number on this page**.",
    cards: [
      {
        num: "01 / Intake",
        h: "One intake pipeline, one bilingual concierge.",
        body: "Every channel, WhatsApp, form, call, and DM, lands in one place, worked by a named bilingual concierge flow that replies in minutes, in the patient's own language. No inquiry sits unread, no message falls between inboxes.",
        borrow: "Answers **problem 01 / scattered inquiries, slow replies**.",
      },
      {
        num: "02 / Calendar",
        h: "Reminders and confirmations that hold the week.",
        body: "Booking, confirmation, and reminder messages become workflows that run on their own and quietly cut no-shows, so the week your front desk trusts stays full without anyone chasing it by hand.",
        borrow: "Answers **problem 02 / no-shows**.",
      },
      {
        num: "03 / Trust",
        h: "Trust infrastructure, owned by you.",
        body: "Verified reviews, transparent pricing pages, clear written patient policies, and real social proof, the credibility a patient at a distance needs before they commit. This is buying back what the middleman was really selling, and keeping it.",
        borrow: "Answers **problem 03 / trust at a distance**.",
      },
      {
        num: "04 / Compliance",
        h: "Compliant campaigns that keep running.",
        body: "Google and Meta campaigns designed against COFEPRIS rules and the platforms' healthcare policies from the first draft, at what the platforms actually allow. Campaigns designed to keep running.",
        borrow: "Answers **problem 05 / compliant advertising**.",
      },
    ],
    scopeLabel: "One line on scope",
    scopeBody:
      "This offer is the marketing and funnel surface: ads, inquiries, tracking, reminders, and trust. Clinical records stay **out of scope by design**, and any access to inquiry or booking information is minimized and governed by a written data agreement before work begins.",
    pricingLabel: "How we price",
    pricingBody:
      "Advertising is priced as a **percent of ad spend, with a floor**, never as a percent of your patient revenue. Builds are scoped and priced after the diagnostic, agreed up front. Most clinics then keep a care retainer for corrections and refinements as the team settles in; pause it anytime, the system keeps working. Clean numbers, no stake in your procedures.",
  },
  why: {
    kicker: "Why us",
    title: "Two markets and two languages are the job, not an add-on.",
    items: [
      {
        key: "Bilingual by default",
        lead: "Two languages, __both written natively.__",
        body: "English and Spanish from the first ad to the last reminder, not translated after the fact. The patient reads their own language the whole way.",
      },
      {
        key: "Both sides of the border",
        lead: "Built in Baja California, __fluent in both markets.__",
        body: "US patients crossing for care and local patients booking down the street are one schedule, handled by people who work both sides of the line every day.",
      },
      {
        key: "Owned by your team",
        lead: "Systems your own __front desk ends up owning.__",
        body: "We build it, train it into the clinic, and hand over the keys. No per-seat software to babysit, no dependence on us to keep the week running.",
      },
    ],
  },
  diagDesc:
    "Ten business days instrumenting your actual inquiry pipeline: response times, where inquiries leak between channels, real conversion, and your no-show rate. You get a written memo with hard numbers, not a sales deck: what is true, what is leaking, and what to build first. Measure the leak, then decide.",
  diagSpecs: [
    "**Day 1.** A working session on how patients find you, reach you, and land on your calendar.",
    "**Days 2 to 9.** We instrument the pipeline: response times, channel leakage, conversion, and no-shows, measured on de-identified numbers from your real flow.",
    "**Day 10.** The memo lands: hard numbers on what is true, what is leaking, and what to build first.",
    "**Free, with no strings.** Act on it with us or without us. If we build, pricing is agreed up front.",
  ],
};

const es: typeof en = {
  meta: {
    title: "Sistemas para clínicas",
    description:
      "Un sistema de crecimiento para clínicas: un solo canal de contacto en los dos idiomas, recordatorios que bajan las faltas y medición del clic al procedimiento construida primero, para defender su parte del flujo de pacientes y recuperar el resto.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Sectores / Clínicas",
    title: "El flujo de pacientes bajó.",
    titleAccent: "Defienda su parte y recupere el resto.",
    sub: "Las clínicas dentales, médicas y de especialidad reciben pacientes de dos mundos a la vez: los que viajan por atención y los vecinos de la cuadra. Conectamos los anuncios, las solicitudes y la agenda en un solo sistema que su recepción lee y opera en los dos idiomas, para que conserve a los pacientes que ya se ganó y recupere a los que está pagando por perder. **Mida la fuga, luego ciérrela.**",
    ctaGhost: "Vea los problemas que resolvemos",
  },
  problems: {
    kicker: "Los problemas",
    title: "Los problemas que resolvemos.",
    sub: "En palabras claras. **Los problemas con los que ya vive son los que estamos hechos para resolver.**",
    items: [
      {
        h: "Solicitudes dispersas, respuestas lentas.",
        body: "Los pacientes escriben por WhatsApp, por formulario y por teléfono, y los mensajes caen en tres lugares distintos sin una sola fila de trabajo. La velocidad es todo el juego. Una solicitud contestada dentro del primer minuto convierte alrededor de **siete veces mejor** que una contestada una hora después, y la diferencia entre una tasa típica de solicitud a cita y una optimizada son pacientes que usted ya pagó por alcanzar, perdidos por una respuesta lenta.",
      },
      {
        h: "Faltas a la cita, amplificadas por la distancia.",
        body: "Una cita agendada no es una cita cumplida. El traslado y las esperas en la frontera convierten una visita corta en casi todo el día, y una cadena floja de recordatorios deja que pacientes ya confirmados se caigan del calendario en silencio. Cada falta es un espacio que no gana nada y un paciente que puede no volver a agendar.",
      },
      {
        h: "Confianza, a distancia.",
        body: "Un paciente está comprometiendo miles de dólares y un viaje largo con una clínica que encontró en línea y que no conoce. Ese salto es la parte más difícil de la venta, y es la razón por la que tantos pacientes se lo entregan a un intermediario que responde por la clínica en su nombre.",
      },
      {
        h: "La cuota del intermediario.",
        body: "Si los pacientes le llegan por plataformas y facilitadores, una parte de cada caso se va con ellos, pagada por demanda que usted podría alcanzar de forma directa. Lo que en realidad vende el intermediario es confianza y alcance. **Las dos se pueden construir, y quedarse con usted.**",
      },
      {
        h: "Publicidad que sí puede correr.",
        body: "La publicidad médica está de verdad limitada. COFEPRIS regula cada anuncio médico en México, hasta las publicaciones orgánicas, y Google pone sus propias condiciones a la publicidad de salud. Las campañas que ignoran cualquiera de los dos marcos se caen o se multan; las que se hacen para los dos siguen corriendo. Aquí, cumplir no es letra chica: es si los anuncios corren o no.",
      },
    ],
    stats: [
      { v: "~7x", k: "respuesta en un minuto contra una hora" },
      { v: "~3% a 5-15%", k: "de solicitud a cita, típico contra optimizado" },
    ],
  },
  build: {
    kicker: "Lo que construimos",
    title: "Un solo sistema, apuntado a cada problema.",
    sub: "Cinco sistemas, un solo objetivo: una semana en la que su recepción confía. Cada uno apunta a un problema de arriba, y juntos se leen como **un solo sistema del que su equipo termina siendo dueño.**",
    featureTag: "Se construye primero / Pieza principal",
    featureH:
      "La columna de medición: saber qué solicitud se volvió qué paciente.",
    featureBody:
      "Seguimiento de origen en el clic a WhatsApp, un CRM ligero y una bitácora de citas que amarra una solicitud hasta el procedimiento terminado. Es lo primero que construimos, porque es lo que vuelve medible toda decisión posterior: qué canal gana pacientes, cuál es la tasa de conversión real y cuánto de la cuota del intermediario recuperó. Nada más se cobra por resultado hasta que esto existe y las dos partes confían en los números que produce.",
    featureBorrow:
      "Responde al problema 04, y al punto ciego debajo de cada otro **número de esta página**.",
    cards: [
      {
        num: "01 / Recepción",
        h: "Un solo canal de entrada, una atención en los dos idiomas.",
        body: "Todos los canales, WhatsApp, formulario, llamada y mensaje directo, caen en un solo lugar, atendidos por un flujo con nombre que responde en minutos, en el idioma del paciente. Ninguna solicitud se queda sin leer, ningún mensaje se cae entre bandejas.",
        borrow:
          "Responde al **problema 01 / solicitudes dispersas y respuestas lentas**.",
      },
      {
        num: "02 / Agenda",
        h: "Recordatorios y confirmaciones que sostienen la semana.",
        body: "Los mensajes de cita, confirmación y recordatorio se vuelven rutinas que corren solas y bajan las faltas en silencio, así que la semana en la que confía su recepción se mantiene llena sin que nadie la persiga a mano.",
        borrow: "Responde al **problema 02 / faltas a la cita**.",
      },
      {
        num: "03 / Confianza",
        h: "Infraestructura de confianza, y es suya.",
        body: "Reseñas verificadas, páginas de precios claras, políticas de paciente escritas y prueba social real: la credibilidad que necesita un paciente a distancia antes de comprometerse. Esto es recomprar lo que en realidad vendía el intermediario, y quedárselo.",
        borrow: "Responde al **problema 03 / confianza a distancia**.",
      },
      {
        num: "04 / Cumplimiento",
        h: "Campañas que cumplen y siguen corriendo.",
        body: "Campañas de Google y Meta diseñadas contra las reglas de COFEPRIS y las políticas de salud de las plataformas desde el primer borrador, con lo que las plataformas de verdad permiten. Campañas hechas para seguir corriendo.",
        borrow: "Responde al **problema 05 / publicidad que cumple**.",
      },
    ],
    scopeLabel: "Una línea sobre el alcance",
    scopeBody:
      "Esta oferta es la superficie de mercadotecnia y del embudo: anuncios, solicitudes, medición, recordatorios y confianza. Los expedientes clínicos quedan **fuera de alcance por diseño**, y cualquier acceso a información de solicitudes o citas se reduce al mínimo y se rige por un acuerdo de datos escrito antes de empezar.",
    pricingLabel: "Cómo cobramos",
    pricingBody:
      "La publicidad se cobra como **un porcentaje de la inversión en anuncios, con un piso**, nunca como un porcentaje del ingreso de sus pacientes. Las construcciones se definen y se cotizan después del diagnóstico, acordadas desde el principio. La mayoría de las clínicas conserva luego un mantenimiento para correcciones y ajustes mientras el equipo se acomoda; puede pausarlo cuando quiera y el sistema sigue funcionando. Números limpios, sin participación en sus procedimientos.",
  },
  why: {
    kicker: "Por qué nosotros",
    title: "Dos mercados y dos idiomas son el trabajo, no un extra.",
    items: [
      {
        key: "En los dos idiomas por defecto",
        lead: "Dos idiomas, __cada uno escrito por separado.__",
        body: "Español e inglés desde el primer anuncio hasta el último recordatorio, no traducidos después. El paciente lee su propio idioma todo el camino.",
      },
      {
        key: "Los dos lados de la frontera",
        lead: "Hechos en Baja California, __con soltura en los dos mercados.__",
        body: "Los pacientes de Estados Unidos que cruzan por atención y los pacientes locales que agendan a la vuelta son una sola agenda, atendida por gente que trabaja los dos lados de la línea todos los días.",
      },
      {
        key: "De su equipo",
        lead: "Sistemas de los que su propia __recepción termina siendo dueña.__",
        body: "Lo construimos, lo enseñamos dentro de la clínica y entregamos las llaves. Sin software por usuario que andar cuidando, y sin depender de nosotros para que la semana corra.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles instrumentando su canal real de solicitudes: tiempos de respuesta, dónde se fugan las solicitudes entre canales, conversión real y su tasa de faltas. Usted recibe un informe escrito con números duros, no una presentación de ventas: qué es cierto, qué se está fugando y qué conviene construir primero. Mida la fuga, luego decida.",
  diagSpecs: [
    "**Día 1.** Una sesión de trabajo sobre cómo lo encuentran los pacientes, cómo lo contactan y cómo llegan a su agenda.",
    "**Días 2 a 9.** Instrumentamos el canal: tiempos de respuesta, fuga entre canales, conversión y faltas, medidos sobre números sin identificar de su flujo real.",
    "**Día 10.** Llega el informe: números duros sobre qué es cierto, qué se está fugando y qué construir primero.",
    "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda desde el principio.",
  ],
};

export type ClinicsDict = typeof en;
export const clinics: Dict<ClinicsDict> = { en, es };
