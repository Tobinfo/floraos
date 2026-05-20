const camera = document.querySelector("#camera");
const cameraStage = document.querySelector("#camera-stage");
const snapshot = document.querySelector("#snapshot");
const capturedPreview = document.querySelector("#captured-preview");
const scanGuide = document.querySelector("#scan-guide");
const detectionBox = document.querySelector("#detection-box");
const detectionLabel = document.querySelector("#detection-label");
const knownPlantPopover = document.querySelector("#known-plant-popover");
const knownPlantName = document.querySelector("#known-plant-name");
const knownPlantYesButton = document.querySelector("#known-plant-yes");
const knownPlantNoButton = document.querySelector("#known-plant-no");
const cameraEmpty = document.querySelector("#camera-empty");
const cameraReadyButton = document.querySelector("#camera-ready");
const cameraStatus = document.querySelector("#camera-status");
const feedStatus = document.querySelector("#feed-status");
const startCameraButton = document.querySelector("#start-camera");
const captureButton = document.querySelector("#capture");
const demoScanButton = document.querySelector("#demo-scan");
const scanResult = document.querySelector("#scan-result");
const providerStatus = document.querySelector("#provider-status");
const matchEyebrow = document.querySelector("#match-eyebrow");
const matchName = document.querySelector("#match-name");
const matchDetail = document.querySelector("#match-detail");
const matchWarning = document.querySelector("#match-warning");
const matchAlternatives = document.querySelector("#match-alternatives");
const matchOptions = document.querySelector("#match-options");
const reviewAddButton = document.querySelector("#review-add");
const retryScanButton = document.querySelector("#retry-scan");
const manualFromScanButton = document.querySelector("#manual-from-scan");
const quickAddButton = document.querySelector("#quick-add");
const reviewPanel = document.querySelector("#review-panel");
const reviewSpecies = document.querySelector("#review-species");
const quickSpeciesField = document.querySelector("#quick-species-field");
const quickSpeciesInput = document.querySelector("#quick-species");
const plantNameInput = document.querySelector("#plant-name");
const plantSettingInput = document.querySelector("#plant-setting");
const plantSunInput = document.querySelector("#plant-sun");
const plantLocationInput = document.querySelector("#plant-location");
const issueStrip = document.querySelector("#issue-strip");
const savePlantButton = document.querySelector("#save-plant");
const cancelReviewButton = document.querySelector("#cancel-review");
const plantList = document.querySelector("#plant-list");
const plantCardTemplate = document.querySelector("#plant-card-template");
const weatherForm = document.querySelector("#weather-form");
const weatherZipInput = document.querySelector("#weather-zip");
const weatherPill = document.querySelector("#weather-pill");
const gardenSummary = document.querySelector("#garden-summary");
const photoConsentDialog = document.querySelector("#photo-consent");
const photoConsentZipInput = document.querySelector("#photo-consent-zip");
const photoConsentYesButton = document.querySelector("#photo-consent-yes");
const photoConsentNoButton = document.querySelector("#photo-consent-no");
const trainingRequestDialog = document.querySelector("#training-request");
const trainingRequestTitle = document.querySelector("#training-request-title");
const trainingRequestDetail = document.querySelector("#training-request-detail");
const trainingRequestProgress = document.querySelector("#training-request-progress");
const trainingRequestYesButton = document.querySelector("#training-request-yes");
const trainingRequestNoButton = document.querySelector("#training-request-no");
const trainingCaptureDialog = document.querySelector("#training-capture");
const trainingPhotoCount = document.querySelector("#training-photo-count");
const trainingCaptureTitle = document.querySelector("#training-capture-title");
const trainingCaptureProgress = document.querySelector("#training-capture-progress");
const trainingCaptureButton = document.querySelector("#training-capture-button");
const trainingCaptureStopButton = document.querySelector("#training-capture-stop");

const storageKey = "gardensnap.prototype.plants";
const photoConsentKey = "gardenin.photoTrainingConsent";
const legacyPhotoConsentKey = "floraos.photoTrainingConsent";
const weatherZipKey = "gardenin.weather.zip";
const legacyWeatherZipKey = "floraos.weather.zip";
let stream = null;
let activeCandidate = null;
let activeCandidates = [];
let plants = loadPlants();
let lastScanImageDataUrl = null;
let lastScanCropDataUrl = null;
let isFrozenAfterScan = false;
let photoTrainingConsent = loadPhotoTrainingConsent();
let pendingTrainingPlantId = null;
let pendingTrainingPhotos = [];
let pendingKnownPlantId = null;
const focusBox = { x: 0.18, y: 0.12, width: 0.64, height: 0.72 };
const strongConfidence = 0.55;
const weakConfidence = 0.25;
const noReliableConfidence = 0.05;

const profiles = [
  {
    commonName: "Hosta",
    scientificName: "Hosta",
    minimumWateringDays: 4,
    maximumWateringDays: 7,
    fertilizeEveryDays: 45,
    pruneWindowMonths: [3, 4, 10, 11],
    droughtTolerance: 0.25,
    overwateringSensitivity: 0.45,
    diseaseWatchlist: ["slug damage", "leaf scorch", "crown rot"],
    careNotes: "Keep soil evenly moist. Avoid constantly wet crowns."
  },
  {
    commonName: "Tomato",
    scientificName: "Solanum lycopersicum",
    minimumWateringDays: 2,
    maximumWateringDays: 4,
    fertilizeEveryDays: 21,
    pruneWindowMonths: [5, 6, 7, 8],
    droughtTolerance: 0.2,
    overwateringSensitivity: 0.35,
    diseaseWatchlist: ["early blight", "leaf spot", "powdery mildew"],
    careNotes: "Keep watering consistent and avoid wet leaves when possible."
  },
  {
    commonName: "Hydrangea",
    scientificName: "Hydrangea macrophylla",
    minimumWateringDays: 3,
    maximumWateringDays: 5,
    fertilizeEveryDays: 60,
    pruneWindowMonths: [7, 8, 9],
    droughtTolerance: 0.15,
    overwateringSensitivity: 0.4,
    diseaseWatchlist: ["leaf spot", "wilting", "powdery mildew"],
    careNotes: "Water deeply in warm weather. Prune timing depends on bloom type."
  },
  {
    commonName: "Basil",
    scientificName: "Ocimum basilicum",
    minimumWateringDays: 2,
    maximumWateringDays: 3,
    fertilizeEveryDays: 30,
    pruneWindowMonths: [5, 6, 7, 8, 9],
    droughtTolerance: 0.1,
    overwateringSensitivity: 0.3,
    diseaseWatchlist: ["downy mildew", "yellowing leaves", "aphids"],
    careNotes: "Pinch tips often and water before leaves droop."
  }
];

