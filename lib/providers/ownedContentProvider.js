/**
 * M-TUBE — Owned-Content Provider
 *
 * A narrow, safe path for direct media file URLs the operator explicitly
 * trusts — e.g. the operator's own CDN or storage bucket, hosting content
 * they own or are authorized to distribute. This provider never scrapes
 * or extracts from third-party platforms; it only reads metadata from,
 * and passes through, files already sitting at an allow-listed host.
 *
 * Configure OWNED_CONTENT_ALLOWED_HOSTS (comma-separated hostnames) to
 * enable it. Empty by default — disabled.
 */
import { ProviderUnavailableError } from "./provider";
import { fetchWithTimeout } from "../security";

function allowedHosts() {
  return (process.env.OWNED_CONTENT_ALLOWED_HOSTS || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

function hostAllowed(url) {
  const hosts = allowedHosts();
  if (hosts.length === 0) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hosts.includes(hostname);
  } catch {
    return false;
  }
}

const MEDIA_EXTENSIONS = /\.(mp4|m4a|mp3|aac|webm|mov)$/i;

export const ownedContentProvider = {
  id: "owned-content",

  supports(url) {
    return hostAllowed(url) && MEDIA_EXTENSIONS.test(new URL(url).pathname);
  },

  async getInfo(url) {
    if (!this.supports(url)) throw new ProviderUnavailableError();

    const res = await fetchWithTimeout(url, { method: "HEAD" }, 8000);
    if (!res.ok) throw new ProviderUnavailableError("That file could not be reached.");

    const contentType = res.headers.get("content-type") || "";
    const contentLength = res.headers.get("content-length");
    const isAudio = contentType.startsWith("audio/") || /\.(mp3|m4a|aac)$/i.test(url);

    return {
      title: decodeURIComponent(url.split("/").pop() || "File"),
      thumbnail: null,
      uploader: null,
      durationSeconds: null,
      platform: "Owned Content",
      formats: [
        {
          type: isAudio ? "audio" : "video",
          quality: "original",
          sizeLabel: contentLength ? `${(Number(contentLength) / (1024 * 1024)).toFixed(1)} MB` : null,
          container: url.split(".").pop()
        }
      ]
    };
  },

  async download(url) {
    if (!this.supports(url)) throw new ProviderUnavailableError();
    // The file already lives at a trusted, allow-listed host — the
    // "download" is simply that verified URL, no extraction involved.
    return { downloadUrl: url, format: url.split(".").pop(), quality: "original", sizeLabel: null };
  }
};
