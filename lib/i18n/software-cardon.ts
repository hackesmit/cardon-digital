import type { Dict } from "./rich";

/**
 * Custom software page copy for cardondigital.com (/software on the cardon
 * build, bead hq-3f6ut.3). Spanish authoritative.
 *
 * Since 2026-11-03 (Daniel, epic hq-3f6ut) the wine modules live on the wine
 * brand's own site, so this page sells custom software to any owner-run
 * business. It names no module and quotes no price: custom software has no
 * published entry price in lib/pricing.ts, so the page says how it is priced
 * (fixed, agreed after the diagnostic) and never a figure. The only figure is
 * Monte Xanic's own (about an hour of finance work, about two minutes now),
 * hedged the way lib/i18n/monte-xanic.ts hedges it; the operations visual
 * (FlowCompress) draws it from lib/i18n/software.ts `vis.ops`.
 *
 * The kinds of work in `examples` are things such a system can do, written as
 * capabilities, never as results a client has had.
 */

const en = {
  meta: {
    title: "Custom software and automation",
    description:
      "Cardon Digital builds custom software and automation for owner-run businesses in Baja California, whatever they sell: one record, reports that build themselves, the books current every morning. The code, data and accounts are yours.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Custom software and automation",
    title: "Software that does the repetitive work by itself.",
    titleAccent: "And the system is yours.",
    sub: "Cardon Digital builds custom software for owner-run businesses of any kind: a shop, a clinic, a workshop, a distributor. Each record is written once, where the work happens, the reports build themselves and the books are current every morning. It is built around how your team works, and the code and data are yours.",
    proof: "Monte Xanic: about an hour of finance work, now about two minutes.",
    more: "See every price",
  },
  gets: {
    kicker: "What you end up with",
    title: "What changes with a system of your own?",
    items: [
      {
        h: "The hours come back.",
        body: "What somebody rebuilt by hand every week runs on its own: reports, reconciliations, the view of the day.",
      },
      {
        h: "One record.",
        body: "Sales, orders, appointments, invoices and the books stop living in ten places that never agree.",
      },
      {
        h: "Answers from your own data.",
        body: "An assistant that answers in plain words from your record and shows where each figure came from. When there is no record, it says so.",
      },
      {
        h: "Yours, keys and all.",
        body: "Code, data and accounts in your name. If the service stops, the system keeps running.",
      },
    ],
  },
  examples: {
    kicker: "Examples",
    title: "Which part of your week can run by itself?",
    items: [
      {
        h: "Quotes that turn into orders.",
        body: "The quote goes out from a form, becomes an order and reaches the books without anyone copying it again.",
      },
      {
        h: "The report that builds itself.",
        body: "The weekly report somebody assembles by hand is ready on Monday morning, with the same numbers everyone sees.",
      },
      {
        h: "Stock you can trust.",
        body: "Each sale updates the stock, and you know what to reorder before it runs out.",
      },
      {
        h: "One calendar.",
        body: "Appointments from WhatsApp, the phone and the site land in one calendar, and the client gets a reminder.",
      },
    ],
    note: "These are examples. The diagnostic says which part of your operation can run by itself, and what it costs.",
  },
  proof: {
    kicker: "Case study",
    title: "An hour of finance work, about two minutes now.",
    body: "At Monte Xanic somebody assembled a finance view by hand every week, in about an hour. Now it refreshes through the day and nobody touches it. The hour was timed by hand before the build.",
  },
  how: {
    kicker: "How it works",
    title: "How does it go, from the diagnostic to the handover?",
    steps: [
      { k: "01", body: "The diagnostic, at no cost. Ten business days and a written memo that is yours." },
      { k: "02", body: "The build. A fixed price, agreed before anyone starts." },
      { k: "03", body: "The handover. Your team trained, the accounts in your name, and a call every week while the service runs." },
    ],
  },
  familiar: {
    kicker: "Objections",
    title: "Sound familiar?",
    items: [
      {
        q: "My team will never take up another system.",
        a: "The record is written once, where the work already happens, from the phone they carry.",
      },
      {
        q: "I paid for software once and it left with the agency.",
        a: "The code, the data and the keys are yours from the first day, and they stay yours.",
      },
      {
        q: "What happens if I stop the service?",
        a: "The system keeps running in your accounts, with your data. We hand it over documented, with your team trained.",
      },
    ],
  },
  faq: {
    title: "Custom software questions, answered",
    items: [
      {
        question: "How much does custom software cost?",
        answer:
          "Each system has a fixed price, agreed after the free diagnostic and before the build starts. The build is paid half to start and half on delivery.",
      },
      {
        question: "What does the free diagnostic include?",
        answer:
          "Ten business days on your operation, your site and your ads, and a written memo that is yours: what is true, what is broken, what to build first.",
      },
      {
        question: "Does it work for my kind of business?",
        answer:
          "If part of your week is repetitive, yes: copying data from one place to another, building the same report, chasing a quote or an appointment. The diagnostic says which part can run by itself.",
      },
      {
        question: "Can I ask the system questions about my own numbers?",
        answer:
          "Yes. An assistant answers in plain words from your record and shows where each figure came from. When there is no record, it says so.",
      },
      {
        question: "Who owns the code and the data?",
        answer:
          "You do. The code, the data and the accounts are in your name from the first day, and if the service stops the system keeps running.",
      },
      {
        question: "What support is there after the handover?",
        answer:
          "Your team is trained at the handover, the accounts are in your name, and there is a call every week while the service runs.",
      },
    ],
  },
  diagDesc:
    "Ten business days on your operation, your site and your ads, and a written memo that is yours: what is true, what is broken, what to build first.",
  /** The one line that sends a winery to the wine brand; the name is read from lib/brand.ts. */
  wine: {
    lead: "Software for wineries:",
  },
};

