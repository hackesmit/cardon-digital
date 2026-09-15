# Media: the shot list

This folder holds every photograph and every video the site shows. It is also
the brief. If you are shooting, this file is the only page you need: it says
which files to produce, what shape each one is, what size to shoot it at, and
what has to be happening in the frame.

Nothing here is decoration. Each slot exists to prove a claim the page makes,
and each one carries a caption, which is written by the page and is read by
about twice as many people as the copy around it. A photograph with no caption
is paid inventory carrying no argument, so the component will not compile
without a caption, and it refuses to render a blank or whitespace-only one.

This file is served on the open web, like everything else under `public/`. It
is a brief and a specification, so that is fine. Release forms, client sign off
and the names attached to them are not: those live in `docs/media-clearances.md`,
which ships in the repository and never to a visitor.

## How a slot works

A slot is a name, like `winery/cellar`. The name is also the path of the file
under `public/media`, without the extension:

- photograph: `public/media/winery/cellar.webp`
- video: `public/media/winery/cellar.mp4` plus a poster frame at
  `public/media/winery/cellar-poster.webp`

Until that file exists the page shows a flat hatched panel printing the path,
the ratio and the size to shoot to. So you can open the site, walk the pages,
and read the outstanding shot list straight off the screen. Nothing moves when
a real file replaces a panel: the slot reserves its box from the ratio, not
from the asset. A video whose poster frame is missing shows the same panel over
the video, naming the poster file, rather than a blank rectangle.

Both halves of the work are separate on purpose. The page declares the slot and
writes the caption now; the file lands later without touching the page beyond
one `src`.

## Ratios, and the size to shoot to

Shoot to the size in this table or larger, never smaller. Downsizing is free
and upsizing is not.

| Ratio | Shoot at | Use it for |
| --- | --- | --- |
| `21 / 9` | 3360 x 1440 px | a wide band across the page, landscape and rows |
| `16 / 9` | 3840 x 2160 px | every video, and wide stills of a room |
| `3 / 2` | 3000 x 2000 px | the default still, a person working |
| `4 / 3` | 4000 x 3000 px | interiors where the ceiling or the floor matters |
| `1 / 1` | 2400 x 2400 px | a detail: hands, a label, a screen |
| `4 / 5` | 2000 x 2500 px | portrait, which is what a phone screen wants |

## The slots

| Slot | Kind | Aspect | Shoot at | What has to be in the frame |
| --- | --- | --- | --- | --- |
| `home/xanic-cellar` | photo | `3 / 2` | 3000 x 2000 px | Monte Xanic, barrel room. The winemaker taking a reading with the tablet in hand, at the barrel, mid task. Not posed, not looking at the camera. |
| `home/xanic-tank-log` | video | `16 / 9` | 3840 x 2160 px | The same record being written at the tank: hand, tablet, tank in frame. Steady, tripod or a rested elbow, 8 to 12 seconds. |
| `home/phone-in-hand` | photo | `4 / 5` | 2000 x 2500 px | The same system on a phone, outdoors in the vineyard, screen legible in the frame. Portrait. |
| `xanic/before-clipboard` | photo | `3 / 2` | 3000 x 2000 px | The old way: the paper sheet or notebook at the work station where the reading is taken. No tablet in the frame. |
| `xanic/after-tablet` | photo | `3 / 2` | 3000 x 2000 px | The same station, same lens, same height, same light, with the tablet instead of the paper. The pair only works if the framing matches. |
| `xanic/harvest-intake` | video | `16 / 9` | 3840 x 2160 px | Intake at the scale during harvest: the load arrives, the weight is captured once. 8 to 12 seconds, loopable. |
| `winery/cellar` | photo | `3 / 2` | 3000 x 2000 px | Work in the cellar, the system present but not the subject. A person doing the job. |
| `winery/vineyard` | photo | `21 / 9` | 3360 x 1440 px | The vineyard as a band: rows, horizon, Valle light. This is the one wide establishing shot. |
| `winery/tasting-room` | photo | `4 / 3` | 4000 x 3000 px | The tasting room in use, a pour in progress, the room readable around it. |
| `enkanto/restaurant-pass` | photo | `3 / 2` | 3000 x 2000 px | The pass at service: a ticket going out, the screen or tablet in the working position. |
| `enkanto/front-desk` | photo | `3 / 2` | 3000 x 2000 px | Check in at the front desk, guest side of the counter visible. |
| `enkanto/room-charge` | video | `16 / 9` | 3840 x 2160 px | A restaurant charge being sent to the room: the tablet at the table, then the folio. 8 to 12 seconds. |

