import type { Dict } from "./rich";

/** Privacy policy. The Spanish version is the aviso de privacidad a Mexican
 *  reader expects, not a translation of the English headings. */

const en = {
  meta: {
    title: "Privacy Policy",
    description:
      "How Cardon Digital handles personal information: what we collect, what we never collect, and the rights you have.",
  },
  eyebrow: "Legal",
  title: "Privacy Policy",
  effective: "Effective 2026-09-03. Applies to cardondigital.com.",
  intro:
    "Cardon Digital is a growth-systems practice based in Baja California, Mexico, working with clients in Mexico and the United States. This policy explains what information this website handles, what we deliberately do not collect, and the rights you have. It is written to be read, not skimmed past.",
  notH: "What this site does not do",
  notList: [
    "No data resale of any kind, and no sharing of your details for marketing.",
    "No accounts, and no form on this site feeds a marketing database.",
    "No third-party script loads before you have said yes to it, and if you say no, none loads at all.",
  ],
  measureH: "Measurement, and the question we ask first",
  measureBody:
    "When measurement is switched on, this site can load two Google products: Google Analytics 4, which tells us which pages people read, and Google Ads conversion measurement, which tells us which ads brought them here. Neither one loads until you accept. Before you answer, the pages you receive carry no Google script at all, not even one that would decide for itself not to run. While measurement is switched off entirely, you are asked nothing and nothing is loaded.",
  measureList: [
    "The pages you open on this site, and how you arrived at them.",
    "Your approximate location from your IP address, and your device and browser type.",
    "Three actions we count as conversions: sending or opening a contact message, opening WhatsApp, and opening the booking link.",
    "Google sets its own cookies to do this. We never sell what is collected.",
  ],
  measureWithdraw:
    "Your answer is kept in one first-party cookie named cardon-consent, which holds nothing but the word granted or denied for six months and is what stops us asking again on every page. To change your answer, clear this site's cookies in your browser: cardon-consent goes with them, nothing from Google loads on your next visit, and we ask you again.",
  deviceH: "What is stored on your device",
  deviceBody:
    "Three things, all of them ours and all of them small. Your light-or-dark display preference, kept in your browser's local storage. A cardon-locale cookie holding es or en for a year, written only if you switch language. And, once measurement is switched on and you have answered, the cardon-consent cookie described above. If you accept measurement, Google also sets its own cookies through the tag. You can clear any of them at any time through your browser settings.",
  contactH: "What we receive if you contact us",
  contactBody:
    "The contact links on this site open your own email client. If you write to us we receive your email address and whatever you choose to tell us. We use it to reply and, if we end up working together, to deliver the work. We keep correspondence as ordinary business records, we do not add you to mailing lists you did not ask for, and we never sell or share your details for marketing.",
  hostingH: "Hosting and server logs",
  hostingBody:
    "This site is served by a hosting provider that, like all hosts, processes standard technical logs (IP address, browser type, pages requested) for security and reliability. We do not use these logs to profile visitors.",
  clientH: "Client data",
  clientBody:
    "In client engagements we routinely work inside business systems that contain personal data (for example customer or applicant records). That data is processed under the client's instructions and our written agreement with them: access is limited to the people doing the work, it is used only to deliver the engagement, and it is never extracted for any other purpose. Questions about a specific company's data should go to that company; we support our clients in answering them.",
  rightsH: "Your rights",
  rightsBody:
    "Under Mexico's Federal Law on Protection of Personal Data (LFPDPPP) you have the rights of access, rectification, cancellation, and objection (ARCO). If you are in the European Economic Area or the United Kingdom, the GDPR gives you similar rights of access, correction, deletion, restriction, portability, and objection; where we process correspondence, we do so on the basis of legitimate interest in responding to you, and where we measure, we do so on the basis of the consent you give. California residents: we do not sell or share personal information as those terms are defined in the CCPA. To exercise any right, email us and we will respond within the legal timeframe.",
  contactHeading: "Contact",
  note: "If we change what this site collects, this policy is updated first and the change is visible here, with a new effective date.",
};

