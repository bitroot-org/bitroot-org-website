---
date: '2026-10-15'
excerpt: An open-weights time-series forecasting foundation model from The Forecasting
  Company. - theforecastingcompany/tfc-t0
image: https://bitroot.org/blog/media/2026-10-15-the-forecasting-company-releases-openweights-t0gam.png
published_at: '2026-10-15T13:49:58.249804+00:00'
sources:
- https://github.com/theforecastingcompany/tfc-t0
tags:
- time series
- forecasting
- open source
title: The Forecasting Company releases open‑weights T0‑gamma time‑series model
---

The Forecasting Company announced the public release of **t0‑gamma**, a 256 M‑parameter decoder‑style transformer for probabilistic time‑series forecasting. The model can be loaded with a single command:

```python
from t0 import T0Forecaster
model = T0Forecaster.from_pretrained("theforecastingcompany/t0-gamma").eval()
```

and the required package is installed via `pip install "tfc-t0[torch]>=0.6.0"`.

## Quick start and core capabilities
The repo provides a **predict** method that accepts NumPy or PyTorch tensors, returns quantile forecasts, and handles missing values (NaN) automatically. Users can add known‑future covariates—e.g., weather or holiday calendars—by passing a `future_covariates` tensor, letting the model condition on future information without forecasting it. Batch inference is supported through the `batch_series` helper, which aligns series of different lengths and returns a single tensor of shape `(batch, horizon, quantiles)`.

## Runtime options and hardware support
Three runtimes are shipped:
- PyTorch (default, works on any CPU/GPU)
- MLX for Apple silicon (`pip install "tfc-t0[mlx]>=0.6.0"`), which runs on macOS 14+ without needing PyTorch
- ONNX artifacts for t0‑alpha (FP16/INT8) but **no ONNX export for t0‑gamma** yet, limiting deployment to the two runtimes above.
The model can forecast up to 1024 steps in a single forward pass; longer horizons fall back to autoregressive rollout.

## Licensing, provenance, and what’s missing
The code is Apache‑2.0 licensed and builds on ideas from Datadog’s Toto, Amazon’s Chronos‑2, and other open‑source projects. The announcement does **not** include pricing because the model is free to download, but the managed API is a separate product with undisclosed costs. Moreover, the lack of an ONNX export for t0‑gamma means edge or cross‑platform deployment may require additional engineering effort.

## When to try it
If you already use PyTorch or have Apple silicon workstations and need probabilistic forecasts that incorporate future covariates, clone the [GitHub repo](https://github.com/theforecastingcompany/tfc-t0) and run the quick‑start script. Keep an eye on future releases for ONNX support and managed‑API pricing details.

---

For the full technical description see the accompanying [arXiv paper](https://arxiv.org/abs/2609.24559).