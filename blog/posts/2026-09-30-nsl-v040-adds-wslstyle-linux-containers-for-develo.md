---
date: '2026-09-30'
excerpt: WSL-style Linux machines for Linux hosts.
image: assets/nsl.svg
published_at: '2026-09-30T15:30:25.425525+00:00'
sources:
- https://frostyard.github.io/nsl/
tags:
- containers
- development
- linux
title: NSL v0.4.0 adds WSL‑style Linux containers for developers
---

The NSpawn Subsystem for Linux (NSL) hit v0.4.0, a pre‑release that lets you spin up WSL‑style Linux machines on a Linux host with a single `nsl create debian --distro debian:13` command. The tool verifies signed images before use and starts containers on demand.

## Container model and workflow
[NSL](https://frostyard.github.io/nsl/) runs each machine as a systemd‑nspawn container inside a shared QEMU VM. You create a machine with `nsl create <name> --distro <distro>` and then drop into a shell (`nsl`) or execute a single command (`nsl run make test`). The exit status of the command is returned to the host, making it easy to script builds.

## File and user integration
The container mirrors your host $HOME, /run/media/USER, and /mnt under `/mnt/host`, preserving your UID/GID so files you create remain owned by you. Inside the machine you get passwordless `sudo`, so you can install packages without additional configuration.

## Isolation and networking
For untrusted workloads you can add `--isolated` to launch the container in its own VM, cutting off host files, desktop, and actions. Development servers expose ports on the host’s 127.0.0.1, and Wayland apps can open windows via Waypipe, letting GUI tools run inside the container.

## Caveats and when to try it
NSL is still pre‑release; v0.4.0 is the first release of this design and the page does not list any pricing or usage limits. It has only been tested on Snow Linux 13 with systemd 261.2, QEMU 10.0.13, and virtiofsd 1.13.2, so compatibility on other distros may vary. If you need a disposable distro for testing or CI on a Linux host, give NSL a spin, but keep it confined to non‑critical projects until a stable version lands.