---
date: '2026-09-26'
excerpt: Contribute to paper-instruments/paper-docx development by creating an account
  on GitHub.
image: https://bitroot.org/blog/media/2026-09-26-paper-docx-provides-a-safe-fork-of-python-docx-for.png
published_at: '2026-09-26T13:30:50.213161+00:00'
sources:
- https://github.com/paper-instruments/paper-docx
tags:
- python
- docx
- open-source
title: paper-docx provides a safe fork of python-docx for Word editing
---

The `paper-docx` project announced a fork of the popular `python-docx` library that keeps the same `docx` import name but adds guarded APIs that reject unsupported edits rather than silently corrupting files. Installation is a single pip command – `python -m pip install paper-docx` – and the package replaces `python-docx` in the environment.

## Drop‑in replacement
Both `paper-docx` and the original `python-docx` expose a `docx` package, but you must **uninstall `python-docx` first** (`python -m pip uninstall -y python-docx paper-docx`) to avoid conflicts. Reverting is equally simple: uninstall `paper-docx` and reinstall `python-docx`. This design lets existing code import `docx` unchanged while gaining the safety checks.

## Safe redlining workflow
The fork ships a `compare` helper that writes differences between two `.docx` files as tracked changes. A minimal example creates two documents, calls `compare("original.docx", "revised.docx", author="Reviewer")`, and saves a redline file. The API reports `revision_count` (e.g., `2`) and **refuses any change it cannot represent safely**, preventing silent corruption that can arise with the upstream library.

## Licensing and contribution
`paper-docx` is released under the MIT license, inheriting the terms from `python-docx`. The repository includes a `CONTRIBUTING.md` and encourages pull requests. No pricing information is provided – the tool is free to use, and the page does not list any usage limits or commercial tiers.

## When to try it
If your startup builds LLM‑driven document pipelines and you need deterministic editing of Word files, swap in `paper-docx` in a dedicated virtual environment and run your existing `python-docx` code to catch unsafe operations early. Watch the repo for future releases that may add more guarded APIs.

[paper-docx on GitHub](https://github.com/paper-instruments/paper-docx)