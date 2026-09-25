---
date: '2026-09-24'
excerpt: "Own the stack: run Carbon on your own infrastructure â\x80\x94 on-prem,
  in your VPC, or fully air-gapped. ERP, MRP, MES and QMS on Postgres you own, source
  available, with an AGPL-3.0 Community edition."
image: https://bitroot.org/blog/media/2026-09-24-carbon-launches-selfhosted-opensource-erp-for-cmmc.webp
published_at: '2026-09-24T13:56:11.499843+00:00'
sources:
- https://carbon.ms/self-hosted
tags:
- erp
- manufacturing
- open source
- self-hosted
title: Carbon launches self‑hosted open‑source ERP for CMMC‑compliant factories
---

Carbon has released a self‑hosted edition of its end‑to‑end ERP/MRP/MES/QMS stack. The entire system runs in Docker containers against a Postgres database you control, and the core community edition is free under AGPL‑3.0 [Carbon self‑hosted](https://carbon.ms/self-hosted).

## Core modules in one codebase
The stack bundles four traditionally separate systems: ERP for quotes, orders, and inventory; MRP for demand planning and BOM management; MES for digital travelers, barcode tracking, and finite‑capacity scheduling; and QMS for first‑article inspection, NCR/CAPA, and calibration. All modules share a single Postgres schema with row‑level security, eliminating data silos and sync jobs.

## Deployment models and compliance support
Carbon can be deployed on a single Docker host, in a VPC, or fully air‑gapped for ITAR‑restricted programs. The product ships with pre‑filled SSP, POA&M, and SPRS inputs to satisfy CMMC and NIST 800‑171 audits, keeping Controlled Unclassified Information (CUI) inside your network. For air‑gap operation you need an Enterprise license, but the same Docker image is used across all environments.

## Licensing and cost considerations
The Community edition is free and open source; you can clone the repo and start with `git clone https://github.com/crbnos/carbon.git` [GitHub repo](https://github.com/crbnos/carbon.git). Enterprise features—such as the REST‑API/MCP server, SSO/SAML, and white‑glove deployment support—require a commercial license. The license model is per‑deployment rather than per‑user, which can be attractive for early‑stage teams that already run Docker in production.

## Things to watch before adopting
Because the core is AGPL‑3.0, any modifications you ship to external users must be made available under the same license, which may clash with proprietary extensions. Running a full ERP stack also means you inherit the operational overhead of backing up Postgres, securing Docker, and managing updates yourself. For teams without an existing DevOps pipeline, the initial effort can be non‑trivial.

**When to try it**: If you already manage Docker workloads and need full data sovereignty for regulated parts, spin up a test instance with `docker compose up -d` on a sandbox box and run a few API calls. Validate compliance artifacts and backup procedures before scaling to production.