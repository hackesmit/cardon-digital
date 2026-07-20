import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import RibFieldGL from "@/components/RibFieldGL";
import Tile from "@/components/lab/Tile";
import ScrambleText from "@/components/lab/ScrambleText";
import Magnetic from "@/components/lab/Magnetic";
import TiltCard from "@/components/lab/TiltCard";
import CountUp from "@/components/lab/CountUp";
import ShuffleGrid from "@/components/lab/ShuffleGrid";
import Spotlight from "@/components/lab/Spotlight";
import VelocityType from "@/components/lab/VelocityType";
import CactusDraw from "@/components/lab/CactusDraw";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Every effect on this page runs live in your browser: WebGL spring physics, the View Transitions API, CSS scroll-driven animations. The interface work we build into client sites.",
  alternates: {
    canonical: "/lab",
    languages: { "en-US": "/lab", "es-MX": "/es/lab" },
  },
};

const TOOLS = [
  "Google Ads",
  "GA4",
  "Next.js",
  "Supabase",
  "n8n",
  "Stripe",
  "Shopify",
  "WebGL",
  "Python",
  "Looker Studio",
];

const QUIET = [
  ["Smooth scroll", "Lenis, spring-damped. The weight you feel when this page moves."],
  ["Page morphs", "View Transitions on every internal link. Click any nav item."],
  ["Reading progress", "The clay line along the very top of this page."],
  [
    "Scroll-driven reveals",
    "Headlines and rules animating from scroll position, zero JavaScript.",
  ],
  ["Film grain", "The texture sitting over everything you have been reading."],
];

function MarqueeRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <span aria-hidden={hidden || undefined} className="flex">
      {TOOLS.map((t) => (
        <span
          key={t}
          className="px-7 font-mono text-sm uppercase tracking-widest text-ink/70"
        >
          {t} <span className="pl-7 text-haze">/</span>
        </span>
      ))}
    </span>
  );
}

