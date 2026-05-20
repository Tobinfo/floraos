(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.GardeninPhotoRecognition = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const targetSize = 32;
  const gridSize = 4;

  function featureFromImageData(imageData, width, height) {
    const data = imageData?.data || imageData;
    if (!data || !width || !height) {
      return null;
    }

    const cellCount = gridSize * gridSize;
    const cells = Array.from({ length: cellCount }, () => ({
      red: 0,
      green: 0,
      blue: 0,
      light: 0,
      greenBias: 0,
      count: 0
    }));

    let totalRed = 0;
    let totalGreen = 0;
    let totalBlue = 0;
    let totalLight = 0;
    let totalGreenBias = 0;
    let totalEdge = 0;
    let edgeCount = 0;
    let pixelCount = 0;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3] ?? 255;
        if (alpha < 24) {
          continue;
        }

        const red = data[index] / 255;
        const green = data[index + 1] / 255;
        const blue = data[index + 2] / 255;
        const light = 0.299 * red + 0.587 * green + 0.114 * blue;
        const colorTotal = red + green + blue + 0.001;
        const chromaRed = red / colorTotal;
        const chromaGreen = green / colorTotal;
        const chromaBlue = blue / colorTotal;
        const greenBias = chromaGreen - Math.max(chromaRed, chromaBlue);
        const cellX = Math.min(gridSize - 1, Math.floor((x / width) * gridSize));
        const cellY = Math.min(gridSize - 1, Math.floor((y / height) * gridSize));
        const cell = cells[cellY * gridSize + cellX];

        cell.red += chromaRed;
        cell.green += chromaGreen;
        cell.blue += chromaBlue;
        cell.light += light;
        cell.greenBias += greenBias;
        cell.count += 1;

        totalRed += chromaRed;
        totalGreen += chromaGreen;
        totalBlue += chromaBlue;
        totalLight += light;
        totalGreenBias += greenBias;
        pixelCount += 1;

        if (x > 0) {
          const leftIndex = index - 4;
          const leftLight = (
            0.299 * data[leftIndex] +
            0.587 * data[leftIndex + 1] +
            0.114 * data[leftIndex + 2]
          ) / 255;
          totalEdge += Math.abs(light - leftLight);
          edgeCount += 1;
        }

        if (y > 0) {
          const upperIndex = index - width * 4;
          const upperLight = (
            0.299 * data[upperIndex] +
            0.587 * data[upperIndex + 1] +
            0.114 * data[upperIndex + 2]
          ) / 255;
          totalEdge += Math.abs(light - upperLight);
          edgeCount += 1;
        }
      }
    }

    if (!pixelCount) {
      return null;
    }

    const values = [];
    for (const cell of cells) {
      const count = Math.max(1, cell.count);
      values.push(
        cell.red / count,
        cell.green / count,
        cell.blue / count,
        cell.light / count,
        (cell.greenBias / count + 1) / 2
      );
    }

    values.push(
      totalRed / pixelCount,
      totalGreen / pixelCount,
      totalBlue / pixelCount,
      totalLight / pixelCount,
      (totalGreenBias / pixelCount + 1) / 2,
      edgeCount ? totalEdge / edgeCount : 0
    );

    return {
      version: 1,
      values
    };
  }

  async function featureFromDataUrl(dataUrl) {
    if (typeof Image === "undefined" || typeof document === "undefined") {
      throw new Error("Data URL feature extraction requires a browser.");
    }

    const image = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = targetSize;
    canvas.height = targetSize;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, targetSize, targetSize);
    return featureFromImageData(context.getImageData(0, 0, targetSize, targetSize), targetSize, targetSize);
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not read saved plant photo."));
      image.src = src;
    });
  }

  function compareFeatures(left, right) {
    const leftValues = left?.values;
    const rightValues = right?.values;
    if (!leftValues?.length || !rightValues?.length) {
      return 0;
    }

    const length = Math.min(leftValues.length, rightValues.length);
    let distance = 0;
    for (let index = 0; index < length; index += 1) {
      const difference = leftValues[index] - rightValues[index];
      distance += difference * difference;
    }

    distance = Math.sqrt(distance / length);
    return clamp(1 - distance * 2.2, 0, 1);
  }

  function matchPlant(queryFeature, plantRecords, options = {}) {
    const minimumSamples = options.minimumSamples ?? 3;
    const threshold = options.threshold ?? 0.76;
    const margin = options.margin ?? 0.025;
    const topSampleCount = options.topSampleCount ?? 3;

    const results = plantRecords
      .map((record) => scorePlant(queryFeature, record, minimumSamples, topSampleCount))
      .filter(Boolean)
      .sort((left, right) => right.confidence - left.confidence);

    const best = results[0];
    const second = results[1];
    if (!best || best.confidence < threshold) {
      return null;
    }

    if (second && best.confidence - second.confidence < margin) {
      return null;
    }

    return {
      ...best,
      runnerUpConfidence: second?.confidence || 0
    };
  }

  function scorePlant(queryFeature, record, minimumSamples, topSampleCount) {
    const features = (record.features || []).filter(Boolean);
    if (features.length < minimumSamples) {
      return null;
    }

    const scores = features
      .map((feature) => compareFeatures(queryFeature, feature))
      .sort((left, right) => right - left);
    const topScores = scores.slice(0, Math.min(topSampleCount, scores.length));
    const averageTopScore = topScores.reduce((sum, score) => sum + score, 0) / topScores.length;
    const spread = topScores[0] - topScores[topScores.length - 1];
    const confidence = clamp(averageTopScore - spread * 0.15, 0, 1);

    return {
      plantId: record.plantId,
      confidence,
      bestSampleConfidence: topScores[0],
      sampleCount: features.length
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  return {
    featureFromImageData,
    featureFromDataUrl,
    compareFeatures,
    matchPlant
  };
});
