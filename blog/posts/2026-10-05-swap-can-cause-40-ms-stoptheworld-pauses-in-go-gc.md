---
date: '2026-10-05'
excerpt: 'I’m writing this so you don’t slap your forehead like I

  almost

  did when I decided to run swap in production to absorb memory spikes.'
image: https://bitroot.org/blog/media/2026-10-05-swap-can-cause-40-ms-stoptheworld-pauses-in-go-gc.png
published_at: '2026-10-05T17:37:46.481602+00:00'
sources:
- https://frn.sh/go-gc/
tags:
- go
- garbage-collector
- swap
- performance
title: Swap can cause 40 ms stop‑the‑world pauses in Go GC
---

A recent experiment on a Hetzner box (kernel 6.8, MGLRU enabled) observed a Go garbage‑collector stop‑the‑world pause of **40 ms** when the GC’s metadata pages were swapped out, far above the typical 51 µs median pause. The worst case involved **228 page faults** over a 39 ms interval, stalling every goroutine during the pause.

## Why the pause spikes
The GC reads metadata that lives outside the heap. When the kernel evicts those pages to swap, the GC’s next sweep or mark termination must fault them back in. Each fault triggers a full swap‑in path (reading PTEs, allocating a frame, disk I/O), which adds tens of milliseconds to the pause. In the test, 312 such pauses occurred over 30 minutes, each costing up to 800× the median pause.

## Observable impact on workloads
Building a 511 KiB protobuf message normally takes 3–5 ms, but on the NVMe volume it jumped to **105 ms**, and on Hetzner’s network volume to **903 ms**. The cost is localized to the allocating goroutine, but the global GC pause still blocks all other work.

## Mitigations and version notes
The author tried Go 1.26’s *Green Tea* GC and found the swap‑related impact unchanged, so the newer collector does not alleviate the problem. Keeping GC metadata out of swap—by disabling swap for the cgroup, provisioning enough RAM, or pinning the metadata pages—are practical ways to avoid the long pauses.

## Caveats
The findings come from a single‑machine setup with specific hardware (NVMe vs. network volume) and kernel configuration. The post does not provide broader benchmarks or guidance for cloud‑hosted environments, so results may vary.

**When to try this**: If you see intermittent latency spikes in a Go service under memory pressure, instrument GC pauses (e.g., using `runtime/trace`) and check for swap activity. Disabling swap for the service’s cgroup is a low‑cost experiment that can eliminate the 40 ms pauses.

[Full write‑up](https://frn.sh/go-gc/) and the associated experiment repo are available for deeper analysis.