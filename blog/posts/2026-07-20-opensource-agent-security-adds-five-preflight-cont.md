---
date: '2026-07-20'
excerpt: Nyk released the MIT‑licensed agent‑security CLI, which provides five lightweight
  preflight checks to harden coding agents before they touch a repository.
image: https://pbs.twimg.com/media/HNpWAEUakAAY5Sj.jpg?name=orig
published_at: '2026-07-20T11:39:02.512801+00:00'
sources:
- https://x.com/nykdotdev/status/2079068942681993237
tags:
- security
- cli
- open-source
title: Open‑source agent-security adds five preflight controls
---

Nyk 🌱 announced the open‑source release of **agent‑security** today, a tiny CLI that ships five distinct controls – for example, the `scan` command that inspects a repository for credential patterns, private paths, invisible Unicode, and same‑file decode‑to‑exec signatures. The repo is MIT licensed and includes offline fixture suites, ShellCheck, and Gitleaks integrations.

## What the tool does

* `scan` runs a fast static check before publishing code, flagging known secret shapes and obscure encodings.
* `vet` evaluates incoming templates, packages, or plugins without executing them, returning **ADOPT**, **REVIEW**, or **REJECT**.
* `scan-content` adds a prompt‑injection guard for fetched pages, pasted text, and tool output, tripping on known instruction‑override or credential‑solicitation patterns.
* `guard` intercepts destructive GitHub CLI (`gh`) actions – delete, transfer, rename, archive, visibility changes – and forces explicit confirmation for the exact repository.
* `harden` audits the remaining attack surface after local guards fail, checking whether the active GitHub token and server‑side policy could still delete a repo. It reports **UNKNOWN** instead of a false green check.

## Trade‑offs and limitations

The project is transparent about what regex‑based checks cannot prove. Novel wording, encoding tricks, or multi‑line instruction splits can evade `scan-content`. Cross‑file code flow still requires a dedicated taint‑analysis tool such as CodeQL. A direct API client can bypass the `guard` layer, so you still need broader token‑scoping policies. In short, the CLI reduces low‑hanging‑fruit attacks but is not a replacement for full‑stack security tooling.

## How to try it

Clone the repo, run the one‑minute quickstart (`./agent-security quickstart`), and observe the output on a test repository. If the scan passes cleanly, you have a baseline of known‑pattern safety; if it trips, treat the report as a prompt to tighten the boundary you expose to coding agents.

## What to watch

Monitor the upstream repo for new control additions and for community‑submitted patterns that extend the prompt‑injection database. When you start using AI‑driven agents in CI/CD, run `agent-security vet` on every new plugin before it reaches production.

[Source tweet](https://x.com/nykdotdev/status/2079068942681993237)