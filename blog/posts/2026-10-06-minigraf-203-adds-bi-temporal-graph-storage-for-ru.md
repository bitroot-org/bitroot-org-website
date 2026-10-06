---
date: '2026-10-06'
excerpt: Embedded graph memory for AI agents, mobile apps, and the browser. - project-minigraf/minigraf
image: https://bitroot.org/blog/media/2026-10-06-minigraf-203-adds-bi-temporal-graph-storage-for-ru.png
published_at: '2026-10-06T15:37:27.799199+00:00'
sources:
- https://github.com/project-minigraf/minigraf
tags:
- embedded database
- graph
- rust
title: Minigraf 2.0.3 adds bi-temporal graph storage for Rust and WASM
---

Minigraf 2.0.3 was released on crates.io, bringing a tiny, self‑contained graph database that supports Datalog queries and bi‑temporal time travel. The core library can be added with `cargo add minigraf` and opens a file via `Minigraf::open("data.graph")` with zero configuration.

## Core capabilities
- **Datalog queries** – recursive rules let you traverse relationships without joins. Window functions such as `sum`, `count`, and `rank` are available directly in `:find` clauses.
- **Bi‑temporal model** – each fact stores a transaction timestamp and a valid‑time interval, enabling "as‑of" queries that reconstruct the exact knowledge state at any past moment.
- **Embedded everywhere** – the library compiles to native Rust, WebAssembly (browser and WASI), Android, iOS, Python, Node.js, Java, and C. All bindings use a single `.graph` file and require no external server.

## Performance and limits
Benchmarks show a point query on 1 M facts takes ~4.4 s, opening the database takes 1.31 s, and peak heap stays around 1 GB. Fact size is capped at 4 080 bytes for file‑backed stores; in‑memory stores have no hard limit. Writes are `fsync`‑ed by default, but `SyncMode::Normal` can boost bulk‑load throughput at the cost of durability guarantees.

## Known caveats
The current 2.x line has a documented bug where writing two values for the same attribute in a single transaction can collapse into a single value (see issue #371). The fix lands in the upcoming 3.0.0 release, after which v2.x will receive only security patches for 12 months. Also, Minigraf is deliberately not a distributed system – it does not provide clustering, replication, or a client‑server protocol, and is optimized for <1 M nodes.

## Licensing and cost
Minigraf is dual‑licensed under the Apache 2.0 ([http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)) and MIT ([http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT)) licenses. There is no pricing tier; the software is free to use, but the repository does not publish any commercial support options.

## When to try it
If your startup needs an embedded graph store that can audit every change – for example, an AI agent that must replay past beliefs or a mobile app that corrects user data retroactively – clone the repo at [https://github.com/project-minigraf/minigraf](https://github.com/project-minigraf/minigraf) and run the browser visualizer to explore time‑travel before wiring it into your code.