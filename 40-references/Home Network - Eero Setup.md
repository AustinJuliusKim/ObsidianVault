---
title: Home Network - Eero Setup
aliases: [eero, home-wifi, moca-setup, living-room-wifi]
tags: [reference, home, networking, eero, moca]
type: reference
status: active
created: 2026-07-21
updated: 2026-07-21
related: []
---

# Home Network — Eero Setup

Reference for the home Wi-Fi: hardware, the living-room slowness diagnosis, what
was changed, and the in-progress MoCA wiring. Status **active** — MoCA install not
yet verified.

## Hardware & topology

- **ISP:** AT&T fiber, 1 Gbps. Fiber ONT → **BGW** gateway (in the office).
- **Mesh:** 3× **eero Pro 6E** (tri-band: 2.4 + 5 + 6 GHz; 6 GHz used for backhaul).
  - **Gateway** — office, wired to the BGW (only wired eero node).
  - **Stairway node** — top of the stairwell (relay between floors).
  - **Shoecase node** — living room, on a 5 ft bookcase.
- **2× eero Beacon** — guest room + far kitchen. Wi-Fi 5, dual-band (no 6 GHz),
  **no Ethernet port** (can never be wired).
- **eero LAN:** `192.168.4.0/22`, gateway `192.168.4.1`. eero OUI `fc:3f:a6`.

**Final wireless backhaul chain (verified in app):**
`BGW → eero gateway (office, wired) → stairway node → shoecase node → clients`

Both hops are strong: gateway↔stairway is same-floor; stairway↔shoecase travels
the **open stair column** rather than through the floor assembly.

## The diagnosis

Living room was slow. Root cause was **wireless backhaul across the floor**, not
radio conditions in the living room (client link measured excellent, -59 dBm /
35 dB SNR, 1200 Mbps). Original fault: the living-room node was parented to the
**bedroom** node and flapping between parents, creating a weak through-floor hop.

**Proof the backhaul — not the client link — is the ceiling:** across three final
runs the client Tx rate fell 1152 → 864 → 544 Mbps (−53%) while measured downlink
barely moved (247 → 208 → 218 Mbps). A halved client rate that doesn't dent
throughput means the constraint is upstream of the client.

## Measurement history

Measured from a Mac in the living room via `networkQuality -s`. Line rate 1 Gbps.

| Config | Down | Up | Gateway ping | Jitter |
|---|---|---|---|---|
| Bedroom node upstairs (original) | 152 | 144 | 7.9 ms | 2.0 ms |
| Both relay nodes downstairs | 81 | 72 | 9.7 ms | 6.3 ms |
| Third node at office doorway | 191 | 275 | 11.1 ms | 5.2 ms |
| **Stairway node (kept)** | **247** | 190 | 7.9 ms | 2.2 ms |
| Final baseline (after resets) | 218 | 158 | 8.4 ms | 2.6 ms |
| **Target — MoCA wired** | **700+** | **700+** | **1–3 ms** | **<1 ms** |

All wireless configs land 81–247 Mbps (~8–25% of line rate). Variance in the
200–247 range is client-side noise, not real placement differences. **Wireless
backhaul is the hard ceiling; only wiring the living-room node breaks it.**

## Changes made (done)

