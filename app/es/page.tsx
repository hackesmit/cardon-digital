import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import RibField from "@/components/RibField";

export const metadata: Metadata = {
  title: "Cardon Digital - Sistemas de crecimiento que retienen el agua",
  description:
    "Tus anuncios, tu sitio, tus automatizaciones. Un solo operador senior, sin capas de agencia. Google Ads, desarrollo web y automatización para negocios de México y Estados Unidos.",
  alternates: {
    canonical: "/es",
    languages: { "en-US": "/", "es-MX": "/es" },
  },
};

const casos = [
  {
    slug: "monte-xanic",
    client: "Monte Xanic",
    sector: "Vinícola, Valle de Guadalupe",
    result:
      "Dashboard de analítica con modelo de predicción de cosecha, más las automatizaciones que lo rodean.",
    tag: "Datos + Automatización",
  },
  {
    slug: "paid-search",
    client: "Paid search EUA",
    sector: "10 cuentas, anonimizado",
    result:
      "Reportado: 150.54 conversiones. Real: 93. Encontrar la diferencia es el trabajo.",
    tag: "Google Ads",
  },
  {
    slug: "encanto",
    client: "Encanto.MX",
    sector: "E-commerce",
    result: "Construcción completa de su tienda en línea.",
    tag: "Web",
  },
];

const sistema = [
  {
    n: "01",
    name: "Demanda",
    what: "Google Ads sobre medición forense.",
    detail:
      "Auditorías donde cada hallazgo trae evidencia y cifra en dólares. Campañas administradas por tarifa fija, nunca porcentaje de tu inversión.",
  },
  {
    n: "02",
    name: "Conversión",
    what: "Un sitio que cumple lo que el anuncio prometió.",
    detail:
      "Sitios, e-commerce, landing pages, dashboards. Construidos rápido, construidos para convertir, y son tuyos.",
  },
  {
    n: "03",
    name: "Operación",
    what: "Automatización que no deja caer ningún prospecto.",
    detail:
      "Seguimiento, reportes y flujos de trabajo que corren mientras duermes. La plomería donde la IA sí paga.",
  },
];

