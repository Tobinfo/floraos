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
- `scripts/perenual-provider.js` now has a Perenual plant data lookup path. It needs `PERENUAL_API_KEY`; this is intended first for care/profile enrichment, not as the primary image ID provider.
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
- First-use prompt now includes ZIP weather entry so the user can set weather context during the same setup moment as photo consent.
- After a scan freezes, the Scan button becomes Retake so the user is not stuck after the first scan.
- Very low-confidence IDs are not usable matches. The app should offer retry and manual entry instead of allowing a 0% provider result to be saved as-is.
- Visible product naming is moving to gardenin. The GitHub remote is `https://github.com/Tobinfo/gardenin.git`; the Render URL is still `https://floraos.onrender.com` until the hosted service/domain is renamed.
- After saving a confirmed plant with photo consent enabled, the browser asks `Help gardenin recognize Plant Nickname in the future?` and can capture `Take 1` / `Take 2` plant-box crop photos into the plant's local training set.
- Saved-plant recognition is implemented locally in the browser: if a scan returns a usable species match for an already saved plant, the camera flashes and asks `Plant nickname?` instead of freezing into the first-time add flow. Confirming it logs an observation with a plant-box crop only.
- Training capture now gives feedback for all three photos: the original scan is shown as saved, then `Take 1` and `Take 2` update as each extra plant-box crop is captured.
- Repository recognition loop: saved-plant point-and-ID should keep improving from the user's own labeled crop photos. If recognition fails later, ask `Take more photos for future recognition?` and let the user capture as many plant-box crop photos as they want. These should train or populate gardenin's own user-plant repository so future recognition can happen without an external API call.
- A first implementation hook exists: after a failed/very low-confidence scan, if saved plants exist, the user can choose `More photos`, select a saved plant, and take unlimited plant-box crop photos for future recognition.
- Each saved plant now has a Photos view that pulls together its original ID crop, extra training crops, and later recognition/observation crops from local saved data.
- Scan now checks the user's local crop-photo repository before Pl@ntNet. A saved plant needs at least three crop photos before it is eligible. If the local matcher is confident, the UI flashes and asks `Plant nickname?`; if the user says no, Scan falls through to the real provider.
- `npm.cmd run check` now includes a repeatable local photo-recognition test using synthetic plant images, proving that the matcher recognizes trained plants with enough photos and refuses plants with fewer than three photos.
- Saved plant cards now show recognition readiness, including whether they have the three crop photos needed for local recognition.
- The scan panel now shows recognition diagnostics explaining whether gardenin photos or Pl@ntNet were used, plus why local recognition did or did not fire.
- Training photos now use guided prompts: leaf close-up, then whole plant or flower/stem.
- The plant photo library now supports per-photo export and delete.
- `docs/HOSTED_DATA_PLAN.md` captures the first hosted database/object-storage shape for plant records, crop photos, care logs, weather snapshots, and recognition events.
- Product/pricing ideas are tracked in `docs/IDEAS.md`.
- No-subscription water probe direction: support Wi-Fi gateways such as Ecowitt WH51 with GW1100/GW2000, Bluetooth plant sensors such as Mi Flora/Flower Care for pots, and later ESP32 DIY probes for custom beds.
- If this chat context closes, reopen `C:\dev\plant watering` and ask Codex to read `PROJECT_CONTEXT.md`, `docs/NEXT_STEPS.md`, and `docs/DECISIONS.md`.

## Open Questions

- What confidence threshold should be required before boxing and suggesting an identified plant?
- Should weather use WeatherKit or another provider?
- Should plant care schedules become user-adjustable?
- Should the app support garden zones/beds as first-class objects?
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
11. Add a real hosted database/object store so crop images and training photos survive across devices and browser resets.
12. Replace the first local color/texture matcher with stronger embeddings or a real model once enough labeled crop photos exist.
13. Add hosted persistence for plant records, crop photos, care logs, weather snapshots, and recognition events.
14. Use Perenual plant details to enrich saved plant care profiles after ID/manual confirmation.
15. Add a full user-visible data settings screen for consent, export, and account deletion.
