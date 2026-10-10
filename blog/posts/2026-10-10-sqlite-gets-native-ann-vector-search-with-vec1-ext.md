---
date: '2026-10-10'
excerpt: 'Contents:

  1. Overview

  2. Building The Extension

  3.'
image: null
published_at: '2026-10-10T14:56:20.409432+00:00'
sources:
- https://sqlite.org/vec1/doc/trunk/doc/vec1.md
tags:
- sqlite
- vector search
- ann
title: SQLite gets native ANN vector search with Vec1 extension
---

SQLite announced the release of Vec1 version 0.7, an extension that adds approximate nearest‑neighbor (ANN) vector search via a virtual table, supporting Euclidean (L2) and cosine distances.

## How Vec1 works
Vec1 implements ANN using the IVFADC (Inverted File with Asymmetric Distance Computation) algorithm coupled with Optimized Product Quantization (OPQ).  The code lives in a single portable C file and has no external dependencies.  For speed it uses SIMD: AVX2 on x86 and NEON on ARM, but the algorithm itself is independent of the database engine.

## Building and performance considerations
The extension can be compiled like any other SQLite extension.  The docs show a typical Linux/macOS command:
```
cc -g -O3 -DNDEBUG -mavx2 -mfma vec1.c -shared -fPIC -o vec1.so
```
On Windows with MSVC the equivalent is `cl /Zi /O2 /DNDEBUG /arch:AVX2 vec1.c -link -dll -out:vec1.dll`.  Compiling with SIMD gives the best throughput, but the resulting binary will crash on CPUs lacking those instruction sets.  A multi‑arch Makefile target (`vec1multi.so`) is provided for broader compatibility.

## What’s missing today
The project is still pre‑1.0.  The roadmap lists several gaps: insufficient testing, missing support for non‑float vectors (e.g., 8‑bit ints, 16‑bit floats), no built‑in multi‑threading, and no SIMD support for WebAssembly.  Features like partition keys, alternative graph‑based indexes (HNSW, DiskANN), and cross‑platform byte‑order handling are slated for later.  The documentation does not mention any licensing cost or usage limits, so teams should assume it’s free but uncommercialized.

## When to try it
If you are prototyping a recommendation or similarity feature and want to avoid the operational overhead of a separate vector database, load Vec1 into your local SQLite instance and run small‑scale ANN queries.  Keep an eye on the upcoming 1.0 release for broader testing and additional performance tweaks.  More details are in the [Vec1 documentation](https://sqlite.org/vec1/doc/trunk/doc/vec1.md).