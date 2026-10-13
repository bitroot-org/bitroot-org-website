---
date: '2026-10-13'
excerpt: ClickHouse schema and migration CLI for TypeScript projects - obsessiondb/chkit
image: https://bitroot.org/blog/media/2026-10-13-chkit-adds-typescriptdriven-clickhouse-schema-and.png
published_at: '2026-10-13T16:37:10.123373+00:00'
sources:
- https://github.com/obsessiondb/chkit
tags:
- clickhouse
- schema-management
- typescript
title: chkit adds TypeScript‑driven ClickHouse schema and migration CLI
---

chkit 0.0.0 (the current release) introduces a CLI that can generate a migration with a single command, e.g. `chkit generate --name create-events` — the tool then writes a SQL file under `chkit/migrations/` for review before applying it.

## Define, generate, and apply migrations in code
[chkit](https://github.com/obsessiondb/chkit) lets you write ClickHouse schemas using a TypeScript DSL (`@chkit/core`). The DSL covers tables, views, materialized views and dictionaries. After defining a table (see the `events` example in the repo), you run `chkit generate` to emit a migration, `chkit migrate --apply` to run it, and `chkit status` or `chkit check --strict` to verify that the live database matches the code definitions. All steps can be scripted in CI pipelines, and the generated SQL is stored alongside your source for auditability.

## Quick start for a new or existing project
A fresh project can be bootstrapped with `bun create chkit@latest my-app --example hello` (or the npm equivalent). Existing TypeScript codebases add the dev dependency via `npm install --save-dev chkit @chkit/core`. You must expose the ClickHouse connection through environment variables (`CLICKHOUSE_URL`, `CLICKHOUSE_USER`, `CLICKHOUSE_PASSWORD`, `CLICKHOUSE_DB`). The CLI validates these variables before any network command, throwing an explicit error if they are missing.

## What the repo does not cover
The documentation notes that the backfill plugin (`@chkit/plugin-backfill`) is in beta and that Python support (`chkit-py`) is in alpha, indicating limited stability for those features. The repository also does not list any pricing model or usage limits, so teams need to assume the tool is free under its MIT license but may encounter hidden costs when using the optional ObsessionDB cloud offering. Those gaps are worth checking before adopting chkit in production.

**When to try it**: If your startup already uses ClickHouse and you prefer schema as code, spin up a sandbox, run the quick‑start example, and add `chkit check` to your CI. Observe the drift detection output; if it meets your reliability criteria, consider integrating the full migration workflow.