---
date: '2026-09-25'
excerpt: Light the led unless both switches are on.
image: https://bitroot.org/blog/media/2026-09-25-simten-adds-an-interactive-nand-gate-sandbox.png
published_at: '2026-09-25T13:09:10.387992+00:00'
sources:
- https://play.simten.dev/nand
tags:
- digital logic
- simulation
- education
title: Simten adds an interactive NAND gate sandbox
---

Simten released an interactive NAND circuit editor at https://play.simten.dev/nand that runs in the browser. The page includes a starter snippet where two `Switch` nodes feed a `Nand` node, whose output can drive a `Led` node – all wired with the `a.out.to(n1.a)` syntax.

## Wiring model and code layout
The editor treats a circuit as a collection of **nodes** (the components) and **connect** statements (the wires). Nodes are declared in a JavaScript‑like object (`a: Switch, b: Switch, n1: Nand, result: Led`). Connections are expressed as method chains that read left‑to‑right, for example `a.out.to(n1.a)`. Commented lines in the starter code show how to add the second switch and the LED connection. When you uncomment them and hit **Submit**, the simulation updates instantly.

## Immediate feedback for hardware ideas
The UI lets you select a node with **Enter** or **Space**, move it with the arrow keys, and delete it with **Delete**. Edge selection works the same way, making it fast to rewire prototypes. The visual output shows the LED state (`OFF` by default) and the logical NAND symbol (`⊼`). This low‑friction loop is useful for quickly checking truth tables or teaching basic digital logic without setting up a full HDL toolchain.

## What’s missing and cost considerations
The page does not list any pricing, usage limits, or authentication requirements, implying the sandbox is freely available. However, the documentation does not mention persistence, export formats, or integration hooks, so it’s currently best suited for ad‑hoc experimentation rather than embedding in CI pipelines.

## When to give it a spin
If you need a fast way to validate a two‑input NAND design or want a lightweight demo for a pitch, open the link, toggle the switches, and watch the LED respond. For deeper hardware work you’ll still need a more feature‑complete simulator, but Simten’s sandbox is a handy first step.

**What to watch:** future releases may add saving, custom components, or API access, turning the playground into a repeatable testing harness.