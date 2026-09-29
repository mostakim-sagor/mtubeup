/**
 * M-TUBE — Client Storage Layer
 * All history/settings live in the browser only. Nothing here is ever
 * sent to a server. Safe to call from client components only.
 */
import { APP_CONFIG } from "./config";

const KEYS = {
  SETTINGS: "m-tube-settings",
  ACTIVE_DOWNLOADS: "m-tube-downloads",
  FINISHED: "m-tube-finished",
  RECENT_URLS: "m-tube-recent-urls"
};

function isBrowser() {
  return typeof window !== "undefined";
}

function read(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn("M-TUBE storage read failed:", key, e);
    return fallback;
  }
}

function write(key, value) {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn("M-TUBE storage write failed:", key, e);
    return false;
  }
}

export const MStorage = {
  getSettings: () => read(KEYS.SETTINGS, { ...APP_CONFIG.defaultSettings }),
  saveSettings: (settings) => write(KEYS.SETTINGS, settings),

  getActiveDownloads: () => read(KEYS.ACTIVE_DOWNLOADS, []),
  saveActiveDownloads: (list) => write(KEYS.ACTIVE_DOWNLOADS, list),

  getFinished: () => read(KEYS.FINISHED, []),
  saveFinished: (list) => write(KEYS.FINISHED, list),
  addFinished: (item) => {
    const list = read(KEYS.FINISHED, []);
    list.unshift(item);
    return write(KEYS.FINISHED, list);
  },
  removeFinished: (id) => {
    const list = read(KEYS.FINISHED, []).filter((i) => i.id !== id);
    return write(KEYS.FINISHED, list);
  },

  getRecentUrls: () => read(KEYS.RECENT_URLS, []),
  addRecentUrl: (url) => {
    const list = read(KEYS.RECENT_URLS, []).filter((u) => u !== url);
    list.unshift(url);
    return write(KEYS.RECENT_URLS, list.slice(0, 10));
  },

  clearHistory: () => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(KEYS.FINISHED);
    window.localStorage.removeItem(KEYS.RECENT_URLS);
  },
  clearAll: () => {
    if (!isBrowser()) return;
    Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  }
};