let forecast = buildDemoForecast();
let weatherSnapshot = {
  source: "demo",
  place: "Demo forecast",
  zip: null,
  current: {
    temperatureF: forecast[0].highFahrenheit,
    condition: forecast[0].condition
  }
};

cameraReadyButton.addEventListener("click", startCamera);
startCameraButton.addEventListener("click", toggleCamera);
camera.addEventListener("click", () => camera.play().catch(() => {}));
captureButton.addEventListener("click", captureAndIdentify);
demoScanButton.addEventListener("click", () => identifyFromImage({
  demoIndex: Math.floor(Math.random() * profiles.length),
  focusBox
}));
reviewAddButton.addEventListener("click", openReview);
retryScanButton.addEventListener("click", retryScan);
manualFromScanButton.addEventListener("click", openManualFromScan);
knownPlantYesButton.addEventListener("click", confirmKnownPlantObservation);
knownPlantNoButton.addEventListener("click", rejectKnownPlantObservation);
quickAddButton.addEventListener("click", openQuickAdd);
quickSpeciesInput.addEventListener("change", updateQuickAddSpecies);
savePlantButton.addEventListener("click", savePlant);
cancelReviewButton.addEventListener("click", closeReview);
weatherForm.addEventListener("submit", handleWeatherSubmit);
photoConsentYesButton.addEventListener("click", () => setPhotoTrainingConsent(true));
photoConsentNoButton.addEventListener("click", () => setPhotoTrainingConsent(false));
trainingRequestYesButton.addEventListener("click", startTrainingPhotoFlow);
trainingRequestNoButton.addEventListener("click", closeTrainingRequest);
trainingCaptureButton.addEventListener("click", captureTrainingPhoto);
trainingCaptureStopButton.addEventListener("click", closeTrainingCapture);

populateQuickSpecies();
maybeShowPhotoConsent();
loadStoredWeather();
renderPlants();
renderProviderStatus();

async function startCamera() {
  isFrozenAfterScan = false;
  showCameraOverlay(true, "Starting camera");
  cameraReadyButton.textContent = "Starting";
  cameraReadyButton.disabled = true;
  startCameraButton.textContent = "Starting camera";
  startCameraButton.disabled = true;

  try {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    camera.autoplay = true;
    camera.muted = true;
    camera.playsInline = true;
    camera.srcObject = stream;
    camera.hidden = false;
    camera.style.display = "block";
    cameraStage.classList.add("is-live");
    capturedPreview.hidden = true;
    scanGuide.hidden = false;
    detectionBox.hidden = true;
    knownPlantPopover.hidden = true;
    showCameraOverlay(false);
    feedStatus.hidden = false;
    feedStatus.style.display = "block";
    feedStatus.textContent = "Camera starting";
    scanResult.hidden = true;
    captureButton.disabled = false;
    startCameraButton.textContent = "Camera feed off";
    startCameraButton.disabled = false;
    cameraReadyButton.textContent = "Ready";
    cameraReadyButton.disabled = false;

    await waitForVideoMetadata();
    await camera.play().catch(() => {
      startCameraButton.textContent = "Click feed";
    });
    updateFeedStatus();
  } catch (error) {
    stream = null;
    cameraStage.classList.remove("is-live");
    camera.hidden = true;
    camera.style.display = "none";
    scanGuide.hidden = true;
    feedStatus.hidden = true;
    feedStatus.style.display = "none";
    showCameraOverlay(true, cameraErrorMessage(error));
    cameraReadyButton.textContent = "Retry";
    cameraReadyButton.disabled = false;
    startCameraButton.textContent = "Retry camera";
    startCameraButton.disabled = false;
    captureButton.disabled = true;
  }
}

function toggleCamera() {
  if (stream) {
    stopCamera();
    return;
  }

  startCamera();
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  camera.srcObject = null;
  camera.hidden = true;
  camera.style.display = "none";
  cameraStage.classList.remove("is-live");
  scanGuide.hidden = true;
  knownPlantPopover.hidden = true;
  feedStatus.hidden = true;
  feedStatus.style.display = "none";
  captureButton.disabled = true;
  startCameraButton.textContent = "Camera feed on";
  showCameraOverlay(true, "Camera feed is off");
}

function showCameraOverlay(isVisible, message = "") {
  cameraEmpty.hidden = !isVisible;
  cameraEmpty.style.display = isVisible ? "grid" : "none";

  if (message) {
    cameraStatus.textContent = message;
  }
}

function waitForVideoMetadata() {
  if (camera.readyState >= HTMLMediaElement.HAVE_METADATA && camera.videoWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const done = () => {
      camera.removeEventListener("loadedmetadata", done);
      resolve();
    };
    camera.addEventListener("loadedmetadata", done, { once: true });
    window.setTimeout(done, 1200);
  });
}

function updateFeedStatus() {
  const track = stream?.getVideoTracks?.()[0];
  const size = camera.videoWidth && camera.videoHeight
    ? `${camera.videoWidth} x ${camera.videoHeight}`
    : "no video frames yet";
  feedStatus.textContent = track
    ? `Live: ${track.label || "camera"} (${size})`
    : `Live: ${size}`;
}

