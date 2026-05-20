(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.GardeninStorageRepository = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const keys = {
    plants: "gardensnap.prototype.plants",
    idOnlyGallery: "gardenin.prototype.idOnlyGallery",
    photoConsent: "gardenin.photoTrainingConsent",
    legacyPhotoConsent: "floraos.photoTrainingConsent",
    weatherZip: "gardenin.weather.zip",
    legacyWeatherZip: "floraos.weather.zip"
  };

  function createRepository(storage = globalThis.localStorage) {
    return {
      keys,
      loadPlants: () => readJson(storage, keys.plants, []),
      savePlants: (plants) => writeJson(storage, keys.plants, plants),
      loadIdOnlyGallery: () => readJson(storage, keys.idOnlyGallery, []),
      saveIdOnlyGallery: (photos) => writeJson(storage, keys.idOnlyGallery, photos),
      loadPhotoTrainingConsent: () => migrateEnumValue(storage, keys.photoConsent, keys.legacyPhotoConsent, ["yes", "no"]),
      savePhotoTrainingConsent: (value) => storage.setItem(keys.photoConsent, value === "yes" ? "yes" : "no"),
      loadWeatherZip: () => migrateZip(storage),
      saveWeatherZip: (zip) => {
        if (/^\d{5}$/.test(String(zip || ""))) {
          storage.setItem(keys.weatherZip, String(zip));
        }
      },
      exportLocalData: (snapshot = {}) => ({
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        storage: "browser-local",
        plants: snapshot.plants ?? readJson(storage, keys.plants, []),
        idOnlyGallery: snapshot.idOnlyGallery ?? readJson(storage, keys.idOnlyGallery, []),
        photoTrainingConsent: snapshot.photoTrainingConsent ?? migrateEnumValue(storage, keys.photoConsent, keys.legacyPhotoConsent, ["yes", "no"]),
        weatherZip: snapshot.weatherZip ?? migrateZip(storage)
      }),
      clearAllLocalData: () => {
        for (const key of Object.values(keys)) {
          storage.removeItem(key);
        }
      }
    };
  }

  function readJson(storage, key, fallback) {
    try {
      return JSON.parse(storage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

  function migrateEnumValue(storage, currentKey, legacyKey, allowedValues) {
    const stored = storage.getItem(currentKey) || storage.getItem(legacyKey);
    if (allowedValues.includes(stored)) {
      storage.setItem(currentKey, stored);
      storage.removeItem(legacyKey);
      return stored;
    }
    return null;
  }

  function migrateZip(storage) {
    const stored = storage.getItem(keys.weatherZip) || storage.getItem(keys.legacyWeatherZip);
    if (!/^\d{5}$/.test(String(stored || ""))) {
      return null;
    }
    storage.setItem(keys.weatherZip, stored);
    storage.removeItem(keys.legacyWeatherZip);
    return stored;
  }

  return {
    keys,
    createRepository
  };
});
