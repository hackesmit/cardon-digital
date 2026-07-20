import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Servicios - Cardon Digital",
  description:
    "Diagnóstico de Crecimiento, retención mensual del sistema y construcciones de alcance fijo: sitios, e-commerce, automatización, dashboards.",
  alternates: {
    canonical: "/es/services",
    languages: { "en-US": "/services", "es-MX": "/es/services" },
  },
};

const builds = [
  {
    name: "Sitio de conversión",
    detail: "Sitio de marketing, 3-5 páginas, bilingüe si tu mercado lo pide, 3-4 semanas.",
  },
  {
    name: "E-commerce",
    detail: "Shopify o Next.js con Stripe. La especialidad es el trabajo pesado de integraciones.",
  },
  {
    name: "Sprint de automatización",
    detail: "3-5 flujos n8n en producción en 2-3 semanas, con línea base medida de horas antes y después.",
  },
  {
    name: "Dashboard / herramienta interna",
    detail: "Analítica, predicción, operación. El patrón Monte Xanic aplicado a tus datos.",
  },
];

export default function ServicesEs() {
  return (
    <>
      <Nav lang="es" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">Servicios</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Un solo sistema, con incentivos que apuntan hacia ti.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            Tarifas fijas, alcances fijos, mes a mes. Nunca porcentaje de tu
            inversión publicitaria, nunca por hora. Cotización personalizada
            para México.
          </p>

          <Reveal>
            <section className="mt-20 bg-dune p-8 sm:p-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                Empieza aquí
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">
                Diagnóstico de Crecimiento
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-ink/75">
                Diez días hábiles sobre tus anuncios, tu medición, tu sitio y
                tus flujos. Recibes un memo escrito: qué cuentan realmente tus
                números, dónde se fuga la inversión, qué automatizar primero y
                un plan de prioridades a 30 días. El memo es tuyo, con o sin
                retención.
              </p>
              <Link
                href="/es/contact"
                className="mt-8 inline-block bg-clay px-6 py-3 text-sm font-medium text-sand transition-opacity hover:opacity-90"
              >
                Agendar el diagnóstico
              </Link>
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-8 border border-ink/15 p-8 sm:p-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                El motor
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">
                Retención del Sistema de Crecimiento
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-ink/75">
                Operación continua del sistema: administración de Google Ads,
                medición de conversiones, una mejora de automatización cada
                mes, mantenimiento del sitio y un reporte mensual en lenguaje
                claro con números reales.
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-wide text-clay">
                Cinco lugares. Un solo operador senior.
              </p>
              <Link
                href="/es/contact"
                className="mt-8 inline-block border border-ink/25 px-6 py-3 text-sm font-medium transition-colors hover:border-ink"
              >
                Preguntar por un lugar
              </Link>
            </section>
          </Reveal>

          <section className="mt-24">
            <Reveal>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Construcciones de alcance fijo
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2">
              {builds.map((b, i) => (
                <Reveal key={b.name} delay={i * 80} className="bg-sand">
                  <div className="flex h-full flex-col p-7">
                    <h3 className="font-display text-xl font-bold">{b.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">
                      {b.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer lang="es" />
    </>
  );
}