async function captureAndIdentify() {
  if (!stream && isFrozenAfterScan) {
    await startCamera();
    return;
  }

  if (!stream || !camera.videoWidth) {
    return;
  }

  snapshot.width = camera.videoWidth;
  snapshot.height = camera.videoHeight;
  const context = snapshot.getContext("2d");
  context.drawImage(camera, 0, 0, snapshot.width, snapshot.height);
  const dataUrl = snapshot.toDataURL("image/jpeg", 0.82);
  const focusedDataUrl = cropDataUrl(snapshot, focusBox);
  lastScanImageDataUrl = dataUrl;
  lastScanCropDataUrl = focusedDataUrl;

  const imageSignature = getImageSignature(context, snapshot.width, snapshot.height);
  await identifyFromImage({ imageDataUrl: focusedDataUrl, imageSignature, focusBox });
}

function getImageSignature(context, width, height) {
  const sampleSize = 18;
  const imageData = context.getImageData(
    Math.max(0, Math.floor(width / 2 - sampleSize / 2)),
    Math.max(0, Math.floor(height / 2 - sampleSize / 2)),
    sampleSize,
    sampleSize
  ).data;

  let total = 0;
  for (let index = 0; index < imageData.length; index += 4) {
    total += imageData[index] + imageData[index + 1] * 2 + imageData[index + 2];
  }
  return total;
}

function cropDataUrl(sourceCanvas, box) {
  const crop = document.createElement("canvas");
  crop.width = Math.max(1, Math.round(sourceCanvas.width * box.width));
  crop.height = Math.max(1, Math.round(sourceCanvas.height * box.height));
  const cropContext = crop.getContext("2d");
  cropContext.drawImage(
    sourceCanvas,
    Math.round(sourceCanvas.width * box.x),
    Math.round(sourceCanvas.height * box.y),
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  return crop.toDataURL("image/jpeg", 0.86);
}

async function identifyFromImage(payload) {
  setIdentifying(true);

  try {
    const response = await fetch("/api/identify", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.candidates?.length) {
      throw new Error(result.error || "No plant match found.");
    }

    showCandidates(result.candidates, payload);
  } catch (error) {
    if (Number.isInteger(payload.demoIndex)) {
      showCandidates([demoCandidateFor(payload)], payload);
      matchDetail.textContent = `Demo fallback because local ID failed: ${error.message}`;
    } else {
      activeCandidate = null;
      activeCandidates = [];
      detectionBox.hidden = true;
      scanResult.hidden = false;
      matchEyebrow.textContent = "No match";
      matchName.textContent = "No match";
      matchDetail.textContent = error.message;
      matchWarning.hidden = true;
      matchAlternatives.hidden = true;
      reviewAddButton.disabled = true;
      reviewAddButton.textContent = "Add plant";
      retryScanButton.hidden = false;
      manualFromScanButton.hidden = !lastScanCropDataUrl;
    }
  } finally {
    setIdentifying(false);
  }
}

function showCandidates(candidates, payload) {
  const trainingSample = payload?.imageDataUrl ? {
    cropImageDataUrl: payload.imageDataUrl,
    capturedAt: new Date().toISOString(),
    cropBox: payload.focusBox || null,
    fullFrameStored: false,
    consentForPersonalRecognition: photoTrainingConsent === "yes"
  } : null;
  activeCandidates = candidates.map((candidate) => ({
    ...normalizeCandidate(candidate),
    trainingSample
  }));

  const knownPlant = knownPlantFor(activeCandidates[0]);
  if (knownPlant && payload?.imageDataUrl && !Number.isInteger(payload.demoIndex)) {
    showKnownPlantRecognition(knownPlant, activeCandidates[0]);
    return;
  }

  selectCandidate(0);

  if (payload?.imageDataUrl && !Number.isInteger(payload.demoIndex)) {
    freezeFeedForReview();
  }
}

function selectCandidate(index) {
  activeCandidate = activeCandidates[index];
  const isNoReliableMatch = isNoReliableCandidate(activeCandidate);
  showCameraOverlay(false);
  knownPlantPopover.hidden = true;
  renderDetectionBox(activeCandidate);
  scanGuide.hidden = Boolean(activeCandidate.observationBox);
  matchEyebrow.textContent = confidenceHeading(activeCandidate);
  matchName.textContent = isNoReliableMatch ? "No reliable plant match" : activeCandidate.profile.commonName;
  matchDetail.textContent = `${confidencePercent(activeCandidate)} confidence from ${activeCandidate.metadata.providerName}`;
  matchWarning.textContent = confidenceWarning(activeCandidate);
  matchWarning.hidden = !matchWarning.textContent;
  reviewAddButton.hidden = false;
  reviewAddButton.disabled = isNoReliableMatch;
  reviewAddButton.textContent = activeCandidate.confidence < weakConfidence && activeCandidate.metadata.source !== "quick-add" && !isNoReliableMatch
    ? "Use anyway"
    : "Add plant";
  retryScanButton.hidden = !isNoReliableMatch;
  manualFromScanButton.hidden = !isNoReliableMatch || !lastScanCropDataUrl;
  renderCandidateOptions(index);
  scanResult.hidden = false;
}

function knownPlantFor(candidate) {
  if (!candidate || isNoReliableCandidate(candidate) || candidate.confidence < weakConfidence) {
    return null;
  }

  const candidateSpecies = normalizePlantName(candidate.profile.commonName);
  const candidateScientific = normalizePlantName(candidate.profile.scientificName);
  return plants.find((plant) => {
    const plantSpecies = normalizePlantName(plant.species?.commonName);
    const plantScientific = normalizePlantName(plant.species?.scientificName);
    return plantSpecies && (
      plantSpecies === candidateSpecies ||
      plantSpecies === candidateScientific ||
      plantScientific === candidateSpecies ||
      plantScientific === candidateScientific
    );
  }) || null;
}

function showKnownPlantRecognition(plant, candidate) {
  activeCandidate = candidate;
  pendingKnownPlantId = plant.id;
  showCameraOverlay(false);
  scanResult.hidden = true;
  renderDetectionBox({
    ...candidate,
    profile: {
      ...candidate.profile,
      commonName: plant.nickname
    }
  });
  scanGuide.hidden = Boolean(candidate.observationBox);
  knownPlantName.textContent = `${plant.nickname}?`;
  knownPlantPopover.hidden = false;
  flashCameraStage();
}

function flashCameraStage() {
  cameraStage.classList.remove("recognized-flash");
  void cameraStage.offsetWidth;
  cameraStage.classList.add("recognized-flash");
  window.setTimeout(() => cameraStage.classList.remove("recognized-flash"), 700);
}

function confirmKnownPlantObservation() {
  const plant = plants.find((item) => item.id === pendingKnownPlantId);
  if (!plant) {
    rejectKnownPlantObservation();
    return;
  }

  plant.careLogs.unshift({
    action: "observe",
    date: new Date().toISOString(),
    notes: "Recognized from camera scan.",
    observation: {
      cropImageDataUrl: lastScanCropDataUrl,
      cropBox: focusBox,
      fullFrameStored: false,
      providerName: activeCandidate?.metadata?.providerName || null,
      confidence: activeCandidate?.confidence || null
    }
  });
  savePlants();
  renderPlants();
  knownPlantPopover.hidden = true;
  pendingKnownPlantId = null;
}

function rejectKnownPlantObservation() {
  knownPlantPopover.hidden = true;
  pendingKnownPlantId = null;
  if (activeCandidate) {
    selectCandidate(0);
    freezeFeedForReview();
  }
}

function normalizePlantName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
}

