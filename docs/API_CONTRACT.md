# API Contract

This contract is the shared target for web, Android, and iOS. Mobile clients should call gardenin server endpoints and should never hold provider API keys.

## Version

Current contract version: `2026-05-20.1`

## Principles

- Store crop photos by default, not full camera frames.
- Keep garden tracking separate from ID-only identification.
- Send external provider calls through the server.
- Make optional permissions explicit: camera, photo import, one-time location, notifications.
- Keep data shapes stable across web, Android, and iOS.

## Common Types

### CropBox

```json
{
  "x": 0.18,
  "y": 0.12,
  "width": 0.64,
  "height": 0.72
}
```

Values are normalized percentages of the source image.

### PhotoQuality

```json
{
  "score": 0.82,
  "sharpnessScore": 0.91,
  "brightnessScore": 0.78,
  "contrastScore": 0.66,
  "plantColorScore": 0.74,
  "reason": "sharp 91%, light 78%, contrast 66%, color 74%"
}
```

Best-photo selection uses `score`, built from sharpness, usable brightness, contrast, and plant-like color/texture.

### SeenLocation

```json
{
  "zip": "55025",
  "placeNote": "Trail near lake",
  "coordinates": {
    "latitude": 45.1234,
    "longitude": -93.1234,
    "accuracyMeters": 60,
    "capturedAt": "2026-05-20T22:00:00.000Z"
  }
}
```

`zip`, `placeNote`, and `coordinates` are optional. Coordinates come from explicit one-time device location only. No reverse geocoding is required.

### PlantIdentity

```json
{
  "commonName": "Hosta",
  "scientificName": "Hosta",
  "providerName": "Pl@ntNet",
  "providerPlantID": "provider-id",
  "confidence": 0.91
}
```

## Endpoints

### `GET /api/status`

Returns provider readiness.

Response:

```json
{
  "plantIdProvider": "plantnet",
  "hasPlantNetKey": true,
  "hasPerenualKey": false,
  "contractVersion": "2026-05-20.1"
}
```

### `GET /api/mobile-contract`

Returns the current mobile contract version and endpoint list.

Response:

```json
{
  "version": "2026-05-20.1",
  "endpoints": [
    "GET /api/status",
    "GET /api/mobile-contract",
    "POST /api/identify",
    "GET /api/weather?zip=#####",
    "GET /api/perenual/search?q=..."
  ],
  "storageModes": [
    "garden",
    "id-only-gallery"
  ]
}
```

### `POST /api/identify`

Identifies one plant crop. The client should send a crop image, not a full frame.

Request:

```json
{
  "imageDataUrl": "data:image/jpeg;base64,...",
  "focusBox": {
    "x": 0.18,
    "y": 0.12,
    "width": 0.64,
    "height": 0.72
  },
  "quality": {
    "score": 0.82,
    "sharpnessScore": 0.91,
    "brightnessScore": 0.78,
    "contrastScore": 0.66,
    "plantColorScore": 0.74,
    "reason": "sharp 91%, light 78%, contrast 66%, color 74%"
  },
  "mode": "garden-scan"
}
```

`mode` can be `garden-scan`, `training`, or `id-only`.

Response:

```json
{
  "candidates": [
    {
      "profile": {
        "commonName": "Hosta",
        "scientificName": "Hosta"
      },
      "confidence": 0.91,
      "observationBox": {
        "x": 0.18,
        "y": 0.12,
        "width": 0.64,
        "height": 0.72
      },
      "metadata": {
        "providerName": "Pl@ntNet",
        "providerPlantID": "provider-id",
        "source": "plantnet"
      },
      "issues": []
    }
  ]
}
```

### `GET /api/weather?zip=#####`

Returns weather by ZIP. This can use server-side weather provider calls.

Response:

```json
{
  "source": "Open-Meteo",
  "zip": "55025",
  "place": "Forest Lake, Minnesota",
  "current": {
    "temperatureF": 56,
    "humidity": 0.72,
    "windMph": 6,
    "condition": "Rain"
  },
  "forecast": []
}
```

