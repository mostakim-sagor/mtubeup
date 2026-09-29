/**
 * M-TUBE — Central Configuration
 * Non-secret, shared values. Secrets belong in environment variables
 * (see .env.example), never here.
 */
export const APP_CONFIG = {
  appName: "M-TUBE",
  poweredBy: "MOSTAKIM LAB'S",
  version: "1.0.0",
  logoSrc: "/m.tube.lite.png",

  seo: {
    title: "M-TUBE — Online Media Downloader",
    description:
      "M-TUBE is a modern media download platform powered by MOSTAKIM LAB'S."
  },

  support: {
    facebook: process.env.NEXT_PUBLIC_SUPPORT_FACEBOOK || "",
    telegram: process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM || "",
    discord: process.env.NEXT_PUBLIC_SUPPORT_DISCORD || "",
    youtube: process.env.NEXT_PUBLIC_SUPPORT_YOUTUBE || ""
  },

  legal: {
    lastUpdated: "September 2026"
  },

  platforms: [
    { name: "YouTube", icon: "youtube" },
    { name: "TikTok", icon: "tiktok" },
    { name: "Instagram", icon: "instagram" },
    { name: "Facebook", icon: "facebook" },
    { name: "X / Twitter", icon: "x" },
    { name: "Google Drive", icon: "drive" },
    { name: "Pinterest", icon: "pinterest" },
    { name: "Likee", icon: "likee" },
    { name: "Threads", icon: "threads" },
    { name: "Spotify", icon: "spotify" },
    { name: "SoundCloud", icon: "soundcloud" },
    { name: "TeraBox", icon: "terabox" },
    { name: "CapCut", icon: "capcut" }
  ],

  defaultSettings: {
    defaultQuality: "720p",
    defaultFormat: "mp4",
    saveHistory: true
  },

  // Recognized query-parameter pages, in nav order. `key` is the query
  // string flag (e.g. ?download), `label` is the nav text.
  pages: [
    { key: "download", label: "Download" },
    { key: "downloads", label: "Downloads" },
    { key: "finished", label: "Finished" },
    { key: "api", label: "API" },
    { key: "settings", label: "Settings" },
    { key: "support", label: "Support" },
    { key: "terms", label: "Terms" },
    { key: "privacy", label: "Privacy" }
  ]
};

/** Builds a query-parameter page URL, e.g. pageHref("download") -> "/?download" */
export function pageHref(key) {
  if (!key || key === "home") return "/~";
  return `/?${key}`;
}
