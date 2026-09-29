---
date: '2026-09-29'
excerpt: A shared contract for commands, saved outcomes, and recovery.
image: https://bitroot.org/blog/media/2026-09-29-durable-actor-session-protocol-adds-reliable-recon.png
published_at: '2026-09-29T15:16:02.823578+00:00'
sources:
- https://dasp-protocol.github.io/dasp/
tags:
- distributed systems
- protocol
- actor model
title: Durable Actor Session Protocol adds reliable, reconnectable actor sessions
---

The Durable Actor Session Protocol (DASP) released a spec that defines a server‑side protocol for *durable actors*. The core of the design is a set of five client operations—`session.open`, `command`, `view.read`, `updates.read`, and `outcome.read`—that let a client open or return to a saved session, submit work, and later replay missed updates after a disconnect. The spec shows a concrete command ID format like `cmd-042` and a clear flow for saving admission receipts before outcomes, enabling reliable retries.

## How DASP structures a session
Clients connect to a DASP server and interact through the five short‑named messages. When a command is submitted, the server first records an admission receipt, then later stores the final outcome (completed, failed, cancelled, or uncertain). If the network drops, the client can reconnect, read the last applied update, and replay any missing commands using the stored IDs. This separation of admission and outcome keeps progress temporary while persisting the final result.

## Shared sessions across tools
The protocol is designed for multiple clients—web app, CLI, or service—to share a single actor session. Each client gets its own cursor into the ordered history, but the underlying update order is identical for everyone. The spec lists native client implementations in Elixir and TypeScript, both marked *experimental*, meaning you must supply your own transport and storage layers.

## When (not) to adopt DASP now
Because the only released artifacts are the specification and experimental client libraries, there is no production‑grade binding, hosted service, or pricing model disclosed. The page does not list any cost or usage limits, so teams should treat DASP as a prototype rather than a turnkey solution. If your startup already builds custom stateful services and needs deterministic replay after failures, DASP provides a clear contract to build on; otherwise, the lack of stable libraries may add engineering overhead.

## What to watch
Keep an eye on the DASP repository for a stable release or hosted service announcement. When a production‑ready client appears, evaluate it against existing session‑store patterns to decide if the added protocol guarantees outweigh the integration effort.