---
date: '2026-10-03'
excerpt: We are a small, independent game studio, currently working on our first game.
image: /images/icons/aao.svg
published_at: '2026-10-03T14:06:43.936999+00:00'
sources:
- https://againstallodds.games/
tags:
- indie game
- risc-v
- linux
- early access
title: Indie game SEEDS ships with a built‑in 64‑bit RISC‑V Linux emulator
---

The sandbox‑focused indie title SEEDS, currently in Early Access, includes a complete 64‑bit RISC‑V virtual machine that boots an unmodified Linux kernel and a lightly tweaked Alpine Linux distribution inside the game world【https://againstallodds.games/】.

## A Linux VM inside a planet‑terraforming game
SEEDS lets you explore, terraform, and build machines on a desolate planet, but it also gives you an in‑game computer. This computer runs a genuine Linux kernel, so any Linux binary that fits the 64‑bit RISC‑V ABI can be executed from within the game. Players can write code in their preferred language, compile it to RISC‑V, and run it on the virtual machine to automate base functions or play mini‑games on in‑game monitors.

## What this means for engineers
The embedded VM offers a sandbox for low‑level experimentation without leaving the game. You can prototype RISC‑V code, test kernel‑level patches, or run simple services that interact with the game's APIs. Because the VM uses a standard Linux distribution, familiar tools (gcc, clang, make) work as expected, making it a handy playground for developers who want to try RISC‑V without setting up separate hardware.

## Early‑access caveats
SEEDS is still in active development and not feature‑complete. The current build only offers sandbox mode; survival and story modes are still in beta and will be rolled out later. No pricing or performance limits are listed on the site, so you’ll need to join the Early Access build to gauge resource usage and stability.

## When to give it a spin
If you’re curious about on‑the‑fly RISC‑V development or want a low‑stakes environment to test Linux binaries, watch for the Q4 2026 Early Access release and add SEEDS to your Steam wishlist. Trying the game now can surface early feedback and let you experiment with in‑game automation before the full feature set lands.