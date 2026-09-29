---
date: '2026-09-26'
excerpt: A langgraph based workflow with a C++ CUDA harness to optimize CUDA kernels
  - bertaye/agentic-cuda-optimizer
image: https://bitroot.org/blog/media/2026-09-26-agentic-cuda-optimizer-automates-kernel-tuning-via.png
published_at: '2026-09-26T13:31:48.857122+00:00'
sources:
- https://github.com/bertaye/agentic-cuda-optimizer
tags:
- cuda
- optimizer
- langgraph
title: Agentic CUDA optimizer automates kernel tuning via LangGraph
---

The **agentic CUDA optimizer** was released on GitHub and can run a full optimization loop with a single command like `optimizer_agent.py --description "Single-precision GEMM with rectangular matrices." --max-iterations 7`. The default model is `gpt-5-mini` and each run bills OpenAI API usage to your own account.

## How the optimizer works
The workflow loads a kernel signature, reference implementation, and optional initial kernel, then executes a cycle of code generation, compilation with NVRTC, NumPy‑based output validation, and latency measurement. Results feed back into the next iteration, and the fastest validated candidate is saved. Timing uses 10 warm‑up launches and 100 measured launches per case, ranking by geometric mean latency.

## Setup and required tooling
Running the tool requires Python 3.12+, an NVIDIA GPU with a compatible driver, CMake 3.24+, a C++17 compiler, and an OpenAI API key. On Windows the build uses Visual Studio 2026 C++ tools. Optional flags enable Nsight Compute profiling (`--use-nsight`) or fetch NVIDIA documentation (`--nvidia-research`). All generated artifacts—kernel sources, logs, heatmaps—are stored under `results/run‑NNN/`.

## Practical considerations
The optimizer is **experimental**: it only guarantees that supplied test cases pass, not that the kernel is correct for all inputs. No benchmark against cuBLAS or other vendor libraries is provided, and generated scripts run as unsandboxed Python subprocesses on the local GPU. Users should keep the GPU idle while timings are collected and be aware that compilation time and profiler replay are excluded from the performance score.

## When to try it
If your startup team maintains a handful of custom CUDA kernels and wants to prototype automatic tuning without building a full internal optimizer, cloning the repo and running a short iteration budget (e.g., 5‑7 cycles) can reveal speed‑up opportunities. Watch for future releases that add broader correctness checks or integration with CI pipelines.