"use client";

import { useState, useEffect } from "react";
import { apiBaseUrl, currentDomain } from "@/lib/api";

const EXAMPLES = (url) => ({
  js: `const res = await fetch("${url}/download", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://example.com/video",
    format: "mp4",
    quality: "720p"
  })
});
const data = await res.json();
console.log(data);`,
  node: `const fetch = require("node-fetch");

async function downloadVideo() {
  const res = await fetch("${url}/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: "https://example.com/video",
      format: "mp4",
      quality: "720p"
    })
  });
  return res.json();
}

downloadVideo().then(console.log);`,
  python: `import requests

response = requests.post(
    "${url}/download",
    json={
        "url": "https://example.com/video",
        "format": "mp4",
        "quality": "720p"
    }
)

print(response.json())`,
  curl: `curl -X POST "${url}/download" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/video",
    "format": "mp4",
    "quality": "720p"
  }'`
});

export default function Api() {
  const [lang, setLang] = useState("js");
  const [url, setUrl] = useState("/api");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    setUrl(apiBaseUrl());
    setDomain(currentDomain());
  }, []);

  const examples = EXAMPLES(url);

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="container">
      <div className="section-head">
        <p className="eyebrow">Developer Portal</p>
        <h2 style={{ fontSize: 24 }}>M-TUBE API</h2>
        <p className="muted">Use the M-TUBE API directly from your application.</p>
      </div>

      <div className="card card-pad" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <span className="status-pill"><span className="dot" />Public API</span>
          <button className="btn btn-secondary btn-sm" onClick={() => copy(url)}>Copy Base URL</button>
        </div>
        <label className="field-label">Base URL</label>
        <div className="url-display" style={{ marginBottom: 16 }}><code>{url}</code></div>

        <div className="info-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 2-3 4" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <div>
            <h4>No API key required.</h4>
            <p>M-TUBE uses a public domain-based API. Your website domain automatically becomes the API base URL.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
          <div><label className="field-label">Current Domain</label><div className="url-display"><code>{domain}</code></div></div>
          <div><label className="field-label">API Base URL</label><div className="url-display"><code>{url}</code></div></div>
        </div>
      </div>

      <section className="doc-section">
        <h2>Overview</h2>
        <p>M-TUBE exposes two endpoints backed by <code>@media-downloaders/v2</code>. The API only reports formats the downloader can actually produce and never returns placeholder URLs or fake progress.</p>
      </section>

      <section className="doc-section">
        <h2>POST /api/info</h2>
        <div className="endpoint-line"><span className="method-badge">POST</span><span>{url}/info</span></div>
        <div className="code-block">
          <button className="copy-code-btn" onClick={() => copy(`{\n  "url": "https://example.com/video"\n}`)}>Copy</button>
          <pre>{`{\n  "url": "https://example.com/video"\n}`}</pre>
        </div>
        <h3>Response (supported URL)</h3>
        <div className="code-block">
          <pre>{`{
  "success": true,
  "provider": "@media-downloaders/v2",
  "platform": "YouTube",
  "title": "Example Video",
  "thumbnail": "https://...",
  "duration": 123,
  "formats": [
    { "type": "video", "quality": "original", "container": "mp4" }
  ]
}`}</pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>POST /api/download</h2>
        <div className="endpoint-line"><span className="method-badge">POST</span><span>{url}/download</span></div>
        <div className="code-block">
          <pre>{`{
  "url": "https://example.com/video",
  "format": "mp4",
  "quality": "original"
}`}</pre>
        </div>
        <h3>Response</h3>
        <div className="code-block">
          <pre>{`HTTP/1.1 200 OK
Content-Type: video/mp4
Content-Disposition: attachment; filename="m-tube-download.mp4"

<binary file body streamed from @media-downloaders/v2>`}</pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>Errors</h2>
        <table className="doc-table">
          <thead><tr><th>Code</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td>INVALID_URL</td><td>The URL provided is not a valid, safe web address.</td></tr>
            <tr><td>BLOCKED_HOST</td><td>The URL targets a private/internal address and was rejected (SSRF protection).</td></tr>
            <tr><td>VALIDATION_ERROR</td><td>The request body failed schema validation.</td></tr>
            <tr><td>RATE_LIMITED</td><td>Too many requests from this client.</td></tr>
            <tr><td>UNSUPPORTED_URL</td><td>The downloader does not support this source URL.</td></tr>
            <tr><td>DOWNLOAD_FAILED</td><td>The source could not produce a verified non-empty file.</td></tr>
            <tr><td>METADATA_UNAVAILABLE</td><td>The real title or thumbnail could not be fetched.</td></tr>
            <tr><td>DOWNLOAD_STATUS_UNAVAILABLE</td><td>Downloads stream directly; no server-side job status is stored.</td></tr>
            <tr><td>SERVER_ERROR</td><td>An unexpected error occurred.</td></tr>
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h2>Rate Limits</h2>
        <p>Requests are limited per client IP (in-memory, best-effort per warm instance). No API key is required, so this is the primary abuse-protection layer alongside SSRF/URL validation.</p>
      </section>

      <section className="doc-section">
        <h2>Examples</h2>
        <div className="code-tabs">
          {["js", "node", "python", "curl"].map((l) => (
            <button key={l} className={`code-tab-btn${lang === l ? " active" : ""}`} onClick={() => setLang(l)}>
              {{ js: "JavaScript", node: "Node.js", python: "Python", curl: "cURL" }[l]}
            </button>
          ))}
        </div>
        <div className="code-block">
          <button className="copy-code-btn" onClick={() => copy(examples[lang])}>Copy</button>
          <pre>{examples[lang]}</pre>
        </div>
      </section>
    </div>
  );
}
