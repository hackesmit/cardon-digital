import { withVariant, type Variant } from "./variant";
import { terms, type TermsDict } from "./terms";
import type { Dict } from "./rich";

/**
 * The wine brand's terms (bead hq-3f6ut.4). Cardon's terms with the clauses
 * that describe Cardon's other services (the Growth Diagnostic, the ads fee)
 * replaced by the wine software's own. No price is typed here: amounts live
 * in lib/pricing.ts and in the signed agreement. "{brand}" is filled by
 * branded() from lib/brand.ts. The operator is Cardon Digital.
 */

const enVino: Variant<TermsDict> = {
  meta: {
    title: "Terms of Service",
    description:
      "The terms governing use of this website and the manner in which engagements with {brand} by Cardon are agreed.",
  },
  effective: "In force from 2026-11-11. Applicable to this website, {brand}.",
  intro:
    "These Terms of Service govern access to and use of this website, {brand}, the wine-software brand operated by Cardon Digital. By accessing or using the site, the User accepts these terms in their entirety. A User who does not accept them must refrain from using the site.",
  sections: [
    {
      h: "1. Purpose and nature of the site",
      body: "The site is informational. Its pages describe the software modules of {brand} for wineries, the demos, and work performed previously. No content on the site constitutes a binding offer, a guarantee of results or professional advice applicable to the particular circumstances of the User. The demos run on sample data and do not reproduce client data.",
    },
    {
      h: "2. Demos, prices and engagements",
      body: "The demos are provided at no charge to show how the modules work, and may change or be withdrawn without notice. The prices shown on the site are a guide. Any engagement, including its modules, its scope, its price, its currency, confidentiality and the treatment of data, is agreed in a separate written proposal or contract executed before the work begins. In the event of conflict between these terms and an executed agreement, the executed agreement prevails.",
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
  changesBody:
    "Cardon Digital may amend these terms. The date of entry into force stated above is updated when it does so. Notices and questions concerning these terms are directed to:",
};

const esVino: Variant<TermsDict> = {
  meta: {
    title: "Términos de Servicio",
    description:
      "Los términos que rigen el uso de este sitio y la forma en que se acuerdan los trabajos con {brand} por Cardon.",
  },
  effective: "Vigentes a partir del 11 de noviembre de 2026. Aplicables a este sitio, {brand}.",
  intro:
    "Los presentes Términos de Servicio rigen el acceso y el uso de este sitio, {brand}, la marca de software para vinícolas operada por Cardon Digital. Al acceder al sitio o al usarlo, el Usuario acepta estos términos en su totalidad. El Usuario que no los acepte debe abstenerse de usar el sitio.",
  sections: [
    {
      h: "1. Objeto y naturaleza del sitio",
      body: "El sitio tiene carácter informativo. Sus páginas describen los módulos de software de {brand} para vinícolas, los demos y trabajos realizados con anterioridad. Ningún contenido del sitio constituye una oferta vinculante, una garantía de resultados ni asesoría profesional aplicable a las circunstancias particulares del Usuario. Los demos corren con datos de muestra y no reproducen datos de clientes.",
    },
    {
      h: "2. Demos, precios y trabajos contratados",
      body: "Los demos se ofrecen sin costo para mostrar cómo funcionan los módulos, y pueden cambiar o retirarse sin previo aviso. Los precios que muestra el sitio son una guía. Cualquier trabajo, incluidos sus módulos, su alcance, su precio, su moneda, la confidencialidad y el manejo de datos, se acuerda en una propuesta o un contrato escrito por separado, celebrado antes del inicio de los trabajos. En caso de contradicción entre los presentes términos y un acuerdo firmado, prevalece el acuerdo firmado.",
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
  changesBody:
    "Cardon Digital puede modificar los presentes términos. La fecha de vigencia señalada arriba se actualiza cuando lo hace. Los avisos y las preguntas sobre los presentes términos se dirigen a:",
};

export const termsVino: Dict<TermsDict> = {
  en: withVariant(terms.en, enVino),
  es: withVariant(terms.es, esVino),
};
