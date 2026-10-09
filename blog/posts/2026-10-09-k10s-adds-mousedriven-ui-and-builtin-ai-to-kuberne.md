---
date: '2026-10-09'
excerpt: Kubernetes TUI you can click. Instant search, logs/exec/port-forward, 7 themes,
  context-aware AI. Single Go binary. - p10node/k10s
image: https://bitroot.org/blog/media/2026-10-09-k10s-adds-mousedriven-ui-and-builtin-ai-to-kuberne.png
published_at: '2026-10-09T15:41:55.451357+00:00'
sources:
- https://github.com/p10node/k10s
tags:
- kubernetes
- tui
- ai
title: k10s adds mouse‑driven UI and built‑in AI to Kubernetes terminal
---

The open‑source project [k10s](https://github.com/p10node/k10s) released a new version that turns the classic terminal‑only Kubernetes UI into a point‑and‑click experience and bundles an AI prompt (ctrl+a) that knows your current context, namespace and selected object. You can get it instantly with a one‑liner: `curl -fsSL https://p10node.com/k10s/install.sh | sh`.

## Clickable panes replace memorised shortcuts
k10s displays actions for the selected resource in a side pane, and you can activate them by clicking or pressing the highlighted letter. The mouse works across rows, panes, and even theme pickers, so new teammates can navigate without learning a long list of keystrokes. All watches start lazily – the UI only contacts the API for the kinds you actually view, keeping start‑up time near zero.

## Integrated AI that stays on‑device
Pressing **ctrl+a** opens an AI prompt where the current context, namespace, kind and object are injected into the query. The tool supports any OpenAI‑compatible provider (including Claude, Groq, Ollama, etc.) and the answer appears in a scrollable text pane. The only network traffic besides a daily version check is the AI request you trigger, and no cluster data leaves the machine unless you submit it.

## Installation and upgrade are self‑contained
Pre‑built static binaries exist for macOS, Linux and Windows (amd64 and arm64). The installer script verifies the SHA‑256 checksum and places the binary in `/usr/local/bin` (or `~/.local/bin` without sudo). Upgrading is as simple as running `k10s update`, which atomically replaces the running binary.

## Caveats to consider
The AI API key is stored in plain text inside `~/.k10s/config.yaml` (mode 0600) – a potential security concern for shared environments. The announcement does not include any pricing model because the tool is free and open source, so you’ll need to evaluate operational cost (e.g., AI usage fees) yourself.

**When to try it** – Spin up the built‑in demo (`k10s demo`) to explore the UI without a cluster, then point the binary at your dev kubeconfig. If you frequently need quick logs or want a low‑friction way for teammates to inspect resources, give k10s a test run during your next sprint.