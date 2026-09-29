"use client";

import { useState } from "react";
import { APP_CONFIG } from "@/lib/config";

/**
 * Renders the provided m.tube.lite.png logo. If that asset hasn't been
 * added to /public yet, falls back to an inline SVG play-mark so the UI
 * never shows a broken image.
 */
export default function Logo({ size = 38 }) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className="brand-logo"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.29) }}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={APP_CONFIG.logoSrc}
          alt={APP_CONFIG.appName}
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "inherit" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true" style={{ width: size * 0.53, height: size * 0.53 }}>
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </span>
  );
}
