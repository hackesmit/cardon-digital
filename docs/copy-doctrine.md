<!--
  Landed by hq-4pu0q.1 from the staged note "cardon-copy-and-page-doctrine".
  Body below the rule is verbatim. Everything above it is the enforcement header.
-->

# The copy standard for this repo

This is the standard every copy and layout bead on this rig is checked against.
Read it before you write a word of site copy, and check your page before you
call a bead done:

    npm run copy:check -- home winery
    node scripts/copy-check.mjs --all

`scripts/copy-check.mjs` reads `lib/i18n/<page>.ts` and never edits it. It
extracts the string literals out of the `en` and `es` declarations, skips
object keys and comments, and checks each locale on its own.

## What the checker blocks, and what it only reports

Blocking (exit 1):

- Emphasis. At most three spans per locale, counting both of the markers
  `lib/i18n/rich.tsx` renders: `**x**` becomes a `<b>` and `__x__` becomes a
  coloured accent span. Counting only `**` would leave the rule one
  `sed 's/[*][*]/__/g'` away from being bypassed with the page still shouting.
  A marker left over after the spans are matched renders as literal asterisks or
  underscores, so it fails too, reported per string with that string's line.
- Definitional negative contrast. In English: `, not `, `not just`,
  `not another`, `never a`, and `not X but Y` in its general form. That last one
  is the headline tell, so the rule is general: any `not` or `n't`, then up to
  60 characters that do not cross a clause boundary, then `but`. "This is not
  software but certainty." and "It isn't a report but a decision." both fail.
  "We do not guess. But we do measure." does not, and neither does a `but` that
  is more than a clause away. In Spanish: `no es` or `no son` followed by an
  article or `otro` (`No es otra suscripcion`, `no son el precio de entrada`),
  plus `no solo`, `, sino `, `no otra` and `no otro`.
  Known limitation, deliberate and recorded rather than quietly carried: every
  multi-word shape is matched per extracted string, and a template substitution
  splits its string in two. So `This is not ${product} but certainty.` reads to
  the matcher as `This is not ` and ` but certainty.`, two unrelated fragments,
  and passes clean in both languages. Fixing it properly means matching across
  segment boundaries, which is a rewrite of the matcher rather than a patch. It
  is not being fixed because, checked rather than assumed, no locale declaration
  on any of the nine pages contains a substitution: the eight in the repo all
  sit in helper functions in `precios.ts`, outside what the extractor reads.
  The linter exists to catch Claudisms written without noticing, and those are
  written as plain literals. If you do write a substitution that straddles a
  banned shape, rewrite the sentence rather than route around the gate.
  The wider version of the same gap is worth knowing and is NOT theoretical:
  `precios.ts` assembles some sentences at runtime from dictionary parts
  (`${d.exampleLead} ${clause}.`), so the checker only ever sees those parts
  separately and can never see the sentence a visitor reads. No automated rule
  covers runtime-assembled copy. Read those assembled sentences by eye.
- More deliberate contrast than the allowlist allows. The cap is counted in
  occurrences, not in allowlist entries, so one allowlisted string cannot carry
  three contrasts through. One string reused across several dictionary entries
  is one editorial decision and counts once, however many times the page uses
  it; identical strings merge before the count.
- Em dashes. Zero, per the repo hook.
- Anything the extractor cannot read, at any depth. A locale declaration whose
  initializer is not a string, template, array or object literal fails loudly
  instead of counting zero words silently, and so does a value inside one.
  `body: buildCopy(x)`, an array entry, a shorthand `{ body }`, a backticked
  `` `${buildCopy(x)}` `` carrying no words of its own, and a `...spread` are
  all copy this checker cannot see. What is fine: numbers and booleans, which
  are not copy, and a reference to another declaration of the SAME locale in
  the same file (`intro: enIntro`, counted at its own declaration). A reference
  across locales is not, because it would read English under the Spanish rules.

