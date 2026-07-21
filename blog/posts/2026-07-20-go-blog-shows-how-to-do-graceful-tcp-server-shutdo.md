---
date: '2026-07-20'
excerpt: Arpit’s new blog post explains why merely closing a listener isn’t enough
  for a clean Go TCP server shutdown and offers a practical pattern for production
  services.
image: https://pbs.twimg.com/media/HNpilbCasAASC6d.jpg?name=orig
published_at: '2026-07-20T11:37:09.535885+00:00'
sources:
- https://x.com/_xonoxc/status/2079084544322572478
tags:
- go
- tcp
- graceful shutdown
title: Go blog shows how to do graceful TCP server shutdown
---

Arpit just published a blog post that walks through a proper graceful shutdown for a TCP server written in Go, after realizing that simply cancelling the context and calling `listener.Close()` left in‑flight connections hanging. The tweet that announced it links to the post, which details the missing steps needed for a truly clean exit.

## The naive shutdown that breaks connections

In the tweet, Arpit notes his initial code:

```
ctx.Done()
listener.Close()
```

He assumed the listener close would signal all goroutines to stop, but existing connections remain open and can cause resource leaks or client errors. The blog post shows a minimal reproducer that demonstrates this failure.

## A practical graceful‑shutdown pattern

The article proposes three additions:
1. Track active connections with a sync.WaitGroup.
2. Stop accepting new connections before closing the listener.
3. Use a shutdown deadline to force‑close lingering connections.

A concise code snippet is provided, and the author explains why each piece matters. The pattern works with the standard `net` package and adds only a few lines of boilerplate.

## Trade‑offs and when it matters

Implementing this logic introduces extra state and a shutdown timeout that could mask bugs if set too high. For low‑traffic services or short‑lived CLI tools, the added complexity may outweigh the benefit. However, for API gateways, proxy servers, or any long‑running service that must avoid dropped client requests during a redeploy, the pattern is worth the modest overhead.

## How to try it in your codebase

The blog post is free and includes a runnable example. Clone the snippet, replace your listener loop, and run integration tests that simulate in‑flight requests during shutdown. If the tests pass without dangling goroutines, you’ve mitigated a common source of production incidents.

**What to watch:** keep an eye on the shutdown deadline you configure; too short will abort active work, too long will delay deployments. Adjust it based on your service’s typical request latency.

---

Sources: [tweet](https://x.com/_xonoxc/status/2079084544322572478), [blog post](https://xonoxc.online/blog/graceful-shutdown-in-tcp-server-in-go)