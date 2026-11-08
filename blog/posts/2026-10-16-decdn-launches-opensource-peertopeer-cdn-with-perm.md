---
date: '2026-10-16'
excerpt: Decentralized CDN where nodes cache and serve content-addressed blobs over
  iroh QUIC, and clients pay per-MB via off-chain USDC shared payment pools. - decdn/decdn
image: https://bitroot.org/blog/media/2026-10-16-decdn-launches-opensource-peertopeer-cdn-with-perm.png
published_at: '2026-10-16T13:39:48.441207+00:00'
sources:
- https://github.com/decdn/decdn
tags:
- decentralized cdn
- peer-to-peer
- rust
- payment
title: deCDN launches open‑source peer‑to‑peer CDN with per‑MB USDC billing
---

The deCDN project released its first public testnet on Arbitrum Sepolia, offering a Rust implementation where bonded operators cache BLAKE3‑addressed blobs and clients settle each megabyte with USDC vouchers. Operators must bond a native TOKEN (e.g., 50,000 TOKEN for up to ~997 Mbps) and fund a payment pool (10 USDC default) before serving content.

## How the network works
Clients select nodes from an on‑chain registry based on round‑trip latency, then pull content over iroh QUIC. Every byte is verified against its BLAKE3 hash, so any node can serve any blob without trust. When a node misses a cache entry it can pull from its own origin backend (S3, R2, HTTP, etc.) or, if enabled, from a peer, paying the upstream pull with its own pool.

## Installing and running a node
The release includes two binaries: `decdn-node` (the daemon) and `decdn` (CLI). Install via Cargo (`cargo install --locked decdn-cli decdn-node`) or pull Docker images (`ghcr.io/decdn/decdn-node` and `ghcr.io/decdn/decdn`). After initializing the config (`decdn config init`) and bonding (`decdn node bond --mbps <n>`), operators run `decdn-node run` and monitor health with `decdn node health`. All images run as UID 1000, but the UID can be overridden for custom environments.

## Paying for bandwidth
Clients create a single shared `PaymentPool` and fund it with USDC. The pool covers all providers used during a fetch, eliminating per‑provider setup. Vouchers are signed off‑chain and redeemed by providers; the pool can be topped up automatically when the balance falls low. The on‑chain contracts handle bonding, voucher redemption, fee splits, and slashing.

## Caveats and missing details
The documentation notes that many ADRs remain in draft status, meaning the protocol and wire formats may change without compatibility shims. Pricing beyond the default 10 USDC deposit is not disclosed, and the system currently runs only on a testnet; production deployment targets Arbitrum One but is not yet live. Operators also need to obtain testnet ETH and TOKEN from the project's contact channels.

**When to try it** – If your startup already uses Rust and is comfortable provisioning a small VM with UDP 4433 open, spin up a node on Sepolia to experiment with pay‑per‑byte content delivery and evaluate the economic model before a production rollout.

[deCDN repository](https://github.com/decdn/decdn)