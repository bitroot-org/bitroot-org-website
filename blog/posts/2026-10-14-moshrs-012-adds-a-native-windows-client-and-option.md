---
date: '2026-10-14'
excerpt: 'Rust reimplementation of mosh (the mobile shell): wire-compatible with mosh-server
  1.4, native Windows client, scrollback - Arunjay4213/mosh-rs'
image: https://bitroot.org/blog/media/2026-10-14-moshrs-012-adds-a-native-windows-client-and-option.png
published_at: '2026-10-14T14:14:17.118911+00:00'
sources:
- https://github.com/Arunjay4213/mosh-rs
tags:
- mosh
- rust
- remote shell
title: Mosh‑rs 0.1.2 adds a native Windows client and optional scrollback
---

The pre‑alpha v0.1.2 release of [mosh‑rs](https://github.com/Arunjay4213/mosh-rs) ships native Windows binaries and a `--scrollback` flag that records session output in the local terminal history.

## New capabilities over upstream mosh
Mosh‑rs is a line‑by‑line port of the upstream C++ code, keeping protocol compatibility with mosh 1.4 so existing `mosh-server` installations continue to work. Two features that upstream never had are now available:
* **Native Windows client** – a pre‑built `mosh.exe` for x86_64 Windows (runs on Arm via emulation) without needing WSL or Cygwin.
* **Scrollback** – enabled with `mosh --scrollback host`; the server side must also be the mosh‑rs server, otherwise the flag falls back to the original behavior.
Both are optional and do not affect standard usage.

## Installing on common platforms
The release provides static binaries for Linux (x86_64 and aarch64) and macOS Apple‑silicon, each with accompanying SHA‑256 checksums. On Linux you can download and install with:
```bash
v=v0.1.2
t=$(uname -m)-unknown-linux-musl
curl -LO https://github.com/Arunjay4213/mosh-rs/releases/download/$v/mosh-rs-$v-$t.tar.gz
curl -LO https://github.com/Arunjay4213/mosh-rs/releases/download/$v/mosh-rs-$v-$t.tar.gz.sha256
sha256sum -c mosh-rs-$v-$t.tar.gz.sha256
```
Windows users can fetch the zip from the same release URL and unzip it; the launcher uses the built‑in OpenSSH client. Homebrew and Scoop taps are also provided, though the Homebrew formula conflicts with the existing `mosh` package and must be unlinked first.

## Compatibility and performance notes
All interop tests (clean, 5 % loss, 30 % loss with 200 ms delay, 2‑minute blackout, client address change) passed for every client/server combination, including the new scrollback mode. Benchmarks show comparable or lower memory usage (client 4.1 MiB vs 14.3 MiB for upstream) and similar startup latency (≈250 ms first frame). The implementation forbids unsafe Rust in most crates, but the platform crate contains a few unsafe blocks with documented invariants.

## Caveats and when to try it
The project is labeled **pre‑alpha**, so expect rough edges and limited testing on macOS (v0.1.0 cannot connect). There is no native Windows server binary, and the repo does not list a security audit. Because the software is free and open‑source, cost is not a factor, but you should validate the Windows client on a non‑critical machine before adopting it in production.

**What to watch:** keep an eye on the upcoming stable releases and any added Windows server support; try the v0.1.2 binaries on a dev box to confirm scrollback works with your existing `mosh-server` setup.