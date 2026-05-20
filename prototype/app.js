const camera = document.querySelector("#camera");
const appShell = document.querySelector(".app-shell");
const scanModeStatus = document.querySelector("#scan-mode-status");
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
const idOnlyStartButton = document.querySelector("#id-only-start");
const idOnlyGalleryOpenButton = document.querySelector("#id-only-gallery-open");
const scanResult = document.querySelector("#scan-result");
const providerStatus = document.querySelector("#provider-status");
const recognitionDebugSummary = document.querySelector("#recognition-debug-summary");
const matchEyebrow = document.querySelector("#match-eyebrow");
const matchName = document.querySelector("#match-name");
const matchDetail = document.querySelector("#match-detail");
const matchWarning = document.querySelector("#match-warning");
const matchAlternatives = document.querySelector("#match-alternatives");
const matchOptions = document.querySelector("#match-options");
const reviewAddButton = document.querySelector("#review-add");
const idOnlySavePhotoButton = document.querySelector("#id-only-save-photo");
const retryScanButton = document.querySelector("#retry-scan");
const manualFromScanButton = document.querySelector("#manual-from-scan");
const morePhotosFromScanButton = document.querySelector("#more-photos-from-scan");
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
const dataSettingsOpenButton = document.querySelector("#data-settings-open");
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
const morePhotosRequestDialog = document.querySelector("#more-photos-request");
const morePhotosPlantInput = document.querySelector("#more-photos-plant");
const morePhotosCount = document.querySelector("#more-photos-count");
const morePhotosTakeButton = document.querySelector("#more-photos-take");
const morePhotosDoneButton = document.querySelector("#more-photos-done");
const gardenScanCaptureDialog = document.querySelector("#garden-scan-capture");
const gardenScanProgress = document.querySelector("#garden-scan-progress");
const gardenScanQuality = document.querySelector("#garden-scan-quality");
const gardenScanTakeButton = document.querySelector("#garden-scan-take");
const gardenScanCancelButton = document.querySelector("#garden-scan-cancel");
const idOnlyCaptureDialog = document.querySelector("#id-only-capture");
const idOnlyProgress = document.querySelector("#id-only-progress");
const idOnlyQuality = document.querySelector("#id-only-quality");
const idOnlyZipInput = document.querySelector("#id-only-zip");
const idOnlyPlaceInput = document.querySelector("#id-only-place");
const idOnlyLocationOnceButton = document.querySelector("#id-only-location-once");
const idOnlyLocationStatus = document.querySelector("#id-only-location-status");
const idOnlyTakeButton = document.querySelector("#id-only-take");
const idOnlyCancelButton = document.querySelector("#id-only-cancel");
const idOnlyGalleryDialog = document.querySelector("#id-only-gallery");
const idOnlyGalleryCloseButton = document.querySelector("#id-only-gallery-close");
const idOnlyGalleryGrid = document.querySelector("#id-only-gallery-grid");
const photoLibraryDialog = document.querySelector("#photo-library");
const photoLibraryTitle = document.querySelector("#photo-library-title");
const photoLibraryCloseButton = document.querySelector("#photo-library-close");
const photoGrid = document.querySelector("#photo-grid");
const dataSettingsDialog = document.querySelector("#data-settings");
const dataSettingsCloseButton = document.querySelector("#data-settings-close");
const photoUseStatus = document.querySelector("#photo-use-status");
const photoUseAllowButton = document.querySelector("#photo-use-allow");
const photoUseDisableButton = document.querySelector("#photo-use-disable");
const dataExportButton = document.querySelector("#data-export");
const dataDeleteButton = document.querySelector("#data-delete");

const repository = window.GardeninStorageRepository.createRepository();
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
let pendingMorePhotosCount = 0;
let pendingProviderFallbackPayload = null;
let activePhotoLibraryPlantId = null;
let gardenScanCaptures = [];
let idOnlyCaptures = [];
let isIdOnlyResult = false;
let activeIdOnlyGalleryCandidate = null;
let activeIdOnlyQuality = null;
let activeIdOnlyLocation = { zip: "", placeNote: "" };
const photoFeatureCache = new Map();
const focusBox = { x: 0.18, y: 0.12, width: 0.64, height: 0.72 };
let idOnlyGallery = loadIdOnlyGallery();
const strongConfidence = 0.55;
const weakConfidence = 0.25;
const noReliableConfidence = 0.05;
const localRecognitionMinimumPhotos = 3;

const trainingShotPlan = [
  {
    step: "take-1",
    label: "Leaf close-up",
    prompt: "Frame a clear leaf close-up in the box.",
    reason: "leaf-close-up"
  },
  {
    step: "take-2",
    label: "Whole plant or flower",
    prompt: "Frame the whole plant, flower, fruit, or stem in the box.",
    reason: "whole-plant-or-feature"
  }
];

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
idOnlyStartButton.addEventListener("click", openIdOnlyCapture);
idOnlyGalleryOpenButton.addEventListener("click", openIdOnlyGallery);
reviewAddButton.addEventListener("click", openReview);
idOnlySavePhotoButton.addEventListener("click", saveActiveIdOnlyPhoto);
retryScanButton.addEventListener("click", retryScan);
manualFromScanButton.addEventListener("click", openManualFromScan);
morePhotosFromScanButton.addEventListener("click", openMorePhotosFromScan);
knownPlantYesButton.addEventListener("click", confirmKnownPlantObservation);
knownPlantNoButton.addEventListener("click", rejectKnownPlantObservation);
quickAddButton.addEventListener("click", openQuickAdd);
quickSpeciesInput.addEventListener("change", updateQuickAddSpecies);
savePlantButton.addEventListener("click", savePlant);
cancelReviewButton.addEventListener("click", closeReview);
weatherForm.addEventListener("submit", handleWeatherSubmit);
dataSettingsOpenButton.addEventListener("click", openDataSettings);
photoConsentYesButton.addEventListener("click", () => setPhotoTrainingConsent(true));
photoConsentNoButton.addEventListener("click", () => setPhotoTrainingConsent(false));
trainingRequestYesButton.addEventListener("click", startTrainingPhotoFlow);
trainingRequestNoButton.addEventListener("click", closeTrainingRequest);
trainingCaptureButton.addEventListener("click", captureTrainingPhoto);
trainingCaptureStopButton.addEventListener("click", closeTrainingCapture);
morePhotosTakeButton.addEventListener("click", captureMoreRecognitionPhoto);
morePhotosDoneButton.addEventListener("click", closeMorePhotosRequest);
gardenScanTakeButton.addEventListener("click", captureGardenScanPhoto);
gardenScanCancelButton.addEventListener("click", closeGardenScanCapture);
idOnlyTakeButton.addEventListener("click", captureIdOnlyPhoto);
idOnlyCancelButton.addEventListener("click", closeIdOnlyCapture);
idOnlyGalleryCloseButton.addEventListener("click", closeIdOnlyGallery);
idOnlyLocationOnceButton.addEventListener("click", requestIdOnlyLocationOnce);
photoLibraryCloseButton.addEventListener("click", closePhotoLibrary);
dataSettingsCloseButton.addEventListener("click", closeDataSettings);
photoUseAllowButton.addEventListener("click", () => updatePhotoTrainingConsentFromSettings(true));
photoUseDisableButton.addEventListener("click", () => updatePhotoTrainingConsentFromSettings(false));
dataExportButton.addEventListener("click", exportLocalData);
dataDeleteButton.addEventListener("click", deleteLocalData);
photoLibraryDialog.addEventListener("click", (event) => {
  if (event.target === photoLibraryDialog) {
    closePhotoLibrary();
  }
});
dataSettingsDialog.addEventListener("click", (event) => {
  if (event.target === dataSettingsDialog) {
    closeDataSettings();
  }
});
idOnlyGalleryDialog.addEventListener("click", (event) => {
  if (event.target === idOnlyGalleryDialog) {
    closeIdOnlyGallery();
  }
});

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

  await startGardenScanCapture();
}

