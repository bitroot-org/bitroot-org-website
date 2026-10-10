---
date: '2026-09-26'
excerpt: We’re on a journey to advance and democratize artificial intelligence through
  open source and open science.
image: https://bitroot.org/blog/media/2026-09-26-logolabs-releases-agate-260mparameter-texttoimage.png
published_at: '2026-09-26T13:31:28.626925+00:00'
sources:
- https://huggingface.co/Logolabs/agate-preview-001
tags:
- text-to-image
- small model
- huggingface
- opensource
title: Logolabs releases Agate 260M‑parameter text‑to‑image model on Hugging Face
---

Logolabs has published **Agate Preview 001**, a 260 M‑parameter text‑to‑image model that can generate a 256 × 256 image in **1.9 seconds on an RTX 4060** (50 denoising steps) and is hosted on the Hugging Face model hub [Logolabs/agate-preview-001](https://huggingface.co/Logolabs/agate-preview-001). The release includes a split architecture: a transformer “thinker” that plans a 16 × 16 region map, and a convolutional U‑Net “renderer” that paints the final image.

## Performance and benchmarks
Agate scores **0.550 on the GenEval benchmark**, matching the published score of SDXL and surpassing SD 1.5 (0.43) and SD 2.1 (0.50). On the Qwen‑Image‑Bench (1,000 prompts) it achieves **28.2**, just shy of SD 1.5’s 29.1. The model excels at object placement, colour‑object binding, and flat‑logo style generation, while struggling with exact text, counts above three, and resolutions above 256 px.

## Training budget and footprint
The model was trained from scratch in **144.7 GH200‑hours** (≈13 h wall‑clock) across 16 GPUs, consuming **81.8 kWh** and emitting **2.45 kg CO₂e**. At inference time it needs about **1 GB** of fp32 weights (≈0.5 GB in fp16) and can run in a browser via WebGPU, keeping prompts and images local to the device.

## Licensing and availability
All code and weights are released under the **MIT licence**, with no gated dependencies. The checkpoint is a **research preview**; the authors note that training stopped before the model fully converged – GenEval rose from 0.505 to 0.535 during training, and Qwen‑Image‑Bench improved from 24.8 to 28.4. No pricing or hosted API is provided, so users must run the model themselves.

## When to try it
If you need fast, on‑device generation of icons or low‑resolution assets and can tolerate a 256 px output, Agate offers a cheap alternative to multi‑billion‑parameter models. Watch for the next training iteration (the authors anticipate ~145 additional GPU‑hours) that may close the remaining quality gap before considering it for production pipelines.