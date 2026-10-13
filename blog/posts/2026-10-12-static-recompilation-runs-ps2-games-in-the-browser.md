---
date: '2026-10-12'
excerpt: 'PS2 games in the browser: static recompilation to WebAssembly with a native
  runtime - snuri00/ps2-web-recomp'
image: https://bitroot.org/blog/media/2026-10-12-static-recompilation-runs-ps2-games-in-the-browser.png
published_at: '2026-10-12T18:26:13.039227+00:00'
sources:
- https://github.com/snuri00/ps2-web-recomp
tags:
- ps2
- webassembly
- emulation
- static-recompilation
title: Static recompilation runs PS2 games in the browser via WebAssembly
---

The **ps2-web-recomp** project can launch *Gran Turismo 4* at a steady 50 fps in Chrome on a laptop’s integrated GPU, rendering at twice the console’s native resolution. The same pipeline also runs *God of War II* at 60 fps in heavy combat, showing that static recompilation can deliver real‑time PS2 performance in the browser.

## How static recompilation works
The toolchain reads a disc’s executable, follows control flow, and emits C++ in 16 KiB units that preserve the Emotion Engine’s quirks—128‑bit registers, branch delay slots, and a non‑IEEE floating‑point model. Those units become WebAssembly modules, while a lightweight PS2 kernel provides high‑level emulation of threads, interrupts, and I/O. Vector‑unit microcode is compiled ahead of time into SIMD C++ and then into WebAssembly, allowing the GPU to run the game’s graphics via WebGPU compute shaders.

## Performance and hardware needs
Running the browser build requires a WebGPU‑capable browser (Chrome or Edge). On Linux, WebGPU must be enabled via `chrome://flags/#enable-unsafe-webgpu` and `chrome://flags/#enable-vulkan`. Without WebGPU the fallback software renderer is too slow for 3D. The project needs roughly 300 MB of disk space per game for generated code and builds, and a modern GPU to sustain 50 fps at double resolution.

## Getting a game running
You need git, CMake, Ninja, a C++20 compiler, Python 3, and 7‑Zip for compressed ISOs. After cloning the repo, `scripts/port.sh mygame "My Game.iso"` translates the disc, records vector‑unit programs, and builds both a web page and a native runner. Serve the page with `scripts/serve.py` and open the generated URL, e.g., [localhost server](http://localhost:8620/). The browser stores a virtual memory card locally, so progress survives reloads.

## Caveats and when to try it
Only two games have been fully ported; most other titles will likely stop at an unimplemented syscall or missing IOP library, which the runner logs as `[sys] unhandled syscall` or `[iop] missing …`. The repository contains no game data, so you must supply your own disc images and keep them private. If you have a supported GPU and are comfortable with a build pipeline, try the demo with *Gran Turismo 4* to gauge whether the performance meets your needs before investing time in porting another title.