function captureCurrentFrame() {
  if (!stream || !camera.videoWidth) {
    return null;
  }

  snapshot.width = camera.videoWidth;
  snapshot.height = camera.videoHeight;
  const context = snapshot.getContext("2d");
  context.drawImage(camera, 0, 0, snapshot.width, snapshot.height);
  const dataUrl = snapshot.toDataURL("image/jpeg", 0.82);
  const cropCanvas = cropCanvasFor(snapshot, focusBox);
  const focusedDataUrl = cropCanvas.toDataURL("image/jpeg", 0.86);
  lastScanImageDataUrl = dataUrl;
  lastScanCropDataUrl = focusedDataUrl;

  const imageSignature = getImageSignature(context, snapshot.width, snapshot.height);
  return {
    imageDataUrl: dataUrl,
    cropImageDataUrl: focusedDataUrl,
    imageSignature,
    quality: scoreCropQuality(cropCanvas)
  };
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
  return cropCanvasFor(sourceCanvas, box).toDataURL("image/jpeg", 0.86);
}

function cropCanvasFor(sourceCanvas, box) {
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
  return crop;
}

async function identifyFromImage(payload, options = {}) {
  setIdentifying(true);

  try {
    if (!options.skipLocalRepository && !options.idOnly) {
      renderRecognitionDebug("Checking gardenin photos first.");
      const localMatch = await localPlantMatchFor(payload);
      if (localMatch) {
        pendingProviderFallbackPayload = payload;
        renderRecognitionDebug(
          `gardenin photos recognized ${localMatch.plant.nickname} at ${confidencePercent(localMatch.candidate)} from ${localMatch.candidate.metadata.sampleCount} photo(s).`
        );
        showKnownPlantRecognition(localMatch.plant, localMatch.candidate);
        return;
      }
    }

    pendingProviderFallbackPayload = null;
    renderRecognitionDebug(options.idOnly
      ? "ID only: sending the best of 3 photos to Pl@ntNet. This will not add garden tracking."
      : "Using Pl@ntNet because no confident local photo match was found.");
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

    if (options.idOnly) {
      showIdOnlyCandidates(result.candidates, payload);
    } else {
      showCandidates(result.candidates, payload);
    }
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
      reviewAddButton.hidden = Boolean(options.idOnly);
      reviewAddButton.disabled = true;
      reviewAddButton.textContent = "Add plant";
      idOnlySavePhotoButton.hidden = true;
      retryScanButton.hidden = false;
      manualFromScanButton.hidden = Boolean(options.idOnly) || !lastScanCropDataUrl;
      morePhotosFromScanButton.hidden = Boolean(options.idOnly) || !lastScanCropDataUrl || plants.length === 0;
    }
  } finally {
    setIdentifying(false);
  }
}

function showCandidates(candidates, payload) {
  setScanMode("garden");
  isIdOnlyResult = false;
  activeIdOnlyGalleryCandidate = null;
  idOnlySavePhotoButton.hidden = true;
  const trainingSample = payload?.imageDataUrl ? {
    id: makeId("photo"),
    cropImageDataUrl: payload.imageDataUrl,
    capturedAt: new Date().toISOString(),
    cropBox: payload.focusBox || null,
    fullFrameStored: false,
    consentForPersonalRecognition: photoTrainingConsent === "yes"
  } : null;
  const pendingScanPhotos = photoTrainingConsent === "yes"
    ? scanTrainingPhotosFromPayload(payload)
    : [];
  activeCandidates = candidates.map((candidate) => ({
    ...normalizeCandidate(candidate),
    trainingSample,
    pendingScanPhotos
  }));

  pendingProviderFallbackPayload = null;
  selectCandidate(0);

  if (payload?.imageDataUrl && !Number.isInteger(payload.demoIndex)) {
    freezeFeedForReview();
  }
}

function showIdOnlyCandidates(candidates, payload) {
  setScanMode("id-only");
  isIdOnlyResult = true;
  activeIdOnlyQuality = payload.quality || null;
  activeCandidates = candidates.map(normalizeCandidate);
  selectIdOnlyCandidate(0);
  scanResult.hidden = false;
  freezeFeedForReview();
}

function selectIdOnlyCandidate(index) {
  activeCandidate = activeCandidates[index];
  const isNoReliableMatch = isNoReliableCandidate(activeCandidate);
  showCameraOverlay(false);
  knownPlantPopover.hidden = true;
  renderDetectionBox(activeCandidate);
  scanGuide.hidden = Boolean(activeCandidate.observationBox);
  matchEyebrow.textContent = isNoReliableMatch ? "ID only - no reliable match" : "ID only";
  matchName.textContent = isNoReliableMatch ? "No reliable plant match" : activeCandidate.profile.commonName;
  matchDetail.textContent = `${confidencePercent(activeCandidate)} confidence from ${activeCandidate.metadata.providerName}`;
  matchWarning.textContent = idOnlyWarning({ quality: activeIdOnlyQuality });
  matchWarning.hidden = false;
  activeIdOnlyGalleryCandidate = isNoReliableMatch ? null : {
    imageDataUrl: lastScanCropDataUrl,
    capturedAt: new Date().toISOString(),
    cropBox: focusBox,
    fullFrameStored: false,
    species: activeCandidate.profile.commonName,
    scientificName: activeCandidate.profile.scientificName,
    providerName: activeCandidate.metadata.providerName,
    providerPlantID: activeCandidate.metadata.providerPlantID || null,
    confidence: activeCandidate.confidence,
    quality: activeIdOnlyQuality,
    seenLocation: activeIdOnlyLocation
  };
  reviewAddButton.hidden = false;
  reviewAddButton.disabled = isNoReliableMatch;
  reviewAddButton.textContent = "Use this ID";
  idOnlySavePhotoButton.hidden = isNoReliableMatch;
  idOnlySavePhotoButton.disabled = isNoReliableMatch;
  idOnlySavePhotoButton.textContent = "Save best photo";
  retryScanButton.hidden = false;
  retryScanButton.textContent = "Done";
  manualFromScanButton.hidden = true;
  morePhotosFromScanButton.hidden = true;
  renderCandidateOptions(index);
}

