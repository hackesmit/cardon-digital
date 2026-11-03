import type { Metadata } from "next";
import CardonSoftware, { generateMetadata as cardonMetadata } from "@/components/pages/software-cardon";
import VinoSoftware, { generateMetadata as vinoMetadata } from "@/components/pages/software-vino";
import { BRAND } from "@/lib/brand";

/**
 * /software on either brand (lib/brand.ts, docs/BRANDS.md). On cardon it is
 * custom software for any business (software-cardon.tsx, bead hq-3f6ut.3);
 * on the wine brand it is the modules page (software-vino.tsx). This file
 * only picks one.
 */
type Params = { params: Promise<{ locale: string }> };

const vino = BRAND.id === "vino";

export async function generateMetadata(props: Params): Promise<Metadata> {
  return vino ? vinoMetadata(props) : cardonMetadata(props);
}

export default async function Software(props: Params) {
  return vino ? VinoSoftware(props) : CardonSoftware(props);
}
