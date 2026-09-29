/**
 * M-TUBE — API Security Helpers
 * SSRF protection, protocol allow-listing, and safe-error utilities used
 * by every API route before any URL is ever handed to a provider.
 */

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

// Hostnames that are never acceptable as a target, regardless of what a
// provider might otherwise do with them.
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254" // cloud metadata service (AWS/GCP/Azure/Vercel)
]);

/** Returns true if the IP literal falls in a private/reserved range. */
function isPrivateIPv4(ip) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a, b] = parts;
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 127) return true; // loopback
  if (a === 169 && b === 254) return true; // link-local / metadata
  if (a === 0) return true; // "this network"
  return false;
}

function isLikelyIPv6Private(host) {
  const h = host.toLowerCase();
  return h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80");
}

/**
 * Validates that a user-supplied URL is safe to hand to a provider.
 * Throws a SafeError with a user-friendly message on failure.
 * @param {string} rawUrl
 * @returns {URL}
 */
export function assertSafeUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new SafeError("INVALID_URL", "That doesn't look like a valid URL.");
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new SafeError("INVALID_PROTOCOL", "Only http:// and https:// links are supported.");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new SafeError("BLOCKED_HOST", "This address is not allowed.");
  }

  if (isPrivateIPv4(hostname) || isLikelyIPv6Private(hostname)) {
    throw new SafeError("BLOCKED_HOST", "This address is not allowed.");
  }

  // Block obvious internal / non-routable-looking TLD-less hostnames
  // (e.g. "http://internal-service") — real public domains have a dot.
  if (!hostname.includes(".") && hostname !== "localhost") {
    throw new SafeError("BLOCKED_HOST", "This address is not allowed.");
  }

  if (parsed.username || parsed.password) {
    throw new SafeError("INVALID_URL", "URLs with embedded credentials are not allowed.");
  }

  return parsed;
}

/** A safe, user-facing error. Never leaks stack traces or internals. */
export class SafeError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/** Wraps any route handler so unexpected errors never leak internals. */
export function toSafeErrorResponse(err) {
  if (err instanceof SafeError) {
    return { success: false, error: err.message, code: err.code, status: err.status };
  }
  // Unknown/internal error — log server-side only, return a generic message.
  console.error("[M-TUBE] Unhandled API error:", err);
  return {
    success: false,
    error: "Something went wrong. Please try again shortly.",
    code: "SERVER_ERROR",
    status: 500
  };
}

/** Simple fetch wrapper with a hard timeout, used only by providers that
 * call an already-validated, allow-listed external endpoint (never raw
 * user URLs directly). */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
