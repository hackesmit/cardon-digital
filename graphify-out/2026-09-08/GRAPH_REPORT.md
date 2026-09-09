# Graph Report - cardon-digital  (2026-09-08)

## Corpus Check
- 127 files · ~149,121 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 758 nodes · 1632 edges · 55 communities (46 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74a361d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- canvasKit.ts
- compilerOptions
- FloorPlan.tsx
- page.tsx
- package.json
- FleetMap.tsx
- ClinicSchedule.tsx
- PipelineStage.tsx
- devDependencies
- layout.tsx
- page.tsx
- Agent Instructions
- Project Instructions for AI Agents
- SitePlanVisual.tsx
- Beads - AI-Native Issue Tracking
- page.tsx
- Cardon Digital
- Beads
- page.tsx
- page.tsx
- middleware.ts
- sitemap.ts
- post-checkout
- post-merge
- measurement-proof.mjs
- validate.ts
- useDict
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- page.tsx
- page.tsx
- VineField.tsx
- SitePlanVisual.tsx
- localePath
- page.tsx
- bundleHours
- ClinicSchedule.tsx
- SitePlanVisual.tsx
- useDict
- Locale
- VineField.tsx
- pageMetadata
- SiteShell.tsx
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- rich.tsx
- page.tsx
- about.ts
- enkanto.ts
- showcase.ts

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 40 edges
2. `rich()` - 37 edges
3. `Locale` - 32 edges
4. `pageMetadata()` - 31 edges
5. `localePath()` - 30 edges
6. `useDict()` - 28 edges
7. `site` - 21 edges
8. `quote` - 20 edges
9. `Reveal()` - 15 edges
10. `compilerOptions` - 15 edges

## Surprising Connections (you probably didn't know these)
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `FloorPlan()` --calls--> `useDict()`  [EXTRACTED]
  components/pages/restaurants/FloorPlan.tsx → lib/i18n/LocaleProvider.tsx
- `Footer()` --calls--> `localePath()`  [EXTRACTED]
  components/site/Footer.tsx → lib/i18n/config.ts
- `NotFoundBody()` --calls--> `localePath()`  [EXTRACTED]
  components/site/NotFoundBody.tsx → lib/i18n/config.ts
- `localeOf()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/about/page.tsx → lib/i18n/config.ts

## Import Cycles
- None detected.

## Communities (55 total, 9 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.10
Nodes (40): buildHots(), ColorKey, Hot, Layout, Series, SeriesKey, seriesValAt(), ThreeLines() (+32 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.15
Nodes (12): FloorPlan(), Geo, Palette, READOUTS, Reservation, RGB, Table, TableKind (+4 more)

### Community 3 - "page.tsx"
Cohesion: 0.08
Nodes (27): AddOn, addOns, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleS, growerCatalogue (+19 more)

### Community 4 - "package.json"
Cohesion: 0.24
Nodes (9): bundleLines(), ModuleFloors(), BundleItem, currencyByLocale, formatAmount(), formatPrice(), moduleFloors, ModuleId (+1 more)

### Community 5 - "FleetMap.tsx"
Cohesion: 0.07
Nodes (31): capGlyphs, ConstructionPage(), generateMetadata(), localeOf(), Params, FleetMap(), LogRow, NODES (+23 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 7 - "PipelineStage.tsx"
Cohesion: 0.13
Nodes (14): Cand, FrameCard, Geom, Parked, PipelineStage(), Pt, RosterEntry, Sample (+6 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (37): autoprefixer, lenis, next, next-view-transitions, dependencies, lenis, next, next-view-transitions (+29 more)

### Community 9 - "layout.tsx"
Cohesion: 0.18
Nodes (18): generateMetadata(), LocaleLayout(), routes, sitemap(), Showcase(), PricingBundles(), Nav(), isLocale() (+10 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (42): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+34 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.14
Nodes (23): addOnAvailable(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), ceilTo(), featureHours(), featureOf() (+15 more)

### Community 12 - "Project Instructions for AI Agents"
Cohesion: 0.17
Nodes (11): Agent Context Profiles, Agent Instructions, Beads Issue Tracker, Beads Issue Tracker, Non-Interactive Shell Commands, Quick Reference, Quick Reference, Quick Reference (+3 more)

### Community 13 - "SitePlanVisual.tsx"
Cohesion: 0.20
Nodes (9): Agent Context Profiles, Architecture Overview, Beads Issue Tracker, Build & Test, Conventions & Patterns, Project Instructions for AI Agents, Quick Reference, Rules (+1 more)

### Community 14 - "Beads - AI-Native Issue Tracking"
Cohesion: 0.22
Nodes (8): Beads - AI-Native Issue Tracking, Essential Commands, Get Started with Beads, Learn More, Quick Start, What is Beads?, Why Beads?, Working with Issues

### Community 15 - "page.tsx"
Cohesion: 0.20
Nodes (9): Cardon Digital, Environment flags, Layout, License, Pre-launch gate, Running locally, Scripts, Stack (+1 more)

### Community 16 - "Cardon Digital"
Cohesion: 0.29
Nodes (6): Beads, Core CLI Workflow, First Step, Preferred Route, Rules, What Belongs In Beads

### Community 17 - "Beads"
Cohesion: 0.50
Nodes (3): enkanto-valle.webp, Media credits, valle-vineyard.webp

### Community 21 - "middleware.ts"
Cohesion: 0.13
Nodes (31): ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts(), ADS_ID (+23 more)

### Community 27 - "validate.ts"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 28 - "useDict"
Cohesion: 0.29
Nodes (6): CombinaItem, en, es, ModuleCopy, modulos, ModulosDict

### Community 32 - "page.tsx"
Cohesion: 0.29
Nodes (7): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, PlayOnceVis(), PlayOnceVisProps, SpotlightFrames()

### Community 33 - "page.tsx"
Cohesion: 0.21
Nodes (9): generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames(), showcaseEnabled() (+1 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.09
Nodes (22): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), modules, ModuleSelection, scopeFactor (+14 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.31
Nodes (10): line(), addOnMonthly(), annualPrepay, bumpOffBareMultiple(), round100(), runCost(), runCostBreakdown(), serviceLineMonthly() (+2 more)

### Community 36 - "localePath"
Cohesion: 0.22
Nodes (15): MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence(), mixRules() (+7 more)

### Community 37 - "page.tsx"
Cohesion: 0.18
Nodes (11): CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB, VineyardMap(), en (+3 more)

### Community 38 - "bundleHours"
Cohesion: 0.29
Nodes (7): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, CaseFact, CaseFacts(), SpotlightFrames()

### Community 39 - "ClinicSchedule.tsx"
Cohesion: 0.14
Nodes (13): Cell, Channel, Chip, ChipState, ClinicSchedule(), Geo, Palette, RGB (+5 more)

### Community 40 - "SitePlanVisual.tsx"
Cohesion: 0.27
Nodes (8): generateMetadata(), localeOf(), Params, TermsPage(), en, es, terms, TermsDict

### Community 41 - "useDict"
Cohesion: 0.27
Nodes (7): ConsentBanner(), BerryToBottleDesktop(), BerryToBottleMobile(), consent, LocaleContext, LocaleProvider(), useDict()

### Community 42 - "Locale"
Cohesion: 0.36
Nodes (6): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), SpotlightFrames()

### Community 43 - "VineField.tsx"
Cohesion: 0.25
Nodes (7): Geom, Pt, RGB, Source, SourceKind, Trace, VineField()

### Community 44 - "pageMetadata"
Cohesion: 0.27
Nodes (8): generateMetadata(), localeOf(), Params, PrivacyPage(), en, es, privacy, PrivacyDict

### Community 45 - "SiteShell.tsx"
Cohesion: 0.16
Nodes (11): metadata, ContourField(), Footer(), NotFoundBody(), SiteShell(), archivo, htmlLang, en (+3 more)

### Community 46 - "page.tsx"
Cohesion: 0.36
Nodes (6): ClinicsPage(), generateMetadata(), localeOf(), Params, SpotlightFrames(), SpotlightFramesProps

### Community 47 - "page.tsx"
Cohesion: 0.28
Nodes (7): AssistantDemo(), BARS, CITED_ROW, en, es, winery, WineryDict

### Community 48 - "page.tsx"
Cohesion: 0.33
Nodes (7): generateMetadata(), localeOf(), ModulosPage(), Params, BridgeMap(), label, Locale

### Community 49 - "page.tsx"
Cohesion: 0.17
Nodes (17): AboutPage(), generateMetadata(), localeOf(), Params, generateMetadata(), localeOf(), Params, RestaurantsPage() (+9 more)

### Community 50 - "rich.tsx"
Cohesion: 0.25
Nodes (6): ConsentDict, en, es, Dict, inline(), RichOptions

### Community 51 - "page.tsx"
Cohesion: 0.36
Nodes (6): capGlyphs, generateMetadata(), HiringPage(), localeOf(), Params, SpotlightFrames()

### Community 52 - "about.ts"
Cohesion: 0.40
Nodes (4): about, AboutDict, en, es

### Community 53 - "enkanto.ts"
Cohesion: 0.40
Nodes (4): en, enkanto, EnkantoDict, es

### Community 54 - "showcase.ts"
Cohesion: 0.40
Nodes (4): en, es, ShowcaseDict, ShowcaseModule

## Knowledge Gaps
- **287 isolated node(s):** `Params`, `Params`, `Params`, `DOORS`, `Params` (+282 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `page.tsx` to `page.tsx`, `package.json`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `layout.tsx`, `page.tsx`, `validate.ts`, `page.tsx`, `page.tsx`, `localePath`, `bundleHours`, `SitePlanVisual.tsx`, `useDict`, `Locale`, `pageMetadata`, `SiteShell.tsx`, `page.tsx`, `page.tsx`, `rich.tsx`, `page.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `layout.tsx` to `page.tsx`, `page.tsx`, `FleetMap.tsx`, `ClinicSchedule.tsx`, `bundleHours`, `SitePlanVisual.tsx`, `page.tsx`, `Locale`, `pageMetadata`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `validate.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `useDict()` connect `useDict` to `canvasKit.ts`, `FloorPlan.tsx`, `FleetMap.tsx`, `page.tsx`, `PipelineStage.tsx`, `ClinicSchedule.tsx`, `VineField.tsx`, `page.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _287 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09528214616096208 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07586206896551724 - nodes in this community are weakly interconnected._