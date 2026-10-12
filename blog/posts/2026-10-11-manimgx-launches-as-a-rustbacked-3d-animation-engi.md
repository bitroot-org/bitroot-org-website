---
date: '2026-10-11'
excerpt: 'The animation engine for agents: blazingly fast math and 3D videos with
  Manim''s Python API, on a Rust GPU core. - academa-labs/manimgx'
image: https://bitroot.org/blog/media/2026-10-11-manimgx-launches-as-a-rustbacked-3d-animation-engi.png
published_at: '2026-10-11T15:13:00.571848+00:00'
sources:
- https://github.com/academa-labs/manimgx
tags:
- manim
- animation
- rust
title: ManimGX launches as a Rust‑backed 3D animation engine for Manim CE
---

ManimGX 0.1.0 was announced on GitHub, offering a drop‑in replacement for Manim CE's API that runs on a Rust‑based GPU core. In the benchmark sheet, a 36.2‑second video rendered in 3.08 seconds on an Apple M4 Pro, a 90.6× speedup over ManimCE, 11.5× over ManimGL, and 18.7× over Blender Workbench【https://github.com/academa-labs/manimgx】.

## Performance claims
The repo’s readme measures the same five 1080p60 scenes across engines with the fastest encoding preset. ManimGX consistently wins, making it attractive for agents that need to generate video on the fly. The Rust + wgpu stack also supports physically based lighting via Google’s Filament, giving higher‑quality 3D shading without extra configuration.

## Quick start for developers
Installation is a single pip command on macOS, Linux, or Windows (Python 3.13+):

```bash
pip install manimgx
```

A sample scene can be saved as `scene.py` and rendered with `manimgx render scene.py`, producing an `MP4` file directly. For agents that generate code, the project provides a prompt file at [manimgx.academa.ai/llms.txt](https://manimgx.academa.ai/llms.txt) that walks through setup in Claude, Codex, or Cursor.

## Limitations and considerations
The announcement does not list any pricing—ManimGX is MIT‑licensed and free to use, but the page also omits details on production‑grade support, stability guarantees, or community size. Native wheels bundle GPL‑3.0‑or‑later components (FFmpeg, x264), which may affect downstream licensing decisions for proprietary products.

## When to try it
If your startup’s pipeline already uses Manim CE and you need faster 3D renders for automated reports or AI‑generated videos, give ManimGX a spin on a developer machine before committing to production. Watch the repository for upcoming releases that address broader compatibility and any licensing clarifications.