function normalizeCandidate(candidate) {
  return {
    ...candidate,
    issues: candidate.issues || candidate.observedIssues || [],
    metadata: candidate.metadata || {
      providerName: "Unknown provider",
      providerPlantID: null,
      source: "unknown"
    }
  };
}

function setIdentifying(isIdentifying) {
  captureButton.disabled = isIdentifying || (!stream && !isFrozenAfterScan) || (!camera.videoWidth && !isFrozenAfterScan);
  demoScanButton.disabled = isIdentifying;
  captureButton.textContent = isIdentifying ? "Scanning" : isFrozenAfterScan ? "Retake" : "Scan";
  demoScanButton.textContent = isIdentifying ? "Scanning" : "Demo test";
}

async function renderProviderStatus() {
  try {
    const response = await fetch("/api/status", { cache: "no-store" });
    const status = await response.json();
    const provider = status.plantIdProvider === "plantnet" ? "Pl@ntNet" : status.plantIdProvider;
    providerStatus.textContent = `ID: ${provider}`;
    providerStatus.classList.toggle("provider-live", status.plantIdProvider === "plantnet" && status.hasPlantNetKey);
    providerStatus.classList.toggle("provider-demo", status.plantIdProvider !== "plantnet" || !status.hasPlantNetKey);
  } catch {
    providerStatus.textContent = "ID: unknown";
    providerStatus.classList.add("provider-demo");
  }
}

function maybeShowPhotoConsent() {
  if (photoTrainingConsent) {
    return;
  }

  photoConsentDialog.hidden = false;
}

async function setPhotoTrainingConsent(isAllowed) {
  photoTrainingConsent = isAllowed ? "yes" : "no";
  localStorage.setItem(photoConsentKey, photoTrainingConsent);
  photoConsentDialog.hidden = true;
  const zip = photoConsentZipInput.value.trim();
  if (/^\d{5}$/.test(zip)) {
    weatherZipInput.value = zip;
    await loadWeatherForZip(zip);
  }
}

function loadPhotoTrainingConsent() {
  const stored = localStorage.getItem(photoConsentKey) || localStorage.getItem(legacyPhotoConsentKey);
  if (stored === "yes" || stored === "no") {
    localStorage.setItem(photoConsentKey, stored);
    localStorage.removeItem(legacyPhotoConsentKey);
  }
  return stored === "yes" || stored === "no" ? stored : null;
}

async function handleWeatherSubmit(event) {
  event.preventDefault();
  await loadWeatherForZip(weatherZipInput.value);
}

async function loadStoredWeather() {
  const storedZip = localStorage.getItem(weatherZipKey) || localStorage.getItem(legacyWeatherZipKey);
  if (!storedZip) {
    renderWeather();
    return;
  }

  localStorage.setItem(weatherZipKey, storedZip);
  localStorage.removeItem(legacyWeatherZipKey);
  weatherZipInput.value = storedZip;
  await loadWeatherForZip(storedZip);
}

async function loadWeatherForZip(zipInput) {
  const zip = String(zipInput || "").trim();
  if (!/^\d{5}$/.test(zip)) {
    weatherPill.textContent = "Enter ZIP";
    return;
  }

  weatherPill.textContent = "Weather loading";

  try {
    const response = await fetch(`/api/weather?zip=${encodeURIComponent(zip)}`, {
      cache: "no-store"
    });
    const result = await response.json();

    if (!response.ok || !Array.isArray(result.forecast)) {
      throw new Error(result.error || "Weather unavailable.");
    }

    forecast = result.forecast.map((day) => ({
      ...day,
      date: new Date(`${day.date}T00:00:00`)
    }));
    weatherSnapshot = {
      source: result.source,
      place: result.place,
      zip: result.zip,
      current: result.current || {
        temperatureF: forecast[0].highFahrenheit,
        condition: forecast[0].condition
      }
    };
    localStorage.setItem(weatherZipKey, result.zip);
    renderWeather();
    renderPlants();
  } catch (error) {
    weatherPill.textContent = "Weather unavailable";
  }
}

function weatherForPlantRecord() {
  const today = forecast[0];
  return {
    source: weatherSnapshot.source,
    zip: weatherSnapshot.zip,
    place: weatherSnapshot.place,
    capturedAt: new Date().toISOString(),
    current: weatherSnapshot.current,
    today: today ? {
      highFahrenheit: today.highFahrenheit,
      lowFahrenheit: today.lowFahrenheit,
      precipitationInches: today.precipitationInches,
      condition: today.condition
    } : null
  };
}

function cameraErrorMessage(error) {
  if (!navigator.mediaDevices?.getUserMedia) {
    return "Camera not available in this browser";
  }

  if (error?.name === "NotAllowedError") {
    return "Camera blocked. Allow camera access, then retry.";
  }

  if (error?.name === "NotFoundError") {
    return "No camera found";
  }

  return "Camera unavailable. Retry or use demo scan.";
}

