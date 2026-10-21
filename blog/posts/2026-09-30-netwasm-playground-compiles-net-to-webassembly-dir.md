---
date: '2026-09-30'
excerpt: Edit C#, compile locally in your browser, and download a WebAssembly component.
image: null
published_at: '2026-09-30T15:30:11.252927+00:00'
sources:
- https://playground.netwasm.com/
tags:
- netwasm
- dotnet
- webassembly
title: NetWasm Playground compiles .NET to WebAssembly directly in the browser
---

NetWasm Playground now provides a full C# 15 compiler that runs entirely in the browser, letting you compile to WebAssembly and download a WASI Preview 2 component without any server round‑trip. The initial compile loads a 150 MB toolchain bundle, after which subsequent builds are faster thanks to cached artifacts.

## How it works
The page prepares the compiler toolchain in the background, downloading four bundles that total 150.3 MB (about 150 MB uncompressed). Once loaded, the compiler and runtime stay in memory, so repeated compilations reuse the same assets. Source files are never stored on the server; they exist only in the client’s session. You can clear the compilation cache at any time.

## What you can write today
The playground supports the latest C# 15 language preview, including async LINQ, pipelines, dependency injection, structured logging, and even TUnit tests. It also demonstrates runtime features like allocation & GC, read‑only JSON, source‑generated JSON serialization, regular expressions, and CRC32 hashing. Optimizations range from none (`-O0`) to size‑focused (`-Oz`).

## Limits and cautions
The site does not publish any pricing model, which suggests it is free for browser use but offers no SLA or commercial support. Only Chromium, Firefox, and Safari are listed as supported browsers, so other environments may fail. Updated memory‑safety rules require explicit `unsafe(...)` at affected call sites, meaning some low‑level code still needs careful review.

## When to give it a spin
If you need a quick sandbox to experiment with .NET features or generate tiny WebAssembly binaries for a demo, the NetWasm Playground is a convenient, zero‑install option. For larger projects or production pipelines, consider a hosted compiler or a self‑hosted toolchain that integrates with your CI/CD.

**What to watch** – Keep an eye on the roadmap for any announced pricing, expanded browser support, or integration hooks that would let you pull the generated WASI component into automated build scripts.