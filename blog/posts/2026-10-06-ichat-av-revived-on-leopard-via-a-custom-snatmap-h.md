---
date: '2026-10-07'
excerpt: 'Bringing back mid-2000s Video conferencing in Apple iChat'
image: '/images/ichatav_screen_marketing.png'
published_at: '2026-10-06T15:36:40.991289+00:00'
sources:
- https://blog.pipetogrep.org/2026/09/11/resurrecting-ichat-audio-and-video-conferencing/
tags:
- 'retro'
- 'networking'
- 'audio‑video'
title: 'iChat AV revived on Leopard via a custom SNATMAP host'
---

Add a single line to **/etc/hosts** on an OS X Leopard or Snow Leopard machine – `157.230.2.213 configuration.apple.com` – and iChat AV can place audio and video calls again. The fix works because iChat expects to fetch a *snatmap* address from `http://configuration.apple.com/configurations/macosx/ichat/1/snatmap.txt` and then contacts a UDP server on port 5678 to discover its public IP for NAT traversal.

## iChat AV’s original discovery flow
When you press the green call button, iChat first makes an HTTP request to the Apple SNATMAP URL. The response contains a `snatmap://` URI that points to a UDP endpoint. iChat sends a 16‑byte request (type 1, nonce, unused local IP/port) and expects a 16‑byte reply (type 2, same nonce, external IP and port). With a functioning SNATMAP server, both peers exchange public endpoints and establish a peer‑to‑peer RTP stream without manual port forwarding.

## Reverse‑engineering the protocol
The author used traffic captures and an LLM to reconstruct the UDP packet format. A minimal Python 3 server that listens on UDP 5678 can now answer iChat’s request, returning the external IP and port seen in the incoming packet. The blog post includes both the **spec file** and the **source code** for this server, making it a good first‑time server project for engineers.

## Getting iChat AV to work today
Two options are offered:
* **Use the author’s public server** – the same IP address above is kept alive for a handful of users.
* **Self‑host** – run the Python server on any machine with a public IP, serve the `snatmap.txt` file at the Apple path, and point the host entry to your server’s IP. The blog provides the exact file contents and placement instructions.

## Caveats and when to try it
The solution only runs on OS X Leopard or Snow Leopard (not tested on Tiger or Panther) and assumes your router preserves source ports in outbound NAT (most do, but BSD‑based routers like pfSense need the setting enabled). No pricing is mentioned; the approach is free aside from any hosting costs you incur. If you need reliable video for a production environment, this is a novelty rather than a replacement, but it’s a solid experiment for retro‑tech enthusiasts or internal demos.

**What to watch:** keep an eye on the author’s server availability; if it goes offline, you’ll need to spin up your own SNATMAP instance to continue using iChat AV.
