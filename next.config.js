/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep production builds lean; no source maps shipped to the client.
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: false
  },
  async headers() {
    return [
      {
        // Basic hardening headers for every route. This is normal production
        // protection — not an anti-DevTools trick. Frontend code delivered to
        // a browser can always be inspected; we don't pretend otherwise.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