function idOnlyWarning(payload) {
  const quality = payload?.quality;
  const qualityText = quality
    ? `Best of 3: ${Math.round(quality.score * 100)}% quality (${quality.reason}).`
    : "Best of 3 photos was sent.";
  return `ID only. This plant is not added to your garden and no care tracking is created. ${qualityText}`;
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
  idOnlySavePhotoButton.hidden = true;
  retryScanButton.hidden = !isNoReliableMatch;
  manualFromScanButton.hidden = !isNoReliableMatch || !lastScanCropDataUrl;
  morePhotosFromScanButton.hidden = !isNoReliableMatch || !lastScanCropDataUrl || plants.length === 0;
  renderCandidateOptions(index);
  scanResult.hidden = false;
}

async function localPlantMatchFor(payload) {
  const recognition = window.GardeninPhotoRecognition;
  if (!recognition || !payload?.imageDataUrl || plants.length === 0) {
    renderRecognitionDebug("No saved local photo library yet. Using Pl@ntNet.");
    return null;
  }

  const queryFeature = await featureForPhoto(payload.imageDataUrl);
  if (!queryFeature) {
    renderRecognitionDebug("Could not read the scan crop for local matching. Using Pl@ntNet.");
    return null;
  }

  const records = [];
  const skipped = [];
  for (const plant of plants) {
    const photoUrls = photoDataUrlsForPlant(plant).slice(-24);
    if (photoUrls.length < localRecognitionMinimumPhotos) {
      skipped.push(`${plant.nickname}: ${photoUrls.length}/${localRecognitionMinimumPhotos}`);
      continue;
    }

    const features = [];
    for (const photoUrl of photoUrls) {
      const feature = await featureForPhoto(photoUrl);
      if (feature) {
        features.push(feature);
      }
    }

    records.push({
      plantId: plant.id,
      label: plant.nickname,
      features
    });
  }

  if (records.length === 0) {
    renderRecognitionDebug(`No plant has ${localRecognitionMinimumPhotos}+ crop photos yet. ${skipped.join("; ") || "Add more photos from each plant card."}`);
    return null;
  }

  const rankings = recognition.rankPlants(queryFeature, records, {
    minimumSamples: localRecognitionMinimumPhotos,
    threshold: 0.76,
    margin: 0.025
  });
  const best = rankings[0];
  const match = recognition.matchPlant(queryFeature, records, {
    minimumSamples: localRecognitionMinimumPhotos,
    threshold: 0.76,
    margin: 0.025
  });

  if (!match) {
    renderRecognitionDebug(best
      ? `Best local photo match was ${best.label} at ${Math.round(best.confidence * 100)}%, below the acceptance threshold or too close to another plant. Using Pl@ntNet.`
      : "Local photo matching found no usable score. Using Pl@ntNet.");
    return null;
  }

  const plant = plants.find((item) => item.id === match.plantId);
  if (!plant) {
    return null;
  }

  return {
    plant,
    candidate: {
      profile: plant.species,
      confidence: match.confidence,
      observationBox: payload.focusBox || focusBox,
      metadata: {
        providerName: "gardenin photos",
        providerPlantID: plant.id,
        source: "local-repository",
        sampleCount: match.sampleCount
      },
      issues: []
    }
  };
}

async function featureForPhoto(photoUrl) {
  if (photoFeatureCache.has(photoUrl)) {
    return photoFeatureCache.get(photoUrl);
  }

  const featurePromise = window.GardeninPhotoRecognition
    .featureFromDataUrl(photoUrl)
    .catch(() => null);
  photoFeatureCache.set(photoUrl, featurePromise);
  return featurePromise;
}

function photoDataUrlsForPlant(plant) {
  if (plant.photoUse?.personalRecognition !== true) {
    return [];
  }

  const urls = [];
  if (plant.trainingSample?.cropImageDataUrl) {
    urls.push(plant.trainingSample.cropImageDataUrl);
  }

  for (const photo of plant.trainingPhotos || []) {
    if (photo.cropImageDataUrl) {
      urls.push(photo.cropImageDataUrl);
    }
  }

  for (const log of plant.careLogs || []) {
    if (log.observation?.cropImageDataUrl) {
      urls.push(log.observation.cropImageDataUrl);
    }
  }

  return [...new Set(urls)];
}

