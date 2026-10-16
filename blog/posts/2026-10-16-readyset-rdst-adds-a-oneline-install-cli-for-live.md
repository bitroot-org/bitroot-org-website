---
date: '2026-10-16'
excerpt: Contribute to readysettech/rdst development by creating an account on GitHub.
image: https://bitroot.org/blog/media/2026-10-16-readyset-rdst-adds-a-oneline-install-cli-for-live.png
published_at: '2026-10-16T13:39:24.040007+00:00'
sources:
- https://github.com/readysettech/rdst
tags:
- devops
- database
- cli
title: ReadySet RDST adds a one‑line install CLI for live query fixes
---

ReadySet announced the RDST CLI, a tool you can install on macOS or Linux with a single curl command:

```
curl -fsSL https://downloads.readyset.io/packages/rdst-cli/install.sh | sh
```
The installer drops a Python‑based CLI that connects read‑only to your database and begins surfacing slow queries within minutes.

## What the CLI actually does
* **Continuous monitoring** – It reads `pg_stat_statements` on PostgreSQL or `performance_schema` on MySQL every minute, so it sees the queries your app really runs, without a proxy or code changes.
* **Ranking and alerts** – Queries are ordered by their share of total database time, and the agent flags those that have slowed, spiked, or stopped running.
* **Automated fixes** – For each flagged query the CLI runs `EXPLAIN`, examines the plan and schema, and suggests a concrete action: add or drop an index, change a server setting, rewrite the SQL, or run a `VACUUM`.

Each suggestion includes the estimated time saved, step‑by‑step SQL, and an undo statement where applicable.

## Getting started with common commands
| Command | Purpose |
|---|---|
| `rdst init` | Guided setup for your first Postgres or MySQL target |
| `rdst top` | Live view of the slowest queries |
| `rdst analyze` | Detailed analysis of a single query and recommended fix |
| `rdst web` | Launches the full RDST UI in a browser |
| `rdst claude add` | Registers RDST as an MCP server for Claude Code |

The CLI is also publishable on PyPI (`pip install rdst`) or directly from the source repository with `pip install "git+https://github.com/readysettech/rdst.git#subdirectory=cli"`.

## Limits and open questions
* The announcement does not include any pricing information, so you’ll need to contact ReadySet for cost details.
* Desktop builds have auto‑update disabled and product analytics are compiled out unless a key is supplied at build time, which may affect telemetry expectations.
* Building the full Electron‑based desktop app requires Node 22+, pnpm 11, and Python 3.12, but the CLI itself only needs a recent Python interpreter and `uv` on the PATH.

## When to try it
If you already have read‑only credentials for a PostgreSQL or MySQL instance and want an immediate, zero‑code way to surface and fix slow queries, install the CLI now and monitor the first plan that appears within minutes. Keep an eye on ReadySet’s documentation for future pricing tiers and any cloud‑provider integrations.