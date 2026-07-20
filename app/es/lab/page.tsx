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
  title: "Lab - Cardon Digital",
  description:
    "Cada efecto en esta página corre en vivo en tu navegador: física de resortes en WebGL, la API de View Transitions, animaciones CSS ligadas al scroll. El trabajo de interfaz que integramos en los sitios de nuestros clientes.",
  alternates: {
    canonical: "/es/lab",
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
  [
    "Scroll suave",
    "Lenis, amortiguado con resortes. El peso que sientes cuando la página se mueve.",
  ],
  [
    "Transiciones de página",
    "View Transitions en cada enlace interno. Haz clic en cualquier parte del menú.",
  ],
  ["Progreso de lectura", "La línea color arcilla en el borde superior de esta página."],
  [
    "Revelados por scroll",
    "Títulos y líneas que animan según tu posición de scroll, sin JavaScript.",
  ],
  ["Grano de película", "La textura sobre todo lo que has estado leyendo."],
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

export default function LabEs() {
  return (
    <>
      <div className="lab-progress" aria-hidden="true" />
      <Nav lang="es" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
            El laboratorio
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Nada en esta página es un mockup. Tócalo.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
            Este es el trabajo de movimiento e interfaz que integramos en los
            sitios de nuestros clientes, corriendo en vivo sobre el mismo stack
            que entregamos: WebGL, la API de View Transitions, animaciones CSS
            ligadas al scroll, física de resortes. Sin librerías de animación,
            sin videos grabados. Los demos de cursor piden un mouse; todo lo
            demás funciona con el scroll. Y si tu sistema pide movimiento
            reducido, esta página lo respeta y se queda quieta.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-6">
            <Tile
              n="01"
              title="Campo de resortes"
              tech="WebGL + shader propio"
              desc="Setenta y dos barras, física de resortes calculada en cada cuadro, el cursor las levanta y las tiñe de arcilla. El hero de la página principal corre este mismo componente."
              className="sm:col-span-2 lg:col-span-4"
            >
              <div className="h-56 px-6">
                <RibFieldGL />
              </div>
            </Tile>

            <Tile
              n="02"
              title="Decodificar"
              tech="requestAnimationFrame"
              desc="Etiquetas que se resuelven en su lugar. Pasa el cursor para verlo otra vez. Lo usamos en números donde el lector debe frenar."
              className="lg:col-span-2"
            >
              <div className="flex h-full min-h-32 items-center px-6">
                <ScrambleText
                  text="NÚMEROS QUE DICEN LA VERDAD"
                  className="font-mono text-xl leading-snug text-cardon sm:text-2xl"
                />
              </div>
            </Tile>

            <Tile
              n="03"
              title="Morph de elementos"
              tech="View Transitions API"
              desc="Mezcla la cuadrícula y el navegador anima cada pieza de su caja anterior a la nueva. La navegación entre páginas de este sitio usa la misma API."
              className="lg:col-span-3"
            >
              <div className="px-6">
                <ShuffleGrid label="Mezclar" />
              </div>
            </Tile>

            <Tile
              n="04"
              title="Reflector"
              tech="variables CSS"
              desc="La posición del cursor cae en dos variables CSS; cada cuadro del pintado es CSS puro. Sirve como hover, como hero o como revelado en secciones oscuras."
              className="lg:col-span-3"
            >
              <Spotlight className="flex h-full min-h-56 items-center px-8 py-10">
                <p className="lab-spot-text max-w-sm font-display text-2xl font-bold leading-snug sm:text-3xl">
                  Hay verdades que solo aparecen cuando les apuntas la luz de
                  frente.
                </p>
              </Spotlight>
            </Tile>

            <Tile
              n="05"
              title="Marquesina"
              tech="solo CSS"
              desc="Las herramientas en bucle. Pasa el cursor para pausar. Sin JavaScript."
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
              title="Inclinación"
              tech="transformación en perspectiva"
              desc="Una tarjeta plana con profundidad y un brillo que sigue al cursor. Para que un objeto de la página se sienta físico."
              className="lg:col-span-2"
            >
              <div className="px-6 pt-2">
                <TiltCard className="overflow-hidden bg-dune p-6">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-haze">
                    Memo de diagnóstico
                  </p>
                  <p className="mt-3 font-display text-xl font-bold leading-snug">
                    Dónde se fuga el dinero, en pesos y dólares.
                  </p>
                  <p className="mt-4 font-mono text-xs text-ink/60">
                    10 días hábiles
                  </p>
                </TiltCard>
              </div>
            </Tile>

            <Tile
              n="07"
              title="Botón magnético"
              tech="cursor + retorno de resorte"
              desc="El botón se inclina hacia la mano que está por hacer clic y luego regresa. Es pequeño, y la gente lo recuerda."
              className="lg:col-span-2"
            >
              <div className="flex h-full min-h-36 items-center justify-center">
                <Magnetic>
                  <Link
                    href="/es/contact"
                    className="inline-block bg-clay px-7 py-4 font-medium text-sand"
                  >
                    Agendar el diagnóstico
                  </Link>
                </Magnetic>
              </div>
            </Tile>

            <Tile
              n="08"
              title="Conteo"
              tech="IntersectionObserver"
              desc="Números que aterrizan al entrar en pantalla. Estos tres son reales: el dashboard de vendimia de Monte Xanic."
              className="lg:col-span-2"
            >
              <div className="flex h-full flex-col justify-center gap-4 px-6">
                {[
                  [714, "muestras de vendimia"],
                  [89, "lotes de viñedo"],
                  [9, "varietales"],
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
              title="Barrido por scroll"
              tech="clip-path ligado al scroll"
              desc="La imagen se revela según dónde estás en la página, no con un temporizador. Sube el scroll y se revierte. Cero JavaScript."
              className="lg:col-span-3"
            >
              <div className="px-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/work/monte-xanic.png"
                  alt="Dashboard de vendimia de Monte Xanic"
                  className="lab-clip w-full border border-ink/10"
                />
              </div>
            </Tile>

            <Tile
              n="10"
              title="Capas en paralaje"
              tech="animation-timeline: view()"
              desc="Tres capas, tres velocidades, sin listeners de scroll. Esta sola API reemplaza a toda una clase de librerías de animación."
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
              title="Tipografía con velocidad"
              tech="velocidad de scroll"
              desc="Tipografía que se inclina con la velocidad de tu scroll y se asienta cuando paras. Dale un empujón a la página."
              className="sm:col-span-2 lg:col-span-6"
            >
              <div className="overflow-hidden border-y border-ink/10 py-6">
                <VelocityType
                  text="HECHO PARA GUARDAR AGUA"
                  className="whitespace-nowrap text-center font-display text-[6.5vw] font-extrabold tracking-tight text-ink/85 lg:text-8xl"
                />
              </div>
            </Tile>

            <Tile
              n="12"
              title="Trazo en línea"
              tech="SVG pathLength"
              desc="La marca se dibuja sola al entrar en pantalla, ligada a la posición del scroll."
              className="lg:col-span-2"
            >
              <div className="flex h-full min-h-56 items-end justify-center px-6">
                <CactusDraw className="h-52 w-auto" />
              </div>
            </Tile>

            <Tile
              n="13"
              title="Ya corriendo en todo el sitio"
              tech="la capa silenciosa"
              desc="Los efectos que no notas son los que más trabajan."
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
                El punto
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
                El oficio que se siente es la prueba más rápida del oficio que
                no se ve.
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-sand/70">
                Nada de esto se entrega como decoración. Cada efecto se gana su
                lugar: guía la mirada, marca jerarquía, hace que un número se
                quede. Todos respetan la configuración de movimiento reducido,
                funcionan sin JavaScript y pesan tan poco que no vale la pena
                preocuparse. Si quieres un sitio que demuestre su punto en vez
                de afirmarlo, esa conversación empieza con el diagnóstico.
              </p>
              <Magnetic className="-ml-6 mt-4">
                <Link
                  href="/es/contact"
                  className="inline-block bg-clay px-6 py-3 text-sm font-medium text-sand"
                >
                  Empieza con el diagnóstico
                </Link>
              </Magnetic>
            </section>
          </Reveal>
        </div>
      </main>
      <Footer lang="es" />
    </>
  );
}
