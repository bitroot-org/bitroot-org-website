---
date: '2026-05-18'
excerpt: GitHub’s Copilot CLI now supports Remote Control, letting developers start
  a session on one machine and pick it up on another. The feature is generally available
  and works with both CLI and VS Code sessions.
image: https://pbs.twimg.com/amplify_video_thumb/2056417858440105986/img/1h9mW1uxJ_qB6HOx.jpg
published_at: '2026-05-18T18:31:40.213687+00:00'
sources:
- https://x.com/i/status/2056420570745450864
tags:
- github
- copilot
- cli
title: GitHub Copilot CLI adds remote‑control for local sessions
video: media/2026-05-18-github-copilot-cli-adds-remotecontrol-for-local-se.mp4
---

GitHub announced that Remote Control for the Copilot CLI and @code sessions is now generally available, letting you start work on one computer and continue the same local session on another device via a simple command. The rollout is documented in the official [Remote Control guide](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-remote-control?utm_source=twitter-remote-control-docs-cta&utm_medium=social&utm_campaign=dev-pod-copilot-cli-2026) and was highlighted in a recent tweet from the company.

## How Remote Control works
Remote Control creates a lightweight bridge between the machine where the session originated and the device you want to continue on. When you invoke the remote command, the CLI streams the active session state—including open files, cursor positions, and in‑flight completions—to the target machine. The feature works with both the terminal‑based Copilot CLI and the VS Code extension, so you can hop between a laptop and a desktop without committing changes first.

## Practical benefits
For startup engineers who juggle multiple workstations, this eliminates the friction of context‑switching. You can start a heavy refactor on a desktop with a big monitor, then finish the same session on a laptop while traveling. Because the session remains local, you keep the same environment, dependencies, and private repo access, which can be safer than pushing unfinished code to a remote branch.

## Caveats and cost considerations
Remote Control is bundled with the existing Copilot subscription, so there’s no extra charge, but you still need an active Copilot plan (Individual or Teams). The feature relies on an outbound connection from the host machine, which may be blocked in restricted corporate networks. There’s also a modest security surface: session tokens travel over HTTPS and could be intercepted if your network is compromised, so treat remote sessions as you would any other authenticated connection. Early users have reported occasional latency spikes when the two machines are on high‑latency networks, leading to brief pauses in autocomplete suggestions.

## When to try it
If you frequently switch between a desktop and a laptop—or need to pair‑program from a remote location without sharing code—enable Remote Control now and test it on a small, non‑critical branch. Watch for updates on latency handling in the next minor release, and consider disabling it in environments where outbound network access is tightly controlled.