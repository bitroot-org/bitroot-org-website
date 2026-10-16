---
date: '2026-10-15'
excerpt: Code graph and memory for your coding agents, in one Rust program. For Claude
  Code, Codex, Cursor and any MCP client. - Graphicle-AI/graphicle
image: https://bitroot.org/blog/media/2026-10-15-graphicle-adds-a-local-codegraph-and-memory-layer.png
published_at: '2026-10-15T13:50:35.003480+00:00'
sources:
- https://github.com/graphicle-ai/graphicle
tags:
- code graph
- agent tooling
- rust
title: Graphicle adds a local code‑graph and memory layer for coding agents
---

Graphicle 0.1.0 was announced with a benchmark that indexes a 31,000‑file Kubernetes repository in **3 min 18 s**, a ten‑fold speedup over the previous Graphify tool. The tool runs as a single Rust binary on your workstation and requires no API key for most operations.

## Core capabilities
Graphicle builds a code graph (functions, classes, calls, imports) using tree‑sitter and stores it alongside a searchable memory of docs, decisions and past agent sessions in a single SQLite file. Agents can query the graph and memory via MCP, receiving cited excerpts that include file paths and line numbers. The system works with Claude Code, Cursor, Codex, VS Code, Claude Desktop and any other MCP client.

## Getting started
Install with Homebrew:
```
brew install graphicle-ai/tap/graphicle
```
or without Homebrew using the provided script:
```
curl -fsSL https://github.com/graphicle-ai/graphicle/releases/latest/download/install.sh | sh
```
Run `graphicle setup` in a repository to index the code, enable session capture, and install Git hooks that keep the graph current. Use `graphicle ask "…"` to ask a question from the terminal, or let your coding agent invoke the MCP tools directly.

## Performance and limits
On the same Kubernetes test, Graphicle’s 0.1.0 engine completed a code‑only extract in 3 min 18 s versus Graphify’s 26 min 38 s. A Django repo saw 7.5 s versus 72.8 s. By default the tool can handle up to **100,000 text files** and **1 GiB** of text, with configurable limits for larger codebases.

## Caveats to consider
* Windows lacks a native build; it only works under WSL2 at the moment.
* The commercial edition for teams is in private preview and pricing is not disclosed.
* While most features run locally, a model (e.g., Anthropic, OpenAI, Ollama) is required for `graphicle ask` to generate natural‑language answers.

## When to try it
If your startup already uses coding agents and wants a local, privacy‑first alternative to cloud‑based graph services, spin up Graphicle on a non‑production repo and benchmark the indexing time against your current workflow. Watch the [discussions page](https://github.com/graphicle-ai/graphicle/discussions) for updates on Windows support and the team‑server preview.