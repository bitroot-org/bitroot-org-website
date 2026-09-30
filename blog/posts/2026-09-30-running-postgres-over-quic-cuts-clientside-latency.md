---
date: '2026-09-30'
excerpt: An experiment testing Postgres wire protocol over QUIC streams vs TCP connection
  pooling across a 30ms link, with benchmark observations and tradeoffs.
image: https://blogs.lupyd.com/static/postgres-with-quic.svg
published_at: '2026-09-30T15:30:15.484475+00:00'
sources:
- https://blogs.lupyd.com/blog/postgres-with-quic/
tags:
- postgres
- quic
- networking
title: Running Postgres over QUIC cuts client‑side latency and memory use
---

The Lupyd team modified the PgCat pooler to accept QUIC streams and ran the PostgreSQL wire protocol over 50 QUIC connections, each limited to 40 streams (2 000 streams total). In a 30 ms WAN simulation the setup delivered 9 718 QPS with a 246 ms median latency, compared with 4 749 QPS and 7 088 ms latency using 500 TCP sockets [source](https://blogs.lupyd.com/blog/postgres-with-quic/).

## How QUIC changes client‑side pooling
QUIC provides native stream multiplexing, so opening a stream does not allocate a new OS file descriptor or kernel buffer. The experiment kept only 50 persistent QUIC connections and created streams on demand, eliminating the socket‑level head‑of‑line blocking that throttles TCP pools. CPU usage rose modestly (≈970 ms user‑space time vs ≈370 ms for TCP) but client RSS dropped from 474 MB to 91 MB, showing the memory benefit of fewer sockets.

## What stays the same
The transport switch does not alter PostgreSQL’s execution model. Each stream still occupies a single backend connection for the duration of a query or transaction, and multi‑statement transactions pin that connection for every round‑trip (≈30 ms each). Consequently, workloads dominated by interactive transactions see no throughput gain; the bottleneck remains the backend pool size, not the network layer.

## Implementation notes
The Rust driver `tokio‑postgres` can accept an `s2n_quic::stream::BidirectionalStream` via its `connect_raw` API, because the stream implements `AsyncRead`, `AsyncWrite`, and `Unpin`. On the server side, PgCat was extended with an s2n‑quic listener alongside its TCP listener, feeding incoming streams into the existing pooling logic. No changes to the PostgreSQL protocol were required, but the prototype does not include 0‑RTT session resumption for the Postgres handshake.

## When to try it
If your services run across a 20‑40 ms WAN link and issue high‑concurrency, single‑statement queries, swapping to QUIC streams can halve latency and dramatically lower client memory. For workloads that rely on multi‑statement transactions, focus on moving logic closer to the database or using stored procedures instead. Watch for production‑ready QUIC pooler integrations before adopting this in critical services.