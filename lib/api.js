/**
 * M-TUBE — Client API Helper
 * The API base URL is derived from the current origin at call time —
 * never hard-coded to a specific domain.
 */

export function apiBaseUrl() {
  if (typeof window === "undefined") return "/api";
  return `${window.location.origin}/api`;
}

export function currentDomain() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

async function postJson(path, body) {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    const err = new Error(data.error || "Request failed.");
    err.code = data.code || "UNKNOWN_ERROR";
    err.status = res.status;
    throw err;
  }
  return data;
}

async function requestFile(path, body) {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || contentType.includes("application/json")) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.error || "Download failed.");
    err.code = data.code || "DOWNLOAD_FAILED";
    err.status = res.status;
    throw err;
  }

  const blob = await res.blob();
  if (!blob.size) {
    throw new Error("The downloader returned an empty file.");
  }

  const contentDisposition = res.headers.get("content-disposition") || "";
  const filenameMatch = contentDisposition.match(/filename="([^"]+)"/i);
  return {
    success: true,
    blob,
    filename: filenameMatch?.[1] || "m-tube-download.mp4",
    format: "mp4",
    quality: "original",
    size: blob.size
  };
}

export const MTubeAPI = {
  getInfo: (url) => postJson("/info", { url }),
  requestDownload: (url, format, quality) => requestFile("/download", { url, format, quality })
};
