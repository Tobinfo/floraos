# Next Steps

## Current Priorities

1. Treat the laptop/browser prototype as the primary build target for now.
2. Keep real plant identification wired through the server-side Pl@ntNet connector and remove confusing demo behavior from the primary Scan path.
3. Improve plant boxing for identified plants so the UI clearly shows what was recognized in the image.
4. Make care recommendations more complete by factoring in weather, recent pruning, watering, fertilizing, inspections, and plant-specific history.
5. Keep quick-add plant fast for plants the user already knows and does not need to scan.

## Recently Understood

- The app already has SwiftUI tabs for scanning and garden tracking.
- Plant records support nicknames, species, setting, sun exposure, health notes, and care logs.
- Recommendations account for species timing, setting, sun exposure, forecast, and health notes.
- The browser prototype stores plants in local storage and mirrors the same main loop.
- Git and Node are now available in the shell. In PowerShell, use `npm.cmd` when `npm` hits script execution policy.
- The prototype now has quick-add, identified-plant boxing, provider metadata, and care context from recent actions/weather.
- Plant identification now goes through `/api/identify`, backed by `scripts/plant-id-provider.js`; Pl@ntNet is the intended real provider and demo data should stay behind the Demo/Test path only.
- The camera starts from the Ready button inside the scan box. The live feed is framed with a focus box; captured ID sends the focused crop to the server and uses the focus box as the visual plant separation area.
- `scripts/plant-id-provider.js` now has a Pl@ntNet connector path. It needs `PLANT_ID_PROVIDER=plantnet` and `PLANTNET_API_KEY` before it can return real IDs.
- A local ignored `.env` now stores the Pl@ntNet provider settings for this machine.
- `Start GardenSnap Prototype.cmd` now clears the old local server on port 5173, opens the app, and starts the server with local `.env` settings.
- Render is connected to `https://github.com/Tobinfo/floraos`; the hosted service is `https://floraos.onrender.com`.
- Render must have `PLANT_ID_PROVIDER=plantnet` and `PLANTNET_API_KEY` set, then redeploy, before hosted Scan can use real IDs.
- Hosted Pl@ntNet scanning has successfully identified and logged three plants.
- For now, Scan should freeze the camera feed immediately after an ID result so the user can review the captured frame before saving. Continuous live walking mode can return later.
- Saved plants now include the provider metadata and scan crop needed to become future training data.
- Low-confidence ID plan: do not spend extra Pl@ntNet calls immediately. First ask the user to retry, collect three more camera photos locally, pick the strongest photo client/server-side, send only the best one to the real ID API, and keep the other photos only after user confirmation/consent for the future training repository.
- Confirmed plant data plan: after any confirmed ID, including manual entry, ask the user whether they want to help the app recognize that plant in the future. If they agree, collect additional photos such as whole plant, leaf close-up, flower/fruit, stem, and setting.
- Observation rule: the app should not give plant-specific care or ID information without a current photo/observation first. First-time or uncertain IDs freeze the captured frame for confirmation. Flash-only capture is reserved for plants already in the user's saved/previously identified group.
- Consent-first data plan: at first use, ask `Can your photos be used to help make floraos better for you?` Store only the plant-box crop by default for recognition/training flows, not the full camera frame. Full-frame photos should be temporary review artifacts unless the user explicitly saves them.
- First-use photo consent is implemented in the browser prototype. Saved plant records now keep cropped plant-box images only and scrub any old full-frame image data from local storage.
- ZIP weather is implemented through `/api/weather?zip=#####` using Open-Meteo. The browser sends a ZIP, not device location.
- No-subscription water probe direction: support Wi-Fi gateways such as Ecowitt WH51 with GW1100/GW2000, Bluetooth plant sensors such as Mi Flora/Flower Care for pots, and later ESP32 DIY probes for custom beds.
- If this chat context closes, reopen `C:\dev\plant watering` and ask Codex to read `PROJECT_CONTEXT.md`, `docs/NEXT_STEPS.md`, and `docs/DECISIONS.md`.

## Open Questions

- What confidence threshold should be required before boxing and suggesting an identified plant?
- Should weather use WeatherKit or another provider?
- Should plant care schedules become user-adjustable?
- Should the app support garden zones/beds as first-class objects?
- Should photos be saved with each plant record?
- What is the fastest quick-add flow: type plant name first, choose from known samples, or add unknown plant and identify later?
- What database should hold hosted plant records, scan photos, corrections, weather context, and care history?
- Which first water probe path should be implemented: Ecowitt Wi-Fi gateway, Bluetooth Mi Flora import, or manual/ESP32 endpoint?

## Suggested Next Work

1. Open `https://floraos.onrender.com/api/status` and confirm it reports `plantIdProvider` as `plantnet` and `hasPlantNetKey` as `true`.
2. If hosted status is still demo/missing key, add or fix Render env vars and redeploy.
3. Keep the UI clear about provider status, confidence level, and alternate Pl@ntNet candidates so low-confidence IDs do not feel falsely certain.
4. Add a hosted database before relying on the app to collect long-term training/care data.
5. Connect weather with location permission and Open-Meteo/NWS-style current conditions.
6. Add a water-need model that can consume manual watering logs, weather, recent pruning, plant type, and probe readings.
7. Build the low-confidence retry flow: show `Retry?`, capture three additional photos without API calls, score image quality, submit the best image, then save the confirmed set for the repository.
8. Change quick/manual entry so it still starts from or attaches to an observation photo before the app gives care guidance.
9. Add a walking-mode capture flash only for already-known saved plants; first-time IDs should freeze for review.
10. Add a user setting to change photo-training consent after first choice.
