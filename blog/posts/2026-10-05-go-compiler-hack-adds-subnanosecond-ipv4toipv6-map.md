---
date: '2026-10-05'
excerpt: Go maintainers declined netip.Addr.Map() saying the compiler should optimize
  netip.AddrFrom16(ip.As16()) instead. How difficult is it to implement?
image: https://bitroot.org/blog/media/2026-10-05-go-compiler-hack-adds-subnanosecond-ipv4toipv6-map.jpg
published_at: '2026-10-05T17:38:36.482387+00:00'
sources:
- https://vincent.bernat.ch/en/blog/2026-go-netip-addrto6
tags:
- go
- networking
- compiler
title: Go compiler hack adds sub‑nanosecond IPv4‑to‑IPv6 mapping
---

The blog post "Hacking the Go compiler to efficiently map IPv4 to IPv6" demonstrates a compiler‑level rewrite that makes `netip.Addr` conversion from IPv4 to IPv4‑mapped IPv6 run in 0.88 ns, versus the 7.14 ns cost of the usual `netip.AddrFrom16(ip.As16())` pattern [link](https://vincent.bernat.ch/en/blog/2026-go-netip-addrto6).

## Why a fast mapping matters
`netip.Addr` stores IPs as a 128‑bit value plus a family field (`z`). Converting an IPv4 address to its IPv6‑mapped form currently requires packing the address into a 16‑byte slice, calling `As16()`, then unpacking with `AddrFrom16()`. This extra copy makes the operation eight times slower than a native method, which can be a bottleneck in high‑throughput services.

## Three practical approaches
* **Standard library helper** – A thin wrapper calls `netip.AddrFrom16(ip.As16())` when the address is IPv4. It works but costs ~7 ns per call.
* **Unsafe struct hack** – By reinterpreting the `netip.Addr` layout via `unsafe.Pointer`, the conversion matches the standard‑library speed (≈0.87 ns). This approach bypasses the unexported `z` field.
* **Compiler rewrite** – The author patches the Go compiler’s "noding" phase to replace the `AddrFrom16(As16())` pattern with a literal struct `netip.Addr{addr: ip.addr, z: netip.z6noz}`. The generated assembly is identical to the unsafe version and runs in under a nanosecond.

## Trade‑offs and cautions
The compiler hack depends on internal details of `net/netip.Addr` (the `z` field and its constants). Go maintainers consider such changes "unlikely to be accepted" because they rely on non‑public struct layout [link](https://vincent.bernat.ch/en/blog/2026-go-netip-addrto6). Maintaining a custom compiler fork adds complexity and may break with future Go releases.

### When to try it
If your service performs millions of address conversions per second and the standard helper shows measurable latency, experiment with the unsafe helper first – it needs no compiler changes and already hits sub‑nanosecond performance. Keep an eye on upcoming Go releases or community proposals that might add an official `To6` method, which would make the hack unnecessary.