const es: typeof en = {
  meta: {
    title: "Aviso de Privacidad",
    description:
      "Cómo trata Cardon Digital los datos personales: qué recabamos, qué nunca recabamos y los derechos que usted tiene.",
  },
  eyebrow: "Legal",
  title: "Aviso de Privacidad",
  effective:
    "Vigente desde el 3 de septiembre de 2026. Aplica a cardondigital.com.",
  intro:
    "Cardon Digital es una práctica de sistemas de crecimiento con base en Baja California, México, que trabaja con clientes en México y en Estados Unidos. Este aviso explica qué información maneja este sitio, qué decidimos no recabar y los derechos que usted tiene. Está escrito para leerse, no para pasarse de largo.",
  notH: "Lo que este sitio no hace",
  notList: [
    "Sin reventa de datos de ningún tipo, y sin compartir sus datos con fines de mercadotecnia.",
    "Sin cuentas, y ningún formulario de este sitio alimenta una base de datos de mercadotecnia.",
    "Ningún script de terceros se carga antes de que usted lo acepte, y si usted dice que no, no se carga ninguno.",
  ],
  measureH: "La medición y la pregunta que le hacemos antes",
  measureBody:
    "Cuando la medición está activa, este sitio puede cargar dos productos de Google: Google Analytics 4, que nos dice qué páginas se leen, y la medición de conversiones de Google Ads, que nos dice qué anuncios trajeron a quien las leyó. Ninguno se carga hasta que usted acepte. Antes de que usted responda, las páginas que recibe no traen ningún script de Google, ni siquiera uno que decidiera por su cuenta no ejecutarse. Mientras la medición está apagada por completo, no se le pregunta nada y no se carga nada.",
  measureList: [
    "Las páginas que abre en este sitio y cómo llegó a ellas.",
    "Su ubicación aproximada a partir de su dirección IP, y el tipo de dispositivo y de navegador.",
    "Tres acciones que contamos como conversiones: enviar o abrir un mensaje de contacto, abrir WhatsApp y abrir el enlace de agenda.",
    "Google pone sus propias cookies para lograrlo. Nunca vendemos lo que se recaba.",
  ],
  measureWithdraw:
    "Su respuesta se guarda en una sola cookie propia llamada cardon-consent, que no contiene más que la palabra granted o denied durante seis meses y es lo que evita que le preguntemos en cada página. Para cambiar su respuesta, borre las cookies de este sitio desde su navegador: cardon-consent se va con ellas, en su siguiente visita no se carga nada de Google y le volvemos a preguntar.",
  deviceH: "Lo que se guarda en su dispositivo",
  deviceBody:
    "Tres cosas, todas nuestras y todas pequeñas. Su preferencia de modo claro u oscuro, guardada en el almacenamiento local de su navegador. Una cookie cardon-locale con es o en durante un año, que se escribe solo si usted cambia de idioma. Y, una vez que la medición está activa y usted ya respondió, la cookie cardon-consent descrita arriba. Si acepta la medición, Google también pone sus propias cookies a través de la etiqueta. Puede borrar cualquiera de ellas cuando quiera desde la configuración de su navegador.",
  contactH: "Lo que recibimos si usted nos escribe",
  contactBody:
    "Los enlaces de contacto de este sitio abren su propio programa de correo. Si nos escribe, recibimos su dirección de correo y lo que usted decida contarnos. Lo usamos para responderle y, si terminamos trabajando juntos, para entregar el trabajo. Guardamos la correspondencia como registros ordinarios del negocio, no lo damos de alta en listas de correo que no pidió, y nunca vendemos ni compartimos sus datos con fines de mercadotecnia.",
  hostingH: "Alojamiento y registros del servidor",
  hostingBody:
    "Este sitio lo sirve un proveedor de alojamiento que, como todos, procesa registros técnicos estándar (dirección IP, tipo de navegador, páginas solicitadas) por seguridad y estabilidad. No usamos esos registros para perfilar visitantes.",
  clientH: "Datos de clientes",
  clientBody:
    "En los trabajos con clientes entramos de forma habitual a sistemas del negocio que contienen datos personales (por ejemplo registros de clientes o de candidatos). Esos datos se tratan bajo las instrucciones del cliente y nuestro acuerdo escrito con él: el acceso se limita a quien hace el trabajo, se usa solo para entregar el proyecto y nunca se extrae para otro fin. Las preguntas sobre los datos de una empresa en particular van dirigidas a esa empresa; nosotros la apoyamos para responderlas.",
  rightsH: "Sus derechos",
  rightsBody:
    "Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), usted tiene los derechos de acceso, rectificación, cancelación y oposición (derechos ARCO). Si usted se encuentra en el Espacio Económico Europeo o en el Reino Unido, el RGPD le da derechos parecidos de acceso, corrección, supresión, limitación, portabilidad y oposición; cuando tratamos correspondencia, lo hacemos con base en el interés legítimo de responderle, y cuando medimos, lo hacemos con base en el consentimiento que usted otorga. Residentes de California: no vendemos ni compartimos datos personales en el sentido que la CCPA da a esos términos. Para ejercer cualquier derecho, escríbanos y responderemos dentro del plazo legal.",
  contactHeading: "Contacto",
  note: "Si cambiamos lo que este sitio recaba, primero se actualiza este aviso y el cambio se ve aquí, con una nueva fecha de vigencia.",
};

export type PrivacyDict = typeof en;
export const privacy: Dict<PrivacyDict> = { en, es };
