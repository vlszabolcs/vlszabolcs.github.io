---
title: BrewPass coffee payment
status: Working
summary: "RFID payment for an office coffee machine: an ESP32 replaces the coin validator, backed by Firebase and two Android apps."
intro: "An RFID payment system for a Saeco Royal Office coffee machine. An ESP32 board takes the place of the machine's coin validator: a user taps their RFID tag, the device checks and charges their credit in Firebase, then sends the same pulses a coin would. Credit is managed in an Android admin app, and a separate user app lets people buy a coffee or pass credit to a colleague from their phone."
order: 2
repo: vlszabolcs/brewpass
art: rfid-coffee
video: { youtube: "FtIDbL3Zp9k", title: "Demo of the first version (rfidChecker)" }
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
  - { label: "First version (rfidChecker)", url: "https://github.com/vlszabolcs/rfidChecker" }
---

## Talking to the machine like a coin validator

The machine already knows how to take payment: it expects an NRI G-13.mft coin validator on a small connector. Instead of changing anything inside the machine, BrewPass plugs into that connector and behaves like the validator. The validator's datasheet gave the starting point (active-low logic, a presignal, coin signals and an inhibit signal), and oscilloscope measurements on the machine filled in the rest:

- **Inhibit tells the whole story.** The machine drives inhibit high after credit has been entered and whenever it has a fault. That makes the timed presignal unnecessary and lets the device see when a drink is finished.
- **No level shifter needed.** The machine pulls the coin lines up to 5 V. Because the logic is active low, the 3.3 V ESP32 only ever has to pull them to ground.
- **Power comes from the machine.** The supply line measures 12 V, regulated down to 5 V for the ESP32 and its peripherals.

| Signal | Direction (seen from the ESP32) | Behaviour |
|---|---|---|
| Coin | Output | Pulled to 5 V by the machine; one coin = 2 pulses, 50 ms low / 50 ms high |
| Inhibit | Input | High while credit is held or the machine has a fault |
| VCC | Supply | 12 V from the machine |

## What happens when you tap

1. **Tap.** An accept sound plays. If inhibit is already high, the machine cannot take credit and the display shows **E50**.
2. **Look up the user.** The device reads only `credit` and `name` for that tag from Firebase, never the user's whole log. An unknown tag gives **E30**, no credit gives **E31**.
3. **Charge first.** The new credit and a log entry go to the database in a single write. If that write fails, nothing is charged and no credit is sent (**E25**).
4. **Hand over the credit.** Two coin pulses go to the machine.
5. **Wait for the drink.** Inhibit goes high (credit accepted), then low again when the drink is done. If the machine does not react, the device reports it instead of waiting forever (**E51**, **E52**, **E53**).

In free mode the machine gets credit straight away and the device only counts free coffees per day.

## Two cores, one rule

The card reader and the machine interface must never wait on the network. The firmware splits the work across the ESP32's two cores:

- **Core 0, cloud task:** WiFi (several networks in priority order), time sync, Firebase sign-in, the configuration stream, OTA updates and every database call. These are slow and allowed to block.
- **Core 1, main loop:** card reading, the coin and inhibit lines, display and sound. It never blocks.

The two sides talk through FreeRTOS queues. The coin pulses are timed by a hardware timer (`esp_timer`), so a busy main loop cannot stretch them. A 45-second task watchdog restarts the device if something hangs.

## The database

Everything lives in Firebase Realtime Database:

```text
/users/<tag UID>
    credit : 200            current credit (Ft)
    name   : "TestElek"
    log/<epoch> : 350       credit AFTER each change
/conf                       price, free mode (pushed to the device as a stream)
/stat/free/<YYYYMMDD>       free coffees per day
/Log/<epoch>                device events: boot, wifi, config, reader, error, ota
/remote/<device>/...        purchase and transfer requests from the user app
```

A purchase is one PATCH: `{"credit": 350, "log/<epoch>": 350}`. The log stores the balance after each change, so the type of an entry follows from its neighbour: a decrease is a purchase, an increase is a top-up. A price change in the admin app reaches the device within about a second through the `/conf` stream, without a restart.

## Buying from the phone

The user app reads the coffee tag once over NFC and binds it to that phone. After that it can do two things:

- **"Virtual tap."** The app does not touch the credit. It writes a request for the machine, and the machine runs it through the same state machine as a physical tag: charge first, then the pulses. Each request is handled at most once, even after a reboot.
- **Credit transfer.** Credit moves between two tags in whole hundreds of forints. The machine writes both tags in one database write and marks the entries as a transfer, so the statistics do not count them as coffees.

The machine publishes whether it is ready (idle, paid mode, accepting credit, connected), so the app can tell the user before they try.

## What the rewrite fixed

BrewPass is an object-oriented rewrite of my first version, rfidChecker. Going through the old code turned up real bugs:

- A `while` loop waiting on the inhibit pin could hang the device forever. Every wait now has a timeout.
- If the credit update failed, the coffee was dispensed anyway. Now no write means no coffee.
- When the price could not be fetched, the old code carried on with a price of −1, so a purchase **added** 1 Ft. The last valid price is now kept (also in flash), and a price of zero or less is rejected.
- Two log entries in the same second could overwrite each other. Log keys are now strictly increasing.
- A tag held on the reader is counted once, not on every read.

## Testing without a coffee machine

The purchase logic lives in a hardware-independent core library (`VendCore`) behind interfaces for the reader, the coin mechanism, the display, the cloud and the clock. That has two benefits:

- The core builds and runs **unit tests on the PC** (`pio test -e native`).
- The same firmware also runs on a **LilyGO T-Embed CC1101 Plus** (ESP32-S3, PN532 reader, colour display), where buttons simulate the coffee machine: "cup taken", "machine busy" and "machine ignores the pulses". Each error path can be tested at a desk.
