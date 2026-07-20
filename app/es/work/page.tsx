import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { caseStudies } from "@/lib/cases";

export const metadata: Metadata = {
  title: "Trabajo - Cardon Digital",
  description:
    "Clientes con nombre y números reales: Monte Xanic, Encanto.MX, BrighterHire y un portafolio de 10 cuentas de Google Ads en EUA.",
  alternates: { canonical: "/es/work", languages: { "en-US": "/work", "es-MX": "/es/work" } },
};

export default function WorkIndexEs() {
  return (
    <>
      <Nav lang="es" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">Trabajo</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Clientes reales, números reales.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            Cada caso está nombrado con permiso o anonimizado por necesidad,
            nunca inventado. Donde los números siguen en recolección, el caso
            lo dice.
          </p>

          <div className="mt-16 flex flex-col">
            {caseStudies.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <Link
                  href={`/es/work/${c.slug}`}
                  className="rule group flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:gap-10"
                >
                  <span className="shrink-0 font-mono text-xs text-haze sm:w-10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h2 className="font-display text-3xl font-bold tracking-tight group-hover:text-cardon sm:text-4xl">
                        {c.client.es}
                      </h2>
                      <span className="font-mono text-[11px] uppercase tracking-wide text-clay">
                        {c.tag}
                      </span>
                      {c.status && (
                        <span className="font-mono text-[11px] uppercase tracking-wide text-haze">
                          {c.status.es}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 max-w-2xl leading-relaxed text-ink/70">
                      {c.summary.es}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-haze group-hover:text-ink">
                    Leer
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer lang="es" />
    </>
  );
}
