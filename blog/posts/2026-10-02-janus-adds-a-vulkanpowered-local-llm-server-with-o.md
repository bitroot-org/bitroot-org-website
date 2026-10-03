---
date: '2026-10-02'
excerpt: Janus is a API router for AI models written in Go and has a Vulkan Model
  runner - Vibra-Ingenn/Janus
image: https://bitroot.org/blog/media/2026-10-02-janus-adds-a-vulkanpowered-local-llm-server-with-o.png
published_at: '2026-10-02T15:14:32.009909+00:00'
sources:
- https://github.com/Vibra-Ingenn/Janus
tags:
- local llm
- go
- vulkan
title: Janus adds a Vulkan‑powered local LLM server with OpenAI‑compatible API
---

Janus, an open‑source Go binary, lets you run GGUF LLMs on your own machine and talk to them via the familiar OpenAI `/v1/chat/completions` endpoint. By default it listens on `http://127.0.0.1:8990` and can be queried with a simple `curl` call:

```bash
curl http://127.0.0.1:8990/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"local","messages":[{"role":"user","content":"Hello!"}]}'
```

## Vulkan‑backed inference across GPUs
Janus ships with a llama.cpp Vulkan backend that runs on AMD, Intel, and NVIDIA GPUs, falling back to CPU when Vulkan isn’t available. The `INFERENCE_BACKEND` environment variable lets you switch between `vulkan`, `cpu`, or `openrouter`. No CUDA libraries are required, which removes the typical CUDA lock‑in for many startups.

## Zero‑dependency deployment
The project builds a single executable (`janus.exe` on Windows, `janus` on Linux/macOS) plus a small `llama.dll`/`libllama.so`. There’s no Python runtime, no Docker image, and no external services. Model files (`.gguf`) are placed in a `models/` folder, and you can hot‑swap them via the `/models/load` endpoint without restarting the server.

## Cost and limitations
Janus is MIT‑licensed and free to use; the only cost is the hardware needed to host the model (GPU VRAM, typically 2–8 GB per model). The repo does not publish any pricing tiers or usage quotas, and the first response can take 10–60 seconds while the model loads into VRAM. CPU fallback is slower, and the macOS Vulkan support varies by hardware.

## When to try it
If your startup already has a Vulkan‑capable GPU and you want to prototype locally without pulling in Python or Docker, clone the [Janus repo](https://github.com/Vibra-Ingenn/Janus) and spin up the binary. Watch the first‑reply latency and ensure your GPU drivers are up‑to‑date before integrating it into a CI pipeline.