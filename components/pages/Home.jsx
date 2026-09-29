"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_CONFIG, pageHref } from "@/lib/config";
import { MStorage } from "@/lib/storage";
import PlatformIcon from "@/components/PlatformIcon";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [hint, setHint] = useState("Paste a link from YouTube, TikTok, Instagram and more.");
  const [hintError, setHintError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
      else setHint("Clipboard is empty");
    } catch {
      setHint("Clipboard access unavailable — paste manually");
    }
  }

  function handleClear() {
    setUrl("");
    setHint("Paste a link from YouTube, TikTok, Instagram and more.");
    setHintError(false);
  }

  function handleGenerate() {
    const trimmed = url.trim();
    if (!trimmed) {
      setHint("Paste a video URL to continue.");
      setHintError(true);
      return;
    }
    if (!/^https?:\/\/.+/i.test(trimmed)) {
      setHint("That doesn't look like a valid URL.");
      setHintError(true);
      return;
    }
    setLoading(true);
    MStorage.addRecentUrl(trimmed);
    router.push(`/?download&src=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="container" style={{ paddingTop: 8 }}>
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Free · No login · No API key</p>
            <h1 style={{ fontSize: 30 }}>Download Media From Anywhere</h1>
            <p className="lead muted">Fast, simple and reliable media downloading from supported platforms.</p>

            <div className="card card-pad" style={{ marginTop: 18 }}>
              <label className="field-label" htmlFor="videoUrl">Paste Video URL</label>
              <div className="input-row">
                <input
                  id="videoUrl"
                  type="url"
                  placeholder="Paste video URL here…"
                  autoComplete="off"
                  inputMode="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
                <div className="input-row-actions">
                  <button className="icon-btn" type="button" aria-label="Paste from clipboard" title="Paste" onClick={handlePaste}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>
                  </button>
                  <button className="icon-btn" type="button" aria-label="Clear input" title="Clear" onClick={handleClear}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
              <p className="field-hint" style={{ color: hintError ? "var(--danger)" : "var(--ink-500)" }}>{hint}</p>

              <button className={`btn btn-primary btn-block${loading ? " btn-loading" : ""}`} style={{ marginTop: 14 }} onClick={handleGenerate} disabled={loading}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                <span className="btn-label">Generate Download</span>
              </button>

              <div className="notice-line">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                <span>Only download content you have permission to download and use.</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <a href="#how-it-works" className="btn btn-ghost btn-sm">How It Works</a>
              <div style={{ display: "flex", gap: 14, fontSize: 12.5 }} className="muted">
                <Link href={pageHref("terms")}>Terms &amp; Conditions</Link>
                <Link href={pageHref("privacy")}>Privacy Policy</Link>
              </div>
              <Link href={pageHref("support")} className="btn btn-secondary btn-sm">Support</Link>
            </div>
          </div>

          <div className="hero-video-preview" aria-hidden="true">
            <div className="play-badge"><span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Supported Platforms</h2>
          <p className="muted">Paste a link from any of these platforms to get started.</p>
        </div>
        <div className="platform-grid">
          {APP_CONFIG.platforms.map((p) => (
            <div className="platform-item" key={p.name}>
              <PlatformIcon name={p.icon} />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="section-head">
          <h2>How It Works</h2>
          <p className="muted">Three steps from link to file.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-num">01</span>
            <div className="step-copy"><h3>Paste URL</h3><p>Drop in a link from any supported platform.</p></div>
          </div>
          <div className="step-card">
            <span className="step-num">02</span>
            <div className="step-copy"><h3>Choose Format &amp; Quality</h3><p>Pick video or audio, and the resolution you want.</p></div>
          </div>
          <div className="step-card">
            <span className="step-num">03</span>
            <div className="step-copy"><h3>Download</h3><p>Track progress and save the file to your device.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