function openReview() {
  if (!activeCandidate || isNoReliableCandidate(activeCandidate)) {
    return;
  }

  freezeFeedForReview();
  prepareReview("scan");
}

function retryScan() {
  closeReview();
  scanResult.hidden = true;
  detectionBox.hidden = true;
  retryScanButton.hidden = true;
  manualFromScanButton.hidden = true;
  startCamera();
}

function openManualFromScan() {
  if (!lastScanCropDataUrl) {
    return;
  }

  activeCandidate = quickAddCandidate(profiles[0]);
  activeCandidate.trainingSample = {
    cropImageDataUrl: lastScanCropDataUrl,
    capturedAt: new Date().toISOString(),
    cropBox: focusBox,
    fullFrameStored: false,
    consentForPersonalRecognition: photoTrainingConsent === "yes"
  };
  activeCandidates = [activeCandidate];
  detectionBox.hidden = true;
  prepareReview("manual-scan");
}

function freezeFeedForReview() {
  if (!lastScanImageDataUrl) {
    return;
  }

  isFrozenAfterScan = true;
  capturedPreview.src = lastScanImageDataUrl;
  capturedPreview.hidden = false;
  capturedPreview.style.display = "block";
  camera.hidden = true;
  camera.style.display = "none";
  scanGuide.hidden = true;

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  camera.srcObject = null;
  cameraStage.classList.remove("is-live");
  feedStatus.hidden = true;
  feedStatus.style.display = "none";
  captureButton.disabled = false;
  captureButton.textContent = "Retake";
  startCameraButton.textContent = "Camera feed on";
}

function openQuickAdd() {
  quickSpeciesInput.value = "0";
  activeCandidate = quickAddCandidate(profiles[0]);
  activeCandidates = [activeCandidate];
  detectionBox.hidden = true;
  scanResult.hidden = true;
  prepareReview("quick");
}

function updateQuickAddSpecies() {
  if (reviewPanel.dataset.mode !== "quick" && reviewPanel.dataset.mode !== "manual-scan") {
    return;
  }

  const existingTrainingSample = activeCandidate?.trainingSample || null;
  activeCandidate = quickAddCandidate(profiles[Number(quickSpeciesInput.value)]);
  activeCandidate.trainingSample = existingTrainingSample;
  fillReviewFields(false);
}

function prepareReview(mode) {
  reviewPanel.dataset.mode = mode;
  quickSpeciesField.hidden = mode !== "quick" && mode !== "manual-scan";
  fillReviewFields(true);
  reviewPanel.hidden = false;
  plantNameInput.focus();
}

function fillReviewFields(resetPlacement) {
  const suggested = suggestedName(activeCandidate.profile);
  reviewSpecies.textContent = activeCandidate.profile.commonName;
  plantNameInput.value = suggested;

  if (resetPlacement) {
    plantSettingInput.value = "gardenBed";
    plantSunInput.value = "partSun";
    plantLocationInput.value = "";
  }

  issueStrip.replaceChildren(...activeCandidate.issues.map((issue) => {
    const note = document.createElement("div");
    note.className = "issue-note";
    note.textContent = `${issue.title}. ${issue.detail}`;
    return note;
  }));
  issueStrip.hidden = activeCandidate.issues.length === 0;
}

function quickAddCandidate(profile) {
  return {
    profile,
    confidence: 1,
    observationBox: null,
    metadata: {
      providerName: "Manual entry",
      providerPlantID: null,
      source: "quick-add"
    },
    issues: []
  };
}

function closeReview() {
  reviewPanel.hidden = true;
}

function maybeAskForTrainingPhotos(plant) {
  if (photoTrainingConsent !== "yes" || !plant?.trainingSample?.cropImageDataUrl) {
    return;
  }

  pendingTrainingPlantId = plant.id;
  pendingTrainingPhotos = [];
  trainingRequestTitle.textContent = `Help gardenin recognize ${plant.nickname} in the future?`;
  trainingRequestDetail.textContent = "Take 1, then take 2. Plant-box crops only.";
  trainingRequestYesButton.textContent = "Take 1";
  updateTrainingProgress();
  trainingRequestDialog.hidden = false;
}

function closeTrainingRequest() {
  trainingRequestDialog.hidden = true;
  pendingTrainingPlantId = null;
  pendingTrainingPhotos = [];
}

async function startTrainingPhotoFlow() {
  trainingRequestDialog.hidden = true;
  pendingTrainingPhotos = [];
  updateTrainingCaptureText();
  updateTrainingProgress();
  trainingCaptureDialog.hidden = false;
  if (!stream) {
    await startCamera();
  }
}

async function captureTrainingPhoto() {
  if (!pendingTrainingPlantId) {
    closeTrainingCapture();
    return;
  }

  if (!stream || !camera.videoWidth) {
    await startCamera();
    return;
  }

  snapshot.width = camera.videoWidth;
  snapshot.height = camera.videoHeight;
  const context = snapshot.getContext("2d");
  context.drawImage(camera, 0, 0, snapshot.width, snapshot.height);
  pendingTrainingPhotos.push({
    cropImageDataUrl: cropDataUrl(snapshot, focusBox),
    capturedAt: new Date().toISOString(),
    cropBox: focusBox,
    fullFrameStored: false
  });

  if (pendingTrainingPhotos.length >= 2) {
    updateTrainingProgress();
    saveTrainingPhotos();
    closeTrainingCapture();
    return;
  }

  updateTrainingCaptureText();
  updateTrainingProgress();
}

function updateTrainingCaptureText() {
  const nextPhoto = Math.min(pendingTrainingPhotos.length + 1, 2);
  trainingPhotoCount.textContent = String(nextPhoto);
  const plant = plants.find((item) => item.id === pendingTrainingPlantId);
  trainingCaptureTitle.textContent = plant
    ? `Frame ${plant.nickname} in the box.`
    : "Frame the same plant in the box.";
  trainingCaptureButton.textContent = `Take ${nextPhoto}`;
}