## Future Persistence Endpoints

These are not active until hosted storage is implemented.

### `POST /api/plants`

Create or update a garden plant.

### `POST /api/photos`

Save a crop photo to object storage and attach it to a plant or ID-only gallery item.

### `DELETE /api/photos/:id`

Delete a user-owned crop photo and remove it from recognition training sets.

### `POST /api/care-logs`

Save watering, fertilizing, pruning, inspection, or observation logs.

### `POST /api/recognition-events`

Save local/provider recognition diagnostics and accepted/rejected outcomes.

### `POST /api/id-only-gallery`

Save an optional ID-only crop photo that does not create garden care tracking.

### `GET /api/sync`

Return user plants, photos, ID-only gallery, care logs, weather snapshots, and recognition events for mobile sync.

## Local Export Shape

Until hosted accounts exist, the browser Data panel can export local records in this shape:

```json
{
  "schemaVersion": 1,
  "exportedAt": "2026-05-20T22:00:00.000Z",
  "storage": "browser-local",
  "plants": [],
  "idOnlyGallery": [],
  "photoTrainingConsent": "yes",
  "weatherZip": "55025"
}
```

This is not a server endpoint. It documents the local export payload so the later hosted import/sync path has a stable source shape.

## Client Data Models

### GardenPlant

```json
{
  "id": "plant-123",
  "nickname": "Hosta 1",
  "species": {
    "commonName": "Hosta",
    "scientificName": "Hosta"
  },
  "setting": "gardenBed",
  "sunExposure": "partSun",
  "locationNote": "Back fence, left bed",
  "identification": {
    "confidence": 0.91,
    "providerName": "Pl@ntNet",
    "providerPlantID": "provider-id",
    "source": "plantnet"
  },
  "photoUse": {
    "personalRecognition": true,
    "fullFrameStored": false
  },
  "dateAdded": "2026-05-20T22:00:00.000Z"
}
```

### PlantPhoto

```json
{
  "id": "photo-123",
  "ownerType": "plant",
  "ownerId": "plant-123",
  "cropImageUrl": "https://object-storage/photos/photo-123.jpg",
  "capturedAt": "2026-05-20T22:00:00.000Z",
  "cropBox": {
    "x": 0.18,
    "y": 0.12,
    "width": 0.64,
    "height": 0.72
  },
  "shotType": "Leaf close-up",
  "reason": "post-save-training",
  "fullFrameStored": false
}
```

### IdOnlyGalleryItem

```json
{
  "id": "id-only-123",
  "cropImageUrl": "https://object-storage/id-only/id-only-123.jpg",
  "identity": {
    "commonName": "Red columbine",
    "scientificName": "Aquilegia canadensis",
    "providerName": "Pl@ntNet",
    "providerPlantID": "provider-id",
    "confidence": 0.7
  },
  "quality": {
    "score": 0.82
  },
  "seenLocation": {
    "zip": "55025",
    "placeNote": "Trail near lake",
    "coordinates": null
  },
  "capturedAt": "2026-05-20T22:00:00.000Z",
  "savedAt": "2026-05-20T22:01:00.000Z",
  "fullFrameStored": false
}
```

### CareLog

```json
{
  "id": "care-123",
  "plantId": "plant-123",
  "action": "water",
  "date": "2026-05-20T22:00:00.000Z",
  "notes": "",
  "observationPhotoId": null
}
```

### RecognitionEvent

```json
{
  "id": "recognition-123",
  "mode": "garden-scan",
  "usedProvider": "gardenin photos",
  "matchAccepted": true,
  "candidateCommonName": "Hosta",
  "candidatePlantId": "plant-123",
  "confidence": 0.84,
  "photoId": "photo-123",
  "createdAt": "2026-05-20T22:00:00.000Z"
}
```
