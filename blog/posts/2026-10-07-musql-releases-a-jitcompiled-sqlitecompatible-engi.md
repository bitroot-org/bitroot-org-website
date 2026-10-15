---
date: '2026-10-07'
excerpt: SQLite-compatible database with a JIT; 300× C SQLite, 1000× Turso. - samyfodil/musql
image: https://bitroot.org/blog/media/2026-10-07-musql-releases-a-jitcompiled-sqlitecompatible-engi.png
published_at: '2026-10-07T15:57:28.934861+00:00'
sources:
- https://github.com/samyfodil/musql
tags:
- sql
- jit
- database
- go
title: musql releases a JIT‑compiled SQLite‑compatible engine with 300× speed gains
---

musql (pronounced “muscle”) hit GitHub with a new engine that stores columns contiguously and JIT‑compiles supported query paths to native code. In a 100 000‑row read benchmark, a filtered count ran in 21 µs – about **300× faster than C SQLite** and **970× faster than Turso**[https://github.com/samyfodil/musql].

## How the performance boost works
musql’s storage format groups each column’s values together, letting vectorized filter kernels scan only the needed data. At runtime, the JIT turns the query plan into machine code, eliminating row decoding and interpreter overhead. The repo’s benchmark table shows similar multiples across predicates, joins, and aggregates, and the gains hold or grow up to a million rows. Without the JIT, musql falls behind C SQLite on scans, so the speed claim depends on JIT support in the CPU.

## Drop‑in compatibility for Go projects
The driver registers as both `sqlite` and `musql`, so existing Go code that imports a SQLite driver can switch to `github.com/samyfodil/musql/driver` and point the DSN at an `.musq` file. Import/export is handled by the `musql-convert` CLI, which moves databases between SQLite files and the new segment format. The engine also supports joins, window functions, JSON, full‑text search, and R‑tree indexes, matching the SQLite dialect.

## Replication and server mode
musql can run as a server (`musqld`) that speaks Turso’s Hrana protocol, letting libSQL clients connect unchanged. Replication is optional: a CRDT mode allows independent writers with conflict resolution via hybrid logical clocks, while leader and leader‑with‑quorum modes provide stricter consistency. The documentation notes that CRDT merges can violate constraints such as foreign keys or multi‑column checks, and that triggers, virtual tables, and `WITHOUT ROWID` are unsupported in replicated schemas.

## A quirky demo: DOOM runs on the SQL VM
The repository includes a DOOM example that compiles the game’s bytecode to musql VDBE instructions. With JIT enabled, the demo reaches ~96 fps on an Intel i9, compared to ~38 fps without JIT. The script to launch it is available at [run.sh](https://raw.githubusercontent.com/samyfodil/musql/main/examples/doom/run.sh).

**Caution:** The project does not publish any pricing model or usage limits—it's open source, but you’ll need to provision your own infrastructure (Docker image, server, or embed the driver). Also, some SQLite pragmas such as `PRAGMA max_page_count` are declined; use musql’s `PRAGMA max_size` instead.

### When to try musql
If your startup needs an embedded SQL store with SQLite syntax but reads dominate and you can afford the extra Go 1.27+ runtime, spin up a local `musqld` instance and benchmark your hottest queries. The speed gains are most visible on column‑heavy scans, while write‑heavy workloads may see less benefit.