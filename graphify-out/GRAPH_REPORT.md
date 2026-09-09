# Graph Report - cardon-digital  (2026-09-08)

## Corpus Check
- 127 files · ~143,636 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 742 nodes · 1578 edges · 50 communities (41 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `acdeb1d1`
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

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 40 edges
2. `rich()` - 37 edges
3. `Locale` - 32 edges
4. `pageMetadata()` - 31 edges
5. `localePath()` - 30 edges
6. `useDict()` - 28 edges
7. `site` - 21 edges
8. `quote` - 16 edges
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

## Communities (50 total, 9 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.08
Nodes (44): buildHots(), ColorKey, Hot, Layout, Series, SeriesKey, seriesValAt(), ThreeLines() (+36 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.15
Nodes (12): FloorPlan(), Geo, Palette, READOUTS, Reservation, RGB, Table, TableKind (+4 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (26): AddOn, AddOnId, addOns, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleS (+18 more)

### Community 4 - "package.json"
Cohesion: 0.17
Nodes (12): bundleLines(), ModuleFloors(), en, es, precios, BundleItem, currencyByLocale, formatAmount() (+4 more)

### Community 5 - "FleetMap.tsx"
Cohesion: 0.15
Nodes (13): FleetMap(), LogRow, NODES, Pt, Pulse, RGB, ROADS, ROUTES (+5 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 7 - "PipelineStage.tsx"
Cohesion: 0.11
Nodes (20): capGlyphs, generateMetadata(), HiringPage(), localeOf(), Params, Cand, FrameCard, Geom (+12 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (37): autoprefixer, lenis, next, next-view-transitions, dependencies, lenis, next, next-view-transitions (+29 more)

### Community 9 - "layout.tsx"
Cohesion: 0.28
Nodes (10): generateMetadata(), routes, sitemap(), Nav(), localePath(), locales, ogLocale, otherLocale() (+2 more)

### Community 10 - "page.tsx"
Cohesion: 0.08
Nodes (49): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+41 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.18
Nodes (18): buildOnly(), bundleHours(), ceilTo(), featureHours(), featureOf(), floorFor(), growerBundleHours(), growerSetupS() (+10 more)

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
Cohesion: 0.11
Nodes (35): ConsentGate(), ConversionListeners(), countedOnSubmit(), DESTINATIONS, kindFromAttribute(), submitsACountedForm(), MeasurementScripts(), ADS_ID (+27 more)

### Community 27 - "validate.ts"
Cohesion: 0.09
Nodes (33): fail(), JSON_HEADERS, POST(), BoundedBody, readBoundedText(), bodyFor(), buildEmail(), deliver() (+25 more)

### Community 28 - "useDict"
Cohesion: 0.08
Nodes (23): AboutPage(), generateMetadata(), localeOf(), Params, about, AboutDict, en, es (+15 more)

### Community 32 - "page.tsx"
Cohesion: 0.22
Nodes (9): generateMetadata(), localeOf(), MonteXanicCaseStudy(), Params, CaseFact, CaseFacts(), PlayOnceVis(), PlayOnceVisProps (+1 more)

### Community 33 - "page.tsx"
Cohesion: 0.15
Nodes (14): generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames(), showcaseEnabled() (+6 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.11
Nodes (19): absorbedProviderCash(), combinations, legacyWineryBundles, legacyWinerySetupFloor(), scopeFactor, sizes, allSizes, LineCase (+11 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.22
Nodes (13): line(), addOnAvailable(), addOnMonthly(), addOnOf(), annualPrepay, bumpOffBareMultiple(), featureSetup(), round100() (+5 more)

### Community 36 - "localePath"
Cohesion: 0.24
Nodes (11): LocaleLayout(), generateMetadata(), localeOf(), Params, PreciosPage(), isLocale(), localeFromCountry(), localeFromPath() (+3 more)

### Community 37 - "page.tsx"
Cohesion: 0.18
Nodes (11): CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS, RGB, VineyardMap(), en (+3 more)

### Community 38 - "bundleHours"
Cohesion: 0.43
Nodes (5): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, SpotlightFrames()

### Community 39 - "ClinicSchedule.tsx"
Cohesion: 0.14
Nodes (13): Cell, Channel, Chip, ChipState, ClinicSchedule(), Geo, Palette, RGB (+5 more)

### Community 40 - "SitePlanVisual.tsx"
Cohesion: 0.16
Nodes (12): ChipPlace, Conf, DESKTOP_CONF, PORTRAIT_CHIPS, PORTRAIT_CONF, PORTRAIT_LEADERS, PORTRAIT_PLOTS, SitePlanVisual() (+4 more)

### Community 41 - "useDict"
Cohesion: 0.23
Nodes (9): ConsentBanner(), BerryToBottleDesktop(), BerryToBottleMobile(), AssistantDemo(), BARS, CITED_ROW, LocaleContext, LocaleProvider() (+1 more)

### Community 42 - "Locale"
Cohesion: 0.27
Nodes (8): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), PricingBundles(), SpotlightFrames(), winery

### Community 43 - "VineField.tsx"
Cohesion: 0.17
Nodes (10): Geom, Pt, RGB, Source, SourceKind, Trace, VineField(), en (+2 more)

### Community 44 - "pageMetadata"
Cohesion: 0.29
Nodes (9): generateMetadata(), localeOf(), Params, PrivacyPage(), generateMetadata(), localeOf(), Params, TermsPage() (+1 more)

### Community 45 - "SiteShell.tsx"
Cohesion: 0.16
Nodes (11): metadata, ContourField(), Footer(), NotFoundBody(), SiteShell(), archivo, htmlLang, en (+3 more)

### Community 46 - "page.tsx"
Cohesion: 0.36
Nodes (6): ClinicsPage(), generateMetadata(), localeOf(), Params, SpotlightFrames(), SpotlightFramesProps

### Community 47 - "page.tsx"
Cohesion: 0.36
Nodes (6): capGlyphs, ConstructionPage(), generateMetadata(), localeOf(), Params, SpotlightFrames()

### Community 48 - "page.tsx"
Cohesion: 0.33
Nodes (7): generateMetadata(), localeOf(), ModulosPage(), Params, BridgeMap(), label, Locale

### Community 49 - "page.tsx"
Cohesion: 0.43
Nodes (5): generateMetadata(), localeOf(), Params, RestaurantsPage(), SpotlightFrames()

## Knowledge Gaps
- **289 isolated node(s):** `Params`, `Params`, `Params`, `DOORS`, `Params` (+284 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `page.tsx` to `page.tsx`, `package.json`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `layout.tsx`, `page.tsx`, `validate.ts`, `useDict`, `page.tsx`, `page.tsx`, `localePath`, `bundleHours`, `useDict`, `Locale`, `pageMetadata`, `SiteShell.tsx`, `page.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `localePath` to `page.tsx`, `page.tsx`, `ClinicSchedule.tsx`, `PipelineStage.tsx`, `bundleHours`, `layout.tsx`, `page.tsx`, `Locale`, `pageMetadata`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `validate.ts`, `useDict`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `useDict()` connect `useDict` to `canvasKit.ts`, `FloorPlan.tsx`, `FleetMap.tsx`, `page.tsx`, `ClinicSchedule.tsx`, `SitePlanVisual.tsx`, `PipelineStage.tsx`, `VineField.tsx`, `middleware.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `Params`, `Params`, `Params` to the rest of the system?**
  _289 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08220211161387632 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07389162561576355 - nodes in this community are weakly interconnected._