---
date: '2026-09-25'
excerpt: open-source canvas for thoughtful software design. Contribute to devdotfast/whiteboard
  development by creating an account on GitHub.
image: https://bitroot.org/blog/media/2026-09-25-whiteboard-launches-as-an-opensource-canvas-for-de.png
published_at: '2026-09-25T14:22:22.155042+00:00'
sources:
- https://github.com/devdotfast/whiteboard
tags:
- developer tools
- software design
- open source
title: Whiteboard launches as an open‑source canvas for deliberate software design
---

Whiteboard 1.0 launched this week as an open‑source desktop app for macOS and Fedora, with binaries hosted on its [GitHub repo](https://github.com/devdotfast/whiteboard). The tool connects to coding agents such as Claude Code or Codex and surfaces a canvas where humans and agents can collaboratively architect software.

## A visual workspace built on familiar editors
Whiteboard embeds a fork of Code OSS, giving you VS Code‑style keybindings and LSP support out of the box. Clicking a sequence diagram or an entity‑relationship view jumps directly to the underlying source, so you can move between design artifacts and implementation without context switching. The app also ships a Rust‑based, AST‑aware diff viewer that collapses large added functions into pseudocode and hides unit‑test or doc changes unless you explicitly expand them. This semantic diff is extensible via a WASM plugin system.

## Agent‑centric prompts and decision logging
From the welcome screen you can attach Claude Code, Codex, or another model. Example prompts let you ask an agent to review a branch against the latest main, generate a proposed API, or explain telemetry changes in a specific PR (see the [example commit](https://github.com/devdotfast/whiteboard/commit/4837e107946e27ebad50c282eb0f2585210d2a35)). Agents can also query their own traces, linking decisions to visual nodes on the canvas. The decision log helps teams understand autonomous model choices and their impact on the codebase.

## Caveats to keep in mind
Whiteboard currently cannot edit files directly, so any code changes still require a separate editor. Browsing across multiple repositories in a single review is limited, and shared reviews do not auto‑update when the original author makes further edits—you must re‑share the review. The project does not yet list pricing or usage limits because the hosted team product is still in planning; the open‑source version runs entirely on your machine.

## When to try it
If your startup already uses LLM agents for code generation and you struggle with noisy diffs or lost design context, give Whiteboard a spin on a small feature branch. Its visual diff and decision‑log features can surface hidden trade‑offs early, and because it’s MIT‑licensed you can run it locally without committing to a SaaS plan.

---
[Watch the 1‑minute demo](https://www.youtube.com/watch?v=ChPn3ftULWE) for a quick tour.