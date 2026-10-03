---
date: '2026-10-01'
excerpt: Review code changes by what they do, not line by line. - sshah03/perspica
image: https://bitroot.org/blog/media/2026-10-01-perspica-launches-as-a-local-diff-reviewer-with-op.png
published_at: '2026-10-01T15:53:11.900568+00:00'
sources:
- https://github.com/sshah03/perspica
tags:
- code review
- cli tool
- diff analysis
title: perspica launches as a local diff reviewer with optional LLM summarization
---

The open‑source tool [perspica](https://github.com/sshah03/perspica) was released today, offering a CLI that reviews code changes by intent rather than raw line diffs. A single command, `cargo install perspica`, installs a binary that can analyze a typical PR in a few hundred milliseconds.

## How it works
perspica parses both sides of a diff with **tree‑sitter**, fingerprints tokens, and matches items across versions. Mechanical noise—reformatting, comment‑only edits, pure renames, generated files—is collapsed, leaving only real changes such as signature updates, moved functions, or logic modifications. All processing happens locally; no API key is required for the core analysis.

## Optional LLM layer
Adding `-s` (or using the web viewer’s *Analyze…* button) invokes an LLM to group changes by intent, assign a risk level, and produce a short summary. The tool can use a Claude Code login, an Anthropic/OpenAI API key, or a local model via Ollama. Local models are slower (about a minute for a 10‑file PR on an M4 Pro) and demand 16‑32 GB RAM, while hosted models return results in seconds.

## Language and command coverage
Supported languages include TypeScript/JavaScript (TSX/JSX), Python, Rust, Go, Java, Scala, and C; other files appear as ordinary line diffs. Typical invocations are:
- `perspica` – review the current branch
- `perspica --pr 123 --web` – open a GitHub PR in the browser viewer (requires the `gh` CLI)
- `perspica --json` – emit machine‑readable output
- `perspica old.ts new.ts` – compare two files directly

## Caveats and when to try it
The repository does not list any pricing or usage limits, so costs depend entirely on the chosen LLM provider or local model resources. The optional LLM step is the only part that sends data off‑machine; without `-s` everything stays local. If you already have a Claude Code login or an Ollama model, try running `perspica` on a recent pull request in a sandbox repo to see whether its intent‑focused diff saves you review time.