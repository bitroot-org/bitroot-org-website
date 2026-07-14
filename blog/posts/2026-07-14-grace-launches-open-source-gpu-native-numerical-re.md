---
date: '2026-07-14'
excerpt: GRACE delivers a fresh, GPU‑first implementation of Z4c gravity coupled to
  ideal GRMHD, scaling across heterogeneous clusters with impressive zone‑cycle rates,
  but it still demands sizable hardware and expertise.
image: https://pbs.twimg.com/media/HNKZxd8aIAEpk1e.jpg?name=orig
media:
- type: image
  url: https://pbs.twimg.com/media/HNKZxd8aIAEpk1e.jpg?name=orig
- type: image
  url: https://pbs.twimg.com/media/HNKZxd8b0AAiB1p.jpg?name=orig
published_at: '2026-07-14T10:31:29.852117+00:00'
sources:
- https://x.com/En_formare/status/2076891457999479168
tags:
- numerical relativity
- gpu
- hpc
- open source
title: GRACE launches open-source GPU-native numerical relativity framework
---

GRACE, an open‑source numerical‑relativity code, hit the public repo this week, touting native GPU support and adaptive octree meshes that run on AMD MI300A APUs and NVIDIA A100s. The tweet announcing the release notes a peak of 24.8 billion zone‑cycles / s on a single MI300A for fixed‑spacetime GRMHD, and 16.8 million cycles / s for fully coupled Z4c+GRMHD on a six‑level FMR TOV setup [source](https://x.com/En_formare/status/2076891457999479168).

## Architecture and physics coverage
GRACE is built from the ground up for heterogeneous HPC clusters, using the p4est library for adaptive octree forests and Kokkos kernels for portable GPU execution. It implements the constraint‑damping Z4c formulation with 1+log slicing and Gamma‑driver shift, plus a high‑resolution shock‑capturing GRMHD solver featuring fifth‑order WENO‑Z reconstruction and divergence‑free magnetic fields preserved to machine round‑off via constrained transport. The code ships validation suites covering shock tubes, magnetic rotors, Bondi accretion, TOV oscillations, and binary black‑hole inspirals.

## Performance highlights
On a single AMD MI300A, GRACE sustains 24.8 billion zone‑cycles / s for GRMHD‑only runs and 16.8 million / s for coupled Z4c+GRMHD. NVIDIA A100s achieve roughly 40‑45 % of that raw throughput. Strong scaling retains about 44 % efficiency on uniform grids across 16 devices and 54 % on FMR across eight devices, while weak scaling reaches 90 % efficiency up to 128 devices (uniform) and 98 % up to 256 devices (FMR). A high‑resolution magnetized binary neutron‑star merger completed in ~11 hours on 24 MI300A APUs.

## Cautions and trade‑offs
Despite the impressive raw numbers, GRACE’s performance hinges on large, modern GPUs; smaller clusters or CPUs will see far lower throughput, limiting its utility for rapid prototyping. The code’s reliance on Kokkos means developers must be comfortable with its execution model and build system. Moreover, the magnetic amplification in post‑merger phases remains under‑resolved at the demonstrated 185 m spacing, indicating that scientific results may still need higher resolution or supplemental analysis.

## When to give it a spin
If your startup already runs GPU‑heavy workloads and needs a flexible, open‑source tool for relativistic astrophysics simulations—e.g., for generating waveforms or testing EOS models—GRACE is worth a trial on a modest GPU node to benchmark its scaling. Teams without access to AMD MI300A or comparable hardware should evaluate the CPU fallback path first, as the performance gap may outweigh the convenience of a GPU‑first design.