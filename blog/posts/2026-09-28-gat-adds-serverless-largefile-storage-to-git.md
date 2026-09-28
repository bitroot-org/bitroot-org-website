---
date: '2026-09-28'
excerpt: "Simple, fast, versioned large-file storage for git \U0001F680 https://getgat.dev
  - getgat-dev/gat"
image: https://opengraph.githubassets.com/ee3beb00a822ac7ab2b21eeb81d71a940c0598aebba8417cdd610b6b93f3dcb2/getgat-dev/gat
published_at: '2026-09-28T17:13:53.921810+00:00'
sources:
- https://github.com/getgat-dev/gat
tags:
- git
- large files
- open source
title: gat adds serverless large‑file storage to Git
---

The new **gat** tool can be installed in one line with `curl -fsSL https://getgat.dev/install.sh | sh` and immediately provides versioned large‑file storage for Git repositories without requiring a separate LFS server.

## How gat fits into a normal Git workflow
`gat` mirrors the core Git commands – `add`, `commit`, `push`, `pull`, `clone` – so you keep using Git as usual. After running `gat init`, the tool installs Git hooks that invoke `gat sync` after checkout, merge/pull, and rebase/amend. Large files are added with `gat add <path>` and tracked via a `gat.lock` file, which is committed alongside your code. When you push, `gat push --remote origin` uploads the binaries to the configured object store (e.g., S3, Azure Blob, GCS). Clones run `gat init` once, then `gat pull` to fetch any missing assets.

## Installation and platform support
The installer works on Linux and macOS via the curl script, and on Windows via PowerShell. For developers who prefer building from source, `cargo install --locked --bin gat --git https://github.com/getgat-dev/gat gat` works with Rust 1.91 or newer (the minimum supported Rust version). The repo and documentation are hosted at the [gat GitHub repository](https://github.com/getgat-dev/gat).

## What you need to provide yourself
Unlike Git LFS, **gat** does not run its own server. You must supply an external object store – an S3 bucket, Azure Blob container, GCS bucket, or even a plain directory – and configure the remote with `gat remote add origin 's3://my-bucket/assets?region=eu-west-1'`. The tool does not set a default remote; each transfer requires specifying `--remote` or configuring a default with `gat remote default origin`.

## Caveats and missing pieces
The documentation does not list any pricing because the software is free and open‑source, but it also does not detail limits on storage size, bandwidth, or concurrency – those are governed entirely by the chosen backend. Additionally, every clone must run `gat init` before any large‑file operations, which adds a manual step to onboarding new developers.

**When to try it**: If your startup already stores model weights, media assets, or other binaries in S3 (or a compatible store) and you want to keep a single Git history without running an LFS server, spin up a test repo, run the installer, and validate the `gat add / push / pull` cycle before rolling it out to the whole team.