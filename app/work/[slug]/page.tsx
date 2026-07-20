import type { Metadata } from "next";
import { Link } from "next-view-transitions";
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
    title: `${c.client.en} - Work`,
    description: c.summary.en,
    alternates: {
      canonical: `/work/${c.slug}`,
      languages: { "en-US": `/work/${c.slug}`, "es-MX": `/es/work/${c.slug}` },
    },
  };
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const c = getCase(params.slug);
  if (!c) notFound();

  return (
    <>
      <Nav lang="en" />
      <main className="pt-32 sm:pt-40">
        <article className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
            <Link href="/work" className="hover:text-ink">
              Work
            </Link>{" "}
            / {c.tag}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            {c.client.en}
          </h1>
          <p className="mt-3 font-mono text-sm text-haze">{c.sector.en}</p>

          {c.image && (
            <div className="sd-rise mt-10 border border-ink/15 bg-dune p-2 sm:p-3">
              <img
                src={c.image.src}
                alt={c.image.alt.en}
                loading="lazy"
                className="h-auto w-full"
              />
            </div>
          )}

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {c.body.en.map((para, i) => (
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
                  Want this rigor on your business?
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/75">
                  The Growth Diagnostic is the front door: ten days, a written
                  memo, real numbers.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 block bg-clay px-5 py-3 text-center text-sm font-medium text-sand transition-opacity hover:opacity-90"
                >
                  Book the diagnostic
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer lang="en" />
    </>
  );
}
