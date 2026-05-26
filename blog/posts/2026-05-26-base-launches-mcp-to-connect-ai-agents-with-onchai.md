---
date: '2026-05-26'
excerpt: Base introduced MCP, a gateway that lets AI agents link to a Base account,
  trade assets, and call plugins from other apps. Early adopters should weigh the
  convenience against the nascent security model.
image: https://pbs.twimg.com/amplify_video_thumb/2059305823117975552/img/wWyQQ--0lsuZI3T7.jpg
published_at: '2026-05-26T19:31:24.396110+00:00'
sources:
- https://x.com/i/status/2059305907385704529
tags:
- base
- agent
- onchain
title: Base launches MCP to connect AI agents with on‑chain trading
video: media/2026-05-26-base-launches-mcp-to-connect-ai-agents-with-onchai.mp4
---

Base announced **MCP**, a new gateway that lets an AI agent attach to a Base account, then swap, trade, and manage a crypto portfolio directly from the agent. The tweet highlights three capabilities: connection to a Base account, portfolio actions, and plugin integration with leading apps on Base [Base MCP announcement](https://x.com/i/status/2059305907385704529).

## How MCP works
MCP acts as a thin wrapper around the Base smart‑contract stack. Once an agent is authenticated, it can issue standard swap calls, execute trades on supported DEXes, and invoke third‑party plugins for things like price feeds or order routing. The design assumes the agent holds the private key for the linked account, so any transaction the agent sends is signed on‑chain.

## Getting started
Developers can enable MCP by registering their agent in the Base dashboard, which generates an API token tied to the user’s wallet. The token is then passed to the agent runtime, which uses it to sign transactions. Documentation is currently limited to the tweet thread and a short guide in the Base docs, so early users should expect to experiment with the CLI and SDK themselves.

## Caveats and trade‑offs
MCP is an **early‑stage** feature. Because the agent holds the signing key, a compromised agent could move funds without additional checks. There is also no public pricing information yet; Base may charge for API calls or impose rate limits later. Finally, the plugin ecosystem is still forming, so integration options may be sparse or unstable.

## When to try it
If your startup is already building AI‑driven trading bots on Ethereum‑compatible chains, spin up a test account on Base and connect a sandboxed agent to evaluate MCP’s latency and plugin coverage. Keep the funds in a low‑value wallet and monitor transaction logs for unexpected behavior.

**What to watch:** Base’s upcoming pricing announcement and any security audits of the MCP token‑handling flow.