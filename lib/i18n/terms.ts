import type { Dict } from "./rich";

/**
 * Terms of service, in formal legal register in both locales (Daniel,
 * 2026-10-16, reviewing the live site: the page used to be written in the
 * site's marketing voice, which reads as an invitation to argue rather than a
 * term). The content is the same as the voice it replaced; what changed is the
 * register and the numbering. The Spanish is the authoritative version and
 * addresses the reader as el Usuario, the form a Mexican contract uses.
 *
 * Clause 2 states on its own that the ads fee is charged per contact, so
 * app/[locale]/ads-claim.test.ts needs no exemption for this page: a clause
 * that defers to the signed agreement still says which fee it is deferring
 * about.
 */

const en = {
  meta: {
    title: "Terms of Service",
    description:
      "The terms governing use of cardondigital.com and the manner in which engagements with Cardon Digital are agreed.",
  },
  eyebrow: "Legal",
  title: "Terms of Service",
  effective: "In force from 2026-10-19. Applicable to cardondigital.com.",
  intro:
    "These Terms of Service govern access to and use of the website cardondigital.com, operated by Cardon Digital. By accessing or using the site, the User accepts these terms in their entirety. A User who does not accept them must refrain from using the site.",
  sections: [
    {
      h: "1. Purpose and nature of the site",
      body: "The site is informational. Its pages describe the services of Cardon Digital, its method of work and work performed previously. No content on the site constitutes a binding offer, a guarantee of results or professional advice applicable to the particular circumstances of the User. Illustrative visuals do not reproduce client data.",
    },
    {
      h: "2. The Growth Diagnostic and engagements",
      body: "The Growth Diagnostic is provided at no charge and on the terms described on the site: a defined period of review concluding in a written memorandum, with no obligation on either party. Any subsequent engagement, including its scope, its price, confidentiality and the treatment of data, is agreed in a separate written proposal or contract executed before the work begins. Where the site states a setup fee and a monthly service fee, with the advertising base comprised in the monthly fee, the per-contact ads fee charged in the following month and subject to a monthly cap, and the advertising budget paid by the User directly to Google, the exact scope and the amounts are determined in that written agreement. In the event of conflict between these terms and an executed agreement, the executed agreement prevails.",
    },
    {
      h: "3. Intellectual property",
      body: "The design, the text, the graphics and the code of the site are the property of Cardon Digital. The names and marks of clients referred to on the site are the property of their respective owners and appear in reference to work actually performed for them. The User may link to the site without restriction. The User must refrain from republishing its content as the User's own.",
    },
    {
      h: "4. Permitted use",
      body: "The User must refrain from interfering with the operation of the site, from probing it for vulnerabilities beyond a report made in good faith, from extracting its content into misleading contexts and from using it to represent an affiliation with Cardon Digital that does not exist. Security reports made in good faith are received by email.",
    },
    {
      h: "5. Absence of warranties and limitation of liability",
      body: "The site is provided in the state in which it is found. Cardon Digital maintains it with reasonable diligence and does not warrant that it is free of error or that its availability is uninterrupted. To the fullest extent permitted by applicable law, Cardon Digital is not liable for indirect or consequential damages arising from use of the site. Nothing in these terms limits liability that applicable law does not permit to be limited.",
    },
    {
      h: "6. Governing law",
      body: "These terms are governed by the laws of the United Mexican States and of the State of Baja California. An engagement with a client may designate a different governing law in its own written contract.",
    },
  ],
  changesH: "7. Amendments and notices",
  changesBody:
    "Cardon Digital may amend these terms. The date of entry into force stated above is updated when it does so. Notices and questions concerning these terms are directed to:",
};

