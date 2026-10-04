---
date: '2026-10-04'
excerpt: Single-source pure-Rust heterogeneous GPU compute platform - enkiruntime/enki
image: https://bitroot.org/blog/media/2026-10-04-enki-01-alpha-lets-you-write-gpu-kernels-in-pure-r.png
published_at: '2026-10-04T14:33:23.302308+00:00'
sources:
- https://github.com/enkiruntime/enki
tags:
- rust
- gpu
- compute
title: Enki 0.1 Alpha lets you write GPU kernels in pure Rust
---

The Enki project announced its v0.1 alpha release, a pure‑Rust heterogeneous compute platform that can JIT‑compile a single Rust function onto a Vulkan 1.3 GPU at runtime. The showcase demo runs a real‑time 3D raymarching shader compiled from a regular Rust function, and you can switch execution between GPU and multi‑threaded CPU with the SPACE key.

## Write once, run anywhere
Functions marked with `#[nam]` are ordinary Rust code. They can be dispatched to the GPU via `enki.flow(...)` or executed on the host CPU with Rayon, using the same signature and test harness. The [enki_sdf demo](https://github.com/enkiruntime/enki_sdf.git) shows this dual‑execution model in a few lines of `cargo run` code.

## No nightly, no extra toolchains
Enki runs on stable Rust 1.80+ (`cargo add enki-gpu glam`). It does not require nightly compilers, custom plugins, or separate shading languages, removing the typical build‑chain friction of CUDA or OpenCL projects.

## How it works under the hood
The runtime builds on Vulkan 1.3 features such as 64‑bit Buffer Device Addresses and Synchronization2, eliminating descriptor pools and set juggling. A built‑in BorrowEngine performs runtime borrow checking, catching spatial and temporal hazards before queue submission. An automatic Transitive Reduction Dependency Solver generates the minimal set of pipeline barriers, so developers do not write Vulkan sync code manually.

## Cost and maturity
Enki is open‑core: the framework crates (`enki-gpu`, `anu`, etc.) are MIT/Apache licensed and free forever for developers, researchers, and open‑source projects. A pre‑compiled Parso GPU compiler backend is distributed under a commercial‑notice license. Commercial production use will require a future commercial license, but no pricing is listed yet. The project is labeled **alpha (v0.1)**, and runtime APIs are expected to evolve.

**Caution:** As an alpha‑stage system, Enki does not provide formal proofs of safety for arbitrary parallel patterns, and its public API may change before a stable 1.0 release. Teams should treat it as an experimental probe rather than a production dependency.

**When to try:** If you have a Vulkan‑compatible GPU and want to prototype GPU compute in pure Rust, clone the demo repo, add `enki-gpu` to a Cargo project, and run `cargo run`. For mission‑critical workloads, wait for a stable release or a commercial licensing announcement.