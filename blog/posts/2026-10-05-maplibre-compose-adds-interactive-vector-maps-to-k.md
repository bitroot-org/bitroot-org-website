---
date: '2026-10-05'
excerpt: Add interactive vector tile maps to your Compose app - maplibre/maplibre-compose
image: https://bitroot.org/blog/media/2026-10-05-maplibre-compose-adds-interactive-vector-maps-to-k.png
published_at: '2026-10-05T17:37:19.458871+00:00'
sources:
- https://github.com/maplibre/maplibre-compose
tags:
- kotlin
- compose
- maps
- open-source
title: MapLibre Compose adds interactive vector maps to Kotlin Multiplatform apps
---

MapLibre Compose 1.0 introduces a Compose Multiplatform wrapper around the MapLibre SDKs, enabling interactive vector‑tile maps in Android, iOS, macOS (ARM64), desktop JVM, and Web UIs. The project is hosted on GitHub at [MapLibre Compose](https://github.com/maplibre/maplibre-compose).

## Cross‑platform coverage
The library abstracts the native MapLibre rendering engines, so a single Compose UI can display maps on all five platforms. Android and iOS are marked as stable, while macOS Native (ARM64) also ships as stable. Desktop (JVM) and Web are currently Alpha because they rely on evolving Compose and Skia integrations.

## API stability and release cadence
MapLibre Compose follows Kotlin's stability levels. The public API is still evolving, and the README warns that minor releases may contain breaking changes. This means you should pin the version you depend on and be prepared for occasional migration effort when upgrading.

## Getting started quickly
Add the library as a Gradle dependency (see the repo's README) and run the provided demo app located in the `demo-app` folder to see a basic map in action. The demo showcases adding a `MapView` composable, configuring a vector tile source, and handling basic gestures.

## Cautionary note
Desktop and Web support are Alpha, so expect missing features or integration quirks. The project is open source under a BSD‑3‑Clause license and has no listed pricing, but the lack of a stable release for those platforms may limit production use.

**When to try it** – If your startup already uses Compose Multiplatform and needs a map UI, clone the demo, integrate the library, and monitor the repository for the next minor release. Keep an eye on the stability notes and be ready to lock the version until the API stabilizes.