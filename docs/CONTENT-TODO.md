# Content still to decide or write

Claims a page leaves out because no business fact for them is in the repo or
the bunker docs yet, and copy that waits on another bead. Each line says who
or what unblocks it. Remove a line when it lands.

## The wine brand (epic hq-3f6ut)

- The brand's name and domain. Every page reads the placeholder from
  `lib/brand.ts`; the name is Daniel's decision (hq-3f6ut.6).
- The diagnostic's name on the wine brand. Its pages still call it "The Growth
  Diagnostic" / "El Diagnóstico de Crecimiento" (`lib/i18n/site.ts`), Cardon's
  name for it. Only its price line was changed, to drop the AI answers check
  (hq-3f6ut.2). Whether the wine brand gives it its own name is open.
- `/precios` on vino still shows the website and ads packages and links
  `/sitios-web` and `/anuncios`; the split is hq-3f6ut.3
  (`app/vino-pages.test.tsx` holds it in `PENDING`).
- `/about` on vino describes Cardon's websites and Google Ads; its text is
  hq-3f6ut.3's.
- The wine brand's own Open Graph image and icons: it shares Cardon's until it
  has artwork (docs/BRANDS.md).
- A mailbox on the brand's domain: contact goes to the Cardon address until the
  domain exists (`lib/brand.ts`).
- A published figure from En'kanto: the system is in daily use and no figure is
  published, so the case and the home carry none.
