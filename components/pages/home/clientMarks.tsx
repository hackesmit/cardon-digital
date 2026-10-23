/**
 * The marks in the client logo row (ClientLogos; beads hq-1cct, hq-3w0v).
 *
 * All six are the clients' own marks: the emblem cut from the file each
 * client supplied (BrighterHire's sun, Monte Xanic's emblem, En'kanto's E,
 * Dharma Ochoa's signature D, RLogistics' R and chevrons) or, for Aperta
 * Media Co., redrawn from the play, bar and square of its own logo, stored as an alpha
 * mask under public/media/clients and painted in that client's own colours
 * by home.css. Their credit is in public/media/CREDITS.md and their
 * clearance in docs/media-clearances.md.
 */
export type ClientId = "xanic" | "enkanto" | "aperta" | "dharma" | "brighter" | "rlog";

export const CLIENT_ORDER: ClientId[] = ["xanic", "enkanto", "aperta", "dharma", "brighter", "rlog"];

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinejoin: "round" as const };

/** The stroke monograms each mark falls back to in a browser with no CSS
    mask support. */
const MONOGRAMS: Record<ClientId, JSX.Element> = {
  xanic: (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...S}>
      <path d="M3 24 L12 7 L21 24" />
      <path d="M10 24 L18 10 L26 24" />
      <path d="M3 24 H26" opacity="0.5" />
    </svg>
  ),
  enkanto: (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...S}>
      <path d="M4 15 L14 6 L24 15" />
      <path d="M8 14 V24 H20 V14" />
      <circle cx="12" cy="20" r="1.8" />
      <circle cx="16" cy="20" r="1.8" />
      <circle cx="14" cy="23.4" r="1.8" />
    </svg>
  ),
  aperta: (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...S}>
      <path d="M2 9 V19 L9 14 Z" />
      <path d="M12 9 V19" />
      <rect x="15" y="9" width="11" height="10" rx="1.5" />
    </svg>
  ),
  dharma: (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...S}>
      <path d="M6 21 C 9 7, 20 5, 25 12" strokeLinecap="round" />
      <path d="M7 25 c 4 -2, 8 -2, 12 0" strokeLinecap="round" opacity="0.7" />
      <circle cx="23" cy="20" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  brighter: (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...S}>
      <path d="M5 19 A9 9 0 0 1 23 19" />
      <path d="M3 23 H25" />
      <path d="M14 15 V5 M10 9 L14 5 L18 9" />
    </svg>
  ),
  rlog: (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...S}>
      <path d="M7 23 L14 7 L23 18" />
      <path d="M19 18 H23 V14" />
      <circle cx="7" cy="23" r="2.2" />
      <circle cx="14" cy="7" r="2.2" />
    </svg>
  ),
};

/** A client's mark as a mask the medallion paints in its own colour. The mask
    file is named by a class in home.css, never an inline style, so a strict
    style-src policy cannot strip it; where masks are unsupported the span
    stays empty (home.css, @supports) and the monogram beside it shows. A wide
    mark (RLogistics is 2.2 to 1, Aperta 2.3 to 1) gets a wider slot so it is not a sliver. */
function Mask({ id, wide }: { id: ClientId; wide?: boolean }) {
  return (
    <>
      <span
        className={"orbit-mark orbit-mark-" + id + (wide ? " orbit-mark-wide" : "")}
        aria-hidden="true"
      />
      <span className="orbit-mark-fallback" aria-hidden="true">
        {MONOGRAMS[id]}
      </span>
    </>
  );
}

export const CLIENT_MARKS: Record<ClientId, JSX.Element> = {
  xanic: <Mask id="xanic" />,
  enkanto: <Mask id="enkanto" />,
  aperta: <Mask id="aperta" wide />,
  dharma: <Mask id="dharma" />,
  brighter: <Mask id="brighter" />,
  rlog: <Mask id="rlog" wide />,
};
