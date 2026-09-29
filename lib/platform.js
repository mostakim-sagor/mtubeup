/**
 * M-TUBE — Platform Detection
 * Identifies which supported platform a URL likely belongs to. This is
 * used for display and for provider selection — it does not itself
 * fetch or extract anything.
 */
const PLATFORM_HOST_MAP = [
  { match: ["youtube.com", "youtu.be"], name: "YouTube", icon: "youtube" },
  { match: ["tiktok.com"], name: "TikTok", icon: "tiktok" },
  { match: ["instagram.com"], name: "Instagram", icon: "instagram" },
  { match: ["facebook.com", "fb.watch"], name: "Facebook", icon: "facebook" },
  { match: ["twitter.com", "x.com"], name: "X / Twitter", icon: "x" },
  { match: ["drive.google.com"], name: "Google Drive", icon: "drive" },
  { match: ["pinterest.com", "pin.it"], name: "Pinterest", icon: "pinterest" },
  { match: ["likee.video"], name: "Likee", icon: "likee" },
  { match: ["threads.net"], name: "Threads", icon: "threads" },
  { match: ["spotify.com"], name: "Spotify", icon: "spotify" },
  { match: ["soundcloud.com"], name: "SoundCloud", icon: "soundcloud" },
  { match: ["terabox.com", "1024terabox.com"], name: "TeraBox", icon: "terabox" },
  { match: ["capcut.com"], name: "CapCut", icon: "capcut" }
];

/**
 * @param {string} rawUrl
 * @returns {{ name: string, icon: string } | null}
 */
export function detectPlatform(rawUrl) {
  let host;
  try {
    host = new URL(rawUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
  const hit = PLATFORM_HOST_MAP.find((p) =>
    p.match.some((needle) => host === needle || host.endsWith(`.${needle}`))
  );
  return hit ? { name: hit.name, icon: hit.icon } : null;
}

export function isSupportedPlatform(rawUrl) {
  return detectPlatform(rawUrl) !== null;
}
