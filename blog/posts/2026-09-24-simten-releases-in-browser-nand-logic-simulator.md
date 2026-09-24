---
date: '2026-09-24'
excerpt: Light the led unless both switches are on.
image: https://bitroot.org/blog/media/2026-09-24-simten-releases-in-browser-nand-logic-simulator.png
published_at: '2026-09-24T13:55:30.221583+00:00'
sources:
- https://play.simten.dev/nand
tags:
- hardware simulation
- education
- typescript
title: Simten releases in-browser NAND logic simulator
---

Simten has opened an interactive TypeScript‑based NAND gate playground at [https://play.simten.dev/nand](https://play.simten.dev/nand), letting you code next to a live circuit diagram in the browser. The page explicitly notes it needs a desktop – it won’t fit on a phone screen.

## Live coding next to the diagram
The environment pairs a code editor with a circuit view that updates on every keystroke. You write simple TypeScript functions that manipulate virtual wires, and the diagram redraws instantly, showing the logical state of each gate. This tight feedback loop makes it easy to experiment with gate‑level designs without flipping between separate tools.

## Building blocks for a CPU
While the playground only implements the NAND primitive, you can compose it into higher‑order gates, add registers, and even sketch a rudimentary arithmetic logic unit. The site mentions a “map” feature that guides you through increasingly complex builds, which is useful for teaching the step‑by‑step construction of a CPU from truth tables.

## Caveats to consider
The tool runs entirely in the browser, so it has no persistence – you lose your work on refresh unless you copy it out manually. It also lacks support for other gate types or timing analysis, meaning you’ll hit a ceiling once you outgrow pure NAND constructions. Finally, the desktop‑only requirement may be a blocker for teams that prefer mobile‑first workflows.

## When to give it a try
If you’re prepping a short workshop on digital logic or need a quick sandbox for prototyping gate‑level ideas, spin up the playground on a laptop and run through the built‑in map. Keep an eye on Simten’s roadmap for possible extensions to other gate families or export features.