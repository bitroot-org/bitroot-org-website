---
date: '2026-10-14'
excerpt: Run typed JavaScript tasks on worker threads or isolated processes in Node.js,
  Deno, and Bun.
image: https://bitroot.org/blog/media/2026-10-14-knitting-adds-sharedmemory-threads-to-node-bun-and.png
published_at: '2026-10-14T14:15:10.246729+00:00'
sources:
- https://js.knitting.run/
tags:
- javascript
- concurrency
- runtime
title: Knitting adds shared‑memory threads to Node, Bun, and Deno
---

Knitting, a new concurrency runtime for JavaScript, launched today and can be added to a project with a single `npm install knitting` command. It lets you run exported functions in a separate thread or process via `createPool({ threads: 1 })` while sharing memory in the same process.

## Simple integration
The API mirrors normal function calls. In a Hono server you export a function, create a pool, and call it with `await pool.call.myFn(args)`. The example on the site shows a `double` function returning 42 when called from a worker, and a compression route that returns the byte length of a Brotli‑compressed HTML string. No extra runtime dependencies are required, and the library is Apache‑2.0 licensed.

## Performance snapshot
A benchmark using the Hono framework measured the impact of a single worker on a `/ping` endpoint. Without a worker the p99 latency was **2.31 ms**; with one worker it rose to **16.93 ms**. CPU per request stayed virtually unchanged (180 µs vs 183 µs), indicating the overhead is modest and the main thread stays free for fast routes. The authors note that CPU‑heavy work such as React SSR, JWT signing, or password hashing benefits from the isolation while I/O‑bound code may not see gains.

## Trade‑offs and limits
Knitting supports both threads (default) and full process isolation, but the documentation calls out experimental support on the Andromeda platform. The runtime does not list pricing because it is free and open source, but it also does not claim to accelerate network‑bound workloads. Errors retain stack traces, and you can set timeouts or abort signals for long‑running tasks.

## When to try it
If your startup services perform noticeable CPU work on the main thread—e.g., image processing, cryptographic hashing, or server‑side rendering—adding a single worker pool with Knitting can keep latency low without adding external services. Give it a spin in a staging environment and compare your route latency before and after; the small CPU overhead makes it a low‑risk experiment.

[Knitting documentation](https://js.knitting.run/)