---
date: '2026-09-25'
excerpt: Profiling and optimizing the Kafgres Postgres extension to achieve 700 MB/s
  write throughput and 600k evt/s on a single machine.
image: ../kafgres-arch.svg
published_at: '2026-09-25T14:21:24.945977+00:00'
sources:
- https://rynr.dev/blog/700mbskafgres/
tags:
- postgres
- kafka
- performance
title: Postgres extension Kafgres hits 700 MB/s Kafka‑compatible throughput
---

Kafgres 0.2.0, a Postgres extension that embeds a singleton broker, demonstrated a sustained write throughput of ~700 MB/s and 600k events per second on an i9 server with PLP‑enabled NVMe drives costing about $0.25 per hour [rynr.dev](https://rynr.dev/blog/700mbskafgres/).

## Inside the extension
Kafgres lives as a Postgres extension but does most of its work in an independent background worker. By writing topic bytes directly to disk and bypassing most of Postgres’s internal layers, it can approach the performance of a dedicated Kafka singleton on the same hardware. The recent release adds a relaxed‑commit mode and a configurable log directory, letting users shift heavy I/O to a separate drive and keep regular database workloads largely unaffected.

## Profiling the bottleneck
Initial runs stalled around 100‑200 MB/s, with the Kafgres worker pegging a CPU core. Detailed profiling showed 40.7 % of CPU time spent in parse/analyze/plan, even though only metadata passes through tables. Switching to cached SPI plans and disabling synchronous commits for offsets trimmed that overhead, raising throughput from 113 MB/s to 197 MB/s. The biggest jump came from replacing a 5 ms tick‑loop with Postgres’s native `WaitEventSet`, which lets the worker block until a socket is ready, pushing the final figure to 700 MB/s for 256 KB records.

## Cost and trade‑offs
A comparable 3‑node AWS MSK cluster that could sustain ~700 MB/s would require three `m5.8xlarge` brokers at $3.36 /hr each, totaling over $7 k per month in compute alone, plus tens of thousands more for storage and transfer. By contrast, a single Hetzner box running Kafgres costs a few dollars a day. However, Kafgres inherits Postgres’s replication model and cannot automatically survive a zonal outage the way a multi‑zone Kafka cluster can. The blog does not publish any licensing or support pricing for Kafgres itself.

## When to try Kafgres
If your startup already runs Postgres and your event stream stays below the few‑hundred‑megabyte‑per‑second range, Kafgres offers a low‑cost alternative to a managed Kafka service. Watch for the upcoming 0.3.0 release, which promises further latency improvements and clearer guidance on multi‑zone resilience.