function updateTrainingProgress() {
  const progressRoots = [trainingRequestProgress, trainingCaptureProgress].filter(Boolean);
  for (const root of progressRoots) {
    setTrainingStep(root, "scan", "Saved", true);
    setTrainingStep(root, "take-1", pendingTrainingPhotos.length >= 1 ? "Saved" : "Needed", pendingTrainingPhotos.length >= 1);
    setTrainingStep(root, "take-2", pendingTrainingPhotos.length >= 2 ? "Saved" : "Needed", pendingTrainingPhotos.length >= 2);
  }
}

function setTrainingStep(root, step, label, isComplete) {
  const item = root.querySelector(`[data-step="${step}"]`);
  if (!item) {
    return;
  }

  item.classList.toggle("is-complete", isComplete);
  item.querySelector("strong").textContent = label;
}

function saveTrainingPhotos() {
  const plant = plants.find((item) => item.id === pendingTrainingPlantId);
  if (!plant) {
    return;
  }

  plant.trainingPhotos = [
    ...(plant.trainingPhotos || []),
    ...pendingTrainingPhotos
  ];
  savePlants();
  renderPlants();
}

function closeTrainingCapture() {
  trainingCaptureDialog.hidden = true;
  pendingTrainingPlantId = null;
  pendingTrainingPhotos = [];
}

function savePlant() {
  if (!activeCandidate) {
    return;
  }

  const plant = {
    id: crypto.randomUUID(),
    nickname: plantNameInput.value.trim() || suggestedName(activeCandidate.profile),
    species: activeCandidate.profile,
    identification: {
      confidence: activeCandidate.confidence,
      observationBox: activeCandidate.observationBox,
      providerName: activeCandidate.metadata.providerName,
      source: activeCandidate.metadata.source,
      providerPlantID: activeCandidate.metadata.providerPlantID || null
    },
    trainingSample: activeCandidate.trainingSample,
    photoUse: {
      personalRecognition: photoTrainingConsent === "yes",
      fullFrameStored: false
    },
    weatherSnapshot: weatherForPlantRecord(),
    dateAdded: new Date().toISOString(),
    locationNote: plantLocationInput.value.trim(),
    setting: plantSettingInput.value,
    sunExposure: plantSunInput.value,
    healthNotes: activeCandidate.issues.map((issue) => ({
      ...issue,
      date: new Date().toISOString()
    })),
    careLogs: []
  };

  plants.unshift(plant);
  savePlants();
  renderPlants();
  closeReview();
  maybeAskForTrainingPhotos(plant);
}

function suggestedName(profile) {
  const matchingCount = plants.filter((plant) => plant.species.commonName === profile.commonName).length;
  return `${profile.commonName} ${matchingCount + 1}`;
}

function renderPlants() {
  plantList.replaceChildren(...plants.map((plant) => {
    const fragment = plantCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".plant-card");
    const recommendation = recommendationsFor(plant)[0];

    fragment.querySelector(".plant-species").textContent = plant.species.commonName;
    fragment.querySelector(".plant-title").textContent = plant.nickname;
    fragment.querySelector(".status-pill").textContent = recommendation.statusLabel;
    fragment.querySelector(".status-pill").classList.add(recommendation.statusClass);
    fragment.querySelector(".next-action").textContent = recommendation.title;
    fragment.querySelector(".next-detail").textContent = recommendation.detail;
    fragment.querySelector(".care-context").textContent = careContextFor(plant);

    card.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        plant.careLogs.unshift({
          action: button.dataset.action,
          date: new Date().toISOString(),
          notes: ""
        });
        savePlants();
        renderPlants();
      });
    });

    return fragment;
  }));

  gardenSummary.textContent = plants.length === 1 ? "1 plant tracked" : `${plants.length} plants tracked`;
}

function recommendationsFor(plant) {
  const water = wateringRecommendation(plant);
  const fertilize = fertilizingRecommendation(plant);
  const prune = pruningRecommendation(plant);
  const inspect = inspectionRecommendation(plant);
  return [water, fertilize, prune, inspect]
    .filter(Boolean)
    .sort((left, right) => left.dueDate - right.dueDate || right.priority - left.priority);
}

function wateringRecommendation(plant) {
  const interval = adjustedWateringInterval(plant);
  const lastWatered = lastCareDate(plant, "water") || new Date(plant.dateAdded);
  let dueDate = addDays(lastWatered, interval);
  let detail = wateringDetail(plant, interval);
  const rainSoon = soakingRainSoon();

  if (
    rainSoon &&
    plant.setting !== "indoor" &&
    plant.setting !== "container" &&
    dueDate <= addDays(new Date(), 1)
  ) {
    dueDate = addDays(rainSoon.date, 1);
    detail = "Rain is expected soon, so watering can wait unless the soil is already dry.";
  }

  return decorateRecommendation({
    title: `Water ${plant.nickname}`,
    detail,
    dueDate,
    priorityBase: 90
  });
}

function fertilizingRecommendation(plant) {
  const lastFertilized = lastCareDate(plant, "fertilize") || new Date(plant.dateAdded);
  let dueDate = addDays(lastFertilized, plant.species.fertilizeEveryDays);
  let detail = `${plant.species.commonName} is on a ${plant.species.fertilizeEveryDays}-day fertilizer rhythm.`;
  const lastPruned = lastCareDate(plant, "prune");

  if (lastPruned && differenceInCalendarDays(new Date(), lastPruned) <= 10 && dueDate <= addDays(new Date(), 2)) {
    dueDate = addDays(lastPruned, 10);
    detail = "Recent pruning is logged, so hold fertilizer briefly while the plant rebounds.";
  }

  return decorateRecommendation({
    title: `Fertilize ${plant.nickname}`,
    detail,
    dueDate,
    priorityBase: 55
  });
}

function pruningRecommendation(plant) {
  const month = new Date().getMonth() + 1;
  if (!plant.species.pruneWindowMonths.includes(month)) {
    return null;
  }

  const lastPruned = lastCareDate(plant, "prune") || new Date(plant.dateAdded);
  return decorateRecommendation({
    title: `Check pruning on ${plant.nickname}`,
    detail: `This is a normal pruning window for ${plant.species.commonName}.`,
    dueDate: addDays(lastPruned, 45),
    priorityBase: 65
  });
}

