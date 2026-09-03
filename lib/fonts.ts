import { Archivo } from "next/font/google";

/** Identity: Archivo carries display and body (Cardon system v3, 2026-08-27).
 *  Self-hosted by next/font, so no CDN request and no layout shift. It is
 *  declared once here because both the locale layout and the root 404 document
 *  mount the same html element. */
export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-archivo",
});