const es: typeof en = {
  meta: {
    title: "Software a la medida y automatización",
    description:
      "Cardon Digital hace software a la medida y automatización para negocios de Baja California, sea cual sea su giro: un solo registro, reportes que se arman solos y las cuentas al corriente cada mañana. El código, los datos y las cuentas son suyos.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Software a la medida y automatización",
    title: "Software que hace solo el trabajo repetitivo.",
    titleAccent: "Y el sistema es suyo.",
    sub: "Cardon Digital hace software a la medida para negocios de cualquier giro: una tienda, un consultorio, un taller, una distribuidora. Cada dato se registra una sola vez, donde se hace el trabajo, los reportes se arman solos y las cuentas amanecen al corriente. Se adapta a cómo trabaja su equipo, y el código y los datos son suyos.",
    proof: "Monte Xanic: una hora de trabajo en finanzas que hoy toma unos dos minutos.",
    more: "Ver todos los precios",
  },
  gets: {
    kicker: "Con qué se queda",
    title: "¿Qué cambia con un sistema propio?",
    items: [
      {
        h: "Recupera las horas.",
        body: "Lo que alguien rehacía a mano cada semana ahora sale solo: reportes, conciliaciones, el resumen del día.",
      },
      {
        h: "Un solo registro.",
        body: "Ventas, pedidos, citas, facturas y cuentas dejan de estar en diez lugares que nunca cuadran.",
      },
      {
        h: "Respuestas con sus propios datos.",
        body: "Un asistente que contesta con palabras sencillas a partir de su registro y le muestra de dónde salió cada cifra. Si no hay registro, se lo dice.",
      },
      {
        h: "Suyo, con todos los accesos.",
        body: "Código, datos y cuentas a su nombre. Si deja el servicio, el sistema sigue funcionando.",
      },
    ],
  },
  examples: {
    kicker: "Ejemplos",
    title: "¿Qué parte de su semana puede hacerse sola?",
    items: [
      {
        h: "Cotizaciones que se vuelven pedidos.",
        body: "La cotización sale desde un formulario, se convierte en pedido y llega a las cuentas sin que nadie la vuelva a capturar.",
      },
      {
        h: "El reporte que se arma solo.",
        body: "El reporte semanal que alguien arma a mano está listo el lunes en la mañana, con los mismos números para todos.",
      },
      {
        h: "Un inventario confiable.",
        body: "Cada venta descuenta del inventario, y usted sabe qué resurtir antes de que se acabe.",
      },
      {
        h: "Una sola agenda.",
        body: "Las citas que llegan por WhatsApp, por teléfono y por el sitio quedan en una sola agenda, y el cliente recibe un recordatorio.",
      },
    ],
    note: "Son ejemplos. El diagnóstico dice qué parte de su operación puede hacerse sola, y cuánto cuesta.",
  },
  proof: {
    kicker: "Caso de estudio",
    title: "Una hora de trabajo en finanzas, hoy unos dos minutos.",
    body: "En Monte Xanic alguien armaba a mano cada semana una vista financiera, en cerca de una hora. Hoy se actualiza durante el día y nadie la toca. La hora se cronometró a mano antes del desarrollo.",
  },
  how: {
    kicker: "Cómo funciona",
    title: "¿Cómo es el proceso, del diagnóstico a la entrega?",
    steps: [
      { k: "01", body: "El diagnóstico, sin costo. Diez días hábiles y un informe por escrito que se queda con usted." },
      { k: "02", body: "El desarrollo. Precio fijo, acordado antes de empezar." },
      { k: "03", body: "La entrega. Su equipo capacitado, las cuentas a su nombre y una llamada cada semana mientras dure el servicio." },
    ],
  },
  familiar: {
    kicker: "Objeciones",
    title: "¿Le suena?",
    items: [
      {
        q: "Mi gente nunca va a usar otro sistema.",
        a: "Cada dato se anota una sola vez, desde el teléfono que ya traen, ahí donde ya se hace el trabajo.",
      },
      {
        q: "Ya pagué un software y se fue con la agencia.",
        a: "El código, los datos y los accesos son suyos desde el primer día, y se quedan con usted.",
      },
      {
        q: "¿Qué pasa si dejo el servicio?",
        a: "El sistema sigue funcionando en sus cuentas, con sus datos. Se lo entregamos documentado y con su equipo capacitado.",
      },
    ],
  },
  faq: {
    title: "Preguntas sobre software a la medida",
    items: [
      {
        question: "¿Cuánto cuesta el software a la medida?",
        answer:
          "Cada sistema tiene un precio fijo, que se acuerda después del diagnóstico sin costo y antes de empezar el desarrollo. El desarrollo se paga la mitad al empezar y la mitad contra entrega.",
      },
      {
        question: "¿Qué incluye el diagnóstico sin costo?",
        answer:
          "Diez días hábiles para revisar su operación, su sitio y sus anuncios, y un informe por escrito que se queda con usted: qué funciona, qué falla y por dónde empezar.",
      },
      {
        question: "¿Sirve para mi tipo de negocio?",
        answer:
          "Si parte de su semana es trabajo repetitivo, sí: pasar datos de un lugar a otro, armar el mismo reporte, darle seguimiento a una cotización o a una cita. El diagnóstico dice qué parte puede hacerse sola.",
      },
      {
        question: "¿Le puedo preguntar al sistema por mis propios números?",
        answer:
          "Sí. Un asistente contesta con palabras sencillas a partir de su registro y le muestra de dónde salió cada cifra. Si no hay registro, se lo dice.",
      },
      {
        question: "¿De quién son el código y los datos?",
        answer:
          "Suyos. El código, los datos y las cuentas están a su nombre desde el primer día, y si deja el servicio el sistema sigue funcionando.",
      },
      {
        question: "¿Qué soporte hay después de la entrega?",
        answer:
          "Su equipo queda capacitado en la entrega, las cuentas están a su nombre y hay una llamada cada semana mientras dure el servicio.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles para revisar su operación, su sitio y sus anuncios, y un informe por escrito que se queda con usted: qué funciona, qué falla y por dónde empezar.",
  wine: {
    lead: "Software para vinícolas:",
  },
};

export type SoftwareCardonDict = typeof en;
export const softwareCardon: Dict<SoftwareCardonDict> = { en, es };
