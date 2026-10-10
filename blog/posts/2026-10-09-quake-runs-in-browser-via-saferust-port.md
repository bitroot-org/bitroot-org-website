---
date: '2026-10-09'
excerpt: Quake (1996), faithfully ported to dependency-free safe Rust and compiled
  to WebAssembly — play the shareware episode in your browser.
image: null
published_at: '2026-10-09T15:42:52.666007+00:00'
sources:
- https://quake-srp.pages.dev/
tags:
- quake
- rust
- webassembly
title: Quake runs in browser via safe‑Rust port
---

Quake SRP is a browser‑based version of id Software's 1996 Quake, rebuilt in safe Rust and compiled to WebAssembly. The page loads a share‑ware episode (the original 9.1 MB `quake106.zip`) instantly, letting you press **Enter** to start playing without installing anything.

## How the port works
The engine was rewritten from the GPL source in safe Rust and uses a pure software renderer – no WebGL or other GPU APIs are required. All assets are fetched from the page itself, and the game runs entirely within the browser sandbox. The site also provides a link to the source code on GitHub for anyone who wants to inspect or fork the project.

## Playing today
Controls mirror the classic experience: WASD movement, mouse look (click‑to‑capture), and full gamepad support. You can switch weapons with number keys, use the `~` console for cheats like `god` or `noclip`, and even load your own `pak` files for the original episodes or mission packs by dragging them onto the page. Saved games persist across sessions, and you can toggle fullscreen with `Alt+Enter` or `F11`.

## Limitations and considerations
The page does not provide any performance benchmarks, and because the renderer is software‑only, frame rates may be lower than native versions, especially on low‑end devices. Additionally, the project is not affiliated with or endorsed by id Software, and there is no pricing information – the service is free to use but does not list any usage limits.

## When to try it
If you need a quick way to demo low‑level game tech, experiment with Rust + Wasm, or just want to revisit Quake without setting up a legacy environment, load the demo at [Quake SRP](https://quake-srp.pages.dev/) and see how a safe‑Rust port performs in your browser.