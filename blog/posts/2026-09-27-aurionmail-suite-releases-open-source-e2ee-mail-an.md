---
date: '2026-09-27'
excerpt: All you need to know about AurionMail
image: assets/images/demo.gif
published_at: '2026-09-27T14:26:41.261250+00:00'
sources:
- https://aurionmail.github.io/docs/
tags:
- e2ee
- self-hosted
- mail
- collaboration
title: AurionMail Suite releases open-source E2EE mail and docs platform
---

The **AurionMail Suite** is now publicly available as a free, open‑source end‑to‑end encrypted productivity stack that can be installed via Docker or the single‑binary **Orchestra** package [https://aurionmail.github.io/docs/](https://aurionmail.github.io/docs/). It unifies CryptPad document collaboration with a JMAP‑based webmail client behind one master password.

## One‑Password UX for Mail and Docs
Users enter a single master password per session to encrypt and decrypt both email and CryptPad files. The suite supports **single logout** (logging out of either app ends the session everywhere) and **global logout** across devices. Password changes propagate without data loss, and key sync works across authorized devices.

## Open‑Source Stack vs. Proprietary Alternatives
AurionMail builds on proven components: CryptPad, Bulwark Webmail, Stalwart JMAP server, Ory Hydra for SSO, and OpenPGP for encryption. Unlike commercial services that hide their backends, every piece is open‑source and self‑hostable. The architecture includes LDAP for identity, a core API for session state, and lightweight bridges for secure secret sharing during login/logout.

## Current Feature Set and What’s Missing
Supported out‑of‑the‑box features include:
- End‑to‑end encrypted email (OpenPGP) and documents.
- Unified identity with a single password.
- LDAP user creation with temporary passwords.
- Web Key Directory discovery for PGP keys.
- Basic OIDC SSO integration (still requires a second password for encryption).
Planned additions are **emergency account hold/destruction**, **contacts encryption**, and **calendar encryption** (still work in progress). The documentation does not list pricing, SLA, or production‑grade limits, so you’ll need to assess operational costs yourself.

## When to Try It
If your startup already self‑hosts services and wants a Proton‑like experience without vendor lock‑in, spin up a test instance via the Docker guide and validate the single‑password workflow. Keep an eye on the roadmap for emergency‑account features before using it for high‑value data.

*What to watch*: the upcoming emergency account hold and destruction URLs, and the calendar encryption feature slated for future releases.