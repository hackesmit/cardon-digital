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
  effective: "Effective 2026-07-21. Applies to cardondigital.com.",
  intro:
    "Cardon Digital is a growth-systems practice based in Baja California, Mexico, working with clients in Mexico and the United States. This policy explains what information this website handles, what we deliberately do not collect, and the rights you have. It is written to be read, not skimmed past.",
  notH: "What this site does not do",
  notList: [
    "No advertising pixels, no third-party analytics, no tracking cookies.",
    "No accounts, no forms that feed marketing databases, no data resale of any kind.",
    "No content from third-party servers: pages are self-contained.",
  ],
  deviceH: "What is stored on your device",
  deviceBody:
    "One value in your browser's local storage: your light-or-dark display preference. It never leaves your device, identifies nobody, and you can clear it at any time through your browser settings. Because we set no tracking cookies, this site shows no cookie banner; under the EU ePrivacy rules this kind of purely functional storage is exempt from consent requirements.",
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
    "Under Mexico's Federal Law on Protection of Personal Data (LFPDPPP) you have the rights of access, rectification, cancellation, and objection (ARCO). If you are in the European Economic Area or the United Kingdom, the GDPR gives you similar rights of access, correction, deletion, restriction, portability, and objection; where we process correspondence, we do so on the basis of legitimate interest in responding to you. California residents: we do not sell or share personal information as those terms are defined in the CCPA. To exercise any right, email us and we will respond within the legal timeframe.",
  contactHeading: "Contact",
  note: "If we ever add analytics or any other data collection to this site, this policy will be updated first and the change will be visible here, with a new effective date.",
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
    "Vigente desde el 21 de julio de 2026. Aplica a cardondigital.com.",
  intro:
    "Cardon Digital es una práctica de sistemas de crecimiento con base en Baja California, México, que trabaja con clientes en México y en Estados Unidos. Este aviso explica qué información maneja este sitio, qué decidimos no recabar y los derechos que usted tiene. Está escrito para leerse, no para pasarse de largo.",
  notH: "Lo que este sitio no hace",
  notList: [
    "Sin pixeles de publicidad, sin analítica de terceros, sin cookies de rastreo.",
    "Sin cuentas, sin formularios que alimenten bases de datos de mercadotecnia, sin reventa de datos de ningún tipo.",
    "Sin contenido de servidores de terceros: las páginas se sirven completas desde aquí.",
  ],
  deviceH: "Lo que se guarda en su dispositivo",
  deviceBody:
    "Un solo valor en el almacenamiento local de su navegador: su preferencia de modo claro u oscuro. Nunca sale de su dispositivo, no identifica a nadie, y usted puede borrarlo cuando quiera desde la configuración de su navegador. Como no ponemos cookies de rastreo, este sitio no muestra aviso de cookies; bajo las reglas europeas de privacidad electrónica, este tipo de almacenamiento puramente funcional está exento de pedir consentimiento.",
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
    "Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), usted tiene los derechos de acceso, rectificación, cancelación y oposición (derechos ARCO). Si usted se encuentra en el Espacio Económico Europeo o en el Reino Unido, el RGPD le da derechos parecidos de acceso, corrección, supresión, limitación, portabilidad y oposición; cuando tratamos correspondencia, lo hacemos con base en el interés legítimo de responderle. Residentes de California: no vendemos ni compartimos datos personales en el sentido que la CCPA da a esos términos. Para ejercer cualquier derecho, escríbanos y responderemos dentro del plazo legal.",
  contactHeading: "Contacto",
  note: "Si algún día agregamos analítica o cualquier otra recolección de datos a este sitio, primero se actualiza este aviso y el cambio se ve aquí, con una nueva fecha de vigencia.",
};

export type PrivacyDict = typeof en;
export const privacy: Dict<PrivacyDict> = { en, es };
