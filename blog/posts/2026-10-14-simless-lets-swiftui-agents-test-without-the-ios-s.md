---
date: '2026-10-14'
excerpt: 'Simulator-free, headless SwiftUI checks for AI coding agents: render screens
  as accessibility trees and hot-reload views in ~2 s, without the iOS Simulator.
  - abacusai/simless'
image: https://bitroot.org/blog/media/2026-10-14-simless-lets-swiftui-agents-test-without-the-ios-s.png
published_at: '2026-10-14T14:13:48.356623+00:00'
sources:
- https://github.com/abacusai/simless
tags:
- swiftui
- testing
- ci
title: simless lets SwiftUI agents test without the iOS Simulator
---

The open‑source **simless** tool replaces the traditional iOS Simulator loop with a headless host that runs your SwiftUI app directly on an Apple Silicon Mac. A single command, `simless reload --render Welcome.sheet`, recompiles only edited files and renders the screen in 1.9 seconds (compile 1.7 s + apply 0.2 s)【source】.

## How it works
simless launches the app’s iOS slice as an invisible render host (`Designed for iPad`) instead of booting a simulator. The host stays in memory at roughly 30 MB and exposes an accessibility tree (~150 tokens per screen). Because there is no GUI, no Dock icon, and no focus stealing, multiple agents can share a single Mac without the 2.2 GB memory and hundreds of processes a simulator consumes.

## Speed and resource gains
Benchmarks on an M2 Pro MacBook Pro (32 GB RAM) show a 10× reduction for a single edit (21.9 s → 2.2 s) and a 75× drop in steady‑state memory when five agents run in parallel (11.2 GB → 0.15 GB). UI‑test suites that took 19.2 min on five simulator clones finished in 7.6 min with simless, a 2.5× improvement. Unit‑test runtimes also improved modestly (13.1 s → 5.6 s)【source】.

## What you lose
The tool does not guarantee pixel‑perfect fidelity. In a side‑by‑side comparison of 14 demo renders, eight matched within 2 pt, but some rows differed by up to 6 pt and system accent colors varied【source】. Tests that truly require a simulator—e.g., hardware‑specific APIs—must still be run with `simless test --simulator-only`, which merely prints the Xcode build command and exits with an error if the required runtime is missing【source】.

## Getting started
Install with a simple clone and Swift build, then add a single call to your `@main` app to launch the host in debug builds. After `simless init` creates the fixture files, run `simless up` once per worktree, and use `simless reload --render <fixture>` after each view edit. Hot‑reload drops from ~10 s to ~2 s once the SimlessAgent has Full Disk Access.

**When to try it** – If your startup runs multiple AI‑driven agents or CI jobs that check SwiftUI screens, give simless a spin on an Apple Silicon Mac with Xcode 26+. Watch for any visual regressions beyond the 2 pt tolerance and keep a fallback simulator path for the few tests that still depend on it.