---
date: '2026-07-16'
excerpt: Nora provides a self‑hosted control plane for managing OpenClaw and Hermes
  runtimes on Docker/Kubernetes, offering a single view for deployment, inspection,
  and recovery.
image: https://pbs.twimg.com/amplify_video_thumb/2077628803011031040/img/Gn4uydb55T12pKzc.jpg
published_at: '2026-07-16T10:51:42.585560+00:00'
sources:
- https://x.com/solomon2773/status/2077629467980161317
tags:
- kubernetes
- control plane
- open-source
title: Nora control plane launches for OpenClaw & Hermes on Kubernetes
video: media/2026-07-16-nora-control-plane-launches-for-openclaw-hermes-on.mp4
---

The open‑source project **Nora** hit version 1.0 today, delivering an Apache‑2.0 control plane that can deploy and manage OpenClaw + Hermes runtimes across a Docker/Kubernetes fleet from a single UI. The initial release is available on GitHub and was announced in a short tweet by the creator.[Nora repo](https://github.com/solomon2773/nora?utm_source=x&utm_medium=organic_social&utm_campaign=nora_operator_launch_2026_07) [tweet](https://x.com/solomon2773/status/2077629467980161317)

## Single pane for runtime lifecycle
Nora bundles a control plane, inspector, and recovery tool into one Docker‑compatible service. You can spin up the operator with a single `helm install` command, then use its web UI to view all OpenClaw containers, trigger Hermes agents, and roll back failed deployments. The UI also surfaces logs and health metrics without needing separate monitoring stacks.

## Getting started is straightforward, but requires Kubernetes know‑how
Because Nora runs as a native Kubernetes operator, the onboarding steps assume a working cluster and Helm 3. The docs walk you through creating a `nora-values.yaml` file, applying the CRDs, and pointing the operator at your existing Docker images. For teams already on Kubernetes, the extra steps are minimal; for those on plain Docker, you’ll need to provision a cluster first.

## Cost is limited to infrastructure, not licensing
Nora is Apache‑2.0, so there are no per‑seat fees. The real expense is the compute needed to host the control plane and the underlying workloads. Small teams can run it on a single‑node cluster in the cloud for under $20/month, while larger fleets will incur typical Kubernetes scaling costs.

## Caveats: operational complexity and false‑positive alerts
While Nora centralises many tasks, it does not eliminate the need for fleet‑management expertise. Misconfigured CRDs can generate noisy alerts, and the recovery workflow may restart containers that were intentionally paused. Teams should prototype on a staging environment before exposing the operator to production traffic.

## When to try Nora
If you already run OpenClaw or Hermes on Kubernetes and find yourself juggling multiple scripts to deploy and debug containers, a short pilot of Nora on a dev cluster can validate its UI and recovery features. Skip it if you lack Kubernetes experience or if your workloads are tiny and managed manually.