function showKnownPlantRecognition(plant, candidate) {
  activeCandidate = candidate;
  activeCandidates = [candidate];
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
  knownPlantName.textContent = plant.nickname;
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
    id: makeId("log"),
    action: "observe",
    date: new Date().toISOString(),
    notes: "Recognized from camera scan.",
    observation: {
      id: makeId("photo"),
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
  pendingProviderFallbackPayload = null;
  flashCameraStage();
}

function rejectKnownPlantObservation() {
  knownPlantPopover.hidden = true;
  pendingKnownPlantId = null;
  if (activeCandidate?.metadata?.source === "local-repository" && pendingProviderFallbackPayload) {
    const payload = pendingProviderFallbackPayload;
    pendingProviderFallbackPayload = null;
    activeCandidate = null;
    activeCandidates = [];
    identifyFromImage(payload, { skipLocalRepository: true });
    return;
  }

  if (activeCandidate) {
    selectCandidate(0);
    freezeFeedForReview();
  }
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
  captureButton.textContent = isIdentifying ? "Scanning" : isFrozenAfterScan ? "Retake" : "Scan";
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

function renderRecognitionDebug(message) {
  recognitionDebugSummary.textContent = message;
}

function maybeShowPhotoConsent() {
  if (photoTrainingConsent) {
    return;
  }

  photoConsentDialog.hidden = false;
}

async function setPhotoTrainingConsent(isAllowed) {
  photoTrainingConsent = isAllowed ? "yes" : "no";
  repository.savePhotoTrainingConsent(photoTrainingConsent);
  photoConsentDialog.hidden = true;
  renderDataSettings();
  const zip = photoConsentZipInput.value.trim();
  if (/^\d{5}$/.test(zip)) {
    weatherZipInput.value = zip;
    await loadWeatherForZip(zip);
  }
}

function loadPhotoTrainingConsent() {
  const stored = repository.loadPhotoTrainingConsent();
  return stored === "yes" || stored === "no" ? stored : null;
}

async function handleWeatherSubmit(event) {
  event.preventDefault();
  await loadWeatherForZip(weatherZipInput.value);
}

async function loadStoredWeather() {
  const storedZip = repository.loadWeatherZip();
  if (!storedZip) {
    renderWeather();
    return;
  }

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
    repository.saveWeatherZip(result.zip);
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

function openIdOnlyCapture() {
  setScanMode("id-only");
  idOnlyCaptures = [];
  isIdOnlyResult = false;
  activeIdOnlyLocation = { zip: "", placeNote: "" };
  activeIdOnlyGalleryCandidate = null;
  idOnlySavePhotoButton.hidden = true;
  idOnlyLocationStatus.textContent = "No location lookup is made. ZIP/place and one-time device location are saved only if you save the best photo.";
  idOnlyLocationOnceButton.disabled = false;
  closeReview();
  scanResult.hidden = true;
  knownPlantPopover.hidden = true;
  detectionBox.hidden = true;
  idOnlyCaptureDialog.hidden = false;
  renderRecognitionDebug("ID only: take 3 photos. gardenin will send the best one to Pl@ntNet.");
  updateIdOnlyProgress();

  if (!stream) {
    startCamera();
  }
}

function requestIdOnlyLocationOnce() {
  if (!navigator.geolocation) {
    idOnlyLocationStatus.textContent = "Device location is not available in this browser.";
    return;
  }

  idOnlyLocationOnceButton.disabled = true;
  idOnlyLocationStatus.textContent = "Requesting one-time device location.";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      activeIdOnlyLocation = {
        ...activeIdOnlyLocation,
        ...idOnlyLocationFromInputs(),
        coordinates: {
          latitude: roundCoordinate(position.coords.latitude),
          longitude: roundCoordinate(position.coords.longitude),
          accuracyMeters: Math.round(position.coords.accuracy || 0),
          capturedAt: new Date().toISOString()
        }
      };
      idOnlyLocationStatus.textContent = `One-time location captured near ${activeIdOnlyLocation.coordinates.latitude}, ${activeIdOnlyLocation.coordinates.longitude}. Saved only if you save the best photo.`;
      idOnlyLocationOnceButton.disabled = false;
    },
    () => {
      idOnlyLocationStatus.textContent = "Location was not saved. You can still use ZIP or place note.";
      idOnlyLocationOnceButton.disabled = false;
    },
    {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: 10000
    }
  );
}

async function captureIdOnlyPhoto() {
  if (!stream || !camera.videoWidth) {
    await startCamera();
    return;
  }

  snapshot.width = camera.videoWidth;
  snapshot.height = camera.videoHeight;
  const context = snapshot.getContext("2d");
  context.drawImage(camera, 0, 0, snapshot.width, snapshot.height);
  const cropCanvas = cropCanvasFor(snapshot, focusBox);
  const capture = {
    imageDataUrl: cropCanvas.toDataURL("image/jpeg", 0.86),
    previewDataUrl: snapshot.toDataURL("image/jpeg", 0.82),
    capturedAt: new Date().toISOString(),
    cropBox: focusBox,
    fullFrameStored: false,
    quality: scoreCropQuality(cropCanvas)
  };

  idOnlyCaptures.push(capture);
  flashCameraStage();
  updateIdOnlyProgress();

  if (idOnlyCaptures.length >= 3) {
    await identifyBestIdOnlyCapture();
  }
}

async function identifyBestIdOnlyCapture() {
  const bestCapture = bestIdOnlyCapture();
  if (!bestCapture) {
    return;
  }

  activeIdOnlyLocation = {
    ...activeIdOnlyLocation,
    ...idOnlyLocationFromInputs()
  };
  idOnlyCaptureDialog.hidden = true;
  lastScanImageDataUrl = bestCapture.previewDataUrl;
  lastScanCropDataUrl = bestCapture.imageDataUrl;
  renderRecognitionDebug(`ID only: selected photo ${bestCapture.number} of 3 at ${Math.round(bestCapture.quality.score * 100)}% quality.`);
  await identifyFromImage({
    imageDataUrl: bestCapture.imageDataUrl,
    imageSignature: Math.round(bestCapture.quality.score * 1000),
    focusBox,
    quality: bestCapture.quality,
    seenLocation: activeIdOnlyLocation
  }, {
    skipLocalRepository: true,
    idOnly: true
  });
}

function idOnlyLocationFromInputs() {
  const zip = idOnlyZipInput.value.trim();
  return {
    zip: /^\d{5}$/.test(zip) ? zip : "",
    placeNote: idOnlyPlaceInput.value.trim()
  };
}

function roundCoordinate(value) {
  return Math.round(Number(value) * 10000) / 10000;
}

function bestIdOnlyCapture() {
  return bestCaptureFrom(idOnlyCaptures);
}

function bestCaptureFrom(captures) {
  return captures
    .map((capture, index) => ({
      ...capture,
      number: index + 1
    }))
    .sort((left, right) => right.quality.score - left.quality.score)[0] || null;
}

function updateIdOnlyProgress() {
  for (let index = 0; index < 3; index += 1) {
    const item = idOnlyProgress.querySelector(`[data-step="id-photo-${index + 1}"]`);
    if (!item) {
      continue;
    }

    const capture = idOnlyCaptures[index];
    item.classList.toggle("is-complete", Boolean(capture));
    item.querySelector("strong").textContent = capture
      ? `${Math.round(capture.quality.score * 100)}%`
      : "Needed";
  }

  const next = Math.min(idOnlyCaptures.length + 1, 3);
  idOnlyTakeButton.textContent = idOnlyCaptures.length >= 3 ? "Identifying" : `Take photo ${next}`;
  idOnlyTakeButton.disabled = idOnlyCaptures.length >= 3;
  const bestCapture = bestIdOnlyCapture();
  idOnlyQuality.textContent = bestCapture
    ? `Best photo: ${bestCapture.number} of 3, ${Math.round(bestCapture.quality.score * 100)}% quality (${bestCapture.quality.reason}).`
    : "Best photo: waiting.";
}

function closeIdOnlyCapture() {
  setScanMode("garden");
  idOnlyCaptureDialog.hidden = true;
  idOnlyCaptures = [];
  idOnlyTakeButton.disabled = false;
  updateIdOnlyProgress();
}

function confirmIdOnlyResult() {
  renderRecognitionDebug(`ID only confirmed: ${activeCandidate.profile.commonName}. It was not added to the garden and no care tracking was created.`);
  setScanMode("garden");
  scanResult.hidden = true;
  detectionBox.hidden = true;
  isIdOnlyResult = false;
  activeCandidate = null;
  activeCandidates = [];
  activeIdOnlyGalleryCandidate = null;
  idOnlySavePhotoButton.hidden = true;
  reviewAddButton.textContent = "Add plant";
  retryScanButton.textContent = "Try again";
  startCamera();
}

function saveActiveIdOnlyPhoto() {
  if (!activeIdOnlyGalleryCandidate) {
    return;
  }

  const savedPhoto = {
    id: makeId("id-only"),
    ...activeIdOnlyGalleryCandidate,
    savedAt: new Date().toISOString()
  };
  idOnlyGallery.unshift(savedPhoto);
  idOnlyGallery = idOnlyGallery.slice(0, 100);
  saveIdOnlyGallery();
  idOnlySavePhotoButton.textContent = "Saved";
  idOnlySavePhotoButton.disabled = true;
  renderRecognitionDebug(`Saved ${savedPhoto.species} to the personal ID gallery. It was not added to garden tracking.`);
}

function openIdOnlyGallery() {
  renderIdOnlyGallery();
  idOnlyGalleryDialog.hidden = false;
}

function closeIdOnlyGallery() {
  idOnlyGalleryDialog.hidden = true;
  idOnlyGalleryGrid.replaceChildren();
}

function renderIdOnlyGallery() {
  if (idOnlyGallery.length === 0) {
    const empty = document.createElement("p");
    empty.className = "photo-empty";
    empty.textContent = "No ID-only photos saved yet.";
    idOnlyGalleryGrid.replaceChildren(empty);
    return;
  }

  idOnlyGalleryGrid.replaceChildren(...idOnlyGallery.map(idOnlyGalleryTileFor));
}

function idOnlyGalleryTileFor(photo) {
  const tile = document.createElement("article");
  tile.className = "photo-tile";

  const image = document.createElement("img");
  image.src = photo.imageDataUrl;
  image.alt = photo.species || "ID-only plant photo";
  image.loading = "lazy";

  const label = document.createElement("strong");
  label.textContent = photo.species || "Unknown plant";

  const meta = document.createElement("span");
  const confidence = Number.isFinite(photo.confidence)
    ? `${Math.round(photo.confidence * 100)}%`
    : "unknown";
  const coordinates = photo.seenLocation?.coordinates
    ? `${photo.seenLocation.coordinates.latitude}, ${photo.seenLocation.coordinates.longitude}`
    : "";
  const location = [photo.seenLocation?.zip, photo.seenLocation?.placeNote, coordinates]
    .filter(Boolean)
    .join(", ");
  meta.textContent = `${formatPhotoDate(photo.savedAt || photo.capturedAt)} - ${confidence} from ${photo.providerName || "provider"}${location ? ` - ${location}` : ""}`;

  const actions = document.createElement("div");
  actions.className = "photo-actions";

  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.textContent = "Export";
  exportButton.addEventListener("click", () => exportIdOnlyPhoto(photo));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteIdOnlyPhoto(photo.id));

  actions.append(exportButton, deleteButton);
  tile.append(image, label, meta, actions);
  return tile;
}

