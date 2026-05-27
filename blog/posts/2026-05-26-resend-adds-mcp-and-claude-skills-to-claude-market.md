---
date: '2026-05-26'
excerpt: "We added @resend MCP and skills to the @ClaudeDevs Marketplace.\n\n1. Type
  /plugins in Claude Code\n2. Search for resend\n3. Install\n\nAll skills, Resend
  MCP. One command \U0001F447"
image: https://pbs.twimg.com/amplify_video_thumb/2059274186934407168/img/pAbWgskgEtgHoGEP.jpg
published_at: '2026-05-26T19:30:23.237027+00:00'
sources:
- https://x.com/i/status/2059275268276224331
tags:
- resend
- claude
- plugin integration
title: Resend adds MCP and Claude skills to Claude Marketplace
video: media/2026-05-26-resend-adds-mcp-and-claude-skills-to-claude-market.mp4
---

Resend announced that its Mailer Communication Platform (MCP) and a bundle of Claude skills are now available in the Claude Marketplace, installable with a single `/plugins` command inside Claude Code. The tweet highlights the three‑step process: type `/plugins`, search for “resend”, and hit install.

## How to get the Resend MCP skill

1. Open Claude Code and enter `/plugins`.
2. In the plugin search box, type **resend**.
3. Click **Install** next to the Resend MCP entry.

After installation, you can invoke the skill with a single command that returns a JSON payload describing the email operation. This tight integration means you can draft, send, and track emails without leaving the Claude environment, which is useful for rapid prototyping and internal tooling.

## What the skill actually does

The Resend MCP skill wraps the core Resend API endpoints (send, schedule, and status) behind a conversational interface. When you ask Claude to “send an email to X with subject Y”, Claude translates the request into the appropriate API call and returns a JSON confirmation. This reduces the need to write boilerplate HTTP client code, but it also means you’re dependent on Claude’s parsing logic, which can occasionally misinterpret complex email bodies or attachments.

## Trade‑offs and cautions

- **Scope limitation**: The skill only covers the most common email actions; advanced features like batch sending, templates, or webhook callbacks are not exposed yet.
- **Potential false positives**: Because the skill interprets natural‑language input, ambiguous phrasing can lead to malformed requests. Testing in a sandbox environment is recommended before production use.
- **Lock‑in risk**: Relying on Claude’s plugin system ties your workflow to the Claude platform. If you later switch to another LLM, you’ll need to re‑implement the email logic.
- **Pricing opacity**: Resend’s pricing model isn’t detailed in the announcement, so cost implications of high‑volume email sends remain unclear.

## When to try it

If you’re already using Claude for code assistance or internal bots, spin up a quick sandbox project and install the Resend MCP skill to validate the API flow. Monitor the JSON responses for accuracy and compare against direct API calls before committing to production use.

---

Sources: [Resend's announcement tweet](https://x.com/i/status/2059275268276224331)