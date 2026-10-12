---
date: '2026-10-11'
excerpt: A little guy for every AI agent. Free and open source, for macOS.
image: https://bitroot.org/blog/media/2026-10-11-littleguys-adds-a-menubar-ui-for-local-claude-code.jpg
published_at: '2026-10-11T15:12:51.747481+00:00'
sources:
- https://littleguys.hervalicio.us
tags:
- macos
- agent tooling
- open source
title: littleguys adds a menu‑bar UI for local Claude, Codex, and OpenClaw agents
---

littleguys is now available as a free, open‑source macOS menu‑bar app that surfaces the status of your AI agents directly from the menu bar. Install it by running a one‑liner that pulls and builds the app from source – no pre‑built binary is shipped yet. The script fetches any missing dependencies (Xcode Command Line Tools, Rust, Node, pnpm) and places the built `littleguys.app` in `/Applications`.

## UI that lives in your menu bar
The app replaces dashboards and terminal prompts with a single icon that shows a live status ring, the latest agent message, and a quick‑reply button. Clicking the icon expands cards for pending commands, letting you approve, deny, or set a permanent rule with a single click. Scheduled routines (morning digests, nightly dependency bumps, weekly reports) are also reachable from the same UI.

## Agent support and protocol
littleguys speaks the Agent Client Protocol, so any ACP‑registered agent can be added with one click. Out of the box it ships with Claude Code, Codex, Gemini CLI, Goose, OpenCode, OpenClaw, gateway, Hermes, and generic ACP agents. It discovers agents on your Mac mini, homelab, or laptop via Tailnet and LAN without extra configuration.

## Installation footprint and cost
The installer writes everything under `~/.littleguys` and does not modify your shell profile. There is no subscription, telemetry, or cloud account required – the app simply holds your gateway tokens locally. The core is written in Rust with a React front‑end, packaged via Tauri.

## Cautionary notes
Because there is no downloadable binary, you must compile the app on each machine, which can take several minutes on the first run. The install script also pulls in development toolchains (Rust, Node, pnpm) that you may not need otherwise. Pricing is not applicable, but the lack of a pre‑built package may be a friction point for teams that prefer zero‑build tools.

## When to try it
If your startup already runs Claude Code, Codex, or OpenClaw agents locally and wants a lightweight, no‑cloud UI for monitoring and approving commands, give littleguys a spin after reading the script at [install.sh](https://littleguys.hervalicio.us/install.sh). Watch for the first build time and ensure your machines have the required build tools.

---
[Project page](https://littleguys.hervalicio.us)