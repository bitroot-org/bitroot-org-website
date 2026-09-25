---
date: '2026-09-25'
excerpt: Light the led unless both switches are on.
image: https://bitroot.org/blog/media/2026-09-25-simten-launches-an-interactive-nand-gate-playgroun.png
published_at: '2026-09-25T13:06:30.258225+00:00'
sources:
- https://play.simten.dev/nand
tags:
- nand
- simulation
- hardware
- education
title: Simten launches an interactive NAND gate playground
---

Simten has published an interactive NAND gate sandbox at https://play.simten.dev/nand that lets you connect two switch nodes to a single Nand node and observe the result on an LED. The page includes a code snippet where uncommenting the wiring lines draws the circuit, and a **Submit** button renders the simulation.

## Wiring and UI basics
The editor treats each component as a *node* (Switch, Nand, Led) and the connections as *wires*. You select a node with **Enter** or **Space**, then move it using the arrow keys. To delete a node or an edge you press **Delete**, and **Escape** cancels the action. The code shows how a wire is expressed: `a.out.to(n1.a)`, linking the output of switch *a* to input *a* of the NAND gate.

## What you can build today
Out of the box you can toggle the two switches (both start OFF) and watch the NAND output drive the LED (initially OFF). By uncommenting the lines `b.out.to(n1.b)` and `n1.out.to(result.in)` you enable the second input and the LED connection, then hit **Submit** to see the full truth table. The playground is limited to a single NAND gate, so it’s ideal for illustrating basic Boolean logic rather than constructing complex circuits.

## Caveats and trade‑offs
The tool is a minimal demo: it does not support multi‑gate designs, persistent saving, or export to hardware description languages. The keyboard‑driven UI can feel clunky for users expecting a drag‑and‑drop canvas, and there is no pricing information listed, implying it is free but without a service‑level guarantee. For production‑grade design you’ll need a more feature‑rich simulator.

## When to give it a spin
If you need a quick, zero‑install way to show how a NAND gate inverts its inputs—say, in a sprint demo or a junior onboarding session—open the link and play with the switches. For anything beyond a single‑gate proof‑of‑concept, plan to evaluate a dedicated EDA tool instead.