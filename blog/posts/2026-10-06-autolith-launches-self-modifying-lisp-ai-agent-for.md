---
date: '2026-10-06'
excerpt: Autolith is a self-modifiable general purpose Lisp AI agent - lambda-symbolics/autolith
image: https://bitroot.org/blog/media/2026-10-06-autolith-launches-self-modifying-lisp-ai-agent-for.png
published_at: '2026-10-06T15:36:12.081429+00:00'
sources:
- https://github.com/lambda-symbolics/autolith
tags:
- lisp
- ai agent
- terminal
title: Autolith launches self-modifying Lisp AI agent for the terminal
---

The Lambda Symbolics team released **Autolith**, a self‑modifying general‑purpose Lisp AI agent that runs as a terminal agent inside a live Common Lisp image. The installer can be invoked with a single curl‑into‑sh command:

```
curl -fsSL https://sh.lambda-symbolics.com/autolith | sh
```

## Architecture and platform reach
Autolith embeds an agent inside a running Common Lisp image, allowing it to observe, introspect, and rewrite its own code while you work. It supports Linux (x86_64, aarch64), macOS (x86_64, aarch64), and the BSDs via pre‑built binaries, while Windows runs from a source checkout using the provided PowerShell bootstrap script. Platform support can be extended by contributors.

## Installing and authenticating providers
Besides the curl installer, the runtime is also available through Nix (`nix run github:lambda-symbolics/autolith`). After installation you can authenticate LLM providers with commands like `autolith auth chatgpt` or `autolith auth anthropic`. Once authenticated, launch the agent with `autolith` or start a fullscreen session via `autolith --fullscreen`.

## Core capabilities
* **Inline REPL** – The message window is a Lisp REPL; you can mix prose prompts with Lisp forms that execute directly in the active image.
* **Self‑modification tools** – Commands such as `lisp.eval` and `self.status` let the agent edit its own code, create isolated SBCL workers, and roll back changes via checkpoints and generations.
* **Recursive inference** – The `infer`, `rlm-map`, and `rlm-complete` primitives let Autolith process large contexts (e.g., log files) without exceeding model token limits, persisting traces under `data/inferences/`.
* **Vault for crash recovery** – Conversations are stored in append‑only files; commands like `(vault)`, `(vault-restore)`, and `(vault-discard)` let you inspect or replay prior messages after a crash.

## Cautionary notes
The announcement does not include pricing, usage limits, or a Windows binary; Windows users must build from source, which adds friction for teams that rely on simple installers. Also, the curl‑into‑sh installer requires trusting the script before execution.

**When to try it** – If your startup already uses Common Lisp or needs a REPL‑centric AI assistant that can modify its own runtime, give Autolith a spin on Linux or macOS. Keep an eye on upcoming Windows binaries and community‑contributed packages before adopting it in a production environment.