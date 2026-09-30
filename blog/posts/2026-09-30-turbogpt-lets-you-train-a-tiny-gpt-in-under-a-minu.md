---
date: '2026-09-30'
excerpt: Train a tiny GPT in under a minute (CUDA only). Contribute to lostmsu/TurboGPT
  development by creating an account on GitHub.
image: https://bitroot.org/blog/media/2026-09-30-turbogpt-lets-you-train-a-tiny-gpt-in-under-a-minu.png
published_at: '2026-09-30T15:30:44.633117+00:00'
sources:
- https://github.com/lostmsu/TurboGPT
tags:
- gpt
- cuda
- training
title: TurboGPT lets you train a tiny GPT in under a minute on CUDA
---

TurboGPT, an MIT‑licensed project on [GitHub](https://github.com/lostmsu/TurboGPT), announced that it can train a tiny byte‑level GPT model in under a minute using CUDA‑only code. The repository includes a single‑file C++ implementation that compiles on Linux/NixOS via `nix-build` and on Windows with Visual Studio 2022 and CUDA 13.4.

## Quick start and build steps
The README lists two build paths. On Linux or NixOS, run `nix-build -o build/nix-result`; on Windows, execute `.uild.ps1`. The binary `turbogpt.exe` expects a CUDA compute capability of 8.6 (the highest listed in the repo) and runs with a data file such as `hn1g.txt`. Checkpoints are written to `runs/ctx4/ctx4.pt` and can be resumed with `--load CHECKPOINT.pt`.

## Training output and metrics
A sample run on the `hn1g` dataset after 1.5 B tokens reports a bits‑per‑byte (BPB) score of **2.5295**. Logs are TensorBoard‑compatible, capped at 8 MiB per report, and flushed on checkpoint events. The repository also provides a Python verification script (`tests\verify.py`) to ensure reproducibility.

## Limitations and what’s missing
TurboGPT is **CUDA‑only**, so it won’t run on CPUs or non‑NVIDIA GPUs. The repo does not list any pricing, cloud‑service integration, or support for larger models, and the binary size is tied to a 22 KiB transformer architecture. Those constraints mean it’s best suited for quick prototyping rather than production‑scale training.

## When to try it
If your startup already runs CUDA‑enabled hardware and you need a lightweight sandbox to explore transformer training loops or benchmark data pipelines, clone the repo and run a minute‑scale training job. Keep an eye on future releases for broader GPU support or multi‑model capabilities.