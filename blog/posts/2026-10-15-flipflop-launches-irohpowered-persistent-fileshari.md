---
date: '2026-10-15'
excerpt: filesharing for the meatspace era. Contribute to andunieee/flipflop development
  by creating an account on GitHub.
image: https://bitroot.org/blog/media/2026-10-15-flipflop-launches-irohpowered-persistent-fileshari.png
published_at: '2026-10-15T13:49:30.952857+00:00'
sources:
- https://github.com/andunieee/flipflop
tags:
- file sharing
- tunneling
- open source
title: Flipflop launches Iroh‑powered persistent file‑sharing tunnels
---

Flipflop 0.1.0 was released with Iroh‑powered persistent tunnels that let any two or more devices exchange files on demand. The tool works over Bluetooth, local‑area networks, or the public internet and supports Linux, macOS, Windows, and Android.

## What the tunnel does
Flipflop creates a trusted connection between devices, allowing you to push files, plain‑text snippets, or links at any time. Because it builds on the Iroh library, the tunnel remains alive across network changes, which is useful for ad‑hoc sync between laptops, phones, or family members’ machines.

## Getting it running
The latest binaries are available on the [GitHub releases page](https://github.com/andunieee/flipflop). On Windows you can run the executable directly or install via the provided `-setup.exe`; note that Windows may show a "protected your PC" warning. macOS and Linux users can download the appropriate builds, while Android users need the APK built with `cargo-apk` and the Android SDK/NDK. Building from source is a single `cargo run --release` command for desktop targets.

## Caveats to consider
Flipflop does not currently support iOS, and the repository does not publish any pricing or usage limits, meaning you’ll have to assume it’s free but also uncommercialized. The Windows warning indicates the binary is not signed, which may be a concern for corporate security policies.

## When to try it
If your startup needs a quick, code‑free way to move files between development machines or to share assets with remote teammates without setting up a full VPN, Flipflop is worth a short test. Monitor the repository for signed releases or expanded platform support before adopting it in production pipelines.

**What to watch:** keep an eye on future releases for official code‑signing on Windows and any announced pricing model, which would clarify its suitability for larger teams.