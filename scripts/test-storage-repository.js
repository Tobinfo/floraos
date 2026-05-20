const assert = require("node:assert/strict");
const { createRepository } = require("../prototype/storage-repository");

class MemoryStorage {
  constructor(entries = {}) {
    this.items = new Map(Object.entries(entries));
  }

  getItem(key) {
    return this.items.has(key) ? this.items.get(key) : null;
  }

  setItem(key, value) {
    this.items.set(key, String(value));
  }

  removeItem(key) {
    this.items.delete(key);
  }
}

const storage = new MemoryStorage({
  "floraos.photoTrainingConsent": "yes",
  "floraos.weather.zip": "55025"
});
const repository = createRepository(storage);

assert.equal(repository.loadPhotoTrainingConsent(), "yes");
assert.equal(storage.getItem("gardenin.photoTrainingConsent"), "yes");
assert.equal(storage.getItem("floraos.photoTrainingConsent"), null);

assert.equal(repository.loadWeatherZip(), "55025");
assert.equal(storage.getItem("gardenin.weather.zip"), "55025");
assert.equal(storage.getItem("floraos.weather.zip"), null);

repository.savePlants([{ id: "plant-1" }]);
repository.saveIdOnlyGallery([{ id: "id-only-1" }]);
assert.deepEqual(repository.loadPlants(), [{ id: "plant-1" }]);
assert.deepEqual(repository.loadIdOnlyGallery(), [{ id: "id-only-1" }]);

const exported = repository.exportLocalData();
assert.equal(exported.schemaVersion, 1);
assert.equal(exported.photoTrainingConsent, "yes");
assert.equal(exported.weatherZip, "55025");
assert.equal(exported.plants.length, 1);
assert.equal(exported.idOnlyGallery.length, 1);

repository.clearAllLocalData();
assert.deepEqual(repository.loadPlants(), []);
assert.deepEqual(repository.loadIdOnlyGallery(), []);
assert.equal(repository.loadPhotoTrainingConsent(), null);
assert.equal(repository.loadWeatherZip(), null);

console.log("Storage repository tests passed.");
