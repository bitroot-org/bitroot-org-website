---
date: '2026-08-11'
excerpt: 'Spotify’s new Xirp lets teams run Claude Code, Gemini CLI, and OpenAI Codex sessions from one UI, aiming to reduce context‑switching for AI‑assisted development.'
image: https://bitroot.org/blog/media/2026-08-11-spotify-launches-xirp-a-unified-ai-coding-agent-en.jpg
published_at: '2026-08-11T17:38:48.289449+00:00'
sources:
- https://x.com/i/status/2087051402744832239
tags:
- 'ai coding'
- 'development tools'
- 'spotify'
title: 'Spotify launches Xirp, a unified AI coding agent environment'
---

Spotify launched Xirp, a vendor‑neutral agentic development environment that lets you run and manage sessions for Claude Code, Gemini CLI, and OpenAI Codex from a single dashboard. The tool is already used by more than 1,300 Spotify engineers and is now publicly available for anyone to try. [Source](https://x.com/i/status/2087051402744832239)

## Unified session management
Xirp provides a web‑based console where you can spin up a Claude Code, Gemini CLI, or OpenAI Codex session, attach a terminal, and persist shared context across sessions. The shared context feature means that code snippets, prompts, or variable definitions you create in one agent are instantly visible to the others, reducing the friction of copying and pasting between tools. The UI is intentionally minimal, focusing on agent orchestration rather than a full‑featured IDE.

## Practical benefits for startup engineers
For small teams that already experiment with multiple AI code assistants, Xirp can act as a single point of control, cutting down on the overhead of maintaining separate CLI installs and auth tokens. Because it’s hosted by Spotify, you get a ready‑to‑use service without needing to self‑host any backend components. Early internal use suggests a smoother hand‑off when switching agents mid‑project, which can be handy when one model excels at scaffolding and another at fine‑tuning.

## Limitations and open questions
Xirp’s vendor‑neutral claim only covers the three agents listed; any custom or self‑hosted LLMs are out of scope today. The service is currently free to try, but Spotify has not disclosed a pricing model for production use, so cost could become a factor as usage scales. Additionally, because the UI lives on Spotify’s domain, you’re implicitly trusting their data handling policies, which may be a lock‑in concern for highly regulated startups.

## When to try it
If you already use at least two of the supported agents, spin up a quick Xirp session on a non‑critical side project to gauge the shared‑context workflow. Keep an eye on the official site for pricing updates and for future support of additional models.
