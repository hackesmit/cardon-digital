import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Mark from "@/components/Mark";

export const metadata: Metadata = {
  title: "Nosotros - Cardon Digital",
  description:
    "Cardon Digital es Daniel: un operador senior en Baja California construyendo sistemas de crecimiento para negocios de México y Estados Unidos.",
  alternates: {
    canonical: "/es/about",
    languages: { "en-US": "/about", "es-MX": "/es/about" },
  },
};

export default function AboutEs() {
  return (
    <>
      <Nav lang="es" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">Nosotros</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Un operador, los dos lados de la frontera.
          </h1>

          <div className="mt-16 grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-lg leading-relaxed text-ink/80">
                  Soy Daniel. Construyo y opero sistemas de crecimiento desde
                  Baja California: Google Ads con medición forense, sitios y
                  e-commerce que cumplen lo que el anuncio promete, y
                  automatización que no deja caer ningún prospecto.
                </p>
                <p className="mt-6 leading-relaxed text-ink/75">
                  El historial reciente: diez cuentas de Google Ads auditadas y
                  optimizadas junto a una agencia estadounidense, la plataforma
                  de analítica con modelo de predicción de cosecha para Monte
                  Xanic, el e-commerce completo de Encanto.MX, sitios para
                  BrighterHire y Activated Ministries, y el sistema de
                  logística de una constructora.
                </p>
                <p className="mt-6 leading-relaxed text-ink/75">
                  Los dos idiomas aquí son nativos. El lado en inglés de este
                  sitio se escribió en inglés; este lado se escribió en
                  español. Así se construyen también tus campañas: keyword
                  research y copy nativos por mercado, nunca traducción.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={100}>
                <div className="border border-ink/15 p-7">
                  <Mark className="h-8 w-auto text-cardon" />
                  <h2 className="mt-6 font-display text-xl font-bold">
                    Por qué Cardon
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    El cardón (Pachycereus pringlei) es el cactus más grande
                    del mundo. Crece despacio en Baja California, vive siglos y
                    almacena su propia agua: hecho para condiciones que matan
                    todo lo llamativo.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    También es el estándar del trabajo: números que retienen el
                    agua.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal>
            <div className="mt-20">
              <Link
                href="/es/contact"
                className="inline-block bg-clay px-6 py-3 text-sm font-medium text-sand transition-opacity hover:opacity-90"
              >
                Empezar con el diagnóstico
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer lang="es" />
    </>
  );
}
