import type { Dict } from "./rich";

/** Terms of service. */

const en = {
  meta: {
    title: "Terms of Service",
    description:
      "The terms that govern use of cardondigital.com and how engagements with Cardon Digital are agreed.",
  },
  eyebrow: "Legal",
  title: "Terms of Service",
  effective: "Effective 2026-07-21. Applies to cardondigital.com.",
  intro:
    "These terms govern your use of this website. By using the site you accept them. They are short because the site is simple: it describes what we do and how to reach us.",
  sections: [
    {
      h: "What this site is",
      body: "Informational. The pages describe our services, our approach, and work we have done. Nothing here is a binding offer, a guarantee of results, or professional advice for your specific situation. Illustrative visuals are labeled as such and do not depict client data.",
    },
    {
      h: "The Growth Diagnostic and engagements",
      body: "The free Growth Diagnostic is offered as described on the site: a fixed window of review work resulting in a written memo, with no obligation on either side. Any engagement beyond it, including scope, pricing, confidentiality, and data handling, is agreed in a separate written proposal or contract before work begins. Where the site describes pricing in proportion to performance, the exact basis and percentages are set in that written agreement. If these terms and a signed agreement conflict, the signed agreement wins.",
    },
    {
      h: "Intellectual property",
      body: "The design, text, graphics, and code of this site belong to Cardon Digital. Client names and marks mentioned on the site belong to their owners and appear in reference to real work performed for them. You may link to the site freely; do not republish its content as your own.",
    },
    {
      h: "Acceptable use",
      body: "Do not attempt to disrupt the site, probe it for vulnerabilities beyond good-faith reporting, scrape it into misleading contexts, or use it to misrepresent an affiliation with us. Good-faith security reports are welcome by email.",
    },
    {
      h: "No warranty and limitation of liability",
      body: "The site is provided as is. We work to keep it accurate and available but do not warrant that it is error-free or uninterrupted. To the fullest extent permitted by law, Cardon Digital is not liable for indirect or consequential damages arising from use of the site. Nothing in these terms limits liability that cannot be limited by law.",
    },
    {
      h: "Governing law",
      body: "These website terms are governed by the laws of Mexico, State of Baja California. Client engagements may agree different governing law in their written contract.",
    },
  ],
  changesH: "Changes and contact",
  changesBody: "We may update these terms; the effective date above changes when we do. Questions:",
};

const es: typeof en = {
  meta: {
    title: "Términos de Servicio",
    description:
      "Los términos que rigen el uso de cardondigital.com y la forma en que se acuerdan los trabajos con Cardon Digital.",
  },
  eyebrow: "Legal",
  title: "Términos de Servicio",
  effective:
    "Vigente desde el 21 de julio de 2026. Aplica a cardondigital.com.",
  intro:
    "Estos términos rigen su uso de este sitio. Al usarlo, usted los acepta. Son cortos porque el sitio es simple: describe lo que hacemos y cómo contactarnos.",
  sections: [
    {
      h: "Qué es este sitio",
      body: "Informativo. Las páginas describen nuestros servicios, nuestra forma de trabajar y trabajo que ya hicimos. Nada de lo que está aquí es una oferta vinculante, una garantía de resultados ni asesoría profesional para su situación particular. Las imágenes ilustrativas están señaladas como tales y no muestran datos de clientes.",
    },
    {
      h: "El Diagnóstico de Crecimiento y los trabajos",
      body: "El Diagnóstico de Crecimiento se ofrece sin costo y como se describe en el sitio: una ventana fija de revisión que termina en un informe escrito, sin obligación para ninguna de las partes. Cualquier trabajo posterior, incluidos alcance, precio, confidencialidad y manejo de datos, se acuerda en una propuesta o contrato escrito por separado antes de empezar. Donde el sitio describe precios proporcionales al resultado, la base exacta y los porcentajes se fijan en ese acuerdo escrito. Si estos términos y un acuerdo firmado se contradicen, gana el acuerdo firmado.",
    },
    {
      h: "Propiedad intelectual",
      body: "El diseño, los textos, los gráficos y el código de este sitio pertenecen a Cardon Digital. Los nombres y las marcas de clientes que se mencionan en el sitio pertenecen a sus dueños y aparecen en referencia a trabajo real hecho para ellos. Puede enlazar al sitio con libertad; no republique su contenido como propio.",
    },
    {
      h: "Uso aceptable",
      body: "No intente interrumpir el sitio, sondearlo en busca de vulnerabilidades más allá de un reporte de buena fe, extraerlo para ponerlo en contextos engañosos ni usarlo para aparentar una relación con nosotros. Los reportes de seguridad de buena fe son bienvenidos por correo.",
    },
    {
      h: "Sin garantías y límite de responsabilidad",
      body: "El sitio se ofrece tal como está. Trabajamos para mantenerlo correcto y disponible, pero no garantizamos que esté libre de errores ni que funcione sin interrupciones. Hasta donde la ley lo permita, Cardon Digital no responde por daños indirectos o consecuenciales derivados del uso del sitio. Nada en estos términos limita la responsabilidad que la ley no permite limitar.",
    },
    {
      h: "Ley aplicable",
      body: "Estos términos del sitio se rigen por las leyes de México, Estado de Baja California. Los trabajos con clientes pueden acordar otra ley aplicable en su contrato escrito.",
    },
  ],
  changesH: "Cambios y contacto",
  changesBody:
    "Podemos actualizar estos términos; la fecha de vigencia de arriba cambia cuando lo hacemos. Dudas:",
};

export type TermsDict = typeof en;
export const terms: Dict<TermsDict> = { en, es };
