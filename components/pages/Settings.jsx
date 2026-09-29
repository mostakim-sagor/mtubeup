"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MStorage } from "@/lib/storage";
import { apiBaseUrl } from "@/lib/api";
import { APP_CONFIG, pageHref } from "@/lib/config";

export default function Settings() {
  const [settings, setSettings] = useState(APP_CONFIG.defaultSettings);
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiUrlDisplay, setApiUrlDisplay] = useState("/api");

  useEffect(() => {
    setSettings(MStorage.getSettings());
    setApiUrlDisplay(apiBaseUrl());
  }, []);

  function update(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);
    MStorage.saveSettings(next);
  }

  async function copyApiUrl() {
    try {
      await navigator.clipboard.writeText(apiBaseUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="container">
      <div className="settings-layout">
        <div className="card card-pad" style={{ textAlign: "center" }}>
          <span className="brand-logo" style={{ margin: "0 auto 12px", width: 52, height: 52, borderRadius: 15 }}>
            <svg viewBox="0 0 24 24" fill="#fff" style={{ width: 26, height: 26 }}><path d="M8 5v14l11-7z" /></svg>
          </span>
          <div className="brand-name" style={{ fontSize: 19 }}>{APP_CONFIG.appName}</div>
          <div className="muted" style={{ marginTop: 2 }}>POWER BY : {APP_CONFIG.poweredBy}</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>App version {APP_CONFIG.version}</div>
        </div>

        <div>
          <div className="settings-group">
            <div className="settings-group-title">Download Settings</div>
            <div className="card">
              <div className="settings-row">
                <div className="settings-row-left">
                  <div className="settings-row-text"><div className="label">Default quality</div></div>
                </div>
                <select className="select-field" style={{ width: 130 }} value={settings.defaultQuality} onChange={(e) => update({ defaultQuality: e.target.value })}>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                  <option value="360p">360p</option>
                </select>
              </div>
              <div className="settings-row">
                <div className="settings-row-left">
                  <div className="settings-row-text"><div className="label">Default format</div></div>
                </div>
                <select className="select-field" style={{ width: 130 }} value={settings.defaultFormat} onChange={(e) => update({ defaultFormat: e.target.value })}>
                  <option value="mp4">MP4 (Video)</option>
                  <option value="mp3">MP3 (Audio)</option>
                </select>
              </div>
              <div className="settings-row">
                <div className="settings-row-left">
                  <div className="settings-row-text"><div className="label">Save download history</div><div className="desc">Keep Finished list on this device</div></div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={settings.saveHistory} onChange={(e) => update({ saveHistory: e.target.checked })} />
                  <span className="switch-track" />
                </label>
              </div>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Storage</div>
            <div className="card">
              <button className="settings-row" style={{ width: "100%", border: "none", background: "none", textAlign: "left" }} onClick={() => setConfirmClearHistory(true)}>
                <div className="settings-row-left"><div className="settings-row-text"><div className="label">Clear download history</div><div className="desc">Removes finished downloads list</div></div></div>
                <span className="chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
              </button>
              <button className="settings-row" style={{ width: "100%", border: "none", background: "none", textAlign: "left" }} onClick={() => setConfirmClearAll(true)}>
                <div className="settings-row-left"><div className="settings-row-text"><div className="label">Clear local data</div><div className="desc">Resets settings and history on this device</div></div></div>
                <span className="chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></span>
              </button>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">API</div>
            <div className="card card-pad">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span className="status-pill"><span className="dot" />Public API</span>
                <span className="muted" style={{ fontSize: 12.5 }}>No API Key Required</span>
              </div>
              <div className="url-display">
                <code>{apiUrlDisplay}</code>
                <button className="icon-btn" onClick={copyApiUrl} aria-label="Copy API URL" style={{ borderColor: "rgba(255,255,255,0.2)", color: "#d7e6ff" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                </button>
              </div>
              {copied && <p className="muted" style={{ fontSize: 12 }}>Copied!</p>}
              <Link href={pageHref("api")} className="btn btn-secondary btn-block">API Documentation</Link>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">About</div>
            <div className="card">
              <Link href={pageHref("terms")} className="settings-row"><div className="settings-row-text"><div className="label">Terms &amp; Conditions</div></div></Link>
              <Link href={pageHref("privacy")} className="settings-row"><div className="settings-row-text"><div className="label">Privacy Policy</div></div></Link>
              <Link href={pageHref("support")} className="settings-row"><div className="settings-row-text"><div className="label">Support</div></div></Link>
            </div>
          </div>
        </div>
      </div>

      {confirmClearHistory && (
        <ConfirmModal
          title="Clear download history?"
          description="This removes your Finished downloads list from this device."
          confirmLabel="Clear History"
          onCancel={() => setConfirmClearHistory(false)}
          onConfirm={() => {
            MStorage.clearHistory();
            setConfirmClearHistory(false);
          }}
        />
      )}
      {confirmClearAll && (
        <ConfirmModal
          title="Clear all local data?"
          description="This resets your settings and history on this device. This can't be undone."
          confirmLabel="Clear Everything"
          onCancel={() => setConfirmClearAll(false)}
          onConfirm={() => {
            MStorage.clearAll();
            setSettings(APP_CONFIG.defaultSettings);
            setConfirmClearAll(false);
          }}
        />
      )}
    </div>
  );
}

function ConfirmModal({ title, description, confirmLabel, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop open" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box" role="dialog" aria-modal="true">
        <div className="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
