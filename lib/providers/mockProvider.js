/**
 * M-TUBE — Mock Provider (development preview only)
 *
 * Returns clearly-labeled placeholder data so the UI can be exercised
 * before a real provider is connected. This must NEVER be active in
 * production — it is gated behind MTUBE_DEMO_MODE=true, and every
 * response it returns is marked isMock: true so the UI can show a
 * banner instead of pretending it's a real result.
 */
import { ProviderUnavailableError } from "./provider";

function demoModeEnabled() {
  return process.env.MTUBE_DEMO_MODE === "true" && process.env.NODE_ENV !== "production";
}

export const mockProvider = {
  id: "mock-demo",

  supports() {
    return demoModeEnabled();
  },

  async getInfo(url) {
    if (!demoModeEnabled()) throw new ProviderUnavailableError();
    return {
      title: "Demo Video (mock data — MTUBE_DEMO_MODE)",
      thumbnail: null,
      uploader: "Demo Uploader",
      durationSeconds: 125,
      platform: "Demo",
      formats: [
        { type: "video", quality: "720p", sizeLabel: "8.4 MB", container: "mp4" },
        { type: "audio", quality: "mp3", sizeLabel: "3.1 MB", container: "mp3" }
      ],
      isMock: true
    };
  },

  async download(url, { format, quality }) {
    if (!demoModeEnabled()) throw new ProviderUnavailableError();
    return {
      downloadUrl: null,
      format,
      quality,
      sizeLabel: null,
      isMock: true,
      note: "Demo mode: no file is actually produced. Connect a real provider to enable downloads."
    };
  }
};
