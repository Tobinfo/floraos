# Decisions

This file records project choices so we do not keep reopening the same questions.

## 2026-05-19: Project Folder

Decision: `C:\dev\plant watering` is the source of truth for this project.

Reason: User explicitly selected this path and asked to ignore OneDrive.

## 2026-05-19: Demo Services First

Decision: Keep demo plant identification and demo weather while the product workflow is still being shaped.

Reason: The current architecture already separates identification and weather behind services, so real providers can be swapped in later without blocking workflow design.

## 2026-05-19: Browser Prototype Stays Useful

Decision: Keep the browser prototype as the fastest place to test the garden-walk workflow.

Reason: It can run on the laptop and exercise scan/review/save/care behavior faster than the full iOS build loop.

## 2026-05-19: Laptop First For Now

Decision: Treat the laptop/browser prototype as the primary build target until the workflow is proven.

Reason: The laptop prototype is faster to iterate, easier to verify on this Windows machine, and can answer the product questions before the workflow is ported to iOS.

## 2026-05-19: Local Plant ID Boundary

Decision: Browser scan flows call `/api/identify`; provider-specific identification code lives in the local server layer.

Reason: Real plant ID providers may require API keys and response normalization. Keeping that behind a local endpoint protects secrets and lets the UI work with one stable candidate shape.

## 2026-05-19: Scan Versus Add Plant

Decision: The long-term goal is for Scan mode to keep the camera live for walking around a garden, while Add Plant is the freeze-frame moment for reviewing, correcting, and saving.

Reason: Walking identification and plant record creation are different jobs. Freezing every scan makes garden walk mode feel broken.

## 2026-05-20: Hosted App Target

Decision: Use the Render-hosted app at `https://floraos.onrender.com` as the normal user-facing URL while continuing to use the local prototype for fast development.

Reason: The user does not want terminal-driven local startup as the normal experience. Hosting also makes it easier to connect real provider secrets through environment variables.

## 2026-05-20: Real ID Must Be Visible

Decision: The primary Scan path should use Pl@ntNet when configured, and demo IDs should stay clearly separated as demo/test behavior.

Reason: Fake IDs in the main scan flow destroy trust. The UI and server status should make the active provider obvious.

## 2026-05-20: Freeze After ID For Current Prototype

Decision: In the current hosted prototype, Scan should stop the feed immediately after an ID result.

Reason: The review/save flow is still being shaped, and freezing the captured frame makes it easier to confirm or reject the ID before logging a plant. Continuous walking scan can return after the confidence and correction workflow is stronger.

## 2026-05-20: Low-Confidence ID Retry Flow

Decision: When confidence is low, the app should ask the user to retry and capture three more photos locally before making another paid/limited provider call. The app should choose the strongest photo by image-quality heuristics, send only that image to the real plant ID provider, and save the rest only after the user confirms the plant and consents to repository use.

Reason: Extra camera frames are cheap, but API calls and bad IDs are not. Multiple angles improve identification while preserving credits. Confirmed multi-photo sets become valuable training data for the app's own repository.

Long-term order: check our own repository/model first, then ask for retry photos, then make real provider calls only when needed, then fall back to manual entry and correction.

## 2026-05-20: Photo Before Advice

Decision: The app should not give plant-specific ID or care guidance without a current observation photo attached to that plant event.

Reason: Photo-first records make the system auditable, improve future training data, and avoid unsupported recommendations. Quick/manual entry can still be fast, but it should attach a photo before turning into guidance.

## 2026-05-20: Training Photos After Confirmation

Decision: After any confirmed plant, including manual entry and high-confidence IDs, ask whether the user wants to help the app recognize the plant in the future. If yes, collect multiple guided photos and save them as a labeled training set after consent.

Reason: Manual entries are often the highest-quality labels because many users already know common plants. The app should not waste that moment; it should turn confirmed knowledge into future recognition data.

## 2026-05-20: First-Use Personal Photo Consent

Decision: On first use, ask `Can your photos be used to help make floraos better for you?`

Reason: The value should be framed honestly: the user is helping their own app recognize their plants better. The prompt should happen before durable photo storage, and training use should remain opt-in.

## 2026-05-20: Store Plant Box Crops By Default

Decision: Strip photos to the plant focus box from the beginning. Store the plant-box crop for recognition and training flows by default, not the full camera frame. Full frames may be used temporarily for review but should not become durable storage unless the user explicitly approves that behavior.

Reason: Cropping reduces faces, rooms, homes, addresses, and unrelated background data. It is the simplest privacy-preserving default while still keeping the plant evidence the app needs.

## 2026-05-20: Post-Save Training Photos

Decision: After a user saves a confirmed plant and has opted into photo use, ask `Help gardenin recognize Plant Nickname in the future?` If accepted, capture two more plant-box crop photos with `Take 1` and `Take 2` prompts.

Reason: The best training data comes after confirmation. Asking for two additional crop-only photos builds a stronger labeled set without requiring extra provider calls.

## 2026-05-20: Saved-Plant Recognition Feedback

Decision: When a scan matches a species already saved in the user's garden with usable confidence, flash the camera view and ask `Plant nickname?` instead of freezing into the first-time add flow.

Reason: Previously identified plants should feel like recognition, not re-entry. Confirming the prompt logs an observation crop for that saved plant while keeping walking mode fluid.

## 2026-05-20: Walking Mode Observation Flash

Decision: In walking mode, flash-only capture is only for plants already in the user's saved/previously identified group. First-time or uncertain IDs should freeze the captured frame for confirmation before saving or giving plant-specific guidance.

Reason: The user needs feedback that a photo was captured, but first-time IDs need deliberate confirmation. Known plants can be logged more fluidly because the app is matching against the user's existing garden.

## 2026-05-20: Probe Direction

Decision: Favor no-subscription water probe options first: Wi-Fi gateway probes, Bluetooth plant sensors, and later a simple custom endpoint for ESP32-style DIY probes.

Reason: The user wants water-need inputs without committing to subscription hardware or cloud-only vendors.
