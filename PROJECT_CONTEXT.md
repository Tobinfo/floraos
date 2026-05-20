# gardenin Project Context

gardenin is a laptop-first prototype for plant identification and care tracking, with an iOS SwiftUI scaffold kept as the later native target.

The core workflow is:

1. Scan or photograph a plant.
2. Review likely plant matches.
3. Accept or edit a suggested name such as `Hosta 1`.
4. Save the plant with setting, sun exposure, and garden location.
5. Get care recommendations for watering, fertilizing, pruning, and health checks.
6. Log care over time per individual plant.

## Current Product Shape

The repo contains:

- A browser prototype in `prototype/`; this is the primary build target for now.
- A SwiftUI iOS app in `GardenSnap/`; this should follow the proven laptop workflow later.
- A mobile integration plan in `docs/MOBILE_PLAN.md` for Android/iOS planning.
- Unit tests in `GardenSnapTests/`.
- A local Node static server in `scripts/serve-prototype.js`.
- A plant identification provider boundary in `scripts/plant-id-provider.js`.
- A Render-hosted web service connected to `https://github.com/Tobinfo/gardenin`.
- XcodeGen configuration in `project.yml`.

## Current Constraints

- `C:\dev\plant watering` is the project source of truth.
- Ignore OneDrive for this project.
- Real plant identification should run through Pl@ntNet when `PLANT_ID_PROVIDER=plantnet` and `PLANTNET_API_KEY` are available.
- Demo identification exists only as a test/fallback path and must not be confused with production scan behavior.
- Weather is available through `/api/weather?zip=#####` using Open-Meteo.
- Plant data is currently stored in browser local storage. A real hosted database is needed before the app can reliably collect long-term user photos, corrections, weather context, and care habits.
- The browser prototype is the source of truth for current product behavior.
- The iOS app should avoid racing ahead until the laptop workflow stabilizes.
- Android/iOS planning should stay active while browser behavior is built. New browser features should map cleanly to native camera, permissions, local cache, hosted sync, and platform UI.
- The hosted Render URL is `https://floraos.onrender.com`.
- The shared web/server/mobile contract is tracked in `docs/API_CONTRACT.md` and exposed by the server at `/api/mobile-contract`.

## Architecture Notes

Important areas:

- Models: `GardenSnap/Models/PlantModels.swift`
- Sample plant profiles: `GardenSnap/Models/PlantSamples.swift`
- Plant persistence and app state: `GardenSnap/Services/PlantStore.swift`
- Identification abstraction: `GardenSnap/Services/PlantIdentificationService.swift`
- Weather abstraction: `GardenSnap/Services/WeatherService.swift`
- Care logic: `GardenSnap/Services/CareRecommendationEngine.swift`
- Main app views: `GardenSnap/Views/`
- Browser prototype: `prototype/index.html`, `prototype/app.js`, `prototype/styles.css`
- Browser storage boundary: `prototype/storage-repository.js`
- Laptop plant ID connector: `scripts/plant-id-provider.js`

## Current Direction

Keep building around the laptop garden-walk loop first:

scan -> confirm -> name -> save -> care recommendation -> log care.

Real identification and real weather should be connected to the laptop prototype first, then ported to Android/iOS after the workflow feels solid. The browser should call server endpoints, and server code should handle provider keys or provider-specific response shapes. Mobile apps should not hold provider API keys.

If a Codex context window closes or compacts, resume by reading this file, `docs/NEXT_STEPS.md`, `docs/DECISIONS.md`, and `docs/MOBILE_PLAN.md` before making changes.