Advisory (reported, never blocks): the word target, `rather than`, `instead of`,
and any `no es` or `no son` that is NOT followed by an article.

The word target is the one rule here that was demoted on purpose, by Daniel, on
escalation hq-9qqdm. The table at the top of the script still carries half of
what each locale measured on 2026-09-15, which is section 7 rule 1, and every
page is over it today. What changed is that being over it is a note instead of
an exit 1. It was blocking in both directions, and the pair had no green state:
a rewritten page came in far UNDER its line, which failed as a stale budget and
printed the lower number to write into the table, and writing that number failed
the unit test that pins every line to half of `measured`. No value of the table
satisfied both, and the file is owned by no rewrite bead. Half the words is
still the target, and it is carried where a human can judge the result: in each
rewrite bead's own Definition of Done. A checker should not claim a ratchet it
cannot enforce.

The rest are real tells that no lexical rule separates from honest prose.

- `instead of`: this doctrine's own worked example is the proof. "Close the till
  in four minutes instead of forty, and know the number is right" is the copy
  section 3 asks for, and a blocking rule would reject it.
- Bare `no es` and `no son`: this is ordinary Spanish negation, and blocking it
  blocks true statements this site has to be able to make. All three of these
  are live copy on the site today: "un gasto sin CFDI no es deducible" (a tax
  fact), "no es algo que la ley permita" (a legal fact), and "vista ilustrativa,
  no son datos de cliente" (the honesty disclaimer on a mock screenshot, which
  is exactly the kind of line this doctrine wants kept). Followed by an article
  the shape is definitional and blocks; bare it is reported, and the cost of
  that choice is real: "no es administracion. Es la unica forma" is a
  definitional contrast the blocking rule misses and only the advisory catches.

Read every advisory shape hit. Delete the ones that are defining a thing instead of
stating a fact or comparing two numbers.

## The deliberate contrast allowlist

A real contrast can be kept on purpose. `CONTRAST_ALLOWLIST` in the script takes
the exact string, one per page per locale, and the script exits 2 if a page ever
carries more than one. The exemption is in the diff where a reviewer sees it.
The cap is applied twice, because an entry is not the same thing as a contrast:
once to the entries when the config is read, and again to the OCCURRENCES those
entries exempt while the page is checked. One allowlisted line carrying two
contrasts is a violation naming the count, not a way to keep both. A contrast
is a stretch of words rather than a rule name, so two rules matching over the
same words ("It is not just a dashboard but a decision." trips `not just` and
`not X but Y`) stay one contrast.

The English shapes are precise where the Spanish ones are not, so this is where
an honest English line ends up when it happens to be shaped like a contrast:
"illustrative view, not client data" is the same disclaimer as its Spanish twin,
and it is a real `X, not Y`. Allowlist it rather than weakening `, not `.

## A note on the counts

Section 2 quotes word counts taken from the rendered pages. The checker reads
`lib/i18n` only, per this bead's constraints, so its numbers differ: it sees
dictionary keys that no component renders, and it cannot see the sentences
`precios` composes at runtime out of `lib/pricing.ts`. It does not count object
keys, which is why `precios` measures 66 words less than a naive read of the
file: its keys are machine slugs such as `"kitchen-screen"`, not copy. The
target table records what the checker measures, because that is the number a
rewrite is read against.

---

# Cardon Digital: copy and page doctrine

Source: Ogilvy on Advertising (David Ogilvy, 1983), Don't Make Me Think (Steve Krug,
3rd ed.), the avoid-ai-writing pattern catalogue (conorbronsdon, v3.35.0), and the
structural reference Daniel named, cabanapools.com.

This file is the standard every copy and layout bead on this rig is checked against.
It does not replace the existing claim rules in the cardon copy doctrine (policy voice,
no invented metrics, no advertising inexperience). Those still bind. This governs how
the true things get said.

## 1. What the two books actually teach

### Ogilvy: the words and the pictures

