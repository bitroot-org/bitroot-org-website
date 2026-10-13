---
date: '2026-10-12'
excerpt: Analyzing Eufy Security Ecosystem and reverse engineering of its Homebase2
  component
image: https://bitroot.org/blog/media/2026-10-12-eufy-homebase-2-firmware-cracked-wifi-keys-uart-sh.png
published_at: '2026-10-12T18:24:58.640572+00:00'
sources:
- https://adepts.of0x.cc/eufy-homestation2-firmware/
tags:
- eufy
- firmware
- hardware-reverse-engineering
title: 'Eufy HomeBase 2 firmware cracked: Wi‑Fi keys, UART shell, and a damaged flash'
---

The latest write‑up dissects the Eufy HomeBase 2 running firmware 3.4.2.2h (dated 2026‑06‑05) and shows how the author extracted the flash, recovered Wi‑Fi secrets, and reflashed a backdoored U‑Boot to get a UART shell. The effort required only a Raspberry Pi, spring clips for a Winbond 25Q256JWEQ chip, and a bit of DIY tooling.

## Extracting the flash
The HomeBase 2’s flash is soldered directly to the board, so the team used spring clips (WSON8 8.6 mm) and rubber bands to connect the chip to the Pi’s SPI0. In‑circuit reads produced garbage because powering the chip also powered other board components. After desoldering the chip, three identical dumps were obtained, but a 64 KB block remained unreadable—likely damaged during extraction. Binwalk and 7z were used to pull out XZ‑compressed blobs from the 32 MiB dump.

## Peeking at Wi‑Fi credentials
Strings searches uncovered NVRAM variables holding the management Wi‑Fi SSID (`OCEAN_` + MAC address) and password (`WPAPSK1`). A small ELF binary was carved out around the `WPAPSK1` marker, revealing functions like `set_wifi_pwd`. The script that builds the SSID concatenates the prefix with the device’s MAC, confirming the credential generation algorithm.

## Opening the UART
By reflashing a modified U‑Boot image, the authors unlocked the UART port and obtained a shell, enabling deeper debugging of the device’s firmware. The recovery image is limited, so filesystem quirks were necessary to launch the main binary.

## Caveats and when to try this
The write‑up notes a permanently lost 64 KB flash region and reports errors when extracting XZ streams, meaning a full firmware picture isn’t guaranteed. No pricing or tool‑license information is provided; the only cost is the hardware you already own (Raspberry Pi, clips, desoldering gear). If you need to audit a similar consumer hub or explore Wi‑Fi provisioning logic, this approach is viable once you’re comfortable with soldering and low‑level firmware tools.

**What to watch:** keep an eye on the health of the flash chip during desoldering—damage can erase critical blocks and limit analysis.