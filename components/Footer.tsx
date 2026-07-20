import { Link } from "next-view-transitions";
import Mark from "./Mark";

export default function Footer({ lang = "en" }: { lang?: "en" | "es" }) {
  const es = lang === "es";
  const p = es ? "/es" : "";

  return (
    <footer className="bg-night text-sand">
      <div className="mx-auto max-w-site px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Mark className="h-5 w-auto" dark="#EFE6D3" light="#8A7B64" />
              <span className="font-display text-[15px] font-bold tracking-tight">
                Cardon Digital
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand/60">
              {es
                ? "Sistemas de crecimiento construidos para retener el agua. Baja California, Mexico."
                : "Growth systems built to hold water. Baja California, Mexico."}
            </p>
          </div>

          <div className="font-mono text-xs leading-loose text-sand/60">
            <p className="text-sand/40">{es ? "Navegacion" : "Navigate"}</p>
            <div className="mt-2 flex flex-col gap-1">
              <Link href={`${p}/work`} className="hover:text-sand">
                {es ? "Trabajo" : "Work"}
              </Link>
              <Link href={`${p}/services`} className="hover:text-sand">
                {es ? "Servicios" : "Services"}
              </Link>
              <Link href={`${p}/about`} className="hover:text-sand">
                {es ? "Nosotros" : "About"}
              </Link>
              <Link href={`${p}/contact`} className="hover:text-sand">
                {es ? "Contacto" : "Contact"}
              </Link>
              <Link href={es ? "/" : "/es"} className="hover:text-sand">
                {es ? "English" : "Espanol"}
              </Link>
            </div>
          </div>

          <div className="font-mono text-xs leading-loose text-sand/60">
            <p className="text-sand/40">{es ? "Transfronterizo" : "Cross-border"}</p>
            <p className="mt-2">
              {es
                ? "Clientes en EUA: W-8BEN en archivo, sin friccion de 1099. Facturacion CFDI 4.0 en Mexico."
                : "US clients: W-8BEN on file, no 1099 friction. CFDI 4.0 invoicing in Mexico."}
            </p>
            <p className="mt-4 text-sand/40">
              (c) 2026 Cardon Digital
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
