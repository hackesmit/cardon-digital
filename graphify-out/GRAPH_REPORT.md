# Graph Report - cardon-digital  (2026-09-09)

## Corpus Check
- 121 files · ~123,312 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 703 nodes · 1554 edges · 43 communities (32 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8fdb08c1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- canvasKit.ts
- compilerOptions
- FloorPlan.tsx
- page.tsx
- priced
- ModuleScreen.tsx
- ClinicSchedule.tsx
- localePath
- devDependencies
- Locale
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
- page.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- page.tsx
- page.tsx
- VineField.tsx
- SitePlanVisual.tsx
- localePath
- page.tsx
- page.tsx
- BridgeMap.tsx
- PlayOnceVis.tsx
- .eslintrc.json
- SiteShell.tsx

## God Nodes (most connected - your core abstractions)
1. `Locale` - 36 edges
2. `rich()` - 35 edges
3. `isLocale()` - 32 edges
4. `localePath()` - 32 edges
5. `pageMetadata()` - 23 edges
6. `quote` - 20 edges
7. `site` - 17 edges
8. `Reveal()` - 15 edges
9. `compilerOptions` - 15 edges
10. `useDict()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `sitemap()` --calls--> `localePath()`  [EXTRACTED]
  app/sitemap.ts → lib/i18n/config.ts
- `rich()` --indirect_call--> `line()`  [INFERRED]
  lib/i18n/rich.tsx → components/pages/home/canvasKit.ts
- `Footer()` --calls--> `localePath()`  [EXTRACTED]
  components/site/Footer.tsx → lib/i18n/config.ts
- `NotFoundBody()` --calls--> `localePath()`  [EXTRACTED]
  components/site/NotFoundBody.tsx → lib/i18n/config.ts
- `generateMetadata()` --calls--> `pageMetadata()`  [EXTRACTED]
  app/[locale]/about/page.tsx → lib/i18n/metadata.ts

## Import Cycles
- None detected.

## Communities (43 total, 11 thin omitted)

### Community 0 - "canvasKit.ts"
Cohesion: 0.11
Nodes (30): BLACK, clamp01(), dedupe(), drawFlow(), easeInOut(), fitCanvas(), hexToRgb(), makeTrace() (+22 more)

### Community 1 - "compilerOptions"
Cohesion: 0.07
Nodes (27): ./*, dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 2 - "FloorPlan.tsx"
Cohesion: 0.16
Nodes (12): metadata, ContourField(), Footer(), Nav(), NotFoundBody(), SiteShell(), archivo, otherLocale() (+4 more)

### Community 3 - "page.tsx"
Cohesion: 0.07
Nodes (28): AddOn, addOns, BundleItem, BySize, CatalogueFeature, CurrencyCode, groupLocale, growerBundleS (+20 more)

### Community 4 - "priced"
Cohesion: 0.16
Nodes (13): EnkantoCaseStudy(), generateMetadata(), localeOf(), Params, showPending, generateMetadata(), localeOf(), MonteXanicCaseStudy() (+5 more)

### Community 5 - "ModuleScreen.tsx"
Cohesion: 0.09
Nodes (20): ChannelId, CHANNELS, LotBoard(), LOTS, ModuleScreen(), oneDecimal(), STAYS, TABLES (+12 more)

### Community 6 - "ClinicSchedule.tsx"
Cohesion: 0.07
Nodes (25): generateMetadata(), localeOf(), Params, TermsPage(), Env, pageSource, showsPending(), about (+17 more)

### Community 7 - "localePath"
Cohesion: 0.22
Nodes (13): capGlyphs, generateMetadata(), localeOf(), Params, WineryPage(), generateMetadata(), localeOf(), Params (+5 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, eslint, eslint-config-next, lenis, next, next-view-transitions, dependencies, lenis (+33 more)

### Community 9 - "Locale"
Cohesion: 0.26
Nodes (10): bundleLines(), ModuleFloors(), Showcase(), allModules, demoHref(), Locale, precios, showcase (+2 more)

### Community 10 - "page.tsx"
Cohesion: 0.09
Nodes (44): ContactPage(), DOORS, generateMetadata(), localeOf(), Params, ContactDoors(), ContactForm(), EMPTY (+36 more)

### Community 11 - "Agent Instructions"
Cohesion: 0.16
Nodes (19): addOnAvailable(), addOnMonthly(), addOnOf(), addOnSize(), buildOnly(), bundleHours(), ceilTo(), featureOf() (+11 more)

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

### Community 28 - "page.tsx"
Cohesion: 0.21
Nodes (10): ComingSoonPage(), generateMetadata(), localeOf(), Params, Mark(), MarkVariant, comingSoon, ComingSoonDict (+2 more)

### Community 32 - "page.tsx"
Cohesion: 0.29
Nodes (8): generateMetadata(), Home(), localeOf(), OfficialHome(), Params, PlayOnceVis(), SpotlightFrames(), showcaseEnabled()

### Community 33 - "page.tsx"
Cohesion: 0.15
Nodes (19): generateMetadata(), localeOf(), ModulosPage(), Params, bridgeMask(), Combinations(), ModuleBlock(), PricingDetails() (+11 more)

### Community 34 - "VineField.tsx"
Cohesion: 0.08
Nodes (23): absorbedProviderCash(), AddOnId, combinations, legacyWineryBundles, legacyWinerySetupFloor(), moduleFloors, modules, ModuleSelection (+15 more)

### Community 35 - "SitePlanVisual.tsx"
Cohesion: 0.21
Nodes (14): line(), annualPrepay, bumpOffBareMultiple(), featureHours(), featureSetup(), priced(), round100(), roundHalfDown() (+6 more)

### Community 36 - "localePath"
Cohesion: 0.16
Nodes (18): FloorChart(), MixExample(), bridgesSentence(), comboName(), comboPricingClause(), en, es, mixRankingSentence() (+10 more)

### Community 37 - "page.tsx"
Cohesion: 0.08
Nodes (29): ConsentBanner(), BerryToBottleDesktop(), BerryToBottleMobile(), CENTROIDS, FLAG_ANCHORS, pathD(), Plot, PLOTS (+21 more)

### Community 38 - "page.tsx"
Cohesion: 0.27
Nodes (8): generateMetadata(), localeOf(), Params, PrivacyPage(), en, es, privacy, PrivacyDict

### Community 39 - "BridgeMap.tsx"
Cohesion: 0.33
Nodes (6): BRIDGE_NODES, bridgeLabels(), BridgeModuleId, label, CombinationPicker(), MODULE_IDS

### Community 45 - "SiteShell.tsx"
Cohesion: 0.17
Nodes (18): AboutPage(), generateMetadata(), localeOf(), Params, generateMetadata(), LocaleLayout(), routes, sitemap() (+10 more)

## Knowledge Gaps
- **240 isolated node(s):** `extends`, `next/core-web-vitals`, `Params`, `Params`, `Params` (+235 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `Locale` to `page.tsx`, `page.tsx`, `FloorPlan.tsx`, `page.tsx`, `priced`, `ModuleScreen.tsx`, `page.tsx`, `localePath`, `ClinicSchedule.tsx`, `BridgeMap.tsx`, `page.tsx`, `localePath`, `SiteShell.tsx`, `validate.ts`, `page.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `isLocale()` connect `SiteShell.tsx` to `page.tsx`, `page.tsx`, `priced`, `page.tsx`, `localePath`, `ClinicSchedule.tsx`, `page.tsx`, `validate.ts`, `page.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `rich()` connect `page.tsx` to `page.tsx`, `SitePlanVisual.tsx`, `priced`, `localePath`, `localePath`, `Locale`, `page.tsx`, `SiteShell.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `extends`, `next/core-web-vitals`, `Params` to the rest of the system?**
  _240 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `canvasKit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11092436974789915 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07311827956989247 - nodes in this community are weakly interconnected._