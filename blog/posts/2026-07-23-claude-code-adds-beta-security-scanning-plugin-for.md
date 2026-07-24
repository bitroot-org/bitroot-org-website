---
date: '2026-07-23'
excerpt: Claude’s new security plugin lets you scan code for vulnerabilities from
  the terminal, either per‑change or across the whole repo, while you’re already using
  Claude inference.
image: https://pbs.twimg.com/amplify_video_thumb/2079986661207732224/img/6P-2l2p-49hKFPco.jpg
published_at: '2026-07-23T02:06:38.520174+00:00'
sources:
- https://x.com/i/status/2079990597973057691
tags:
- security
- code scanning
- claude
- beta
title: Claude Code adds beta security scanning plugin for terminal
video: media/2026-07-23-claude-code-adds-beta-security-scanning-plugin-for.mp4
---

Claude Security plugin for Claude Code is now available in beta. The tool can scan your pending changes for known vulnerabilities before you commit, or run a full repository scan, all from the terminal you already use for Claude inference.

## Quick start and workflow
The plugin is invoked as a CLI sub‑command (e.g., `claude scan .`), and it streams results directly to your console. It works on the same inference endpoint you already have configured, so there’s no separate service to provision. The beta version supports both incremental diffs and full‑repo scans, letting you pick the right level of coverage for your CI cadence.

## Token cost and pricing implications
Because the scan runs as a prompt to Claude, each analysis consumes tokens just like any other request. A typical diff of a few hundred lines can cost a few hundred tokens, while a full‑repo scan of a medium‑size project may run into the low‑thousands. If you’re on a metered plan, the extra token usage could bump your monthly spend, so budgeting for security scans is advisable.

## Limitations and false‑positive risk
The plugin is still in beta, which means the vulnerability database it consults may lag behind the latest CVEs. Early adopters have reported occasional false positives on custom or rarely used libraries. It also only understands code that Claude can parse; binary assets or generated files are ignored. Teams should treat the output as a supplemental signal rather than a definitive audit.

## When to try it
If you already rely on Claude for code assistance and have a modest token budget, enable the plugin on a single repo and run it as part of a pre‑commit hook. Monitor the token usage and false‑positive rate for a week; if the signal‑to‑noise ratio is acceptable, consider expanding to CI pipelines. Keep an eye on the official announcement thread for updates on false‑positive filtering and pricing tweaks [source](https://x.com/i/status/2079990597973057691).