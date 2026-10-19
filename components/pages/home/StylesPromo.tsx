import type { CSSProperties } from "react";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import { localePath, type Locale } from "@/lib/i18n/config";
import { estilos } from "@/lib/i18n/estilos";
import { SCENE_KEYS, type SceneKey } from "@/components/pages/estilos/sceneMedia";
import "./styles-promo.css";

/**
 * The home page's section for /estilos (bead hq-lgjo.5, Daniel 2026-10-16:
 * promote the styles as a selling point, "we can take your vision and build it
 * in any of these styles", with its own section and a clear way to reach it).
 *
 * It is four tiles, each painted in the colours of the sample it opens and
 * carrying that sample's own name and the industries it is for. Nothing on a
 * tile is written twice: the strings come from the styles dictionary, which is
 * where the samples themselves read them, so a style that is renamed is
 * renamed once.
 *
 * The tiles carry no photograph on purpose, and that is a decision rather than
 * an omission. Three of the four samples have real material and the coastal
 * hotel does not yet (components/pages/estilos/sceneMedia.ts, AWAITING_MEDIA),
 * and the rule this page already follows for the service cards is that a row
 * carries its pictures together or not at all: one tile without is an
 * unfinished row, not a design. Colour is the honest common denominator, it is
 * what a style IS, and it keeps a section this far down the page weightless.
 *
 * Each tile is a deep link into the gallery, so the visitor lands on the style
 * they pressed rather than at the top of the page (the scenes carry
 * `id="estilo-<key>"` and a scroll margin for the sticky caption).
 */

/**
 * The colours of each sample, as the tile wears them.
 *
 * These are the scene grounds from app/[locale]/estilos/estilos.css, repeated
 * here because a tile is on a different page and cannot read that stylesheet.
 * The repetition is pinned: components/pages/estilos/sceneMedia.test.ts reads
 * the stylesheet and fails if a ground moves without this table moving with it.
 */
/**
 * Where each tile sends the reader, as string literals in the order of
 * SCENE_KEYS. Written out rather than built from the key, because
 * app/routes.test.ts audits every internal link on the site by reading source
 * and a path assembled at runtime is a link it cannot see. The pairing with
 * SCENE_KEYS is held by sceneMedia.test.ts.
 */
export const STYLE_ROUTES = [
  "/estilos#estilo-vinedo",
  "/estilos#estilo-tech",
  "/estilos#estilo-spa",
  "/estilos#estilo-hotel",
] as const;

export const STYLE_TILES: Record<SceneKey, { ground: string; ink: string; accent: string }> = {
  vinedo: { ground: "#6F2A1B", ink: "#F7EAD5", accent: "#F4B44E" },
  tech: { ground: "#0A0C10", ink: "#F2F5F9", accent: "#C8FF3A" },
  // The wellness accent is the sample's KICKER violet, not its title
  // violet: the tile sets its style name at 0.74rem, which is small text, and
  // the lighter one measures 4.40 against this ground where small text needs
  // 4.5 (sceneMedia.test.ts measures all eight pairs).
  spa: { ground: "#EFEDF6", ink: "#3A3454", accent: "#665F8C" },
  hotel: { ground: "#0F4A57", ink: "#F5EAD6", accent: "#F1BD8E" },
};

export default function StylesPromo({ locale }: { locale: Locale }) {
  const d = estilos[locale];
  const p = d.promo;
  const href = (path: string) => localePath(locale, path);

  return (
    <section className="section styles-promo" aria-labelledby="styles-title">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="kicker">{p.kicker}</span>
            <h2 id="styles-title">{p.title}</h2>
            <p className="section-sub">{p.body}</p>
          </div>
        </Reveal>
        <Reveal>
          <ul className="sp-grid" aria-label={p.aria}>
            {SCENE_KEYS.map((key, i) => {
              const tile = STYLE_TILES[key];
              const sample = d[key];
              return (
                <li key={key}>
                  <Link
                    className="sp-tile"
                    href={href(STYLE_ROUTES[i])}
                    style={
                      {
                        "--sp-ground": tile.ground,
                        "--sp-ink": tile.ink,
                        "--sp-accent": tile.accent,
                      } as CSSProperties
                    }
                  >
                    <span className="sp-tile-style">{sample.style}</span>
                    <span className="sp-tile-for">
                      {sample.title} <em>{sample.titleAccent}</em>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="sp-note">{p.note}</p>
          <div className="cta-row">
            <Link className="cta" href={href("/estilos")}>
              {p.cta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
