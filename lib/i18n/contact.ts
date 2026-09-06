import type { Dict } from "./rich";
import type { DoorVariant } from "@/lib/contact/doors";

/** The contact page: the doors this build actually has (WhatsApp, a booked
 *  call, the form) and the form's own labels, hints and answers. The Spanish
 *  is the original; the English follows it rather than the other way around.
 *
 *  The headline, the standfirst and the meta description are written once per
 *  door variant, because a door hides when its environment value is missing
 *  and the copy is never allowed to promise a door the page does not render.
 *  The form is always there, so a variant names what stands beside it. */

type Intro = { title: string; sub: string };

const enIntro: Record<DoorVariant, Intro> = {
  all: {
    title: "Three ways to __start__.",
    sub: "Pick whichever suits you. All three reach the same person, and that person is the one who does the work.",
  },
  whatsappForm: {
    title: "Two ways to __start__.",
    sub: "Pick whichever suits you. Both reach the same person, and that person is the one who does the work.",
  },
  bookingForm: {
    title: "Two ways to __start__.",
    sub: "Pick whichever suits you. Both reach the same person, and that person is the one who does the work.",
  },
  formOnly: {
    title: "Start with a __message__.",
    sub: "Leave us a few lines. They reach the person who does the work, and that person is the one who answers.",
  },
};

const enDescription: Record<DoorVariant, string> = {
  all: "Three ways to reach Cardon Digital: WhatsApp, a booked call, or a short message. All three reach the person who does the work.",
  whatsappForm:
    "Two ways to reach Cardon Digital: WhatsApp or a short message. Both reach the person who does the work.",
  bookingForm:
    "Two ways to reach Cardon Digital: a booked call or a short message. Both reach the person who does the work.",
  formOnly:
    "Write to Cardon Digital with a short message. It reaches the person who does the work.",
};

const en = {
  meta: {
    title: "Contact",
    description: enDescription,
  },
  eyebrow: "Contact",
  intro: enIntro,
  reply: "We answer within one business day.",

  doorsAria: "Ways to reach us",
  whatsapp: {
    kicker: "Fastest",
    title: "WhatsApp",
    body: "Write as you would to anyone else. Say what your business is and what is not working, and we take it from there.",
    cta: "Message on WhatsApp",
    prefill:
      "Hello. I saw the Cardon Digital site and I would like to talk about my business.",
  },
  booking: {
    kicker: "Calendar",
    title: "A call, at your hour",
    body: "Thirty minutes, no cost, no sales script. We ask what you sell, how the work arrives and where it gets stuck.",
    cta: "Book a call",
  },

  form: {
    kicker: "In writing",
    title: "Tell us what you need",
    sub: "The more concrete the message, the more useful the answer. Whoever reads it is who will reply.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    wineryLabel: "Winery or business",
    wineryPlaceholder: "What it is called",
    emailLabel: "Email",
    emailPlaceholder: "you@yourbusiness.com",
    whatsappLabel: "WhatsApp",
    whatsappPlaceholder: "With country code",
    messageLabel: "Message",
    messagePlaceholder:
      "What you sell, what is not working, and what you would like to be different.",
    optional: "optional",
    required: "required",
    submit: "Send message",
    sending: "Sending",
    /** The honeypot: hidden from people, filled in by bots. */
    honeypot: "Leave this field empty",
    privacy:
      "We use what you write here only to answer you. It goes to our own inbox, it feeds no mailing list, and we share it with nobody.",
    errors: {
      name: "Please write your name.",
      winery: "That name is longer than the field takes.",
      email: "That address does not read as a valid one.",
      whatsapp: "Digits only, with the country code.",
      message: "Tell us a little more, a few lines at least.",
      /** Two answers per problem: one for a page that has the WhatsApp door
       *  above the form, one for a page that does not. */
      general: {
        withWhatsapp:
          "The message did not go through. Write to us on WhatsApp and we will pick it up there.",
        alone: "The message did not go through. Please try again in a moment.",
      },
      rate: {
        withWhatsapp:
          "That is several messages in a row. Give it a few minutes, or write on WhatsApp.",
        alone: "That is several messages in a row. Give it a few minutes and send it again.",
      },
      large: "The message is longer than the form takes. Trim it a little.",
    },
    sentTitle: "Received.",
    sentBody: {
      withWhatsapp:
        "We answer by email within one business day. If you would rather not wait, WhatsApp is above.",
      alone: "We answer by email within one business day.",
    },
  },
};