- Sell the result, never the mechanism. Ogilvy's own line is that people do not buy a
  drill, and the advertising that works names what the buyer ends up with. Positioning
  is decided before a word is written: what the thing does, and who for.
- The headline is most of the job. Five times as many people read the headline as read
  the body. Put the benefit in it. Put news in it. Never write a blind or clever
  headline that needs the body copy to make sense.
- Photographs beat drawings, and photographs of the product in use beat everything.
  Pictures that make the reader ask "what is going on here" pull hardest. Before and
  after is one of the strongest formats there is.
- Captions are read by twice as many people as body copy. Every photograph gets a
  caption, and every caption carries a benefit. A photo with no caption is wasted
  inventory. This is the single cheapest lift available on a photo-heavy site.
- Case histories and testimonials outperform claims. A named customer with real numbers
  beats any adjective you can write.
- Facts sell. Specifics sell. "The consumer is not a moron." Long copy is allowed when
  every paragraph earns its place, and forbidden when it is throat-clearing.
- Do not be a bore. You cannot bore people into buying. If it does not sell, it is not
  creative.
- Write the way you talk. Short words, short sentences, short paragraphs. No jargon, no
  superlatives, no generalities, no analogies the reader has to decode.
- Every page is a long term deposit into the brand's image. Consistency compounds.

### Krug: the structure and the layout

- First law: do not make me think. Every page is self-evident, or failing that,
  self-explanatory. The moment a visitor has to work out what something is, you have
  already lost part of them.
- People do not read pages, they scan them. They satisfice, taking the first plausible
  option rather than the best one. They muddle through and never learn how it works.
- So design for scanning: a clear visual hierarchy, conventions used rather than
  reinvented, obviously clickable things, the page broken into clearly defined areas,
  and the noise cut out.
- "Get rid of half the words on each page, then get rid of half of what is left."
  Happy talk and instructions die first. Happy talk is the welcoming paragraph that
  says nothing; nobody has ever read one.
- Billboard design 101: the page has to work at 60 miles an hour.
- The trunk test. Dropped on any page cold, a visitor must be able to answer: what site
  is this, what page am I on, what are the main sections, what can I do here, where am
  I in the scheme of things.
- The home page carries a job no other page can do: what is this, what can I do here,
  why here and not somewhere else. It must survive everyone's pet content trying to
  colonise it.
- Do not squander goodwill. Hiding the price, hiding the phone number, asking for
  information you do not need, and looking amateurish all spend goodwill you cannot
  buy back.
- Stop arguing about what users like. Test with a few real people, early and often.
  Watching one person use the thing settles arguments that a room full of opinions
  cannot.
- On phones the same laws apply with less room and weaker affordances, so clickability
  has to be more obvious, not less. Do not amputate content for mobile.

### Where they meet

Krug decides what goes where and how little of it there is. Ogilvy decides what the
surviving words say and what the pictures do. Krug gets the visitor to the right block
in four seconds; Ogilvy makes that block sell. Neither of them would leave a 1,300 word
home page standing.

## 2. What is wrong with the site today (measured, not asserted)

Counts below are over lib/i18n, both locales combined, so halve for per-language.

    page          words   bold spans
    home           2670          34
    winery         3401          35
    monte-xanic    2620          32
    enkanto        4682          32
    modulos        5750          32
    precios        3440          27

- Volume. The home page runs about 1,335 words per language. Cabana's runs a few
  hundred. Krug's "half, then half again" applied twice to our home page lands near 330.
- Bold as a substitute for hierarchy. 34 bold spans on one page. avoid-ai-writing flags
  bold overuse at P1 and it is the loudest machine tell on the site. If everything is
  emphasised nothing is.
- Negative definition, the "X, not Y" tic. 37 instances of rather than / instead of /
  never a / not another in the English, 56 "no es / no son / no otra" shapes in the
  Spanish, plus dozens of "A, not B" clauses. This is the single most recognisable
  Claudism in the copy and Daniel named it unprompted.
