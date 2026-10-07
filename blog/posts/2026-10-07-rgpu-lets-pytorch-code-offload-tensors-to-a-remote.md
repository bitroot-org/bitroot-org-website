---
date: '2026-10-07'
excerpt: Keep Python on your laptop. Run PyTorch operations and hold tensors on a
  remote GPU, including from a Mac with no CUDA installation. - ymcrcat/rgpu
image: https://bitroot.org/blog/media/2026-10-07-rgpu-lets-pytorch-code-offload-tensors-to-a-remote.png
published_at: '2026-10-07T15:56:42.887154+00:00'
sources:
- https://github.com/ymcrcat/rgpu
tags:
- remote gpu
- pytorch
- devops
title: rGPU lets PyTorch code offload tensors to a remote GPU via pip
---

The open‑source [rGPU](https://github.com/ymcrcat/rgpu) project now lets you run PyTorch tensors on a remote NVIDIA GPU by installing a single Python package and invoking the provided `rgpu-run` wrapper. A quickstart shows `pip install rgpu` followed by a one‑line script that creates a tensor on the device "rgpu" and prints `8.0`.

## Two integration paths
rGPU offers a *PyTorch device* that lets any PyTorch program opt‑in to a remote GPU with `device="rgpu"`. This is the simpler route and requires only the Python package. For existing Linux CUDA binaries, the *CUDA shim* presents libcuda, cuBLAS, cuDNN shims that forward calls over TCP, but it has a broader compatibility surface and needs the additional build steps in `./scripts/build_client.sh`.

## Getting it running
After `pip install rgpu` (or an editable install from the repo), start the remote server and launch your script with something like:
```
rgpu-run --host user@gpu-host --ssh-port 2222 -i ~/.ssh/gpu_key python smoke.py
```
The command opens an SSH tunnel, binds the client to localhost, and configures the TCP transport. The example prints `8.0`, confirming that the tensor was allocated remotely and the computation succeeded.

## Security and operational caveats
Neither the PyTorch‑device protocol nor the CUDA shim encrypts or authenticates traffic; they rely on the surrounding SSH tunnel and firewall rules. The server listens on all IPv4 interfaces (port 9713 by default), so you must restrict access with host or cloud firewalls before starting it. The repository does not publish any pricing or usage limits, as it is released under the Apache 2.0 license.

## When to try it
If your startup has a single powerful GPU box but developers need to run PyTorch experiments from laptops without CUDA, rGPU provides a low‑overhead way to share that hardware. Watch the repo for future releases that add authentication layers or tighter firewall defaults before adopting it in a production pipeline.