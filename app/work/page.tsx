import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { caseStudies } from "@/lib/cases";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Named clients, real numbers: Monte Xanic, Encanto.MX, BrighterHire, Activated Ministries, and a 10-account US paid search portfolio.",
  alternates: { canonical: "/work", languages: { "en-US": "/work", "es-MX": "/es/work" } },
};

export default function WorkIndex() {
  return (
    <>
      <Nav lang="en" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">Work</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Real clients, real numbers.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            Every case here is either named with permission or anonymized by
            necessity, never invented. Where the numbers are still being
            collected, the case says so.
          </p>

          <div className="mt-16 flex flex-col">
            {caseStudies.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <Link
                  href={`/work/${c.slug}`}
                  className="rule group flex flex-col gap-2 py-8 transition-colors sm:flex-row sm:items-baseline sm:gap-10"
                >
                  <span className="shrink-0 font-mono text-xs text-haze sm:w-10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h2 className="font-display text-3xl font-bold tracking-tight group-hover:text-cardon sm:text-4xl">
                        {c.client.en}
                      </h2>
                      <span className="font-mono text-[11px] uppercase tracking-wide text-clay">
                        {c.tag}
                      </span>
                      {c.status && (
                        <span className="font-mono text-[11px] uppercase tracking-wide text-haze">
                          {c.status.en}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 max-w-2xl leading-relaxed text-ink/70">
                      {c.summary.en}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-haze group-hover:text-ink">
                    Read
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer lang="en" />
    </>
  );
}
