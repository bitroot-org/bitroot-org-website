---
date: '2026-09-24'
excerpt: "BuildABrowser\nBuildABrowser is a project aiming to build a browser and
  its rendering engine in Java, and then (eventually) document it\n\t\t\t\tsuch that
  others can rebuild it for themselves."
image: /_astro/acid2_small.BtitYRV7_Z1btHeE.webp
published_at: '2026-09-24T13:55:41.749634+00:00'
sources:
- https://buildabrowser.net/
tags:
- browser
- java
- rendering engine
title: BuildABrowser ships v0.1.1 with Linux, Windows, and Android builds
---

BuildABrowser announced v0.1.1, bundling pre‑built binaries for Linux (tested on Arch), Windows 11, and an experimental Android desktop, all requiring Java 24+.

## What the release actually contains
The package ships a simple browser UI and a rendering engine written entirely in Java. It passes the Acid2 test, supports CSS Grid, and defaults to the Skija GPU painter. Users can fall back to Java2D with the `-gbe java2d` flag. All binaries are downloadable from the project's homepage [BuildABrowser](https://buildabrowser.net/).

## Embedding and quick start
The release includes guides for embedding the renderer in a Swing app or a Jetpack Compose Android‑desktop project. The "Show a Window" step demonstrates loading a URL from the command line, while the "Very Basic DOM" step gives a minimal HTML parser you can extend. Because the builds are just JARs plus a small launcher, integration is a matter of adding the JAR to your classpath.

## Caveats and trade‑offs
The browser does **not** support JavaScript, so any site relying on client‑side scripts will break or render blank pages. Security hardening is also missing; the author notes that logging into sites like GitHub is unsafe. The Android build is labeled "experimental" and runs only on desktop‑style Android images, not on phones. These constraints make the engine suitable for sandboxed tools or learning projects rather than production web apps.

## Cost and licensing
v0.1.1 is free to download and run, but you must provide your own JVM (Java 24 or newer). No subscription or license fee is required, which aligns with the typical indie‑tool model.

**What to watch** – Keep an eye on the project's roadmap for JavaScript support and a hardened security mode. If you need a pure‑Java rendering engine for a Swing or Compose prototype, give v0.1.1 a spin now; otherwise, wait for the next release before considering it for any public‑facing product.