export default function HomeEs() {
  return (
    <>
      <Nav lang="es" />
      <main id="main">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="mx-auto max-w-site px-5 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
              Baja California / ES + EN / Un solo operador
            </p>
            <h1 className="mt-6 font-display text-[11vw] font-extrabold leading-[0.98] tracking-tight sm:text-[7.5vw] lg:text-[6.2vw]">
              <span className="hero-line">
                <span style={{ animationDelay: "0.05s" }}>Tus anuncios, tu sitio,</span>
              </span>
              <span className="hero-line">
                <span style={{ animationDelay: "0.15s" }}>tus automatizaciones.</span>
              </span>
              <span className="hero-line text-cardon">
                <span style={{ animationDelay: "0.25s" }}>Un operador senior.</span>
              </span>
              <span className="hero-line text-clay">
                <span style={{ animationDelay: "0.35s" }}>Sin capas de agencia.</span>
              </span>
            </h1>
            <div className="mt-10 flex max-w-2xl flex-col gap-8 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-lg leading-relaxed text-ink/75">
                Cardon Digital construye y opera el sistema completo: campañas
                que traen demanda, un sitio que la convierte y automatización
                que no deja caer ningún prospecto.
              </p>
              <div className="flex shrink-0 flex-col gap-3">
                <Link
                  href="/es/contact"
                  className="bg-clay px-6 py-3 text-center text-sm font-medium text-sand transition-opacity hover:opacity-90"
                >
                  Solicitar el Diagnóstico
                </Link>
                <Link
                  href="/es/work"
                  className="border border-ink/25 px-6 py-3 text-center text-sm font-medium transition-colors hover:border-ink"
                >
                  Ver el trabajo
                </Link>
              </div>
            </div>
          </div>
          <div className="h-40 w-full sm:h-56">
            <RibField />
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto grid max-w-site gap-6 px-5 py-8 font-mono text-xs uppercase tracking-wide text-haze sm:grid-cols-3 sm:px-8">
            <Reveal>
              <p>10 cuentas de Google Ads auditadas en EUA</p>
            </Reveal>
            <Reveal delay={80}>
              <p>6 clientes con nombre en 2 países</p>
            </Reveal>
            <Reveal delay={160}>
              <p>Los dos idiomas se escriben nativo, no se traducen</p>
            </Reveal>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <Reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                    El problema
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-9">
                <Reveal>
                  <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    La mayoría del marketing PyME corre sobre números que
                    mienten.
                  </h2>
                </Reveal>
                <Reveal delay={150}>
                  <p className="mt-10 max-w-xl text-lg leading-relaxed">
                    Todo lo que Cardon construye empieza igual:{" "}
                    <span className="font-semibold text-cardon">
                      hacer que los números digan la verdad, y de ahí crecer.
                    </span>
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
            <Reveal>
              <h2 className="max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Tres partes. Una sola tubería. Una sola persona responsable.
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-px overflow-hidden bg-ink/10 sm:grid-cols-3">
              {sistema.map((s, i) => (
                <Reveal key={s.n} delay={i * 120} className="bg-sand">
                  <div className="flex h-full flex-col p-7">
                    <p className="font-mono text-sm text-haze">{s.n}</p>
                    <h3 className="mt-6 font-display text-2xl font-bold text-cardon">
                      {s.name}
                    </h3>
                    <p className="mt-2 font-medium leading-snug">{s.what}</p>
                    <p className="mt-4 text-sm leading-relaxed text-ink/65">
                      {s.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-night text-sand">
          <div className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-sand/50">
                    Pruebas
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    Clientes reales, números reales.
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <Link
                  href="/es/work"
                  className="font-mono text-xs uppercase tracking-wide text-sand/70 underline-offset-4 hover:underline"
                >
                  Todo el trabajo
                </Link>
              </Reveal>
            </div>
            <div className="mt-14 grid gap-px bg-sand/10 sm:grid-cols-3">
              {casos.map((c, i) => (
                <Reveal key={c.slug} delay={i * 80} className="bg-night">
                  <Link
                    href={`/es/work/${c.slug}`}
                    className="group flex h-full flex-col p-7 transition-colors hover:bg-sand/5"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl font-bold">
                        {c.client}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-wide text-ochre">
                        {c.tag}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-sand/50">
                      {c.sector}
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-sand/75">
                      {c.result}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
            <Reveal>
              <div className="bg-dune p-8 sm:p-14">
                <div className="grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                      La puerta de entrada
                    </p>
                    <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                      El Diagnóstico de Crecimiento
                    </h2>
                    <p className="mt-6 max-w-lg leading-relaxed text-ink/75">
                      Diez días hábiles. Un memo escrito, no una presentación de
                      ventas: qué cuentan realmente tus conversiones, dónde se
                      fuga la inversión, qué pierde tu camino de conversión y
                      qué automatizaciones se pagan solas. Con plan de
                      prioridades a 30 días.
                    </p>
                  </div>
                  <div className="flex flex-col justify-between lg:col-span-5">
                    <div>
                      <p className="font-display text-5xl font-extrabold tracking-tight text-cardon">
                        Cotización personalizada
                      </p>
                      <p className="mt-6 text-sm leading-relaxed text-ink/70">
                        El memo es tuyo de cualquier forma. Si seguimos
                        trabajando juntos en los siguientes 30 días, se acredita
                        contra tu primer mes.
                      </p>
                    </div>
                    <Link
                      href="/es/contact"
                      className="mt-10 bg-clay px-6 py-4 text-center text-sm font-medium text-sand transition-opacity hover:opacity-90"
                    >
                      Agendar el diagnóstico
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer lang="es" />
    </>
  );
}