This table is not prose. It is the same list as `MEDIA_SLOTS` in
`components/site/Media.tsx`, which is the type a page's `slot` has to satisfy,
so a page cannot name a shot that is not on this list even with a computed
value or a spread: it does not compile. A test in
`components/site/Media.test.tsx` compares the two row for row in both
directions, so adding a slot means adding it here and there in the same change.

## Shooting notes

- Available light wherever possible. Cellars are dark, so bring fast glass
  rather than a flash: the site reads as quiet and a flash reads as a catalogue.
- Most slots are tinted toward the site palette, so do not lean on saturated
  colour to carry a shot. Composition and light have to work in a muted print.
- Screens in frame must show real work, never a demo, never lorem, never a
  screen saver. If a screen is unreadable at web size, get closer.
- People make the picture, but clear it first: written permission from anyone
  recognisable, and from the client for the premises and for anything of theirs
  on a screen. Record what you cleared in `docs/media-clearances.md`, never in
  this folder: `public/` is served to anyone who asks for it.
- Shoot the before and after pair in one visit, from one position. Coming back
  the next day to match a frame never works.
- Send a one line note with each file saying what is happening and when it was
  shot. The caption has to be true, and only you were there.

## Video

The video slots play muted, looping and inline. Playback is quiet autoplay on a
desktop while the slot is on screen, and a poster frame plus a tap on a phone.

A visitor who has asked for reduced motion is never autoplayed at, on any
device: the slot holds the poster frame. Their own press on the control still
plays, because reduced motion is a request not to be ambushed by movement and
not a request to be refused the footage, and taking the control away would be
the only way to make that visitor unable to see it at all. The rule is written
once, in `videoAction` in `components/site/Media.tsx`, and tested across every
combination of its inputs.

Assume nobody hears it and some people never see it move, which is why the
caption always states the point in words.

- 8 to 12 seconds, one continuous action, first and last frames close enough
  that the loop does not jump.
- Locked off or rested. No handheld drift, no zoom, no whip pan.
- No sound design needed. Audio is stripped on export.
- No burned in text, no lower thirds, no logo sting. The caption does that job
  and it has to work in two languages.

## Export and drop in

Photograph, from a full size export. The export width is the first number of
the slot's Shoot at column, so it follows the ratio and is never one fixed
number:

| Ratio | Export width |
| --- | --- |
| `21 / 9` | 3360 |
| `16 / 9` | 3840 |
| `3 / 2` | 3000 |
| `4 / 3` | 4000 |
| `1 / 1` | 2400 |
| `4 / 5` | 2000 |

```bash
# winery/cellar is 3 / 2, so W=3000. Read your own slot's width above.
W=3000
cwebp -q 80 -resize "$W" 0 shot.png -o winery/cellar.webp
```

Video, plus the poster frame taken from it. Every video slot is `16 / 9`, so
the video width is fixed at 1920 for delivery and the poster follows the same
frame:

```bash
ffmpeg -i source.mov -an -vf scale=1920:1080 -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -crf 23 -movflags +faststart xanic/harvest-intake.mp4
ffmpeg -i xanic/harvest-intake.mp4 -vframes 1 -q:v 2 /tmp/poster.png
cwebp -q 80 /tmp/poster.png -o xanic/harvest-intake-poster.webp
```

The poster frame is not optional. It is what a phone shows until the video is
tapped, and what a reduced-motion visitor sees until they press play. Either
way it is the frame a lot of people will only ever see, so choose it as you
would choose a still.

Budgets, because the pages are read on phone data in the Valle: under 400 KB
for a photograph, under 4 MB for a video, sRGB, no embedded colour profile
larger than the picture.

Then drop the file at its path and point the slot at it on the page. The panel
becomes the picture, in the same box, and the caption does not change.