- Feature-first ordering. The home page runs hero, value, tools, demand, compare,
  sectors, pricing, diagnostic. The Monte Xanic case study is buried in section six,
  inside a map. The strongest asset on the site is the hardest thing to reach.
- Mechanism language where result language belongs. "One data warehouse: every channel,
  file and system combined into clean, organized fields." That is what we build. It is
  not what they buy.
- Uniform paragraph rhythm. Nearly every block is three to five lines of even length.
  Human writing is lumpy.
- No photography. public/media holds two images. The whole site argues in prose where
  it should be showing the product on a winery floor.

Note on tooling: running the avoid-ai-writing detector over the extracted strings
returns "minimal AI signals" and a HUMAN_ONLY classification. That is a true negative on
vocabulary, which earlier passes already cleaned, and a false sense of safety. The
detector scores words. Our problem is structural: volume, bold, negative definition,
and feature-first order. Use the detector as a floor, never as the pass mark.

## 3. The rules

### Results, not software

Every claim gets written as what the owner ends up with. The mechanism is allowed to
appear once, downstream, as the answer to "how". Worked examples:

    before  One warehouse of your numbers, and it is yours.
    after   You stop arguing about which spreadsheet is right.

    before  Every booking from every channel in one calendar.
    after   Fill the rooms that sat empty because two calendars disagreed.

    before  The point of sale, from the waiter's phone to the cash cut.
    after   Close the till in four minutes instead of forty, and know the number is right.

The constraint that survives from the existing doctrine: we do not invent the
percentage. No "30% more bookings" until a real case produces it. Write the shape of
the result in the customer's own words and let Monte Xanic supply the numbers. A
fabricated specific is worse than the vague phrasing it replaces.

### Banned constructions

- "X, not Y" and "not just X, but Y" as a way of defining something. Say what it is.
  One deliberate contrast per page, maximum, and only where the contrast is the point.
- Bold for emphasis in body copy. Bold survives only where it is a real label. Target:
  at most three bold spans per page, down from thirty-four.
- The rule of three as a default rhythm. Vary the count.
- Copula avoidance: serves as, features, boasts, enables, leverages, delivers.
- Transition openers: Moreover, Furthermore, Additionally, What is more.
- Happy talk. Any paragraph that would survive being deleted gets deleted.
- Em dashes, per the repo hook. Plain hyphens and full stops.
- Abstract nouns doing the work of verbs: visibility, alignment, clarity, insight,
  transformation, ecosystem, journey, solution, seamless, robust, comprehensive.

### Required moves

- Every photograph and every video gets a caption, and the caption carries the result,
  not the location. "Corte de caja at 11:40pm, done from the phone" beats "Our system
  in use at a Valle restaurant."
- Every section headline states a benefit or a fact. No label headings like "Tools" or
  "Our approach".
- Sentence length varies on purpose. Short sentences are allowed to be very short.
- Second person throughout. Su bodega, your floor. No first person singular anywhere:
  the source has no author voice and the rewrite must not invent one.
- Numbers wherever a number is true and ours to publish.
- One primary call to action per page, repeated verbatim after each major block, the
  same words every time.
- Spanish is written natively for a Valle winemaker and is the authoritative version.
  English is written natively for a US owner. Neither is a translation of the other.

### The four-second test (Krug's trunk test, our version)

Any page, opened cold on a phone, must answer without scrolling:
what this is, what it gets me, who already uses it, and what to do next.
A bead that changes a page and leaves any of those four unanswered is not done.

## 4. Home page architecture

Current order: hero, value, tools, demand, compare, sectors, pricing, diagnostic.

