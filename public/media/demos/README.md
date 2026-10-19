# Demo previews

These four files are the preview images on `/demos`. They are not photographs
and they are not part of the shot list in `../README.md`: each one is a
screenshot of the running demo at <https://demo.cardondigital.com>, taken by a
browser, not by a camera.

Nothing here is drawn, retouched or assembled. One file is a band of its screen
rather than the first screenful, and the capture script says which and why.

## Making them again

```
node scripts/demos/capture.mjs            all four
node scripts/demos/capture.mjs produccion just one
```

The script holds the list of screens, the frame size and the webp quality. Run
it whenever the demo's own shell changes, or a card advertises a screen the
demo no longer has. The files are committed, because the page has to render on
a machine that cannot reach the demo host.

## What they must keep saying

Finca Tierra Lenta is an invented business and the numbers on these screens are
illustrative. The page says so in the hero and under the grid, and every image
carries it in its alt text. A preview that stops showing the demo's own notice
does not change that rule.
