# Media credits

Attribution for the files in this folder: who made a picture and under what
licence it is used. That is all this file holds, and all it may hold, because
`public/` is served on the open web and this file is one GET away from anyone
who guesses its name.

The clearance paperwork is a different thing and lives somewhere else. Release
forms, the people named on them, where a signed form is filed, and which client
contact approved which premises or which numbers on a screen are all recorded
in `docs/media-clearances.md`, which ships in the repository and is never
served. A file is not cleared to go live until it has an entry there; this file
only says who to credit once it is.

## Our own material

Photography and video shot by Cardon Digital is credited to Cardon Digital and
needs no licence. An entry here is the credit line and the slot it fills:

```
## winery/cellar.webp

- Credit: Cardon Digital
- Year: 2026
- Slot: winery/cellar
```

Nothing more. No names of people in frame, no client contacts, no location
beyond what the site already says in its own copy, and no path to a release
form. If you are about to write one of those into this file, it belongs in
`docs/media-clearances.md` instead.

## Placeholder stock

The file below is licensed stock standing in until the real photography lands.
It is the current winery page band, replaced by the `winery/vineyard` slot on
the list in README.md. Delete the file and its entry here when that happens.

### valle-vineyard.webp

- Photographer: Philippe Serrand
- Source: https://www.pexels.com/photo/vineyard-at-sunset-18248851/
- License: Pexels License (free for commercial and personal use, no attribution required)
- Original: vineyard rows at golden hour, Colmar, France

The stock file above is licensed for commercial use with no attribution
required. It is credited here anyway, because provenance is cheaper to keep than to reconstruct,
and because a stock photograph of a French vineyard standing in for the Valle is
exactly the kind of thing that has to be visible to be replaced. A published
photographer credit on a published stock photograph is attribution, not
personal data, which is why these two entries are safe in a served file.

## Supplied files (2026-09-28)

Files Daniel supplied through the console inbox, cropped and encoded to WebP
through Chrome's canvas (the box has no image library). The licence of the
stock frame is recorded when Daniel names its source.

### about/cellar.webp

- Credit: stock, supplied by Daniel Hack, 2026-09-28; source and licence to record
- Slot: about/cellar
- Frame: barrels racked in a cellar under warm pendant light, cropped to 4:3

### precios/handover.webp

- Credit: stock, supplied by Daniel Hack, 2026-09-28; source and licence to record
- Slot: precios/handover
- Frame: a handshake across a counter, cropped to 3:2 from a portrait original

### enkanto/cabana.webp

- Credit: Vinedo En'kanto, the property's own photograph, supplied 2026-09-28
- Year: 2026
- Use: the En'kanto case band (app/[locale]/work/enkanto/page.tsx)
- Frame: the cabin among succulents and vines, San Antonio de las Minas

## Cardon Digital photography, shot at Monte Xanic (2026-09-29)

Seven frames Daniel shot in the cellar and the lab, the system open on a
laptop and on a phone. Credit: Cardon Digital, 2026. The clearance record for
the screens in frame is in docs/media-clearances.md.

- home/proof-xanic.webp, slot home/proof-xanic
- home/service-software.webp, slot home/service-software
- home/xanic-cellar.webp, slot home/xanic-cellar
- home/phone-in-hand.webp, slot home/phone-in-hand
- xanic/after-tablet.webp, slot xanic/after-tablet
- precios/diagnostic-session.webp, slot precios/diagnostic-session
- winery/cellar.webp, slot winery/cellar (replaces the stock barrel room of 2026-09-28)
- software/cellar-charts.webp, slot software/cellar-charts
- software/cellar-laptop.webp, slot software/cellar-laptop
- software/phone-at-barrel.webp, slot software/phone-at-barrel
- home/phone-in-hand.webp, slot home/phone-in-hand (the 2026-09-30 still replaces the darker 2026-09-29 one)
- home/xanic-tank-log.mp4 and its poster, slot home/xanic-tank-log (clip, 2026-09-30)
- xanic/harvest-intake.mp4 and its poster, slot xanic/harvest-intake (clip, 2026-09-30)

## Icons

The four station icons in the berry-to-bottle visual on the Monte Xanic case
page (components/pages/case/BerryToBottle.tsx) are Lucide icons, embedded as
inline SVG path data.

- Set: Lucide, package lucide-static, version 1.48.0
- Licence: ISC, https://github.com/lucide-icons/lucide/blob/main/LICENSE
- Source: https://cdn.jsdelivr.net/npm/lucide-static@1.48.0/icons/
- Icons: grape (berry), cylinder (tank), barrel (barrel), bottle-wine (bottle)
- Copyright (c) Lucide Icons and Contributors


## Client marks (2026-10-07)

The four files under `clients/` are the clients' own marks, supplied by the
clients and used with their permission on the home page's client orbit. Each
is the emblem of the supplied file, reduced to a one-colour alpha silhouette so
it takes the site's colour; the marks themselves remain the property of each
business.

### clients/brighterhire-mark.png

- Credit: BrighterHire
- License: used with permission of the owner
- Slot: home/orbit

### clients/monte-xanic-mark.png

- Credit: Monte Xanic
- License: used with permission of the owner
- Slot: home/orbit

### clients/enkanto-mark.png

- Credit: Vinedo En'kanto
- License: used with permission of the owner
- Slot: home/orbit

### clients/rlogistics-mark.png

- Credit: RLogistics
- License: used with permission of the owner
- Slot: home/orbit