export default function Lab() {
  return (
    <>
      <div className="lab-progress" aria-hidden="true" />
      <Nav lang="en" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
            The lab
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Nothing on this page is a mockup. Touch it.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
            This is the motion and interface work we build into client sites,
            running live on the same stack we ship: WebGL, the View Transitions
            API, CSS scroll-driven animations, spring physics. No animation
            libraries, no video captures. The cursor demos want a mouse;
            everything else works by scrolling. And if your system asks for
            reduced motion, this page respects it and holds still.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-6">
            <Tile
              n="01"
              title="Spring field"
              tech="WebGL + custom shader"
              desc="Seventy-two bars, spring physics computed every frame, cursor lift, clay heat where you point. The homepage hero runs this exact component."
              className="sm:col-span-2 lg:col-span-4"
            >
              <div className="h-56 px-6">
                <RibFieldGL />
              </div>
            </Tile>

            <Tile
              n="02"
              title="Decode"
              tech="requestAnimationFrame"
              desc="Labels that resolve into place. Hover to run it again. We use it for numbers a reader should slow down for."
              className="lg:col-span-2"
            >
              <div className="flex h-full min-h-32 items-center px-6">
                <ScrambleText
                  text="MAKE THE NUMBERS TRUE"
                  className="font-mono text-xl leading-snug text-cardon sm:text-2xl"
                />
              </div>
            </Tile>

            <Tile
              n="03"
              title="Element morph"
              tech="View Transitions API"
              desc="Shuffle the grid and the browser animates every tile from its old box to its new one. Page navigation on this site uses the same API."
              className="lg:col-span-3"
            >
              <div className="px-6">
                <ShuffleGrid label="Shuffle" />
              </div>
            </Tile>

            <Tile
              n="04"
              title="Spotlight"
              tech="CSS custom properties"
              desc="The pointer position lands in two CSS variables; every frame of the paint is pure CSS. Works as a hover state, a hero, or a dark-section reveal."
              className="lg:col-span-3"
            >
              <Spotlight className="flex h-full min-h-56 items-center px-8 py-10">
                <p className="lab-spot-text max-w-sm font-display text-2xl font-bold leading-snug sm:text-3xl">
                  Some truths only show up when you point the light straight at
                  them.
                </p>
              </Spotlight>
            </Tile>

            <Tile
              n="05"
              title="Marquee"
              tech="CSS only"
              desc="The toolchain on a loop. Hover to pause. No JavaScript involved."
              className="sm:col-span-2 lg:col-span-6"
            >
              <div className="lab-marquee border-y border-ink/10 py-5">
                <div className="lab-marquee-track">
                  <MarqueeRow />
                  <MarqueeRow hidden />
                </div>
              </div>
            </Tile>

            <Tile
              n="06"
              title="Tilt"
              tech="perspective transform"
              desc="A flat card with depth and a glare that tracks the cursor. For making one object on a page feel physical."
              className="lg:col-span-2"
            >
              <div className="px-6 pt-2">
                <TiltCard className="overflow-hidden bg-dune p-6">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-haze">
                    Diagnostic memo
                  </p>
                  <p className="mt-3 font-display text-xl font-bold leading-snug">
                    Where the money leaks, in dollars.
                  </p>
                  <p className="mt-4 font-mono text-xs text-ink/60">
                    10 business days
                  </p>
                </TiltCard>
              </div>
            </Tile>

            <Tile
              n="07"
              title="Magnetic pull"
              tech="pointer + spring return"
              desc="The button leans toward the hand that is about to click it, then springs back. Small, and people remember it."
              className="lg:col-span-2"
            >
              <div className="flex h-full min-h-36 items-center justify-center">
                <Magnetic>
                  <Link
                    href="/contact"
                    className="inline-block bg-clay px-7 py-4 font-medium text-sand"
                  >
                    Book the diagnostic
                  </Link>
                </Magnetic>
              </div>
            </Tile>

            <Tile
              n="08"
              title="Count-up"
              tech="IntersectionObserver"
              desc="Numbers land when they enter view. These three are real: the Monte Xanic harvest dashboard."
              className="lg:col-span-2"
            >
              <div className="flex h-full flex-col justify-center gap-4 px-6">
                {[
                  [714, "harvest samples"],
                  [89, "vineyard lots"],
                  [9, "varietals"],
                ].map(([n, label]) => (
                  <div key={label} className="flex items-baseline gap-3">
                    <CountUp
                      to={n as number}
                      className="font-display text-4xl font-extrabold tracking-tight text-cardon"
                    />
                    <span className="font-mono text-xs uppercase tracking-wide text-haze">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Tile>

            <Tile
              n="09"
              title="Scroll wipe"
              tech="scroll-driven clip-path"
              desc="The image is revealed by where you are on the page, not by a timer. Scroll back up and it reverses. Zero JavaScript."
              className="lg:col-span-3"
            >
              <div className="px-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/work/monte-xanic.png"
                  alt="Monte Xanic harvest dashboard"
                  className="lab-clip w-full border border-ink/10"
                />
              </div>
            </Tile>

            <Tile
              n="10"
              title="Parallax layers"
              tech="animation-timeline: view()"
              desc="Three layers, three speeds, no scroll listeners. This one API replaces an entire class of animation library."
              className="lg:col-span-3"
            >
              <div className="relative mx-6 h-64 overflow-hidden bg-dune/60">
                <div
                  className="lab-par absolute inset-x-8 top-16 h-44 bg-dune"
                  style={{ "--par": "7%" } as React.CSSProperties}
                />
                <div
                  className="lab-par absolute left-16 top-24 h-36 w-2/5 bg-cardon/70"
                  style={{ "--par": "17%" } as React.CSSProperties}
                />
                <div
                  className="lab-par absolute right-16 top-32 h-24 w-1/4 bg-clay"
                  style={{ "--par": "30%" } as React.CSSProperties}
                />
              </div>
            </Tile>

            <Tile
              n="11"
              title="Velocity type"
              tech="scroll velocity"
              desc="Type that leans with the speed of your scroll and settles when you stop. Flick the page."
              className="sm:col-span-2 lg:col-span-6"
            >
              <div className="overflow-hidden border-y border-ink/10 py-6">
                <VelocityType
                  text="BUILT TO HOLD WATER"
                  className="whitespace-nowrap text-center font-display text-[7vw] font-extrabold tracking-tight text-ink/85 lg:text-8xl"
                />
              </div>
            </Tile>

            <Tile
              n="12"
              title="Line draw"
              tech="SVG pathLength"
              desc="The mark draws itself as it enters the viewport, tied to scroll position."
              className="lg:col-span-2"
            >
              <div className="flex h-full min-h-56 items-end justify-center px-6">
                <CactusDraw className="h-52 w-auto" />
              </div>
            </Tile>

            <Tile
              n="13"
              title="Already running site-wide"
              tech="the quiet layer"
              desc="The effects you do not notice are doing the most work."
              className="sm:col-span-2 lg:col-span-4"
            >
              <ul className="flex flex-col gap-3 px-6">
                {QUIET.map(([k, v]) => (
                  <li key={k} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="w-44 shrink-0 font-mono text-xs uppercase tracking-wide text-cardon">
                      {k}
                    </span>
                    <span className="text-sm leading-relaxed text-ink/70">
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </Tile>
          </div>

          <Reveal>
            <section className="mt-20 bg-night p-8 text-sand sm:p-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-sand/40">
                The point
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Craft you can feel is the fastest proof of craft you cannot
                see.
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-sand/70">
                None of this ships as decoration. Each effect earns its place:
                guiding the eye, marking hierarchy, making one number stick.
                Every one of them respects reduced-motion settings, works
                without JavaScript, and costs almost nothing in page weight.
                If you want a site that proves its point instead of claiming
                it, that conversation starts with the diagnostic.
              </p>
              <Magnetic className="-ml-6 mt-4">
                <Link
                  href="/contact"
                  className="inline-block bg-clay px-6 py-3 text-sm font-medium text-sand"
                >
                  Start with the diagnostic
                </Link>
              </Magnetic>
            </section>
          </Reveal>
        </div>
      </main>
      <Footer lang="en" />
    </>
  );
}