- Relocated 3rd node bedroom → downstairs (regressed) → **stairway** (best).
- Confirmed optimal parent chain (shoecase → stairway → gateway).
- **Disabled the BGW's own 2.4/5 GHz radios** — they were competing for airtime
  with the eeros. (Removing contention can't reduce throughput; kept off.)

## In progress — MoCA wiring the living-room node

Hardware on hand: **ScreenBeam ECB6250/7250** MoCA 2.5 adapter pair + PoE filter.
Coax exists in office and living room; AT&T fiber doesn't use coax, so the plant
is free.

**Target wiring:**
`eero gateway (office, free Ethernet port) → MoCA-A → office coax → [house coax] → living-room coax → MoCA-B → shoecase eero`

### ⚠️ Open risk: coax topology

The outside splitter (roof drop → splitter) feeds **living room + main bedroom** —
the **office is not on it**. MoCA only bridges jacks on the **same** coax tree, and
the source adapter *must* sit at the office gateway (only wired eero). So the make-
or-break question:

> **Is the office coax jack on the same coax tree as the living-room jack?**

### Setup procedure

1. **Cheap topology test FIRST** (before mounting/filtering anything):
   - Office: gateway free port → Ethernet → MoCA-A → office coax jack → power on.
   - Living room: living-room coax jack → MoCA-B → power on (eero not needed yet).
   - Watch MoCA-B's **Coax LED** ~3 min. **Solid green = same tree, proceed. Off =
     separate runs → fallback needed.**
2. **If linked:** connect MoCA-B Ethernet → shoecase eero (either port). eero
   auto-detects wired backhaul; app flips that node to **"Wired"**.
3. **PoE filter:** install on the **input** of the outside splitter (the line down
   from the roof). Contains/reflects MoCA into the house; seals it as a private
   network since the roof line is dead.
4. **Splitter rating:** any splitter in the path must pass **5–1675 MHz**. A
   `5–1000 MHz` splitter blocks MoCA **silently** (adapters power on, LED never
   links). Most common failure — check the printing on the splitter body.

### Verification (target numbers)

- eero app: living-room node shows **"Wired"**; no node parents to another node.
- `networkQuality -s` in living room → **700+ Mbps** down. ~200 = MoCA didn't
  link and it fell back to wireless — recheck splitter.
- `ping -c 30 192.168.4.1` → **1–3 ms** avg (vs 8 ms wireless). Cleanest tell.
- `networkQuality -v` (loaded) → loaded latency well under 100 ms (was 1709 ms).

### Attempt 1 status (2026-07-21) — NOT working yet

- Coax colors: **office = black, runs up to roof**; **living room + bedroom =
  brown, split from a splitter coming down from the roof.** Different runs; if they
  join, it's up at the roof.
- Initial "solid LED" was a **misread** — that was the **Power LED**, not the
  **Coax/MoCA LED**. The Coax LED on MoCA-B looked dim/off. So a real MoCA link
  was **never confirmed**. Ethernet reseated + both coax connectors hand-tightened;
  still no wired backhaul (gateway ping steady ~9 ms = wireless).
- eero briefly showed "Wired" then reverted to wireless → link came up marginal
  and dropped. Consistent with **old/low-rated or corroded roof splitters** and/or
  black↔brown not actually joined.
- **Prime suspect: the roof splitters** (to inspect in daylight). Meanwhile the
  wireless setup (~218 Mbps, stable) is the working state — nothing is broken.

### Roof checklist (next daylight trip)

1. **Continuity:** do the black (office) and brown (LR/BR) lines actually meet at
   the roof, or terminate separately (e.g. dead antenna/dish)? MoCA needs them on
   one continuous path.
2. **Splitter rating:** read the printing. Must pass **5–1675 MHz** (or higher).
   `5–1000` / `5–900 MHz` **blocks MoCA** — replace.
3. **Splitter condition:** corrosion, water intrusion, rust, cracked housing →
   replace even if the rating is fine.
4. **Amplifiers:** any inline amp **blocks MoCA** unless MoCA-rated + bidirectional
   → remove/bypass.
5. **Open ports:** cap every unused leg (incl. bedroom jack if unused) with a
   **75 Ω terminator** — open ends reflect MoCA signal and kill SNR.
6. **Bring:** MoCA-rated (5–1675) splitter, F-81 barrel connectors, 75 Ω
   terminators, PoE filter, weatherproofing (dielectric grease / boots), wrench.
7. **Goal:** office + living room on ONE continuous path, MoCA-rated splitters
   only, no open ends → then MoCA-B Coax LED should hold **solid green**,
   power-cycle the shoecase eero, and it takes wired.

### Reading the ScreenBeam LEDs (don't repeat the misread)

Three LEDs, read the label: **Power** (always green when plugged in — ignore),
**Coax** (the one that matters — green = MoCA link, off = none), **Ethernet**
(green = cable connected). A real link needs the **Coax** LED green on **both**
adapters.

### Fallback if office jack is on a separate coax run

Find a shared upstream splitter; or re-terminate the office drop into the outside
splitter (needs a MoCA-rated 3-way); or run direct Cat6 office→living room; else
powerline as last resort. Note: bedroom can't be the source — no wired eero there.

## Open loose ends (optional, low priority)

- **IP passthrough never activated** — BGW still holds public IP `69.234.43.149`;
  hop 2 stays `192.168.1.254` (double-NAT). Deprioritized: costs no measurable
  throughput; only matters for port forwarding, some VPNs, gaming NAT type. Cause:
  BGW factory reset wiped its device table, so the `DHCPS-fixed` dropdown had no
  eero MAC to bind. Correct order if revisited: reset BGW → let eero pull a normal
  lease ~5 min → *then* set passthrough (select `fc:3f:a6…` MAC) → reboot eero.
  Requires the BGW Device Access Code (sticker) to save firewall changes.
- **Beacons untested** — the two Wi-Fi 5 Beacons contend on crowded 5 GHz and the
  "far kitchen" one is a rate-anomaly risk. Optional test: unplug both, let mesh
  reconverge ~3 min, re-measure. Keep only where coverage is actually used.

## Handy commands (macOS)

```
# link quality (BSSID, channel, RSSI, Tx rate)
system_profiler SPAirPortDataType | grep -E "Channel:|Signal / Noise|Transmit Rate"
# gateway latency + jitter
ping -c 30 192.168.4.1
# throughput
networkQuality -s
# double-NAT / passthrough check (hop 2 == 192.168.1.254 means NOT passed through)
traceroute -m 3 1.1.1.1 ; curl -s https://api.ipify.org
```
