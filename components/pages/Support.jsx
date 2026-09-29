"use client";

import { APP_CONFIG } from "@/lib/config";
import PlatformIcon from "@/components/PlatformIcon";

const CHANNELS = [
  { key: "facebook", name: "Facebook", desc: "Follow or contact us on Facebook.", cta: "Open Facebook", icon: "facebook" },
  { key: "telegram", name: "Telegram", desc: "Get support through Telegram.", cta: "Open Telegram", icon: "telegram" },
  { key: "discord", name: "Discord", desc: "Join our Discord community.", cta: "Join Discord", icon: "discord" },
  { key: "youtube", name: "YouTube", desc: "Watch tutorials and updates.", cta: "Visit YouTube", icon: "youtube" }
];

export default function Support() {
  function open(key) {
    const url = APP_CONFIG.support[key];
    if (url) window.open(url, "_blank", "noopener");
  }

  return (
    <div className="container">
      <div className="section-head" style={{ textAlign: "center", maxWidth: 420, margin: "0 auto 26px" }}>
        <h2>Need Help?</h2>
        <p className="muted">Contact {APP_CONFIG.poweredBy} through your preferred platform.</p>
      </div>
      <div className="support-grid">
        {CHANNELS.map((c) => (
          <div className="card support-card" key={c.key}>
            <PlatformIcon name={c.icon} />
            <h3>{c.name}</h3>
            <p className="muted">{c.desc}</p>
            <button className="btn btn-secondary btn-block" onClick={() => open(c.key)}>{c.cta}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