Proposed order, with Monte Xanic moved to the top per Daniel's direction and the
Cabana structure as the skeleton:

    1  Hero            Result headline, one concrete sub, one CTA, one risk reducer
                       line. Behind it: video of the product in use in a winery.
    2  Proof bar       Monte Xanic and En'kanto named, with the real numbers we have.
                       Immediately visible, the way Cabana puts 4.9 and 5,000 pools
                       above the fold.
    3  Case study      Monte Xanic, the first real section. Photographs, before and
                       after, the numbers, a link to the full case.
    4  Sound familiar  Three objections in the owner's own voice, each answered in one
                       line. Cabana's strongest block and the one Ogilvy would keep.
    5  What you get    Three result blocks, each anchored to a photo or a live demo
                       board, not to a paragraph. This is where Produccion,
                       Hospitalidad and Restaurante appear, named by outcome first.
    6  How it works    Three numbered steps. Short.
    7  Compare         The existing table, converted from prose cells to scannable
                       marks. Cabana's version is a tick and a cross; ours can be
                       tighter than prose without losing the policy voice.
    8  Pricing         Unchanged in substance. Price stays visible; hiding it spends
                       goodwill (Krug) and we already decided policy voice (doctrine).
    9  Diagnostic      The CTA block, verbatim the same words as the hero CTA.

Everything currently in tools and demand either compresses into block 5 or moves to
its own page. The home page is not where the data warehouse gets explained.

## 5. Demos and motion

The current module boards (components/pages/modulos/ModuleScreen.tsx) are static SVG:
a lot table, a calendar grid, and nine circles on a floor. The circles are the thing
Daniel called out. They light on hover and nothing else happens.

The standard already existed in this repo and was deleted, not lost. Commit 1fcb7e7
("focus the site on the three areas") removed six canvas visuals:

    918 lines   components/pages/restaurants/FloorPlan.tsx
   1016 lines   components/pages/clinics/ClinicSchedule.tsx
   1107 lines   components/pages/hiring/PipelineStage.tsx
    734 lines   components/pages/construction/SitePlanVisual.tsx
    687 lines   components/pages/construction/FleetMap.tsx
    474 lines   components/pages/home/OpsCompression.tsx

FloorPlan.tsx is the one Daniel remembers: a dining room filling across one service,
17:00 to 23:00, reservations arriving as chips that dock onto tables, tables warming as
they seat and cooling as they turn, a covers load line, and a marker an hour before the
rush. Canvas, rAF, DPR capped at 2, paused by IntersectionObserver and by document
visibility, palette read live from the theme tokens so it recolours with the mode, and
resolved to a static peak-service snapshot under reduced motion. It is genuinely good
work and it recovers with `git show 1fcb7e7^:<path>`.

Rebuild rules for all three module demos:

- Recover FloorPlan.tsx as the Restaurante demo and the reference implementation.
- Build Produccion and Hospitalidad to that same standard: a real process playing out
  over time on canvas, not a static board with hover states. Produccion is the cellar
  filling and the Brix curve climbing across a harvest. Hospitalidad is the calendar
  filling across a fortnight, with the direct bookings arriving in a different colour
  from the OTA ones, because that difference is the sale.
- Every demo reads its palette from the theme tokens the way FloorPlan does, so it is
  the same site, not an embedded product screenshot.
- Light mode is the default and the demos must be designed in light mode first. The
  site already ships data-mode="light" on the shell, so this is about designing against
  the light palette rather than treating it as the fallback.
- 100 percent mobile. Each demo needs a phone layout that is a real design, not a
  scaled-down desktop canvas. Touch, not hover, drives any interaction.
- prefers-reduced-motion resolves to a meaningful static frame, as FloorPlan already
  does.
- Every demo carries the honest label the case visuals carry: the data is invented.

## 6. Media

Daniel supplies the photography and video: the modules in use in wineries,
restaurants and hospitality. The build needs the slots ready before the media lands.

- Define one media component with a caption slot that is required, not optional, so an
  uncaptioned photo cannot ship.
- Every slot declares its aspect ratio and reserves the space, so nothing reflows when
  the real asset drops in.
- Placeholders are neutral and obviously placeholder. They never ship to production
  looking like a real photo.
- Video: muted, looping, autoplay on desktop, poster frame plus tap to play on mobile,
  and never the only carrier of a claim.
