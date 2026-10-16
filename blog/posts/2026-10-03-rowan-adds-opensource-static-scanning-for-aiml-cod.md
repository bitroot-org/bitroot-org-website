---
date: '2026-10-03'
excerpt: 'Static security scanner for AI applications: source code, model files, dependencies
  and agent/MCP config, with evidence for every finding. - hedgerow-dev/rowan'
image: https://bitroot.org/blog/media/2026-10-03-rowan-adds-opensource-static-scanning-for-aiml-cod.png
published_at: '2026-10-03T14:06:02.432335+00:00'
sources:
- https://github.com/hedgerow-dev/rowan
tags:
- security
- sast
- ai
title: Rowan adds open‑source static scanning for AI/ML code
---

Rowan, an open‑source SAST scanner built for AI/ML applications, reached alpha status this week. It can scan source code, model artifacts and dependency lists in a single run, and it never executes the target code.

## What Rowan checks
The tool reads Python, JavaScript/TypeScript, and a handful of other languages to look for injection, unsafe deserialization, SSRF, leaked secrets, and AI‑specific risks such as unsafe model loading or risky agent tools. Its rule catalog contains **591 rules** across 48 YAML files – 400 regex rules and 191 taint rules powered by the Opengrep engine. It also queries OSV for known CVEs and can output CycloneDX SBOMs.

## Quick start workflow
Install with **pipx** (or `uv tool install`) on Python 3.10+:
```bash
pipx install "rowan-sast[js-crossfile]"
rowan install-engine
rowan self-test   # should print [OK] three times
rowan scan /path/to/project
```
The official docs walk through these steps in more detail ([getting‑started guide](https://github.com/hedgerow-dev/rowan/blob/main/docs/getting-started.md)).

## CI integration
Rowan supports a `--ci` flag that exits 0 for no findings, 1 for high/critical issues, and 2 if the scan is incomplete. You can combine it with `--baseline` to report only new findings, or export JSON, HTML, or SARIF for downstream tooling. This makes it straightforward to gate merges in a CI pipeline.

## Caveats to keep in mind
The project is still **alpha**, and its authors stress that a clean report does **not** prove a project is secure. Language coverage is deeper for Python and JS/TS; Go, Java, Kotlin, C# get only within‑file analysis, and Ruby, PHP, Rust see limited pattern checks. Network traffic occurs only for dependency lookups (OSV/FIRST EPSS) unless you disable it with `--no-sca`. An experimental `rowan hunt` command can send code to a configured LLM, but that feature is optional and not covered in the default workflow.

**When to try it** – If your startup ships AI services and already runs static analysis on code, add Rowan to your pipeline to surface model‑loading and agent‑tool risks. Start with a local scan on a non‑critical repo; once you’re comfortable with the false‑positive rate, integrate the `--ci` mode into your CI.

[Rowan on GitHub](https://github.com/hedgerow-dev/rowan)