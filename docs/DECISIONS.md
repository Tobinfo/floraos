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

## 2026-05-20: Probe Direction

Decision: Favor no-subscription water probe options first: Wi-Fi gateway probes, Bluetooth plant sensors, and later a simple custom endpoint for ESP32-style DIY probes.

Reason: The user wants water-need inputs without committing to subscription hardware or cloud-only vendors.