function inspectionRecommendation(plant) {
  const note = plant.healthNotes.find((healthNote) => healthNote.severity !== "none");
  if (!note) {
    return null;
  }

  const lastInspected = lastCareDate(plant, "inspect");
  if (lastInspected && lastInspected >= new Date(note.date)) {
    return null;
  }

  return {
    title: `Inspect ${plant.nickname}`,
    detail: `${note.title}: ${note.detail}`,
    dueDate: new Date(),
    priority: note.severity === "action" ? 100 : 80,
    statusLabel: note.severity === "action" ? "Due now" : "Soon",
    statusClass: note.severity === "action" ? "status-now" : "status-soon"
  };
}

function adjustedWateringInterval(plant) {
  let interval = Math.max(1, Math.round((plant.species.minimumWateringDays + plant.species.maximumWateringDays) / 2));

  if (plant.setting === "container") interval -= 2;
  if (plant.setting === "raisedBed") interval -= 1;
  if (plant.setting === "indoor") interval += 2;

  if (plant.sunExposure === "fullSun") interval -= 1;
  if (plant.sunExposure === "shade") interval += 1;

  if (forecast.slice(0, 3).some((day) => day.highFahrenheit >= 90 || day.humidity < 0.4 || day.windMph >= 13)) {
    interval -= 1;
  }

  if (
    forecast.slice(0, 3).some((day) => day.precipitationInches >= 0.25) &&
    plant.setting !== "indoor" &&
    plant.setting !== "container"
  ) {
    interval += plant.species.overwateringSensitivity >= 0.45 ? 2 : 1;
  }

  if (plant.species.droughtTolerance <= 0.2) interval -= 1;
  if (plant.species.droughtTolerance >= 0.7) interval += 2;

  return Math.min(Math.max(interval, 1), 21);
}

function wateringDetail(plant, interval) {
  const hotSoon = forecast.slice(0, 3).some((day) => day.highFahrenheit >= 90);
  const rainSoon = forecast.slice(0, 3).some((day) => day.precipitationInches >= 0.25);
  const lastPruned = lastCareDate(plant, "prune");

  if (lastPruned && differenceInCalendarDays(new Date(), lastPruned) <= 7) {
    return `Recent pruning is logged, so check soil before soaking. The current target is about every ${interval} day(s).`;
  }

  if (hotSoon) {
    return `Heat is coming, so the interval tightened to about every ${interval} day(s). Check soil before soaking.`;
  }

  if (rainSoon && plant.setting !== "indoor") {
    return `Rain is in the forecast, so the interval relaxed to about every ${interval} day(s).`;
  }

  return `Species, setting, sun, and recent care point to about every ${interval} day(s).`;
}

function careContextFor(plant) {
  const context = [];
  const lastWatered = lastCareDate(plant, "water");
  const lastFertilized = lastCareDate(plant, "fertilize");
  const lastPruned = lastCareDate(plant, "prune");
  const lastInspected = lastCareDate(plant, "inspect");
  const lastObserved = lastCareDate(plant, "observe");
  const rain = forecast.find((day) => day.precipitationInches >= 0.25);

  if (lastObserved) {
    context.push(`Seen ${relativeDay(lastObserved)}.`);
  }

  context.push(lastWatered ? `Watered ${relativeDay(lastWatered)}.` : "No watering logged yet.");

  if (lastFertilized) {
    context.push(`Fertilized ${relativeDay(lastFertilized)}.`);
  }

  if (lastPruned) {
    context.push(`Pruned ${relativeDay(lastPruned)}.`);
  }

  if (lastInspected) {
    context.push(`Checked ${relativeDay(lastInspected)}.`);
  }

  if (rain) {
    context.push(`Weather includes ${rain.condition.toLowerCase()} ${relativeDay(rain.date)}.`);
  }

  return context.join(" ");
}

function decorateRecommendation(recommendation) {
  const dueDate = new Date(recommendation.dueDate);
  const daysUntilDue = differenceInCalendarDays(dueDate, new Date());
  const dueNow = daysUntilDue <= 0;
  const dueSoon = daysUntilDue <= 2;

  return {
    title: recommendation.title,
    detail: recommendation.detail,
    dueDate,
    priority: Math.max(1, Math.min(100, recommendation.priorityBase - Math.max(daysUntilDue, 0) * 7)),
    statusLabel: dueNow ? "Due now" : dueSoon ? "Soon" : "Scheduled",
    statusClass: dueNow ? "status-now" : dueSoon ? "status-soon" : "status-scheduled"
  };
}

function lastCareDate(plant, action) {
  const log = plant.careLogs.find((entry) => entry.action === action);
  return log ? new Date(log.date) : null;
}

function populateQuickSpecies() {
  quickSpeciesInput.replaceChildren(...profiles.map((profile, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = profile.commonName;
    return option;
  }));
}

function renderDetectionBox(candidate) {
  if (!candidate.observationBox) {
    detectionBox.hidden = true;
    return;
  }

  const box = candidate.observationBox;
  detectionBox.classList.toggle("is-weak-match", candidate.confidence < strongConfidence);
  detectionBox.style.left = `${box.x * 100}%`;
  detectionBox.style.top = `${box.y * 100}%`;
  detectionBox.style.width = `${box.width * 100}%`;
  detectionBox.style.height = `${box.height * 100}%`;
  detectionLabel.textContent = candidate.confidence < strongConfidence
    ? `Maybe ${candidate.profile.commonName}`
    : candidate.profile.commonName;
  detectionBox.hidden = false;
}

function renderCandidateOptions(selectedIndex) {
  matchOptions.replaceChildren(...activeCandidates.slice(0, 5).map((candidate, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "match-option";
    button.disabled = index === selectedIndex;
    button.textContent = `${candidate.profile.commonName} (${confidencePercent(candidate)})`;
    button.addEventListener("click", () => selectCandidate(index));
    return button;
  }));

  matchAlternatives.hidden = activeCandidates.length <= 1;
}

