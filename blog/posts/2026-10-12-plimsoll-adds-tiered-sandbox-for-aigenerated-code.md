---
date: '2026-10-12'
excerpt: 'A sandbox service for running untrusted, agent-authored code that reports
  the isolation boundary each run executed behind. Lessons, no clone needed: https://plimsollmark.github.io/plimsoll/trainers...'
image: https://bitroot.org/blog/media/2026-10-12-plimsoll-adds-tiered-sandbox-for-aigenerated-code.png
published_at: '2026-10-12T18:23:59.920268+00:00'
sources:
- https://github.com/plimsollmark/plimsoll
tags:
- sandbox
- agent code
- isolation
title: plimsoll adds tiered sandbox for AI‑generated code
---

plimsoll, an open‑source sandbox service, now lets you run untrusted, agent‑generated code and forces the daemon to report the isolation tier it actually used – process, container, kernel, or vm – while allowing callers to set a `MinimumIsolation` floor. A minimal example using the built‑in wasm provider finishes in 304 ms and reports the **process** tier.

## Tiered isolation you can verify
Each run returns an `Isolation` field indicating the concrete boundary the code executed behind. Callers can require a floor, for instance `MinimumIsolation: sandbox.IsolationVM`; if the daemon cannot meet that tier it returns `ErrInsufficientIsolation` and nothing runs. The four tiers are defined in the repo’s docs, from weakest (process) to strongest (vm) [plimsoll](https://github.com/plimsollmark/plimsoll).

## Credential‑less API calls via grants
plimsoll’s broker mints a short‑lived credential per run and injects it only when the sandbox makes an outbound API call. The code inside the sandbox never sees the token or the API address, and a missing grant blocks any network access. Grants can be scoped to specific routes, letting you expose only the endpoints an agent needs.

## Flexible back‑ends for different threat models
The daemon can switch providers via `SANDBOX_PROVIDER`: `wasm` (QuickJS on wazero) for fast local development, `docker` with `runc` for container‑level isolation, `docker` with `runsc` (gVisor) for kernel‑level protection, and hosted microVMs (E2B, Docker Cloud, OpenShell) for full VM isolation. Providers that run on your own machine (process, container, kernel) keep state in a session, while the VM providers run on external hosts and bill per run.

## Caveats to consider
The isolation tier is evidence collected by the daemon, **not** cryptographic attestation from hardware, so a compromised host could still lie about the tier. The default `process` tier offers no OS‑level wall, making it unsuitable for hostile code. The project does not publish pricing for the hosted VM providers, so cost estimation requires contacting the vendors directly.

**What to watch** – Try the wasm provider for quick local testing (no Docker needed) and set a `MinimumIsolation` floor that matches your risk tolerance. When you need stronger guarantees, experiment with the `runsc` (gVisor) or a hosted VM provider, and monitor the `Isolation` field to confirm you’re getting the expected protection level.