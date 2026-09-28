---
date: '2026-09-28'
excerpt: Turn a raster logo into an exact SVG, in your browser. Nothing is uploaded.
image: null
published_at: '2026-09-28T17:13:31.557803+00:00'
sources:
- https://logolabs-inkvec.static.hf.space/studio/index.html
tags:
- vector graphics
- wasm
- browser tool
title: Inkvec Studio Lite brings client-side Rust/WASM vectorization
---

Inkvec Studio Lite launched as a fully client‑side image vectorizer that runs in any modern browser. The tool accepts PNG, JPEG, or WebP files, and begins tracing the moment you drop an image or press **Ctrl+O** – no upload step required. The UI immediately shows the auto‑traced SVG beside the original, and you can switch to a **Custom** workflow for manual tuning.

## Instant auto‑trace on load
When you open an image, the engine – compiled from Rust to WebAssembly – produces a vector output in a single step. This “Auto” mode requires no configuration, making it ideal for quick conversions of flat logos, icons (64 px), crests, or black‑and‑white signatures. The result appears side‑by‑side with the source, so you can verify quality instantly.

## Custom controls for precision
A small card appears after the auto pass, offering a **Custom** button. Selecting it reveals the same set of sliders and toggles that the auto mode uses, but now you can adjust them under a **Tune** panel. Settings include switches to always use Auto or always use Custom, letting you lock in your preferred workflow for repeat work.

## Offline and batch capabilities
Because all processing stays in the browser, your image never leaves the computer, satisfying privacy‑first use cases. For larger jobs, the page advertises a desktop version – **Inkvec Studio** – that can handle whole‑folder batches without browser limits and works offline.

## What to watch
The announcement does not include pricing, licensing terms, or performance benchmarks compared to other vectorizers, so you’ll need to test it against your own quality thresholds. Additionally, the tool is limited to the file formats listed (PNG, JPEG, WebP) and runs only where WebAssembly is supported. If you need API access or server‑side processing, Inkvec Studio Lite won’t meet those needs.

**When to try it**: If you need a quick, privacy‑preserving conversion of small raster assets to SVG and are comfortable tweaking a few sliders, load the web app at [Inkvec Studio Lite](https://logolabs-inkvec.static.hf.space/studio/index.html) and see whether its output matches your visual standards.