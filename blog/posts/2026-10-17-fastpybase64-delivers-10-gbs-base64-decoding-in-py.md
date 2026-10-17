---
date: '2026-10-17'
excerpt: A new Python package, fastpybase64, claims 10 GB/s decode speed on a single
  core, beating the stdlib and pybase64 by large margins. It works as a drop‑in replacement
  but has a narrow Python version range.
image: https://bitroot.org/blog/media/2026-10-17-fastpybase64-delivers-10-gbs-base64-decoding-in-py.jpg
published_at: '2026-10-17T12:36:44.375855+00:00'
sources:
- https://lemire.me/blog/2026/10/17/decoding-base64-in-python-at-10-gigabytes-per-second/
tags:
- base64
- python
- performance
title: fastpybase64 delivers 10 GB/s base64 decoding in Python
---

The `fastpybase64` package hit PyPI with a benchmark that decodes base64 at **10 GB/s** on an Intel Xeon Gold 6548N core using Python 3.14.6, four times faster than `pybase64` and 27× faster than the built‑in `base64` module.

## Measured throughput
The author measured single‑threaded decode speed on random data broken into 76‑character MIME lines, the format used for email attachments. Results on a 1 MiB sample were:
- stdlib `base64`: 0.49 GB/s
- `pybase64` 1.5: 3.2 GB/s
- `fastpybase64` 0.1.0: 13.1 GB/s
These numbers translate to roughly 10 GB/s of decoded payload on the hardware used, confirming the claim of “almost the speed of a memory copy.”

## Drop‑in replacement
`fastpybase64` mirrors the API of the standard library. After `pip install fastpybase64` you can `import fastpybase64 as base64` and call `b64encode`/`b64decode` exactly as before. The module supports Linux, macOS, and Windows and runs on Python 3.10‑3.14, including free‑threaded Python 3.14.

## What the announcement doesn’t cover
The post does not list any pricing model – the package is free on PyPI. It also does not discuss multi‑core scaling; the benchmark is pinned to a single core, so you won’t see linear gains on many cores without explicit parallelism. Finally, the performance numbers rely on a high‑end Xeon CPU; lower‑end hardware may see smaller speedups.

## When to try it
If your service ingests large volumes of base64‑encoded data – for example, processing email attachments, data URLs, or binary blobs in JSON – swapping the stdlib module for `fastpybase64` can reduce CPU time dramatically. Test it on your target hardware and Python version before rolling out, especially if you run on older CPUs or need multi‑threaded throughput.

[Read the full blog post for benchmark details and source code](https://lemire.me/blog/2026/10/17/decoding-base64-in-python-at-10-gigabytes-per-second/).