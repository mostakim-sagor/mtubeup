/**
 * M-TUBE — Real downloader and metadata adapter
 *
 * @media-downloaders/v2 is the only download engine. It writes a verified
 * temporary file in the process working directory, so this adapter streams
 * that file directly to the browser and removes it when the response closes.
 * No application-created download directory or server-side job store exists.
 */
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import MediaDownloader from "@media-downloaders/v2";
import { ttdl } from "btch-downloader";
import { SafeError } from "./security";
import { detectPlatform } from "./platform";

const WORKING_DIRECTORY = process.cwd();
const TEMP_FILE_PATTERN = /^temp_video(?:_\d+)?\.[a-z0-9]+$/i;
const METADATA_TIMEOUT_MS = 15000;

let downloadQueue = Promise.resolve();

function acquireDownloadLock() {
  let releaseTurn;
  const turn = new Promise((resolve) => {
    releaseTurn = resolve;
  });
  const previous = downloadQueue;
  downloadQueue = downloadQueue.then(() => turn, () => turn);
  return previous.then(() => releaseTurn);
}

function contentTypeFor(extension) {
  const types = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".m4a": "audio/mp4",
    ".mp3": "audio/mpeg",
    ".aac": "audio/aac"
  };
  return types[extension.toLowerCase()] || "application/octet-stream";
}

function safeTempFilePath(fileName) {
  if (typeof fileName !== "string" || !fileName) {
    throw new SafeError("DOWNLOAD_FAILED", "The downloader did not return a file.");
  }

  const basename = path.basename(fileName);
  if (!TEMP_FILE_PATTERN.test(basename)) {
    throw new SafeError("DOWNLOAD_FAILED", "The downloader returned an invalid file.");
  }

  const candidate = path.resolve(WORKING_DIRECTORY, basename);
  const root = `${path.resolve(WORKING_DIRECTORY)}${path.sep}`;
  if (!candidate.startsWith(root)) {
    throw new SafeError("DOWNLOAD_FAILED", "The downloader returned an invalid file.");
  }
  return candidate;
}

async function removePackageTempFiles() {
  const entries = await fsp.readdir(WORKING_DIRECTORY, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && TEMP_FILE_PATTERN.test(entry.name))
      .map((entry) => fsp.rm(path.join(WORKING_DIRECTORY, entry.name), { force: true }))
  );
}

async function removeFile(filePath) {
  if (!filePath) return;
  await fsp.rm(filePath, { force: true }).catch(() => undefined);
}

function onceAsync(task) {
  let promise;
  return () => {
    if (!promise) promise = Promise.resolve().then(task);
    return promise;
  };
}

async function fetchJson(url, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), METADATA_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "M-TUBE/1.0",
        ...headers
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Metadata endpoint returned HTTP ${response.status}.`);
    }

    return await response.json();
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new SafeError("METADATA_TIMEOUT", "The metadata request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function oEmbedUrl(provider, url) {
  if (provider === "YouTube") {
    return `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  }
  if (provider === "SoundCloud") {
    return `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  }
  return null;
}

function normalizeMetadata(data, platform) {
  const title = typeof data?.title === "string" ? data.title.trim() : "";
  const thumbnail = typeof data?.thumbnail_url === "string" ? data.thumbnail_url.trim() : "";
  const uploader = typeof data?.author_name === "string" ? data.author_name.trim() : "";

  if (!title || !thumbnail) {
    throw new SafeError(
      "METADATA_UNAVAILABLE",
      `The real title or thumbnail is unavailable for this ${platform} link.`
    );
  }

  return {
    title,
    thumbnail,
    uploader: uploader || null,
    platform
  };
}

async function resolveMetadata(url, platform) {
  const endpoint = oEmbedUrl(platform.name, url);
  if (endpoint) {
    return normalizeMetadata(await fetchJson(endpoint), platform.name);
  }

  if (platform.name === "TikTok") {
    try {
      const data = await ttdl(url);
      return normalizeMetadata(
        {
          title: data?.title,
          thumbnail_url: data?.thumbnail
        },
        platform.name
      );
    } catch {
      throw new SafeError(
        "METADATA_UNAVAILABLE",
        "The real TikTok title or thumbnail could not be fetched. Please try again."
      );
    }
  }

  throw new SafeError(
    "METADATA_UNAVAILABLE",
    `Real metadata is not available for ${platform.name} links yet.`
  );
}

/**
 * Fetches real metadata from a platform metadata endpoint. The downloader
 * package itself exposes download support, not a metadata API.
 */
export async function getMediaInfo(url) {
  const platform = detectPlatform(url);
  const isSupported = typeof MediaDownloader.isVideoLink === "function"
    && MediaDownloader.isVideoLink(url);

  if (!isSupported || !platform) {
    throw new SafeError(
      "UNSUPPORTED_URL",
      "This link is not supported by the configured downloader."
    );
  }

  const metadata = await resolveMetadata(url, platform);

  return {
    provider: "@media-downloaders/v2",
    platform: metadata.platform,
    title: metadata.title,
    thumbnail: metadata.thumbnail,
    uploader: metadata.uploader,
    duration: null,
    // The package writes one original MP4 output and does not expose a
    // selectable quality list. Do not advertise formats it cannot produce.
    formats: [{ type: "video", quality: "original", container: "mp4", sizeLabel: null }],
    isMock: false
  };
}

/**
 * Runs the real package downloader and returns the generated file. The queue
 * lock remains held until cleanup is called so another package invocation
 * cannot delete the file while it is streaming to a browser.
 */
export async function downloadMedia(url) {
  const release = await acquireDownloadLock();
  let packageFilePath;
  let sourcePath;

  try {
    await removePackageTempFiles();

    packageFilePath = await MediaDownloader(url, {
      autocrop: false,
      limitSizeMB: null,
      rotation: null,
      YTBcookie: process.env.MTUBE_YOUTUBE_COOKIE || undefined,
      YTBmaxduration: Number.parseInt(process.env.MTUBE_YOUTUBE_MAX_DURATION || "1800", 10)
    });

    sourcePath = safeTempFilePath(packageFilePath);
    const stats = await fsp.stat(sourcePath);
    if (!stats.isFile() || stats.size <= 0) {
      throw new SafeError("DOWNLOAD_FAILED", "The downloader returned an empty file.");
    }

    const extension = path.extname(sourcePath).toLowerCase() || ".mp4";
    const cleanup = onceAsync(async () => {
      await removeFile(sourcePath);
      await removePackageTempFiles().catch(() => undefined);
      release();
    });

    return {
      path: sourcePath,
      filename: `m-tube-download${extension}`,
      contentType: contentTypeFor(extension),
      size: stats.size,
      cleanup
    };
  } catch (error) {
    if (packageFilePath) {
      await removeFile(path.resolve(WORKING_DIRECTORY, path.basename(String(packageFilePath))));
    }
    if (sourcePath) await removeFile(sourcePath);
    await removePackageTempFiles().catch(() => undefined);
    release();
    throw error;
  }
}

export function createDownloadStream(download) {
  if (!download || !download.path || !fs.existsSync(download.path)) {
    return null;
  }

  const stream = fs.createReadStream(download.path);
  const cleanup = () => {
    void download.cleanup();
  };
  stream.once("close", cleanup);
  stream.once("error", cleanup);
  return stream;
}