function confidenceHeading(candidate) {
  if (candidate.metadata.source === "local-demo") {
    return "Demo test";
  }

  if (isNoReliableCandidate(candidate)) {
    return "No reliable match";
  }

  if (candidate.confidence >= strongConfidence) {
    return "Likely match";
  }

  if (candidate.confidence >= weakConfidence) {
    return "Possible match";
  }

  return "Low-confidence match";
}

function confidenceWarning(candidate) {
  if (candidate.metadata.source === "local-demo") {
    return "Demo test only. Use Scan for real Pl@ntNet identification.";
  }

  if (isNoReliableCandidate(candidate)) {
    return "That photo did not produce a usable plant ID. Retake with one plant filling the box, or choose the plant manually.";
  }

  if (candidate.confidence < weakConfidence) {
    return "Low confidence. Try a closer, centered shot of leaves or flowers before saving.";
  }

  if (candidate.confidence < strongConfidence) {
    return "Possible match. Confirm the plant before saving.";
  }

  return "";
}

function confidencePercent(candidate) {
  return `${Math.round(candidate.confidence * 100)}%`;
}

function isNoReliableCandidate(candidate) {
  return candidate.metadata.source !== "local-demo" &&
    candidate.metadata.source !== "quick-add" &&
    candidate.confidence < noReliableConfidence;
}

function demoCandidateFor(payload) {
  const seed = Number.isInteger(payload.demoIndex)
    ? payload.demoIndex
    : Number(payload.imageSignature || payload.imageDataUrl?.length || 0);
  const profileIndex = Math.abs(seed) % profiles.length;
  const profile = profiles[profileIndex];

  return {
    profile,
    confidence: 0.91,
    observationBox: payload.focusBox || demoObservationBox(profileIndex),
    metadata: {
      providerName: "GardenSnap demo",
      providerPlantID: `demo-${profile.commonName.toLowerCase()}`,
      source: "local-demo"
    },
    issues: [{
      title: `Watch for ${profile.diseaseWatchlist[0]}`,
      detail: `The scan does not confirm disease, but ${profile.commonName} commonly needs checks for ${profile.diseaseWatchlist[0]}.`,
      severity: "watch"
    }]
  };
}

function demoObservationBox(profileIndex) {
  const boxes = [
    { x: 0.18, y: 0.16, width: 0.58, height: 0.64 },
    { x: 0.26, y: 0.12, width: 0.44, height: 0.72 },
    { x: 0.15, y: 0.18, width: 0.68, height: 0.56 },
    { x: 0.32, y: 0.2, width: 0.36, height: 0.52 }
  ];
  return boxes[profileIndex % boxes.length];
}

function buildDemoForecast() {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, index) => ({
    date: addDays(today, index),
    highFahrenheit: index === 2 ? 92 : 78 + (index % 3) * 4,
    lowFahrenheit: 61 + (index % 2) * 3,
    precipitationInches: index === 1 ? 0.45 : index === 4 ? 0.18 : 0,
    humidity: index === 2 ? 0.38 : 0.58,
    windMph: index === 2 ? 14 : 7,
    condition: index === 1 ? "Rain" : "Partly cloudy"
  }));
}

function renderWeather() {
  const today = forecast[0];
  const rain = forecast.find((day) => day.precipitationInches >= 0.25);
  const currentTemp = Number.isFinite(weatherSnapshot.current?.temperatureF)
    ? weatherSnapshot.current.temperatureF
    : today.highFahrenheit;
  const prefix = weatherSnapshot.zip ? `${weatherSnapshot.zip}: ` : "";
  weatherPill.textContent = rain
    ? `${prefix}${Math.round(currentTemp)}F, rain soon`
    : `${prefix}${Math.round(currentTemp)}F`;
}

function relativeDay(date) {
  const days = differenceInCalendarDays(new Date(), date);

  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 0) return days === -1 ? "tomorrow" : `in ${Math.abs(days)} days`;
  return `${days} days ago`;
}

function soakingRainSoon() {
  const today = startOfDay(new Date());
  const windowEnd = addDays(today, 2);
  return forecast.find((day) => day.date >= today && day.date <= windowEnd && day.precipitationInches >= 0.35);
}

function differenceInCalendarDays(left, right) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((startOfDay(left) - startOfDay(right)) / msPerDay);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function loadPlants() {
  try {
    const storedPlants = JSON.parse(localStorage.getItem(storageKey)) || [];
    const sanitizedPlants = storedPlants.map(sanitizePlantRecord);
    if (JSON.stringify(storedPlants) !== JSON.stringify(sanitizedPlants)) {
      localStorage.setItem(storageKey, JSON.stringify(sanitizedPlants));
    }
    return sanitizedPlants;
  } catch {
    return [];
  }
}

function savePlants() {
  plants = plants.map(sanitizePlantRecord);
  localStorage.setItem(storageKey, JSON.stringify(plants));
}

function sanitizePlantRecord(plant) {
  if (!plant || typeof plant !== "object") {
    return plant;
  }

  const trainingSample = plant.trainingSample
    ? {
      cropImageDataUrl: plant.trainingSample.cropImageDataUrl || null,
      capturedAt: plant.trainingSample.capturedAt || plant.dateAdded || null,
      cropBox: plant.trainingSample.cropBox || plant.identification?.observationBox || null,
      fullFrameStored: false,
      consentForPersonalRecognition: Boolean(
        plant.trainingSample.consentForPersonalRecognition ||
        plant.photoUse?.personalRecognition
      )
    }
    : null;

  return {
    ...plant,
    trainingSample,
    trainingPhotos: (plant.trainingPhotos || []).map((photo) => ({
      cropImageDataUrl: photo.cropImageDataUrl || null,
      capturedAt: photo.capturedAt || plant.dateAdded || null,
      cropBox: photo.cropBox || plant.identification?.observationBox || null,
      fullFrameStored: false
    })),
    photoUse: {
      ...(plant.photoUse || {}),
      fullFrameStored: false
    }
  };
}
