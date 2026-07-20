---
date: '2026-07-20'
excerpt: The new GoChat UI Chrome extension adds a floating chat window for OpenCode
  Go subscriptions, streaming replies from every model without requiring an account
  or telemetry.
image: https://pbs.twimg.com/media/HNpmZJdboAAU-l5.jpg?name=orig
published_at: '2026-07-20T11:38:18.254865+00:00'
sources:
- https://x.com/theadaloguy/status/2079087378522919057
tags:
- chrome extension
- go
- open source
title: GoChat UI Chrome extension brings floating chat to OpenCode Go
---

The GoChat UI Chrome extension is now live on the Chrome Web Store, offering a floating chat window that streams replies from every model in your OpenCode Go plan. Install it from the [Chrome Web Store](https://chromewebstore.google.com/detail/edeahmicmaaphonflnfmjfoingkkmgnb). The code is free and open source on [GitHub](https://github.com/bambamhq/gochatUI), and the extension runs entirely client‑side—no account, no server, no telemetry. Announced on X by The Adalo Guy ([tweet](https://x.com/theadaloguy/status/2079087378522919057)).

## Quick Overview

GoChat UI adds a persistent floating pane to any OpenCode Go page, letting you ask questions and see streaming answers from all models you’re subscribed to.

## How It Works

It injects a lightweight UI into the page and calls the OpenCode API directly from the browser, so the extension never stores data externally.

## Trade‑offs

Because it runs only in Chrome, users of other browsers are left out, and the lack of a backend means chat history is lost when the tab closes; also, exposing API keys in the client could raise security concerns.

## When to Try It

If you already use OpenCode Go and want an in‑page chat without signing up for another service, add the extension now and watch for any compatibility updates.