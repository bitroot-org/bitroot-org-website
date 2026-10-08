---
date: '2026-10-08'
excerpt: A minimal, static, embeddable AI agent in C - no libc, less than 1MB.  -
  abird-ai/agentc
image: https://bitroot.org/blog/media/2026-10-08-agentc-060-ships-a-sub1-mb-static-c23-coding-agent.png
published_at: '2026-10-08T16:02:03.111793+00:00'
sources:
- https://github.com/abird-ai/agentc
tags:
- ai agent
- static binary
- embedded
- c23
title: agentc 0.6.0 ships a sub‑1 MB static C23 coding agent
---

agentc 0.6.0 has been released as a freestanding C23 coding agent that fits in a 940 KiB stripped static binary and launches in roughly 0.3 ms (under 1 ms to first TUI paint). It ships without a standard library, uses a vendored mbedTLS for TLS, and provides C and Rust extension hooks.

## Minimal footprint for constrained runtimes
The agent runs with ~0.7 MB RSS at cold start and grows to 2–4 MB during a typical session—about 304× smaller on disk than the comparable Codex binary. Six targets are built from a single source tree: Linux x86‑64, aarch64, riscv64; macOS arm64 and x86‑64; and Windows x86‑64. Install scripts are provided for Unix (`curl -fsSL https://raw.githubusercontent.com/abird-ai/agentc/master/install.sh | sh`) and PowerShell (`irm https://raw.githubusercontent.com/abird-ai/agentc/master/install.ps1 | iex`).

## Extensible provider model
Built‑in adapters cover Anthropic, OpenAI, Google Gemini, Ollama (local and cloud), and a range of OpenAI‑compatible services (e.g., xAI, Groq, Mistral). Providers are configured via `agentc setup` or command‑line flags, and the tool caches model catalogs for 24 h. Extensions can register additional providers, prompts, or themes through a versioned C ABI; on macOS/Windows they can be loaded at runtime from the extensions directory.

## Platform caveats
While Linux builds are fully CI‑tested, macOS and Windows binaries have only hand‑run verification. The macOS runner does not execute the full test suite, and Windows testing relies on Wine rather than a native environment, leaving SChannel/TLS and PowerShell integration unverified. The release notes explicitly call for community help to improve those platforms.

## When to try it
If you need an AI‑powered coding assistant that can run on devices without a full libc stack—such as micro‑controllers, minimal containers, or isolated build sandboxes—agentc offers a ready‑to‑use binary. Keep an eye on the upcoming macOS/Windows test coverage and extension ecosystem before adopting it for production workloads on those OSes.