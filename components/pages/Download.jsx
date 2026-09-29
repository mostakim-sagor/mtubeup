"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MTubeAPI } from "@/lib/api";
import { MStorage } from "@/lib/storage";
import { pageHref } from "@/lib/config";

export default function Download() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const src = searchParams.get("src") || "";

  const [inputUrl, setInputUrl] = useState(src);
  const [status, setStatus] = useState(src ? "loading" : "idle"); // idle | loading | ready | unavailable | error
  const [info, setInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState("video");
  const [quality, setQuality] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (src) fetchInfo(src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  async function fetchInfo(url) {
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await MTubeAPI.getInfo(url);
      if (data.success === false) {
        setStatus("unavailable");
        setErrorMsg(data.error || "This link is not supported by the downloader.");
        return;
      }
      setInfo(data);
      const firstFormat = (data.formats || []).find((f) => f.type === "video") || data.formats?.[0];
      setMode(firstFormat?.type || "video");
      setQuality(firstFormat?.quality || "");
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Unable to process this URL.");
    }
  }

  function handleAnalyze() {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    router.push(`/?download&src=${encodeURIComponent(trimmed)}`);
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const result = await MTubeAPI.requestDownload(src, "mp4", quality || "original");
      const objectUrl = URL.createObjectURL(result.blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = result.filename;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);

      MStorage.addFinished({
        id: `download_${Date.now()}`,
        title: info?.title || "Download",
        thumbnail: info?.thumbnail || null,
        platform: info?.platform || "Unknown",
        format: "video",
        quality: "original",
        downloadUrl: null,
        sizeLabel: `${(result.size / (1024 * 1024)).toFixed(1)} MB`,
        completedAt: Date.now()
      });
      router.push(pageHref("finished"));
    } catch (err) {
      setErrorMsg(err.message || "Download failed to start.");
      setStatus("download-unavailable");
    } finally {
      setDownloading(false);
    }
  }

  const formats = info?.formats || [];
  const videoFormats = formats.filter((f) => f.type === "video");
  const audioFormats = formats.filter((f) => f.type === "audio");
  const activeFormats = mode === "audio" ? audioFormats : videoFormats;

  return (
    <div className="container">
      {/* No URL yet: show an input so this page also works when opened directly */}
      {status === "idle" && (
        <div className="card card-pad" style={{ maxWidth: 480, margin: "20px auto" }}>
          <label className="field-label" htmlFor="dlUrl">Paste Video URL</label>
          <div className="input-row">
            <input id="dlUrl" type="url" placeholder="Paste video URL here…" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAnalyze()} />
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={handleAnalyze}>Analyze</button>
        </div>
      )}

      {status === "loading" && (
        <div className="video-detail-layout">
          <div className="card card-pad">
            <div className="skeleton" style={{ height: 220, borderRadius: 14, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 16, width: "70%", marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 12, width: "40%" }} />
          </div>
          <div className="card card-pad">
            <div className="skeleton" style={{ height: 40, marginBottom: 14 }} />
            <div className="skeleton" style={{ height: 52, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 52 }} />
          </div>
        </div>
      )}

      {(status === "unavailable" || status === "error" || status === "download-unavailable") && (
        <div className="card error-state" style={{ maxWidth: 460, margin: "20px auto" }}>
          <div className="error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <h3>{status === "unavailable" ? "Download unavailable" : "Something went wrong"}</h3>
          <p>{errorMsg}</p>
          {status === "unavailable" && <p className="muted" style={{ fontSize: 12.5 }}>Check the link and try a supported platform.</p>}
          <Link href="/~" className="btn btn-primary">Back to Home</Link>
        </div>
      )}

      {status === "ready" && info && (
        <div className="video-detail-layout">
          <div>
            <div className="card" style={{ overflow: "hidden" }}>
              <div className="hero-video-preview" style={{ borderRadius: 0 }}>
                {info.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={info.thumbnail} alt={info.title} />
                ) : (
                  <div className="play-badge"><span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></div>
                )}
              </div>
              <div className="card-pad">
                {info.isMock && <span className="badge-mock" style={{ marginBottom: 8 }}>Demo data</span>}
                <h1 style={{ fontSize: 17 }}>{info.title}</h1>
                <div className="video-meta">
                  <div className="meta-line">
                    <span className="tag">{info.platform}</span>
                    {info.uploader && <span>{info.uploader}</span>}
                  </div>
                </div>
              </div>
            </div>
            <Link href="/~" className="btn btn-secondary btn-block" style={{ marginTop: 14 }}>Download Another</Link>
          </div>

          <div className="card card-pad" style={{ position: "sticky", top: "calc(var(--header-h) + 16px)" }}>
            <label className="field-label">Format</label>
            <div className="tabs" role="tablist">
              <button className={`tab-btn${mode === "video" ? " active" : ""}`} onClick={() => setMode("video")} disabled={!videoFormats.length}>Video</button>
              <button className={`tab-btn${mode === "audio" ? " active" : ""}`} onClick={() => setMode("audio")} disabled={!audioFormats.length}>Audio</button>
            </div>

            <label className="field-label" style={{ marginTop: 18 }}>Choose Quality</label>
            {activeFormats.length === 0 ? (
              <p className="muted" style={{ fontSize: 13 }}>No {mode} formats were reported by the provider.</p>
            ) : (
              <div className="quality-list">
                {activeFormats.map((f) => (
                  <div key={f.quality} className={`quality-option${quality === f.quality ? " selected" : ""}`} onClick={() => setQuality(f.quality)} role="radio" aria-checked={quality === f.quality} tabIndex={0}>
                    <div className="quality-option-left">
                      <span className="radio-dot" />
                      <span className="quality-label">{f.quality}{f.container ? ` (${f.container})` : ""}</span>
                    </div>
                    <span className="quality-size">{f.sizeLabel || ""}</span>
                  </div>
                ))}
              </div>
            )}

            <button className={`btn btn-primary btn-block${downloading ? " btn-loading" : ""}`} style={{ marginTop: 18 }} onClick={handleDownload} disabled={downloading || !activeFormats.length}>
              <span className="btn-label">Download</span>
            </button>

            <div className="notice-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <span>Only download content you have permission to download and use.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
