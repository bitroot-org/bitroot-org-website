---
date: '2026-09-29'
excerpt: 'Postgres change data capture for .NET: stream row changes through typed transforms into Meilisearch, Elasticsearch, OpenSearch, Kafka, pgvector or any HTTP endpoint.'
image: https://bitroot.org/blog/media/2026-09-28-wallaby-launches-net-cdc-engine-for-postgres-strea.png
published_at: '2026-09-28T17:13:12.628461+00:00'
sources:
- https://wallabycdc.net/
tags:
- 'postgres'
- 'cdc'
- '.net'
title: 'Wallaby launches .NET CDC engine for Postgres streaming'
---

Wallaby launches .NET CDC engine for Postgres streaming

Wallaby, a new Postgres change‑data‑capture (CDC) engine for .NET, is now live and can stream WAL changes with roughly 72 ms lag into a variety of sinks such as Meilisearch, Kafka, pgvector and generic HTTP endpoints. The site shows a live slot named `wallaby_cdc` delivering 41 changes per second. [Wallaby](https://wallabycdc.net/)

## Zero‑config startup for EF Core and Marten
Point the tool at an Entity Framework Core model, a Marten document store, or a plain table and it auto‑generates the replication configuration. Compile‑time checks surface mismatches as the data model evolves, reducing runtime surprises for small teams that want to avoid hand‑rolled CDC plumbing.

## Transform, enrich, and ship
Wallaby lets you convert raw WAL rows into the shape your destination expects. You can use existing EF/Marten tooling, Dapper, or raw Npgsql to flatten, enrich or filter rows before they hit a sink. Pluggable sinks include search indexes (Meilisearch, Elasticsearch, OpenSearch), vector stores (pgvector), Kafka topics, or any HTTP endpoint, with at‑least‑once delivery guarantees.

## Backfill and versioning
When the output schema changes, Wallaby can run a versioned backfill automatically, keeping downstream stores in sync without manual scripts. This feature helps avoid data drift after a schema migration.

## What’s missing
The public page does not list pricing, SLA guarantees, or usage limits, so teams need to contact the vendor or experiment in‑house to understand cost and reliability implications. The documentation is also limited to a short Markdown bundle for LLMs, which may not cover advanced deployment scenarios.

**When to try it** – If your startup already runs .NET services backed by Postgres and needs a quick way to push updates into a search index or event stream, spin up a test slot and measure lag and throughput. The low‑latency numbers shown (≈72 ms) suggest it’s ready for prototyping, but evaluate cost and operational support before committing to production.
