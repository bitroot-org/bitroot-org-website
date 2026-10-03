---
date: '2026-10-03'
excerpt: 'A demo using simdjson shows that splitting a gzip file into 256 KiB zstd frames lets a 64‑core server read compressed NDJSON at 40 GB/s, with only a 6% size penalty.'
image: https://bitroot.org/blog/media/2026-10-02-zstdframed-ndjson-parses-at-40-gbs-on-a-64core-xeo.jpg
published_at: '2026-10-02T15:13:33.223071+00:00'
sources:
- https://lemire.me/blog/2026/10/01/parsing-compressed-json-at-40-gb-s/
tags:
- 'json'
- 'compression'
- 'performance'
title: 'zstd‑framed NDJSON parses at 40 GB/s on a 64‑core Xeon'
---

The new demo reaches **40 GB/s** parsing speed on an Intel Xeon Gold 6548N (64 cores, 128 threads) by reading NDJSON that’s compressed with zstd frames of 256 KiB each. The benchmark uses the [simdjson](https://github.com/simdjson/simdjson_compressed_demo) library and GCC 14, and it counts active records while summing scores for admins.

## How the framing works
NDJSON stores one JSON document per line, so a newline never appears inside a document. Lemire’s program writes a new zstd frame after every 256 KiB of JSON, appending the decompressed size and a checksum. Because each frame is independent, any thread can locate a frame by reading a few block headers and then decompress and parse it without touching earlier data. This eliminates the sequential bottleneck of a single gzip stream, which needs the previous 32 KiB of output to continue.

## Measured throughput
* **Gzip (single stream)**: ~1.1 GB/s per thread, 2.5 GB/s with a dedicated decompression thread.
* **zstd (256 KiB frames)**: 40 GB/s with 64 threads.
* **lz4 (256 KiB frames)**: 34 GB/s with 64 threads.
The zstd file is only 6% larger than the gzip file (60.6 MiB vs. 56.9 MiB for an 812 MiB NDJSON dataset).

## When to consider this approach
If you control the JSON generation pipeline, switching to framed zstd can give near‑gzip compression while unlocking massive multi‑threaded read speeds. The trade‑off is higher CPU usage and the need for enough cores to saturate the pipeline. For workloads that repeatedly scan large log or ML datasets on a server‑class machine, the speed gain can outweigh the modest size increase.

## Caveats
The benchmark uses synthetic, highly repetitive data, which decompresses faster than many real‑world logs. Also, achieving 40 GB/s requires a 64‑core system; smaller instances will see proportionally lower throughput. The blog post does not discuss memory overhead or cloud cost implications.

**What to watch** – Keep an eye on upcoming updates to the [simdjson compressed demo](https://github.com/simdjson/simdjson_compressed_demo); newer versions may add support for variable‑size frames or integrate directly with streaming pipelines, making the technique easier to adopt on modest hardware.
