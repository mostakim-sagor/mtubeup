/**
 * M-TUBE — Rate Limiting
 *
 * A lightweight in-memory limiter, keyed by client IP. It protects a
 * single warm serverless instance from rapid abuse without needing a
 * database. Because Vercel functions are stateless across cold starts and
 * can run as multiple concurrent instances, this is a best-effort layer,
 * not a hard global guarantee.
 *
 * For strict, cross-instance rate limiting in production, put a managed
 * store behind this same interface (e.g. Upstash Redis via
 * @upstash/ratelimit) — the call site below does not need to change.
 */

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 20);

const hits = new Map(); // ip -> { count, resetAt }

function sweep(now) {
  for (const [ip, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(ip);
  }
}

/**
 * @param {string} ip
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  if (hits.size > 5000) sweep(now); // avoid unbounded growth

  const key = ip || "unknown";
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
}

/** Extracts a best-effort client IP from a Next.js Request. */
export function getClientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
