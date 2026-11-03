import type { Metadata } from "next";
import CardonHome, { generateMetadata as cardonMetadata } from "@/components/pages/home-cardon";
import VinoHome, { generateMetadata as vinoMetadata } from "@/components/pages/home-vino";
import { BRAND } from "@/lib/brand";

/**
 * The home route of either brand (lib/brand.ts, docs/BRANDS.md). The page
 * bodies live in components/pages: home-cardon.tsx is cardondigital.com's
 * home as it was, home-vino.tsx the wine brand's. This file only picks one.
 */
type Params = { params: Promise<{ locale: string }> };

const vino = BRAND.id === "vino";

export async function generateMetadata(props: Params): Promise<Metadata> {
  return vino ? vinoMetadata(props) : cardonMetadata(props);
}

export default async function Home(props: Params) {
  return vino ? VinoHome(props) : CardonHome(props);
}