const es: typeof en = {
  meta: {
    title: "Términos de Servicio",
    description:
      "Los términos que rigen el uso de cardondigital.com y la forma en que se acuerdan los trabajos con Cardon Digital.",
  },
  eyebrow: "Legal",
  title: "Términos de Servicio",
  effective: "Vigentes a partir del 19 de octubre de 2026. Aplicables a cardondigital.com.",
  intro:
    "Los presentes Términos de Servicio rigen el acceso y el uso del sitio cardondigital.com, operado por Cardon Digital. Al acceder al sitio o al usarlo, el Usuario acepta estos términos en su totalidad. El Usuario que no los acepte debe abstenerse de usar el sitio.",
  sections: [
    {
      h: "1. Objeto y naturaleza del sitio",
      body: "El sitio tiene carácter informativo. Sus páginas describen los servicios de Cardon Digital, su forma de trabajo y trabajos realizados con anterioridad. Ningún contenido del sitio constituye una oferta vinculante, una garantía de resultados ni asesoría profesional aplicable a las circunstancias particulares del Usuario. Las imágenes ilustrativas no reproducen datos de clientes.",
    },
    {
      h: "2. El Diagnóstico de Crecimiento y los trabajos contratados",
      body: "El Diagnóstico de Crecimiento se presta sin costo y en los términos descritos en el sitio: un periodo determinado de revisión que concluye en un informe escrito, sin obligación para ninguna de las partes. Cualquier trabajo posterior, incluidos su alcance, su precio, la confidencialidad y el manejo de datos, se acuerda en una propuesta o un contrato escrito por separado, celebrado antes del inicio de los trabajos. Donde el sitio señala una cuota de implementación y una cuota mensual de servicio, con la base de los anuncios comprendida en la cuota mensual, el pago por contacto de los anuncios cobrado en el mes siguiente y sujeto a un tope mensual, y la inversión en anuncios pagada por el Usuario directamente a Google, el alcance exacto y los montos quedan determinados en ese acuerdo escrito. En caso de contradicción entre los presentes términos y un acuerdo firmado, prevalece el acuerdo firmado.",
    },
    {
      h: "3. Propiedad intelectual",
      body: "El diseño, los textos, los gráficos y el código del sitio son propiedad de Cardon Digital. Los nombres y las marcas de clientes mencionados en el sitio son propiedad de sus respectivos titulares y aparecen en referencia a trabajo efectivamente realizado para ellos. El Usuario puede enlazar al sitio sin restricción. El Usuario debe abstenerse de republicar su contenido como propio.",
    },
    {
      h: "4. Uso permitido",
      body: "El Usuario debe abstenerse de interferir con el funcionamiento del sitio, de sondearlo en busca de vulnerabilidades más allá de un reporte hecho de buena fe, de extraer su contenido para colocarlo en contextos engañosos y de usarlo para aparentar una relación con Cardon Digital que no existe. Los reportes de seguridad hechos de buena fe se reciben por correo electrónico.",
    },
    {
      h: "5. Ausencia de garantías y límite de responsabilidad",
      body: "El sitio se presta en el estado en que se encuentra. Cardon Digital lo mantiene con diligencia razonable y no garantiza que esté libre de errores ni que su disponibilidad sea ininterrumpida. Hasta donde la ley aplicable lo permita, Cardon Digital no responde por daños indirectos ni consecuenciales derivados del uso del sitio. Nada en los presentes términos limita la responsabilidad que la ley aplicable no permite limitar.",
    },
    {
      h: "6. Ley aplicable",
      body: "Los presentes términos se rigen por las leyes de los Estados Unidos Mexicanos y del Estado de Baja California. Un trabajo contratado con un cliente puede señalar otra ley aplicable en su propio contrato escrito.",
    },
  ],
  changesH: "7. Modificaciones y avisos",
  changesBody:
    "Cardon Digital puede modificar los presentes términos. La fecha de vigencia señalada arriba se actualiza cuando lo hace. Los avisos y las preguntas sobre los presentes términos se dirigen a:",
};

export type TermsDict = typeof en;
export const terms: Dict<TermsDict> = { en, es };
