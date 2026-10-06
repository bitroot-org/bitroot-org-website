---
date: '2026-10-05'
excerpt: eBPF-based Linux kernel guard that lets only allowlisted binaries use the
  TPM. - bschaatsbergen/tpmlsm
image: https://bitroot.org/blog/media/2026-10-05-tpmlsm-adds-ebpf-guard-to-restrict-tpm-access-on-l.png
published_at: '2026-10-05T17:39:08.941673+00:00'
sources:
- https://github.com/bschaatsbergen/tpmlsm
tags:
- eBPF
- TPM
- Linux security
title: tpmlsm adds eBPF guard to restrict TPM access on Linux
---

The **tpmlsm** project released a reference implementation that uses eBPF to enforce a whitelist for TPM device access, rejecting any program not on the list—even when run as root. The tool blocks opens to `/dev/tpm0` and `/dev/tpmrm0` after you compile a SHA‑256 allowlist, for example allowing `tpm2_getrandom` while denying `cat`.

## Enforcing TPM access with eBPF

tpmlsm compiles a list of binaries (path + SHA‑256) into a BPF LSM program. Once loaded, the kernel refuses every other process that tries to open the TPM devices, regardless of its UID. The guard runs on kernels ≥ 5.18 that support `bpf_ima_file_hash`; it has been tested on Ubuntu 24.04 with a 6.8 kernel. Required kernel config flags include `CONFIG_BPF_SYSCALL`, `CONFIG_DEBUG_INFO_BTF`, `CONFIG_BPF_LSM`, and `CONFIG_IMA`.

## Deploying the guard

1. Create `allowlist.txt` by appending `sha256sum "$(readlink -f /usr/bin/tpm2_getrandom)"`.
2. Run `make` (only Go is needed on the host) to build the binary.
3. Install the BPF program before any TPM‑using service starts, e.g. `sudo ./tpmlsm` at boot. Adding `-watch` keeps it in the foreground and logs each `ALLOW` or `DENY` event.
4. Ensure `bpf` appears in the active LSM list (`cat /sys/kernel/security/lsm`) and add it to the GRUB command line as described in the repo.

## Limitations to consider

- Only the executable file is checked; libraries loaded via `LD_PRELOAD` or `/etc/ld.so.preload` can bypass the guard. Static binaries mitigate this risk.
- The allowlist is immutable at runtime; changing it requires rebuilding tpmlsm and rebooting.
- On btrfs the file lookup never matches, resulting in a blanket deny.
- Root can still delete the BPF pins or boot a different kernel, though Secure Boot and kernel lockdown raise the bar.

## When to try it

If your startup relies on a vTPM for mTLS key protection and you already run a recent Ubuntu kernel, experiment with tpmlsm in a staging environment to verify that your critical binaries are correctly whitelisted and that the logging meets your audit needs.