const esIntro: Record<DoorVariant, Intro> = {
  all: {
    title: "Tres formas de __empezar__.",
    sub: "Escoja la que le acomode. Las tres llegan a la misma persona, y esa persona es quien hace el trabajo.",
  },
  whatsappForm: {
    title: "Dos formas de __empezar__.",
    sub: "Escoja la que le acomode. Las dos llegan a la misma persona, y esa persona es quien hace el trabajo.",
  },
  bookingForm: {
    title: "Dos formas de __empezar__.",
    sub: "Escoja la que le acomode. Las dos llegan a la misma persona, y esa persona es quien hace el trabajo.",
  },
  formOnly: {
    title: "Empiece con un __mensaje__.",
    sub: "Déjenos unas líneas. Llegan a quien hace el trabajo, y esa persona es quien le contesta.",
  },
};

const esDescription: Record<DoorVariant, string> = {
  all: "Tres formas de llegar a Cardon Digital: WhatsApp, una llamada agendada o un mensaje corto. Las tres llegan a quien hace el trabajo.",
  whatsappForm:
    "Dos formas de llegar a Cardon Digital: WhatsApp o un mensaje corto. Las dos llegan a quien hace el trabajo.",
  bookingForm:
    "Dos formas de llegar a Cardon Digital: una llamada agendada o un mensaje corto. Las dos llegan a quien hace el trabajo.",
  formOnly:
    "Escriba a Cardon Digital con un mensaje corto. Llega a quien hace el trabajo.",
};

const es: typeof en = {
  meta: {
    title: "Contacto",
    description: esDescription,
  },
  eyebrow: "Contacto",
  intro: esIntro,
  reply: "Respondemos dentro del siguiente día hábil.",

  doorsAria: "Formas de contactarnos",
  whatsapp: {
    kicker: "Lo más rápido",
    title: "WhatsApp",
    body: "Escriba como le escribiría a cualquiera. Díganos cuál es su negocio y qué no está funcionando, y de ahí seguimos nosotros.",
    cta: "Escribir por WhatsApp",
    prefill:
      "Hola. Vi el sitio de Cardon Digital y quiero platicar sobre mi negocio.",
  },
  booking: {
    kicker: "Agenda",
    title: "Una llamada, a su hora",
    body: "Treinta minutos, sin costo y sin discurso de venta. Preguntamos qué vende, cómo le llega el trabajo y dónde se le atora.",
    cta: "Agendar una llamada",
  },

  form: {
    kicker: "Por escrito",
    title: "Cuéntenos qué necesita",
    sub: "Entre más concreto el mensaje, más útil la respuesta. Quien lo lee es quien le contesta.",
    nameLabel: "Nombre",
    namePlaceholder: "Su nombre",
    wineryLabel: "Bodega o empresa",
    wineryPlaceholder: "Cómo se llama",
    emailLabel: "Correo",
    emailPlaceholder: "usted@sunegocio.com",
    whatsappLabel: "WhatsApp",
    whatsappPlaceholder: "Con lada del país",
    messageLabel: "Mensaje",
    messagePlaceholder:
      "Qué vende, qué no está funcionando y qué le gustaría que fuera distinto.",
    optional: "opcional",
    required: "obligatorio",
    submit: "Enviar mensaje",
    sending: "Enviando",
    honeypot: "Deje este campo vacío",
    privacy:
      "Lo que escriba aquí lo usamos solo para responderle. Llega a nuestro propio correo, no alimenta ninguna lista y no lo compartimos con nadie.",
    errors: {
      name: "Escriba su nombre, por favor.",
      winery: "Ese nombre es más largo de lo que acepta el campo.",
      email: "Esa dirección no se lee como una dirección válida.",
      whatsapp: "Solo números, con lada del país.",
      message: "Cuéntenos un poco más, aunque sean unas líneas.",
      general: {
        withWhatsapp:
          "El mensaje no salió. Escríbanos por WhatsApp y por ahí lo atendemos.",
        alone: "El mensaje no salió. Vuelva a intentarlo en un momento, por favor.",
      },
      rate: {
        withWhatsapp:
          "Son varios mensajes seguidos. Espere unos minutos o escríbanos por WhatsApp.",
        alone: "Son varios mensajes seguidos. Espere unos minutos y vuelva a enviarlo.",
      },
      large: "El mensaje es más largo de lo que acepta el formulario. Recórtelo un poco.",
    },
    sentTitle: "Recibido.",
    sentBody: {
      withWhatsapp:
        "Le respondemos por correo dentro del siguiente día hábil. Si prefiere no esperar, WhatsApp está arriba.",
      alone: "Le respondemos por correo dentro del siguiente día hábil.",
    },
  },
};

export type ContactDict = typeof en;
export const contact: Dict<ContactDict> = { en, es };
