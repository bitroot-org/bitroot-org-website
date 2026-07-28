---
date: '2026-07-17'
excerpt: 'kooky最新版本v0.36.0上线重磅功能keep awake，让你的笔记本电脑在合盖时，agent也能保持工作！


  auto档：在agent工作/ssh连接时，保持唤醒状态


  always档：电脑始终保持唤醒状态


  灵感源自于前几天看到一个推特老哥做的产品，感觉非常适合在终端里内置这个功能，欢迎体验！


  http://github.com/iAmCorey/kooky'
image: https://pbs.twimg.com/amplify_video_thumb/2077975717103423488/img/dCfQu5LFgLSqkRPp.jpg
published_at: '2026-07-17T10:40:24.582451+00:00'
sources:
- https://x.com/realcoreychiu/status/2077978244159000806
tags:
- kooky
- laptop
- automation
title: kooky 0.36 adds keep‑awake mode for laptops
video: media/2026-07-17-kooky-036-adds-keepawake-mode-for-laptops.mp4
---

kooky 0.36.0 ships a new **keep‑awake** command that prevents a closed‑lid laptop from sleeping while the agent or an SSH session is active. The release offers two modes: **auto** (wake only when an agent or SSH connection is detected) and **always** (force the machine to stay awake continuously).

## How the feature works
When you invoke `kooky keep-awake auto`, the tool monitors active agent processes and SSH sockets. If any are found, it temporarily disables the system’s sleep timer, allowing background jobs to finish. The `always` flag skips the detection step and simply disables sleep until you stop the command. The implementation hooks into macOS power management APIs, so it works out of the box on recent macOS releases.

## Enabling it in practice
Installation remains the same as prior versions—download the binary from the [GitHub repo](http://github.com/iAmCorey/kooky) or install via Homebrew. After upgrading, run `kooky keep-awake auto` in a terminal session that will host your long‑running agent. To stop the behavior, press `Ctrl‑C` or run `kooky keep-awake stop`. The feature is optional and does not alter existing kooky commands.

## Caveats to consider
Keeping a laptop awake while the lid is closed will draw power continuously, which can deplete the battery quickly. On machines without adequate cooling, prolonged wake‑states may cause thermal throttling. The detection logic is limited to processes started by the current user, so agents launched under a different UID will not trigger the auto mode. There is also no built‑in notification, so you must remember to stop the command manually.

## When to try it
If you regularly run CI agents or long‑lasting SSH jobs on a laptop that you like to close for ergonomics, the `auto` mode offers a low‑overhead way to keep those jobs alive. Test it on a fully charged machine first to gauge the battery impact, and consider switching to `always` only for short, critical runs.

*Watch the repository for any upcoming power‑management tweaks and for community scripts that wrap the keep‑awake command in more granular workflows.*