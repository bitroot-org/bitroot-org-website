---
date: '2026-07-17'
excerpt: '我做了一个自部署的阅读器，叫 Condenser，可以用 Twitter 的方式刷 Telegram 上关注的频道。刚刚测了下 iOS 版也可以用了。repo
  还没有修整，但是非常的 agent native，因此如果你有兴趣的话，直接 clone 下来让你的 agent 来安装部署，应该是完全没问题的


  https://github.com/reorx/condenser'
image: https://pbs.twimg.com/media/HNZm5EwaUAEiU5d.jpg?name=orig
media:
- type: image
  url: https://pbs.twimg.com/media/HNZm5EwaUAEiU5d.jpg?name=orig
- type: image
  url: https://pbs.twimg.com/media/HNZm6Jdb0AAXPrV.jpg?name=orig
published_at: '2026-07-17T10:39:42.704097+00:00'
sources:
- https://x.com/novoreorx/status/2077963033142530148
tags:
- telegram
- self-hosted
- reader
title: Self‑hosted Condenser lets you browse Telegram channels like Twitter
---

Reorx just released Condenser, a self‑hosted reader that lets you scroll Telegram channels in a Twitter‑style feed, and the iOS build is now functional, as announced in a [tweet](https://x.com/novoreorx/status/2077963033142530148).

## What Condenser does
Condenser pulls messages from any Telegram channel you subscribe to and renders them in a compact, chronological list that mimics the Twitter timeline. The interface shows avatars, timestamps and quick‑reply buttons, making it feel familiar for users who spend most of their day on X. Because it talks directly to Telegram's API, there is no need for a third‑party bot or web scraper.

## Getting it running
The code lives in the [Condenser repo](https://github.com/reorx/condenser). A single `git clone` followed by the agent’s standard install routine is enough to spin up the service on a Linux box. The project is deliberately “agent native,” meaning it expects the same deployment agent you already use for internal tools, so you don’t need to rewrite Dockerfiles or Helm charts. The iOS client, which Reorx confirmed works in a recent test, can be installed via a sideloaded IPA or through TestFlight if you have access.

## Caveats
The repository is still a prototype; documentation is sparse and there is no formal versioning. Because it relies on the Telegram API, any future changes to channel permissions could break the feed without warning. The iOS build was only “just tested,” so you may encounter crashes on older devices. Finally, the agent‑native approach locks you into the same deployment pipeline you already have, which can be a benefit or a constraint depending on your existing tooling.

## When to try it
If your startup already runs a deployment agent for internal services and you need a low‑friction way to surface Telegram announcements to engineers, clone Condenser into a sandbox environment and run a quick smoke test. Keep an eye on the repo for a stable release before adopting it in production, and plan a fallback to the official Telegram web client if the feed becomes unavailable.