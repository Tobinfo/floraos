const recognition = require("../prototype/photo-recognition.js");

const width = 32;
const height = 32;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function syntheticPlantImage(kind, variant) {
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const wave = Math.sin((x + variant * 2) / 3) * 12 + Math.cos((y - variant) / 4) * 10;
      const stripe = ((x + y + variant) % 9) < 4 ? 18 : -12;
      const spot = ((x - 16 - variant) ** 2 + (y - 15 + variant) ** 2) < 42 ? 28 : 0;

      let red;
      let green;
      let blue;

      if (kind === "hosta") {
        red = 48 + wave * 0.25 + stripe * 0.15;
        green = 142 + wave + stripe + spot;
        blue = 70 + wave * 0.35 - stripe * 0.2;
      } else if (kind === "coleus") {
        red = 145 + wave + stripe + spot;
        green = 72 + wave * 0.35 - stripe * 0.1;
        blue = 84 + wave * 0.55 + stripe * 0.2;
      } else {
        red = 94 + wave * 0.4 + stripe;
        green = 122 + wave * 0.7 - stripe * 0.2;
        blue = 48 + wave * 0.3 + spot;
      }

      data[index] = clamp(red);
      data[index + 1] = clamp(green);
      data[index + 2] = clamp(blue);
      data[index + 3] = 255;
    }
  }

  return recognition.featureFromImageData({ data }, width, height);
}

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function plantRecord(plantId, kind, count) {
  return {
    plantId,
    features: Array.from({ length: count }, (_, index) => syntheticPlantImage(kind, index))
  };
}

const hosta = plantRecord("hosta-1", "hosta", 4);
const coleus = plantRecord("coleus-1", "coleus", 4);
const chives = plantRecord("chives-1", "chives", 2);

const hostaQuery = syntheticPlantImage("hosta", 8);
const coleusQuery = syntheticPlantImage("coleus", 8);
const chivesQuery = syntheticPlantImage("chives", 8);

const hostaMatch = recognition.matchPlant(hostaQuery, [hosta, coleus], {
  minimumSamples: 3,
  threshold: 0.76,
  margin: 0.025
});
assert(hostaMatch?.plantId === "hosta-1", "Expected hosta query to match the trained hosta plant.");

const coleusMatch = recognition.matchPlant(coleusQuery, [hosta, coleus], {
  minimumSamples: 3,
  threshold: 0.76,
  margin: 0.025
});
assert(coleusMatch?.plantId === "coleus-1", "Expected coleus query to match the trained coleus plant.");

const notEnoughPhotos = recognition.matchPlant(chivesQuery, [chives], {
  minimumSamples: 3,
  threshold: 0.76,
  margin: 0.025
});
assert(notEnoughPhotos === null, "Expected no match when a plant has fewer than three photos.");

console.log("Photo recognition tests passed.");
