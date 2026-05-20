# Hosted Data Plan

## Goal

Move gardenin from browser-only storage to hosted records without changing the current crop-only privacy rule.

## First Hosted Shape

Use a hosted database for structured records and object storage for crop images.

Suggested tables:

- `users`: auth identity and account settings.
- `gardens`: one user's garden or location group.
- `plants`: nickname, species, setting, sun, garden spot, provider metadata.
- `plant_photos`: crop image path, plant id, captured time, shot type, consent scope, full-frame stored flag.
- `care_logs`: water, fertilize, prune, inspect, observe, and linked observation photo.
- `weather_snapshots`: ZIP, source, current conditions, forecast summary used for a recommendation.
- `recognition_events`: scan time, local/provider used, match score, accepted/rejected outcome.
- `id_only_gallery`: optional saved ID-only crop photos, confirmed ID, manual ZIP/place note, and provider metadata. These are not garden plants.

## Storage Rules

- Store plant-box crops by default.
- Do not store full frames unless a future explicit setting allows it.
- Keep per-photo delete.
- Keep per-user export.
- Treat manual labels as high-value training labels.
- On account deletion, delete user records and image objects.
- ID-only ZIP/place note are manual inputs. One-time browser device location can be saved with explicit user permission, but no dropdown, reverse geocoding, or location lookup API is required for the first version.

## Recognition Order

1. User's hosted crop-photo repository.
2. Local browser crop-photo repository when available.
3. Retry photos without extra provider calls.
4. External provider call.
5. Manual entry/correction.

## First Implementation Target

Add hosted storage only after the browser workflow is stable enough to preserve. The first hosted version should save plant records, crop photos, and recognition events. It does not need a trained model on day one.

Before choosing the database/provider, keep the server API aligned with `docs/API_CONTRACT.md` so web, Android, and iOS can share the same records when hosted persistence is added.

The browser now has a local repository boundary in `prototype/storage-repository.js`. Hosted persistence should replace or extend that repository boundary first, not spread database calls through UI code.