- public/media/CREDITS.md keeps its record.

## 7. Definition of done for any copy bead

1. Word count for the page is at most half what it was, per language.
2. Bold spans on the page: three or fewer.
3. Zero "X, not Y" definitional constructions, checked by grep.
4. Every photograph and video slot has a caption carrying a result.
5. The four-second test passes on a 390px viewport.
6. Spanish and English both read as written natively. Neither is a translation.
7. No claim appears that is not already true and already ours to publish.
8. avoid-ai-writing detector run over the page's extracted strings, reported, not
   treated as the pass mark.
9. No file under `components/pages/` is gone that was there at the merge base, unless
   `RETIRED` in scripts/visuals-check.mjs carries it with Daniel's approval and a date.
   Run `npm run copy:check`, which checks this first. Section 8 is the rule.

## 8. A copy bead never deletes a visual (binding)

Daniel, 2026-09-15, after reading the rebuilt home page: "seems like there was a serious
downgrade in UI design from the original animations for each field on the site and the
ones presented now." He was right, and the fault was in how the beads were written, not
in the workers. This section is the rule that came out of it. It binds every copy bead,
and it overrides anything in a bead description that implies otherwise.

1. **A copy bead never deletes a visual.** If a canvas component, an animated SVG or a
   motion wrapper reads dictionary keys the new architecture removes, you rewire the
   visual to the new keys. Where the visual needs a key the new dictionary does not
   have, you add the key.
2. **"No other page imports it" is not a reason to delete it.** The motion work is the
   asset. The dictionary key that happened to feed it is not.
3. **Retiring any animation is Daniel's decision alone.** Not a worker's, not a
   reviewer's, and not a consequence of a typecheck failing. A bead that believes a
   visual should go files the question and leaves the visual in.
4. **A Media slot never replaces an animation.** The photography does not exist yet, so
   a slot in an animation's place renders as a pending placeholder: that is a downgrade
   rather than a trade. Media slots belong in the case, proof and what-you-get blocks,
   beside the motion, never instead of it.
5. **The words come down; the motion does not.** Halving a page's words is a prose
   operation. The strings a visual cannot run without (labels, legends, accessible
   names, the noscript fallback) are its working parts, so they are counted and
   reported apart from prose rather than trimmed to hit a budget. On this repo they
   live under the page dictionary's `vis` key for exactly that reason.

### The mechanism

A rule with no mechanism is not captured, so this one is runnable:

    node scripts/visuals-check.mjs        # or: npm run copy:check, or npm test

It runs inside `node scripts/copy-check.mjs <page>` as well, because that is the command
every copy bead's Definition of Done names, and a guard wired only into a sibling script
is voluntary: measured on hq-4pu0q.3, with all four home visuals deleted, that command
printed "1 page(s) clean" and exited 0. The guard prints nothing there when it is happy.

It compares `components/pages/` at the merge base with the default branch against the
working tree. **It measures substance, not existence.** A visual can lose everything it
was without losing its path, and a guard that asks whether a FILE is there cannot guard a
VISUAL: review s-48db ran thirteen deletion shapes through the first version of this
check and seven exited 0, every one of them keeping a path, or a file, or a line count,
and none of them keeping the drawing. So each visual is read as a set of faculties and
compared with what it had:

| Faculty | What it counts | Fails when |
| --- | --- | --- |
| body | source with comments and whitespace removed | it is empty, or under a third of what it was |
| markup | JSX and SVG opening tags | none left, or under a third of them |
| paint | the operations that put ink on a `<canvas>` and the path calls that shape it | none left, or under a third |
| canvas | `getContext`, taking a drawing surface at all | none left |
| motion | the animation drivers, counted **one kind at a time** | any kind that was there is at zero |

`fillStyle` and `globalAlpha` are deliberately not paint. They are settings, not drawing,
and counting them lets a canvas keep half its score while drawing nothing.