function exportIdOnlyPhoto(photo) {
  const link = document.createElement("a");
  link.href = photo.imageDataUrl;
  link.download = `${slugForFile(photo.species || "id-only")}-${photo.id || "photo"}.jpg`;
  document.body.append(link);
  link.click();
  link.remove();
}

function deleteIdOnlyPhoto(photoId) {
  const shouldDelete = window.confirm("Delete this ID-only gallery photo?");
  if (!shouldDelete) {
    return;
  }

  idOnlyGallery = idOnlyGallery.filter((photo) => photo.id !== photoId);
  saveIdOnlyGallery();
  renderIdOnlyGallery();
}

function scoreCropQuality(cropCanvas) {
  const context = cropCanvas.getContext("2d", { willReadFrequently: true });
  const imageData = context.getImageData(0, 0, cropCanvas.width, cropCanvas.height).data;
  let totalLight = 0;
  let totalSaturation = 0;
  let totalGreenBias = 0;
  let totalEdge = 0;
  let lightSquares = 0;
  let edgeCount = 0;
  const pixelCount = Math.max(1, cropCanvas.width * cropCanvas.height);

  for (let y = 0; y < cropCanvas.height; y += 1) {
    for (let x = 0; x < cropCanvas.width; x += 1) {
      const index = (y * cropCanvas.width + x) * 4;
      const red = imageData[index] / 255;
      const green = imageData[index + 1] / 255;
      const blue = imageData[index + 2] / 255;
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const light = 0.299 * red + 0.587 * green + 0.114 * blue;

      totalLight += light;
      lightSquares += light * light;
      totalSaturation += max - min;
      totalGreenBias += Math.max(0, green - Math.max(red, blue));

      if (x > 0) {
        const leftIndex = index - 4;
        const leftLight = (
          0.299 * imageData[leftIndex] +
          0.587 * imageData[leftIndex + 1] +
          0.114 * imageData[leftIndex + 2]
        ) / 255;
        totalEdge += Math.abs(light - leftLight);
        edgeCount += 1;
      }

      if (y > 0) {
        const upperIndex = index - cropCanvas.width * 4;
        const upperLight = (
          0.299 * imageData[upperIndex] +
          0.587 * imageData[upperIndex + 1] +
          0.114 * imageData[upperIndex + 2]
        ) / 255;
        totalEdge += Math.abs(light - upperLight);
        edgeCount += 1;
      }
    }
  }

  const averageLight = totalLight / pixelCount;
  const contrast = Math.sqrt(Math.max(0, lightSquares / pixelCount - averageLight * averageLight));
  const brightnessScore = clamp(1 - Math.abs(averageLight - 0.52) / 0.52, 0, 1);
  const sharpnessScore = clamp((edgeCount ? totalEdge / edgeCount : 0) * 8, 0, 1);
  const contrastScore = clamp(contrast / 0.24, 0, 1);
  const plantColorScore = clamp((totalSaturation / pixelCount) * 1.8 + (totalGreenBias / pixelCount) * 2.6, 0, 1);
  const score = clamp(
    sharpnessScore * 0.42 +
    brightnessScore * 0.24 +
    contrastScore * 0.18 +
    plantColorScore * 0.16,
    0,
    1
  );

  return {
    score,
    sharpnessScore,
    brightnessScore,
    contrastScore,
    plantColorScore,
    reason: `sharp ${Math.round(sharpnessScore * 100)}%, light ${Math.round(brightnessScore * 100)}%, contrast ${Math.round(contrastScore * 100)}%, color ${Math.round(plantColorScore * 100)}%`
  };
}

function openReview() {
  if (isIdOnlyResult) {
    confirmIdOnlyResult();
    return;
  }

  if (!activeCandidate || isNoReliableCandidate(activeCandidate)) {
    return;
  }

  freezeFeedForReview();
  prepareReview("scan");
}

function retryScan() {
  setScanMode("garden");
  isIdOnlyResult = false;
  activeIdOnlyGalleryCandidate = null;
  closeReview();
  closeGardenScanCapture();
  closeIdOnlyCapture();
  knownPlantPopover.hidden = true;
  morePhotosRequestDialog.hidden = true;
  trainingCaptureDialog.hidden = true;
  scanResult.hidden = true;
  detectionBox.hidden = true;
  retryScanButton.hidden = true;
  manualFromScanButton.hidden = true;
  morePhotosFromScanButton.hidden = true;
  reviewAddButton.hidden = false;
  reviewAddButton.textContent = "Add plant";
  idOnlySavePhotoButton.hidden = true;
  retryScanButton.textContent = "Try again";
  startCamera();
}

