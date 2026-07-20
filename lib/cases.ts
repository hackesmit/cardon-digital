export type CaseStudy = {
  slug: string;
  tag: string;
  client: { en: string; es: string };
  sector: { en: string; es: string };
  summary: { en: string; es: string };
  body: { en: string[]; es: string[] };
  status?: { en: string; es: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "monte-xanic",
    tag: "Data + Automation",
    client: { en: "Monte Xanic", es: "Monte Xanic" },
    sector: {
      en: "Winery, Valle de Guadalupe, Baja California",
      es: "Vinícola, Valle de Guadalupe, Baja California",
    },
    summary: {
      en: "A century-old craft, run on numbers that hold water: analytics dashboard, harvest prediction model, and the automations around them.",
      es: "Un oficio centenario, operado sobre números que retienen el agua: dashboard de analítica, modelo de predicción de cosecha y las automatizaciones alrededor.",
    },
    body: {
      en: [
        "Monte Xanic is one of Mexico's defining wineries. The work here spans most of their digital operation: a winery analytics dashboard, a prediction model that supports harvest decisions, workflow automation built on n8n, and additional websites.",
        "Winemaking punishes bad data harder than most businesses: you get one harvest a year. The dashboard puts operational data in one place; the prediction model turns it into decisions with a date on them.",
        "The automations do the unglamorous work: moving data between systems, keeping reports current, removing the manual steps where things used to fall through.",
        "Detailed results and screenshots are being prepared with the client for publication.",
      ],
      es: [
        "Monte Xanic es una de las vinícolas que definen al vino mexicano. El trabajo abarca la mayor parte de su operación digital: dashboard de analítica, un modelo de predicción que apoya decisiones de cosecha, automatización de flujos con n8n y sitios adicionales.",
        "La vinicultura castiga los datos malos más que casi cualquier negocio: hay una sola cosecha al año. El dashboard concentra la operación en un solo lugar; el modelo la convierte en decisiones con fecha.",
        "Las automatizaciones hacen el trabajo sin gloria: mover datos entre sistemas, mantener reportes al día, eliminar los pasos manuales donde antes se caían las cosas.",
        "Resultados detallados y capturas se están preparando con el cliente para publicación.",
      ],
    },
  },
  {
    slug: "paid-search",
    tag: "Google Ads",
    client: { en: "US paid search portfolio", es: "Portafolio paid search EUA" },
    sector: {
      en: "10 accounts: home services, industrial B2B, legal, health, SaaS (anonymized)",
      es: "10 cuentas: servicios del hogar, B2B industrial, legal, salud, SaaS (anonimizado)",
    },
    summary: {
      en: "Reported: 150.54 conversions. Real: 93. Finding the difference is the job.",
      es: "Reportado: 150.54 conversiones. Real: 93. Encontrar la diferencia es el trabajo.",
    },
    body: {
      en: [
        "Working with a US marketing agency, I audited and optimized ten Google Ads accounts across home services, industrial B2B, legal, health, and SaaS. The clients stay unnamed; the findings are real.",
        "On one industrial account, reported conversions came to 150.54. Tracing what each conversion action actually counted showed one lead recorded three times across funnel stages: forms, calls, and CRM opportunities. Real leads were about 93, which moved the real cost per lead from the reported $186 to about $300. Every bidding decision downstream had been optimizing against the inflated number.",
        "The same account reported a 4.6x return. It was a CRM pipeline ratio: the bidding algorithm was optimizing toward a sales-stage value that covered 98.6 percent of all optimized value, and closed revenue was excluded from the goals entirely.",
        "Across the portfolio: wrong-intent negative keyword sets shipped under an exact-match doctrine that survived four rounds of adversarial review, roughly $1,900 in identified wrong-intent waste, and a 60+ check audit rubric where every finding carries evidence, a dollar impact, and a verification step.",
        "The house rule that matters most: well-built is a legitimate audit outcome. When an account is good, the audit says so. Honesty is the deliverable.",
      ],
      es: [
        "Trabajando con una agencia de marketing en Estados Unidos, audité y opericé diez cuentas de Google Ads: servicios del hogar, B2B industrial, legal, salud y SaaS. Los clientes quedan sin nombre; los hallazgos son reales.",
        "En una cuenta industrial, las conversiones reportadas sumaban 150.54. Al rastrear qué contaba realmente cada acción de conversión, un solo prospecto aparecía tres veces entre etapas del embudo: formularios, llamadas y oportunidades del CRM. Los prospectos reales eran unos 93, lo que movió el costo real por prospecto de los $186 reportados a unos $300.",
        "La misma cuenta reportaba un retorno de 4.6x. Era una razón de pipeline del CRM: el algoritmo optimizaba hacia un valor de etapa de ventas que cubría el 98.6 por ciento del valor optimizado, y el ingreso cerrado estaba excluido de las metas.",
        "En el portafolio completo: sets de palabras negativas de intención equivocada bajo una doctrina de concordancia exacta que sobrevivió cuatro rondas de revisión adversarial, unos $1,900 dólares de desperdicio identificado, y una rúbrica de auditoría de más de 60 verificaciones donde cada hallazgo trae evidencia, impacto en dólares y un paso de verificación.",
        "La regla de casa más importante: una cuenta bien construida es un resultado legítimo de auditoría. Cuando la cuenta está bien, la auditoría lo dice. La honestidad es el entregable.",
      ],
    },
  },
  {
    slug: "encanto",
    tag: "E-commerce",
    client: { en: "Encanto.MX", es: "Encanto.MX" },
    sector: { en: "E-commerce, Mexico", es: "E-commerce, México" },
    summary: {
      en: "Site work and a full online shop build.",
      es: "Trabajo en sitio y construcción completa de la tienda en línea.",
    },
    body: {
      en: [
        "Ongoing development work on Encanto.MX, including the build of their complete online shop.",
        "Case study publishes when the shop goes live.",
      ],
      es: [
        "Trabajo continuo de desarrollo en Encanto.MX, incluida la construcción completa de su tienda en línea.",
        "El caso se publica cuando la tienda salga a producción.",
      ],
    },
    status: { en: "Launching soon", es: "Próximo a lanzar" },
  },
  {
    slug: "brighterhire",
    tag: "Web",
    client: { en: "BrighterHire", es: "BrighterHire" },
    sector: { en: "HR and hiring", es: "Recursos humanos" },
    summary: {
      en: "Design portfolio website for a hiring company.",
      es: "Sitio portafolio de diseño para una empresa de contratación.",
    },
    body: {
      en: ["Design portfolio website. Full case study in preparation."],
      es: ["Sitio portafolio de diseño. Caso completo en preparación."],
    },
  },
  {
    slug: "activated-ministries",
    tag: "Web",
    client: { en: "Activated Ministries", es: "Activated Ministries" },
    sector: { en: "Nonprofit", es: "Organización sin fines de lucro" },
    summary: {
      en: "Website work for a working charity.",
      es: "Trabajo web para una organización benéfica activa.",
    },
    body: {
      en: ["Website work for a working charity. Full case study in preparation."],
      es: ["Trabajo web para una organización benéfica. Caso completo en preparación."],
    },
  },
  {
    slug: "construction-logistics",
    tag: "Systems",
    client: { en: "Construction logistics", es: "Logística de construcción" },
    sector: { en: "Internal tooling", es: "Herramientas internas" },
    summary: {
      en: "The logistics system a construction company runs on.",
      es: "El sistema de logística sobre el que opera una constructora.",
    },
    body: {
      en: [
        "Internal logistics tooling for a construction company: the integration-heavy category where off-the-shelf tools stop fitting. Full case study in preparation.",
      ],
      es: [
        "Herramientas internas de logística para una constructora: la categoría pesada en integraciones donde las herramientas genéricas dejan de alcanzar. Caso completo en preparación.",
      ],
    },
  },
];

export function getCase(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
