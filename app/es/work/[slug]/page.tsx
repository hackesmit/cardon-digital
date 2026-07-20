import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { caseStudies, getCase } from "@/lib/cases";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCase(params.slug);
  if (!c) return {};
  return {
    title: `${c.client.es} - Trabajo - Cardon Digital`,
    description: c.summary.es,
    alternates: {
      canonical: `/es/work/${c.slug}`,
      languages: { "en-US": `/work/${c.slug}`, "es-MX": `/es/work/${c.slug}` },
    },
  };
}

export default function CasePageEs({ params }: { params: { slug: string } }) {
  const c = getCase(params.slug);
  if (!c) notFound();

  return (
    <>
      <Nav lang="es" />
      <main className="pt-32 sm:pt-40">
        <article className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
            <Link href="/es/work" className="hover:text-ink">
              Trabajo
            </Link>{" "}
            / {c.tag}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            {c.client.es}
          </h1>
          <p className="mt-3 font-mono text-sm text-haze">{c.sector.es}</p>

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {c.body.es.map((para, i) => (
                <p
                  key={i}
                  className={`leading-relaxed text-ink/80 ${i > 0 ? "mt-6" : "text-lg"}`}
                >
                  {para}
                </p>
              ))}
            </div>
            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="bg-dune p-7">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                  Este rigor, en tu negocio
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/75">
                  El Diagnóstico de Crecimiento es la puerta de entrada: diez
                  días, un memo escrito, números reales.
                </p>
                <Link
                  href="/es/contact"
                  className="mt-6 block bg-clay px-5 py-3 text-center text-sm font-medium text-sand transition-opacity hover:opacity-90"
                >
                  Agendar el diagnóstico
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer lang="es" />
    </>
  );
}