function openManualFromScan() {
  if (!lastScanCropDataUrl) {
    return;
  }

  activeCandidate = quickAddCandidate(profiles[0]);
  activeCandidate.trainingSample = {
    id: makeId("photo"),
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

function openMorePhotosFromScan() {
  if (!lastScanCropDataUrl || plants.length === 0) {
    return;
  }

  populateMorePhotosPlantOptions();
  pendingMorePhotosCount = 0;
  morePhotosCount.textContent = "0 photos added this session.";
  morePhotosRequestDialog.hidden = false;
}

function populateMorePhotosPlantOptions() {
  morePhotosPlantInput.replaceChildren(...plants.map((plant) => {
    const option = document.createElement("option");
    option.value = plant.id;
    option.textContent = plant.nickname;
    return option;
  }));
}

async function captureMoreRecognitionPhoto() {
  const plant = plants.find((item) => item.id === morePhotosPlantInput.value);
  if (!plant) {
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
  plant.trainingPhotos = [
    ...(plant.trainingPhotos || []),
    {
      id: makeId("photo"),
      cropImageDataUrl: cropDataUrl(snapshot, focusBox),
      capturedAt: new Date().toISOString(),
      cropBox: focusBox,
      fullFrameStored: false,
      reason: "future-recognition"
    }
  ];
  pendingMorePhotosCount += 1;
  morePhotosCount.textContent = pendingMorePhotosCount === 1
    ? "1 photo added this session."
    : `${pendingMorePhotosCount} photos added this session.`;
  savePlants();
  renderPlants();
  flashCameraStage();
}

function closeMorePhotosRequest() {
  morePhotosRequestDialog.hidden = true;
  pendingMorePhotosCount = 0;
}

async function startGardenScanCapture() {
  setScanMode("garden");
  gardenScanCaptures = [];
  activeIdOnlyGalleryCandidate = null;
  isIdOnlyResult = false;
  closeReview();
  closeIdOnlyCapture();
  knownPlantPopover.hidden = true;
  scanResult.hidden = true;
  detectionBox.hidden = true;
  gardenScanCaptureDialog.hidden = false;
  renderRecognitionDebug("Garden scan: take 3 photos. gardenin will send the strongest crop only.");
  updateGardenScanProgress();
  await captureGardenScanPhoto();
}

async function captureGardenScanPhoto() {
  if (!stream || !camera.videoWidth) {
    await startCamera();
    return;
  }

  const frame = captureCurrentFrame();
  if (!frame) {
    return;
  }

  gardenScanCaptures.push({
    imageDataUrl: frame.cropImageDataUrl,
    previewDataUrl: frame.imageDataUrl,
    imageSignature: frame.imageSignature,
    capturedAt: new Date().toISOString(),
    cropBox: focusBox,
    fullFrameStored: false,
    quality: frame.quality
  });
  flashCameraStage();
  updateGardenScanProgress();

  if (gardenScanCaptures.length >= 3) {
    await identifyBestGardenScanCapture();
  }
}

async function identifyBestGardenScanCapture() {
  const bestCapture = bestCaptureFrom(gardenScanCaptures);
  if (!bestCapture) {
    return;
  }

  gardenScanCaptureDialog.hidden = true;
  lastScanImageDataUrl = bestCapture.previewDataUrl;
  lastScanCropDataUrl = bestCapture.imageDataUrl;
  const bestCaptureIndex = bestCapture.number - 1;
  const extraTrainingPhotos = gardenScanCaptures
    .filter((capture, index) => index !== bestCaptureIndex)
    .map((capture) => ({
      imageDataUrl: capture.imageDataUrl,
      capturedAt: capture.capturedAt,
      cropBox: capture.cropBox,
      quality: capture.quality
    }));

  renderRecognitionDebug(`Garden scan: selected photo ${bestCapture.number} of 3 at ${Math.round(bestCapture.quality.score * 100)}% quality.`);
  await identifyFromImage({
    imageDataUrl: bestCapture.imageDataUrl,
    imageSignature: Math.round(bestCapture.quality.score * 1000),
    focusBox,
    quality: bestCapture.quality,
    extraTrainingPhotos
  });
}

function closeGardenScanCapture() {
  gardenScanCaptureDialog.hidden = true;
  gardenScanCaptures = [];
  gardenScanTakeButton.disabled = false;
  updateGardenScanProgress();
}

function updateGardenScanProgress() {
  for (let index = 0; index < 3; index += 1) {
    const item = gardenScanProgress.querySelector(`[data-step="garden-photo-${index + 1}"]`);
    if (!item) {
      continue;
    }

    const capture = gardenScanCaptures[index];
    item.classList.toggle("is-complete", Boolean(capture));
    item.querySelector("strong").textContent = capture
      ? `${Math.round(capture.quality.score * 100)}%`
      : "Needed";
  }

  const next = Math.min(gardenScanCaptures.length + 1, 3);
  gardenScanTakeButton.textContent = gardenScanCaptures.length >= 3 ? "Identifying" : `Take photo ${next}`;
  gardenScanTakeButton.disabled = gardenScanCaptures.length >= 3;
  const bestCapture = bestCaptureFrom(gardenScanCaptures);
  gardenScanQuality.textContent = bestCapture
    ? `Best photo: ${bestCapture.number} of 3, ${Math.round(bestCapture.quality.score * 100)}% quality (${bestCapture.quality.reason}).`
    : "Best photo: waiting.";
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

async function openQuickAdd() {
  setScanMode("garden");
  const frame = await currentFrameForManualEntry();
  if (!frame) {
    return;
  }

  quickSpeciesInput.value = "0";
  activeCandidate = quickAddCandidate(profiles[0]);
  activeCandidate.trainingSample = trainingSampleFromCrop(frame.cropImageDataUrl);
  activeCandidates = [activeCandidate];
  detectionBox.hidden = true;
  scanResult.hidden = true;
  freezeFeedForReview();
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

async function currentFrameForManualEntry() {
  if (isFrozenAfterScan && lastScanCropDataUrl) {
    return {
      imageDataUrl: lastScanImageDataUrl,
      cropImageDataUrl: lastScanCropDataUrl,
      imageSignature: 0
    };
  }

  if (!stream || !camera.videoWidth) {
    renderRecognitionDebug("Quick add needs a current plant photo. Start the camera, frame the plant, then use Quick add.");
    await startCamera();
    return null;
  }

  return captureCurrentFrame();
}

function trainingSampleFromCrop(cropImageDataUrl) {
  return {
    id: makeId("photo"),
    cropImageDataUrl,
    capturedAt: new Date().toISOString(),
    cropBox: focusBox,
    fullFrameStored: false,
    consentForPersonalRecognition: photoTrainingConsent === "yes"
  };
}

function maybeAskForTrainingPhotos(plant) {
  if (photoTrainingConsent !== "yes" || !plant?.trainingSample?.cropImageDataUrl) {
    return;
  }

  pendingTrainingPlantId = plant.id;
  pendingTrainingPhotos = [];
  trainingRequestTitle.textContent = `Help gardenin recognize ${plant.nickname} in the future?`;
  trainingRequestDetail.textContent = "Capture a leaf close-up, then a whole-plant or flower/stem shot. Plant-box crops only.";
  trainingRequestYesButton.textContent = trainingShotPlan[0].label;
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
    id: makeId("photo"),
    cropImageDataUrl: cropDataUrl(snapshot, focusBox),
    capturedAt: new Date().toISOString(),
    cropBox: focusBox,
    fullFrameStored: false,
    reason: trainingStepForIndex(pendingTrainingPhotos.length).reason,
    shotType: trainingStepForIndex(pendingTrainingPhotos.length).label
  });

  if (pendingTrainingPhotos.length >= trainingShotPlan.length) {
    updateTrainingProgress();
    saveTrainingPhotos();
    closeTrainingCapture();
    return;
  }

  updateTrainingCaptureText();
  updateTrainingProgress();
}

function updateTrainingCaptureText() {
  const nextPhoto = Math.min(pendingTrainingPhotos.length + 1, trainingShotPlan.length);
  const step = trainingStepForIndex(pendingTrainingPhotos.length);
  trainingPhotoCount.textContent = String(nextPhoto);
  const plant = plants.find((item) => item.id === pendingTrainingPlantId);
  trainingCaptureTitle.textContent = plant
    ? `${step.prompt} ${plant.nickname} stays in the box.`
    : step.prompt;
  trainingCaptureButton.textContent = step.label;
}

function updateTrainingProgress() {
  const progressRoots = [trainingRequestProgress, trainingCaptureProgress].filter(Boolean);
  for (const root of progressRoots) {
    setTrainingStep(root, "scan", "Saved", true);
    trainingShotPlan.forEach((step, index) => {
      const isComplete = pendingTrainingPhotos.length > index;
      setTrainingStep(root, step.step, isComplete ? "Saved" : step.label, isComplete);
    });
  }
}

function trainingStepForIndex(index) {
  return trainingShotPlan[Math.min(index, trainingShotPlan.length - 1)];
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

  if (!activeCandidate.trainingSample?.cropImageDataUrl) {
    renderRecognitionDebug("A current plant photo is required before saving care guidance.");
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
    trainingPhotos: activeCandidate.pendingScanPhotos || [],
    careLogs: []
  };

  plants.unshift(plant);
  savePlants();
  renderPlants();
  closeReview();
  maybeAskForTrainingPhotos(plant);
}

function setScanMode(mode) {
  const isIdOnlyMode = mode === "id-only";
  appShell.classList.toggle("is-id-only-mode", isIdOnlyMode);
  scanModeStatus.textContent = isIdOnlyMode
    ? "ID only - not garden tracking"
    : "Garden scan";
}

function scanTrainingPhotosFromPayload(payload) {
  return (payload?.extraTrainingPhotos || []).map((photo) => ({
    id: makeId("photo"),
    cropImageDataUrl: photo.imageDataUrl,
    capturedAt: photo.capturedAt || new Date().toISOString(),
    cropBox: photo.cropBox || focusBox,
    fullFrameStored: false,
    reason: "scan-extra-angle",
    shotType: "Extra scan angle",
    quality: photo.quality || null
  }));
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
    const readiness = recognitionReadinessForPlant(plant);

    fragment.querySelector(".plant-species").textContent = plant.species.commonName;
    fragment.querySelector(".plant-title").textContent = plant.nickname;
    fragment.querySelector(".status-pill").textContent = recommendation.statusLabel;
    fragment.querySelector(".status-pill").classList.add(recommendation.statusClass);
    fragment.querySelector(".next-action").textContent = recommendation.title;
    fragment.querySelector(".next-detail").textContent = recommendation.detail;
    const readinessElement = fragment.querySelector(".recognition-readiness");
    readinessElement.textContent = readiness.text;
    readinessElement.classList.add(readiness.className);
    fragment.querySelector(".care-context").textContent = careContextFor(plant);

    card.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.action === "photos") {
          openPhotoLibrary(plant);
          return;
        }

        plant.careLogs.unshift({
          id: makeId("log"),
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

function recognitionReadinessForPlant(plant) {
  const photoCount = photoDataUrlsForPlant(plant).length;
  if (photoCount >= localRecognitionMinimumPhotos) {
    return {
      text: `Recognition ready: ${photoCount} crop photos saved.`,
      className: "is-ready"
    };
  }

  return {
    text: `Recognition building: ${photoCount}/${localRecognitionMinimumPhotos} crop photos saved.`,
    className: "is-building"
  };
}

function openPhotoLibrary(plant) {
  activePhotoLibraryPlantId = plant.id;
  const photos = photosForPlant(plant);
  photoLibraryTitle.textContent = `${plant.nickname} photos`;

  if (photos.length === 0) {
    const empty = document.createElement("p");
    empty.className = "photo-empty";
    empty.textContent = "No saved crop photos for this plant yet.";
    photoGrid.replaceChildren(empty);
  } else {
    photoGrid.replaceChildren(...photos.map(photoTileFor));
  }

  photoLibraryDialog.hidden = false;
}

function closePhotoLibrary() {
  photoLibraryDialog.hidden = true;
  activePhotoLibraryPlantId = null;
  photoGrid.replaceChildren();
}

function openDataSettings() {
  renderDataSettings();
  dataSettingsDialog.hidden = false;
}

function closeDataSettings() {
  dataSettingsDialog.hidden = true;
}

function renderDataSettings() {
  const photoCount = plants.reduce((count, plant) => count + photosForPlant(plant).length, 0);
  const galleryCount = idOnlyGallery.length;
  const consentText = photoTrainingConsent === "yes"
    ? "Allowed for personal recognition. New confirmed plant crops can improve recognition for you."
    : photoTrainingConsent === "no"
      ? "Off for recognition. Existing saved photos remain visible until deleted."
      : "Not set yet.";
  photoUseStatus.textContent = `${consentText} Local records: ${plants.length} plant(s), ${photoCount} plant photo(s), ${galleryCount} ID-only photo(s).`;
  photoUseAllowButton.disabled = photoTrainingConsent === "yes";
  photoUseDisableButton.disabled = photoTrainingConsent === "no";
}

function updatePhotoTrainingConsentFromSettings(isAllowed) {
  photoTrainingConsent = isAllowed ? "yes" : "no";
  repository.savePhotoTrainingConsent(photoTrainingConsent);
  for (const plant of plants) {
    plant.photoUse = {
      ...(plant.photoUse || {}),
      personalRecognition: photoTrainingConsent === "yes",
      fullFrameStored: false
    };
  }
  savePlants();
  renderPlants();
  renderDataSettings();
}

function exportLocalData() {
  const payload = repository.exportLocalData({
    plants,
    idOnlyGallery,
    photoTrainingConsent,
    weatherZip: weatherZipInput.value.trim() || repository.loadWeatherZip()
  });
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = URL.createObjectURL(blob);
  link.download = `gardenin-local-data-${date}.json`;
  document.body.append(link);
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  link.remove();
}

function deleteLocalData() {
  const shouldDelete = window.confirm("Delete local gardenin plants, crop photos, ID-only gallery, consent, and ZIP weather setting from this browser?");
  if (!shouldDelete) {
    return;
  }

  repository.clearAllLocalData();
  plants = [];
  idOnlyGallery = [];
  photoTrainingConsent = null;
  forecast = buildDemoForecast();
  weatherSnapshot = {
    source: "demo",
    place: "Demo forecast",
    zip: null,
    current: {
      temperatureF: forecast[0].highFahrenheit,
      condition: forecast[0].condition
    }
  };
  weatherZipInput.value = "";
  photoConsentZipInput.value = "";
  closeReview();
  closePhotoLibrary();
  closeIdOnlyGallery();
  closeDataSettings();
  renderWeather();
  renderPlants();
  renderDataSettings();
  maybeShowPhotoConsent();
}

function photosForPlant(plant) {
  const photos = [];

  if (plant.trainingSample?.cropImageDataUrl) {
    photos.push({
      id: plant.trainingSample.id,
      source: "trainingSample",
      imageDataUrl: plant.trainingSample.cropImageDataUrl,
      label: "Original ID photo",
      capturedAt: plant.trainingSample.capturedAt || plant.dateAdded,
      type: "Plant-box crop"
    });
  }

  (plant.trainingPhotos || []).forEach((photo, index) => {
    if (!photo.cropImageDataUrl) {
      return;
    }

    photos.push({
      id: photo.id,
      source: "trainingPhoto",
      imageDataUrl: photo.cropImageDataUrl,
      label: photo.reason === "future-recognition"
        ? `Future recognition photo ${index + 1}`
        : `Training photo ${index + 1}`,
      capturedAt: photo.capturedAt || plant.dateAdded,
      type: "Plant-box crop"
    });
  });

  (plant.careLogs || []).forEach((log) => {
    if (!log.observation?.cropImageDataUrl) {
      return;
    }

    photos.push({
      id: log.observation.id,
      source: "observation",
      logId: log.id,
      imageDataUrl: log.observation.cropImageDataUrl,
      label: "Recognition observation",
      capturedAt: log.date,
      type: confidenceLabel(log.observation.confidence)
    });
  });

  return photos.sort((left, right) => dateValue(right.capturedAt) - dateValue(left.capturedAt));
}

function photoTileFor(photo) {
  const tile = document.createElement("article");
  tile.className = "photo-tile";

  const image = document.createElement("img");
  image.src = photo.imageDataUrl;
  image.alt = photo.label;
  image.loading = "lazy";

  const label = document.createElement("strong");
  label.textContent = photo.label;

  const meta = document.createElement("span");
  meta.textContent = `${formatPhotoDate(photo.capturedAt)} - ${photo.type}`;

  const actions = document.createElement("div");
  actions.className = "photo-actions";

  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.textContent = "Export";
  exportButton.addEventListener("click", () => exportPlantPhoto(photo));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deletePlantPhoto(photo));

  actions.append(exportButton, deleteButton);
  tile.append(image, label, meta, actions);
  return tile;
}

function exportPlantPhoto(photo) {
  const plant = plants.find((item) => item.id === activePhotoLibraryPlantId);
  if (!plant || !photo?.imageDataUrl) {
    return;
  }

  const link = document.createElement("a");
  link.href = photo.imageDataUrl;
  link.download = `${slugForFile(plant.nickname)}-${photo.id || "photo"}.jpg`;
  document.body.append(link);
  link.click();
  link.remove();
}

function deletePlantPhoto(photo) {
  const plant = plants.find((item) => item.id === activePhotoLibraryPlantId);
  if (!plant || !photo?.id) {
    return;
  }

  const shouldDelete = window.confirm("Delete this saved crop photo?");
  if (!shouldDelete) {
    return;
  }

  if (photo.source === "trainingSample" && plant.trainingSample?.id === photo.id) {
    plant.trainingSample = null;
  }

  if (photo.source === "trainingPhoto") {
    plant.trainingPhotos = (plant.trainingPhotos || []).filter((item) => item.id !== photo.id);
  }

  if (photo.source === "observation") {
    const log = (plant.careLogs || []).find((item) => item.id === photo.logId);
    if (log?.observation?.id === photo.id) {
      log.observation = null;
    }
  }

  savePlants();
  renderPlants();
  openPhotoLibrary(plants.find((item) => item.id === plant.id) || plant);
}

function slugForFile(value) {
  return String(value || "plant")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "plant";
}

function confidenceLabel(confidence) {
  return Number.isFinite(confidence)
    ? `${Math.round(confidence * 100)}% confidence`
    : "Plant-box crop";
}

function formatPhotoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date unknown";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function dateValue(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
    button.addEventListener("click", () => {
      if (isIdOnlyResult) {
        selectIdOnlyCandidate(index);
      } else {
        selectCandidate(index);
      }
    });
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
  const storedPlants = repository.loadPlants();
  const sanitizedPlants = storedPlants.map(sanitizePlantRecord);
  if (JSON.stringify(storedPlants) !== JSON.stringify(sanitizedPlants)) {
    repository.savePlants(sanitizedPlants);
  }
  return sanitizedPlants;
}

function savePlants() {
  plants = plants.map(sanitizePlantRecord);
  repository.savePlants(plants);
}

function loadIdOnlyGallery() {
  return repository.loadIdOnlyGallery().map(sanitizeIdOnlyGalleryPhoto);
}

function saveIdOnlyGallery() {
  idOnlyGallery = idOnlyGallery.map(sanitizeIdOnlyGalleryPhoto);
  repository.saveIdOnlyGallery(idOnlyGallery);
}

function sanitizeIdOnlyGalleryPhoto(photo) {
  return {
    id: photo.id || makeId("id-only"),
    imageDataUrl: photo.imageDataUrl || null,
    capturedAt: photo.capturedAt || photo.savedAt || new Date().toISOString(),
    savedAt: photo.savedAt || photo.capturedAt || new Date().toISOString(),
    cropBox: photo.cropBox || focusBox,
    fullFrameStored: false,
    species: photo.species || "Unknown plant",
    scientificName: photo.scientificName || null,
    providerName: photo.providerName || null,
    providerPlantID: photo.providerPlantID || null,
    confidence: Number.isFinite(photo.confidence) ? photo.confidence : null,
    quality: photo.quality || null,
    seenLocation: {
      zip: /^\d{5}$/.test(photo.seenLocation?.zip || "") ? photo.seenLocation.zip : "",
      placeNote: photo.seenLocation?.placeNote || "",
      coordinates: photo.seenLocation?.coordinates
        ? {
          latitude: roundCoordinate(photo.seenLocation.coordinates.latitude),
          longitude: roundCoordinate(photo.seenLocation.coordinates.longitude),
          accuracyMeters: Math.round(photo.seenLocation.coordinates.accuracyMeters || 0),
          capturedAt: photo.seenLocation.coordinates.capturedAt || photo.capturedAt || null
        }
        : null
    }
  };
}

function sanitizePlantRecord(plant) {
  if (!plant || typeof plant !== "object") {
    return plant;
  }

  const trainingSample = plant.trainingSample
    ? {
      id: plant.trainingSample.id || makeId("photo"),
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
      id: photo.id || makeId("photo"),
      cropImageDataUrl: photo.cropImageDataUrl || null,
      capturedAt: photo.capturedAt || plant.dateAdded || null,
      cropBox: photo.cropBox || plant.identification?.observationBox || null,
      fullFrameStored: false,
      reason: photo.reason || null,
      shotType: photo.shotType || null
    })),
    careLogs: (plant.careLogs || []).map((log) => ({
      ...log,
      id: log.id || makeId("log"),
      observation: log.observation
        ? {
          ...log.observation,
          id: log.observation.id || makeId("photo"),
          fullFrameStored: false
        }
        : log.observation
    })),
    photoUse: {
      ...(plant.photoUse || {}),
      personalRecognition: Boolean(
        plant.photoUse?.personalRecognition ||
        trainingSample?.consentForPersonalRecognition
      ),
      fullFrameStored: false
    }
  };
}