Everything but the line count is read off comment-stripped source, because commenting a
component out keeps its tags, its frames and its line count and renders nothing.

Four things decide WHERE a visual is measured, which is the other half of the rule:

1. **The path left the tree.** A set difference on paths rather than a diff filter, so a
   deletion dressed as a `git mv` out of the tree fails the same way a plain `rm` does,
   staged or not.
2. **Still here means still in the repository.** The working tree is read from disk, so
   an unstaged `rm` is a deleted visual. But a file on disk and out of the index is gone
   from every clone and every other worktree: `git rm --cached` plus a `.gitignore` line
   is a deletion that only the machine running the check cannot see.
3. **A move inside the tree is not a deletion, if the destination is somewhere a visual
   can live.** A path that left is matched against the paths that arrived by shared
   source lines, at git's own 50 percent rename threshold. The destination has to be a
   file the build compiles, so `SectorMap.tsx.bak` and `SectorMap.old.txt` are parking
   spaces and not moves; and a deletion already recorded in the index needs an arrival
   the index records too, so a committed removal cannot be excused by an untracked file
   nobody else will ever get. An unstaged `cp` then `rm` still passes, because that is
   how a move gets made by hand.
4. **A move is then measured at its destination.** Renaming is not a discount. Stripping
   every markup line out of a component scores 84 percent on shared lines, because a 300
   line component is only 49 lines of markup, and the first version of this check passed
   it while failing the identical content left under its own name.

A faculty that turns up in another file under the same tree MOVED rather than died, and
is a note: extracting a drawing into a helper takes paint to zero in the file that had it
and loses nothing. The lines have to actually still be there, and be new there, so a line
four other visuals already have vouches for nothing. They also have to be somewhere the
visual can still BE a visual, which is the same pair of tests a rename has to pass: a
file the build compiles, and a file the index records. A copy parked as `SectorMap.old
.txt`, or an untracked sibling nobody else will ever get, is a parking space and not the
drawing's new home. Without that pair the counterweight excused the gutting it exists to
distinguish, and said so in its own output. Anything short of a failure, a
faculty down but not collapsed, is a shrink note that never blocks, because a visual can
legitimately get smaller and a guard that argues with every rewrite gets deleted.

Shrink notes are measured on every faculty and not just the line count, and they read the
faculty first: a visual can lose two thirds of its elements while the file gets four lines
shorter, and the band that passes must not pass in silence.

Every failure names the file, its line count at the base and every faculty it lost, since
the line count is what got noticed, and says to rewire rather than delete. `VISUALS_BASE`
overrides the baseline and announces itself on stderr when it does, because a baseline of
`HEAD` passes anything and a receipt that does not say so looks identical to one that ran.

What it cannot do, said plainly so nobody reads more into a green run than is there: it
reads source as TEXT and cannot tell live code from dead code. A body kept as an uncalled
function with a stub exported in its place, or paint calls aimed at a no-op object, keep
every faculty while nothing renders, and this check stays quiet. Closing that class means
asking the BUILD what renders rather than asking the source what it says, which is a
different measurement with its own Definition of Done: hq-4pu0q.23.

Two controls, both runnable. Replayed over the last fourteen commits of this repo, each
against its own parent, it fires exactly once: on 11d43c3, the commit that deleted the
four home visuals. And s-48db's thirteen adversarial cases plus thirteen more, in
`state/review/s-45d8/adversarial.sh`, all behave: every deletion shape exits 1, and the
clean tree, the `git mv`, the unstaged `cp` then `rm`, a move into a new subdirectory and
a real rewrite that keeps the drawing all exit 0.

The escape hatch is the rule, written down. `RETIRED` in that script is a list of exact
paths, each with the date and the reason Daniel approved it. Adding an entry is how a
visual is retired, and the entry is what a reviewer reads, and it covers that path being
emptied, gutted or stilled as well as removed. An entry that no longer matches a removed file is
reported as stale, so the list cannot quietly grow.
