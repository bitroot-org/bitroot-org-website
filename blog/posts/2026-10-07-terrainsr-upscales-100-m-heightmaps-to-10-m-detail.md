---
date: '2026-10-07'
excerpt: We’re on a journey to advance and democratize artificial intelligence through
  open source and open science.
image: https://bitroot.org/blog/media/2026-10-07-terrainsr-upscales-100-m-heightmaps-to-10-m-detail.png
published_at: '2026-10-07T15:56:19.942602+00:00'
sources:
- https://huggingface.co/joe-gibbs/terrainsr
tags:
- terrain
- ml
- upscaling
- graphics
title: TerrainSR upscales 100 m heightmaps to 10 m detail in under a second
---

TerrainSR, a model hosted on [Hugging Face](https://huggingface.co/joe-gibbs/terrainsr), generates realistic 10 m terrain heightmaps from 100 m inputs. It was trained on paired 100 m → 10 m data and deliberately excludes built‑up areas to avoid city or mine artifacts.

## What the model does
The model takes a 2‑D array of coarse heights (metres per 100 m cell) and a matching water mask at ten‑times the resolution, then outputs a float32 array of heights at 10 m spacing. It can add plausible hills where the coarse data contains steep features, and it runs faster than traditional erosion simulators for large areas.

## Speed and practical usage
On an RTX 4070 GPU, TerrainSR converts a 50 km × 50 km patch in **0.74 seconds** after the model is loaded, making it suitable for real‑time scenarios such as game prototyping. The repo includes a command‑line interface; a typical run looks like:
```
python -m pip install -r requirements.txt
python terrainsr.py --input examples/synthetic_input.npz \
    --output terrain_10m.npy --crop 32
```
Add `--device cpu` to run on a CPU, though performance will drop dramatically.

## Limitations and cautions
The model only accepts inputs up to **564 cells per side** and requires even dimensions; larger tiles must be split manually. It also breaks down with source data coarser than 100 m, so you cannot upscale a 500 m DEM. No inference providers currently host the model, and downloads are not tracked, meaning you must provision your own hardware and manage licensing. The weights and code are Apache 2.0 licensed, but the underlying elevation datasets have separate terms.

## When to try it
If your project needs quick, plausible terrain detail for a region originally mapped at 100 m resolution—e.g., a historical strategy game or a prototype world‑builder—and you have access to a modern NVIDIA GPU, pulling the repo and running it locally is a low‑effort experiment. For production pipelines that require larger tiles or automated scaling, you’ll need to build a tiling wrapper or wait for a hosted inference service.