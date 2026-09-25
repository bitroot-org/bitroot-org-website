---
date: '2026-09-24'
excerpt: Neptune OS 0.4 demonstrates that unmodified Linux GPU drivers can run as
  isolated userspace processes on the formally verified seL4 microkernel, offering
  a new angle on driver stability and security.
image: null
published_at: '2026-09-24T13:55:37.779023+00:00'
sources:
- https://news.ycombinator.com/item?id=49813759
tags:
- os
- microkernel
- driver isolation
title: Neptune OS v0.4 runs Linux drivers as userspace processes on seL4
---

Neptune OS 0.4 adds a **Linux Driver Subsystem** that lets unmodified Linux kernel drivers—such as the amdgpu and i915 DRM modules—run as native, unprivileged userspace processes on the seL4 microkernel, without a virtual machine layer. The demo shows these drivers performing mode‑setting on a Haswell CPU with a Radeon RX560, and the project’s YouTube channel includes storage, networking, and power‑management examples.

## How the subsystem is built
The core idea mirrors the approach of UML and the Linux‑kernel‑as‑a‑library (lkl) projects: a new architecture port compiles a trimmed Linux kernel into a regular program. That program talks to the host OS through a well‑defined IPC interface provided by seL4, which is formally verified for isolation. Because the drivers execute in separate userspace processes, a crash stays contained and does not trigger a system‑wide BSOD.

## What the demo can already do
* **GPU mode‑setting** – amdgpu and i915 drivers drive a monitor on supported hardware.
* **Other subsystems** – videos show a SATA driver handling hot‑plug events and a network driver managing packets.
* **Cross‑OS potential** – the interface is not tied to seL4, so the technique could be adapted for other NT‑like or even non‑NT kernels.

All code and build instructions are in the public repo [NeptuneOS on GitHub](https://github.com/cl91/NeptuneOS) and the mailing‑list announcement provides deeper technical details [seL4 dev thread](https://lists.sel4.systems/hyperkitty/list/devel@sel4.systems/thread/CWZTZ7PMF623PXVNMJUM3OFVSM4WSZUA/).

## Tradeoffs and cautions
The project is still a hobby‑level research effort. Performance overhead from additional IPC hops can be noticeable for latency‑sensitive drivers. Compatibility is limited to drivers that compile cleanly for the custom arch port; some may need source tweaks. The hardware support list is narrow, and the build process assumes familiarity with seL4 toolchains, which can be a steep learning curve.

## When to try it
If you are exploring secure driver isolation, need a sandboxed environment for driver prototyping, or are already experimenting with seL4, cloning the repo and building the v0.4 release is a low‑cost way to evaluate the approach. Watch the upcoming HN discussion [Show HN post](https://news.ycombinator.com/item?id=49813759) for community feedback and any new demos.