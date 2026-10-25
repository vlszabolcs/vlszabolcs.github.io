---
title: V2X2MAP on T-Dongle-C5
status: In progress
order: 1
repo: vlszabolcs/v2x2map
branch: tdongle-c5
specs:
  - { label: Hardware, value: "LilyGO T-Dongle-C5 (ESP32-C5)" }
  - { label: Radio, value: "ITS-G5, 5.9 GHz" }
  - { label: Links, value: "USB serial, BLE" }
  - { label: My part, value: "Firmware port, Android UI" }
roadmap:
  - { state: building, text: "Firmware port and redesigned Android app" }
  - { state: planned, text: "Continuous RX over USB with no BLE time-sharing, non-blocking writes" }
  - { state: planned, text: "Standalone SD-card logging of raw frames, downloadable over USB or BLE" }
  - { state: planned, text: "GNSS module so the dongle can work as a mobile sniffer on its own" }
  - { state: planned, text: "Power-saving BLE modes and a split design: ESP32-C5 sniffer + ESP32-S3 comms" }
links:
  - { label: "My fork (tdongle-c5)", url: "https://github.com/vlszabolcs/v2x2map/tree/tdongle-c5" }
  - { label: "Upstream project", url: "https://github.com/pit711/V2X2MAP" }
---

A fork of V2X2MAP, an ITS-G5 receiver that listens to car-to-car (V2X) radio traffic and plots it on a map. I'm porting the firmware to the LilyGO T-Dongle-C5 and redesigning the Android companion app.
