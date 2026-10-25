---
title: BrewPass coffee payment
status: Working
order: 2
repo: vlszabolcs/brewpass
specs:
  - { label: Hardware, value: "ESP32, RC522 RFID reader, SH1106 OLED" }
  - { label: Machine, value: "Saeco Royal Office (replaces NRI G-13.mft coin validator)" }
  - { label: Backend, value: "Firebase Realtime Database" }
  - { label: Apps, value: "Android admin app and user app (Kotlin, NFC)" }
roadmap:
  - { state: done, text: "Measured the coin validator interface with an oscilloscope: active-low coin and inhibit lines, 12 V supply" }
  - { state: done, text: "Card payment: credit check, charge and log in one database write, then the coin pulses to the machine" }
  - { state: done, text: "Rewrite with a hardware-independent core, native unit tests, FreeRTOS tasks on both cores and OTA updates" }
  - { state: done, text: "Admin app for users, top-ups and statistics" }
  - { state: done, text: "User app: NFC card binding, buying a coffee and transferring credit from the phone" }
links:
  - { label: "Firmware (BrewPass)", url: "https://github.com/vlszabolcs/brewpass" }
  - { label: "Android apps", url: "https://github.com/vlszabolcs/CoffeeAdminApp" }
  - { label: "Demo video", url: "https://youtu.be/FtIDbL3Zp9k" }
  - { label: "First version (rfidChecker)", url: "https://github.com/vlszabolcs/rfidChecker" }
---

An RFID payment system for an office coffee machine. An ESP32 board takes the place of the machine's coin validator: a user taps their card, the device checks and charges their credit in Firebase, then sends the same pulses a coin would. Credit is managed in an Android admin app, and a separate user app lets people buy a coffee or pass credit to a colleague from their phone.
